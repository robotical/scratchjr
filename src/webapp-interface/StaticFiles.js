import path from "path-browserify";

export default class StaticFiles {
  static arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  static async readFile(filePath) {
    if (!filePath || filePath === "")
      throw new Error("File path cannot be null or empty");
    try {
      const response = await fetch(filePath);
      return response.arrayBuffer();
    } catch (e) {
      console.log("Something went wrong with file:", filePath, "error =>", e);
      return "";
    }
  }

  static async getFilenameFromStaticFiles(file, directory) {
    // if the filename is null throw
    if (!file || file === "") throw new Error("File cannot be null or empty");
    if (!__dirname || __dirname === "")
      throw new Error("Application dir is empty");

    const appRoot = path.join("", directory);

    // join on the application directory
    const filePath = path.join(appRoot, file);

    // check if the file exists
    const exists = await StaticFiles.fileExists(filePath);

    if (exists) {
      return filePath;
    }

    // console.log(filePath, "file does not exist.");

    // if not return null.
    return null;
  }

  static async fileExists(filePath) {
    try {
      var http = new XMLHttpRequest();
      http.open('HEAD', filePath, false);
      http.send();
      return http.status!=404;
    } catch (e) {
      console.log("File", filePath, "doesnt exist.", e);
      return false;
    }
  }
}
