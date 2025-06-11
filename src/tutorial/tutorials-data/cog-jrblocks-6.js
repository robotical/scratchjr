import Localization from "../../utils/Localization";

const cogJrBlocksTutorial6 = {
    id: "cog-jrblocks-6",
    platform: "blocksjr",
    title: Localization.localize("COG_JRBLOCKS6_TITLE"),
    description: "We'll use the IR sensors on cog to detect obstacles!",
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
                    text: Localization.localize("COG_JRBLOCKS6_STEP_1_TEXT")
                }
            ],
            buttons: ["readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 2 - select the events category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/2-cogEvents.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_2_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "cog-start",
                    hexColor: "#FF0000",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 3 - add an object sensed block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/3-objectSensed.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_3_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onobjectsensed_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onobjectsensed_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onobjectsensed_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onobjectsensed"],
            presenter: "marty"
        },

        // step 4 - select the cog lights category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/4-lights.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_4_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "cog-looks",
                    hexColor: "#FF0000",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["onobjectsensed"],
            presenter: "marty"
        },

        // step 5 - add a set color block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/5-setColor.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_5_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["selectcolour_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["selectcolour_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "selectcolour_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onobjectsensed=>selectcolour"],
            presenter: "marty"
        },

        // step 6 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/6-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_6_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 7 - Add another object sensed block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/7-secondObjectSensed.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_7_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onobjectsensed_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onobjectsensed_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onobjectsensed_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onobjectsensed=>selectcolour", "onobjectsensed"],
            presenter: "marty"
        },

        // step 8 - change it to the right sensor
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/irSense-right.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_8_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 9 - add another set color block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/9-setColor.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_9_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["selectcolour_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["selectcolour_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "selectcolour_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onobjectsensed=>selectcolour", "onobjectsensed=>selectcolour"],
            presenter: "marty"
        },

        // step 10 - change the color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/10-changeColor.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_10_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["onobjectsensed=>selectcolour", "onobjectsensed=>selectcolour"],
            presenter: "marty"
        },

        // step 11 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/11-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_11_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 12 - add a bus sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/12-busSprite.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_12_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 13 - Add another scene
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/13-addScene.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_13_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 14 - Add a bus sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/14-busSprite.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_14_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 15 - Add a background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/15-addBackground.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_15_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 16 - Click the text button
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/16-text.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_16_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 17 - add the text "Look Out Behind"
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/17-lookOutBehind.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_17_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 18 - Select the cog event blocks
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/2-cogEvents.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_18_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "cog-start",
                    hexColor: "#FF0000",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 19 - add an on object sensed block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/3-objectSensed.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_19_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onobjectsensed_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onobjectsensed_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onobjectsensed_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onobjectsensed"],
            presenter: "marty"
        },

        // step 20 - Add a set color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/5-setColor.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_20_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["selectcolour_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["selectcolour_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "selectcolour_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onobjectsensed=>selectcolour"],
            presenter: "marty"
        },

        // step 21 - Add a note
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/21-addNote.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_21_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["playnote_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["playnote_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "playnote_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint", "readAloud"],
            expectedCode: ["onobjectsensed=>selectcolour=>playnote"],
            presenter: "marty"
        },   

        // step 22 - add another color and a rest
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/22-colorAndRest.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_22_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["onobjectsensed=>selectcolour=>playnote=>selectcolour=>waitcrotchet"],
            presenter: "marty"
        },   

        // step 23 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/23-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_23_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 24 - Add obstacle sense, wait, clear color, go to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/24-addBlocks.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_24_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed=>selectcolour=>playnote=>selectcolour=>waitcrotchet", "onobjectsensed=>wait=>clearcolours=>gotopage"],
            presenter: "marty"
        },  

        // step 25 - Change the object sense to no object
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/25-setNoObstacle.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_25_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed=>selectcolour=>playnote=>selectcolour=>playnote", "onobjectsensed=>wait=>clearcolours=>gotopage"],
            presenter: "marty"
        },

        // step 26 - back to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/26-page1.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_26_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 27 - select the Marty sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/27-martySprite.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_27_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },  

        // step 28 - add go to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/28-goToPage2.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_28_TEXT")
                }
            ],
            nextStepActions: [
                                {
                    type: "ShowCategory",
                    category: "sprite-stop"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["gotopage_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-stop"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["gotopage_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "gotopage_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "readAloud","hint"],
            expectedCode: ["onobjectsensed=>selectcolour=>gotopage", "onobjectsensed=>selectcolour"],
            presenter: "marty"
        },

        // step 29 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/29-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_29_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 30 - Add another scene
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/30-addScene.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_30_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 31 - make the scene
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/31-scene.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_31_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 32 - add sound and light
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/32-soundAndLight.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_32_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>playnote=>clearcolours=>playnote"],
            presenter: "marty"
        },

        // step 33 - add a repeat forever block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/33-forever.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_33_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-stop"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["forever_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-stop"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["forever_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "forever_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>playnote=>clearcolours=>playnote=>forever"],
            presenter: "marty"
        },  

        // step 34 - add no object blocks
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/34-noObjectBlocks.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_34_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>playnote=>clearcolours=>playnote=>forever", "onobjectsensed=>wait=>clearcolours=>gotopage"],
            presenter: "marty"
        },

        // step 35 - change it to be no object
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/35-setNoObject2.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_35_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>playnote=>clearcolours=>playnote=>forever", "onobjectsensed=>wait=>clearcolours=>gotopage"],
            presenter: "marty"
        },  

        // step 36 - back to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/36-page1.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_36_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },  

        // step 37 - add go to page 3, lights off
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/37-lastCode.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_37_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed=>selectcolour=>gotopage", "onobjectsensed=>selectcolour=>gotopage", "onflag=>clearcolours"],
            presenter: "marty"
        },

        // step 39 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_39_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },  

        // step 39 - Try it out in fullscreen!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/39-fullscreen.png",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_39_FULLSCREEN_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 40 - next steps!
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS6_STEP_40_TEXT")
                }
            ],
            buttons: ["readAloud", "previous"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial6;