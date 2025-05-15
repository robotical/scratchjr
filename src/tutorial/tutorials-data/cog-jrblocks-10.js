const cogJrBlocksTutorial10 = {
    id: "cog-jrblocks-10",
    platform: "blocksjr",
    title: "Make shapes with Marty",
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
                    text: "Let's make some shapes with Marty the Robot!"
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
                    text: "Turn on <b>Marty mode</b>!"
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
                    text: "Add an <b>On Flag</b> block"
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
                    text: "Select the Marty motion category"
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
                    text: "Add an <b>Marty Forward</b> block"
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
                    text: "Change it to take <b>5</b> steps"
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
                    text: "Add an <b>Marty Turn Right</b> block"
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
                    text: "Set it to turn <b>9</b> steps"
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
                    text: "Add another <b>Marty Forward</b> block and set it to <b>5 steps</b>"
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
                    text: "Turn on the trail"
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
                    text: "Press the <b>Green Flag</b> to run the code"
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
                    text: "What happened?<br /><br />After Marty turned 90 degrees, forward was a different direction!"
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
                    text: "Press the <b>Clear</b> button"
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
                    text: "Remove the second forward block, and add a <b>loop</b>"
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
                    text: "Press the <b>Green Flag</b> to run the code"
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
                    text: "What shape did Marty make?"
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
                    text: "5 is the <b>side length</b>"
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
                    text: "9 turns means 90 degrees"
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
                    text: "And <b>4 repeats</b> means there will be <b>4 sides</b>"
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
                    text: "Clear the trail again"
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
                    text: "Change the turn to take <b>6 steps</b> and the repeat to <b>6 times</b>"
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
                    text: "Press the <b>Green Flag</b> to run the code"
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
                    text: "What shape did Marty make?"
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
                    text: "Can you <b>change two numbers</b> to make a <b>triangle</b>?"
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
                    text: "Try this code.<Br /><br /><b>What shape</b> does it make?"
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
                    text: "It looks like a circle, but it's actually got <b>36 sides!</b>.<br /><br />It's called a <i>hexatriacontagon</i>!"
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
                    text: "To make a complete shape, Marty must <b>turn a total of 360 degrees!</b>"
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
                    text: "What shape will this code make?<br /><br />Try it out!"
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
                    text: "It's the start of a <b>spiral</b>"
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
                    text: "Can you finish the spiral by adding <b>two more repeats?</b>"
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
                    text: "Clear your code"
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
                    text: "Add a blocks to move Marty <b>when cog is tilted</b>"
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
                    text: "Try it out!<br /><br /><b>Tilt Cog</b> to draw"
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
                    text: "Add blocks to make Marty <b>turn</b>"
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
                    text: "Try it out! Use the <b>Object sensors</b> to turn Marty"
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
                    text: "<p><b>Well done!</b><br /> You've learned about <b>relative directions</b>, rather than <b>absolute</b> ones. <br /><br />What else can you draw?"
                }
            ],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial10;