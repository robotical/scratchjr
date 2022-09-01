//////////////////////////////////////////////////
//  Webapp interface functions
//  WebappInterface will be the class defined for all the native function calls
//////////////////////////////////////////////////

import WebappInterface from "../webapp-interface/WebappInterface";

let mediacounter = 0;

export default class Webapp {
  // Database functions
  static async stmt(json, fcn) {
    var result = await WebappInterface.database_stmt(json);
    if (typeof fcn !== "undefined") {
      fcn(result);
    }
  }

  static async query(json, fcn) {
    var result = await WebappInterface.database_query(json);
    if (typeof fcn !== "undefined") {
      fcn(result);
    }
  }

  // marty functions
  static async martyCmd(json, fcn) {
    const result = await WebappInterface.marty_cmd(json);
    console.log(result, "webapp.js", "line: ", "29");
    if (typeof fcn !== "undefined") {
      fcn(result);
    }
  }

  // IO functions
  static cleanassets(ft, fcn) {
    WebappInterface.io_cleanassets(ft);
    fcn();
  }

  static getmedia(file, fcn) {
    mediacounter++;
    var nextStep = async function (file_, key, whenDone) {
      var result = await WebappInterface.io_getmedialen(file_, key);
      Webapp.processdata(key, 0, result, "", whenDone);
    };
    nextStep(file, mediacounter, fcn);
  }

  static getmediadata(key, offset, len, fcn) {
    var result = WebappInterface.io_getmediadata(key, offset, len);
    if (fcn) {
      fcn(result);
    }
  }

  static processdata(key, off, len, oldstr, fcn) {
    if (len == 0) {
      Webapp.getmediadone(key);
      fcn(oldstr);
      return;
    }
    var newlen = len < 100000 ? len : 100000;
    Webapp.getmediadata(key, off, newlen, function (str) {
      Webapp.processdata(key, off + newlen, len - newlen, oldstr + str, fcn);
    });
  }

  static getsettings(fcn) {
    var result = WebappInterface.io_getsettings();
    if (fcn) {
      fcn(result);
    }
  }

  static getmediadone(file, fcn) {
    var result = WebappInterface.io_getmediadone(file);
    if (fcn) {
      fcn(result);
    }
  }

  static async setmedia(str, ext, fcn) {
    var result = await WebappInterface.io_setmedia(str, ext);
    if (fcn) {
      fcn(result);
    }
  }

  static async setmedianame(str, name, ext, fcn) {
    var result = await WebappInterface.io_setmedianame(str, name, ext);
    if (fcn) {
      fcn(result);
    }
  }

  static getmd5(str, fcn) {
    var result = WebappInterface.io_getmd5(str);
    if (fcn) {
      fcn(result);
    }
  }

  static remove(str, fcn) {
    var result = WebappInterface.io_remove(str);
    if (fcn) {
      fcn(result);
    }
  }

  static async getfile(str, fcn) {
    var result = await WebappInterface.io_getfile(str);
    if (fcn) {
      fcn(result);
    }
  }

  static setfile(name, str, fcn) {
    var result = WebappInterface.io_setfile({
      name: name,
      contents: btoa(str),
    });
    if (fcn) {
      fcn(result);
    }
  }

  // Sound functions

  static registerSound(dir, name, fcn) {
    var result = WebappInterface.io_registersound(dir, name);
    if (fcn) {
      fcn(result);
    }
  }

  static playSound(name, fcn) {
    var result = WebappInterface.io_playsound(name);
    if (fcn) {
      fcn(result);
    }
  }

  static stopSound(name, fcn) {
    var result = WebappInterface.io_stopsound(name);
    if (fcn) {
      fcn(result);
    }
  }

  // Web Wiew delegate call backs

  static sndrecord(fcn) {
    var result = WebappInterface.recordsound_recordstart();
    if (fcn) {
      fcn(result);
    }
  }

  static recordstop(fcn) {
    var result = WebappInterface.recordsound_recordstop();
    if (fcn) {
      fcn(result);
    }
  }

  static volume(fcn) {
    var result = WebappInterface.recordsound_volume();
    if (fcn) {
      fcn(result);
    }
  }

  static startplay(fcn) {
    var result = WebappInterface.recordsound_startplay();
    if (fcn) {
      fcn(result);
    }
  }

  static stopplay(fcn) {
    var result = WebappInterface.recordsound_stopplay();
    if (fcn) {
      fcn(result);
    }
  }

  static recorddisappear(b, fcn) {
    var result = WebappInterface.recordsound_recordclose(b);
    if (fcn) {
      fcn(result);
    }
  }

  // camera functions

  static hascamera() {
    return WebappInterface.scratchjr_cameracheck();
  }

  static startfeed(data, fcn) {
    var str = JSON.stringify(data);
    var result = WebappInterface.scratchjr_startfeed(str);
    if (fcn) {
      fcn(result);
    }
  }

  static stopfeed(fcn) {
    var result = WebappInterface.scratchjr_stopfeed();
    if (fcn) {
      fcn(result);
    }
  }

  static choosecamera(mode, fcn) {
    var result = WebappInterface.scratchjr_choosecamera(mode);
    if (fcn) {
      fcn(result);
    }
  }

  static captureimage(fcn) {
    WebappInterface.scratchjr_captureimage(fcn);
  }

  static hidesplash(fcn) {
    // just call funct, splash is hidden in native code
    if (fcn) {
      fcn();
    }
  }

  ///////////////
  // Sharing
  ///////////////

  // Called on the JS side to trigger native UI for project sharing.
  // fileName: name for the file to share
  // emailSubject: subject text to use for an email
  // emailBody: body HTML to use for an email
  // shareType: 0 for Email; 1 for Airdrop
  // b64data: base-64 encoded .SJR file to share

  static sendSjrToShareDialog(
    fileName,
    emailSubject,
    emailBody,
    shareType,
    b64data
  ) {
    WebappInterface.sendSjrUsingShareDialog(
      fileName,
      emailSubject,
      emailBody,
      shareType,
      b64data
    );
  }

  // // Called on the Objective-C side.  The argument is a base64-encoded .SJR file,
  // // to be unzipped, processed, and stored.
  // static loadProjectFromSjr (b64data) {
  //     try {
  //         IO.loadProjectFromSjr(b64data);
  //     } catch (err) {
  //         var errorMessage = 'Couldn\'t load share -- project data corrupted. ' + err.message;
  //         Alert.open(gn('frame'), gn('frame'), errorMessage, '#ff0000');
  //         console.log(err); // eslint-disable-line no-console
  //         return 0;
  //     }
  //     return 1;
  // }

  // Name of the device/iPad to display on the sharing dialog page
  // fcn is called with the device name as an arg
  static deviceName(fcn) {
    fcn(WebappInterface.deviceName());
  }

  static analyticsEvent(category, action, label) {
    WebappInterface.analyticsEvent(category, action, label);
  }

  static setAnalyticsPlacePref(preferredPlace) {
    WebappInterface.setAnalyticsPlacePref(preferredPlace);
  }

  static setAnalyticsPref(key, value) {
    WebappInterface.setAnalyticsPref(key, value);
  }

  static registerLibraryAssets(version, assets, fcn) {
    WebappInterface.registerLibraryAssets(version, assets);
    fcn && fcn();
  }

  static libraryHasAsset(md5) {
    return WebappInterface.libraryHasAsset(md5);
  }

  static duplicateAsset(folder, name, fcn) {
    console.log(folder, name);
    fcn && fcn();
  }

  // // Web Wiew delegate call backs
  //
  // static pageError (desc) {
  //     console.log('XCODE ERROR:', desc); // eslint-disable-line no-console
  //     if (window.location.href.indexOf('home.html') > -1) {
  //         if (Lobby.errorTimer) {
  //             Lobby.errorLoading(desc);
  //         }
  //     }
  // }
}

// // Expose Webapp methods for ScratchJr tablet sharing callbacks
// window.Webapp = Webapp;
