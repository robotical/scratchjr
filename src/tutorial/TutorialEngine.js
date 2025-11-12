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

    async updateUI(step) {
        TutorialUI.clearUIBeforeStep();
        TutorialUI.updateProgressBar(this.currentStep, this.tutorial.tutorialSteps.length - 1);
        /* First, decide which buttons to show */
        this._handleButtons(step.buttons, step);

        /* Do the instruction actions */
        await this._handleActions(step.instructionActions);

        /* Do the nextStepAction actions */
        await this._handleActions(step.nextStepActions);
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
                case "readAloud":
                    const textToRead = step.instructionActions.find(action => action.type === "ShowInstructorText" || action.type === "ShowInstructorImage").text;
                    TutorialUI.showReadAloudButton(textToRead);
                    break;
                default:
                    break;
            }
        });
    }

    async _handleActions(actions = []) {
        if (!actions) {
            return;
        }
        for (const action of actions) {
            await this._executeAction(action);
        }
    }

    _executeAction(action) {
        switch (action.type) {
            case "ShowInstructorText":
                TutorialUI.showSpeechBubbleWithText(action.text);
                return;
            case "ShowInstructorImage":
                TutorialUI.showSpeechBubbleWithImage(action.url, action.text);
                return;
            case "ShowInstructorVideo":
                TutorialUI.showSpeechBubbleWithVideo(action.url);
                return;
            case "ShowCategory":
                TutorialUI.selectCategory(action.category);
                return;
            case "HighlightBlocks":
                TutorialUI.highlightBlocks(action.blocks);
                return;
            case "DragBlockToScriptArea":
                TutorialUI.blockToScriptsAnimation(action.block);
                return;
            case "HighlightElement":
                TutorialUI.highlightElement(
                    action.elementId,
                    colorToRGBA(action.hexColor, .5),
                    this._onHighlightedElementClickActionDecider(action.onClickAction, action.args)
                );
                return;
            case "ShowMartyMode":
                TutorialUI.showMartyMode();
                return;
            case "WaitForTime":
                return new Promise(resolve => setTimeout(resolve, action.time ?? 0));
            case "ClickOnElement":
                return new Promise(resolve => {
                    const delay = action.wait ?? 0;
                    setTimeout(() => {
                        TutorialUI.clickElement(action.elementId);
                        resolve();
                    }, delay);
                });
            default:
                return;
        }
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
        // expectedCodeCondition e.g. "block1=>block2=>block3"
        const actualBlocks = ScratchJr.getBlocks();
        if (!actualBlocks || actualBlocks.length === 0) return false;
        // Start DFS from the first script block only
        
        for (const block of actualBlocks) {
            let compiled = [];
            const stack = [block];
            while (stack.length) {
                const block = stack.pop();
                if (!block) continue;
                compiled.push(block.blocktype);
                // Push "next" first so that "inside" gets processed before it
                if (block.next) {
                    stack.push(block.next);
                }
                if (block.inside) {
                    stack.push(block.inside);
                }
            }

            const actualBlocksCompiledCondition = compiled.join('=>');
            console.log('actualBlocksCompiledCondition:', actualBlocksCompiledCondition);
            if (actualBlocksCompiledCondition === expectedCodeCondition) {
                return true;
            }
        }
        return false;
    }
}
