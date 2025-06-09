import Localization from "../../utils/Localization";

const cogJrBlocksTutorial2 = {
    id: "cog-jrblocks-2",
    platform: "blocksjr",
    title: Localization.localize("COG_JRBLOCKS2_TITLE"),
    description: "We'll use loops to make cog light up in fun patterns",
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
                    text: Localization.localize("COG_JRBLOCKS2_STEP_1_TEXT")
                }
            ],
            buttons: ["readAloud","next"],
            expectedCode: [],
            presenter: "marty"
        },
        // Can we add automatic guidance to connect to cog, that only appears if they're not already connected?

        // step 2 - select the events category
        {
            instructionActions: [
            {
                type: "ShowInstructorImage",
                url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/2-events.png",
                text: Localization.localize("COG_JRBLOCKS2_STEP_2_TEXT")
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
            buttons: ["readAloud","previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 3 - pick the on touch event
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/3-buttonPress.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_3_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["ontouchcog_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["ontouchcog_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "ontouchcog_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog"],
            presenter: "marty"
        },

        // step 4 - go to the lights category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/4-lights.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_4_TEXT")
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
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog"],
            presenter: "marty"
        },

        // step 5 - set the LED color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/5-setColor.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_5_TEXT")
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
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>selectcolour"],
            presenter: "marty"
        },

        // step 6 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_6_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>selectcolour"],
            presenter: "marty"
        },


        // step 7 - Change the LED color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/7-chooseColor.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_7_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>selectcolour"],
            presenter: "marty"
        },

        // step 8 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_8_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>selectcolour"],
            presenter: "marty"
        },

        // step 9 - add another color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/9-secondColor.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_9_TEXT")
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
            buttons: ["readAloud","hint", "previous", "next"],
            expectedCode: ["ontouchcog=>selectcolour=>selectcolour"],
            presenter: "marty"
        },

        // step 10 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_10_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>selectcolour=>selectcolour"],
            presenter: "marty"
        },

        // step 11 - Select the control category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/11-control.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_11_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "sprite-flow",
                    hexColor: "#FF0000",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>selectcolour=>selectcolour"],
            presenter: "marty"
        },

        // step 12 - add a pause
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/12-addPause.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_12_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["wait_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["wait_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "wait_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>selectcolour=>wait=>selectcolour"],
            presenter: "marty"
        },

        // step 13 - Change the length of the pause
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/13-setPauseTime.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_13_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>selectcolour=>wait=>selectcolour"],
            presenter: "marty"
        },

        // step 14 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_14_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>selectcolour=>wait=>selectcolour"],
            presenter: "marty"
        },

        // step 15 - add a second pause
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/15-secondPause.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_15_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["wait_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["wait_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "wait_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>selectcolour=>wait=>selectcolour=>wait"],
            presenter: "marty"
        },

        // step 16 - set the second pause to 1s
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/16-setPauseTime.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_16_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>selectcolour=>wait=>selectcolour=>wait"],
            presenter: "marty"
        },


        // step 17 - add a loop
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/17-loop.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_17_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["repeat_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["repeat_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "repeat_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>repeat=>selectcolour=>wait=>selectcolour=>wait"],
            presenter: "marty"
        },

        // step 18 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_18_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>repeat=>selectcolour=>wait=>selectcolour=>wait"],
            presenter: "marty"
        },


        // step 19 - change the number of repeats
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/19-setLoopRepeats.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_19_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>selectcolour=>wait=>selectcolour=>wait"],
            presenter: "marty"
        },

        // step 20 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_20_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>selectcolour=>wait=>selectcolour=>wait"],
            presenter: "marty"
        },

        // step 21 - Select the lights category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/4-lights.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_21_TEXT")
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
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>repeat=>selectcolour=>wait=>selectcolour=>wait"],
            presenter: "marty"
        },

        // step 22 - add a light pattern block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/22-addPattern.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_22_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["setpattern_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["setpattern_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "setpattern_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>repeat=>selectcolour=>wait=>selectcolour=>wait=>setpattern"],
            presenter: "marty"
        },

        // step 23 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_23_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>repeat=>selectcolour=>wait=>selectcolour=>wait=>setpattern"],
            presenter: "marty"
        },

        // step 24 - change the pattern
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/24-changePattern.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_24_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>repeat=>selectcolour=>wait=>selectcolour=>wait=>setpattern"],
            presenter: "marty"
        },

        // step 25 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_25_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>repeat=>selectcolour=>wait=>selectcolour=>wait=>setpattern"],
            presenter: "marty"
        },

        // step 26 - change the pattern
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/26-changePattern.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_26_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>repeat=>selectcolour=>wait=>selectcolour=>wait=>setpattern"],
            presenter: "marty"
        },

        // step 27 - add a delay and change the time
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/27-addDelay.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_27_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["wait_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["wait_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "wait_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>repeat=>selectcolour=>wait=>selectcolour=>wait=>setpattern=>wait"],
            presenter: "marty"
        },

        // step 28 - turn the lights off
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/28-lightsOff.png",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_28_TEXT")
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
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>repeat=>selectcolour=>wait=>selectcolour=>wait=>setpattern=>wait=>clearcolours"],
            presenter: "marty"
        },

        // step 29 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/2/pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_29_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>repeat=>selectcolour=>wait=>selectcolour=>wait=>setpattern=>clearcolours"],
            presenter: "marty"
        },

        // step 30 - next steps
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS2_STEP_30_TEXT")
                }
            ],
            nextStepActions: [],
            hintActions: [],
            buttons: ["readAloud","previous", "readAloud",],
            expectedCode: [],
            presenter: "marty"
        }
    ]
}

export default cogJrBlocksTutorial2;