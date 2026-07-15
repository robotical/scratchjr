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

import Localization from "../../utils/Localization";


const cogAndMartyTutorial = {
    id: "cog-and-marty-tutorial",
    platform: "blocksjr",
    title: Localization.localize("COG_AND_MARTY_TUTORIAL_TITLE"),
    description: "Learn how Cog and Marty can interact with each other",
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
                    text: Localization.localize("COG_AND_MARTY_TUTORIAL_INTRO"),
                    // text: "In this tutorial, we will learn how Cog and Marty can interact with each other. Press 'Next' to start!"
                }
            ],
            buttons: ["readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 1.1 --connect to Cog */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_AND_MARTY_TUTORIAL_CONNECT_COG"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "cogConnectionButton",
                    hexColor: "#855cd659",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 1.2 --connect to Marty */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_AND_MARTY_TUTORIAL_CONNECT_MARTY"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "martyConnectionButton",
                    hexColor: "#855cd659",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 2 -- enter Marty mode and go to Cog event blocks */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_AND_MARTY_TUTORIAL_COG_BLOCKS"),
                }
            ],
            nextStepActions: [
                {
                    type: "ShowMartyMode",
                },
                {
                    type: "HighlightElement",
                    elementId: "cog-start",
                    hexColor: "#855cd659",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            presenter: "marty"
        },
        /* STEP 3 -- add ontouchcog block to Marty's script */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_AND_MARTY_TUTORIAL_ONTOUCHCOG"),
                }
            ],
            nextStepActions: [
                {
                    type: "ShowMartyMode",
                },
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
                    type: "ShowMartyMode",
                },
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
            buttons: ["previous", "readAloud", "next", "hint"],
            expectedCode: ["ontouchcog"],
            presenter: "marty"
        },
        /* STEP 4 -- go to marty motion blocks */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_AND_MARTY_TUTORIAL_MARTY_MOTION_BLOCKS"),
                }
            ],
            nextStepActions: [
                {
                    type: "ShowMartyMode",
                },
                {
                    type: "HighlightElement",
                    elementId: "marty-motion",
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
        /* STEP 5 -- add marty dance block after the Cog trigger */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_AND_MARTY_TUTORIAL_MARTY_DANCE_BLOCK"),
                }
            ],
            nextStepActions: [
                {
                    type: "ShowMartyMode",
                },
                {
                    type: "ShowCategory",
                    category: "marty-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["martyDance_block"]
                }
            ],
            hintActions: [
                {
                    type: "ShowMartyMode",
                },
                {
                    type: "ShowCategory",
                    category: "marty-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["martyDance_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "martyDance_block",
                }
            ],
            buttons: ["previous", "readAloud", "next", "hint"],
            expectedCode: ["ontouchcog=>martyDance"],
            presenter: "marty"
        },
        /* STEP 6 -- end */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_AND_MARTY_TUTORIAL_END"),
                }
            ],
            nextStepActions: [],
            hintActions: [],
            buttons: ["previous", "readAloud",],
            expectedCode: [],
            presenter: "marty"
        }
    ]
}

export default cogAndMartyTutorial;
