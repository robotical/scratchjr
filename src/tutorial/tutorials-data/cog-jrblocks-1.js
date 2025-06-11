import Localization from "../../utils/Localization";

const cogJrBlocksTutorial1 = {
    id: "cog-jrblocks-1",
    platform: "blocksjr",         
    title: Localization.localize("COG_JRBLOCKS1_TITLE"),
    description: "We'll use sequencing to program cog to play a tune when the button is pressed",
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
                    text: Localization.localize("COG_JRBLOCKS1_STEP_1_TEXT")
                }
            ],
            buttons: ["readAloud","next"],
            expectedCode: [],
            presenter: "marty"
        },
        // Can we add automatic guidance to connect to cog, that only appears if they're not already connected?

        // step 2 - select the events category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/2-events.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_2_TEXT")
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
            buttons: ["readAloud","previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 3 - pick the on touch event
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/3-buttonPress.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_3_TEXT")
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
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog"],
            presenter: "marty"
        },

        // step 4 - go to the sounds category
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/4-sounds.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_4_TEXT")
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
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog_block"],
            presenter: "marty"
        },

        // step 5 - play an existing tune
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/5-playTune.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_5_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["whistle_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["whistle_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "whistle_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>whistle"],
            presenter: "marty"
        },

        // step 6 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/6-pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_6_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>whistle"],
            presenter: "marty"
        },


        // step 7 - remove the tune block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/7-removeTune.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_7_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog"],
            presenter: "marty"
        },

        // step 8 - try a different tune
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/8-playTune.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_8_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["confusion_block", "disbelief_block", "excitement_block", "noway_block", "no_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["confusion_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "confusion_block",
                }
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>confusion"],
            presenter: "marty"
        },

        // step 9 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/6-pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_9_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>confusion"],
            presenter: "marty"
        },

        // step 10 - Remove the tune block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/7-removeTune.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_10_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog"],
            presenter: "marty"
        },

        // step 11 - add a musical note
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/11-noteBlock.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_11_TEXT")
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
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote"],
            presenter: "marty"
        },

        // step 12 - select which note
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/12-selectNote-E.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_12_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>playnote"],
            presenter: "marty"
        },

        // step 13 - try it out!

        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/6-pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_13_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>playnote"],
            presenter: "marty"
        },

        // step 14 - add a second note and make it an E
        // should we split this into two steps?
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/14-secondNote.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_14_TEXT")
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
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote=>playnote"],
            presenter: "marty"
        },

        // step 15 - add the first bar
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/15-firstBar.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_15_TEXT")
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
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote"],
            presenter: "marty"
        },

        // step 16 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/6-pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_16_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote"],
            presenter: "marty"
        },

        // step 17 - add the second bar
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/17-secondBar.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_17_TEXT")
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
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote"],
            presenter: "marty"
        },

        // step 18 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/6-pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_18_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote"],
            presenter: "marty"
        },

        // step 19 - add the third bar
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/19-thirdBar.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_19_TEXT")
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
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote"],
            presenter: "marty"
        },

        // step 20 - add the fourth bar
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/20-fourthBar.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_20_TEXT")
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
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote"],
            presenter: "marty"
        },

        // step 21 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/6-pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_21_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote"],
            presenter: "marty"
        },

        // step 22 - well done!
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
                    text: Localization.localize("COG_JRBLOCKS1_STEP_22_TEXT")
                }
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 23 - add a tempo block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/23-metronome.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_23_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["settempo_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-sound"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["settempo_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "settempo_block",
                }
            ],
            buttons: ["readAloud","previous", "next", "hint"],
            expectedCode: ["ontouchcog=>settempo=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote"],
            presenter: "marty"
        },

        // step 24 - set the tempo
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/24-tempo.png",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_24_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>settempo=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote"],
            presenter: "marty"
        },

        // step 25 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/1/6-pushCogButton.jpg",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_25_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["ontouchcog=>settempo=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote=>playnote"],
            presenter: "marty"
        },

        // step 26 - next steps
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS1_STEP_26_TEXT")
                }
            ],
            nextStepActions: [],
            hintActions: [],
            buttons: ["readAloud","previous", "readAloud",],
            expectedCode: [],
            presenter: "marty"
        }
    ]
}

export default cogJrBlocksTutorial1;