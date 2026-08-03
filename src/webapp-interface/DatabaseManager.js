import initSqlJs from "sql.js";
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";
import { readdir, writeFile, readFile } from "fs-web";

const SCRATCH_JR_DB_NAME_LOCAL_STORAGE = "scratchjrDb";
const DEVICE_LOCAL_STORAGE_OUT_OF_SYNC_KEY = "scratchjrDeviceLocalStorageOutOfSync";

export default class DatabaseManager {
  constructor(databaseFilename, databaseDir) {
    this.databaseFilename = databaseFilename;
    this.databaseDir = databaseDir;
    this.saveQueue = Promise.resolve();
  }

  async init() {
    const files = await readdir(this.databaseDir);
    let dbExists = false;
    for (const file of files) {
      if (file.path === this.databaseFilename) {
        dbExists = true;
        break;
      }
    }

    const isPhoneApp = window.applicationManager && window.applicationManager.isPhoneApp();
    // A failed native write leaves the filesystem copy as the only known-current snapshot.
    const filesystemIsNewer = dbExists && this.isDeviceLocalStorageOutOfSync();
    let deviceLoadAttempted = false;
    const openDeviceCopy = async () => {
      deviceLoadAttempted = true;
      console.log("looking for db in device local storage...");
      const localStorageBuffer = await this.getFromDeviceLocalStorage();
      if (localStorageBuffer && localStorageBuffer.byteLength > 10) {
        console.log("opening from local storage...");
        await this.openFromLocalStorage(localStorageBuffer);
      }
    };
    if (isPhoneApp && !filesystemIsNewer) {
      await openDeviceCopy();
    }

    if (!this.isOpen() && dbExists) {
      console.log("db exists, opening...")
      await this.open();
    }

    // A corrupt authoritative filesystem copy is still preferable to data
    // destruction. Try the older native mirror as recovery before giving up.
    if (!this.isOpen() && isPhoneApp && !deviceLoadAttempted) {
      await openDeviceCopy();
    }

    if (!this.isOpen() && dbExists) {
      throw new Error("Existing ScratchJr database could not be opened");
    }

    let createdNewDatabase = false;
    if (!this.isOpen()) {
      console.log("neither local storage nor the filesystem had a db, creating new db...");
      await this.initTables();
      createdNewDatabase = true;
    }

    this.runMigrations();
    if (createdNewDatabase) {
      const initialData = this.db.export();
      await writeFile(this.databaseFilename, initialData.buffer);
    }
    // The in-memory database is ready for use even when the native mirror is
    // temporarily unavailable. Keep the initial snapshot in the normal queue,
    // but do not let a mirror outage prevent the editor from loading.
    this.save().catch((error) => {
      console.warn("Initial database snapshot save failed", error);
    });
  }

  /** Opens the databse from local storage buffer */
  async openFromLocalStorage(bufferRaw) {
    if (bufferRaw) {
      try {
        const SQL = await initSqlJs({ locateFile: () => sqlWasm });
        const buffer = new Uint8Array(bufferRaw);
        this.db = new SQL.Database(buffer);
        this.db.handleError = this.handleError;
      } catch (err) {
        console.log(err);
      }
    }
  }


  /** opens the database */
  async open() {
    try {
      const filebuffer = await readFile(this.databaseFilename);
      const buffer = new Uint8Array(filebuffer);
      console.log("opening existing db")
      const SQL = await initSqlJs({ locateFile: () => sqlWasm });
      // Load the db
      this.db = new SQL.Database(buffer);
      this.db.handleError = this.handleError;
    } catch (err) {
      console.log(err);
    }
  }

  /** don't throw if there is a database error */
  handleError(e) {
    console.log(e, "database error");
  }

  /** close the database */
  close() {
    if (this.db) this.db.close();
    this.db = null;
  }

  /** returns if the database has been opened */
  isOpen() {
    return this.db != null;
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  storeArrayBuffer(key, buffer) {
    const base64String = this.arrayBufferToBase64(buffer);
    localStorage.setItem(key, base64String);
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
          resolve(reader.result);
        };
      } catch (e) {
        reject(e);
      }
    });
  }

  /** saves the database to the file specified in this.databaseFilename */
  async save() {
    const savePromise = this.saveQueue
      .catch(() => undefined)
      .then(async () => {
        const data = this.db.export();
        const buffer = data.buffer;
        const saveOperations = [writeFile(this.databaseFilename, buffer)];
        let deviceLocalStorageSave;
        try {
          deviceLocalStorageSave = this.saveToDeviceLocalStorage(buffer);
        } catch (error) {
          deviceLocalStorageSave = Promise.reject(error);
        }
        if (deviceLocalStorageSave !== null && deviceLocalStorageSave !== undefined) {
          saveOperations.push(
            Promise.resolve(deviceLocalStorageSave).then((result) => {
              if (result !== true) {
                throw new Error("Device local storage save failed");
              }
              this.clearDeviceLocalStorageOutOfSync();
              return result;
            }).catch((error) => {
              this.markDeviceLocalStorageOutOfSync();
              throw error;
            })
          );
        }

        // Promise.all is intentionally fed operations that always resolve so
        // the queue is not released while a sibling write is still running.
        const outcomes = await Promise.all(saveOperations.map((operation) => {
          return Promise.resolve(operation).then(
            () => ({ succeeded: true }),
            (error) => ({ error, succeeded: false })
          );
        }));
        const failedOperation = outcomes.find((outcome) => !outcome.succeeded);
        if (failedOperation) {
          if (failedOperation.error instanceof Error) {
            throw failedOperation.error;
          }
          throw new Error(String(failedOperation.error || "Database snapshot save failed"));
        }
      });

    this.saveQueue = savePromise;
    this.lastSavePromise = savePromise;
    await savePromise;
  }

  saveToDeviceLocalStorage(buffer) {
    if (window.applicationManager && window.applicationManager.isPhoneApp()) {
      // This write-ahead marker closes the teardown/crash window between the
      // filesystem write and the native bridge response.
      this.markDeviceLocalStorageOutOfSync();
      const base64String = this.arrayBufferToBase64(buffer);
      return window.applicationManager.saveFileOnDeviceLocalStorage('scratchjr', SCRATCH_JR_DB_NAME_LOCAL_STORAGE, base64String);
    }
    return null;
  }

  isDeviceLocalStorageOutOfSync() {
    if (this.deviceLocalStorageOutOfSync === true) {
      return true;
    }
    try {
      if (!window.localStorage) {
        return true;
      }
      return window.localStorage.getItem(DEVICE_LOCAL_STORAGE_OUT_OF_SYNC_KEY) === "true";
    } catch (error) {
      // If the marker cannot be read, prefer the filesystem rather than risk
      // replacing it with an older native snapshot.
      return true;
    }
  }

  markDeviceLocalStorageOutOfSync() {
    this.deviceLocalStorageOutOfSync = true;
    try {
      if (window.localStorage) {
        window.localStorage.setItem(DEVICE_LOCAL_STORAGE_OUT_OF_SYNC_KEY, "true");
      }
    } catch (error) {
      console.warn("Failed to mark device local storage as out of sync", error);
    }
  }

  clearDeviceLocalStorageOutOfSync() {
    try {
      if (window.localStorage) {
        window.localStorage.removeItem(DEVICE_LOCAL_STORAGE_OUT_OF_SYNC_KEY);
      }
      this.deviceLocalStorageOutOfSync = false;
    } catch (error) {
      console.warn("Failed to clear the device local storage sync marker", error);
    }
  }

  async getFromDeviceLocalStorage() {
    // if we are on a the phone app, load the database from local storage
    if (window.applicationManager && window.applicationManager.isPhoneApp()) {
      try {
        const response = await window.applicationManager.loadFileFromDeviceLocalStorage('scratchjr', SCRATCH_JR_DB_NAME_LOCAL_STORAGE);
        const base64String = response;
        if (base64String) {
          return this.base64ToArrayBuffer(base64String);
        } else {
          return null;
        }
      } catch (e) {
        console.log("failed to load from local storage:", e);
        return null;
      }
    }
  }

  /** removes all unused files of a specific filetype, e.g. unused svg files
          @param {string} fileType  note will be of format "wav" - not ".wav"
      */
  async cleanProjectFiles(fileType) {
    // we don't use wav files, so translate that to webm.
    if (fileType === "wav") {
      fileType = "webm";
    }

    const queryListAllFilesWithExtension = {
      stmt: `select MD5 FROM PROJECTFILES WHERE MD5 LIKE "%.${fileType}"`,
    };

    const allProjectFilesWithExtension = this.query(
      queryListAllFilesWithExtension
    );

    for (let i = 0; i < allProjectFilesWithExtension.length; i++) {
      const currentFileToCheck = allProjectFilesWithExtension[i].MD5;

      if (!currentFileToCheck) continue;

      console.log("checking if in use: ", currentFileToCheck);

      const queryFindFileInProjects = {
        stmt: `select ID from PROJECTS where json like "%${currentFileToCheck}%"`,
      };

      // search in the JSON field of the PROJECTS table
      const projectJSON = this.query(queryFindFileInProjects);
      if (projectJSON.length > 0) {
        console.log("...project is currently using: ", currentFileToCheck);
        continue; // we don't need to keep checking this file, it is being used
      }

      // search in the usershapes table
      const queryFindFileInUsershapes = {
        stmt: `select MD5 from USERSHAPES where MD5 = "${currentFileToCheck}"`,
      };

      const shapeFiles = this.query(queryFindFileInUsershapes);
      if (shapeFiles.length > 0) {
        console.log(
          "...user shapes is using: ",
          currentFileToCheck,
          shapeFiles
        );
        continue; // we don't need to keep checking this file, it is being used
      }

      // search in the userbackgrounds table
      const queryFindFileInUserbkgs = {
        stmt: `select MD5 from USERBKGS where MD5 = "${currentFileToCheck}"`,
      };
      const bkgFiles = this.query(queryFindFileInUserbkgs);
      if (bkgFiles.length > 0) {
        console.log(
          "...user backgrounds is using: ",
          currentFileToCheck,
          bkgFiles
        );
        continue; // we don't need to keep checking this file, it is being used
      }

      // if the file is not being used, remove it
      console.log("...not in use, removing: ", currentFileToCheck);

      await this.removeProjectFile(currentFileToCheck);
    }
  }

  async removeProjectFile(fileMD5) {
    const json = {};
    json.cond = "MD5 = ?";
    json.items = ["CONTENTS"];
    json.values = [fileMD5];
    const table = "PROJECTFILES";

    json.stmt = `delete from ${table} where ${json.cond}`;

    this.query(json);

    await this.save(); // flush the database to disk.
    return true;
  }
  /** loads a file from the PROJECTFILES table
          @param {string} fileMD5 filename
      */
  readProjectFile(fileMD5) {
    const json = {};
    json.cond = "MD5 = ?";
    json.items = ["CONTENTS"];
    json.values = [fileMD5];
    const table = "PROJECTFILES";

    json.stmt = `select ${json.items} from ${table} where ${json.cond}${json.order ? ` order by ${json.order}` : ""
      }`;
    const rows = this.query(json);

    if (rows.length > 0) {
      return rows[0].CONTENTS;
    }
    return null;
  }

  async saveToProjectFiles(fileMD5, content) {
    const json = {};
    const keylist = ["md5", "contents"];
    const values = "?,?";
    json.values = [fileMD5, content];
    json.stmt = `insert into projectfiles (${keylist.toString()}) values (${values})`;
    var insertSQLResult = this.stmt(json);

    await this.save(); // flush the database to disk.

    return insertSQLResult >= 0;
  }

  /** returns a key value pairing of the database result */
  getRowData(res) {
    return res.getAsObject();
  }

  /** initialize the ScratchJR database.
      The Electron version has one more table which is PROJECTFILES
      This helps us store all the files in one database which can be easily saved/restored.
      */
  async initTables() {
    if (this.db) throw new Error("database already created");
    const SQL = await initSqlJs({ locateFile: () => sqlWasm });
    this.db = new SQL.Database();
    this.db.handleError = this.handleError;

    console.log("making tables...");
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS PROJECTS (ID INTEGER PRIMARY KEY AUTOINCREMENT, CTIME DATETIME DEFAULT CURRENT_TIMESTAMP, MTIME DATETIME, ALTMD5 TEXT, POS INTEGER, NAME TEXT, JSON TEXT, THUMBNAIL TEXT, OWNER TEXT, GALLERY TEXT, DELETED TEXT, VERSION TEXT)\n"
    );
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS USERSHAPES (ID INTEGER PRIMARY KEY AUTOINCREMENT, CTIME DATETIME DEFAULT CURRENT_TIMESTAMP, MD5 TEXT, ALTMD5 TEXT, WIDTH TEXT, HEIGHT TEXT, EXT TEXT, NAME TEXT, OWNER TEXT, SCALE TEXT, VERSION TEXT)\n"
    );
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS USERBKGS (ID INTEGER PRIMARY KEY AUTOINCREMENT, CTIME DATETIME DEFAULT CURRENT_TIMESTAMP, MD5 TEXT, ALTMD5 TEXT, WIDTH TEXT, HEIGHT TEXT, EXT TEXT, OWNER TEXT,  VERSION TEXT)\n"
    );

    this.db.exec(
      "CREATE TABLE IF NOT EXISTS PROJECTFILES (MD5 TEXT PRIMARY KEY, CONTENTS TEXT)\n"
    );
  }

  clearTables() {
    this.db.exec("DELETE FROM PROJECTS");
    this.db.exec("DELETE FROM USERSHAPES");
    this.db.exec("DELETE FROM USERBKGS");
  }
  runMigrations() {
    try {
      this.db.exec("ALTER TABLE PROJECTS ADD COLUMN ISGIFT INTEGER DEFAULT 0");
    } catch (e) {
      console.log("failed to migrate tables", e);
    }
  }

  /**
      runs a sql query on the database, returns the number of rows from the result
      @param {json} json object with stmt and values filled out
      @returns lastRowId
      */
  stmt(jsonStrOrJsonObj) {
    try {
      // {"stmt":"select name,thumbnail,id,isgift from projects where deleted = ? AND version = ? AND gallery IS NULL order by ctime desc","values":["NO","iOSv01"]}

      // if it's a string, parse it.  if not, use it if it's not null.
      const json =
        typeof jsonStrOrJsonObj === "string"
          ? JSON.parse(jsonStrOrJsonObj)
          : jsonStrOrJsonObj || {};
      const stmt = json.stmt;
      const values = json.values;

      console.log("DatabaseManager executing stmt", stmt, values);

      const statement = this.db.prepare(stmt, values);

      while (statement.step()) statement.get();
      // return JSON.stringify(statement.getAsObject());

      const result = this.db.exec("select last_insert_rowid();");

      const lastRowId = result[0].values[0][0];

      return lastRowId;
    } catch (e) {
      console.log("stmt failed", jsonStrOrJsonObj, e);

      return -1;
    }
  }

  /**
      runs a sql query on the database, returns the results of the SQL statment
      @param {json} json object with stmt and values filled out - can be a string or object
   
      @returns lastRowId
      */
  query(jsonStrOrJsonObj) {
    try {
      // if it's a string, parse it.  if not, use it if it's not null.
      const json =
        typeof jsonStrOrJsonObj === "string"
          ? JSON.parse(jsonStrOrJsonObj)
          : jsonStrOrJsonObj || {};

      const stmt = json.stmt;
      const values = json.values;
      const statement = this.db.prepare(stmt, values);

      const rows = [];
      while (statement.step()) {
        rows.push(statement.getAsObject());
      }

      return rows;
    } catch (e) {
      console.log("query failed", jsonStrOrJsonObj, e);

      return [];
    }
  }
}
