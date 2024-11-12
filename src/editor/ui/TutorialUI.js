import { gn, newHTML } from "../../utils/lib";
import ScratchJr from "../ScratchJr";
import Palette from "./Palette";
import UI from "./UI";

export default class TutorialUI {

    /* Sets up tutorial UI elements */
    static setupUI(frame) {
        TutorialUI.frame = frame;
        TutorialUI.topSection = gn('topsection');
        TutorialUI.createTutorialMenuBar();
        TutorialUI.createInstructor();
    }

    /* Menu Bar */
    static createTutorialMenuBar() {
        /* Menu bar contains the controls of the tutorial */
        TutorialUI.tutorialMenuBar = newHTML('div', 'tutorialMenuBar', TutorialUI.topSection);
        TutorialUI.tutorialMenuBar.setAttribute('id', 'tutorialMenuBar');

        // tutorial menu bar should have in this order a close button, the title of the tutorial, a question mark icon, previous and next buttons
        TutorialUI.tutorialMenuBar.innerHTML = `
            <button id="closeTutorial" class="tutorialButton">X</button>
            <div id="tutorialTitle" class="tutorialTitle">Tutorial Title</div>
            <button id="tutorialHelp" class="tutorialButton">?</button>
            <button id="previousStep" class="tutorialButton">Previous</button>
            <button id="nextStep" class="tutorialButton">Next</button>
        `;
    }

    /* Instructor */
    static createInstructor() {
        /* Instructor is a sprite that will guide the user through the tutorial */
        TutorialUI.instructor = newHTML('div', 'tutorialInstructor', TutorialUI.frame);
        TutorialUI.instructor.setAttribute('id', 'tutorialInstructor');

        // create img element for the instructor
        TutorialUI.instructor.innerHTML = `
            <img src="./assets/ui/Marty_Instructor.svg" alt="instructor" />
            <div class="speechBubble">
            <div id="speechBubbleText"></div>
            <div id="speechBubbleImage"></div>
            <div id="speechBubbleVideo"></div>
                <svg id="tutorial-down-pointing-arrow-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 8L12 14L18 8" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        `;

        // Make the instructor draggable
        TutorialUI.instructor.addEventListener('pointerdown', TutorialUI.onDragStart);
        TutorialUI.createModal();
    }

    /* Modal */
    static createModal() {
        TutorialUI.modal = newHTML('div', 'tutorialModal', document.body);
        TutorialUI.modal.setAttribute('id', 'tutorialModal');
        TutorialUI.modal.innerHTML = `
            <div class="modalContent">
                <span class="closeModal">&times;</span>
                <div id="modalMedia"></div>
            </div>
        `;
        TutorialUI.modal.querySelector('.closeModal').addEventListener('click', TutorialUI.closeModal);
        TutorialUI.modal.addEventListener('click', (event) => {
            if (event.target === TutorialUI.modal) {
                TutorialUI.closeModal();
            }
        });
    }

    static showModal(content) {
        const modalMedia = TutorialUI.modal.querySelector('#modalMedia');
        modalMedia.innerHTML = content;
        TutorialUI.modal.style.display = 'block';
    }

    static closeModal() {
        TutorialUI.modal.style.display = 'none';

        const video = TutorialUI.modal.querySelector('video');
        if (video) {
            video.pause();
        }
    }

    /* Drag and Drop Instructor */
    static onDragStart(event) {
        event.preventDefault();
        const instructor = TutorialUI.instructor;
        const shiftX = event.clientX - instructor.getBoundingClientRect().left;
        const shiftY = event.clientY - instructor.getBoundingClientRect().top;

        const moveAt = (pageX, pageY) => {
            instructor.style.left = pageX - shiftX + 'px';
            instructor.style.top = pageY - shiftY + 'px';
        };

        const onPointerMove = (event) => {
            moveAt(event.pageX, event.pageY);
        };

        document.addEventListener('pointermove', onPointerMove);

        const onDragEnd = () => {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onDragEnd);
            document.removeEventListener('pointercancel', onDragEnd);
        };

        document.addEventListener('pointerup', onDragEnd);
        document.addEventListener('pointercancel', onDragEnd);
    }

    /* Bubble Speech */
    static showSpeechBubbleWithText(text) {
        const speechBubble = TutorialUI.instructor.querySelector('.speechBubble');
        speechBubble.style.display = 'block';
        const speechBubbleText = TutorialUI.instructor.querySelector('#speechBubbleText');
        speechBubbleText.textContent = text;
    }

    static showSpeechBubbleWithImage(imageURL) {
        const speechBubble = TutorialUI.instructor.querySelector('.speechBubble');
        speechBubble.style.display = 'block';
        const speechBubbleImage = TutorialUI.instructor.querySelector('#speechBubbleImage');
        speechBubbleImage.innerHTML = `<img src="${imageURL}" alt="speech bubble image" style="max-width: 100%; max-height: 200px;" />`;
        speechBubbleImage.querySelector('img').addEventListener('click', (e) => {
            TutorialUI.showModal(`<img class="modalImage" src="${imageURL}" alt="expanded image" />`);
        });
    }

    static showSpeechBubbleWithVideo(videoURL) {
        const speechBubble = TutorialUI.instructor.querySelector('.speechBubble');
        speechBubble.style.display = 'block';
        const speechBubbleVideo = TutorialUI.instructor.querySelector('#speechBubbleVideo');
        speechBubbleVideo.innerHTML = `<video src="${videoURL}" controls style="max-width: 100%; max-height: 200px;"></video>`;
        speechBubbleVideo.querySelector('video').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            TutorialUI.showModal(`<video class="modalVideo" src="${videoURL}" controls autoplay></video>`);
        });
    }

    static clearSpeechBubble() {
        const speechBubble = TutorialUI.instructor.querySelector('.speechBubble');
        speechBubble.style.display = 'none';
        const speechBubbleText = TutorialUI.instructor.querySelector('#speechBubbleText');
        speechBubbleText.textContent = '';
        const speechBubbleImage = TutorialUI.instructor.querySelector('#speechBubbleImage');
        speechBubbleImage.innerHTML = '';
        const speechBubbleVideo = TutorialUI.instructor.querySelector('#speechBubbleVideo');
        speechBubbleVideo.innerHTML = '';
    }

    /* Animate Movement */
    static async blockToScriptsAnimation(blockID) {
        const blockOriginal = gn(blockID);
        const block = TutorialUI.cloneBlock(blockOriginal);
        TutorialUI.addPointingHandToBlock(block);
        const { dx, dy } = TutorialUI.calculateAnimationDistance(blockOriginal, gn('scripts'));

        TutorialUI.prepareBlockForAnimation(block, blockOriginal);
        await new Promise(resolve => setTimeout(resolve, 400)); // just for better UX
        TutorialUI.animateBlock(block, dx, dy, () => {
            gn('palette').style.overflow = '';
            document.body.removeChild(block);
        });
    }

    static cloneBlock(blockOriginal) {
        const block = blockOriginal.cloneNode(true);
        const originalCanvases = blockOriginal.getElementsByTagName('canvas');
        const clonedCanvases = block.getElementsByTagName('canvas');

        for (let i = 0; i < originalCanvases.length; i++) {
            const clonedContext = clonedCanvases[i].getContext('2d');
            clonedContext.drawImage(originalCanvases[i], 0, 0);
        }

        return block;
    }

    static calculateAnimationDistance(blockOriginal, scriptsDiv) {
        const blockRect = blockOriginal.getBoundingClientRect();
        const POIRect = scriptsDiv.getBoundingClientRect();

        const dx = POIRect.left + POIRect.width / 2 - (blockRect.left + blockRect.width / 2);
        const dy = POIRect.top + POIRect.height / 2 - (blockRect.top + blockRect.height / 2);

        return { dx, dy };
    }

    static prepareBlockForAnimation(block, blockOriginal) {
        const blockRect = blockOriginal.getBoundingClientRect();
        const palette = gn('palette');

        block.style.background = blockOriginal.style.background;
        block.style.border = blockOriginal.style.border;
        block.style.zIndex = 100000;
        block.style.position = 'fixed';
        block.style.left = `${blockRect.left}px`;
        block.style.top = `${blockRect.top}px`;
        block.style.width = `${blockRect.width}px`;
        block.style.height = `${blockRect.height}px`;

        palette.style.overflow = 'visible';
        document.body.appendChild(block);
    }

    static animateBlock(block, dx, dy, onFinish) {
        const animation = block.animate([
            { transform: `translate(0px, 0px)` },
            { transform: `translate(${dx}px, ${dy}px)` }
        ], {
            duration: 2000,
            iterations: 1,
            easing: 'ease-in-out',
            fill: 'forwards'
        });

        animation.onfinish = () => setTimeout(onFinish, 400);
    }

    static addPointingHandToBlock(block) {
        const pointingHand = newHTML('div', 'pointingHand', block);
        pointingHand.innerHTML = `<svg stroke="black" stroke-width="2" class="svg-icon" style="vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M653.944471 468.239059c0 4.517647 2.258824-12.468706 9.306353-23.672471a32.075294 32.075294 0 0 1 60.777411 20.48v72.643765c-1.204706 18.703059-3.794824 37.345882-7.68 55.687529a193.927529 193.927529 0 0 1-21.082353 44.152471 231.303529 231.303529 0 0 0-38.098823 58.247529 118.362353 118.362353 0 0 0-3.222588 31.984942c0 9.938824 1.325176 19.847529 3.855058 29.455058a179.892706 179.892706 0 0 1-39.363764 0c-12.468706-1.927529-28.16-26.895059-31.984941-34.575058a12.137412 12.137412 0 0 0-22.106353 0c-7.017412 12.167529-22.377412 34.243765-33.581177 35.538823-21.112471 2.56-65.596235 0-100.171294 0 0 0 5.752471-32.015059-7.348706-43.52-13.131294-11.535059-26.563765-24.997647-36.803765-33.942588l-26.563764-29.424941a143.420235 143.420235 0 0 1-39.664941-64c-6.716235-30.087529-6.083765-44.815059 0-56.621177 6.716235-9.848471 16.865882-16.835765 28.461176-19.546353 9.306353-1.626353 18.853647-0.963765 27.858824 1.92753 6.264471 2.620235 11.685647 6.927059 15.661176 12.468706 7.378824 9.938824 9.607529 14.727529 7.047529 3.855058a853.805176 853.805176 0 0 0-13.131294-49.603764c-5.421176-17.618824-10.842353-27.527529-15.028706-39.363765-4.156235-11.836235-9.607529-23.04-15.99247-37.767529a370.447059 370.447059 0 0 1-14.396235-46.08 45.748706 45.748706 0 0 1 7.981176-37.436236 44.784941 44.784941 0 0 1 43.52-11.203764c12.077176 5.240471 22.256941 14.064941 29.123765 25.298823 9.577412 15.480471 17.317647 32.015059 23.04 49.272471 10.541176 27.467294 18.070588 56.018824 22.407529 85.11247-0.783059-17.167059 0.602353-34.364235 4.156235-51.2a35.870118 35.870118 0 0 1 22.076236-22.076235c9.517176-3.041882 19.606588-3.704471 29.455059-1.927529 9.788235 2.168471 18.432 7.860706 24.304941 15.99247 7.348706 18.703059 11.565176 38.490353 12.498823 58.578824 0.903529-17.167059 3.915294-34.123294 8.944941-50.56753 5.360941-7.529412 13.161412-12.950588 22.076236-15.36a89.961412 89.961412 0 0 1 32.015059 0c8.643765 2.951529 16.233412 8.402824 21.744941 15.661177 6.776471 16.986353 10.872471 34.936471 12.167529 53.127529" fill="#FFFFFF" /></svg>`;
    }

    /* Highlight Blocks */
    static highlightBlocks(blockIDs) {
        const palette = gn('palette');
        const allBlocksInPalette = palette.children;
        let found = false;
        for (let i = 0; i < allBlocksInPalette.length; i++) {
            allBlocksInPalette[i].style.opacity = '0.5';
            allBlocksInPalette[i].style.pointerEvents = 'none'; // Disable interaction
            allBlocksInPalette[i].classList.remove('highlightedBlock'); // Remove glow effect

            if (blockIDs.includes(allBlocksInPalette[i].id)) {
                allBlocksInPalette[i].style.opacity = '1';
                allBlocksInPalette[i].style.pointerEvents = 'auto'; // Enable interaction for the highlighted block
                allBlocksInPalette[i].classList.add('highlightedBlock'); // Add glow effect
                found = true;
            }
        }
        if (!found) {
            TutorialUI.unhighlightBlocks();
        }
    }

    static unhighlightBlocks() {
        const palette = gn('palette');
        const allBlocksInPalette = palette.children;
        for (let i = 0; i < allBlocksInPalette.length; i++) {
            allBlocksInPalette[i].style.opacity = '1';
            allBlocksInPalette[i].classList.remove('highlightedBlock'); // Remove glow effect
        }
    }

    /* Select Category */
    static selectCategory(categoryId) {
        const selectorsLeft = gn('selectors');
        const selectorsRight = gn('selectorsright');

        // get the id's of each category in the left and right selectors (all children but the first)
        const leftSelectorIds = Array.from(selectorsLeft.children).slice(1).map(child => child.id);
        const rightSelectorIds = Array.from(selectorsRight.children).slice(1).map(child => child.id);

        const selectorIds = [...leftSelectorIds, ...rightSelectorIds];
        const selectedCategoryIdx = selectorIds.indexOf(categoryId);
        Palette.selectCategory(selectedCategoryIdx);
    }

    /*MartyMode*/
    static showMartyMode() {
        if (!ScratchJr.isMartyModeEnabled) {
            UI.toggleMartyMode();
        }
    }

    static hideMartyMode() {
        if (ScratchJr.isMartyModeEnabled) {
            UI.toggleMartyMode();
        }
    }
}


window.TutorialUI = TutorialUI;