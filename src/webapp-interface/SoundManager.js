import { dataStoreInstance } from "./ScratchJRDataStore";
import path from "path-browserify";
import StaticFiles from "./StaticFiles";
import OS from "../tablet/OS";

export default class SoundManager {
  constructor() {
    this.currentAudio = {};
  }

  async io_registersound(name) {
    if (!this.currentAudio[name]) {
      const dataUri = await this.io_getAudioData(name);
      this.loadSoundFromDataURI(name, dataUri);
    }
  }

  async io_getAudioData(audioName) {
    // console.log("io_getAudioData - looking for", audioName);

    // try fishing out of the app directory first - pig.wav
    let filePath = await StaticFiles.getFilenameFromStaticFiles(audioName, "");

    if (!filePath) {
      // if not pull from the sounds directory
      filePath = await StaticFiles.getFilenameFromStaticFiles(
        audioName,
        "sounds"
      );
    }

    if (!filePath) {
      // if not pull from the scratch document folder.
      console.log("...trying to look in the PROJECTFILE table", audioName);

      // this is already stored as a string, we do not need to convert it
      let projectDBFile = await dataStoreInstance.readProjectFileAsBase64EncodedString(
        audioName
      );
      console.log("...WARNING: unable to find: ", audioName);
      return projectDBFile;
    }

    const data = await StaticFiles.readFile(filePath);
    if (!data) {
      console.log(
        "io_getAudioData - could not find on disk",
        audioName,
        filePath
      );
      return null;
    }
    const dataStr = StaticFiles.arrayBufferToBase64(data);
    const extension = path.extname(filePath);
    if (extension === ".mp3") {
      return `data:audio/mp3;base64,${dataStr}`;
    } else if (extension === ".wav") {
      return `data:audio/wav;base64,${dataStr}`;
    } else {
      return null;
    }
  }

  loadSoundFromDataURI(name, dataUri) {
    if (dataUri && name) {
      let audio = new window.Audio(dataUri);
      audio.volume = 0.8; // don't oversaturate the speakers
      audio.onended = function () {
        // we need to tell ScratchJR the sound is done
        // so that it will progress to the next block.
        OS.soundDone(name); // eslint-disable-line no-undef
      };
      this.currentAudio[name] = audio;
    }
  }


  async io_playsound(name) {
    if (!this.playSoundStartTime) {
      this.playSoundStartTime = new Date();
    }
    console.log("io_playsound", name);

    let audioElement = this.currentAudio[name];
    if (!audioElement) {
      // if there is no audio element it might mean that 
      // there sounds haven't loaded yet because of asynchronous 
      // process. So we will try for a few seconds and then quit.
      const timePassed = this.playSoundStartTime.getTime() - new Date().getTime();
      if (timePassed < 2000) {
        // busy wait to not overload the app
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.io_playsound(name);
      }
      this.playSoundStartTime = null;
      console.log(
        "io_playsound: unable to play unregistered sound - skipping",
        name
      );
      console.log(this.currentAudio);
      // tell scratch the empty sound has finished - otherwise
      // the green blocks will not progress
      setTimeout(function () {
        OS.soundDone(name); // eslint-disable-line no-undef
      }, 1);

      return;
    }
    this.playSoundStartTime = null;

    //https://medium.com/@Jeff_Duke_io/working-with-html5-audio-in-electron-645b2d2202bd

    try {
      let playPromise = audioElement.play();
      // In browsers that don’t yet support this functionality,
      // playPromise won’t be defined.
      if (playPromise !== undefined) {
        playPromise
          .then(function () {
            // Automatic playback started!
          })
          .catch(function (error) {
            // Automatic playback failed.
            // Show a UI element to let the user manually start playback.
            console.log("automatic playback failed", error);
          });
      }
    } catch (e) {
      console.log("could not play sound", e);
    }
  }
}

export const soundManagerInstance = new SoundManager();
