const cogJrBlocksTutorial12 = {
    id: "cog-jrblocks-12",
    platform: "blocksjr",
    title: "Reaction test",
    description: "We'll make a game that tests your reactions with Cog!",
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
                    text: "Let's make a reaction test game!"
                }
            ],
            buttons: ["next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 2 - move Marty down
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/2-moveDown.png",
                    text: "Make Marty move down forever"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "readAloud", "next"],
            expectedCode: ["onflag=>down=>forever"],
            presenter: "marty"
        },

        // step 3 - Send message on bump
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/3-sendMessage.png",
                    text: "<b>Send a message</b> when Marty touches another sprite"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>down=>forever", "ontouch=>message"],
            presenter: "marty"
        },

        // step 4 - And make Cog light up briefly
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/4-cogLights.png",
                    text: "And make Cog <b>light up briefly</b> at the same time"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["readAloud","previous", "next"],
            expectedCode: ["onflag=>down=>forever", "ontouch=>message", "ontouch=>selectcolour=>wait=>clearcolours"],
            presenter: "marty"
        },

        // step 5 - add a new sprite
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/5-newSprite.png",
                    text: "Press the button to add a sprite"
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

        // step 6 - add motion control
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/6-drawSprite.png",
                    text: "Press the <b>draw button</b> to make your own sprite"
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

        // step 7 - set the thickness
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/7-thickness.png",
                    text: "Set the line <b>thickness</b> to maximum"
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

        // step 8 - draw a line
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/8-line.png",
                    text: "Draw a squiggly line <b>from top left to bottom right</b>"
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

        // step 9 - move it
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/9-linePosition.png",
                    text: "Move it to the bottom of the screen"
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

        // step 10 - Move the line across the screen
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/10-moveLine.png",
                    text: "Add code to move the line quickly across the screen"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>setspeed=>back"],
            presenter: "marty"
        },

        // step 11 - Try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/11-tryItOut.gif",
                    text: "Try it out! Press the green flag"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 12 - Add a repeat
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/12-repeat.png",
                    text: "Add a <b>repeat</b> block"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>setspeed=>repeat=>back"],
            presenter: "marty"
        },

        // step 13 - Add an octopus
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/13-octopus.png",
                    text: "Add an <b>Octopus sprite</b>"
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

        // step 14 - Move the octopus
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/14-octopusPosition.png",
                    text: "Make it small and move it just below the top left corner"
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

        // step 15 - make it hop
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/15-jump.png",
                    text: "Add code to <b>hop on button push</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["ontouchcog=>hop"],
            presenter: "marty"
        },

        // step 16 - try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/pushCogButton.jpg",
                    text: "Try it out - push the button on cog"
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

        // step 17 - add a star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/17-star.png",
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

        // step 18 - position it
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/18-starPosition.png",
                    text: "Position it in the <b>top left corner</b> above the octopus"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 19 - show the star when message received
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/19-onmessage.png",
                    text: "When the message is received, show the star briefly"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onmessage=>show", "onmessage=>wait=>hide"],
            presenter: "marty"
        },

        // step 20 - reset score and hide star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/20-resetAndHide.png",
                    text: "Add blocks to <b>reset the score</b> and <b>hide the star</b>"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onmessage=>show", "onmessage=>wait=>hide", "onflag=>startstopcounter=>hide"],
            presenter: "marty"
        },

        // step 21 - Try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/21-tryItOut.gif",
                    text: "Try it out! Press the green flag"
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

        // step 22 - increase score
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/22-increaseScore.png",
                    text: "<b>Increase the score and hide the star</b> when the octopus collects it"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onmessage=>show", "onmessage=>wait=>hide", "onflag=>startstopcounter=>hide", "ontouch=>increasecounter=>hide"],
            presenter: "marty"
        },   

        // step 23 - add light and sound
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/23-lightSound.png",
                    text: "Add light and sound feedback"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [
            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onmessage=>show", "onmessage=>wait=>hide", "onflag=>startstopcounter=>hide", "ontouch=>increasecounter=>hide", "ontouch=>selectcolour=>playnote"],
            presenter: "marty"
        },

        // step 24 - Try it out
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/24-tryItOut.gif",
                    text: "Try it out! <br /><br />Push the button when cog lights up"
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

        // step 25 - add a second page
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/25-page2.png",
                    text: "Add a <b>second page</b>"
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

        // step 26 - game over
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/26-gameOver.png",
                    text: "Add the text <b>Game Over</b>"
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

        // step 27 - go to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/27-goToPage.png",
                    text: "Add <b>On shake, go to page 1</b> blocks"
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

        // step 28 - go back to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/28-page1.png",
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

        // step 29 - select the line
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/29-line.png",
                    text: "Select the line sprite"
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

        // step 30 - add a go to page 2
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/30-goToPage.png",
                    text: "Add a <b>go to page 2</b> block"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>setspeed=>repeat=>back=>gotopage"],
            presenter: "marty"
        },

        // step 31 - try it out!
        {
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "Try it out! Press the green flag to play the game"
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

        // step 32 - Select the star
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/32-star.png",
                    text: "Select the <b>star</b> on <b>page 1</b>"
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

        // step 33 - replace the wait with a rest
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/33-rest.png",
                    text: "<b>Replace</b> the wait with a <b>rest for 1 beat</b> block"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onmessage=>show", "onmessage=>waitcrotchet=>hide", "onflag=>startstopcounter=>hide", "ontouch=>increasecounter=>hide", "ontouch=>selectcolour=>playnote"],
            presenter: "marty"
        },

        // step 34 - select the line
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/34-line.png",
                    text: "Select the line"
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

        // step 35 - go to page 1
        {
            instructionActions: [
                {
                    type: "ShowInstructorImage",
                    url: "https://content.robotical.io/static/tutorials/cog/jr-blocks/12/35-reduceWait.png",
                    text: "<b>Increase the tempo</b> to speed up the game halfway through!"
                }
            ],
            nextStepActions: [
            ],
            hintActions: [

            ],
            buttons: ["previous", "next", "readAloud"],
            expectedCode: ["onflag=>setspeed=>settempo=>repeat=>back=>settempo=>repeat=>back=>gotopage"],
            presenter: "marty"
        },

        // step 36 - Try it out!
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
            buttons: ["previous", "next", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },

        // step 47 - Next steps
        {
            nextStepActions: [
            ],
            instructionActions: [
                {
                    type: "ShowInstructorText",
                    text: "<p><b>Well done!</b><br />You've made a reaction test game!<br /><br />Can you make it get even faster?<br /><Br />Pair up with a friend and try it with two cogs at once!"
                }
            ],
            buttons: ["previous", "readAloud"],
            expectedCode: [],
            presenter: "marty"
        },


    ]
}

export default cogJrBlocksTutorial12;