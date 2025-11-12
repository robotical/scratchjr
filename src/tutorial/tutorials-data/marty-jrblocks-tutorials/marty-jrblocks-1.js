/**
    * categories: 
        * sprite: sprite-start sprite-motion sprite-looks sprite-sound sprite-flow sprite-stop
        * marty: marty-start marty-motion marty-looks marty-sound marty-flow marty-stop
        * cog: cog-start cog-looks cog-sound
    * blocks: 
        * onflag_block
        * onmessage_block
        * onclick_block
        * ontouch_block
        * message_block
        * repeat_block
        * forward_block
        * back_block
        * up_block
        * down_block
        * right_block
        * left_block
        * home_block
        * hop_block
        * wait_block
        * setspeed_block
        * stopmine_block
        * startstopcounter_block
        * increasecounter_block
        * decreasecounter_block
        * say_block
        * show_block
        * hide_block
        * grow_block
        * shrink_block
        * same_block
        * playsnd_block
        * playusersnd_block
        * endstack_block
        * forever_block
        * gotopage_block
        * caretstart_block
        * caretend_block
        * caretrepeat_block
        * caretcmd_block
        * tiltany_block
        * ontouchcog_block
        * onshake_block
        * onobjectsensed_block
        * onlight_block
        * onrotate_block
        * setpattern_block
        * clearcolours_block
        * selectcolour_block
        * confusion_block
        * disbelief_block
        * excitement_block
        * noway_block
        * no_block
        * whistle_block
        * playnote_block
        * martyGetReady_block
        * martyDance_block
        * martyStepForward_block
        * martyStepBackward_block
        * martyStepLeft_block
        * martyStepRight_block
        * martyTurnRight_block
        * martyTurnLeft_block
        * martyKickRight_block
        * martyKickLeft_block
        * martyEyesExcited_block
        * martyEyesWide_block
        * martyEyesAngry_block
        * martyEyesNormal_block
        * martyEyesWiggle_block
        * martyWaveLeft_block
        * martyWaveRight_block
        * martyCelebrate_block
        * martyLedEyesP1_block
        * martyLedEyesP2_block
        * martyLedEyesColour_block
        * martyConfusion_block
        * martyDisbelief_block
        * martyExcitement_block
        * martyNoway_block
        * martyNo_block
        * martyWhistle_block
    * actions
        * ShowCategory
        * HighlightBlocks
        * HighlightElement
        * DragBlockToScriptArea
        * ShowMartyMode
    * onclick actions
        * NextStep 
 */

import Localization from "../../../utils/Localization";


const martyJrBlocksTutorial1 = {
    id: "marty-jr-blocks-1",
    platform: "blocksjr",
    title: Localization.localize("MARTY_JRBLOCKS1_TITLE"),
    description: "Learn the basics of BlocksJr with Marty!",
    tutorialSteps: [
        /* STEP 1 -- intro*/
        {
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "nextStep",
                    hexColor: "#855cd659"
                }
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_1_TEXT"),

                }
            ],
            buttons: ["readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 2 -- switch to Marty mode*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/step2.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_2_TEXT"),
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
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 3 -- functions*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/step3.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_3_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["none"],
                    hexColor: "#855cd659",
                    onClickAction: "NextStep"
                },
                {
                    type: "WaitForTime",
                    time: 1000,
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["all"],
                    hexColor: "#855cd659",
                    onClickAction: "NextStep"
                },
                {
                    type: "WaitForTime",
                    time: 1000,
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["none"],
                    hexColor: "#855cd659",
                    onClickAction: "NextStep"
                },
                {
                    type: "WaitForTime",
                    time: 1000,
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["all"],
                    hexColor: "#855cd659",
                    onClickAction: "NextStep"
                },
                {
                    type: "HighlightElement",
                    elementId: "nextStep",
                    hexColor: "#855cd659"
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 4 -- show go block */
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/step4.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_4_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["onflag_block"],
                    hexColor: "#855cd659",
                    onClickAction: "NextStep"
                },
                {
                    type: "WaitForTime",
                    time: 1000,
                },
                {
                    type: "HighlightElement",
                    elementId: "nextStep",
                    hexColor: "#855cd659"
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            presenter: "marty"
        },
        /* STEP 5 -- show stop block */
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/step5.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_5_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "ClickOnElement",
                    elementId: "marty-stop",
                    wait: 500
                },
                {waitForTime: 500},
                {
                    type: "HighlightBlocks",
                    blocks: ["endstack_block"],
                    hexColor: "#855cd659",
                },
                {
                    type: "HighlightElement",
                    elementId: "nextStep",
                    hexColor: "#855cd659"
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            presenter: "marty"
        },
        /* STEP 6 -- show movement blocks */
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/step6.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_6_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "ClickOnElement",
                    elementId: "marty-motion",
                    wait: 500
                },
                {waitForTime: 500},
                {
                    type: "HighlightBlocks",
                    blocks: ["martyStepForward_block", "martyStepBackward_block", "martyStepLeft_block", "martyStepRight_block"],
                    hexColor: "#855cd659",
                },
                {waitForTime: 500},
                {
                    type: "HighlightElement",
                    elementId: "nextStep",
                    hexColor: "#855cd659"
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 7 -- show wave blocks */
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/step7.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_7_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "ClickOnElement",
                    elementId: "marty-looks",
                    wait: 500
                },
                {waitForTime: 500},
                {
                    type: "HighlightBlocks",
                    blocks: ["martyWaveLeft_block", "martyWaveRight_block"],
                    hexColor: "#855cd659",
                },
                {waitForTime: 500},
                {
                    type: "HighlightElement",
                    elementId: "nextStep",
                    hexColor: "#855cd659"
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 8 -- show whistle block */
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/step8.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_8_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "ClickOnElement",
                    elementId: "marty-sound",
                    wait: 500
                },
                {waitForTime: 500},
                {
                    type: "HighlightBlocks",
                    blocks: ["martyWhistle_block"],
                    hexColor: "#855cd659",
                },
                {waitForTime: 500},
                {
                    type: "HighlightElement",
                    elementId: "nextStep",
                    hexColor: "#855cd659"
                }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 9 -- show wait block*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/step9.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_9_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "ClickOnElement",
                    elementId: "marty-flow",
                    wait: 500
                },
                {waitForTime: 500},
                {
                    type: "HighlightBlocks",
                    blocks: ["wait_block"],
                    hexColor: "#855cd659",
                },
                {waitForTime: 500},
                {
                    type: "HighlightElement",
                    elementId: "nextStep",
                    hexColor: "#855cd659"
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 10-- show dance block */
        {
            instructionActions: [
                {
                   type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/step10.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_10_TEXT"),
                }
            ],
            nextStepActions: [
                 {
                    type: "ClickOnElement",
                    elementId: "marty-motion",
                    wait: 500
                },
                {waitForTime: 500},
                {
                    type: "HighlightBlocks",
                    blocks: ["martyDance_block"],
                    hexColor: "#855cd659",
                },
                {waitForTime: 500},
                {
                    type: "HighlightElement",
                    elementId: "nextStep",
                    hexColor: "#855cd659"
                }
            ],
            hintActions: [

            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 11 -- add green flag block*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/greenFlag.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_11_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "ClickOnElement",
                    elementId: "marty-start",
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onflag_block"]
                }
            ],
            hintActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["onflag_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onflag_block",
                }
            ],
            buttons: ["previous", "readAloud", "next",  "hint"],
            expectedCode: ["onflag"],
            presenter: "marty"
        },
        /* STEP 12 -- add stop block*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/greenFlagAndStop.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_12_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "ClickOnElement",
                    elementId: "marty-stop",
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["endstack_block"]
                }
            ],
            hintActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["endstack_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "endstack_block",
                }
            ],
            buttons: ["previous", "readAloud", "next",  "hint"],
            expectedCode: ["onflag", "endstack"],
            presenter: "marty"
        },
        /* STEP 13 -- add get ready block*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/getReady.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_13_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "ClickOnElement",
                    elementId: "marty-motion",
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["martyGetReady_block"]
                }
            ],
            hintActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["martyGetReady_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "martyGetReady_block",
                }
            ],
            buttons: ["previous", "readAloud", "next",  "hint"],
            expectedCode: ["onflag=>martyGetReady", "endstack"],
            presenter: "marty"
        },
        /* STEP 14 -- add walk forward blocks*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/walkForward.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_14_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["martyStepForward_block"],
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: ["onflag=>martyGetReady=>martyStepForward=>martyStepForward=>martyStepForward=>martyStepForward=>endstack"],
            presenter: "marty"
        },
        /* STEP 15 -- add slide left blocks*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/1/forwardThenLeft.png",
                    text: Localization.localize("MARTY_JRBLOCKS1_STEP_15_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["martyStepLeft_block"],
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: ["onflag=>martyGetReady=>martyStepForward=>martyStepForward=>martyStepForward=>martyStepForward=>martyStepLeft=>martyStepLeft=>martyStepLeft=>endstack"],
            presenter: "marty"
        },
        /* STEP 16 -- end */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("MARTY_JRBLOCKS1_END"),
                }
            ],
            nextStepActions: [],
            hintActions: [],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        }
    ]
}

export default martyJrBlocksTutorial1;
