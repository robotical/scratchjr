const cogJrBlocksTutorial4 = {
    id: "cog-jrblocks-4",
    platform: "blocksjr",
    title: "Make an etch-a-sketch",
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
                    text: "Let's make an etch-a-sketch!"
                }
            ],
            buttons: ["next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 2 - select the events category
{
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/2-events.png",
                    text: "Select the Cog Events category"
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
            buttons: ["previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 3 - add a tilt block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/3-tiltBlock.png",
                    text: "Add the on tilt block"
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
            buttons: ["previous", "next", "hint"],
            expectedCode: ["tiltany"],
            presenter: "marty"
        },

        // step 4 - select the sprite motion category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/4-motion.png",
                    text: "Select the sprite motion category"
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
            buttons: ["previous", "next"],
            expectedCode: ["tiltany"],
            presenter: "marty"
        },

        // step 5 - add a move right block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/5-moveRight.png",
                    text: "Add a move forward block"
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
            buttons: ["previous", "next", "hint"],
            expectedCode: ["tiltany=>forward"],
            presenter: "marty"
        },

        // step 6 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/cogTiltRight.gif",
                    text: "Tilt Cog Right"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next"],
            expectedCode: ["tiltany=>forward"],
            presenter: "marty"
        },

        // step 7 - Add another on-tilt block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/7-secondTilt.png",
                    text: "Add a second on tilt block"
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
            buttons: ["previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany"],
            presenter: "marty"
        },

        // step 8 - Change the tilt direction to left
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/8-tiltLeft.png",
                    text: "Change the tilt direction to left"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next"],
            expectedCode: ["tiltany=>right", "tiltany"],
            presenter: "marty"
        },

        // step 9 - add a move left block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/9-moveLeft.png",
                    text: "Add a move backward block"
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
            buttons: ["previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back"],
            presenter: "marty"
        },

        // step 10 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/cogTiltLeft.gif",
                    text: "Tilt Cog left"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back"],
            presenter: "marty"
        },

        // step 11 - Add a third tilt block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/11-thirdTilt.png",
                    text: "Add a third on tilt block"
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
            buttons: ["previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany"],
            presenter: "marty"
        },

        // step 12 - change the tilt direction to down
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/12-tiltDown.png",
                    text: "Change the tilt direction to down"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany"],
            presenter: "marty"
        },

        // step 13 - Add a move down block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/13-moveDown.png",
                    text: "Add a move down block"
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
            buttons: ["previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down"],
            presenter: "marty"
        },

        // step 14 - add a fourth tilt block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/14-fourthTilt.png",
                    text: "Add a fourth on tilt block"
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
            buttons: ["previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany"],
            presenter: "marty"
        },

        // step 15 - change the tilt direction to up
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/15-tiltUp.png",
                    text: "Change the tilt direction to up"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany"],
            presenter: "marty"
        },

        // step 16 - Add a move up block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/16-moveUp.png",
                    text: "Add a move up block"
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
            buttons: ["previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up"],
            presenter: "marty"
        },

        // step 17 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/cogTiltFwdBwd.gif",
                    text: "Tilt Cog forward and backward"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up"],
            presenter: "marty"
        },

        // step 18 - Turn on the sprite trail
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/18-spriteTrail.png",
                    text: "Turn on the sprite trail"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up"],
            presenter: "marty"
        },

        // step 19 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/cogTiltFwdBwd.gif",
                    text: "Try it out!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up"],
            presenter: "marty"
        },

        // step 20 - Clear the trail
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/20-clearTrail.png",
                    text: "Push the button to clear the trail"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up"],
            presenter: "marty"
        },

        // step 21 - select the control category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/21-control.png",
                    text: "Select the control category"
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
            buttons: ["previous", "next"],
            expectedCode: ["tiltany"],
            presenter: "marty"
        },

        // step 22 - add a set speed block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/22-setSpeed.png",
                    text: "Add a set speed block"
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
            buttons: ["previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "setspeed"],
            presenter: "marty"
        },   

        // step 23 - set the speed to slow
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/23-selectSpeed.png",
                    text: "Change the speed to slow"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "setspeed"],
            presenter: "marty"
        },

        // step 24 - click the set speed block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/24-clickSetSpeed.png",
                    text: "Run the set speed block"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "setspeed"],
            presenter: "marty"
        },

        // step 25 - draw something!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/25-drawSomething.png",
                    text: "Draw something!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next"],
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
                    text: "Well done! Now see what else you can draw!"
                }
            ],
            buttons: ["previous"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial4;