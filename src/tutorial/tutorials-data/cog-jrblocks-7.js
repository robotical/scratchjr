const cogJrBlocksTutorial7 = {
    id: "cog-jrblocks-7",
    platform: "blocksjr",
    title: "Let's get counting!",
    description: "We'll introduce the counter in Jr Blocks, and use the IR sensor and tilt sensor to make a checkout and an odometer!",
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
                    text: "Let's make a counter!"
                }
            ],
            buttons: ["next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 2 - add an object sensed block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/2-objectSensed.png",
                    text: "Add an <b>On Object Sensed</b> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onobjectsensed_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onobjectsensed_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onobjectsensed_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onobjectsensed"],
            presenter: "marty"
        },

        // step 3 - change it to on right object
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/irSense-right.png",
                    text: "Change it to trigger on the <b>right</b> object sensor"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed"],
            presenter: "marty"
        },

        // step 4 - select the flow category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/4-flow.png",
                    text: "Select the <b>flow</b> category"
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
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed"],
            presenter: "marty"
        },

        // step 5 - add a +1 block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/5-plus1.png",
                    text: "Add a <b>+1</b> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["increasecounter_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["increasecounter_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "increasecounter_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onobjectsensed=>increasecounter"],
            presenter: "marty"
        },

        // step 6 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/6-tryItOut.gif",
                    text: "Try it out! Cover the right object sensor"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 7 - Add another object sensed block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/7-secondObjectSensed.png",
                    text: "Add another On Object Sensed block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onobjectsensed_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onobjectsensed_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onobjectsensed_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onobjectsensed=>increasecounter", "onobjectsensed"],
            presenter: "marty"
        },

        // step 8 - add a -1 block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/8-minus1.png",
                    text: "Add a <b>-1</b> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["decreasecounter_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["decreasecounter_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "decreasecounter_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onobjectsensed=>increasecounter", "onobjectsensed=>decreasecounter"],
            presenter: "marty"
        },

        // step 9 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/9-tryItOut.gif",
                    text: "Try it out!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 10 - add some feedback
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/10-feedback.png",
                    text: "Add some sound and light feedback"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed=>selectcolour=>increasecounter=>playnote=>clearcolours", "onobjectsensed=>selectcolour=>decreasecounter=>playnote=>clearcolours"],
            presenter: "marty"
        },

        // step 11 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/9-tryItOut.gif",
                    text: "Try it out! Use cog like a counter at the shop to count the number of items passing it"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 12 - go to the cog events
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/12-cogEvents.png",
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
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 13 - Add an on shake block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/13-onShake.png",
                    text: "Add an <b>On Shake</b> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onshake_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onshake_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onshake_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onobjectsensed=>selectcolour=>increasecounter=>playnote=>clearcolours", "onobjectsensed=>selectcolour=>decreasecounter=>playnote=>clearcolours", "onshake"],
            presenter: "marty"
        },

        // step 14 - Add a reset counter block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/14-resetCounter.png",
                    text: "Add a <b>Reset Counter</b> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["startstopcounter_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["startstopcounter_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "startstopcounter_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onobjectsensed=>selectcolour=>increasecounter=>playnote=>clearcolours", "onobjectsensed=>selectcolour=>decreasecounter=>playnote=>clearcolours", "onshake=>startstopcounter"],
            presenter: "marty"
        },

        // step 15 - Try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/shakeCog.gif",
                    text: "Shake cog to reset the counter"
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

        // step 16 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Try it out! Count some things around the room"
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

        // step 17 - clear the code
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/17-clearCode.png",
                    text: "Clear all the code by dragging it back to the blocks area"
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

        // step 18 - Add a second scene
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/18-secondScene.png",
                    text: "Add a second scene"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 19 - add tilt left, +1, go to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/19-page2code.png",
                    text: "Add a <b>On Tilt Left</b>, <b>+1</b>, and <b>Go To Page 1</b> blocks"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>increasecounter=>gotopage"],
            presenter: "marty"
        },

        // step 20 - Go back to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/20-page1.png",
                    text: "Go back to page 1"
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

        // step 21 - Add tilt right, go to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/21-page1code.png",
                    text: "Add <b>On Tilt Right</b> and <b>Go To Page 2</b> blocks"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>gotopage"],
            presenter: "marty"
        },   

        // step 22 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/22-tryItOut.gif",
                    text: "Try rotating cog!"
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

        // step 23 - add push to clear
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/23-pushToClear.png",
                    text: "Add <b>On Button Push</b> and <b>Reset Counter</b> blocks"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>gotopage", "ontouchcog=>startstopcounter"],
            presenter: "marty"
        },

        // step 24 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/7/pushCogButton.jpg",
                    text: "Push the button on Cog to reset the counter"
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

        // step 25 - Next steps
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "<p><b>Well done!</b> You've made cog an <b>odometer</b> - a device to measure number of rotations!</p> <p>&nbsp;</p><ul><li>Can you make it count down when you rotate cog the other way?</li><li>Make a trundle wheel and use cog to measure distance</li></ul>"
                }
            ],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial7;