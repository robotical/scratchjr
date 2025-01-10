
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
        * onmove_block
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


const cogAndMartyTutorial = {
    id: "cog-and-marty-tutorial",
    platform: "blocks",
    title: "Cog and Marty Interaction",
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
                    text: "In this tutorial we will learn how Cog and Marty can interact with each other. Press 'Next' to start!"
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
                    text: "First, let's connect to Cog. Click on the Cog button to connect to Cog"
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
                    text: "Then, let's connect to Marty. Click on the Marty button to connect to Marty"
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
        /* STEP 2 -- go to cog event blocks */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Great, let's do some coding! The Cog blocks are on the right side of the screen. Click on the Start block category to see the Cog blocks"
                }
            ],
            nextStepActions: [
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
        /* STEP 3 -- add ontouchcog block */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Once you have selected the Start block category, drag the 'on click cog' block to the script area. Make sure to press Next when you are done"
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
            buttons: ["previous", "readAloud", "next", "hint"],
            expectedCode: ["ontouchcog"],
            presenter: "marty"
        },
        /* STEP 4 -- go to sprite event blocks */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Great! Now let's move to the Sprite blocks, which are on the left side of the screen."
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "sprite-start",
                    hexColor: "#855cd659",
                    onClickAction: "NextStep"
                },
            ],
            hintActions: [],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 5 -- add message block after the ontouchcog block */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Now drag the 'message' block from the Sprite Start category to the script area. This block will send a message to Marty when the sprite is clicked"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["message_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["message_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "message_block",
                }
            ],
            buttons: ["previous", "readAloud", "next", "hint"],
            expectedCode: ["ontouchcog=>message"],
            presenter: "marty"
        },
        /* STEP 6 -- go to marty mode */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Now let's move to Marty. We need to enable Marty Mode to see the Marty blocks. Click on the Marty Mode button."
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
        /* STEP 7 -- add onmessage block */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Once in Marty Mode, drag the 'on message' block from the Marty Start category to the script area. This block will listen for the message sent by Cog"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowMartyMode",
                },
                {
                    type: "ShowCategory",
                    category: "marty-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onmessage_block"]
                }
            ],
            hintActions: [
                {
                    type: "ShowMartyMode",
                },
                {
                    type: "ShowCategory",
                    category: "marty-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onmessage_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onmessage_block",
                }
            ],
            buttons: ["previous", "readAloud", "next", "hint"],
            expectedCode: ["onmessage"],
            presenter: "marty"
        },
        /* STEP 8 -- go to marty motion blocks */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Now, let's select Marty's motion blocks. Click on the Motion category of Marty blocks"
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
        /* STEP 9 -- add marty dance block */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "We're almost there! Drag the 'marty dance' block to the script area. This block will make Marty dance when the message is received"
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
            expectedCode: ["onmessage=>martyDance"],
            presenter: "marty"
        },
        /* STEP 10 -- end */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Great job! You have successfully coded Cog and Marty to interact with each other. No click Cog's button to see Marty dance!"
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
