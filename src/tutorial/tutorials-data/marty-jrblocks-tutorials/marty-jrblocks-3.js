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


const martyJrBlocksTutorial3= {
    id: "marty-jr-blocks-3",
    platform: "blocksjr",
    title: Localization.localize("MARTY_JRBLOCKS3_TITLE"),
    description: "Learn how to use wait blocks and make a Marty traffic light!",
    tutorialSteps: [
        /* STEP 1 -- intro**/
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
                    text: Localization.localize("MARTY_JRBLOCKS3_STEP_1_TEXT"),
                   
                }
            ],
            buttons: ["readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 2 --connect to Marty*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("MARTY_JRBLOCKS3_STEP_2_TEXT"),
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
        /* STEP 3 -- green flag*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText", 
                    text: Localization.localize("MARTY_JRBLOCKS3_STEP_3_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["onflag_block"]
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 4 -- red end block*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText", 
                    text: Localization.localize("MARTY_JRBLOCKS4_STEP_3_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["stopmine_block"]
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 5 -- talk about waiting*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText", 
                    text: Localization.localize("MARTY_JRBLOCKS3_STEP_5_TEXT"),
                }
            ],
            nextStepActions: [
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
        /* STEP 6 -- traffic light example*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                     url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/3/trafficLight.png",
                    text: Localization.localize("MARTY_JRBLOCKS3_STEP_6_TEXT"),
                }
            ],
            nextStepActions: [
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
        /* STEP 7 -- LED eye blocks */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                     url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/3/eyesBlocks.png",
                    text: Localization.localize("MARTY_JRBLOCKS3_STEP_7_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["martyLedEyesColour_block"]
                },
            ],
            hintActions: [ ],
            buttons: ["previous", "readAloud", "next"],
            presenter: "marty"
        },
        /* STEP 8 -- code order */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/3/codeOrder.png",
                    text: Localization.localize("MARTY_JRBLOCKS3_STEP_8_TEXT"),
                }
            ],
            nextStepActions: [
              {  type: "HighlightElement",
                    elementId: "nextStep",
                    hexColor: "#855cd659"
              }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 9 -- add wait blocks*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                     url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/3/waitBlocksAdded.png",
                    text: Localization.localize("MARTY_JRBLOCKS3_STEP_9_TEXT"),
                }
            ],
            nextStepActions: [
                {
                  type: "HighlightBlocks",
                    blocks: ["wait_block"]
                }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 10 -- add  get ready block */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/3/getReadyAdded.png",
                    text: Localization.localize("MARTY_JRBLOCKS3_STEP_10_TEXT"),
                }
            ],
            nextStepActions: [
                {
                   type: "HighlightBlocks",
                    blocks: ["martyGetReady_block"]
                }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 11 -- add celebrate*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                     url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/3/celebrateAdded.png",
                    text: Localization.localize("MARTY_JRBLOCKS3_STEP_11_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["martyCelebrate_block"]
                }
            ],
            hintActions: [ ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
       
        /* STEP 11 -- end */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/3/celebrateAdded.png",
                    text: Localization.localize("MARTY_JRBLOCKS3_END"),
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

export default  martyJrBlocksTutorial3;
