import Localization from "../../utils/Localization";

const cogJrBlocksTutorial8 = {
    id: "cog-jrblocks-8",
    platform: "blocksjr",
    title: Localization.localize("COG_JRBLOCKS8_TITLE"),
    description: "We introduce the light sensor on cog, and use it to turn on the lights automatically",
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
                    text: Localization.localize("COG_JRBLOCKS8_STEP_1_TEXT")
                }
            ],
            buttons: ["next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 2 - go to the cog event blocks
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/2-cogEvents.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_2_TEXT")
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
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 3 - Add a start on light block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/3-light.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_3_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onlight_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onlight_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onlight_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onlight"],
            presenter: "marty"
        },

        // step 4 - change it to on dark
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/light-dark.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_4_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onlight"],
            presenter: "marty"
        },

        // step 5 - add a set color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/5-setColor.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_5_TEXT")
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
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onlight=>selectcolour"],
            presenter: "marty"
        },

        // step 6 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/cogLightSenseOn.gif",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_6_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 7 - Add another start on light block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/7-secondOnLight.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_7_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onlight_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onlight_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onlight_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onlight=>selectcolour", "onlight"],
            presenter: "marty"
        },

        // step 8 - add a lights off block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/8-lightsOff.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_8_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["clearcolours_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["clearcolours_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "clearcolours_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onlight=>selectcolour", "onlight=>clearcolours"],
            presenter: "marty"
        },

        // step 9 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/cogLightSenseOnOff.gif",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_9_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 10 - add a third start on light block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/11-thirdOnLight.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_10_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onlight_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onlight_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onlight_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onlight=>selectcolour", "onlight=>clearcolours", "onlight"],
            presenter: "marty"
        },

        // step 11 - Change it to twilight
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/light-mid.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_11_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 12 - add another light color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/12-setColor.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_12_TEXT")
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
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onlight=>selectcolour", "onlight=>clearcolours", "onlight=>selectcolour"],
            presenter: "marty"
        },

        // step 13 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/cogLightSenseLevels.gif",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_13_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onlight=>selectcolour", "onlight=>clearcolours", "onlight=>selectcolour"],
            presenter: "marty"
        },

        // step 14 - Add a second scene
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/14-secondScene.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_14_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onlight=>selectcolour", "onlight=>clearcolours", "onlight=>selectcolour"],
            presenter: "marty"
        },

        // step 15 - Add lights to trigger when the scene is activated
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/15-scene2lights.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_15_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>setpattern"],
            presenter: "marty"
        },

        // step 16 - Add go to page 1 on bright light
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/16-goToPage.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_16_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>setpattern", "onlight=>gotopage"],
            presenter: "marty"
        },

        // step 17 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_17_TEXT")
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

        // step 18 - page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/18-page1.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_18_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 19 - change on dark to go to page 2 instead
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/19-goToPage.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_19_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onlight=>gotopage", "onlight=>clearcolours", "onlight=>selectcolour"],
            presenter: "marty"
        },

        // step 20 - Go To page 2 by putting cog into darkness
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/20-page2.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_20_TEXT")
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

        // step 21 - Add tilt left and right
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/21-tilt.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_21_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>setpattern", "onlight=>gotopage", "tiltany=>selectcolour", "tiltany=>selectcolour"],
            presenter: "marty"
        },   

        // step 22 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/waveCog.gif",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_22_TEXT")
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

        // step 23 - Go back to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/23-page1.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_23_TEXT")
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

        // step 24 - Add a daytime background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/24-background.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_24_TEXT")
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

        // step 25 - Go back to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/25-page2.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_25_TEXT")
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

        // step 26 - Add a night time background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/26-background.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_26_TEXT")
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

        // step 27 - Add a star sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/27-starSprite.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_27_TEXT")
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

        // step 28 - Add code to animate the star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/28-starCode.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_28_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>forward=>forever", "onflag=>right=>forever", "onflag=>shrink=>wait=>grow=>forever", "onflag=>up=>forever"],
            presenter: "marty"
        },

        // step 29 - Go back to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/29-page1.png",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_29_TEXT")
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

        // step 30 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_30_TEXT")
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


        // step 31 - Next steps
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS8_STEP_31_TEXT")
                }
            ],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial8;