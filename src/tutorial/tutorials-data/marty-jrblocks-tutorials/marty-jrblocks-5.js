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


const martyJrBlocksTutorial5= {
    id: "marty-jr-blocks-5",
    platform: "blocksjr",
    title: Localization.localize("MARTY_JRBLOCKS5_TITLE"),
    description: "Make a a Marty Goal Shooter game!",
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
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_1_TEXT"),
                   
                }
            ],
            buttons: ["readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 2 --add field backdrop*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                     url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/chooseFarmBackdrop.gif", 
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_2_TEXT"),
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
        /* STEP 3 -- choose sprites*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText", 
                     url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/chooseSprites.gif", 
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_3_TEXT"),
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
        /* STEP 4 -- sprite positioning*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                     url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/initialSpritePlacement.png",  
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_4_TEXT"),
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
        /* STEP 5 -- select marty in sprite menu*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/clickOnMarty.png", 
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_5_TEXT"),
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
        /* STEP 6 -- marty kick example*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                     url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/4/martyKick.gif",
                    text: Localization.localize("MARTY_JRBLOCKS_STEP_6_TEXT"),
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
        /* STEP 7 -- start on tap marty */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                     url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/onTap.png",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_7_TEXT"),
                }
            ],
            nextStepActions: [
                {
                     type: "HighlightBlocks",
                    blocks: ["onclick_block"] 
                    
                },
            ],
            hintActions: [ ],
            buttons: ["previous", "readAloud", "next"],
            presenter: "marty"
        },
        /* STEP 8 -- in and out arrows */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/martyKickCode.png",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_8_TEXT"),
                }
            ],
            nextStepActions: [
              { 
                    type: "HighlightBlocks",
                    blocks: ["right_block"] 
              },
              { 
                    type: "HighlightBlocks",
                    blocks: ["left_block"] 
              }
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 9 -- select soccer ball in sprite menu*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/soccerBallMode.gif",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_9_TEXT"),
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
        /* STEP 10 -- start on bump soccer ball */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/onBump.png",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_10_TEXT"),
                }
            ],
            nextStepActions: [
                {
                   type: "HighlightBlocks",
                    blocks: ["ontouch_block"]
                }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 11 --  move ball out to goal*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/ballMoveOut.png",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_11_TEXT"),
                }
            ],
            nextStepActions: [
                {
                   type: "HighlightBlocks",
                    blocks: ["right_block"]
                }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 12 --  move ball back home*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/ballMoveCode.png",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_12_TEXT"),
                }
            ],
            nextStepActions: [
                {
                   type: "HighlightBlocks",
                    blocks: ["home_block"]
                }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        
    
    /* STEP 13 -- select soccer net sprite*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/soccerNetMode.gif",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_13_TEXT"),
                }
            ],
            nextStepActions: [
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
       /* STEP 14 -- on bump soccer net*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/onBump.png",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_14_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["ontouch_block"]
                }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
         /* STEP 15 -- increase counter*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/increaseCounter.png",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_15_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["increasecounter_block"]
                }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 16 -- introduce moving net*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/movingNetExample.gif",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_16_TEXT"),
                }
            ],
            nextStepActions: [
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
        /* STEP 17 -- decrease net size*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/decreaseNetSize.gif",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_17_TEXT"),
                }
            ],
            nextStepActions: [
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
         /* STEP 18 -- ACTUALLY decrease net size*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/decreaseNetSize.gif",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_18_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["shrink_block"]
                     
                }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        
        /* STEP 19 -- green flag*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/greenFlag.png",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_19_TEXT"),
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightBlocks",
                    blocks: ["onflag_block"]
                     
                }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
         /* STEP 20 -- up and down blocks*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/upAndDown.png",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_20_TEXT"),
                }
            ],
            nextStepActions: [
                { 
                    type: "HighlightBlocks",
                    blocks: ["up_block"] 
              },
              { 
                    type: "HighlightBlocks",
                    blocks: ["down_block"] 
              }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
         /* STEP 21 -- forever repeat loop*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/netMoveCode.png",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_21_TEXT"),
                }
            ],
            nextStepActions: [
                { 
                    type: "HighlightBlocks",
                    blocks: ["forever_block"] 
              }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
         /* STEP 22 --another green flag block*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/anotherFlagBlock.png",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_22_TEXT"),
                }
            ],
            nextStepActions: [
                { 
                    type: "HighlightBlocks",
                    blocks: ["onflag_block"] 
              }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
          /* STEP 23 -- reset counter block*/
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    url: "https://content.robotical.io/static/tutorials/marty/jr-blocks/5/resetCounter.png",
                    text: Localization.localize("MARTY_JRBLOCKS5_STEP_23_TEXT"),
                }
            ],
            nextStepActions: [
                { 
                    type: "HighlightBlocks",
                    blocks: ["startstopcounter_block"] 
              }
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
       
       
        /* STEP 24 -- end */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("MARTY_JRBLOCKS5_END"),
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

export default  martyJrBlocksTutorial5;
