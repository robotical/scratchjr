import Localization from "../../utils/Localization";

const cogJrBlocksTutorial9 = {
    id: "cog-jrblocks-9",
    platform: "blocksjr",
    title: Localization.localize("COG_JRBLOCKS9_TITLE"),
    description: "We'll make a dodgeball game using Cog as the controller!",
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
                    text: Localization.localize("COG_JRBLOCKS9_STEP_1_TEXT")
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
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/2-background.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_2_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 3 - Add the text "Shake to start"
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/3-text.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_3_TEXT")
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

        // step 4 - Add another scene
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/4-addScene.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_4_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 5 - go to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/5-page1.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_5_TEXT")
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

        // step 6 - Add an on shake block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/6-onShake.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_6_TEXT")
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
            expectedCode: ["onshake"],
            presenter: "marty"
        },

        // step 7 - Add a go to page 2 block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/7-goToPage.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_7_TEXT")
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
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onshake=>gotopage"],
            presenter: "marty"
        },

        // step 8 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/shakeCog.gif",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_8_TEXT")
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

        // step 9 - you'll got to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/9-page2.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_9_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 10 - add another gym background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/10-background.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_10_TEXT")
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

        // step 11 - Add movement blocks
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/11-moveBlocks.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_11_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed=>back", "onobjectsensed=>forward"],
            presenter: "marty"
        },

        // step 12 - add a jump button
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/12-jump.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_12_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed=>back", "onobjectsensed=>forward", "ontouchcog=>hop"],
            presenter: "marty"
        },

        // step 13 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/13-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_13_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed=>back", "onobjectsensed=>forward", "ontouchcog=>hop"],
            presenter: "marty"
        },

        // step 14 - Add a basketball sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/14-basketball.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_14_TEXT")
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

        // step 15 - Move the sprites
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/15-moveSprites.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_15_TEXT")
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

        // step 16 - Make the basketball move
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/16-basketballMove.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_16_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>back=>forever"],
            presenter: "marty"
        },

        // step 17 - Add an on bump
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/17-onBump.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_17_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>back=>forever", "ontouch=>message"],
            presenter: "marty"
        },

        // step 18 - Add another page
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/18-addPage.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_18_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 19 - add background and "game over"
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/19-gameOver.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_19_TEXT")
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

        // step 20 - add shake to restart
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/20-onShake.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_20_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onshake=>gotopage"],
            presenter: "marty"
        },

        // step 21 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/shakeCog.gif",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_21_TEXT")
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
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/22-page2.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_22_TEXT")
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

        // step 23 - Select the Marty sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/23-marty.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_23_TEXT")
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

        // step 24 - Add movements for when the ball hits Marty
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/24-whenHit.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_24_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed=>back", "onobjectsensed=>forward", "ontouchcog=>hop", "onmessage=>left", "onmessage=>hop"],
            presenter: "marty"
        },

        // step 25 - Press the green flag
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/25-flag.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_25_TEXT")
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

        // step 26 - see what happens
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/26-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_26_TEXT")
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

        // step 27 - Add a go to page 3 block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/27-goToPage.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_27_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onobjectsensed=>back", "onobjectsensed=>forward", "ontouchcog=>hop", "onmessage=>left", "onmessage=>hop=>gotopage"],
            presenter: "marty"
        },  

        // step 28 - start the scene again
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/25-flag.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_28_TEXT")
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

        // step 29 - game over screen
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/29-gameOver.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_29_TEXT")
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

        // step 30 - Go to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/30-page2.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_30_TEXT")
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

        // step 31 - reset the sprite positions
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/31-resetSprites.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_31_TEXT")
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

        // step 32 - Add a star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/32-star.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_32_TEXT")
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

        // step 33 - Increase score
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/33-increaseScore.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_33_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>increasecounter"],
            presenter: "marty"
        },

        // step 34 - hide the star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/34-hide.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_34_TEXT")
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["hide_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "sprite-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["hide_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "hide_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["ontouch=>increasecounter=>hide"],
            presenter: "marty"
        },

        // step 35 - reset score
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/35-resetScore.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_35_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>increasecounter=>hide", "onflag=>startstopcounter"],
            presenter: "marty"
        },

        // step 36 - Make the star move
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/36-starMove.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_36_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouch=>increasecounter=>hide", "onflag=>startstopcounter", "onflag=>setspeed=>hide=>forward=>show=>wait=>forever"],
            presenter: "marty"
        },

        // step 37 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/37-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_37_TEXT")
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

        // step 38 - go to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/38-page2.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_38_TEXT")
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

        // step 39 - reset the sprite positions
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/31-resetSprites.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_39_TEXT")
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

        // step 40 - select the basketball
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/40-basketball.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_40_TEXT")
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

        // step 41 - add more basketball movement
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/41-basketballMoves.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_41_TEXT")
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>back=>forever", "ontouch=>message", "onflag=>up=>wait=>down=>wait=>forever"],
            presenter: "marty"
        },

        // step 42 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/42-tryItOut.gif",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_42_TEXT")
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

        // step 43 - nice work!
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_43_TEXT")
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
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/9/44-nextSteps.png",
                    text: Localization.localize("COG_JRBLOCKS9_STEP_44_TEXT")
                }
            ],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial9;