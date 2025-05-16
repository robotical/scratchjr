const cogJrBlocksTutorial11 = {
    id: "cog-jrblocks-11",
    platform: "blocksjr",
    title: "Space Game",
    description: "We'll make a game where you fly a rocket through space!",
    tutorialSteps: [
        /* STEP 1 -- intro*/
        {
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "nextStep",
                    hexColor: "#FF0000"
                }
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Let's make a game set in space!"
                }
            ],
            buttons: ["next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 2 - turn on marty mode
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/2-background.png",
                    text: "Add a <b>space background</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 3 - Add a rocket sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/3-rocket.png",
                    text: "Add a <b>rocket sprite</B>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 4 - adjust the rocket
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/4-rocketPosition.png",
                    text: "Make the rocket smaller and move it to the bottom"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["readAloud","previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 5 - delete the marty sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/5-deleteMarty.png",
                    text: "<b>Delete the Marty sprite</b> by pressing and holding it"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 6 - add motion control
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/6-motionControl.png",
                    text: "Add <b>tilt left</b> and <b>tilt right</b> blocks to add motion control"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>back", "tiltany=>forward"],
            presenter: "marty"
        },

        // step 7 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/cogTiltLeft.gif",
                    text: "Try it out!<br /><br />Tilt cog <b>left and right</b> to move the rocket"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 8 - increase the rocket speed
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/8-speed.png",
                    text: "Make the rocket move faster!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["tiltany=>back", "tiltany=>forward", "onflag=>setspeed"],
            presenter: "marty"
        },

        // step 9 - Add a star sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/9-star.png",
                    text: "Add a <b>star sprite</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 10 - Move it to the top of the screen
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/10-moveStar.png",
                    text: "Move it to the top of the screen"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 11 - Make it fall down the screen
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/11-down.png",
                    text: "Make it move down <b>15 steps</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>down"],
            presenter: "marty"
        },

        // step 12 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/12-tryItOut.gif",
                    text: "<b>Try it out!</b><Br/><Br />Press the green flag to run the code"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 13 - Add a loop
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/13-repeat.png",
                    text: "Make it happen <b>10 times</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>repeat=>down"],
            presenter: "marty"
        },

        // step 14 - Move the star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/14-right.png",
                    text: "Add a <b>forward</b> block to make the star come down in a different place each time"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onflag=>repeat=>down=>forward"],
            presenter: "marty"
        },

        // step 15 - Speed it up
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/15-speed.png",
                    text: "Speed up that movement"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>repeat=>setspeed=>down=>setspeed=>forward"],
            presenter: "marty"
        },

        // step 16 - hide the star while it's moving
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/16-hideStar.png",
                    text: "Hide the star while it's moving sideways"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>repeat=>setspeed=>down=>hide=>setspeed=>forward=>show"],
            presenter: "marty"
        },

        // step 17 - hide the star when the rocket collects it
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/17-onBump.png",
                    text: "Also hide the star when the rocket collects it"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>repeat=>setspeed=>down=>hide=>setspeed=>forward=>show", "ontouch=>hide"],
            presenter: "marty"
        },

        // step 18 - go back to the rocket sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/18-rocket.png",
                    text: "Go back to the <b>rocket sprite</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 19 - add a score reset
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/19-resetScore.png",
                    text: "Add blocks to <b>reset the counter</b> at the start"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>back", "tiltany=>forward", "onflag=>setspeed", "onflag=>startstopcounter"],
            presenter: "marty"
        },

        // step 20 - clear the trail
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/20-increaseScore.png",
                    text: "Increase the score when the rocket collects a star"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>back", "tiltany=>forward", "onflag=>setspeed", "onflag=>startstopcounter", "ontouch=>increasecounter"],
            presenter: "marty"
        },

        // step 21 - add light feedback
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/21-lightFeedback.png",
                    text: "Also <b>add some lights</b> when a star is collected"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>back", "tiltany=>forward", "onflag=>setspeed", "onflag=>startstopcounter", "ontouch=>increasecounter", "ontouch=>setpattern=>wait=>clearcolours"],
            presenter: "marty"
        },   

        // step 22 - and a sound
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/22-sound.png",
                    text: "Add a sound too"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>back", "tiltany=>forward", "onflag=>setspeed", "onflag=>startstopcounter", "ontouch=>increasecounter", "ontouch=>setpattern=>wait=>clearcolours", "ontouch=>playnote"],
            presenter: "marty"
        },   

        // step 23 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/23-tryItOut.gif",
                    text: "Try it out!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 24 - add background lights
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/24-backgroundLights.png",
                    text: "Add some background lights and set them to repeat forever"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>back", "tiltany=>forward", "onflag=>setspeed", "onflag=>startstopcounter", "ontouch=>increasecounter", "ontouch=>setpattern=>wait=>clearcolours", "ontouch=>playnote", "onflag=>selectcolour=>wait=>setpattern=>wait=>selectcolour=>wait=>setpattern=>wait=>forever"],
            presenter: "marty"
        },

        // step 25 - add another star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/25-secondStar.png",
                    text: "Add another star"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 26 - move it to the top of the screen
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/26-moveStar.png",
                    text: "Move it to the top of the screen too"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 27 - select the first star sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/27-firstStar.png",
                    text: "Select the first star"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },  

        // step 28 - copy the code to the new star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/28-copyCode.gif",
                    text: "Copy the code to the new star by <b>holding and dragging</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 29 - select the second star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/29-secondStar.png",
                    text: "Select the second star"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 30 - finish the spiral
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/30-changeMoves.png",
                    text: "Change the movement and the number of repeats"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 31 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/31-tryItOut.gif",
                    text: "Try it out!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 32 - Add a second page
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/32-page2.png",
                    text: "Add a <b>second page</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 33 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/33-gameOver.png",
                    text: "Make a <b>Game over screen</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 34 - Add shake to go to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/34-shake.png",
                    text: "Add <b>shake to go to page 1</b> blocks"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onshake=>gotopage"],
            presenter: "marty"
        },

        // step 35 - go to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/35-page1.png",
                    text: "Go back to <b>page 1</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 36 - select a star sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/36-star.png",
                    text: "Select a star sprite"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 37 - add a go to page 2 block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/11/37-goToPage.png",
                    text: "Add a <b>Go to page 2</b> block"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>repeat=>setspeed=>down=>hide=>setspeed=>forward=>show=>gotopage", "ontouch=>hide"],
            presenter: "marty"
        },

        // step 38 - Try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Try it out! Press the green flag to start, then shake cog to restart"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 44 - Next steps
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "<p><b>Well done!</b><br />You've made a space game!<br /><br />Can you add more stars to collect?"
                }
            ],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial11;