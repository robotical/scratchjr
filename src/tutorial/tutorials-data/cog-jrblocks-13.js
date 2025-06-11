import Localization from "../../utils/Localization";

const cogJrBlocksTutorial13 = {
    id: "cog-jrblocks-13",
    platform: "blocksjr",
    title: Localization.localize("COG_JRBLOCKS13_TITLE"),
    description: "We'll make an interactive narrative adventure!",
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
                    text: Localization.localize("COG_JRBLOCKS13_STEP_1_TEXT")
                }
            ],
            buttons: ["next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 2 - background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/2-background.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_2_TEXT")
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

        // step 3 - Marty movement controls
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/3-moveControls.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_3_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>up", "tiltany=>down"],
            presenter: "marty"
        },

        // step 4 - Add an octopus sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/4-octopus.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_4_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["readAloud","previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 5 - Reposition the sprites
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/5-spritePosition.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_5_TEXT")
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

        // step 6 - add on bump block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/6-onBump.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_6_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["ontouch_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["ontouch_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "ontouch_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouch"],
            presenter: "marty"
        },

        // step 7 - add a say block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/7-say.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_7_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["say_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["say_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "say_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouch=>say"],
            presenter: "marty"
        },

        // step 8 - change the text
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/8-text.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_8_TEXT")
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

        // step 9 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/9-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_9_TEXT")
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

        // step 10 - Add another say block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/10-say.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_10_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say"],
            presenter: "marty"
        },

        // step 11 - more speech
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/11-say.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_11_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say=>say=>say"],
            presenter: "marty"
        },

        // step 12 - send message
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/12-sendMessage.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_12_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say=>say=>say=>message"],
            presenter: "marty"
        },

        // step 13 - Add a unicorn
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/13-unicorn.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_13_TEXT")
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

        // step 14 - Move the unicorn
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/14-unicornPosition.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_14_TEXT")
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

        // step 15 - make it be hidden
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/15-hide.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_15_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide"],
            presenter: "marty"
        },

        // step 16 - add movement
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/16-movement.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_16_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide", "onflag=>setspeed=>back=>forward=>forever"],
            presenter: "marty"
        },

        // step 17 - make the unicorn appear when the message is received
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/17-onMessage.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_17_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide", "onflag=>setspeed=>back=>forward=>forever", "onmessage=>show"],
            presenter: "marty"
        },

        // step 18 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/18-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_18_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 19 - Add an on bump block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/19-onBump.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_19_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide", "onflag=>setspeed=>back=>forward=>forever", "onmessage=>show", "ontouch"],
            presenter: "marty"
        },

        // step 20 - add a stop block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/20-stop.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_20_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["stopmine_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["stopmine_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "stopmine_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["onflag=>hide", "onflag=>setspeed=>back=>forward=>forever", "onmessage=>show", "ontouch=>stopmine"],
            presenter: "marty"
        },

        // step 21 - add say, hide, send message
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/21-message.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_21_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide", "onflag=>setspeed=>back=>forward=>forever", "onmessage=>show", "ontouch=>stopmine=>say=>hide=>message"],
            presenter: "marty"
        },   

        // step 22 - change it to be a red message
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/22-redMessage.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_22_TEXT")
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

        // step 23 - select the octopus
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/23-octopus.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_23_TEXT")
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

        // step 24 - add an on message block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/24-onMessage.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_24_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say=>say=>say=>message", "onmessage"],
            presenter: "marty"
        },

        // step 25 - Change it to red message
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/25-redMessage.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_25_TEXT")
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

        // step 26 - say stuff
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/26-say.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_26_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say=>say=>say=>message", "onmessage=>say=>say"],
            presenter: "marty"
        },

        // step 27 - add a send message block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/27-sendMessage.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_27_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say=>say=>say=>message", "onmessage=>say=>say=>message"],
            presenter: "marty"
        },  

        // step 28 - change it to a yellow message
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/28-yellowMessage.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_28_TEXT")
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

        // step 29 - add movement to the octopus
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/29-movement.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_29_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say=>say=>say=>message", "onmessage=>say=>say=>message", "onflag=>right=>wait=>left=>wait=>right=>forever"],
            presenter: "marty"
        },

        // step 30 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/30-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_30_TEXT")
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

        // step 31 - add a fort
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/31-fort.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_31_TEXT")
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

        // step 32 - position the fort
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/32-fortPosition.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_32_TEXT")
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

        // step 33 - hide the fort
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/33-hide.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_33_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide"],
            presenter: "marty"
        },

        // step 34 - appear on yellow message
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/34-yellowMessage.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_34_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide", "onmessage=>show"],
            presenter: "marty"
        },

        // step 35 - add page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/35-page2.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_35_TEXT")
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

        // step 36 - add a background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/36-background.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_36_TEXT")
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

        // step 37 - add a fort
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/37-fort.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_37_TEXT")
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

        // step 38 - make it big
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/38-bigFort.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_38_TEXT")
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

        // step 39 - go to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/39-page1.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_39_TEXT")
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

        // step 40 - ensure the fort is selected
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/40-fort.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_40_TEXT")
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

        // step 41 - on bump, go to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/41-fortCode.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_41_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide", "onmessage=>show", "ontouch=>gotopage"],
            presenter: "marty"
        },

        // step 42 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/42-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_42_TEXT")
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

        // step 43 - add a page 3
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/43-page3.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_43_TEXT")
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

        // step 44 - go to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/44-page2.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_44_TEXT")
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

        // step 45 - on flag speak
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/45-say.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_45_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>say"],
            presenter: "marty"
        },

        // step 46 - add an on shake, go to page 3
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/46-onShake.png",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_46_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>say", "onshake=>gotopage"],
            presenter: "marty"
        },

        // step 47 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_47_TEXT")
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

        // step 48 - Next steps
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS13_STEP_48_TEXT")
                }
            ],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial13;