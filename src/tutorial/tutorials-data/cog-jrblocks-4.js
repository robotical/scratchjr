import Localization from "../../utils/Localization";

const cogJrBlocksTutorial4 = {
    id: "cog-jrblocks-4",
    platform: "blocksjr",
    title: Localization.localize("COG_JRBLOCKS4_TITLE"),
    description: "We'll introduce the tilt sensing on cog, and show how to interact with sprites in Jr Blocks",
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
                    text: Localization.localize("COG_JRBLOCKS4_STEP_1_TEXT")
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
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/2-events.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_2_TEXT")
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

        // step 3 - add a tilt block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/3-tiltBlock.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_3_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["tiltany_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["tiltany_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "tiltany_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany"],
            presenter: "marty"
        },

        // step 4 - select the sprite motion category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/4-motion.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_4_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "sprite-motion",
                    hexColor: "#FF0000",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany"],
            presenter: "marty"
        },

        // step 5 - add a move right block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/5-moveRight.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_5_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["forward_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["forward_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "forward_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward"],
            presenter: "marty"
        },

        // step 6 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/cogTiltRight.gif",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_6_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward"],
            presenter: "marty"
        },

        // step 7 - Add another on-tilt block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/7-secondTilt.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_7_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["tiltany_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["tiltany_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "tiltany_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany"],
            presenter: "marty"
        },

        // step 8 - Change the tilt direction to left
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/8-tiltLeft.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_8_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>right", "tiltany"],
            presenter: "marty"
        },

        // step 9 - add a move left block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/9-moveLeft.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_9_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["back_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["back_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "back_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back"],
            presenter: "marty"
        },

        // step 10 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/cogTiltLeft.gif",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_10_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back"],
            presenter: "marty"
        },

        // step 11 - Add a third tilt block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/11-thirdTilt.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_11_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["tiltany_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["tiltany_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "tiltany_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany"],
            presenter: "marty"
        },

        // step 12 - change the tilt direction to down
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/12-tiltDown.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_12_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany"],
            presenter: "marty"
        },

        // step 13 - Add a move down block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/13-moveDown.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_13_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["down_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["down_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "down_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down"],
            presenter: "marty"
        },

        // step 14 - add a fourth tilt block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/14-fourthTilt.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_14_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["tiltany_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["tiltany_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "tiltany_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany"],
            presenter: "marty"
        },

        // step 15 - change the tilt direction to up
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/15-tiltUp.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_15_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany"],
            presenter: "marty"
        },

        // step 16 - Add a move up block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/16-moveUp.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_16_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["up_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["up_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "up_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up"],
            presenter: "marty"
        },

        // step 17 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/cogTiltFwdBwd.gif",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_17_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up"],
            presenter: "marty"
        },

        // step 18 - Turn on the sprite trail
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/18-spriteTrail.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_18_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up"],
            presenter: "marty"
        },

        // step 19 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/cogTiltFwdBwd.gif",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_19_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up"],
            presenter: "marty"
        },

        // step 20 - Clear the trail
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/20-clearTrail.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_20_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up"],
            presenter: "marty"
        },

        // step 21 - select the control category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/21-control.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_21_TEXT")
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
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany"],
            presenter: "marty"
        },

        // step 22 - add a set speed block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/22-setSpeed.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_22_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["setspeed_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["setspeed_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "setspeed_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "setspeed"],
            presenter: "marty"
        },   

        // step 23 - set the speed to slow
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/23-selectSpeed.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_23_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "setspeed"],
            presenter: "marty"
        },

        // step 24 - click the set speed block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/24-clickSetSpeed.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_24_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "setspeed"],
            presenter: "marty"
        },

        // step 25 - draw something!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/25-drawSomething.png",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_25_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "setspeed"],
            presenter: "marty"
        },
        
        // step 26 - next steps!
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS4_STEP_26_TEXT")
                }
            ],
            buttons: ["readAloud", "previous"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial4;