import DatabaseManager from "./DatabaseManager";
import crypto from "crypto-js";
import { readdir, mkdir } from "fs-web";
import path from "path-browserify";

export default class ScratchJRDataStore {
  constructor() {
    /** Cache of key to base64-encoded media value */
    this.mediaStrings = {};
  }

  /** gets an md5 checksum of the data passed in.
        @param {object} data
    */
  getMD5(data) {
    // eslint-disable class-methods-use-this
    const hash = crypto.MD5(data);
    return hash.toString(crypto.enc.Hex);
  }

  async getDatabaseManager() {
    if (!this.databaseManager) {
      const scratchFolder = await ScratchJRDataStore.getScratchJRFolder();
      const scratchDBPath = path.join(scratchFolder, "scratchjr.sqllite");
      this.databaseManager = new DatabaseManager(scratchDBPath, scratchFolder);
      await this.databaseManager.init();
      console.log("DatabaseManager created");
    }
    return this.databaseManager;
  }

  /** returns whether there is a scratchjr.sqllite.restore in the Documents/ScratchJR folder */
  async hasRestoreDatabase() {
    const scratchFolder = ScratchJRDataStore.getScratchJRFolder();
    const scratchRestoreDB = path.join(
      scratchFolder,
      "scratchjr.sqllite.restore"
    );
    const files = await readdir(scratchRestoreDB);
    return files.length;
  }

  /** verifies if a file is within the Scratch JR documents folder
        @param {string} fullPath full path to folder
    */
  isInScratchJRFolder(fullPath) {
    if (!fullPath || fullPath.length === 0) return false;
    const testFolder = path.dirname(fullPath);

    const scratchJRPath = ScratchJRDataStore.getScratchJRFolder();
    return scratchJRPath === testFolder;
  }

  isParentFolder(parent, dir) {
    const relative = path.relative(parent, dir);
    return (
      !!relative && !relative.startsWith("..") && !path.isAbsolute(relative)
    );
  }

  /** getScratchJRFolder - returns ScratchJR folder in documents */
  static async getScratchJRFolder() {
    // const documents = app.getPath('documents');
    const documents = "/";
    if (!documents) throw new Error("could not get documents folder");

    const scratchJRPath = path.join(documents, "ScratchJR");
    await this.ensureDir(scratchJRPath);
    return scratchJRPath;
  }
  /** ensureDir ensures folder exists
        @param {string} path

     */

  static async ensureDir(filePath) {
    const files = await readdir(filePath);
    if (files.length) {
      await mkdir(filePath);
    }
  }

  /** save a media string to the cache
        @param {string} key
        @param {string} base64EncodedStr string of audio
     */
  cacheMedia(key, base64EncodedStr) {
    this.mediaStrings[key] = base64EncodedStr;
  }

  /** return a media string from the cache */
  getCachedMedia(key) {
    return this.mediaStrings[key];
  }

  /** remove from media cache */
  removeFromMediaCache(key) {
    if (this.mediaStrings[key]) {
      delete this.mediaStrings.key;
    }
  }

  /** looks for a file inside the database, returns as a base64 encoded string
        @param {string} filename inside of PROJECTFILES table
    */
  async readProjectFileAsBase64EncodedString(filename) {
    const db = await this.getDatabaseManager();
    return db.readProjectFile(filename);
  }

  /** removes a file from the PROJECTFILES table
        @param {string} filename inside of PROJECTFILES table
    */
  async removeProjectFile(filename) {
    const db = await this.getDatabaseManager();
    db.removeProjectFile(filename);
  }

  /** writes a file to database as a base64 encoded string
        @param {string} filename inside of PROJECTFILES table
        @param {string} contents - base64 encoded string
        @param {string} encoding

    */
  async writeProjectFile(file, contents, encoding) {
    const db = await this.getDatabaseManager();
    if (db.saveToProjectFiles(file, contents, encoding)) {
      return file;
    }
    return -1;
  }

  /** gets a file from the app directory - usually CSS or some asset
        @param  {string} file  filename relative to application root
        @param {bool} directory directory the file is in

     */

  async safeGetFilenameInAppDirectory(file, directory) {
    // if the filename is null throw
    if (!file || file === "") throw new Error("File cannot be null or empty");
    if (!__dirname || __dirname === "")
      throw new Error("Application dir is empty");
    
    const appRoot = path.join(__dirname, directory);

    // join on the application directory
    const filePath = path.join(appRoot, file);
    if (!this.isParentFolder(appRoot, filePath)) {
      throw new Error(
        `safe resolve path - file outside app folder.${filePath}`
      );
    }

    // check if the file exists
    const files = await readdir(filePath);

    if (files.length) {
      return filePath;
    }

    console.log('safeGetFilenameInAppDirectory: file does not exist.', directory, file, filePath);


    // if not return null.
    return null;
  }

  async safeGetFilenameFromStaticFiles(file, directory) {
    // if the filename is null throw
    if (!file || file === "") throw new Error("File cannot be null or empty");
    if (!__dirname || __dirname === "")
      throw new Error("Application dir is empty");
    
    const appRoot = path.join(__dirname, directory);

    // join on the application directory
    const filePath = path.join(appRoot, file);
    if (!this.isParentFolder(appRoot, filePath)) {
      throw new Error(
        `safe resolve path - file outside app folder.${filePath}`
      );
    }

    // check if the file exists
    const files = await readdir(filePath);

    if (files.length) {
      return filePath;
    }

    console.log('safeGetFilenameInAppDirectory: file does not exist.', directory, file, filePath);


    // if not return null.
    return null;
  }
}

export const dataStoreInstance = new ScratchJRDataStore();
