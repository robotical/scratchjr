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
const moveTimeBuffer = 200; //(in ms) this is a little extra time added to move time to allow Marty to keep up with the Sprite
const turnSize = 20;        //the angle in degrees that a turn should be, this is both sent to Marty and used in the Sprite
const turnStepCount = 2;    //the number of sprite 'steps' to make in a single turn
const turnMoveTime = 1500;  //the movetime parameter for left and right turns
const stepMoveTime = 1500;  //the movetime parameter for forward, backward, left and right steps
const stepSize = 25;        //the size of a step this is used by the sprite and Marty
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
        Prims.table.martyDance = Prims.martyDance;
        Prims.table.getReady = Prims.getReady;
        Prims.table.up = Prims.StepForward;
        Prims.table.down = Prims.StepBackward;
        Prims.table.back = Prims.StepLeft;
        Prims.table.forward = Prims.StepRight;
        Prims.table.left = Prims.TurnLeft;
        Prims.table.right = Prims.TurnRight;
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

    /****************************************************
     *             Marty Movement Blocks
     ****************************************************/

    static martyDance (strip) {

        const martyConnected = ScratchJr.getMartyConnected();
        const moveTime = 3000;
        Prims.setTime(strip);

        if (martyConnected){

            let reps = Number(strip.thisblock.getArgValue());
   
            let marty_cmd = `traj/dance/${reps}?moveTime=${moveTime}`;
            
            OS.martyCmd({ cmd: marty_cmd });
            console.log(marty_cmd);
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000)*reps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000)*reps);
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    static getReady (strip) {
        const martyConnected = ScratchJr.getMartyConnected();
        const moveTime = 3000;

        Prims.setTime(strip);

        if (martyConnected){

            let marty_cmd = `traj/getReady/?moveTime=${moveTime}`;
            OS.martyCmd({ cmd: marty_cmd });
            console.log(marty_cmd);
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            // ScratchAudio.sndFX('boing.wav');
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(moveTime/1000));
            strip.thisblock = strip.thisblock.next;
            return;
        }
    }

    static StepForward (strip) {
        
        let s = strip.spr;
        const moveTime = stepMoveTime;
        let steps = Number(strip.thisblock.getArgValue());
        const martyConnected = ScratchJr.getMartyConnected();
        Prims.setTime(strip);

        if (martyConnected == true && !Prims.MartyCommanded(strip)){

            steps = Math.min(Math.max(steps, 1), 20);
            let stepLength = 1 * stepSize; //positive is forward
            let marty_cmd = `traj/step/${steps}/?moveTime=${moveTime}&stepLength=${stepLength}`;
            OS.martyCmd({ cmd: marty_cmd });
            console.log(marty_cmd);
            strip.cmdSent = true; //this stops the loop entering this if statement whilst it's still controlling the sprite movement
        }

        if (steps == 0) {
            strip.thisblock = strip.thisblock.next;
            strip.waitTimer = tinterval;
            strip.distance = -1;
            strip.cmdSent = false;
            strip.vector = {
                x: 0,
                y: 0
            };
            return;

        } else if (strip.distance < 0) {
            strip.waitTime = (moveTime + moveTimeBuffer) * steps / 1000; //total time to wait for Marty's movement to end (measured in seconds)

            var res = {};
            var rad = s.angle * (Math.PI / 180);
            res.x = steps * stepSize * 0.5 * Math.sin(rad);
            res.y = steps * stepSize * 0.5 * Math.cos(rad) * -1;

            strip.distance = steps * stepSize * 0.5;
            strip.vector = {
                x: res.x,
                y: res.y
            };

            let finX = res.x + s.xcoor;
            let finY = res.y + s.ycoor;
            strip.finalPosition = {
                x: finX,
                y: finY
            }
 
            strip.waitTime = strip.waitTime * 0.1;
            strip.stepVector = Vector.scale(strip.vector, (0.1/steps));

            Prims.setTime(strip);
        }
        Prims.moveAtSpeed(strip);
    }

    static StepBackward (strip) {

        let s = strip.spr;
        const moveTime = stepMoveTime;
        let steps = Number(strip.thisblock.getArgValue());
        const martyConnected = ScratchJr.getMartyConnected();
        Prims.setTime(strip);

        if (martyConnected == true && !Prims.MartyCommanded(strip)){
            
            steps = Math.min(Math.max(steps, 1), 20);
            let stepLength = -1 * stepSize;
            let marty_cmd = `traj/step/${steps}/?moveTime=${moveTime}&stepLength=${stepLength}`;
            OS.martyCmd({ cmd: marty_cmd });
            console.log(marty_cmd);
            strip.cmdSent = true; //this stops the loop entering this if statement whilst it's still controlling the sprite movement
        }

        if (steps == 0) {
            strip.thisblock = strip.thisblock.next;
            strip.waitTimer = tinterval;
            strip.distance = -1;
            strip.cmdSent = false;
            strip.vector = {
                x: 0,
                y: 0
            };
            return;
        } else if (strip.distance < 0) {
            strip.waitTime = (moveTime + moveTimeBuffer) * steps / 1000; //total time to wait for Marty's movement to end (measured in seconds)

            var res = {};
            var rad = s.angle * (Math.PI / 180);
            res.x = steps * stepSize * 0.5 * Math.sin(rad) * -1;
            res.y = steps * stepSize * 0.5 * Math.cos(rad);
            
            strip.distance = steps * stepSize * 0.5;
            strip.vector = {
                x: res.x,
                y: res.y
            };

            let finX = res.x + s.xcoor;
            let finY = res.y + s.ycoor;
            strip.finalPosition = {
                x: finX,
                y: finY
            }

            strip.waitTime = strip.waitTime * 0.1;
            strip.stepVector = Vector.scale(strip.vector, (0.1/steps));

            Prims.setTime(strip);
        }
        Prims.moveAtSpeed(strip);
    }

    
    static StepLeft (strip) {

        let s = strip.spr;
        const moveTime = stepMoveTime;
        let steps = Number(strip.thisblock.getArgValue());
        const martyConnected = ScratchJr.getMartyConnected();
        Prims.setTime(strip);

        if (martyConnected == true && !Prims.MartyCommanded(strip)){

            steps = Math.min(Math.max(steps, 1), 20);
            let stepLength = stepSize; 
            const side = 0;
            let marty_cmd = `traj/sidestep/${steps}/?side=${side}&moveTime=${moveTime}&stepLength=${stepLength}`;
            OS.martyCmd({ cmd: marty_cmd });
            console.log(marty_cmd);
            strip.cmdSent = true; //this stops the loop entering this if statement whilst it's still controlling the sprite movement
        }
        
        if (steps == 0) {
            strip.thisblock = strip.thisblock.next;
            strip.waitTimer = tinterval;
            strip.distance = -1;
            strip.vector = {
                x: 0,
                y: 0
            };
            return;

        } else if (strip.distance < 0) {
            strip.waitTime = (moveTime + moveTimeBuffer) * steps / 1000; //total time to wait for Marty's movement to end (measured in seconds)

            var res = {};
            var rad = (s.angle - 90) * (Math.PI / 180);
            res.x = steps * stepSize * 0.5 * Math.sin(rad) ;
            res.y = steps * stepSize * 0.5 * Math.cos(rad) * -1;

            strip.distance = steps * stepSize * 0.5;
            strip.vector = {
                x: res.x,
                y: res.y
            };

            let finX = res.x + s.xcoor;
            let finY = res.y + s.ycoor;
            strip.finalPosition = {
                x: finX,
                y: finY
            }

            strip.waitTime = strip.waitTime * 0.1;
            strip.stepVector = Vector.scale(strip.vector, (0.1/steps));

            Prims.setTime(strip);
        }
        Prims.moveAtSpeed(strip);
    }
    

    static StepRight (strip) {
        
        var s = strip.spr;
        const moveTime = stepMoveTime;
        var steps = Number(strip.thisblock.getArgValue());
        const martyConnected = ScratchJr.getMartyConnected();
        Prims.setTime(strip);

        if (martyConnected == true && !Prims.MartyCommanded(strip)){

            steps = Math.min(Math.max(steps, 1), 20);
            const stepLength = stepSize;
            const side = 1;
            let marty_cmd = `traj/sidestep/${steps}/?side=${side}&moveTime=${moveTime}&stepLength=${stepLength}`;
            OS.martyCmd({ cmd: marty_cmd });
            console.log(marty_cmd);
            strip.cmdSent = true; //this stops the loop entering this if statement whilst it's still controlling the sprite movement
        }

        if (steps == 0) {
            strip.thisblock = strip.thisblock.next;
            strip.waitTimer = tinterval;
            strip.distance = -1;
            strip.vector = {
                x: 0,
                y: 0
            };
            return;

        } else if (strip.distance < 0) {
            strip.waitTime = (moveTime + moveTimeBuffer) * steps / 1000; //total time to wait for Marty's movement to end (measured in seconds)

            var res = {};
            var rad = (s.angle + 90) * (Math.PI / 180);
            res.x = steps * stepSize * 0.5 * Math.sin(rad) ;
            res.y = steps * stepSize * 0.5 * Math.cos(rad) * -1;
            
            strip.distance = steps * stepSize * 0.5;
            strip.vector = {
                x: res.x,
                y: res.y
            };

            let finX = res.x + s.xcoor;
            let finY = res.y + s.ycoor;
            strip.finalPosition = {
                x: finX,
                y: finY
            }

            strip.waitTime = strip.waitTime * 0.1;
            strip.stepVector = Vector.scale(strip.vector, (0.1/steps));

            Prims.setTime(strip);
        }
        Prims.moveAtSpeed(strip);
    }

    

    static moveAtSpeed (strip) {
        var s = strip.spr;
        var distance = strip.distance;
        distance -= Math.abs(Vector.len(strip.stepVector));

        if (distance < 0) {
            s.setPos(strip.finalPosition.x, strip.finalPosition.y);
            strip.distance = -1;
            strip.vector = {
                x: 0,
                y: 0
            };
            strip.cmdSent = false;
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;

        } else {
            s.setPos(s.xcoor + strip.stepVector.x, s.ycoor + strip.stepVector.y);
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(strip.waitTime));
            strip.distance = distance;
        }
    }

    static TurnRight (strip) {
        var num = Number(strip.thisblock.getArgValue()) * turnSize; //Turnsize is set globally to keep left and right consistent
        var s = strip.spr;
        const moveTime = turnMoveTime;
        let steps = Number(strip.thisblock.getArgValue());
        const martyConnected = ScratchJr.getMartyConnected();
        Prims.setTime(strip);

        if (martyConnected == true && !Prims.MartyCommanded(strip)){

            steps = Math.min(Math.max(steps, 1), 20);
            let turn = -1 * turnSize; //Negative Direction
            let marty_cmd = `traj/step/${steps}/?moveTime=${moveTime}&turn=${turn}&stepLength=1`;
            OS.martyCmd({ cmd: marty_cmd });
            console.log(marty_cmd);
            strip.cmdSent = true; //this stops the loop entering this if statement whilst it's still controlling the sprite movement
        }

        if (strip.count < 0) {
            strip.waitTime = (moveTime + moveTimeBuffer) * steps / 1000; //total time to wait for Marty's movement to end (measured in seconds)
            strip.count = Math.floor(Math.abs(steps) * turnStepCount);   //how many steps do we want to break the movement down into?
            strip.waitTime = strip.waitTime / strip.count;
            strip.angleStep = turnSize / turnStepCount;                  //Break the total turn size down by number of steps the sprite should take
            strip.finalAngle = s.angle + num;                            //Final position is current angle sub rotation angle
            strip.finalAngle = strip.finalAngle % 360;                   //Correct for rolling over 360
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

    static TurnLeft (strip) {
        var num = Number(strip.thisblock.getArgValue()) * turnSize; //Turnsize is set globally to keep left and right consistent
        var s = strip.spr;
        const moveTime = turnMoveTime;
        let steps = Number(strip.thisblock.getArgValue());
        const martyConnected = ScratchJr.getMartyConnected();
        Prims.setTime(strip);

        if (martyConnected == true && !Prims.MartyCommanded(strip)){

            steps = Math.min(Math.max(steps, 1), 20);
            let turn = 1 * turnSize; //Positive Direction
            let marty_cmd = `traj/step/${steps}/?moveTime=${moveTime}&turn=${turn}&stepLength=1`;
            OS.martyCmd({ cmd: marty_cmd });
            console.log(marty_cmd);
            strip.cmdSent = true; //this stops the loop entering this if statement whilst it's still controlling the sprite movement
        }
        
        if (strip.count < 0) {
            strip.waitTime = (moveTime + moveTimeBuffer) * steps / 1000; //total time to wait for Marty's movement to end (measured in seconds)
            strip.count = Math.floor(Math.abs(steps) * turnStepCount);   //how many steps do we want to break the movement down into?
            strip.waitTime = strip.waitTime / strip.count;
            strip.angleStep = - turnSize / turnStepCount;                //Break the total turn size down by number of steps the sprite should take
            strip.finalAngle = s.angle - num;                            //Final position is current angle sub rotation angle
            strip.finalAngle = strip.finalAngle % 360;                   //Correct for rolling over 360
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
            strip.cmdSent = false;
            strip.thisblock = strip.thisblock.next;
        } else {
            s.setHeading(s.angle + strip.angleStep);
            strip.waitTimer = parseInt(tinterval*intervalToSeconds*(strip.waitTime));

            strip.count = count;
        }
    }

    static MartyCommanded (strip) {
        //This variable alows the sprite and robot to move together
        //It keeps track of when the comman has been sent to the robot as the sprite calls the function many more times
        if (strip.cmdSent == null) {
            strip.cmdSent = false;
        }
            return strip.cmdSent;
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
