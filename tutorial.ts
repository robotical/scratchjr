
type Category = "sprite-start" | "sprite-motion" | "sprite-looks" | "sprite-sound" | "sprite-flow" | "sprite-stop" | "marty-start" | "marty-motion" | "marty-looks" | "marty-sound" | "marty-flow" | "marty-stop" | "cog-start" | "cog-looks" | "cog-sound"
type Block = "onflag_block" | "onmessage_block" | "onclick_block" | "ontouch_block" | "message_block" | "repeat_block" | "forward_block" | "back_block" | "up_block" | "down_block" | "right_block" | "left_block" | "home_block" | "hop_block" | "wait_block" | "setspeed_block" | "stopmine_block" | "startstopcounter_block" | "increasecounter_block" | "decreasecounter_block" | "say_block" | "show_block" | "hide_block" | "grow_block" | "shrink_block" | "same_block" | "playsnd_block" | "playusersnd_block" | "endstack_block" | "forever_block" | "gotopage_block" | "caretstart_block" | "caretend_block" | "caretrepeat_block" | "caretcmd_block" | "tiltany_block" | "ontouchcog_block" | "onshake_block" | "onobjectsensed_block" | "onlight_block" | "setpattern_block" | "clearcolours_block" | "selectcolour_block" | "confusion_block" | "disbelief_block" | "excitement_block" | "noway_block" | "no_block" | "whistle_block" | "playnote_block" | "martyGetReady_block" | "martyDance_block" | "martyStepForward_block" | "martyStepBackward_block" | "martyStepLeft_block" | "martyStepRight_block" | "martyTurnRight_block" | "martyTurnLeft_block" | "martyKickRight_block" | "martyKickLeft_block" | "martyEyesExcited_block" | "martyEyesWide_block" | "martyEyesAngry_block" | "martyEyesNormal_block" | "martyEyesWiggle_block" | "martyWaveLeft_block" | "martyWaveRight_block" | "martyCelebrate_block" | "martyLedEyesP1_block" | "martyLedEyesP2_block" | "martyLedEyesColour_block" | "martyConfusion_block" | "martyDisbelief_block" | "martyExcitement_block" | "martyNoway_block" | "martyNo_block" | "martyWhistle_block"
type OnClickAction = "NextStep";

type ActionType =
    | "HighlightElement"
    | "ShowInstructorText"
    | "ShowCategory"
    | "HighlightBlocks"
    | "DragBlockToScriptArea"
    | "ShowMartyMode"
    | "WaitForTime"
    | "ClickOnElement";

type UIElement = "nextStep" | "cogConnectionButton" | "martyConnectionButton" | "cog-start" | "sprite-start" | "martyMode" | "marty-motion";

type Action = {
    type: ActionType;
    text?: string;
    elementId?: UIElement;
    hexColor?: string;
    onClickAction?: OnClickAction;
    category?: Category;
    blocks?: Block[];
    block?: Block;
    time?: number;
    wait?: number;
};

type TutorialStep = {
    nextStepActions: Action[];
    instructionActions: Action[];
    hintActions?: Action[];
    buttons: ("previous" | "next" | "hint")[]; 
    expectedCode: string[]; // e.g: ["ontouchcog=>martyDance"] each element of the array corresponds to a script. each script is a series of blocks connected with =>
    presenter: "marty"; // or any other sprite
};

type Tutorial = {
    id: string;
    platform: string;
    title: string;
    description: string;
    tutorialSteps: TutorialStep[];
};

const cogAndMartyTutorial: Tutorial = {
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
            buttons: ["next"],
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
            buttons: ["previous", "next"],
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
            buttons: ["previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 2 -- enter Marty mode and go to Cog event blocks */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Great, let's do some coding! The Cog blocks are on the right side of the screen. Click on the Start block category to see the Cog blocks"
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
            buttons: ["previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 3 -- add ontouchcog block to Marty's script */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Once you have selected the Start block category, drag the 'on click cog' block to the script area. Make sure to press Next when you are done"
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
            buttons: ["previous", "next", "hint"],
            expectedCode: ["ontouchcog"],
            presenter: "marty"
        },
        /* STEP 4 -- go to marty motion blocks */
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
            buttons: ["previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        /* STEP 5 -- add marty dance block after the Cog trigger */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "We're almost there! Drag the 'Marty Dance' block beneath the 'on touch cog' block. Marty will dance when Cog's button is pressed."
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
            buttons: ["previous", "next", "hint"],
            expectedCode: ["ontouchcog=>martyDance"],
            presenter: "marty"
        },
        /* STEP 6 -- end */
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Great job! You have successfully coded Cog and Marty to interact with each other. Now click Cog's button to see Marty dance!"
                }
            ],
            nextStepActions: [],
            hintActions: [],
            buttons: ["previous"],
            expectedCode: [],
            presenter: "marty"
        }
    ]
}

export default cogAndMartyTutorial;
