import Localization from "../../utils/Localization";

const cogJrBlocksTutorial10 = {
    id: "cog-jrblocks-10",
    platform: "blocksjr",
    title: Localization.localize("COG_JRBLOCKS10_TITLE"),
    description: "We'll use the Marty simulator to explore a different way of moving!",
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
                    text: Localization.localize("COG_JRBLOCKS10_STEP_1_TEXT")
                }
            ],
            buttons: ["next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 2 - add a gym background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/2-martyMode.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_2_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "martyMode",
                    hexColor: "#855cd659",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 3 - Add an on flag block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/3-onFlag.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_3_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "marty-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onflag_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "marty-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onflag_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onflag_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onflag"],
            presenter: "marty"
        },

        // step 4 - Go to the Marty motion category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/4-martyMotion.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_4_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "marty-motion",
                    hexColor: "#FF0000",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["onflag"],
            presenter: "marty"
        },

        // step 5 - add a forward block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/5-forward.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_5_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "marty-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["martyStepForward_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "marty-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["martyStepForward_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "martyStepForward_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onflag=>martyStepForward"],
            presenter: "marty"
        },

        // step 6 - Change it to 5 steps
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/6-set5steps.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_6_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>martyStepForward"],
            presenter: "marty"
        },

        // step 7 - Add a turn right block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/7-turnRight.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_7_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "marty-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["martyTurnRight_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "marty-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["martyTurnRight_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "martyTurnRight_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onflag=>martyStepForward=>martyTurnRight"],
            presenter: "marty"
        },

        // step 8 - Set it to 9 steps
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/8-set9steps.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_8_TEXT")
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

        // step 9 - Add another marty forward
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/9-forward.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_9_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "marty-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["martyStepForward_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "marty-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["martyStepForward_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "martyStepForward_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onflag=>martyStepForward=>martyTurnRight=>martyStepForward"],
            presenter: "marty"
        },

        // step 10 - activate the trail
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/10-trail.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_10_TEXT")
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

        // step 11 - Run the code
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/11-greenFlag.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_11_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>martyStepForward=>martyTurnRight=>martStepForward"],
            presenter: "marty"
        },

        // step 12 - What happened?
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/12-whatHappened.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_12_TEXT")
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

        // step 13 - Clear the trail
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/13-clearTrail.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_13_TEXT")
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

        // step 14 - Add a loop
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/14-loop.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_14_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "marty-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["repeat_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "marty-flow"
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
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onflag=>repeat=>martyStepForward=>martyTurnRight"],
            presenter: "marty"
        },

        // step 15 - Run the code
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/11-greenFlag.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_15_TEXT")
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

        // step 16 - what shape?
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/16-shape.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_16_TEXT")
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

        // step 17 - code explanation - side length
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/17-squareExplain-1.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_17_TEXT")
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

        // step 18 - code explanation - angle
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/18-squareExplain-2.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_18_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 19 - code explanation - repeat
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/19-squareExplain-3.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_19_TEXT")
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

        // step 20 - clear the trail
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/13-clearTrail.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_20_TEXT")
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

        // step 21 - change to 6 turn and 6 repeats
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/21-hexCode.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_21_TEXT")
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

        // step 22 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/11-greenFlag.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_22_TEXT")
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

        // step 23 - what shape?
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/23-hexagon.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_23_TEXT")
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

        // step 24 - can you make a triangle?
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/24-triangle.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_24_TEXT")
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

        // step 25 - What shape?
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/25-whatShape.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_25_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>repeat=>repeat=>martyStepForward=>martyTurnRight"],
            presenter: "marty"
        },

        // step 26 - see what happens
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/26-hexatriacontagon.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_26_TEXT")
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

        // step 27 - maths is fun
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_27_TEXT")
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

        // step 28 - what shape?
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/28-whatShape.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_28_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>repeat=>martyStepForward=>martyTurnRight=>repeat=>martyStepForward=>martyTurnRight"],
            presenter: "marty"
        },

        // step 29 - spiral
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/29-spiralStart.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_29_TEXT")
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
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/30-spiralEnd.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_30_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>repeat=>martyStepForward=>martyTurnRight=>repeat=>martyStepForward=>martyTurnRight=>repeat=>martyStepForward=>martyTurnRight=>repeat=>martyStepForward=>martyTurnRight"],
            presenter: "marty"
        },

        // step 31 - clear code
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/31-clearCode.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_31_TEXT")
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

        // step 32 - Add cog movement blocks
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/32-cogMove.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_32_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>martyStepForward", "tiltany=>martyStepBackward", "tiltany=>martyStepLeft", "tiltany=>martyStepRight"],
            presenter: "marty"
        },

        // step 33 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/33-tryItOut.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_33_TEXT")
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

        // step 34 - Add turn
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/34-turn.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_34_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>martyStepForward", "tiltany=>martyStepBackward", "tiltany=>martyStepLeft", "tiltany=>martyStepRight", "onobjectsensed=>martyTurnRight", "onobjectsensed=>martyTurnLeft"],
            presenter: "marty"
        },

        // step 35 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/10/35-tryItOut.png",
                    text: Localization.localize("COG_JRBLOCKS10_STEP_35_TEXT")
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
                    text: Localization.localize("COG_JRBLOCKS10_STEP_44_TEXT")
                }
            ],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial10;