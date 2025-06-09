import Localization from "../../utils/Localization";

const cogJrBlocksTutorial11 = {
    id: "cog-jrblocks-11",
    platform: "blocksjr",
    title: Localization.localize("COG_JRBLOCKS11_TITLE"),
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_1_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_2_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_3_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_4_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_5_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_6_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_7_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_8_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_9_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_10_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_11_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_12_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_13_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_14_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_15_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_16_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_17_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_18_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_19_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_20_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_21_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_22_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_23_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_24_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_25_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_26_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_27_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_28_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_29_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_30_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_31_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_32_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_33_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_34_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_35_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_36_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_37_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_38_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS11_STEP_44_TEXT")
                }
            ],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial11;