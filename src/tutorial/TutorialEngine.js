import ScratchJr from "../editor/ScratchJr";
import TutorialUI from "../editor/ui/TutorialUI";
import { colorToRGBA } from "../utils/lib";

export default class TutorialEngine {

    constructor(tutorial) {
        this.tutorial = tutorial;
        this.currentStep = 0;
        this._setUpUI();
        this.updateUI(this.tutorial.tutorialSteps[this.currentStep]);
    }

    _setUpUI() {
        TutorialUI.setupUI(this.tutorial);
    }

    progressStep() {
        this.currentStep++;
        console.log("Current step: ", this.currentStep);
        this.updateUI(this.tutorial.tutorialSteps[this.currentStep]);
    }

    previousStep() {
        this.currentStep--;
        console.log("Current step: ", this.currentStep);
        this.updateUI(this.tutorial.tutorialSteps[this.currentStep]);
    }

    updateUI(step) {
        TutorialUI.clearUIBeforeStep();
        TutorialUI.updateProgressBar(this.currentStep, this.tutorial.tutorialSteps.length-1);
        /* First, decide which buttons to show */
        this._handleButtons(step.buttons, step);

        /* Do the instruction actions */
        this._handleActions(step.instructionActions);

        /* Do the nextStepAction actions */
        this._handleActions(step.nextStepActions);
    }

    _handleButtons(buttons, step) {
        buttons.forEach(button => {
            switch (button) {
                case "next":
                    TutorialUI.showNextButton(this.progressStep.bind(this));
                    break;
                case "previous":
                    TutorialUI.showPreviousButton(this.previousStep.bind(this));
                    break;
                case "hint":
                    TutorialUI.showHintButton(() => this._handleActions(step.hintActions));
                    break;
                default:
                    break;
            }
        });
    }

    _handleActions(actions) {
        actions.forEach(action => {
            switch (action.type) {
                case "ShowInstructorText":
                    TutorialUI.showSpeechBubbleWithText(action.text);
                    break;
                case "ShowCategory":
                    TutorialUI.selectCategory(action.category);
                    break;
                case "HighlightBlocks":
                    TutorialUI.highlightBlocks(action.blocks);
                    break;
                case "DragBlockToScriptArea":
                    TutorialUI.blockToScriptsAnimation(action.block);
                    break;
                case "HighlightElement":
                    TutorialUI.highlightElement(
                        action.elementId,
                        colorToRGBA(action.hexColor, .5),
                        this._onHighlightedElementClickActionDecider(action.onClickAction, action.args)
                    );
                    break;
                case "ShowMartyMode":
                    TutorialUI.showMartyMode();
                    break;
                default:
                    break;
            }
        });
    }

    _onHighlightedElementClickActionDecider(onClickAction, args) {
        switch (onClickAction) {
            case "NextStep":
                return this.progressStep.bind(this);
            default:
                break;
        }
    }

    evaluateScriptsArea() {
        if (this.tutorial.tutorialSteps[this.currentStep].expectedCode && this.tutorial.tutorialSteps[this.currentStep].expectedCode.length > 0) {
            for (const expectedCodeCondition of this.tutorial.tutorialSteps[this.currentStep].expectedCode) {
                if (!this._evaluateExpectedCode(expectedCodeCondition)) {
                    return false;
                }
            }
            // if we reach here, all expected code conditions are met
            // highlight the next step button
            TutorialUI.highlightElement("nextStep", colorToRGBA("#FF0000", .5));
        }
    }

    _evaluateExpectedCode(expectedCodeCondition) {
        // expectedCodeCondition eg: ["block1=>block2"] meaning block1 should be followed by block2 (next block)
        // actual blocks: {blocktype: "block1", next?: {blocktype: "block2", next?: {blocktype: "block3", next?: null}}}
        const actualBlocks = ScratchJr.getBlocks();
        let actualBlocksCompiledCondition = "";
        let actualBlock = actualBlocks[0];
        while (actualBlock) {
            actualBlocksCompiledCondition += `${actualBlock.blocktype}`;
            if (actualBlock.next) {
                actualBlocksCompiledCondition += "=>";
            }
            actualBlock = actualBlock.next;
        }
        return actualBlocksCompiledCondition === expectedCodeCondition;
    }

}

