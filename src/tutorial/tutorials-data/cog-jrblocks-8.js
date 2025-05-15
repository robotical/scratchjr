const cogJrBlocksTutorial8 = {
    id: "cog-jrblocks-8",
    platform: "blocksjr",
    title: "Make a night light",
    description: "We introduce the light sensor on cog, and use it to turn on the lights automatically",
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
                    text: "Let's make a night light!"
                }
            ],
            buttons: ["next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 2 - go to the cog event blocks
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/2-cogEvents.png",
                    text: "Select the <b>Cog Events</b> category"
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

        // step 3 - Add a start on light block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/3-light.png",
                    text: "Add a <b>Start on Light</b> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onlight_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onlight_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onlight_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onlight"],
            presenter: "marty"
        },

        // step 4 - change it to on dark
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/light-dark.png",
                    text: "Change it to trigger when <b>Dark</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onlight"],
            presenter: "marty"
        },

        // step 5 - add a set color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/5-setColor.png",
                    text: "Add a <b>Set Color</b> block and pick a color"
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
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onlight=>selectcolour"],
            presenter: "marty"
        },

        // step 6 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/cogLightSenseOn.gif",
                    text: "Try it out! Cover the light sensor or move Cog into a dark place"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 7 - Add another start on light block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/7-secondOnLight.png",
                    text: "Add another <b>Start On Light</b> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onlight_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onlight_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onlight_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onlight=>selectcolour", "onlight"],
            presenter: "marty"
        },

        // step 8 - add a lights off block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/8-lightsOff.png",
                    text: "Add a <b>Lights Off</b> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["clearcolours_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-looks"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["clearcolours_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "clearcolours_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onlight=>selectcolour", "onlight=>clearcolours"],
            presenter: "marty"
        },

        // step 9 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/cogLightSenseOnOff.gif",
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

        // step 10 - add a third start on light block
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/11-thirdOnLight.png",
                    text: "Add a third <b>Start On Light</b> block"
                }
            ],
            nextStepActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onlight_block"]
                },
            ],
            hintActions: [
                {
                    type: "ShowCategory",
                    category: "cog-start"
                },
                {
                    type: "HighlightBlocks",
                    blocks: ["onlight_block"]
                },
                {
                    type: "DragBlockToScriptArea",
                    block: "onlight_block",
                }
            ],
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onlight=>selectcolour", "onlight=>clearcolours", "onlight"],
            presenter: "marty"
        },

        // step 11 - Change it to twilight
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/light-mid.png",
                    text: "Change it to start on <b>Twilight</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 12 - add another light color
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/12-setColor.png",
                    text: "Add a <b>Set Color</b> block and pick a different color"
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
            buttons: ["previous", "next", "hint", "readAloud"],
            expectedCode: ["onlight=>selectcolour", "onlight=>clearcolours", "onlight=>selectcolour"],
            presenter: "marty"
        },

        // step 13 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/cogLightSenseLevels.gif",
                    text: "Try it out! Can you make Cog show both different colors?"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onlight=>selectcolour", "onlight=>clearcolours", "onlight=>selectcolour"],
            presenter: "marty"
        },

        // step 14 - Add a second scene
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/14-secondScene.png",
                    text: "Add a <b>Second Scene</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onlight=>selectcolour", "onlight=>clearcolours", "onlight=>selectcolour"],
            presenter: "marty"
        },

        // step 15 - Add lights to trigger when the scene is activated
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/15-scene2lights.png",
                    text: "Add <b>On Flag</b>, <b>Set Color</b>, <b>Set Pattern Flash</b> blocks"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>setpattern"],
            presenter: "marty"
        },

        // step 16 - Add go to page 1 on bright light
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/16-goToPage.png",
                    text: "Add <b>On Light</b> and <b>Go To Page 1</b> blocks"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>setpattern", "onlight=>gotopage"],
            presenter: "marty"
        },

        // step 17 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Try it out, put cog in bright light"
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

        // step 18 - page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/18-page1.png",
                    text: "It'll go back to page 1"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 19 - change on dark to go to page 2 instead
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/19-goToPage.png",
                    text: "Change the code to make it <b>Go To Page 2</b> when dark"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onlight=>gotopage", "onlight=>clearcolours", "onlight=>selectcolour"],
            presenter: "marty"
        },

        // step 20 - Go To page 2 by putting cog into darkness
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/20-page2.png",
                    text: "Go to page 2 by putting cog into darkness"
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

        // step 21 - Add tilt left and right
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/21-tilt.png",
                    text: "Add <b>On Tilt Right</b> and <b>On Tilt Left</b> blocks, and <b>Set Color</b>s for each"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>selectcolour=>setpattern", "onlight=>gotopage", "tiltany=>selectcolour", "tiltany=>selectcolour"],
            presenter: "marty"
        },   

        // step 22 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/waveCog.gif",
                    text: "Try it out! Wave cog from side to side in the darkness"
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

        // step 23 - Go back to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/23-page1.png",
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

        // step 24 - Add a daytime background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/24-background.png",
                    text: "Add a daytime background"
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

        // step 25 - Go back to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/25-page2.png",
                    text: "Go back to page 2"
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

        // step 26 - Add a night time background
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/26-background.png",
                    text: "Add a night time background"
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

        // step 27 - Add a star sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/27-starSprite.png",
                    text: "Add a star sprite"
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

        // step 28 - Add code to animate the star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/28-starCode.png",
                    text: "Add code to make the star move"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>forward=>forever", "onflag=>right=>forever", "onflag=>shrink=>wait=>grow=>forever", "onflag=>up=>forever"],
            presenter: "marty"
        },

        // step 29 - Go back to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/8/29-page1.png",
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

        // step 30 - Try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Try it out! Now when it's dark there will be a starry scene"
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


        // step 31 - Next steps
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "<p><b>Well done!</b><br /> You've made cog a night light!</p><p>&nbsp;</p><p>Now try making a light show with your friends</p>"
                }
            ],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial8;