import ScratchJr from '../ScratchJr';
import ScratchAudio from '../../utils/ScratchAudio';
import Grid from '../ui/Grid';
import Vector from '../../geom/Vector';
import { gn, rgbToHex } from '../../utils/lib';
import UI from '../ui/UI';
import MartyBlocks from '../../marty/MartyBlocks';
import celebrateHelper from '../../marty/celebrate-helper';

let tinterval = 1;
let hopList = [-48, -30, -22, -14, -6, 0, 6, 14, 22, 30, 48];
export const LINEAR_GRADIENT_COLOUR = "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)";
const intervalToSeconds = 31.25; // runtime tick is set at 32ms by Runtime.js. 32*31.25 = 1s

export default class Prims {
    static get hopList() {
        return hopList;
    }

    static init() {
        Prims.table = {};
        Prims.table.done = Prims.Done;
        Prims.table.missing = Prims.Ignore;
        Prims.table.onflag = Prims.Ignore;
        
        Prims.table.onmessage = Prims.Ignore;
        Prims.table.onclick = Prims.Ignore;
        Prims.table.ontouch = Prims.OnTouch;
        Prims.table.onchat = Prims.Ignore;
        Prims.table.repeat = Prims.Repeat;
        Prims.table.forward = Prims.Forward;
        Prims.table.back = Prims.Back;
        Prims.table.up = Prims.Up;
        Prims.table.down = Prims.Down;
        Prims.table.left = Prims.Left;
        Prims.table.right = Prims.Right;
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
        Prims.table.startstopcounter = Prims.StartStopCounter;
        Prims.table.increasecounter = Prims.IncreaseCounter;
        Prims.table.decreasecounter = Prims.DecreaseCounter;
        Prims.table.forever = Prims.Forever;
        Prims.table.hop = Prims.Hop;
        Prims.table.show = Prims.Show;
        Prims.table.hide = Prims.Hide;
        Prims.table.grow = Prims.Grow;
        Prims.table.shrink = Prims.Shrink;
        Prims.table.same = Prims.Same;
        Prims.table.playsnd = Prims.playSound;
        Prims.table.playusersnd = Prims.playSound;
        Prims.table.say = Prims.Say;

        /* Cog Prims */
        Prims.table.tiltany = Prims.Ignore; 
        Prims.table.ontouchcog = Prims.Ignore; 
        Prims.table.onmove = Prims.Ignore;  
        Prims.table.onobjectsensed = Prims.Ignore;  
        Prims.table.onlight = Prims.Ignore;  
        Prims.table.setpattern = Prims.setPattern; 
        Prims.table.selectcolour = Prims.selectColour; 
        Prims.table.clearcolours = Prims.clearColours; 
        Prims.table.confusion = Prims.playConfusion; 
        Prims.table.disbelief = Prims.playDisbelief; 
        Prims.table.excitement = Prims.playExcitement; 
        Prims.table.noway = Prims.playNoway; 
        Prims.table.no = Prims.playNo; 
        Prims.table.whistle = Prims.playWhistle; 
        Prims.table.playnote = Prims.playNote;  
        Prims.table.waitcrotchet = Prims.waitcrotchet;  
        Prims.table.settempo = Prims.settempo;  



        /* Marty Prims */
        Prims.table.martyDance = Prims.martyDance;
        Prims.table.martyGetReady = Prims.martyGetReady;
        Prims.table.martyStepForward = Prims.martyStepForward;
        Prims.table.martyStepBackward = Prims.martyStepBackward;
        Prims.table.martyStepLeft = Prims.martyStepLeft;
        Prims.table.martyStepRight = Prims.martyStepRight;
        Prims.table.martyTurnLeft = Prims.martyTurnLeft;
        Prims.table.martyTurnRight = Prims.martyTurnRight;
        Prims.table.martyKickLeft = Prims.martyKickLeft;
        Prims.table.martyKickRight = Prims.martyKickRight;

        Prims.table.martyEyesExcited = Prims.martyEyesExcited;
        Prims.table.martyEyesWide = Prims.martyEyesWide;
        Prims.table.martyEyesAngry = Prims.martyEyesAngry;
        Prims.table.martyEyesNormal = Prims.martyEyesNormal;
        Prims.table.martyEyesWiggle = Prims.martyEyesWiggle;
        Prims.table.martyWaveLeft = Prims.martyWaveLeft;
        Prims.table.martyWaveRight = Prims.martyWaveRight;
        Prims.table.martyCelebrate = Prims.martyCelebrate;
        Prims.table.martyLedEyesP1 = Prims.martyLedEyesP1;
        Prims.table.martyLedEyesP2 = Prims.martyLedEyesP2;
        Prims.table.martyLedEyesP3 = Prims.martyLedEyesP3;
        Prims.table.martyLedEyesColour = Prims.martyLedEyesColour;

        Prims.table.martyConfusion = Prims.martyConfusion;
        Prims.table.martyDisbelief = Prims.martyDisbelief;
        Prims.table.martyExcitement = Prims.martyExcitement;
        Prims.table.martyNoway = Prims.martyNoway;
        Prims.table.martyNo = Prims.martyNo;
        Prims.table.martyWhistle = Prims.martyWhistle;
    }

    static Done(strip) {
        if (strip.oldblock != null) {
            strip.oldblock.unhighlight();
        }
        strip.oldblock = null;
        strip.isRunning = false;
    }

    static setTime(strip) {
        strip.time = (new Date()) - 0;
    }

    static showTime() {
        //var time = ((new Date()) - strip.time) / 1000;
        // 	ScratchJr.log (strip.thisblock.blocktype, time, "sec") ;
    }

    static DoNextBlock(strip) {
        strip.waitTimer = tinterval * 10;
        strip.thisblock = strip.thisblock.next;
    }

    static StopAll() {
        ScratchJr.stopStrips();
    }

    static StopMine(strip) {
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


    static playConfusion(strip) {
        console.log("playing confusion");
        const durationInSeconds = Prims.cogBlocks?.musicBlocks.playSound("confusion") / 1000;
        Prims.setTime(strip);
        strip.waitTimer = convertNumberToSeconds(durationInSeconds);
        strip.thisblock = strip.thisblock.next;
    }

    static playDisbelief(strip) {
        console.log("playing disbelief")
        const durationInSeconds = Prims.cogBlocks?.musicBlocks.playSound("disbelief") / 1000;
        Prims.setTime(strip);
        strip.waitTimer = convertNumberToSeconds(durationInSeconds);
        strip.thisblock = strip.thisblock.next;
    }

    static playExcitement(strip) {
        console.log("playing excitement")
        const durationInSeconds = Prims.cogBlocks?.musicBlocks.playSound("excitement") / 1000;
        Prims.setTime(strip);
        strip.waitTimer = convertNumberToSeconds(durationInSeconds);
        strip.thisblock = strip.thisblock.next;
    }

    static playNoway(strip) {
        console.log("playing noway")
        const durationInSeconds = Prims.cogBlocks?.musicBlocks.playSound("noway") / 1000;
        Prims.setTime(strip);
        strip.waitTimer = convertNumberToSeconds(durationInSeconds);
        strip.thisblock = strip.thisblock.next;
    }

    static playNo(strip) {
        console.log("playing no")
        const durationInSeconds = Prims.cogBlocks?.musicBlocks.playSound("no") / 1000;
        console.log("durationInSeconds: ", durationInSeconds)
        Prims.setTime(strip);
        strip.waitTimer = convertNumberToSeconds(durationInSeconds);
        strip.thisblock = strip.thisblock.next;
    }

    static playWhistle(strip) {
        console.log("playing whistle")
        const durationInSeconds = Prims.cogBlocks?.musicBlocks.playSound("whistle") / 1000;
        Prims.setTime(strip);
        strip.waitTimer = convertNumberToSeconds(durationInSeconds);
        strip.thisblock = strip.thisblock.next;
    }

    static settempo(strip) {
        const bpm = strip.thisblock.getArgValue();
        console.log("setting tempo: ", bpm)
        Prims.cogBlocks?.musicBlocks.setTempo(bpm);
        Prims.setTime(strip);
        strip.waitTimer = tinterval * 1;
        strip.thisblock = strip.thisblock.next;
    }

    static waitcrotchet(strip) {
        const beats = strip.thisblock.getArgValue();
        console.log("waiting crotchet: ", beats)
        const durationInSeconds = Prims.cogBlocks?.musicBlocks.rest(beats) / 1000;
        Prims.setTime(strip);
        strip.waitTimer = convertNumberToSeconds(durationInSeconds);
        strip.thisblock = strip.thisblock.next;
    }

    static playNote(strip) {
        const note = strip.thisblock.getArgValue();
        console.log("playing note: ", note)
        const durationInSeconds = Prims.cogBlocks?.musicBlocks.playNote(note) / 1000;
        Prims.setTime(strip);
        strip.waitTimer = convertNumberToSeconds(durationInSeconds + 0.1); // add 0.1s to wait between consecutive notes
        strip.thisblock = strip.thisblock.next;
    }

    static getSoundHelper(name, extIdx = -1) {
        const extensions = ['mp3', 'ogg', 'wav'];
        const ext = extensions[extIdx];
        if (extIdx < 0) {
            const sound = ScratchAudio.projectSounds[name];
            if (sound) {
                return sound;
            } else {
                return Prims.getSoundHelper(name, 0);
            }
        }
        if (extIdx >= extensions.length) {
            return null;
        }
        const sound = ScratchAudio.projectSounds[name + '.' + ext];
        if (sound) {
            return sound;
        } else {
            return Prims.getSoundHelper(name, extIdx + 1);
        }
    }

    static playSound(strip) {
        var b = strip.thisblock;
        var name = b.getSoundName(strip.spr.sounds);
        if (!strip.audio) {
            var snd = Prims.getSoundHelper(name);
            if (!snd) {
                strip.thisblock = strip.thisblock.next;
                return;
            }
            strip.audio = snd;
            snd.play();
        }
        try {
        } catch (e) {
        }
        if (strip.audio && strip.audio.done()) {
            strip.audio.clear();
            strip.thisblock = strip.thisblock.next;
            strip.audio = undefined;
        }
        strip.waitTimer = tinterval * 4;
    }

    static setPattern(strip) {
        const pattern = strip.thisblock.getArgValue();
        console.log("setting pattern: ", pattern)
        Prims.cogBlocks?.setPattern(pattern);
        Prims.setTime(strip);
        strip.waitTimer = tinterval * 1;
        strip.thisblock = strip.thisblock.next;
    }

    static selectColour(strip) {
        const colour = strip.thisblock.getArgValue();
        console.log("selecting colour: ", colour)
        Prims.cogBlocks?.selectColour(colour);
        Prims.setTime(strip);
        strip.waitTimer = tinterval * 1;
        strip.thisblock = strip.thisblock.next;
    }

    static clearColours(strip) {
        console.log("clearing colours")
        Prims.cogBlocks?.clearColours();
        Prims.setTime(strip);
        strip.waitTimer = tinterval * 1;
        strip.thisblock = strip.thisblock.next;
    }

    static Say(strip) {
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

    static GotoPage(strip) {
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

    static Forever(strip) {
        strip.thisblock = strip.firstBlock.aStart ? strip.firstBlock.next : strip.firstBlock;
        ScratchJr.runtime.yield = true;
    }

    static Repeat(strip) {
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

    static Ignore(strip) {
        strip.thisblock = strip.thisblock.next;
    }

    static Wait(strip) {
        var n = strip.thisblock.getArgValue();
        // strip.waitTimer = Math.round(n * 3.125); // thenth of a second
        strip.waitTimer = Math.round(n * 3.125 * 10); // A second
        Prims.setTime(strip);
        strip.thisblock = strip.thisblock.next;
    }

    static Home(strip) {
        var spr = strip.spr;
        spr.goHome();
        strip.waitTimer = tinterval;
        strip.thisblock = strip.thisblock.next;
    }

    static SetSpeed(strip) {
        var s = strip.spr;
        var num = Number(strip.thisblock.getArgValue()); // 0 - 1 - 2
        s.speed = Math.pow(2, num);
        strip.waitTimer = tinterval;
        strip.thisblock = strip.thisblock.next;
    }

    static Hop(strip) {
        if (strip.count < 0) { // setup the hop
            strip.count = hopList.length;
            Prims.setTime(strip);
        }
        Prims.hopTo(strip);
    }

    static hopTo(strip) {
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

    static Down(strip) {
        var num = Number(strip.thisblock.getArgValue()) * 24;
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

    static Up(strip) {
        var num = Number(strip.thisblock.getArgValue()) * 24;
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

    static Forward(strip) {
        var s = strip.spr;
        var num = Number(strip.thisblock.getArgValue()) * 24;
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

    static Back(strip) {
        var s = strip.spr;
        var num = Number(strip.thisblock.getArgValue()) * 24;
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

    static moveAtSpeed(strip) {
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

    static martyMoveAtSpeed(strip) {
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
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (strip.waitTime));
            strip.distance = distance;
        }
    }

    static Right(strip) {
        var s = strip.spr;
        var num = Number(strip.thisblock.getArgValue()) * 30;
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

    static Left(strip) {
        var s = strip.spr;
        var num = Number(strip.thisblock.getArgValue()) * 30;
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

    static turning(strip) {
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

    static Same(strip) {
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

    static Grow(strip) {
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

    static Shrink(strip) {
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

    static Show(strip) {
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

    static Hide(strip) { // same
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

    static StartStopCounter(strip) {
        const durationInSeconds = .2
        Prims.setTime(strip);
        strip.waitTimer = convertNumberToSeconds(durationInSeconds);
        strip.thisblock = strip.thisblock.next;

        Prims.startStopCounter_();
    }

    static IncreaseCounter(strip) {
        const durationInSeconds = .2
        Prims.setTime(strip);
        strip.waitTimer = convertNumberToSeconds(durationInSeconds);
        strip.thisblock = strip.thisblock.next;

        Prims.increaseCounter_();
    }

    static DecreaseCounter(strip) {
        const durationInSeconds = .2
        Prims.setTime(strip);
        strip.waitTimer = convertNumberToSeconds(durationInSeconds);
        strip.thisblock = strip.thisblock.next;

        Prims.decreaseCounter_();
    }

    static startStopCounter_() {
        if (!UI.counterExist()) {
            UI.createCounter();
        }

        if (UI.counterExist() && UI.getCounterText() === "0") {
            UI.destroyCounter();
        }
        UI.addTextToCounter(0);
    }

    static increaseCounter_() {
        if (UI.counterExist()) {
            const currentValue = UI.getCounterText();
            const newValue = parseInt(currentValue) + 1;
            UI.addTextToCounter(newValue);
        } else {
            UI.createCounter();
            UI.addTextToCounter(1);
        }
    }

    static decreaseCounter_() {
        if (UI.counterExist()) {
            const currentValue = UI.getCounterText();
            const newValue = parseInt(currentValue) - 1;
            UI.addTextToCounter(newValue);
        } else {
            UI.createCounter();
            UI.addTextToCounter(-1);
        }
    }

    static OnTouch(strip) {
        var s = strip.spr;
        if (s.touchingAny()) {
            strip.stack.push(strip.firstBlock);
            strip.thisblock = strip.thisblock.next;
        }
        strip.waitTimer = tinterval;
    }

    /* Marty Blcoks */
    static martyDance(strip) {
        let reps = Math.abs(Number(strip.thisblock.getArgValue()));
        reps = Prims.sanitiseArgument(reps);
        const moveTime = 3000;
        Prims.setTime(strip);

        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.dance(reps, moveTime);
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000) * reps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            Prims.playMartyServo(strip);
            return;
        }
    }

    static martyGetReady(strip) {
        const moveTime = 3000;
        Prims.setTime(strip);

        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.getReady(moveTime);
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
            return;
        } else {
            Prims.playMartyServo(strip);
            return;
        }
    }

    static stopMartyCommandedAfterTime(strip, time) {
        const timeout = setTimeout(() => {
            console.log("stopping Marty after time");
            strip.cmdSent = false;
            clearTimeout(timeout);
        }, time);
    }

    static martyStepForward(strip) {
        let s = strip.spr;
        const moveTime = MartyBlocks.stepMoveTime;
        let steps = Math.abs(Number(strip.thisblock.getArgValue()));
        steps = Prims.sanitiseArgument(steps);
        Prims.setTime(strip);

        if (Prims.martyBlocks && !Prims.isMartyCommanded(strip)) {
            steps = Math.min(Math.max(steps, 1), 20);
            Prims.martyBlocks.stepForward(steps);
            strip.cmdSent = true; //this stops the loop entering this if statement whilst it's still controlling the sprite movement
            Prims.stopMartyCommandedAfterTime(strip, (steps * moveTime) + MartyBlocks.moveTimeBuffer);
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
            strip.waitTime = (moveTime + MartyBlocks.moveTimeBuffer) / 1000; //total time to wait for Marty's movement to end (measured in seconds)

            var res = {};
            var rad = s.angle * (Math.PI / 180);
            res.x = steps * MartyBlocks.YStepSize * 0.5 * Math.sin(rad);
            res.y = steps * MartyBlocks.YStepSize * 0.5 * Math.cos(rad) * -1;

            strip.distance = steps * MartyBlocks.YStepSize * 0.5;
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
            strip.stepVector = Vector.scale(strip.vector, (0.1 / steps));

            Prims.setTime(strip);
        }
        Prims.martyMoveAtSpeed(strip);
    }

    static martyStepBackward(strip) {

        let s = strip.spr;
        const moveTime = MartyBlocks.stepMoveTime;
        let steps = Math.abs(Number(strip.thisblock.getArgValue()));
        steps = Prims.sanitiseArgument(steps);
        Prims.setTime(strip);

        if (Prims.martyBlocks && !Prims.isMartyCommanded(strip)) {
            steps = Math.min(Math.max(steps, 1), 20);
            Prims.martyBlocks.stepBackward(steps);
            strip.cmdSent = true; //this stops the loop entering this if statement whilst it's still controlling the sprite movement
            Prims.stopMartyCommandedAfterTime(strip, (steps * moveTime) + MartyBlocks.moveTimeBuffer);
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
            strip.waitTime = (moveTime + MartyBlocks.moveTimeBuffer) / 1000; //total time to wait for Marty's movement to end (measured in seconds)

            var res = {};
            var rad = s.angle * (Math.PI / 180);
            res.x = steps * MartyBlocks.YStepSize * 0.5 * Math.sin(rad) * -1;
            res.y = steps * MartyBlocks.YStepSize * 0.5 * Math.cos(rad);

            strip.distance = steps * MartyBlocks.YStepSize * 0.5;
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
            strip.stepVector = Vector.scale(strip.vector, (0.1 / steps));

            Prims.setTime(strip);
        }
        Prims.martyMoveAtSpeed(strip);
    }

    static martyStepLeft(strip) {

        let s = strip.spr;
        const moveTime = MartyBlocks.stepMoveTime;
        let steps = Math.abs(Number(strip.thisblock.getArgValue()));
        steps = Prims.sanitiseArgument(steps);
        Prims.setTime(strip);

        if (Prims.martyBlocks && !Prims.isMartyCommanded(strip)) {

            steps = Math.min(Math.max(steps, 1), 20);
            Prims.martyBlocks.stepLeft(steps);
            strip.cmdSent = true; //this stops the loop entering this if statement whilst it's still controlling the sprite movement
            Prims.stopMartyCommandedAfterTime(strip, (steps * moveTime) + MartyBlocks.moveTimeBuffer);
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
            strip.waitTime = (moveTime + MartyBlocks.moveTimeBuffer) / 1000; //total time to wait for Marty's movement to end (measured in seconds)

            var res = {};
            var rad = (s.angle - 90) * (Math.PI / 180);
            res.x = steps * MartyBlocks.XStepSize * 0.5 * Math.sin(rad);
            res.y = steps * MartyBlocks.XStepSize * 0.5 * Math.cos(rad) * -1;

            strip.distance = steps * MartyBlocks.XStepSize * 0.5;
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
            strip.stepVector = Vector.scale(strip.vector, (0.1 / steps));

            Prims.setTime(strip);
        }
        Prims.martyMoveAtSpeed(strip);
    }

    static martyStepRight(strip) {

        var s = strip.spr;
        const moveTime = MartyBlocks.stepMoveTime;
        var steps = Math.abs(Number(strip.thisblock.getArgValue()));
        steps = Prims.sanitiseArgument(steps);
        Prims.setTime(strip);

        if (Prims.martyBlocks && !Prims.isMartyCommanded(strip)) {

            steps = Math.min(Math.max(steps, 1), 20);
            Prims.martyBlocks.stepRight(steps);
            strip.cmdSent = true; //this stops the loop entering this if statement whilst it's still controlling the sprite movement
            Prims.stopMartyCommandedAfterTime(strip, (steps * moveTime) + MartyBlocks.moveTimeBuffer);
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
            strip.waitTime = (moveTime + MartyBlocks.moveTimeBuffer) / 1000; //total time to wait for Marty's movement to end (measured in seconds)

            var res = {};
            var rad = (s.angle + 90) * (Math.PI / 180);
            res.x = steps * MartyBlocks.XStepSize * 0.5 * Math.sin(rad);
            res.y = steps * MartyBlocks.XStepSize * 0.5 * Math.cos(rad) * -1;

            strip.distance = steps * MartyBlocks.XStepSize * 0.5;
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
            strip.stepVector = Vector.scale(strip.vector, (0.1 / steps));

            Prims.setTime(strip);
        }
        Prims.martyMoveAtSpeed(strip);
    }

    static martyTurnRight(strip) {
        var num = Number(strip.thisblock.getArgValue()) * MartyBlocks.turnSize * 1.4;
        var s = strip.spr;
        const moveTime = MartyBlocks.turnMoveTime;
        let steps = Number(strip.thisblock.getArgValue());
        steps = Prims.sanitiseArgument(steps);
        Prims.setTime(strip);

        if (Prims.martyBlocks && !Prims.isMartyCommanded(strip)) {
            steps = Math.min(Math.max(steps, 1), 20);
            Prims.martyBlocks.turnRight(steps);
            strip.cmdSent = true; //this stops the loop entering this if statement whilst it's still controlling the sprite movement
            Prims.stopMartyCommandedAfterTime(strip, (steps * moveTime) + MartyBlocks.moveTimeBuffer);
        }

        if (strip.count < 0) {
            strip.waitTime = (moveTime + MartyBlocks.moveTimeBuffer) * steps / 1000; //total time to wait for Marty's movement to end (measured in seconds)
            strip.count = Math.floor(Math.abs(steps) * MartyBlocks.turnStepCount);   //how many steps do we want to break the movement down into?
            strip.waitTime = strip.waitTime / strip.count;
            strip.angleStep = MartyBlocks.turnSize / MartyBlocks.turnStepCount;                  //Break the total turn size down by number of steps the sprite should take
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

    static martyTurnLeft(strip) {
        var num = Number(strip.thisblock.getArgValue()) * MartyBlocks.turnSize * 1.4;
        var s = strip.spr;
        const moveTime = MartyBlocks.turnMoveTime;
        let steps = Number(strip.thisblock.getArgValue());
        steps = Prims.sanitiseArgument(steps);
        Prims.setTime(strip);

        if (Prims.martyBlocks && !Prims.isMartyCommanded(strip)) {
            steps = Math.min(Math.max(steps, 1), 20);
            Prims.martyBlocks.turnLeft(steps);
            strip.cmdSent = true; //this stops the loop entering this if statement whilst it's still controlling the sprite movement
            Prims.stopMartyCommandedAfterTime(strip, (steps * moveTime) + MartyBlocks.moveTimeBuffer);
        }

        if (strip.count < 0) {
            strip.waitTime = (moveTime + MartyBlocks.moveTimeBuffer) * steps / 1000; //total time to wait for Marty's movement to end (measured in seconds)
            strip.count = Math.floor(Math.abs(steps) * MartyBlocks.turnStepCount);   //how many steps do we want to break the movement down into?
            strip.waitTime = strip.waitTime / strip.count;
            strip.angleStep = - MartyBlocks.turnSize / MartyBlocks.turnStepCount;                //Break the total turn size down by number of steps the sprite should take
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

    static martyEyesExcited(strip) {
        const moveTime = 1000;
        Prims.setTime(strip);
        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.eyesExcited();
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            Prims.playMartyServo(strip);
        }
    }

    static martyEyesWide(strip) {
        const moveTime = 1000;
        Prims.setTime(strip);

        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.eyesWide();
            Prims.showTime(strip);
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000));
            strip.thisblock = strip.thisblock.next;
        } else {
            Prims.playMartyServo(strip);
        }
    }

    static martyEyesAngry(strip) {
        const moveTime = 1000;
        Prims.setTime(strip);
        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.eyesAngry();
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            Prims.playMartyServo(strip);
        }
    }

    static martyEyesNormal(strip) {
        const moveTime = 1000;
        Prims.setTime(strip);
        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.eyesNormal();
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            Prims.playMartyServo(strip);
        }
    }

    static martyEyesWiggle(strip) {
        const reps = Number(strip.thisblock.getArgValue());
        const moveTime = 2000;
        Prims.setTime(strip);
        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.eyesWiggle(reps);
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000) * reps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            Prims.playMartyServo(strip);
        }
    }

    static martyWaveLeft(strip) {
        const reps = Number(strip.thisblock.getArgValue());
        const moveTime = 2500;
        Prims.setTime(strip);
        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.waveLeft(reps);
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000) * reps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            Prims.playMartyServo(strip);
        }
    }

    static martyWaveRight(strip) {
        const reps = Number(strip.thisblock.getArgValue());
        const moveTime = 2500;
        Prims.setTime(strip);
        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.waveRight(reps);
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000) * reps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            Prims.playMartyServo(strip);
        }
    }

    static martyLedEyesP1(strip) {
        const duration = 2500;
        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.ledEyesP1(duration);
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (duration / 1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            Prims.playMartyServo(strip);
        }
    }
    static martyLedEyesP2(strip) {
        const duration = 2500;
        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.ledEyesP2(duration);
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (duration / 1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            Prims.playMartyServo(strip);
        }
    }
    static martyLedEyesP3(strip) {
        // Not implemented yet
        return Prims.playMartyServo(strip);
    }
    static martyLedEyesColour(strip) {
        const duration = 1500;
        let colour = rgbToHex(strip.thisblock.getArgValue()).replace("#", "");
        if (colour === LINEAR_GRADIENT_COLOUR) {
            colour = "000000";
        }
        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.ledEyesColour(colour, duration);
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (duration / 1000));
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            Prims.playMartyServo(strip);
        }
    }

    static martyCelebrate(strip) {
        celebrateHelper(Prims.martyBlocks, Prims, strip, tinterval, intervalToSeconds);
    }

    static martyKickLeft(strip) {
        const reps = Number(strip.thisblock.getArgValue());
        const moveTime = 2500;
        Prims.setTime(strip);
        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.kickLeft(reps);
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000) * reps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            Prims.playMartyServo(strip);
        }
    }

    static martyKickRight(strip) {
        const reps = Number(strip.thisblock.getArgValue());
        const moveTime = 2500;
        Prims.setTime(strip);
        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.kickRight(reps);
            strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000) * reps);
            Prims.showTime(strip);
            strip.thisblock = strip.thisblock.next;
        } else {
            Prims.playMartyServo(strip);
        }
    }

    static playMartyServo(strip) {
        const moveTime = 850;
        ScratchAudio.sndFX('marty_eyes_servo.wav');
        strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000));
        strip.thisblock = strip.thisblock.next;
        return;
    }

    static isMartyCommanded(strip) {
        return !!strip.cmdSent;
    }

    static martyConfusion(strip) {
        const moveTime = 2500;
        Prims.setTime(strip);

        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.confusion();
            Prims.showTime(strip);
        } else {
            ScratchAudio.sndFX('confused.wav');
        }
        strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000));
        strip.thisblock = strip.thisblock.next;
    }

    static martyDisbelief(strip) {
        const moveTime = 2500;
        Prims.setTime(strip);

        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.disbelief();
            Prims.showTime(strip);
        } else {
            ScratchAudio.sndFX('disbelief.wav');
        }
        strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000));
        strip.thisblock = strip.thisblock.next;
    }

    static martyExcitement(strip) {
        const moveTime = 2500;
        Prims.setTime(strip);

        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.excitement();
            Prims.showTime(strip);
        } else {
            ScratchAudio.sndFX('excited.wav');
        }
        strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000));
        strip.thisblock = strip.thisblock.next;
    }

    static martyNoway(strip) {
        const moveTime = 2500;
        Prims.setTime(strip);

        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.noway();
            Prims.showTime(strip);
        } else {
            ScratchAudio.sndFX('no_way.wav');
        }
        strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000));
        strip.thisblock = strip.thisblock.next;
    }

    static martyNo(strip) {
        const moveTime = 2500;
        Prims.setTime(strip);

        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.no();
            Prims.showTime(strip);
        } else {
            ScratchAudio.sndFX('no.wav');
        }
        strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000));
        strip.thisblock = strip.thisblock.next;
    }

    static martyWhistle(strip) {
        const moveTime = 2500;
        Prims.setTime(strip);

        if (Prims.martyBlocks && Prims.martyBlocks.marty) {
            Prims.martyBlocks.whistle();
            Prims.showTime(strip);
        } else {
            ScratchAudio.sndFX('whistle.wav');
        }
        strip.waitTimer = parseInt(tinterval * intervalToSeconds * (moveTime / 1000));
        strip.thisblock = strip.thisblock.next;
    }

    /* End Marty Blocks */

    static sanitiseArgument(argValue) {
        const maxStepArgument = 20; //the maxmum number of steps we can make in one REST command
        if (argValue > maxStepArgument) {
            return maxStepArgument;
        } else {
            return argValue;
        }
    }

    static OnCogEvent(event) {
        // console.log("onCogEvent")
        // if executing a script, then don't do anything
        if (this.isScriptRunning()) {
            return;
        }
        
        var pair;
        var receivers = [];

        var findReceivers = function (block, s) {
            if (block.blocktype == 'ontouchcog' && event == 'ontouch') {
                receivers.push([s, block]);
            }
            if (block.blocktype == 'tiltany') {
                if (block.getArgValue() == "tiltright" && event == "tiltright") {
                    receivers.push([s, block]);
                }
                if (block.getArgValue() == 'tiltleft' && event == 'tiltleft') {
                    receivers.push([s, block]);
                }
                if (block.getArgValue() == 'tiltbackward' && event == 'tiltbackward') {
                    receivers.push([s, block]);
                }
                if (block.getArgValue() == 'tiltforward' && event == 'tiltforward') {
                    receivers.push([s, block]);
                }
                if (block.getArgValue() == 'tiltbackwardforward' && (event == 'tiltbackward' || event == 'tiltforward')) {
                    receivers.push([s, block]);
                }
                if (block.getArgValue() == 'tiltleftright' && (event == 'tiltright' || event == 'tiltleft')) {
                    receivers.push([s, block]);
                }
            }
            if (block.blocktype == 'onmove') {
                if (block.getArgValue() == 'onmove' && event == 'onmove') {
                    receivers.push([s, block]);
                }
                if (block.getArgValue() == 'onshake' && event == 'onshake') {
                    receivers.push([s, block]);
                }
            }
            if (block.blocktype == 'onobjectsensed') {
                if (block.getArgValue() == 'onobjectsensedleft' && event == 'onobjectsensedleft') {
                    receivers.push([s, block]);
                }
                if (block.getArgValue() == 'onobjectsensedright' && event == 'onobjectsensedright') {
                    receivers.push([s, block]);
                }
                if (block.getArgValue() == 'onnoobjectsensed' && event == 'onnoobjectsensed') {
                    receivers.push([s, block]);
                }
            }
            if (block.blocktype == 'onlight') {
                if (block.getArgValue() == 'onlowlight' && event == 'onlowlight') {
                    receivers.push([s, block]);
                }
                if (block.getArgValue() == 'onhighlight' && event == 'onhighlight') {
                    receivers.push([s, block]);
                }
                if (block.getArgValue() == 'onmidlight' && event == 'onmidlight') {
                    receivers.push([s, block]);
                }
            }
        }

        Prims.applyToAllStrips(['ontouchcog', 'tiltany', 'onmove', 'onobjectsensed', 'onlight'], findReceivers);
        var newthreads = [];
        for (var i in receivers) {
            pair = receivers[i];
            newthreads.push(ScratchJr.runtime.restartThread(pair[0], pair[1], true));
        }
    }


    static Message(strip) {
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

    static applyToAllStrips(list, fcn) {
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

    static isScriptRunning() {
        return ScratchJr.runtime.threadsRunning.some(thread => thread.isRunning);
    }
}


window.cogEvent = function (event) {
    Prims.OnCogEvent(event);
}


const convertNumberToSeconds = (time) => {
    return time * 3.125 * 10;
}