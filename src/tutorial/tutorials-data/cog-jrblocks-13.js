const cogJrBlocksTutorial13 = {
    id: "cog-jrblocks-13",
    platform: "blocksjr",
    title: "Adventure Story",
    description: "We'll make an interactive narrative adventure!",
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
                    text: "Let's make an adventure story!"
                }
            ],
            buttons: ["next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 2 - background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/2-background.png",
                    text: "Add a background"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 3 - Marty movement controls
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/3-moveControls.png",
                    text: "Add <b>movement controls</b> for Marty"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["tiltany=>forward", "tiltany=>back", "tiltany=>up", "tiltany=>down"],
            presenter: "marty"
        },

        // step 4 - Add an octopus sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/4-octopus.png",
                    text: "Add an <b>octopus sprite</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["readAloud","previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 5 - Reposition the sprites
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/5-spritePosition.png",
                    text: "Reposition Marty and the octopus"
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

        // step 6 - add on bump block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/6-onBump.png",
                    text: "Add the on bump block"
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
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouch"],
            presenter: "marty"
        },

        // step 7 - add a say block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/7-say.png",
                    text: "Add a <b>say</b> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["say_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["say_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "say_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouch=>say"],
            presenter: "marty"
        },

        // step 8 - change the text
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/8-text.png",
                    text: "Change the text to say <b>Hello Marty!</b>"
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

        // step 9 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/9-tryItOut.gif",
                    text: "Try it out!"
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

        // step 10 - Add another say block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/10-say.png",
                    text: "Add another <b>say block</b> with the text <b>How are you?</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say"],
            presenter: "marty"
        },

        // step 11 - more speech
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/11-say.png",
                    text: "Add two more say blocks, to say <b>I've lost my unicorn</b> and <b>Can you help?</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say=>say=>say"],
            presenter: "marty"
        },

        // step 12 - send message
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/12-sendMessage.png",
                    text: "Add a <b>Send Message</b> block"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say=>say=>say=>message"],
            presenter: "marty"
        },

        // step 13 - Add a unicorn
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/13-unicorn.png",
                    text: "Add a <b>unicorn sprite</b>"
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

        // step 14 - Move the unicorn
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/14-unicornPosition.png",
                    text: "Move it to the <b>bottom right corner</b>"
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

        // step 15 - make it be hidden
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/15-hide.png",
                    text: "Make the unicorn be hidden at the start"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide"],
            presenter: "marty"
        },

        // step 16 - add movement
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/16-movement.png",
                    text: "Make the unicorn move back and forth forever"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide", "onflag=>setspeed=>back=>forward=>forever"],
            presenter: "marty"
        },

        // step 17 - make the unicorn appear when the message is received
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/17-onMessage.png",
                    text: "Make the unicorn appear when the message is received"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide", "onflag=>setspeed=>back=>forward=>forever", "onmessage=>show"],
            presenter: "marty"
        },

        // step 18 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/18-tryItOut.gif",
                    text: "Try it out! <br /><br />Press the green flag to start"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 19 - Add an on bump block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/19-onBump.png",
                    text: "Add an <b>On Bump</b> block"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide", "onflag=>setspeed=>back=>forward=>forever", "onmessage=>show", "ontouch"],
            presenter: "marty"
        },

        // step 20 - add a stop block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/20-stop.png",
                    text: "Add a <b>stop</b> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["stopmine_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-flow"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["stopmine_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "stopmine_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["onflag=>hide", "onflag=>setspeed=>back=>forward=>forever", "onmessage=>show", "ontouch=>stopmine"],
            presenter: "marty"
        },

        // step 21 - add say, hide, send message
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/21-message.png",
                    text: "Add a <b>Say</b> block with the text <b>Neigh</b>, then a <b>hide</b> block and a <b>message</b> block"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide", "onflag=>setspeed=>back=>forward=>forever", "onmessage=>show", "ontouch=>stopmine=>say=>hide=>message"],
            presenter: "marty"
        },   

        // step 22 - change it to be a red message
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/22-redMessage.png",
                    text: "Change it to send a <b>red message</b>"
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

        // step 23 - select the octopus
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/23-octopus.png",
                    text: "Select the <b>octopus</b> sprite"
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

        // step 24 - add an on message block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/24-onMessage.png",
                    text: "Add an <b>On Message</b> block"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say=>say=>say=>message", "onmessage"],
            presenter: "marty"
        },

        // step 25 - Change it to red message
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/25-redMessage.png",
                    text: "Change it to be on a <b>red message</b>"
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

        // step 26 - say stuff
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/26-say.png",
                    text: "Add blocks to say <b>Thank you!</b> and <b>Please take it to the fort</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say=>say=>say=>message", "onmessage=>say=>say"],
            presenter: "marty"
        },

        // step 27 - add a send message block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/27-sendMessage.png",
                    text: "Add a <b>Send Message</b> block"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say=>say=>say=>message", "onmessage=>say=>say=>message"],
            presenter: "marty"
        },  

        // step 28 - change it to a yellow message
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/28-yellowMessage.png",
                    text: "Change it to a <b>yellow message</b>"
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

        // step 29 - add movement to the octopus
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/29-movement.png",
                    text: "Also add some movement to the octopus"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>say=>say=>say=>say=>message", "onmessage=>say=>say=>message", "onflag=>right=>wait=>left=>wait=>right=>forever"],
            presenter: "marty"
        },

        // step 30 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/30-tryItOut.gif",
                    text: "Try it out! <br /><Br />Press the green flag to start"
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

        // step 31 - add a fort
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/31-fort.png",
                    text: "Add a <b>fort sprite</b>"
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

        // step 32 - position the fort
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/32-fortPosition.png",
                    text: "<b>Shrink it</b> and <b>move it to the back</b>"
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

        // step 33 - hide the fort
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/33-hide.png",
                    text: "Make the fort be <b>hidden at the start</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide"],
            presenter: "marty"
        },

        // step 34 - appear on yellow message
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/34-yellowMessage.png",
                    text: "Make it appear on a <b>yellow message</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide", "onmessage=>show"],
            presenter: "marty"
        },

        // step 35 - add page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/35-page2.png",
                    text: "Add a second page"
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

        // step 36 - add a background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/36-background.png",
                    text: "Add a background"
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

        // step 37 - add a fort
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/37-fort.png",
                    text: "Add another <b>fort sprite</b>"
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

        // step 38 - make it big
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/38-bigFort.png",
                    text: "Make the fort big"
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

        // step 39 - go to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/39-page1.png",
                    text: "Go back to <b>page 1</b>"
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

        // step 40 - ensure the fort is selected
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/40-fort.png",
                    text: "Make sure the <b>fort is selected</b>"
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

        // step 41 - on bump, go to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/41-fortCode.png",
                    text: "Add <b>On bump, go to page 2</b> blocks"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>hide", "onmessage=>show", "ontouch=>gotopage"],
            presenter: "marty"
        },

        // step 42 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/42-tryItOut.gif",
                    text: "Try it out!"
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

        // step 43 - add a page 3
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/43-page3.png",
                    text: "Add a <b>page 3</b>"
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

        // step 44 - go to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/44-page2.png",
                    text: "Go back to <b>page 2</b>"
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

        // step 45 - on flag speak
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/45-say.png",
                    text: "Add <b>on flag</b> and <b>say Knock to enter</b> blocks"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>say"],
            presenter: "marty"
        },

        // step 46 - add an on shake, go to page 3
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/13/46-onShake.png",
                    text: "Add <b>On shake, go to page 3</b> blocks"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>say", "onshake=>gotopage"],
            presenter: "marty"
        },

        // step 47 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Try it out! <br /><Br />Shake cog to knock on the door"
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

        // step 48 - Next steps
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "<p><b>Well done!</b><br />Now, using everything you've learned before, continue the story and make an adventure for Marty and the unicorn"
                }
            ],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial13;