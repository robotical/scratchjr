import Localization from "../../utils/Localization";

const cogJrBlocksTutorial12 = {
    id: "cog-jrblocks-12",
    platform: "blocksjr",
    title: Localization.localize("COG_JRBLOCKS12_TITLE"),
    description: "We'll make a game that tests your reactions with Cog!",
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
                    text: Localization.localize("COG_JRBLOCKS12_STEP_1_TEXT")
                }
            ],
            buttons: ["next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 2 - move Marty down
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/2-moveDown.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_2_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: ["onflag=>down=>forever"],
            presenter: "marty"
        },

        // step 3 - Send message on bump
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/3-sendMessage.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_3_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>down=>forever", "ontouch=>message"],
            presenter: "marty"
        },

        // step 4 - And make Cog light up briefly
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/4-cogLights.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_4_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["onflag=>down=>forever", "ontouch=>message", "ontouch=>selectcolour=>wait=>clearcolours"],
            presenter: "marty"
        },

        // step 5 - add a new sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/5-newSprite.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_5_TEXT")
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
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/6-drawSprite.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_6_TEXT")
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

        // step 7 - set the thickness
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/7-thickness.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_7_TEXT")
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

        // step 8 - draw a line
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/8-line.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_8_TEXT")
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

        // step 9 - move it
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/9-linePosition.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_9_TEXT")
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

        // step 10 - Move the line across the screen
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/10-moveLine.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_10_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>setspeed=>back"],
            presenter: "marty"
        },

        // step 11 - Try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/11-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_11_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 12 - Add a repeat
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/12-repeat.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_12_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>setspeed=>repeat=>back"],
            presenter: "marty"
        },

        // step 13 - Add an octopus
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/13-octopus.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_13_TEXT")
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

        // step 14 - Move the octopus
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/14-octopusPosition.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_14_TEXT")
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

        // step 15 - make it hop
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/15-jump.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_15_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouchcog=>hop"],
            presenter: "marty"
        },

        // step 16 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_16_TEXT")
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

        // step 17 - add a star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/17-star.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_17_TEXT")
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

        // step 18 - position it
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/18-starPosition.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_18_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 19 - show the star when message received
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/19-onmessage.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_19_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onmessage=>show", "onmessage=>wait=>hide"],
            presenter: "marty"
        },

        // step 20 - reset score and hide star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/20-resetAndHide.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_20_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onmessage=>show", "onmessage=>wait=>hide", "onflag=>startstopcounter=>hide"],
            presenter: "marty"
        },

        // step 21 - Try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/21-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_21_TEXT")
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

        // step 22 - increase score
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/22-increaseScore.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_22_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onmessage=>show", "onmessage=>wait=>hide", "onflag=>startstopcounter=>hide", "ontouch=>increasecounter=>hide"],
            presenter: "marty"
        },   

        // step 23 - add light and sound
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/23-lightSound.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_23_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onmessage=>show", "onmessage=>wait=>hide", "onflag=>startstopcounter=>hide", "ontouch=>increasecounter=>hide", "ontouch=>selectcolour=>playnote"],
            presenter: "marty"
        },

        // step 24 - Try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/24-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_24_TEXT")
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

        // step 25 - add a second page
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/25-page2.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_25_TEXT")
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

        // step 26 - game over
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/26-gameOver.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_26_TEXT")
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

        // step 27 - go to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/27-goToPage.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_27_TEXT")
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

        // step 28 - go back to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/28-page1.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_28_TEXT")
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

        // step 29 - select the line
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/29-line.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_29_TEXT")
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

        // step 30 - add a go to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/30-goToPage.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_30_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>setspeed=>repeat=>back=>gotopage"],
            presenter: "marty"
        },

        // step 31 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_31_TEXT")
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

        // step 32 - Select the star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/32-star.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_32_TEXT")
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

        // step 33 - replace the wait with a rest
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/33-rest.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_33_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onmessage=>show", "onmessage=>waitcrotchet=>hide", "onflag=>startstopcounter=>hide", "ontouch=>increasecounter=>hide", "ontouch=>selectcolour=>playnote"],
            presenter: "marty"
        },

        // step 34 - select the line
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/34-line.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_34_TEXT")
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

        // step 35 - go to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/35-reduceWait.png",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_35_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>setspeed=>settempo=>repeat=>back=>settempo=>repeat=>back=>gotopage"],
            presenter: "marty"
        },

        // step 36 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_36_TEXT")
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

        // step 47 - Next steps
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS12_STEP_47_TEXT")
                }
            ],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial12;