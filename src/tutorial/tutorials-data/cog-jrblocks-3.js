const cogJrBlocksTutorial3 = {
    id: "cog-jrblocks-3",
    platform: "blocksjr",         // should this be jrblocks?
    title: "Make a sound and light show",
    description: "Combining what they've learned in the last two activities, students can construct a combined sound and light show on their cog! They can connect the sound sequence and the light sequence up to the same starting event, to see that they can make two sequences run simultaneously",
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
                    text: "Let's make a sound and light show! 🎵✨"
                }
            ],
            buttons: ["readAloud", "next"],
            expectedCode: [],
            presenter: "marty"
        },
        // this will be tutorial 3, so we assume that we're already connected to cog? We should probably make tutorial 1 as well to cover this
        // or can we make smart guidance that will guide the student to connect to cog when they try to run code without one connected?

        // step 2 - pick an event to start things
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Select the <i><u>cog event</u></i> blocks"
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
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Add the  <i><u>on button press</u></i> block"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["ontouchcog"],
            presenter: "marty"
        },
        // step 3 - add a musical note
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Select the  <i><u>cog sound</u></i> blocks"
                }
            ],
            nextStepActions: [
                {
                    type: "HighlightElement",
                    elementId: "cog-sound",
                    hexColor: "#FF0000",
                    onClickAction: "NextStep"
                }
            ],
            hintActions: [],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["ontouchcog_block"],
            presenter: "marty"
        },
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Add a  <i><u>musical note</u></i> block"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote"],
            presenter: "marty"
        },

        // step 4 - change the note to an E
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/4-selectNote.png",
                    text: "Change the note to an E"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["ontouchcog=>playnote"],
            presenter: "marty"
        },

        // step 5 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/5-pushCogButton.jpg",
                    text: "Push the button!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["ontouchcog=>playnote"],
            presenter: "marty"
        },

        // step 6 - Add another button push event
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/6-twoButtonPushEvents.png",
                    text: "Add another button push event"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote", "ontouchcog"],
            presenter: "marty"
        },

        // step 7 - add a light command
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Select the  <i><u>cog lights</u></i> blocks"
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
            expectedCode: ["ontouchcog=>playnote", "ontouchcog"],
            presenter: "marty"
        },
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/7-ledCommand.png",
                    text: "Add a  <i><u>set color </u></i> block"
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
            expectedCode: ["ontouchcog=>playnote", "ontouchcog=>selectcolour"],
            presenter: "marty"
        },

        // step 8 - change the color of the LED command
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/8-selectColor.png",
                    text: "Change the color"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["ontouchcog=>playnote", "ontouchcog=>selectcolour"],
            presenter: "marty"
        },

        // step 9 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/5-pushCogButton.jpg",
                    text: "Push the button!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["ontouchcog=>playnote", "ontouchcog=>selectcolour"],
            presenter: "marty"
        },

        // step 10 - Add the first bar of music - EDCD
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/10-firstBar.png",
                    text: "Add more notes -  <b>EDCD</b>"
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote", "ontouchcog=>selectcolour"],
            presenter: "marty"
        },

        // step 11 - add a pause after the LED command
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/11-rest.png",
                    text: "Add a pause after the LED command"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["waitcrotchet_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["waitcrotchet_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "waitcrotchet_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote", "ontouchcog=>selectcolour=>waitcrotchet"],
            presenter: "marty"
        },

        // step 12 - change the rest to be for 4 beats
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/12-setRestLength.png",
                    text: "Set the color for 4 beats"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote", "ontouchcog=>selectcolour=>waitcrotchet"],
            presenter: "marty"
        },

        // step 13 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/5-pushCogButton.jpg",
                    text: "Push the button!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote", "ontouchcog=>selectcolour=>waitcrotchet"],
            presenter: "marty"
        },

        // step 14 - add the second bar of music
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/14-secondBar.png",
                    text: "Add more notes - <b>EEE_</b>"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["playnote_block", "waitcrotchet_block"]
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>waitcrotchet", "ontouchcog=>selectcolour=>waitcrotchet"],
            presenter: "marty"
        },

        // step 15 - add a color for the second bar of music
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/15-secondBarLEDs.png",
                    text: "Add a color for the second bar"
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
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>waitcrotchet", "ontouchcog=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet"],
            presenter: "marty"
        },

        // step 16 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/5-pushCogButton.jpg",
                    text: "Push the button!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>waitcrotchet", "ontouchcog=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet"],
            presenter: "marty"
        },

        // step 17 - add the third bar of music and a color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/17-thirdBar.png",
                    text: "Add more notes - <b>DDD_</b>"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["playnote_block", "waitcrotchet_block"]
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>waitcrotchet=>playnote=>playnote=>playnote=>waitcrotchet", "ontouchcog=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet"],
        },

        // step 18 - add the fourth bar of music and a color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/18-fourthBar.png",
                    text: "Add more notes - <b>DDD_</b>"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["playnote_block", "waitcrotchet_block"]
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
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>waitcrotchet=>playnote=>playnote=>playnote=>waitcrotchetplaynote=>playnote=>playnote=>waitcrotchet", "ontouchcog=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet"],
        },

        // step 19 - add a pattern block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/19-ledPattern.png",
                    text: "Lets add a pattern"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["setpattern_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["setpattern_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "setpattern_block",
                }
            ],
            buttons: ["readAloud", "previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>waitcrotchet=>playnote=>playnote=>playnote=>waitcrotchet=>playnote=>playnote=>playnote=>waitcrotchet", "ontouchcog=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet=>selectcolour=>setpattern=>waitcrotchet"],
            presenter: "marty"
        },

        // step 20 - change it to be flashing
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/20-flashPattern.png",
                    text: "Set it to a flashing pattern"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>waitcrotchet=>playnote=>playnote=>playnote=>waitcrotchetplaynote=>playnote=>playnote=>waitcrotchet", "ontouchcog=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet=>selectcolour=>setpattern=>waitcrotchet"],
            presenter: "marty"
        },

        // step 21 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/5-pushCogButton.jpg",
                    text: "Push the button!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud", "previous", "next"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>waitcrotchet=>playnote=>playnote=>playnote=>waitcrotchetplaynote=>playnote=>playnote=>waitcrotchet", "ontouchcog=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet=>selectcolour=>waitcrotchet=>selectcolour=>setpattern=>waitcrotchet"],
            presenter: "marty"
        },

        // step 22 - finish the song
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/3/22-wholeSong.png",
                    text: "Push the button!"
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
        
        // step 23 - next steps!
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Well done!</br>Next Steps :- Try changing the colors and patterns. Try making another song. See if you can make the colors change with every note. See if you can use loops to reduce the length of your code. Group activity :- Demonstrate your sound and light show to the class"
                }
            ],
            buttons: ["readAloud", "previous"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial3;