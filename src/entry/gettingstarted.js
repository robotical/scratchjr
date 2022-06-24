import goToLink from '../utils/goToLink';
import {gn, isiOS, getUrlVars} from '../utils/lib';

let place;

export function gettingStartedMain () {
    gn('closeHelp').onclick = gettingStartedCloseMe;
    gn('closeHelp').ontouchstart = gettingStartedCloseMe;
    var videoObj = gn('myVideo');
    if (isiOS) {
        // On iOS we can load from server
        videoObj.src = 'assets/lobby/intro.mp4';
    } else {
        videoObj.src = 'assets/lobby/intro.mp4';
        
        // // On Android we need to copy to a temporary directory first:
        // setTimeout(function () {
        //     videoObj.type = 'video/mp4';
        //     videoObj.src = AndroidInterface.scratchjr_getgettingstartedvideopath();
        // }, 1000);
    }
    videoObj.poster = 'assets/lobby/poster.png';

    var urlvars = getUrlVars();
    place = urlvars['place'];
    document.ontouchmove = function (e) {
        e.preventDefault();
    };
}


function gettingStartedCloseMe () {
    goToLink('home.html?place=' + place);
}
