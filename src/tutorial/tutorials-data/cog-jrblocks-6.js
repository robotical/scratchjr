const cogJrBlocksTutorial6 = {
    id: "cog-jrblocks-6",
    platform: "blocksjr",
    title: "Make a parking sensor",
    description: "We'll use the IR sensors on cog to detect obstacles!",
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
                    text: "Let's make a parking sensor!"
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
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/2-cogEvents.png",
                    text: "Select the <i><u>Cog Events</u></i> category"
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

        // step 3 - add an object sensed block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/3-objectSensed.png",
                    text: "Add an <i><u>On Object Sensed</u></i> block"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onobjectsensed"],
            presenter: "marty"
        },

        // step 4 - select the cog lights category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/4-lights.png",
                    text: "Select the <i><u>Cog lights</u></i> category"
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "cog-looks",
                    hexColor: "#FF0000",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["onobjectsensed"],
            presenter: "marty"
        },

        // step 5 - add a set color block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/5-setColor.png",
                    text: "Add a <i><u>Set Color</u></i> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["selectcolour_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["selectcolour_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "selectcolour_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onobjectsensed=>selectcolour"],
            presenter: "marty"
        },

        // step 6 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/6-tryItOut.gif",
                    text: "Try it out! Cover the left object sensor"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 7 - Add another object sensed block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/7-secondObjectSensed.png",
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onobjectsensed=>selectcolour", "onobjectsensed"],
            presenter: "marty"
        },

        // step 8 - change it to the right sensor
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/irSense-right.png",
                    text: "Change it to the right sensor"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 9 - add another set color block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/9-setColor.png",
                    text: "Add another Set Color block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["selectcolour_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["selectcolour_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "selectcolour_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onobjectsensed=>selectcolour", "onobjectsensed=>selectcolour"],
            presenter: "marty"
        },

        // step 10 - change the color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/10-changeColor.png",
                    text: "Change the color"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["onobjectsensed=>selectcolour", "onobjectsensed=>selectcolour"],
            presenter: "marty"
        },

        // step 11 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/11-tryItOut.gif",
                    text: "Try it out! Cover one sensor then the other"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 12 - add a bus sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/12-busSprite.png",
                    text: "Add a <i><u>bus sprite</i></u>, make it smaller and move Marty"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 13 - Add another scene
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/13-addScene.png",
                    text: "Add another scene"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 14 - Add a bus sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/14-busSprite.png",
                    text: "Add another bus sprite and move it"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 15 - Add a background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/15-addBackground.png",
                    text: "Make a background with something behind the bus"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 16 - Click the text button
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/16-text.png",
                    text: "Press the <i><u>Add Text</i></u> button"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 17 - add the text "Look Out Behind"
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/17-lookOutBehind.png",
                    text: "Add text saying <b>Look out behind</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 18 - Select the cog event blocks
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/2-cogEvents.png",
                    text: "Select the <i><u>Cog Events</u></i> category"
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

        // step 19 - add an on object sensed block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/3-objectSensed.png",
                    text: "Add an On Object Sensed block"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onobjectsensed"],
            presenter: "marty"
        },

        // step 20 - Add a set color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/5-setColor.png",
                    text: "Add a <i><u>Set Color</u></i> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["selectcolour_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["selectcolour_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "selectcolour_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onobjectsensed=>selectcolour"],
            presenter: "marty"
        },

        // step 21 - Add a note
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/21-addNote.png",
                    text: "Add a <i><u>musical note</u></i>"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["playnote_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["playnote_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "playnote_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint", "readAloud"],
            expectedCode: ["onobjectsensed=>selectcolour=>playnote"],
            presenter: "marty"
        },   

        // step 22 - add another color and a rest
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/22-colorAndRest.png",
                    text: "Add another color and a rest"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["onobjectsensed=>selectcolour=>playnote=>selectcolour=>waitcrotchet"],
            presenter: "marty"
        },   

        // step 23 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/23-tryItOut.gif",
                    text: "Try it out! Put something close to the left object sensor"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 24 - Add obstacle sense, wait, clear color, go to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/24-addBlocks.png",
                    text: "Add <b>On Object Sensed<b>, <b>Pause</b>, <b>Clear Color</b> and <b>Go To Page 1</b> blocks"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed=>selectcolour=>playnote=>selectcolour=>waitcrotchet", "onobjectsensed=>wait=>clearcolours=>gotopage"],
            presenter: "marty"
        },  

        // step 25 - Change the object sense to no object
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/25-setNoObstacle.png",
                    text: "Set the new object sense to <b>No Object</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed=>selectcolour=>playnote=>selectcolour=>playnote", "onobjectsensed=>wait=>clearcolours=>gotopage"],
            presenter: "marty"
        },

        // step 26 - back to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/26-page1.png",
                    text: "It'll go back to page 1!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 27 - select the Marty sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/27-martySprite.png",
                    text: "Select the Marty sprite"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },  

        // step 28 - add go to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/28-goToPage2.png",
                    text: "Add a <b>Go To Page 2</b> block"
                }
            ],
            nextStepActions: [
                                {
                    type: "ShowCategory",
                    category: "sprite-stop"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["gotopage_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-stop"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["gotopage_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "gotopage_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "readAloud","hint"],
            expectedCode: ["onobjectsensed=>selectcolour=>gotopage", "onobjectsensed=>selectcolour"],
            presenter: "marty"
        },

        // step 29 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/29-tryItOut.gif",
                    text: "Try it out! Cover the left object sensor for a while"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 30 - Add another scene
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/30-addScene.png",
                    text: "Add a third scene"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 31 - make the scene
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/31-scene.png",
                    text: "Make a scene with the text <b>Look out in front!</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 32 - add sound and light
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/32-soundAndLight.png",
                    text: "Add an <b>On Flag</b> block, and sound and lights"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>playnote=>clearcolours=>playnote"],
            presenter: "marty"
        },

        // step 33 - add a repeat forever block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/33-forever.png",
                    text: "Add a <b>Repeat Forever</b> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-stop"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["forever_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-stop"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["forever_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "forever_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>playnote=>clearcolours=>playnote=>forever"],
            presenter: "marty"
        },  

        // step 34 - add no object blocks
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/34-noObjectBlocks.png",
                    text: "Add <b>On Object</b>, <b>Pause</b>, <b>Lights Off</b>, and <b>Go To Page 1</b> blocks"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>playnote=>clearcolours=>playnote=>forever", "onobjectsensed=>wait=>clearcolours=>gotopage"],
            presenter: "marty"
        },

        // step 35 - change it to be no object
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/35-setNoObject2.png",
                    text: "Set it trigger on <b>No Object</b> sensed"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>playnote=>clearcolours=>playnote=>forever", "onobjectsensed=>wait=>clearcolours=>gotopage"],
            presenter: "marty"
        },  

        // step 36 - back to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/36-page1.png",
                    text: "It'll go back to page 1!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },  

        // step 37 - add go to page 3, lights off
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/37-lastCode.png",
                    text: "Add a <b>Go To Page 3</b> block, and a <b>On Flag</b>=><b>Lights off</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed=>selectcolour=>gotopage", "onobjectsensed=>selectcolour=>gotopage", "onflag=>clearcolours"],
            presenter: "marty"
        },

        // step 39 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Try it out!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },  

        // step 39 - Try it out in fullscreen!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/6/39-fullscreen.png",
                    text: "Try it out in full screen mode"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 40 - next steps!
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Well done!</br>Now try making your lights and sounds more exciting"
                }
            ],
            buttons: ["readAloud", "previous"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial6;