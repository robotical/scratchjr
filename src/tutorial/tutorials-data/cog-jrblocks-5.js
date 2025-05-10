const cogJrBlocksTutorial5 = {
    id: "cog-jrblocks-5",
    platform: "blocksjr",
    title: "Make a maze game",
    description: "We'll make a maze game that uses cog to steer a sprite around a maze",
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
                    text: "Let's make a maze game!"
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
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/2-events.png",
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

        // step 3 - add four tilt blocks
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/3-tiltBlocks.png",
                    text: "Add four <i><u>on tilt</u></i> blocks"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany", "tiltany", "tiltany", "tiltany"],
            presenter: "marty"
        },

        // step 4 - select the sprite motion category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/4/4-motion.png",
                    text: "Select the <i><u>sprite motion</u></i> category"
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
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany", "tiltany", "tiltany", "tiltany"],
            presenter: "marty"
        },

        // step 5 - add four motion blocks
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/5-motionBlocks.png",
                    text: "Add four <i><u>motion</u></i> blocks"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["forward_block", "back_block", "up_block", "down_block"]
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up"],
            presenter: "marty"
        },

        // step 6 - Click the add sprite button
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/6-addSprite.png",
                    text: "Press the <i><u>Add Sprite</u></i> button"
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "addsprite",
                    hexColor: "#FF0000",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 7 - Click the draw sprite button
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/7-drawSprite.png",
                    text: "Press the <i><u>Draw</u></i> button"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 8 - select the thick line
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/8-thickLine.png",
                    text: "Select the <i><u>thick line</u></i> option"
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

        // step 9 - draw a maze
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/9-drawMaze.png",
                    text: "Draw a maze"
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

        // step 10 - click the tick
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/10-tick.png",
                    text: "Click the tick"
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

        // step 11 - Select the looks category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/11-looks.png",
                    text: "Select the <i><u>sprite loooks</u></i> category"
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "sprite-looks",
                    hexColor: "#FF0000",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 12 - add a grow block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/12-grow.png",
                    text: "Add a <i><u>grow block</u></i>"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["grow_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["grow_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "grow_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["grow"],
            presenter: "marty"
        },

        // step 13 - Click the grow block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/13-clickGrow.png",
                    text: "Click the grow block"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["grow"],
            presenter: "marty"
        },

        // step 14 - Until the maze is big
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/14-bigMaze.png",
                    text: "Press grow until the maze is big"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["grow"],
            presenter: "marty"
        },

        // step 15 - Move the marty sprite to the beginning of the maze
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/15-moveMarty.gif",
                    text: "Drag Marty to the beginning of the maze"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["grow"],
            presenter: "marty"
        },

        // step 16 - Select the Marty Sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/16-selectMartySprite.png",
                    text: "Select the Marty sprite"
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

        // step 17 - add a make smaller block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/17-shrink.png",
                    text: "Add a <i><u>shrink</u></i> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["shrink_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["shrink_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "shrink_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "shrink"],
            presenter: "marty"
        },

        // step 18 - Make Marty small
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/18-smallMarty.png",
                    text: "Make Marty small"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "shrink"],
            presenter: "marty"
        },

        // step 19 - Select the maze sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/19-mazeSprite.png",
                    text: "Select the maze sprite"
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

        // step 20 - Select the sprite events category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/20-spriteEvents.png",
                    text: "Select the <i><u>sprite events</u></i> category"
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "sprite-start",
                    hexColor: "#FF0000",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["grow"],
            presenter: "marty"
        },

        // step 21 - Add an on bump block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/21-onBump.png",
                    text: "Add an <i><u>on bump</u></i> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["ontouch_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["ontouch_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "ontouch_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["ontouch"],
            presenter: "marty"
        },   

        // step 22 - add a send message block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/22-sendMessage.png",
                    text: "Add a <i><u>send message</u></i> block"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["ontouch=>message"],
            presenter: "marty"
        },   

        // step 23 - select the Marty sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/23-martySprite.png",
                    text: "Select the Marty sprite"
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

        // step 24 - add an onmessage block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/24-onMessage.png",
                    text: "Add an <i><u>on message</u></i> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onmessage_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "onmessage"],
            presenter: "marty"
        },  

        // step 25 - Select the sprite motion category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/25-spriteMotion.png",
                    text: "Select the <i><u>sprite motion</u></i> category"
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
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "onmessage"],
            presenter: "marty"
        },

        // step 26 - add a rotate 12 block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/26-rotate12.png",
                    text: "Add a <i><u>rotate</u></i> block and set the number to 12"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["right_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["right_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "right_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "onmessage=>right"],
            presenter: "marty"
        },

        // step 27 - add a go home block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/27-goHome.png",
                    text: "Add a <i><u>go home</u></i> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["home_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["home_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "home_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "onmessage=>right=>home"],
            presenter: "marty"
        },  

        // step 28 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/cogTiltFwdBwd.gif",
                    text: "Try to steer Marty around the maze!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>down", "tiltany=>up", "onmessage=>right=>home"],
            presenter: "marty"
        },

        // step 29 - click the add scene button
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/29-addScene.png",
                    text: "Click the <i><u>add scene</u></i> button"
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

        // step 30 - Click the edit background button
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/30-editBackground.png",
                    text: "Click the <i><u>background</u></i> button"
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

        // step 31 - choose a background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/31-chooseBackground.png",
                    text: "Choose a background"
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

        // step 32 Click the tick
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/10-tick.png",
                    text: "Click the tick"
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

        // step 33 - add an on green flag block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/33-onGreenFlag.png",
                    text: "Add an <i><u>on green flag</u></i> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onflag_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onflag"],
            presenter: "marty"
        },  

        // step 34 - add a loop
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/34-loop.png",
                    text: "Add a <i><u>repeat</u></i> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["repeat_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onflag=>repeat"],
            presenter: "marty"
        },

        // step 35 - add a jump block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/35-jump.png",
                    text: "Add a <i><u>hop</u></i> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["hop_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-motion"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["hop_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "hop_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onflag=>repeat=>hop"],
            presenter: "marty"
        },  

        // step 36 - add an on touch block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/36-onTouch.png",
                    text: "Add an <i><u>on tap</u></i> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onclick_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onclick_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onclick_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onflag=>repeat=>hop", "ontap"],
            presenter: "marty"
        },  

        // step 37 - select the sprite stop category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/37-stop.png",
                    text: "Select the <i><u>sprite stop</u></i> category"
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "sprite-stop",
                    hexColor: "#FF0000",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["onflag=>repeat=>hop", "ontap"],
            presenter: "marty"
        },

        // step 38 - add a go to page 1 block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/38-goToPage1.png",
                    text: "Add a <i><u>Go To Page 1</u></i> block"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onflag=>repeat=>hop", "ontap=>gotopage"],
            presenter: "marty"
        },  

        // step 39 - click on Marty to go back to the maze scene
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/39-clickMarty.png",
                    text: "Press Marty to go back to the maze scene!"
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

        // step 40 - click the add sprite button
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/40-addSprite.png",
                    text: "Click Add Sprite button"
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

        // Add a star sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/41-star.png",
                    text: "Add a star sprite"
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

        // step 42 - move it to the goal
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/42-moveStar.gif",
                    text: "Move the star to the goal"
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

        // step 43 - add an on bump block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/21-onBump.png",
                    text: "Add an <i><u>on bump</u></i> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["ontouch_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["ontouch_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "ontouch_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["onbump"],
            presenter: "marty"
        },

        // step 42 - add a go to page 2 block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/42-goToPage2.png",
                    text: "Add a Go To Page 2 block"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["ontouch=>gotopage"],
            presenter: "marty"
        }, 

        // step 43 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/5/solveMaze.gif",
                    text: "Try to steer Marty to the goal!"
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
        
        // step 44 - next steps!
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Well done!</br>Now see if you can add more levels to the maze!"
                }
            ],
            buttons: ["readAloud", "previous"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial5;