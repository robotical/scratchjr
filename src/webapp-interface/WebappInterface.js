import { dataStoreInstance } from "./ScratchJRDataStore";
import { soundManagerInstance } from "./SoundManager";
import path from "path-browserify";

export default class WebappInterface {
  constructor() {}

  static async database_stmt(json) {
    const db = await dataStoreInstance.getDatabaseManager();
    return db.stmt(json);
  }

  static io_registersound(dir, name) {
    soundManagerInstance.io_registersound(name);
  }

  static io_setfile(arg) {
    console.log("io_setfile", arg);
    return dataStoreInstance.writeProjectFile(arg.name, arg.contents, {
      encoding: "utf8",
    });
  }

  static io_getsettings() {
    console.log("io_getsettings");

    try {
      // NSString *choice =[[NSUserDefaults standardUserDefaults] stringForKey:@"debugstate"];
      // return [NSString stringWithFormat: @"%@,%@,%@,%@", [NSHomeDirectory() stringByAppendingPathComponent:@"Documents"],
      // choice, [RecordSound getPermission], [ViewFinder cameraHasPermission]];

      const documents = "/";
      return `${path.join(documents, "ScratchJR")},false,YES,YES`;
    } catch (e) {
      console.log("io_getsettings error", e);
      return null;
    }
  }

  static io_playsound(name) {
    return soundManagerInstance.io_playsound(name);
  }

  static async io_getfile(str) {
    return dataStoreInstance.readProjectFileAsBase64EncodedString(str);
  }

  static async database_query(json) {
    console.log("database_query", json);
    const db = await dataStoreInstance.getDatabaseManager();
    return JSON.stringify(db.query(json));
  }

  static async database_stmt(json) {
    console.log("database_stmt", json);
    const db = await dataStoreInstance.getDatabaseManager();
    return db.stmt(json);
  }

  static io_stopsound(name) {
    console.log("io_stopsound", name);

    let audioElement = soundManagerInstance.currentAudio[name];

    if (audioElement) {
      audioElement.pause();
    }
  }

  static analyticsEvent(category, action, label) {
    console.log("Analytics Event!", category, action, label);
  }

  static scratchjr_cameracheck() {
    console.log("scratchjr_cameracheck");
    return true;
  }

  static deviceName() {
    return "webapp";
  }

  static io_getmd5(data) {
    console.log("io_getmd5");
    try {
      return dataStoreInstance.getMD5(data);
    } catch (e) {
      console.log("io_getmd5 error", e);
      return null;
    }
  }

  static io_setmedianame(encodedData, key, ext) {
    console.log("io_setmedianame", key, ext);
    const filename = `${key}.${ext}`;
    dataStoreInstance.writeProjectFile(filename, encodedData, {
      encoding: "base64",
    });
    return filename;
  }

  static async io_cleanassets(fileType) {
    console.log("cleanAssets - ", fileType);
    const db = await dataStoreInstance.getDatabaseManager();
    if (db) {
      db.cleanProjectFiles(fileType);
    }
    return true;
  }

  static async io_getmedialen(file, key) {
    console.log("io_getmedialen", file, key);

    const encodedStr = await dataStoreInstance.readProjectFileAsBase64EncodedString(
      file
    );
    dataStoreInstance.cacheMedia(key, encodedStr);

    return encodedStr ? encodedStr.length : 0;
  }

  static io_getmediadata(key, offset, length) {
    console.log("io_getmediadata", key, offset, length);

    const mediaString = dataStoreInstance.getCachedMedia(key);

    if (mediaString) {
      try {
        return mediaString.substring(offset, offset + length);
      } catch (e) {
        console.log("error parsing media", e);
      }
      return;
    }
    return null;
  }

  static io_getmediadone(key) {
    console.log("io_getmediadone", key);

    dataStoreInstance.removeFromMediaCache(key);
    return true;
  }

  static io_remove(filename) {
    console.log("io_remove: ", filename);
    dataStoreInstance.removeProjectFile(filename);
    return true;
  }

  static async marty_cmd(json) {
    console.log(json, 'WebappInterface.js', 'line: ', '152');
    return window.mv2.send_REST(json.cmd);
  }
}
