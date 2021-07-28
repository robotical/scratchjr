import ScratchJr from '../ScratchJr';
import ScratchAudio from '../../utils/ScratchAudio';
import Grid from '../ui/Grid';
import Vector from '../../geom/Vector';
import {gn} from '../../utils/lib';
import OS from '../../tablet/OS';


let martyInterval = 33;
const intervalToSeconds = 31.25; // runtime tick is set at 32ms by Runtime.js. 32*31.25 = 1s
let tinterval = 1;
let hopList = [-48, -30, -22, -14, -6, 0, 6, 14, 22, 30, 48];

export default class Prims {
    static get hopList () {
        return hopList;
    }

    static init () {
        Prims.table = {};
        Prims.table.done = Prims.Done;
        Prims.table.missing = Prims.Ignore;
        Prims.table.onflag = Prims.Ignore;
        Prims.table.onmessage = Prims.Ignore;
        Prims.table.onclick = Prims.Ignore;
        Prims.table.ontouch = Prims.OnTouch;
        Prims.table.onchat = Prims.Ignore;
        Prims.table.repeat = Prims.Repeat;
        Prims.table.getReady = Prims.getReady;
        Prims.table.forward = Prims.Forward;
        Prims.table.back = Prims.Back;
        Prims.table.up = Prims.Up;
        Prims.table.down = Prims.Down;
        Prims.table.left = Prims.Left;
        Prims.table.right = Prims.Right;
        Prims.table.martyDance = Prims.martyDance;
        Prims.table.home = Prims.Home;
        Prims.table.setspeed = Prims.SetSpeed;
        Prims.table.message = Prims.Message;
        Prims.table.setcolor = Prims.SetColor;
        Prims.table.bigger = Prims.Bigger;
        Prims.table.smaller = Prims.Smaller;
        Prims.table.wait = Prims.Wait;
        Prims.table.caretcmd = Prims.Ignore;
        Prims.table.caretstart = Prims.Ignore;
        Prims.table.caretend = Prims.Ignore;
        Prims.table.caretrepeat = Prims.Ignore;
        Prims.table.gotopage = Prims.GotoPage;
        Prims.table.endstack = Prims.DoNextBlock;
        Prims.table.stopall = Prims.StopAll;
        Prims.table.stopmine = Prims.StopMine;
        Prims.table.forever = Prims.Forever;
        Prims.table.hop = Prims.Hop;
        Prims.table.show = Prims.Show;
        Prims.table.hide = Prims.Hide;
        Prims.table.playsnd = Prims.playSound;
        Prims.table.playusersnd = Prims.playSound;
        Prims.table.grow = Prims.Grow;
        Prims.table.shrink = Prims.Shrink;
        Prims.table.same = Prims.Same;
        Prims.table.say = Prims.Say;

        Prims.table.eyesExcited = Prims.eyesExcited;
        Prims.table.eyesWide = Prims.eyesWide;
        Prims.table.eyesAngry = Prims.eyesAngry;
        Prims.table.eyesNormal = Prims.eyesNormal;
        Prims.table.eyesWiggle = Prims.eyesWiggle;

        Prims.table.confusion = Prims.playConfusion;
        Prims.table.disbelief = Prims.playDisbelief;
        Prims.table.excitement = Prims.playExcitement;
        Prims.table.noway = Prims.playNoway;
        Prims.table.no = Prims.playNo;
        Prims.table.whistle = Prims.playWhistle;
    }

    static Done (strip) {
        if (strip.oldblock != null) {
            strip.oldblock.unhighlight();
        }
        strip.oldblock = null;
        strip.isRunning = false;
    }

    static setTime (strip) {
        strip.time = (new Date()) - 0;
    }

    static showTime () {
        //var time = ((new Date()) - strip.time) / 1000;
        // 	ScratchJr.log (strip.thisblock.blocktype, time, "sec") ;
    }

    static DoNextBlock (strip) {
        strip.waitTimer = tinterval * 10;
        strip.thisblock = strip.thisblock.next;
    }

    static StopAll () {
        ScratchJr.stopStrips();
    }

    static StopMine (strip) {
        var spr = strip.spr;
        for (var i = 0; i < ScratchJr.runtime.threadsRunning.length; i++) {
            if ((ScratchJr.runtime.threadsRunning[i].spr == spr)
                 && (ScratchJr.runtime.threadsRunning[i].thisblock != strip.thisblock)) {
                ScratchJr.runtime.threadsRunning[i].stop(true);
            }
        }
        strip.thisblock = strip.thisblock.next;
        ScratchJr.runtime.yield = true;
    }

    static playSound (strip) {
        var b = strip.thisblock;
        var name = b.getSoundName(strip.spr.sounds);
        //	console.log ('playSound', name);
        if (!strip.audio) {
            var snd = ScratchAudio.projectSounds[name];
            if (!snd) {
                strip.thisblock = strip.thisblock.next;
                return;
            }
            strip.audio = snd;
            snd.play();
        //	console.log ("playSound", snd, strip.audio, snd.source.playbackState);
        }
        if (strip.audio && strip.audio.done()) {
            strip.audio.clear();
            strip.thisblock = strip.thisblock.next;
            strip.audio = undefined;
        }
        strip.waitTimer = tinterval * 4;
    }

    static Say (strip) {
        var b = strip.thisblock;
        var s = strip.spr;
        var str = b.getArgValue();
        if (strip.count < 0) {
            strip.count = Math.max(30, Math.round(str.length / 8) * 30); // 7 chars per seconds;
            s.openBalloon(str);
            Prims.setTime(strip);
        } else {
            var count = strip.count;
            count--;
            if (count < 0) {
                strip.count = -1;
                s.closeBalloon();
                Prims.showTime(strip);
                strip.thisblock = strip.thisblock.next;
            } else {
                strip.waitTimer = tinterval;
                strip.count = count;
            }
        }
    }

    static GotoPage (strip) {
        var b = strip.thisblock;
        var n = Number(b.getArgValue());
        if (strip.count < 0) {
            strip.count = 2; // delay for a 10th of a second
            Prims.setTime(strip);
        } else {
            var count = strip.count;
            count--;
            if (count < 0) {
                strip.count = -1;
                Prims.showTime(strip);
                ScratchJr.stage.gotoPage(n);
            } else {
                strip.waitTimer = tinterval;
                strip.count = count;
            }
        }
    }

    static Forever (strip) {
        strip.thisblock = strip.firstBlock.aStart ? strip.firstBlock.next : strip.firstBlock;
        ScratchJr.runtime.yield = true;
    }

    static Repeat (strip) {
        var b = strip.thisblock;
        var n = Number(b.getArgValue());
        if (n < 1) {
            n = 1;
        }
        if (b.repeatCounter < 0) {
            b.repeatCounter = n;
        }
        if (b.repeatCounter == 0) {
            b.repeatCounter = -1;
            strip.thisblock = strip.thisblock.next;
            strip.waitTimer = tinterval;
        } else {
            strip.stack.push(strip.thisblock);
            b.repeatCounter--;
            strip.thisblock = strip.thisblock.inside;
            ScratchJr.runtime.yield = true;
        }
    }

    static Ignore (strip) {
        strip.thisblock = strip.thisblock.next;
    }

    static Wait (strip) {
        var n = strip.thisblock.getArgValue();
        // strip.waitTimer = Math.round(n * 3.125); // thenth of a second
        strip.waitTimer = Math.round(n * 3.125 * 10); // A second
        Prims.setTime(strip);
        strip.thisblock = strip.thisblock.next;
    }

    static Home (strip) {
        var spr = strip.spr;
        spr.goHome();
        strip.waitTimer = tinterval;
        strip.thisblock = strip.thisblock.next;
    }

    static SetSpeed (strip) {
        var s = strip.spr;
        var num = Number(strip.thisblock.getArgValue()); // 0 - 1 - 2
        s.speed = Math.pow(2, num);
        strip.waitTimer = tinterval;
        strip.thisblock = strip.thisblock.next;
    }

    static Hop (strip) {
        if (strip.count < 0) { // setup the hop
            strip.count = hopList.length;
            Prims.setTime(strip);
        }
        Prims.hopTo(strip);
    }

    static hopTo (strip) {
        var s = strip.spr;
        var b = strip.thisblock;
        var n = Number(b.getArgValue());
        var count = strip.count;
        count--;
        if (count < 0) {
            strip.count = -1;
            strip.vector = {
                x: 0,
                y: 0
            };
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            strip.vector = {
                x: 0,
                y: hopList[count]
            };
            var dy = s.ycoor - strip.vector.y / 5 * n;
            if (dy < 0) {
                dy = 0;
            }
            if (dy >= (360 - Grid.size)) {
                dy = (360 - Grid.size);
            }
            s.setPos(s.xcoor + strip.vector.x, dy);
            strip.waitTimer = tinterval + Math.floor(Math.pow(2, 2 - Math.floor(s.speed / 2)) / 2);
            strip.count = count;
        }
    }

    static Down (strip) {
        const martyConnected = ScratchJr.getMartyConnected();
        var s = strip.spr;
        var num = Number(strip.thisblock.getArgValue()) * 24;
        Prims.setTime(strip);

        if (martyConnected){
            const moveTime = 1500;
            let steps = Number(strip.thisblock.getArgValue());
            steps = Math.min(Math.max(steps, 1), 20);
            const stepLength = -25;
            let marty_cmd = `traj/step/${steps}/?moveTime=${moveTime}&stepLength=${stepLength}`;
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000)*steps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        }


        var distance = Math.abs(num);
        if (num == 0) {
            strip.thisblock = strip.thisblock.next;
            strip.waitTimer = tinterval;
            strip.distance = -1;
            strip.vector = {
                x: 0,
                y: 0
            };
            return;
        }
        if (num == 0) {
            strip.distance = 0;
        } else if (strip.distance < 0) {
            strip.distance = distance;
            strip.vector = {
                x: 0,
                y: 2
            };
            Prims.setTime(strip);
        }
        Prims.moveAtSpeed(strip);
    }

    static Up (strip) {
        
        const martyConnected = ScratchJr.getMartyConnected();
        var num = Number(strip.thisblock.getArgValue()) * 24;
        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 1500;
            let steps = Number(strip.thisblock.getArgValue());
            steps = Math.min(Math.max(steps, 1), 20);
            const stepLength = 25;
            let marty_cmd = `traj/step/${steps}/?moveTime=${moveTime}&stepLength=${stepLength}`;
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000)*steps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        }


        var distance = Math.abs(num);
        if (num == 0) {
            strip.thisblock = strip.thisblock.next;
            strip.waitTimer = tinterval;
            strip.distance = -1;
            strip.vector = {
                x: 0,
                y: 0
            };
            return;
        } else if (strip.distance < 0) {
            strip.distance = distance;
            strip.vector = {
                x: 0,
                y: -2
            };
            Prims.setTime(strip);
        }
        Prims.moveAtSpeed(strip);
    }

    static martyDance (strip) {

        const martyConnected = ScratchJr.getMartyConnected();

        console.log('LETS DANCE!!')
        Prims.setTime(strip);

        var num = Number(strip.thisblock.getArgValue()) * 24;

        if (martyConnected){

            const moveTime = 3000;
            let reps = Number(strip.thisblock.getArgValue());
   
            let marty_cmd = `traj/dance/${reps}?moveTime=${moveTime}`;
            
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000)*reps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            // ScratchAudio.sndFX('boing.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    static getReady (strip) {
        console.log('GET READY!!')
        const martyConnected = ScratchJr.getMartyConnected();

        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 3000;
   
            let marty_cmd = `traj/getReady/?moveTime=${moveTime}`;
            
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            // ScratchAudio.sndFX('boing.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }


    // static eyesExcited (strip) {
    //     console.log('Excited Eyes!!');
    //     eyesTraj(strip, 'eyesExcited');
    //     return;
    // }

    // static eyesTraj (strip, eyeCommand) {
    //     console.log('Excited Eyes!!');
    //     const martyConnected = ScratchJr.getMartyConnected();

    //     Prims.setTime(strip);

    //     if (martyConnected){

    //         //this is the movetime set in the .trj file on RIC
    //         const moveTime = 1000;
    //         let marty_cmd = `traj/${eyeCommand}`;
            
    //         console.log(marty_cmd);
    //         OS.martyCmd({ cmd: marty_cmd });
    //         strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
    //         Prims.showTime(strip);
    //         strip.thisblock = strip.thisblock.next;
    //         return;
    //     } else {

    //         strip.thisblock = strip.thisblock.next;
    //         return;
    //     }
    // }

    static eyesExcited (strip) {
        console.log('GET READY!!')
        const martyConnected = ScratchJr.getMartyConnected();

        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 1000;
   
            let marty_cmd = `traj/eyesExcited`;
            
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            // ScratchAudio.sndFX('boing.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    static eyesWide (strip) {
        console.log('Eyes Wide!!')
        const martyConnected = ScratchJr.getMartyConnected();

        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 1000;
   
            let marty_cmd = `traj/eyesWide`;
            
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            // ScratchAudio.sndFX('boing.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    static eyesAngry (strip) {
        console.log('Eyes Wide!!')
        const martyConnected = ScratchJr.getMartyConnected();

        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 1000;
   
            let marty_cmd = `traj/eyesAngry`;
            
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            // ScratchAudio.sndFX('boing.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    static eyesNormal (strip) {
        console.log('Eyes Normal!!')
        const martyConnected = ScratchJr.getMartyConnected();

        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 1000;
   
            let marty_cmd = `traj/eyesNormal`;
            
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            // ScratchAudio.sndFX('boing.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    static eyesWiggle (strip) {
        console.log('Eyes Wiggle!!')
        const martyConnected = ScratchJr.getMartyConnected();
        const reps = Number(strip.thisblock.getArgValue());

        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 2000;
   
            let marty_cmd = `traj/wiggleEyes/${reps}`;
            
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000)*reps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            // ScratchAudio.sndFX('boing.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }


    static Forward (strip) {
        
        const martyConnected = ScratchJr.getMartyConnected();
        var s = strip.spr;
        var num = Number(strip.thisblock.getArgValue()) * 24;
        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 1000;
            let steps = Number(strip.thisblock.getArgValue());
            steps = Math.min(Math.max(steps, 1), 20);
            const stepLength = 25;
            const side = 1;
            let marty_cmd = `traj/sidestep/${steps}/?side=${side}&moveTime=${moveTime}&stepLength=${stepLength}`;
            
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd, steps: num });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000)*steps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
            
        }

        
        var distance = Math.abs(num);
        if (s.flip) {
            s.flip = false;
            s.render();
        }
        if (num == 0) {
            strip.thisblock = strip.thisblock.next;
            strip.waitTimer = tinterval * Math.pow(2, 2 - Math.floor(s.speed / 2));
            strip.vector = {
                x: 0,
                y: 0
            };
            strip.distance = -1;
            return;
        } else if (strip.distance < 0) {
            strip.distance = distance;
            strip.vector = {
                x: 2,
                y: 0
            };
            Prims.setTime(strip);
        }
        Prims.moveAtSpeed(strip);
    }

    static Back (strip) {

        const martyConnected = ScratchJr.getMartyConnected();
        var s = strip.spr;
        var num = Number(strip.thisblock.getArgValue()) * 24;
        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 1000;
            let steps = Number(strip.thisblock.getArgValue());
            steps = Math.min(Math.max(steps, 1), 20);
            const stepLength = 25;
            const side = 0;
            let marty_cmd = `traj/sidestep/${steps}/?side=${side}&moveTime=${moveTime}&stepLength=${stepLength}`;
            
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000)*steps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
            
        }


        var distance = Math.abs(num);
        if (!s.flip) {
            s.flip = true;
            s.render();
        }
        if (num == 0) {
            strip.thisblock = strip.thisblock.next;
            strip.vector = {
                x: 0,
                y: 0
            };
            strip.waitTimer = tinterval * Math.pow(2, 2 - Math.floor(s.speed / 2));
            return;
        }
        if (num == 0) {
            strip.distance = 0;
        } else if (strip.distance < 0) {
            strip.distance = distance;
            strip.vector = {
                x: -2,
                y: 0
            };
            Prims.setTime(strip);
        }
        Prims.moveAtSpeed(strip);
    }

    static moveAtSpeed (strip) {
        var s = strip.spr;
        var distance = strip.distance;
        var num = Number(strip.thisblock.getArgValue()) * 12; // 1/2 cell size since vector is double
        var vector = Vector.scale(strip.vector, s.speed * Math.abs(num) / num);
        distance -= Math.abs(Vector.len(vector));
        if (distance < 0) {
            vector = Vector.scale(strip.vector, strip.distance);
            s.setPos(s.xcoor + vector.x, s.ycoor + vector.y);
            strip.distance = -1;
            strip.vector = {
                x: 0,
                y: 0
            };
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            s.setPos(s.xcoor + vector.x, s.ycoor + vector.y);
            strip.waitTimer = tinterval;
            strip.distance = distance;
        }
    }

    static Right (strip) {
        var num = Number(strip.thisblock.getArgValue()) * 30;
        var s = strip.spr;
        const martyConnected = ScratchJr.getMartyConnected();
        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 1500;
            let steps = Number(strip.thisblock.getArgValue());
            steps = Math.min(Math.max(steps, 1), 20);
            const stepLength = 25;
            let turn = -20;
            let marty_cmd = `traj/step/${steps}/?moveTime=${moveTime}&turn=${turn}&stepLength=1`;
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000)*steps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
            
        }

        if (strip.count < 0) {
            strip.count = Math.floor(Math.abs(num) / s.speed * 0.25);
            strip.angleStep = s.speed * 4 * Math.abs(num) / num;
            strip.finalAngle = s.angle + num;
            strip.finalAngle = strip.finalAngle % 360;
            if (strip.finalAngle < 0) {
                strip.finalAngle += 360;
            }
            if (strip.finalAngle > 360) {
                strip.finalAngle -= 360;
            }
            Prims.setTime(strip);
        }
        Prims.turning(strip);
    }

    static Left (strip) {
        var num = Number(strip.thisblock.getArgValue()) * 30;
        var s = strip.spr;
        const martyConnected = ScratchJr.getMartyConnected();

        Prims.setTime(strip);

        if (martyConnected == true){

            const moveTime = 1500;
            let steps = Number(strip.thisblock.getArgValue());
            steps = Math.min(Math.max(steps, 1), 20);
            let turn = 20;
            let marty_cmd = `traj/step/${steps}/?moveTime=${moveTime}&turn=${turn}&stepLength=1`;
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000)*steps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
            
        }
        
        if (strip.count < 0) {
            strip.count = Math.floor(Math.abs(num) / s.speed * 0.25);
            strip.angleStep = -s.speed * 4 * Math.abs(num) / num;
            strip.finalAngle = s.angle - num;
            strip.finalAngle = strip.finalAngle % 360;
            if (strip.finalAngle < 0) {
                strip.finalAngle += 360;
            }
            if (strip.finalAngle > 360) {
                strip.finalAngle -= 360;
            }
            Prims.setTime(strip);
        }
        Prims.turning(strip);
    }

    static turning (strip) {
        var s = strip.spr;
        var count = strip.count;
        count--;
        if (count < 0) {
            strip.count = -1;
            s.setHeading(strip.finalAngle);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            s.setHeading(s.angle + strip.angleStep);
            strip.waitTimer = tinterval;
            strip.count = count;
        }
    }

    static Same (strip) {
        var s = strip.spr;
        var n = (s.defaultScale - s.scale) / s.defaultScale * 10;
        if (n == 0) {
            strip.waitTimer = tinterval;
            strip.thisblock = strip.thisblock.next;
            strip.count = -1;
            strip.distance = -1;
            if (!strip.firstBlock.aStart) {
                s.homescale = s.defaultScale;
            }
            return;
        }
        if (strip.count < 0) {
            strip.distance = s.defaultScale * Math.abs(n) / n * s.speed;
            strip.count = Math.floor(5 * Math.floor(Math.abs(n)) / s.speed);
            Prims.setTime(strip);
            if (!strip.firstBlock.aStart) {
                s.homescale = s.defaultScale;
            }
        }
        if (strip.count == 0) {
            strip.count = -1;
            s.noScaleFor();
            strip.distance = -1;
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            s.changeSizeBy(strip.distance * 2);
            strip.waitTimer = tinterval;
            strip.count = strip.count - 1;
        }
    }

    static Grow (strip) {
        var s = strip.spr;
        var n = Number(strip.thisblock.getArgValue());
        if (strip.count < 0) {
            strip.distance = Number(s.scale) + (10 * n * s.defaultScale) / 100;
            strip.distance = Math.round(strip.distance * 1000) / 1000;
            strip.count = Math.floor(5 * Math.abs(n) / s.speed);
            Prims.setTime(strip);
        }
        if (strip.count == 0) {
            strip.count = -1;
            s.setScaleTo(strip.distance);
            if (!strip.firstBlock.aStart) {
                s.homescale = s.scale;
            }
            strip.distance = -1;
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            s.changeSizeBy(s.defaultScale * 2 * s.speed * Math.abs(n) / n);
            strip.waitTimer = tinterval;
            strip.count = strip.count - 1;
        }
    }

    static Shrink (strip) {
        var s = strip.spr;
        var n = Number(strip.thisblock.getArgValue());
        if (strip.count < 0) {
            strip.distance = s.scale - (10 * n * s.defaultScale) / 100;
            strip.distance = Math.round(strip.distance * 1000) / 1000;
            strip.count = Math.floor(5 * Math.abs(n) / s.speed);
            Prims.setTime(strip);
        }
        if (strip.count == 0) {
            strip.count = -1;
            s.setScaleTo(strip.distance);
            if (!strip.firstBlock.aStart) {
                s.homescale = s.scale;
            }
            strip.distance = -1;
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            s.changeSizeBy(-s.defaultScale * 2 * s.speed * Math.abs(n) / n);
            strip.waitTimer = tinterval;
            strip.count = strip.count - 1;
        }
    }

    static Show (strip) {
        var s = strip.spr;
        s.shown = true;
        if (strip.count < 0) {
            strip.count = s.speed == 4 ? 0 : Math.floor(15 / s.speed);
            Prims.setTime(strip);
        }
        if (strip.count == 0) {
            strip.count = -1;
            s.div.style.opacity = 1;
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            if (!strip.firstBlock.aStart) {
                s.homeshown = true;
            }
        } else {
            s.div.style.opacity = Math.min(1, Number(s.div.style.opacity) + (s.speed / 15));
            strip.waitTimer = tinterval * 2;
            strip.count = strip.count - 1;
        }
    }

    static Hide (strip) { // same
        var s = strip.spr;
        s.shown = false;
        if (strip.count < 0) {
            strip.count = s.speed == 4 ? 0 : Math.floor(15 / s.speed);
            Prims.setTime(strip);
        }
        if (strip.count == 0) {
            strip.count = -1;
            s.div.style.opacity = 0;
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            if (!strip.firstBlock.aStart) {
                s.homeshown = false;
            }
        } else {
            s.div.style.opacity = Math.max(0, Number(s.div.style.opacity) - (s.speed / 15));
            strip.waitTimer = tinterval * 2;
            strip.count = strip.count - 1;
        }
    }


    static playConfusion (strip) {
        console.log('Play Confusion!!')
        const martyConnected = ScratchJr.getMartyConnected();

        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 1000;

            let marty_cmd = `filerun/spiffs/confused.raw`;
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            ScratchAudio.sndFX('confused.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    static playDisbelief (strip) {
        console.log('Play Disbelief!!')
        const martyConnected = ScratchJr.getMartyConnected();

        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 500;

            let marty_cmd = `filerun/spiffs/disbelief.raw`;
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            ScratchAudio.sndFX('disbelief.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    

    static playExcitement (strip) {
        console.log('Play No Way!!')
        const martyConnected = ScratchJr.getMartyConnected();

        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 1000;

            let marty_cmd = `filerun/spiffs/excited.raw`;
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            ScratchAudio.sndFX('excited.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    static playNoway (strip) {
        console.log('Play No Way!!')
        const martyConnected = ScratchJr.getMartyConnected();

        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 1000;

            let marty_cmd = `filerun/spiffs/no_way.raw`;
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            ScratchAudio.sndFX('no_way.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    static playNo (strip) {
        console.log('Play No!!')
        const martyConnected = ScratchJr.getMartyConnected();

        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 500;

            let marty_cmd = `filerun/spiffs/no.raw`;
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            ScratchAudio.sndFX('no.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    static playWhistle (strip) {
        console.log('Play Whistle!!')
        const martyConnected = ScratchJr.getMartyConnected();

        Prims.setTime(strip);

        if (martyConnected){

            const moveTime = 500;

            let marty_cmd = `filerun/spiffs/whistle.raw`;
            console.log(marty_cmd);
            OS.martyCmd({ cmd: marty_cmd });
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            ScratchAudio.sndFX('whistle.wav');
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    static OnTouch (strip) {
        var s = strip.spr;
        if (s.touchingAny()) {
            strip.stack.push(strip.firstBlock);
            strip.thisblock = strip.thisblock.next;
        }
        strip.waitTimer = tinterval;
    }

    static Message (strip) {
        var b = strip.thisblock;
        var pair;
        if (strip.firstTime) {
            var receivers = [];
            var msg = b.getArgValue();
            var findReceivers = function (block, s) {
                if ((block.blocktype == 'onmessage') && (block.getArgValue() == msg)) {
                    receivers.push([s, block]);
                }
            };
            Prims.applyToAllStrips(['onmessage'], findReceivers);
            var newthreads = [];
            for (var i in receivers) {
                pair = receivers[i];
                newthreads.push(ScratchJr.runtime.restartThread(pair[0], pair[1], true));
            }
            strip.firstTime = false;
            strip.called = newthreads;
        }

        // after first time
        var done = true;
        for (var j = 0; j < strip.called.length; j++) {
            if (strip.called[j].isRunning) {
                done = false;
            }
        }

        if (done) {
            strip.called = null;
            strip.firstTime = true;
            strip.thisblock = strip.thisblock.next;
            strip.waitTimer = tinterval * 2;
        } else {
            ScratchJr.runtime.yield = true;
        }
    }

    static applyToAllStrips (list, fcn) {
        if (!ScratchJr.stage) {
            return;
        }
        var page = ScratchJr.stage.currentPage;
        if (!page) {
            return;
        }
        if (!page.div) {
            return;
        }
        for (var i = 0; i < page.div.childElementCount; i++) {
            var spr = page.div.childNodes[i].owner;
            if (!spr) {
                continue;
            }
            var sc = gn(spr.id + '_scripts');
            if (!sc) {
                continue;
            }
            var topblocks = sc.owner.getBlocksType(list);
            for (var j = 0; j < topblocks.length; j++) {
                fcn(topblocks[j], spr);
            }
        }
    }
}
