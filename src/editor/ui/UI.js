//////////////////////////////////////
//  General UI Layout
/////////////////////////////////////

import ScratchJr from '../ScratchJr';
import BlockSpecs from '../blocks/BlockSpecs';
import Alert from './Alert';
import Project from './Project';
import ProjectCloud from '../ProjectCloud';
import Thumbs from './Thumbs';
import Palette from './Palette';
import Grid from './Grid';
import Stage from '../engine/Stage';
import ScriptsPane from './ScriptsPane';
import Undo from './Undo';
import Library from './Library';
import OS from '../../tablet/OS';
import IO from '../../tablet/IO';
import MediaLib from '../../tablet/MediaLib';
import Paint from '../../painteditor/Paint';
import Events from '../../utils/Events';
import Localization from '../../utils/Localization';
import ScratchAudio from '../../utils/ScratchAudio';
import { addStoredCloudId, getStoredCloudIds, removeStoredCloudId, touchStoredCloudId } from '../../utils/cloudLocalStore';
import goToLink from '../../utils/goToLink';
import {
    frame, gn, CSSTransition, localx, newHTML, newButton, scaleMultiplier, fullscreenScaleMultiplier,
    getIdFor, isTablet, newDiv, newTextInput, isAndroid, getDocumentWidth, getDocumentHeight,
    setProps, globalx
} from '../../utils/lib';
import {
    closeDialog,
    openDialog,
    registerDialog,
    setMainLandmark,
    setPressedState,
    setSelectedState
} from '../../utils/accessibility';
import { cogSvg } from '../../html-svgs/cog';
import { microBitSvg } from '../../html-svgs/microbit';
import { spriteSvg } from '../../html-svgs/sprite';
import { martySvg } from '../../html-svgs/marty';
import { spriteDeselectedSvg } from "../../html-svgs/sprite-deselected";
import { martyDeselectedSvg } from "../../html-svgs/marty-deselected";
import { martyToggleOn } from "../../html-svgs/marty_toggle_on";
import { spriteToggleOn } from "../../html-svgs/sprite_toggle_on";
import { batterySvg } from '../../html-svgs/battery-svg';
import { signalSvg } from '../../html-svgs/signal-svg';
import { createRaftConnectionIssueDetectedHelper, createRaftConnectionIssueResolvedHelper, raftDisconnectedSubscriptionHelper, raftVerifiedSubscriptionHelper } from '../../utils/raft-subscription-helpers';
import { truncateString } from "../../utils/truncate-string";
import Trace from './Trace';

let projectNameTextInput = null;
let info = null;
let okclicky = null;
let infoBoxOpen = false;
let activeCloudPanel = null;
let cloudAlertAnchor = null;

const EMAILSHARE = 0;
const AIRDROPSHARE = 1;


let cogSignalAndBatteryInterval = null;
let martySignalAndBatteryInterval = null;

const connectionIssueTimers = new WeakMap();
const connectedRaftByButton = new WeakMap();

const DISCONNECT_CONTEXT_REMOVAL_POLL_MS = 250;
const DISCONNECT_CONTEXT_REMOVAL_TIMEOUT_MS = 30000;
const APPLICATION_MANAGER_RECONCILE_POLL_MS = 100;
const APPLICATION_MANAGER_RECONCILE_MAX_ATTEMPTS = 50;
const MICROBIT_HOST_CONNECT_METHODS = [
    'connectGenericMicroBit',
    'connectGenericMicrobit',
    'connectMicroBit',
    'connectMicrobit'
];
const MICROBIT_EXTENSION_BLOCK_PREFIX = 'microbit';

const SVG_ID_ATTRIBUTE_RE = /\s+id="[^"]*"/g;

function stripInlineSvgIds(svgMarkup) {
    return svgMarkup.replace(SVG_ID_ATTRIBUTE_RE, '');
}

function getMartySensorAvailabilityFromRaft(raft) {
    const connectedSensors = raft?.publishedDataAnalyser?.connectedSensors;
    return {
        colour: !!connectedSensors?.colourSensor,
        obstacle: !!connectedSensors?.objectSensor,
        light: !!connectedSensors?.lightSensor,
        noise: !!connectedSensors?.noiseSensor
    };
}

export default class UI {
    static get infoBoxOpen() {
        return infoBoxOpen;
    }

    static isProjectInfoReady() {
        return !!(Project.metadata && ScratchJr.stage && ScratchJr.stage.currentPage);
    }

    static setProjectInfoEnabled(enabled) {
        if (!info) {
            return;
        }
        info.disabled = !enabled;
        info.setAttribute('aria-disabled', enabled ? 'false' : 'true');
    }

    static getGuideControlLabel(key) {
        const label = Localization.localize(key, { N: 0 });
        const parts = label.split('|');
        return parts.length > 1 ? parts.slice(1).join('|').trim() : label;
    }

    static layout() {
        setMainLandmark(frame, {
            id: 'frame',
            label: Localization.localize('A11Y_MAIN_CONTENT')
        });
        UI.topSection();
        UI.middleSection();
        UI.BottomSection();
        UI.fullscreenControls();
        UI.createFormForText(frame);
        ScratchJr.setupColKeypad();
        ScratchJr.setupKeypad();
        ScratchJr.setupEditableField();
        UI.aspectRatioAdjustment();


    }

    static setCloudAlertAnchor(anchor) {
        if (anchor) {
            cloudAlertAnchor = anchor;
        }
    }

    static getCloudAlertAnchor() {
        if (UI.isValidCloudAlertAnchor(cloudAlertAnchor)) {
            return cloudAlertAnchor;
        }
        cloudAlertAnchor = null;
        var fallbackIds = ['infoboxCloudSection', 'infobox', 'flip'];
        for (var i = 0; i < fallbackIds.length; i++) {
            var el = gn(fallbackIds[i]);
            if (UI.isValidCloudAlertAnchor(el)) {
                return el;
            }
        }
        return frame;
    }

    static isValidCloudAlertAnchor(anchor) {
        if (!anchor || !document || !document.body) {
            return false;
        }
        if (!document.body.contains(anchor)) {
            return false;
        }
        return !!(anchor.offsetWidth || anchor.offsetHeight);
    }

    static getControlAriaLabel(id) {
        switch (id) {
            case 'addtext':
                return UI.getGuideControlLabel('INTERFACE_GUIDE_ADD_TEXT');
            case 'setbkg':
                return ScratchJr.isMartyModeEnabled
                    ? Localization.localize('A11Y_CHANGE_SURFACE')
                    : UI.getGuideControlLabel('INTERFACE_GUIDE_CHANGE_BG');
            case 'grid':
                return UI.getGuideControlLabel('INTERFACE_GUIDE_GRID');
            case 'traceBtn':
                return Localization.localize('A11Y_TRACE');
            case 'traceClear':
                return Localization.localize('A11Y_CLEAR_TRACE');
            case 'go':
                return Localization.localize(ScratchJr.runtime && !ScratchJr.runtime.inactive()
                    ? 'A11Y_STOP_PROJECT'
                    : 'A11Y_RUN_PROJECT');
            case 'resetall':
                return Localization.localize('A11Y_RESET_ALL_CHARACTERS');
            case 'full':
                return UI.getGuideControlLabel('INTERFACE_GUIDE_PRESENTATION_MODE');
            case 'nextpage':
                return Localization.localize('A11Y_NEXT');
            case 'prevpage':
                return Localization.localize('A11Y_PREVIOUS');
            default:
                return null;
        }
    }

    // Helps debug on Android 4.2 by enabling the user to type in a
    // JavaScript expression and evaluate the output and render to console.log.
    /*static addDebugControl () {
        var div = newHTML('div', 'debug', document.body);
        setProps(div.style, {
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: '64px',
            height: '64px',
            background: 'red',
            zIndex: 30000
        });
        div.ontouchstart = function (e) {
            console.log(eval(prompt('Enter Debug JavaScript')));
        };
    }*/

    /** Tweak some elements depending on aspect ratio */
    static aspectRatioAdjustment() {
        var aspect = getDocumentWidth() / getDocumentHeight();
        if (aspect > 1.45) {
            // Nudge sprite list right a bit and the pages list left a bit
            gn('library').style.left = '7.55vh';
            gn('pages').style.right = '1vw';
        }
    }

    static topSection() {
        var div = newHTML('div', 'topsection', frame);
        div.setAttribute('id', 'topsection');
        if (ScratchJr.isEditable()) {
            UI.addProjectInfo();
        }
        UI.leftPanel(div);
        UI.stageArea(div);
        UI.rightPanel(div);
    }

    // Function to create a connect button with an icon and title (for cog and marty buttons)
    static createConnectButton(parent, iconName, buttonText, buttonId, onClick) {
        // Create button container
        const connectButton = newButton('connectButton', parent, {
            ariaLabel: Localization.localize('A11Y_CONNECT') + ' ' + buttonText
        });

        // Set button ID
        connectButton.setAttribute('id', buttonId);

        // Set position to relative
        connectButton.style.position = 'relative';

        // Create icon container (icon on the left)
        const iconDiv = newHTML('div', 'connectIcon', connectButton);
        iconDiv.innerHTML = stripInlineSvgIds(iconName); // Add the icon (could be an <i> tag or an SVG)

        // Add battery and signal strength indicators
        const batteryAndSignalContainer = newHTML('div', 'batteryAndSignalContainer', connectButton);

        const signalIndicator = newHTML('div', 'signalIndicatorContainer', batteryAndSignalContainer);
        const batteryIndicator = newHTML('div', 'batteryIndicatorContainer', batteryAndSignalContainer);
        batteryIndicator.innerHTML = stripInlineSvgIds(batterySvg(0));
        signalIndicator.innerHTML = stripInlineSvgIds(signalSvg(0));
        batteryIndicator.style.display = 'none';
        signalIndicator.style.display = 'none';

        // create raft name field
        const raftName = newHTML('div', 'raftNameConnectButton', connectButton);
        raftName.style.display = 'none';


        // Create button container 
        const iconButtonContainer = newHTML('div', 'iconButtonContainer notConnectedButtonContainer', connectButton);

        // Pointer activation can leave :focus-visible stuck on embedded touch browsers.
        // Track the input modality so pointer clicks do not retain a focus ring while
        // keyboard activation keeps the standard accessible focus treatment.
        const clearPointerFocus = () => connectButton.classList.remove('connectButtonPointerFocus');
        connectButton.addEventListener('click', (event) => {
            connectButton.classList.toggle('connectButtonPointerFocus', event.detail > 0);
        });
        connectButton.addEventListener('keydown', clearPointerFocus);
        connectButton.addEventListener('blur', clearPointerFocus);

        // Action to perform when the button is clicked
        connectButton.onclick = () => {
            onClick(connectButton);
        };

        return connectButton;
    }

    static createConnectionButtons(leftPanel) {
        const connectionButtonsArea = newHTML('div', 'connectionButtonsArea', leftPanel);
        connectionButtonsArea.setAttribute('id', 'connectionButtonsArea');

        /* COG */
        const cogButton = UI.createConnectButton(connectionButtonsArea, cogSvg, 'Cog', 'cogConnectionButton', (connectButton) => {
            const applicationManager = typeof window !== 'undefined' ? window.applicationManager : null;
            if (!applicationManager || typeof applicationManager.connectGenericCog !== 'function') {
                return;
            }
            applicationManager.connectGenericCog((raft) => {
                UI.setupConnectionButtonWhenVerified(connectButton, raft, UI.setupCogConnectionButton);
            });
        });
        /* END COG */
        /* MARTY */
        const martyButton = UI.createConnectButton(connectionButtonsArea, martySvg, 'Marty', 'martyConnectionButton', (connectButton) => {
            const applicationManager = typeof window !== 'undefined' ? window.applicationManager : null;
            if (!applicationManager || typeof applicationManager.connectGenericMarty !== 'function') {
                return;
            }
            applicationManager.connectGenericMarty((raft) => {
                UI.setupConnectionButtonWhenVerified(connectButton, raft, () => {
                    // Check which Marty's sensors are connected
                    // When sensor availability is known, call UI.updateMartySensorAvailability(raft, availability)
                    setTimeout(() => {
                        UI.updateMartySensorAvailability(raft, getMartySensorAvailabilityFromRaft(raft));
                    }, 3000);
                    UI.setupMartyConnectionButton(connectButton, raft);
                });
            });
        });

        // The host injects applicationManager after the Blocks Jr object has loaded. Reconcile once
        // it is available so a connection established in the host is reflected without a refresh.
        UI.reconcileConnectionButtonsWhenApplicationManagerReady(cogButton, martyButton);
        /* END MARTY */

        const extensionAddButton = UI.createExtensionAddButton(connectionButtonsArea);

        /* MICROBIT */
        const microBitButton = UI.createConnectButton(
            connectionButtonsArea,
            microBitSvg,
            'micro:bit',
            'microBitConnectionButton',
            UI.connectMicroBit
        );

        const connectedMicroBit = window.microBitManager?.getActiveMicroBit?.();
        if (connectedMicroBit) {
            ScratchJr.isMicroBitExtensionEnabled = true;
            UI.setupMicroBitConnectionButton(microBitButton, connectedMicroBit);
        }
        UI.updateMicroBitExtensionControls();
        /* END MICROBIT */
    }

    static setupConnectionButtonWhenVerified(button, raft, setupConnectionButton) {
        if (!raft || typeof setupConnectionButton !== 'function') {
            return null;
        }

        const verifiedSubscription = raftVerifiedSubscriptionHelper(raft);
        let didSetupConnectionButton = false;
        const setupOnce = () => {
            if (didSetupConnectionButton) {
                return;
            }
            didSetupConnectionButton = true;
            verifiedSubscription.unsubscribe();
            setupConnectionButton(button, raft);
        };

        // Subscribe before checking current state so verification cannot be missed between the two.
        verifiedSubscription.subscribe(setupOnce);
        const isAlreadyVerified = typeof raft.hasVerifiedConnection === 'function'
            ? raft.hasVerifiedConnection()
            : raft.isVerified === true;
        if (isAlreadyVerified) {
            setupOnce();
        }
        return verifiedSubscription;
    }

    static reconcileConnectionButtonsWhenApplicationManagerReady(cogButton, martyButton, attempt = 0) {
        const applicationManager = typeof window !== 'undefined' ? window.applicationManager : null;
        const canReadConnectedRafts = applicationManager &&
            typeof applicationManager.getTheCurrentlySelectedDeviceOrFirstOfItsKind === 'function';

        if (canReadConnectedRafts) {
            const connectedCog = applicationManager.getTheCurrentlySelectedDeviceOrFirstOfItsKind('Cog');
            if (connectedCog) {
                UI.setupConnectionButtonWhenVerified(cogButton, connectedCog, UI.setupCogConnectionButton);
            }

            const connectedMarty = applicationManager.getTheCurrentlySelectedDeviceOrFirstOfItsKind('Marty');
            if (connectedMarty) {
                UI.setupConnectionButtonWhenVerified(martyButton, connectedMarty, UI.setupMartyConnectionButton);
            }
            return true;
        }

        if (attempt < APPLICATION_MANAGER_RECONCILE_MAX_ATTEMPTS) {
            setTimeout(() => {
                UI.reconcileConnectionButtonsWhenApplicationManagerReady(cogButton, martyButton, attempt + 1);
            }, APPLICATION_MANAGER_RECONCILE_POLL_MS);
        }
        return false;
    }

    static createExtensionAddButton(parent) {
        const addButton = newButton('extensionAddButton', parent, {
            ariaLabel: 'Manage extensions'
        });
        addButton.setAttribute('id', 'addExtensionButton');
        const icon = newHTML('span', 'extensionAddIcon', addButton);
        icon.textContent = '+';
        icon.setAttribute('aria-hidden', 'true');
        addButton.onclick = () => {
            ScratchAudio.sndFX('tap.wav');
            UI.openExtensionsLibrary();
        };
        return addButton;
    }

    static createExtensionsLibrary() {
        const dialog = newHTML('div', 'extensionsLibrary fade', frame);
        dialog.setAttribute('id', 'extensionsLibrary');

        const closeButton = newButton('extensionsLibraryClose', dialog, {
            ariaLabel: Localization.localize('A11Y_CLOSE')
        });
        closeButton.onclick = UI.closeExtensionsLibrary;

        const title = newHTML('div', 'extensionsLibraryTitle', dialog);
        title.setAttribute('id', 'extensionsLibraryTitle');
        title.textContent = 'Extensions';

        const cards = newHTML('div', 'extensionsLibraryCards', dialog);
        const microBitCard = newButton('extensionsLibraryCard', cards, {
            ariaLabel: 'Add micro:bit extension'
        });
        microBitCard.setAttribute('id', 'microBitExtensionCard');

        const iconWrap = newHTML('div', 'extensionsLibraryCardIcon', microBitCard);
        iconWrap.innerHTML = stripInlineSvgIds(microBitSvg);
        const textWrap = newHTML('div', 'extensionsLibraryCardText', microBitCard);
        const cardTitle = newHTML('div', 'extensionsLibraryCardTitle', textWrap);
        cardTitle.setAttribute('id', 'microBitExtensionCardTitle');
        cardTitle.textContent = 'micro:bit';
        const cardDescription = newHTML('div', 'extensionsLibraryCardDescription', textWrap);
        cardDescription.setAttribute('id', 'microBitExtensionCardDescription');
        cardDescription.textContent = 'Adds micro:bit blocks and connection.';
        const action = newHTML('div', 'extensionsLibraryCardAction', microBitCard);
        action.setAttribute('id', 'microBitExtensionCardAction');
        action.textContent = '+';
        action.setAttribute('aria-hidden', 'true');

        const removeWarning = newHTML('div', 'extensionsLibraryWarning', dialog);
        removeWarning.setAttribute('id', 'microBitExtensionRemoveWarning');
        removeWarning.setAttribute('aria-live', 'polite');
        const warningTitle = newHTML('div', 'extensionsLibraryWarningTitle', removeWarning);
        warningTitle.textContent = 'Remove micro:bit extension?';
        const warningText = newHTML('div', 'extensionsLibraryWarningText', removeWarning);
        warningText.textContent = 'All micro:bit blocks used in this project will be deleted from the editor.';
        const warningActions = newHTML('div', 'extensionsLibraryWarningActions', removeWarning);
        const cancelRemove = newButton('extensionsLibrarySecondaryButton', warningActions, {
            id: 'microBitExtensionRemoveCancel',
            textContent: 'Cancel'
        });
        const confirmRemove = newButton('extensionsLibraryDangerButton', warningActions, {
            id: 'microBitExtensionRemoveConfirm',
            textContent: 'Remove'
        });
        cancelRemove.onclick = () => {
            ScratchAudio.sndFX('tap.wav');
            UI.hideMicroBitExtensionRemoveWarning();
        };
        confirmRemove.onclick = () => {
            ScratchAudio.sndFX('tap.wav');
            UI.disableMicroBitExtension();
            UI.closeExtensionsLibrary(null, { playSound: false });
        };

        microBitCard.onclick = () => {
            ScratchAudio.sndFX('tap.wav');
            if (ScratchJr.isMicroBitExtensionEnabled) {
                UI.showMicroBitExtensionRemoveWarning();
                return;
            }
            UI.enableMicroBitExtension();
            UI.closeExtensionsLibrary(null, { playSound: false, restoreFocus: false });
            setTimeout(() => {
                const microBitButton = gn('microBitConnectionButton');
                if (microBitButton) {
                    microBitButton.focus();
                }
            }, 0);
        };

        registerDialog(dialog, {
            labelledBy: 'extensionsLibraryTitle',
            initialFocus: function () {
                return microBitCard;
            },
            scope: frame,
            onRequestClose: UI.closeExtensionsLibrary
        });

        return dialog;
    }

    static openExtensionsLibrary() {
        let dialog = gn('extensionsLibrary');
        if (!dialog) {
            dialog = UI.createExtensionsLibrary();
        }
        UI.updateExtensionsLibraryState();

        const backdrop = gn('backdrop');
        if (backdrop) {
            backdrop.setAttribute('class', 'modal-backdrop fade in');
            setProps(backdrop.style, {
                display: 'block'
            });
        }

        dialog.className = 'extensionsLibrary fade in';
        openDialog(dialog);
    }

    static closeExtensionsLibrary(event, options = {}) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        const dialog = gn('extensionsLibrary');
        if (!dialog) {
            return;
        }
        if (options.playSound !== false) {
            ScratchAudio.sndFX('exittap.wav');
        }
        UI.hideMicroBitExtensionRemoveWarning({ focusCard: false });
        dialog.className = 'extensionsLibrary fade';
        closeDialog(dialog, {
            restoreFocus: options.restoreFocus !== false
        });

        const backdrop = gn('backdrop');
        if (backdrop) {
            backdrop.setAttribute('class', 'modal-backdrop fade');
            setProps(backdrop.style, {
                display: 'none'
            });
        }
    }

    static updateExtensionsLibraryState() {
        const card = gn('microBitExtensionCard');
        if (!card) {
            return;
        }
        const isLoaded = ScratchJr.isMicroBitExtensionEnabled;
        const description = gn('microBitExtensionCardDescription');
        const action = gn('microBitExtensionCardAction');

        card.classList.toggle('loaded', isLoaded);
        card.setAttribute('aria-label', isLoaded ? 'Remove micro:bit extension' : 'Add micro:bit extension');
        if (description) {
            description.textContent = isLoaded ?
                'micro:bit blocks are available. Select to remove.' :
                'Adds micro:bit blocks and connection.';
        }
        if (action) {
            action.textContent = isLoaded ? '-' : '+';
        }
        if (!isLoaded) {
            UI.hideMicroBitExtensionRemoveWarning({ focusCard: false });
        }
    }

    static showMicroBitExtensionRemoveWarning() {
        const warning = gn('microBitExtensionRemoveWarning');
        if (!warning) {
            return;
        }
        warning.classList.add('show');
        const confirmButton = gn('microBitExtensionRemoveConfirm');
        if (confirmButton) {
            confirmButton.focus();
        }
    }

    static hideMicroBitExtensionRemoveWarning(options = {}) {
        const warning = gn('microBitExtensionRemoveWarning');
        if (!warning) {
            return;
        }
        warning.classList.remove('show');
        if (options.focusCard !== false) {
            const card = gn('microBitExtensionCard');
            if (card) {
                card.focus();
            }
        }
    }

    static enableMicroBitExtension(options = {}) {
        ScratchJr.isMicroBitExtensionEnabled = true;
        UI.updateMicroBitExtensionControls();
        UI.updateExtensionsLibraryState();
        if (Palette.parent) {
            Palette.recreateRightCategory();
            if (options.selectCategory !== false) {
                UI.selectMicroBitStartCategory();
            }
        }
    }

    static disableMicroBitExtension() {
        UI.removeMicroBitBlocksFromProject();
        UI.disconnectMicroBitForExtensionUnload();

        ScratchJr.isMicroBitExtensionEnabled = false;
        UI.updateMicroBitExtensionControls();
        UI.updateExtensionsLibraryState();
        if (Palette.parent) {
            Palette.recreateRightCategory();
            UI.selectFirstRightCategory();
        }
    }

    static removeMicroBitBlocksFromProject() {
        const pages = ScratchJr.stage?.pages || [];
        let removedCount = 0;
        for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
            const page = pages[pageIndex];
            let removedFromPage = 0;
            const spriteIds = page && typeof page.getSprites === 'function' ? page.getSprites() : [];
            for (let spriteIndex = 0; spriteIndex < spriteIds.length; spriteIndex++) {
                const spriteId = spriteIds[spriteIndex];
                const scriptsElement = gn(spriteId + '_scripts');
                const scripts = scriptsElement?.owner;
                if (!scripts || typeof scripts.deleteBlocksWhere !== 'function') {
                    continue;
                }
                const removedFromSprite = scripts.deleteBlocksWhere(block =>
                    block && typeof block.blocktype === 'string' &&
                    block.blocktype.indexOf(MICROBIT_EXTENSION_BLOCK_PREFIX) === 0
                );
                if (removedFromSprite > 0) {
                    removedCount += removedFromSprite;
                    removedFromPage += removedFromSprite;
                    Undo.record({
                        action: 'scripts',
                        where: page.id,
                        who: spriteId
                    });
                }
            }
            if (removedFromPage > 0 && page && typeof page.updateThumb === 'function') {
                page.updateThumb();
            }
        }
        if (removedCount > 0) {
            ScratchJr.storyStart('UI.removeMicroBitBlocksFromProject');
        }
        return removedCount;
    }

    static disconnectMicroBitForExtensionUnload() {
        const microBit = window.microBitManager?.getActiveMicroBit?.();
        if (!microBit) {
            return;
        }
        if (microBit.__mbjrHostManaged && window.applicationManager?.disconnectGeneric) {
            window.applicationManager.disconnectGeneric(microBit);
        } else if (typeof microBit.disconnect === 'function') {
            microBit.disconnect();
        }
        window.microBitManager?.removeMicroBit?.(microBit);

        const button = gn('microBitConnectionButton');
        if (button) {
            button.classList.remove('connectButtonConnected');
            UI.resetConnectionButtonVisuals(button);
            button.setAttribute('aria-label', Localization.localize('A11Y_CONNECT') + ' micro:bit');
        }
    }

    static selectMicroBitStartCategory() {
        const leftSelectors = gn('selectors');
        const rightSelectors = gn('selectorsright');
        if (!leftSelectors || !rightSelectors || !BlockSpecs.categoriesMicroBit?.length) {
            return;
        }
        const leftCategoriesLength = ScratchJr.isMartyModeEnabled ?
            BlockSpecs.categoriesMarty.length :
            BlockSpecs.categories.length;
        Palette.selectCategory(leftCategoriesLength + BlockSpecs.categoriesCog.length);
    }

    static selectFirstRightCategory() {
        const leftSelectors = gn('selectors');
        const rightSelectors = gn('selectorsright');
        if (!leftSelectors || !rightSelectors) {
            return;
        }
        const leftCategoriesLength = ScratchJr.isMartyModeEnabled ?
            BlockSpecs.categoriesMarty.length :
            BlockSpecs.categories.length;
        Palette.selectCategory(leftCategoriesLength);
    }

    static updateMicroBitExtensionControls() {
        const enabled = ScratchJr.isMicroBitExtensionEnabled;
        const connectionButtonsArea = gn('connectionButtonsArea');
        const addButton = gn('addExtensionButton');
        const microBitButton = gn('microBitConnectionButton');

        if (connectionButtonsArea) {
            connectionButtonsArea.classList.toggle('extensionEnabled', enabled);
        }
        if (addButton) {
            addButton.style.display = 'flex';
            addButton.disabled = false;
            addButton.setAttribute('aria-hidden', 'false');
            addButton.setAttribute('aria-label', 'Manage extensions');
            addButton.removeAttribute('tabindex');
        }
        if (microBitButton) {
            microBitButton.style.display = enabled ? '' : 'none';
            microBitButton.disabled = !enabled;
            microBitButton.setAttribute('aria-hidden', enabled ? 'false' : 'true');
        }
    }

    static getHostMicroBitConnectFunction() {
        const applicationManager = typeof window !== 'undefined' ? window.applicationManager : null;
        if (!applicationManager) {
            return null;
        }
        for (let i = 0; i < MICROBIT_HOST_CONNECT_METHODS.length; i++) {
            const methodName = MICROBIT_HOST_CONNECT_METHODS[i];
            if (typeof applicationManager[methodName] === 'function') {
                return applicationManager[methodName].bind(applicationManager);
            }
        }
        return null;
    }

    static connectMicroBit(connectButton) {
        const hostConnect = UI.getHostMicroBitConnectFunction();
        if (hostConnect) {
            hostConnect((microBit) => {
                if (!microBit) {
                    return;
                }
                microBit.__mbjrHostManaged = true;
                UI.setupMicroBitConnectionButton(connectButton, microBit);
            });
            return;
        }

        const manager = window.microBitManager;
        if (!manager || typeof manager.createAndConnectMicroBit !== 'function') {
            UI.showMicroBitConnectionError(connectButton, new Error('micro:bit connection is not available.'));
            return;
        }

        manager.createAndConnectMicroBit()
            .then(microBit => {
                UI.setupMicroBitConnectionButton(connectButton, microBit);
            })
            .catch(error => {
                UI.showMicroBitConnectionError(connectButton, error);
            });
    }

    static getMicroBitConnectionErrorMessage(error) {
        const message = error && error.message ? error.message : '';
        const errorName = error && error.name ? error.name : '';
        if (errorName == 'NotFoundError' || /cancelled|canceled|requestDevice\(\) chooser/i.test(message)) {
            return 'No micro:bit was selected. Click Connect again when you are ready.';
        }
        if (/web bluetooth is not available|not available in this browser/i.test(message)) {
            return 'micro:bit connection is not available in this browser. Try a browser that supports Web Bluetooth.';
        }
        return 'Could not connect to the micro:bit. Check that it is powered on and nearby, then try again.';
    }

    static showMicroBitConnectionError(button, error) {
        const message = UI.getMicroBitConnectionErrorMessage(error);
        if (window.applicationManager?.toaster?.warn) {
            window.applicationManager.toaster.warn(message);
            return;
        }
        console.warn(message, error);
        Alert.open(frame, button, message, '#d62222', 3000);
    }

    static updateMartySensorAvailability(martyOrId, availability) {
        const manager = window.martyManager;
        if (!manager || typeof manager.setMartySensorAvailability !== 'function') {
            return;
        }
        const martyId = typeof martyOrId === 'string' ? martyOrId : martyOrId?.id;
        if (!martyId) {
            return;
        }
        manager.setMartySensorAvailability(martyId, availability);
    }

    static setMartyModeEnabled(enabled, options = {}) {
        if (ScratchJr.isMartyModeEnabled === enabled) {
            return;
        }
        if (!ScratchJr.stage?.currentPage) {
            return;
        }

        if (options.playSound) {
            ScratchAudio.sndFX('tap.wav');
        }
        ScratchJr.isMartyModeEnabled = enabled;
        UI.renderCorrectMartyModeIcon();
        Trace.clear();
    }

    static switchToMartyModeAfterConnection(raft) {
        UI.updateMartySensorAvailability(raft, getMartySensorAvailabilityFromRaft(raft));
        UI.setMartyModeEnabled(true);
    }

    static showConnIssueOverlay(button, onExpired) {
        UI.hideConnIssueOverlay(button);
        button.style.pointerEvents = 'none';
        const overlay = newHTML('div', 'connIssueOverlay', button);
        const connectionLostText = Localization.localize('A11Y_CONNECTION_LOST');

        let seconds = 60;
        overlay.textContent = `${connectionLostText} ${seconds}`;
        const countdownInterval = setInterval(() => {
            seconds--;
            overlay.textContent = `${connectionLostText} ${seconds}`;
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                connectionIssueTimers.delete(button);
                if (typeof onExpired === 'function') {
                    onExpired();
                }
            }
        }, 1000);
        connectionIssueTimers.set(button, countdownInterval);
    }

    static hideConnIssueOverlay(button) {
        button.style.pointerEvents = 'auto';
        const overlay = button.querySelector('.connIssueOverlay');
        if (overlay) {
            button.removeChild(overlay);
        }
        const countdownInterval = connectionIssueTimers.get(button);
        if (countdownInterval) {
            clearInterval(countdownInterval);
            connectionIssueTimers.delete(button);
        }
    }

    static isRaftInConnectionContext(raft) {
        const raftId = typeof raft === 'string' ? raft : (raft && raft.id);
        const applicationManager = typeof window !== 'undefined' ? window.applicationManager : null;
        if (!applicationManager || !raftId) {
            return false;
        }
        const connectedRaftsContext = applicationManager.connectedRaftsContext;
        if (!Array.isArray(connectedRaftsContext)) {
            return Boolean(applicationManager.connectedRafts && applicationManager.connectedRafts[raftId]);
        }
        return connectedRaftsContext.some(connectedRaft => connectedRaft && connectedRaft.id === raftId);
    }

    static waitForRaftRemovalFromConnectionContext(raft, startedInContext = UI.isRaftInConnectionContext(raft)) {
        if (!startedInContext) {
            return Promise.resolve(false);
        }
        if (!UI.isRaftInConnectionContext(raft)) {
            return Promise.resolve(true);
        }
        const startedAt = Date.now();
        return new Promise(resolve => {
            const pollConnectionContext = () => {
                if (!UI.isRaftInConnectionContext(raft)) {
                    resolve(true);
                    return;
                }
                if (Date.now() - startedAt >= DISCONNECT_CONTEXT_REMOVAL_TIMEOUT_MS) {
                    resolve(false);
                    return;
                }
                setTimeout(pollConnectionContext, DISCONNECT_CONTEXT_REMOVAL_POLL_MS);
            };
            setTimeout(pollConnectionContext, DISCONNECT_CONTEXT_REMOVAL_POLL_MS);
        });
    }

    static disconnectRaftAndClearWhenConfirmed(raft, onConfirmedDisconnect) {
        const applicationManager = typeof window !== 'undefined' ? window.applicationManager : null;
        if (!applicationManager || typeof applicationManager.disconnectGeneric !== 'function') {
            return false;
        }
        const startedInContext = UI.isRaftInConnectionContext(raft);
        const disconnectResult = applicationManager.disconnectGeneric(raft);
        UI.waitForRaftRemovalFromConnectionContext(raft, startedInContext).then(didConfirmDisconnect => {
            if (didConfirmDisconnect && typeof onConfirmedDisconnect === 'function') {
                onConfirmedDisconnect();
            }
        });
        return disconnectResult;
    }

    static resetConnectionButtonVisuals(button) {
        const iconButtonContainer = button.querySelector('.iconButtonContainer');
        iconButtonContainer.classList.remove('connectedButtonContainer');
        iconButtonContainer.classList.add('notConnectedButtonContainer');

        const batteryIndicator = button.querySelector('.batteryIndicatorContainer');
        const signalIndicator = button.querySelector('.signalIndicatorContainer');
        const raftName = button.querySelector('.raftNameConnectButton');
        batteryIndicator.style.display = 'none';
        signalIndicator.style.display = 'none';
        raftName.style.display = 'none';
        raftName.textContent = '';
    }

    static setupCogConnectionButton(button, raft) {
        if (connectedRaftByButton.get(button) === raft) {
            return;
        }
        connectedRaftByButton.set(button, raft);

        // Add the connected class to the button
        button.classList.add('connectButtonConnected');

        // change the class of the button to disconnect
        const connectButtonContainer = button.querySelector('.iconButtonContainer');
        connectButtonContainer.classList.remove('notConnectedButtonContainer');
        connectButtonContainer.classList.add('connectedButtonContainer');

        cogSignalAndBatteryInterval = setInterval(() => {
            if (!raft) {
                return;
            }
            // Update the battery and signal indicators
            const batteryIndicator = button.querySelector('.batteryIndicatorContainer');
            const signalIndicator = button.querySelector('.signalIndicatorContainer');
            const raftName = button.querySelector('.raftNameConnectButton');
            batteryIndicator.style.display = 'grid';
            signalIndicator.style.display = 'grid';
            raftName.style.display = 'grid';
            raftName.textContent = truncateString(raft.getFriendlyName());
            batteryIndicator.innerHTML = stripInlineSvgIds(batterySvg(raft.getBatteryStrength()));
            signalIndicator.innerHTML = stripInlineSvgIds(signalSvg(raft.getRSSI()));
        }, 300);

        // Add the raft to the cog manager and wire it with blocks
        window.cogManager.addCog(raft);
        window.cogManager.wireCogWithBlocks(raft.id);

        // Store the old onClick function to restore it later
        const oldOnClick = button.onclick;
        let didHandleDisconnect = false;

        const handleDisconnected = () => {
            if (didHandleDisconnect) {
                return;
            }
            didHandleDisconnect = true;
            if (connectedRaftByButton.get(button) === raft) {
                connectedRaftByButton.delete(button);
            }

            // When raft is disconnected, update the UI and remove the raft
            button.classList.remove('connectButtonConnected');
            window.cogManager.removeCog(raft);

            // clear the interval to avoid memory leaks
            clearInterval(cogSignalAndBatteryInterval);

            setTimeout(() => {
                // change the button back to the default state
                UI.resetConnectionButtonVisuals(button);
            }, 1000);

            // Unsubscribe from the disconnected event to avoid memory leaks
            disconnectedSubs.unsubscribe();

            UI.hideConnIssueOverlay(button);
            // Unsubscribe from the issue detected event to avoid memory leaks
            connIssueSubs.unsubscribe();
            // Unsubscribe from the issue resolved event to avoid memory leaks
            connIssueResolvedSubs.unsubscribe();

            // Restore the old onClick function
            button.onclick = oldOnClick;
            button.setAttribute('aria-label', Localization.localize('A11Y_CONNECT') + ' Cog');
        };

        // Set the new onClick function to disconnect the raft
        button.onclick = () => {
            UI.disconnectRaftAndClearWhenConfirmed(raft, handleDisconnected);
        };
        button.setAttribute('aria-label', Localization.localize('A11Y_DISCONNECT') + ' ' + raft.getFriendlyName());

        // Set up a subscription to the raft issue detected event
        const connIssueSubs = createRaftConnectionIssueDetectedHelper(raft);
        connIssueSubs.subscribe(() => UI.showConnIssueOverlay(button, () => {
            const applicationManager = typeof window !== 'undefined' ? window.applicationManager : null;
            if (applicationManager && typeof applicationManager.disconnectGeneric === 'function') {
                applicationManager.disconnectGeneric(raft, handleDisconnected, true);
                return;
            }
            handleDisconnected();
        }));

        // Set up a subscription to the connection issue resolved event
        const connIssueResolvedSubs = createRaftConnectionIssueResolvedHelper(raft);
        connIssueResolvedSubs.subscribe(() => UI.hideConnIssueOverlay(button));

        // Set up a subscription to the raft disconnected event
        const disconnectedSubs = raftDisconnectedSubscriptionHelper(raft);
        disconnectedSubs.subscribe(handleDisconnected);
    }

    static setupMartyConnectionButton(button, raft) {
        if (connectedRaftByButton.get(button) === raft) {
            return;
        }
        connectedRaftByButton.set(button, raft);

        // Add the connected class to the button
        button.classList.add('connectButtonConnected');

        // change the class of the button to disconnect
        const connectButtonContainer = button.querySelector('.iconButtonContainer');
        connectButtonContainer.classList.remove('notConnectedButtonContainer');
        connectButtonContainer.classList.add('connectedButtonContainer');

        // Store the old onClick function to restore it later
        const oldOnClick = button.onclick;
        let didHandleDisconnect = false;

        const handleDisconnected = () => {
            if (didHandleDisconnect) {
                return;
            }
            didHandleDisconnect = true;
            if (connectedRaftByButton.get(button) === raft) {
                connectedRaftByButton.delete(button);
            }

            // When raft is disconnected, update the UI and remove the raft
            button.classList.remove('connectButtonConnected');
            window.martyManager?.removeMarty?.(raft);

            // clear the interval to avoid memory leaks
            clearInterval(martySignalAndBatteryInterval);
            setTimeout(() => {
                // change the button back to the default state
                UI.resetConnectionButtonVisuals(button);
            }, 1000);

            // Unsubscribe from the disconnected event to avoid memory leaks
            disconnectedSubs.unsubscribe();

            // Restore the old onClick function
            button.onclick = oldOnClick;
            button.setAttribute('aria-label', Localization.localize('A11Y_CONNECT') + ' Marty');
        };

        // Set the new onClick function before Marty-specific setup. Sensor and block metadata can arrive late.
        button.onclick = () => {
            UI.disconnectRaftAndClearWhenConfirmed(raft, handleDisconnected);
        };
        button.setAttribute('aria-label', Localization.localize('A11Y_DISCONNECT') + ' ' + raft.getFriendlyName());

        martySignalAndBatteryInterval = setInterval(() => {
            if (!raft) {
                return;
            }
            // Update the battery and signal indicators
            const batteryIndicator = button.querySelector('.batteryIndicatorContainer');
            const signalIndicator = button.querySelector('.signalIndicatorContainer');
            const raftName = button.querySelector('.raftNameConnectButton');
            batteryIndicator.style.display = 'grid';
            signalIndicator.style.display = 'grid';
            raftName.style.display = 'grid';
            raftName.textContent = truncateString(raft.getFriendlyName());
            batteryIndicator.innerHTML = stripInlineSvgIds(batterySvg(raft.getBatteryStrength()));
            signalIndicator.innerHTML = stripInlineSvgIds(signalSvg(raft.getRSSI()));
        }, 300);

        if (window.martyManager) {
            try {
                // Add the raft to the marty manager and wire it with blocks
                window.martyManager.addMarty(raft);
                window.martyManager.wireMartyWithBlocks(raft.id);
            } catch (error) {
                console.warn('Unable to wire Marty blocks after connection.', error);
            }
        }

        UI.switchToMartyModeAfterConnection(raft);

        // Set up a subscription to the raft disconnected event
        const disconnectedSubs = raftDisconnectedSubscriptionHelper(raft);
        disconnectedSubs.subscribe(handleDisconnected);
    }

    static setupMicroBitConnectionButton(button, microBit) {
        ScratchJr.isMicroBitExtensionEnabled = true;
        UI.updateMicroBitExtensionControls();

        button.classList.add('connectButtonConnected');

        const connectButtonContainer = button.querySelector('.iconButtonContainer');
        connectButtonContainer.classList.remove('notConnectedButtonContainer');
        connectButtonContainer.classList.add('connectedButtonContainer');

        const batteryIndicator = button.querySelector('.batteryIndicatorContainer');
        const signalIndicator = button.querySelector('.signalIndicatorContainer');
        const raftName = button.querySelector('.raftNameConnectButton');
        batteryIndicator.style.display = 'none';
        signalIndicator.style.display = 'none';
        raftName.style.display = 'grid';
        raftName.textContent = truncateString(
            typeof microBit.getFriendlyName === 'function' ? microBit.getFriendlyName() : 'micro:bit'
        );

        const oldOnClick = button.onclick;
        let didHandleDisconnect = false;
        let unsubscribeDisconnect = null;

        const handleDisconnected = () => {
            if (didHandleDisconnect) {
                return;
            }
            didHandleDisconnect = true;

            button.classList.remove('connectButtonConnected');
            window.microBitManager?.removeMicroBit?.(microBit);

            setTimeout(() => {
                UI.resetConnectionButtonVisuals(button);
            }, 1000);

            if (unsubscribeDisconnect) {
                unsubscribeDisconnect();
                unsubscribeDisconnect = null;
            }

            button.onclick = oldOnClick;
            button.setAttribute('aria-label', Localization.localize('A11Y_CONNECT') + ' micro:bit');
        };

        button.onclick = () => {
            if (microBit.__mbjrHostManaged && window.applicationManager?.disconnectGeneric) {
                UI.disconnectRaftAndClearWhenConfirmed(microBit, handleDisconnected);
                return;
            }
            if (typeof microBit.disconnect === 'function') {
                microBit.disconnect();
            } else {
                handleDisconnected();
            }
        };
        button.setAttribute('aria-label', Localization.localize('A11Y_DISCONNECT') + ' ' +
            (typeof microBit.getFriendlyName === 'function' ? microBit.getFriendlyName() : 'micro:bit'));

        if (window.microBitManager) {
            try {
                window.microBitManager.addMicroBit(microBit);
                window.microBitManager.wireMicroBitWithBlocks(microBit.id);
            } catch (error) {
                console.warn('Unable to wire micro:bit blocks after connection.', error);
            }
        }

        if (typeof microBit.addDisconnectListener === 'function') {
            unsubscribeDisconnect = microBit.addDisconnectListener(handleDisconnected);
        }
    }

    static leftPanel(div) {
        // sprite library
        var sl = newHTML('div', 'leftpanel', div);
        var flip = newButton('flipme', sl, {
            ariaLabel: Localization.localize('ALERT_BACK')
        });
        UI.createConnectionButtons(sl);

        flip.setAttribute('id', 'flip');
        flip.onclick = function (evt) {
            ScratchJr.saveAndFlip(evt);
        }; // move to project
        UI.layoutLibrary(sl);
    }

    static middleSection() {
        var bp = newHTML('div', 'blockspalette', frame);
        bp.setAttribute('id', 'blockspalette');
        Palette.setup(bp);
        Undo.setup(bp);
    }

    static BottomSection() {
        ScriptsPane.createScripts(frame);
    }

    static addProjectInfo() {
        info = newButton('info', frame, {
            ariaLabel: Localization.localize('A11Y_PROJECT_INFO')
        });
        info.setAttribute('id', 'projectinfo');
        UI.setProjectInfoEnabled(false);
        var infobox = newHTML('div', 'infobox fade', frame);
        infobox.setAttribute('id', 'infobox');
        okclicky = newButton('paintdone', infobox, {
            ariaLabel: Localization.localize('A11Y_CLOSE')
        });
        newHTML('div', 'infoboxlogo', infobox);
        var nameField = UI.addEditableName(infobox);
        var staticinfo = newHTML('div', 'fixedinfo', infobox);
        var author = newHTML('div', 'infolabel', staticinfo);
        author.setAttribute('id', 'deviceName');

        var parentsSection = newHTML('div', 'infoboxParentsSection', infobox);
        parentsSection.setAttribute('id', 'parentsection');
        if (window.Settings.shareEnabled) {
            // For Parents button

            var parentsButton = newButton('infoboxParentsButton', parentsSection, {
                textContent: Localization.localize('FOR_PARENTS')
            });
            parentsButton.id = 'infoboxParentsSectionButton';

            // Sharing
            var shareButtons = newHTML('div', 'infoboxShareButtons', infobox);
            shareButtons.setAttribute('id', 'sharebuttons');

            var shareEmail = newButton('infoboxShareButton', shareButtons, {
                textContent: Localization.localize('SHARING_BY_EMAIL')
            });
            shareEmail.id = 'infoboxShareButtonEmail';
            shareEmail.onclick = function (e) {
                UI.infoDoShare(e, nameField, shareLoadingGif, EMAILSHARE);
            };

            if (isAndroid) {
                shareEmail.style.margin = 'auto';
            } else {
                shareEmail.style.float = 'left';
            }

            if (!isAndroid) {
                var shareAirdrop = newButton('infoboxShareButton', shareButtons, {
                    textContent: Localization.localize('SHARING_BY_AIRDROP')
                });
                shareAirdrop.id = 'infoboxShareButtonAirdrop';
                shareAirdrop.style.float = 'right';
                shareAirdrop.onclick = function (e) {
                    UI.infoDoShare(e, nameField, shareLoadingGif, AIRDROPSHARE);
                };
            }

            OS.deviceName(function (name) {
                gn('deviceName').textContent = name;
            });

            var shareLoadingGif = newHTML('img', 'infoboxShareLoading', shareButtons);
            shareLoadingGif.src = './assets/ui/loader.png';
            shareLoadingGif.alt = '';

            parentsButton.onclick = function (e) {
                UI.parentalGate(e, function (e) {
                    UI.showSharing(e, shareButtons, parentsSection);
                });
            };
        }

        var cloudSection = newHTML('div', 'infoboxCloudSection', infobox);
        cloudSection.setAttribute('id', 'infoboxCloudSection');
        UI.setCloudAlertAnchor(cloudSection);

        var cloudControls = newHTML('div', 'infoboxCloudControls', cloudSection);

        var cloudSaveToggle = newButton('infoboxCloudToggleButton', cloudControls, {
            textContent: 'Save'
        });
        cloudSaveToggle.id = 'cloudToggleSave';
        cloudSaveToggle.onclick = function () {
            UI.showCloudPanel('save');
        };

        var cloudLoadToggle = newButton('infoboxCloudToggleButton', cloudControls, {
            textContent: 'Load'
        });
        cloudLoadToggle.id = 'cloudToggleLoad';
        cloudLoadToggle.onclick = function () {
            UI.showCloudPanel('load');
        };

        var cloudPanels = newHTML('div', 'infoboxCloudPanels', cloudSection);

        var cloudSavePanel = newHTML('div', 'infoboxCloudPanel', cloudPanels);
        cloudSavePanel.id = 'cloudSavePanel';
        var cloudSaveDescription = newHTML('div', 'infoboxCloudDescription', cloudSavePanel);
        cloudSaveDescription.textContent = 'Save a copy of this project to the cloud.';
        var cloudSaveButton = newButton('infoboxCloudButton', cloudSavePanel, {
            textContent: 'Save to Cloud'
        });
        cloudSaveButton.id = 'infoboxCloudSave';
        cloudSaveButton.onclick = function (e) {
            UI.setCloudAlertAnchor(e.currentTarget);
            UI.handleCloudSave(e);
        };

        var cloudLoadPanel = newHTML('div', 'infoboxCloudPanel', cloudPanels);
        cloudLoadPanel.id = 'cloudLoadPanel';
        var cloudLoadDescription = newHTML('div', 'infoboxCloudDescription', cloudLoadPanel);
        cloudLoadDescription.textContent = 'Choose a saved ID or enter a new one to load a project.';
        var cloudLoadActions = newHTML('div', 'infoboxCloudLoadActions', cloudLoadPanel);
        var cloudLoadPromptButton = newButton('infoboxCloudSecondaryButton', cloudLoadActions, {
            textContent: 'Enter ID to Load'
        });
        cloudLoadPromptButton.id = 'infoboxCloudLoadPrompt';
        cloudLoadPromptButton.onclick = function (e) {
            UI.setCloudAlertAnchor(e.currentTarget);
            UI.promptCloudLoad(e);
        };
        var cloudLoadList = newHTML('div', 'infoboxCloudList', cloudLoadPanel);
        cloudLoadList.id = 'cloudIdList';

        info.onclick = UI.showInfoBox;
        okclicky.onclick = function (evt) {
            UI.hideInfoBox(evt, nameField);
        };
        registerDialog(infobox, {
            label: Localization.localize('A11Y_PROJECT_INFO_DIALOG'),
            initialFocus: function () {
                return projectNameTextInput || okclicky;
            },
            scope: frame,
            onRequestClose: function (event) {
                UI.hideInfoBox(event);
            }
        });
    }

    static parentalGate(evt, callback) {
        ScratchAudio.sndFX('tap.wav');
        var pgFrame = newHTML('div', 'parentalgate', gn('frame'));
        pgFrame.setAttribute('id', 'parentalgate');

        var pgCloseButton = newButton('paintdone', pgFrame, {
            ariaLabel: Localization.localize('A11Y_CLOSE')
        });
        pgCloseButton.onclick = function () {
            parentalGateClose(false);
        };

        var pgProblem = newHTML('div', 'parentalgateproblem', pgFrame);
        pgProblem.id = 'parentalgateproblem';
        var pgChoiceA = newButton('parentalgatechoice', pgFrame);
        var pgChoiceB = newButton('parentalgatechoice', pgFrame);
        var pgChoiceC = newButton('parentalgatechoice', pgFrame);

        var problems = [
            // Problem, Choice A, Choice B, Choice C, Correct choice #
            ['30 + 7', '37', '9', '28', 0],
            ['22 + 3', '18', '25', '3', 1],
            ['91 + 1', '32', '74', '92', 2],
            ['30 + 4', '34', '59', '12', 0],
            ['48 + 1', '9', '49', '20', 1],
            ['32 + 6', '23', '99', '38', 2],
            ['53 + 4', '57', '12', '90', 0],
            ['26 + 3', '17', '29', '8', 1],
            ['71 + 1', '58', '14', '72', 2],
            ['11 + 8', '19', '23', '67', 0]
        ];

        var problemChoice = Math.floor(Math.random() * problems.length);
        var theProblem = problems[problemChoice];

        pgProblem.textContent = theProblem[0];
        pgChoiceA.textContent = theProblem[1];
        pgChoiceB.textContent = theProblem[2];
        pgChoiceC.textContent = theProblem[3];

        pgChoiceA.onclick = function () {
            parentalGateClose(theProblem[4] == 0);
        };
        pgChoiceB.onclick = function () {
            parentalGateClose(theProblem[4] == 1);
        };
        pgChoiceC.onclick = function () {
            parentalGateClose(theProblem[4] == 2);
        };


        var pgExplain = newHTML('div', 'parentalgateexplain', pgFrame);
        pgExplain.id = 'parentalgateexplain';
        pgExplain.textContent = Localization.localize('PARENTAL_GATE_EXPLANATION');

        registerDialog(pgFrame, {
            label: Localization.localize('A11Y_PARENTAL_GATE_DIALOG'),
            describedBy: 'parentalgateexplain',
            initialFocus: function () {
                return pgChoiceA;
            },
            scope: frame,
            onRequestClose: function () {
                parentalGateClose(false);
            }
        });
        openDialog(pgFrame);

        function parentalGateClose(success) {
            ScratchAudio.sndFX('exittap.wav');
            closeDialog(pgFrame);
            gn('frame').removeChild(pgFrame);
            if (success) {
                callback(evt);
            }
        }
    }

    static showSharing(evt, shareButtons, parentsSection) {
        shareButtons.style.visibility = 'visible';
        parentsSection.style.visibility = 'hidden';
    }

    /*
    +    Save the project, including the new name, then package the project and send native-side for sharing
    +
    +    evt: reference to touch event triggering share
    +    nameField: reference to the project rename field
    +    shareLoadingGif: reference to HTML element to show during packaging/loading and hide for completion
    +    shareType: which dialog to show - 0 for email; 1 for airdrop
    + */

    static infoDoShare(evt, nameField, shareLoadingGif, shareType) {
        ScratchAudio.sndFX('tap.wav');
        shareLoadingGif.style.visibility = 'visible';
        nameField.blur(); // Hide the keyboard for name changes

        setTimeout(saveAndShare, 500); // 500ms delay to wait for loading GIF to show and keyboard to hide

        OS.analyticsEvent('editor', 'share_button', (shareType == EMAILSHARE) ? 'email' : 'airdrop');

        function saveAndShare() {
            // Save the project's new name
            UI.handleTextFieldSave(true);

            // Save any changes made to the project
            ScratchJr.onHold = true; // Freeze the editing UI
            ScratchJr.stopStripsFromTop(evt);

            Project.prepareToSave(ScratchJr.currentProject, function () {
                Alert.close();

                // Package the project as a .sjr file
                IO.compressProject(ScratchJr.currentProject, function (fullName) {
                    ScratchJr.onHold = false; // Unfreeze the editing UI
                    var emailSubject = Localization.localize('SHARING_EMAIL_SUBJECT', {
                        PROJECT_NAME: IO.shareName
                    });
                    OS.sendSjrToShareDialog(
                        fullName,
                        emailSubject,
                        Localization.localize('SHARING_EMAIL_TEXT'),
                        shareType
                    );

                    shareLoadingGif.style.visibility = 'hidden';
                });
            });
        }
    }


    static addEditableName(p) {
        var pname = newHTML('form', 'projectname', p);
        pname.name = 'projectname';
        pname.id = 'title';
        pname.onsubmit = function (evt) {
            submitChange(evt);
        };
        var ti = newHTML('input', 'pnamefield', pname);
        projectNameTextInput = ti;
        ti.name = 'myproject';
        ti.maxLength = 30;
        ti.setAttribute('aria-label', Localization.localizeOptional('Project name'));
        ti.onkeypress = undefined;
        ti.autocomplete = 'off';
        ti.autocorrect = false;
        ti.onblur = undefined;
        ti.onfocus = function (e) {
            e.preventDefault();
            ti.oldvalue = ti.value;
            if (isAndroid) {
                AndroidInterface.scratchjr_setsoftkeyboardscrolllocation(
                    ti.getBoundingClientRect().top * devicePixelRatio,
                    ti.getBoundingClientRect().bottom * devicePixelRatio
                );
                AndroidInterface.scratchjr_forceShowKeyboard();
            }
        };
        ti.onkeypress = function (evt) {
            handleNamePress(evt);
        };
        function handleNamePress(e) {
            var key = e.keyCode || e.which;
            if (key == 13) {
                submitChange(e);
            }
        }
        function submitChange(e) {
            e.preventDefault();
            var input = e.target;
            input.blur();
        }
        return ti;
    }

    static showCloudPanel(mode) {
        var savePanel = gn('cloudSavePanel');
        var loadPanel = gn('cloudLoadPanel');
        var saveToggle = gn('cloudToggleSave');
        var loadToggle = gn('cloudToggleLoad');
        if (!savePanel || !loadPanel || !saveToggle || !loadToggle) {
            return;
        }
        if (mode == activeCloudPanel) {
            mode = null;
        }
        activeCloudPanel = mode;
        savePanel.className = (mode == 'save') ? 'infoboxCloudPanel show' : 'infoboxCloudPanel';
        loadPanel.className = (mode == 'load') ? 'infoboxCloudPanel show' : 'infoboxCloudPanel';
        saveToggle.className = (mode == 'save') ? 'infoboxCloudToggleButton active' : 'infoboxCloudToggleButton';
        loadToggle.className = (mode == 'load') ? 'infoboxCloudToggleButton active' : 'infoboxCloudToggleButton';
        if (mode == 'load') {
            UI.renderCloudIdList();
        }
        setSelectedState(saveToggle, mode == 'save');
        setSelectedState(loadToggle, mode == 'load');
    }

    static renderCloudIdList() {
        var listContainer = gn('cloudIdList');
        if (!listContainer) {
            return;
        }
        while (listContainer.firstChild) {
            listContainer.removeChild(listContainer.firstChild);
        }
        var entries = getStoredCloudIds();
        entries.sort(function (a, b) {
            var at = a.lastUsed || a.savedAt || 0;
            var bt = b.lastUsed || b.savedAt || 0;
            return bt - at;
        });
        if (entries.length < 1) {
            var emptyMessage = newHTML('div', 'infoboxCloudListEmpty', listContainer);
            emptyMessage.textContent = 'No stored IDs yet. Save a project or add one manually.';
            return;
        }
        var header = newHTML('div', 'infoboxCloudListHeader', listContainer);
        newHTML('div', 'infoboxCloudCell id', header).textContent = 'Custom ID';
        newHTML('div', 'infoboxCloudCell name', header).textContent = 'Project';
        newHTML('div', 'infoboxCloudCell saved', header).textContent = 'Updated';
        newHTML('div', 'infoboxCloudCell actions', header).textContent = 'Actions';

        for (var i = 0; i < entries.length; i++) {
            UI.addCloudIdRow(listContainer, entries[i]);
        }
    }

    static addCloudIdRow(parent, entry) {
        var row = newHTML('div', 'infoboxCloudRow', parent);
        newHTML('div', 'infoboxCloudCell id', row).textContent = entry.customId;
        var nameCell = newHTML('div', 'infoboxCloudCell name', row);
        nameCell.textContent = entry.projectName ? entry.projectName : 'Unnamed Project';
        var savedCell = newHTML('div', 'infoboxCloudCell saved', row);
        if (entry.lastUsed || entry.savedAt) {
            var ts = entry.lastUsed || entry.savedAt;
            ts = parseInt(ts, 10);
            if (ts && !isNaN(ts)) {
                savedCell.textContent = UI.formatTime(ts);
            } else {
                savedCell.textContent = '-';
            }
        } else {
            savedCell.textContent = '-';
        }
        var actions = newHTML('div', 'infoboxCloudCell actions', row);
        var loadButton = newButton('infoboxCloudActionButton primary', actions, {
            textContent: 'Load'
        });
        loadButton.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            UI.setCloudAlertAnchor(e.currentTarget);
            UI.loadCloudProject(entry.customId, true);
        };
        var deleteButton = newButton('infoboxCloudActionButton danger', actions, {
            textContent: 'Delete'
        });
        deleteButton.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            removeStoredCloudId(entry.customId);
            UI.renderCloudIdList();
        };
    }

    static handleCloudSave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        ScratchAudio.sndFX('tap.wav');
        if (!ScratchJr.currentProject) {
            Alert.close();
            Alert.open(frame, UI.getCloudAlertAnchor(), 'No active project', '#ff0000');
            return;
        }
        UI.handleTextFieldSave(true);
        Project.prepareToSave(ScratchJr.currentProject, function () {
            ProjectCloud.saveCurrentProjectToCloud().then(function (result) {
                Alert.close();
                var message = "";
                if (result && result.customId) {
                    message += "Here’s your project ID: " + result.customId +
                        ". Keep this ID safe — you’ll need it to load your data later.";
                }
                Alert.open(frame, UI.getCloudAlertAnchor(), message, '#28A5DA');
                if (result && result.customId) {
                    addStoredCloudId({
                        customId: result.customId,
                        projectName: result.projectName || (Project.metadata && Project.metadata.name) || '',
                        savedAt: result.savedAt || Date.now(),
                    });
                    if (activeCloudPanel == 'load') {
                        UI.renderCloudIdList();
                    }
                }
            }).catch(function (err) {
                console.error(err);
                Alert.close();
                Alert.open(frame, UI.getCloudAlertAnchor(), 'Cloud save failed', '#ff0000');
            });
        });
    }

    static promptCloudLoad(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        ScratchAudio.sndFX('tap.wav');
        var identifier = window.prompt('Enter the custom ID to load');
        if (!identifier) {
            return;
        }
        var trimmed = identifier.trim();
        if (trimmed.length < 1) {
            return;
        }
        UI.loadCloudProject(trimmed, true);
    }

    static loadCloudProject(customId, storeOnSuccess) {
        if (!customId) {
            return;
        }
        customId = customId.trim();
        if (!customId) {
            return;
        }
        var shouldStore = storeOnSuccess ? true : false;
        ScratchJr.saveProject(null, function () {
            Alert.close();
            Alert.open(frame, UI.getCloudAlertAnchor(), 'Loading from cloud', '#28A5DA');
            ProjectCloud.loadProjectFromCloud(customId).then(function (result) {
                Alert.close();
                Alert.open(frame, UI.getCloudAlertAnchor(), 'Cloud project ready', '#28A5DA');
                if (result && result.projectId) {
                    ScratchJr.currentProject = result.projectId;
                    ScratchJr.editmode = 'edit';
                    ScratchJr.changed = false;
                    ScratchJr.storyStarted = false;
                }
                if (shouldStore) {
                    addStoredCloudId({
                        customId: result.customId || customId,
                        projectName: result.projectName || '',
                        savedAt: result.savedAt || (result.packageData && result.packageData.exportedAt ? result.packageData.exportedAt : Date.now()),
                        lastUsed: Date.now(),
                    });
                } else {
                    touchStoredCloudId(result.customId || customId);
                }
                if (activeCloudPanel == 'load') {
                    UI.renderCloudIdList();
                }
                setTimeout(function () {
                    goToLink('editor.html?pmd5=' + result.projectId + '&mode=edit');
                }, 1000);
            }).catch(function (err) {
                console.error(err);
                Alert.close();
                Alert.open(frame, UI.getCloudAlertAnchor(), 'Cloud load failed', '#ff0000');
            });
        });
    }

    static handleTextFieldSave(dontHide) {
        // Handle story-starter mode project
        if (ScratchJr.isEditable() && ScratchJr.editmode == 'storyStarter' && !Project.error && ScratchJr.changed) {
            OS.analyticsEvent('samples', 'story_starter_edited', Project.metadata.name);
            // Get the new project name
            var sampleName = Localization.localizeSampleName(Project.metadata.name);
            IO.uniqueProjectName({
                name: sampleName
            }, function (jsonData) {
                var newName = jsonData.name;
                Project.metadata.name = newName;
                // Create the new project
                IO.createProject({
                    name: newName,
                    version: ScratchJr.version,
                    mtime: (new Date()).getTime().toString()
                }, function (md5) {
                    Project.metadata.id = md5;
                    ScratchJr.currentProject = md5;
                    ScratchJr.editmode = 'edit';
                    Project.metadata.gallery = '';
                    UI.finishTextFieldSave(dontHide);
                });
            });
        } else {
            UI.finishTextFieldSave(dontHide);
        }
    }

    static finishTextFieldSave(dontHide) {
        var ti = projectNameTextInput;
        var pname = (ti.value.length == 0) ? ti.oldvalue : ti.value.substring(0, ti.maxLength);
        if (Project.metadata.name != pname) {
            ScratchJr.storyStart('UI.handleTextFieldSave');
        }
        Project.metadata.name = pname;
        OS.setfield(OS.database, Project.metadata.id, 'name', pname);
        if (!dontHide) {
            ScratchAudio.sndFX('exittap.wav');
            gn('infobox').className = 'infobox fade';
        }
    }

    static showInfoBox(e) {
        infoBoxOpen = true;
        e.preventDefault();
        e.stopPropagation();
        if (Paint.saving) {
            return;
        }
        if (ScratchJr.onHold) {
            return;
        }
        if (!UI.isProjectInfoReady()) {
            return;
        }

        var canShare = ScratchJr.editmode != 'storyStarter' || ScratchJr.changed;
        try {
            gn('infoboxParentsSectionButton').style.display = canShare ? 'block' : 'none';
        } catch { }

        // Prevent button from thrashing
        setTimeout(function () {
            okclicky.onclick = UI.hideInfoBox;
            projectNameTextInput.onblur = function () {
                if (isAndroid) {
                    AndroidInterface.scratchjr_forceHideKeyboard();
                }
            };
        }, 500);
        projectNameTextInput.onblur = function () {
            window.setTimeout(function () {
                if (!ScratchJr.isEditable() || !infoBoxOpen || gn('parentalgate')) {
                    return;
                }
                if (document.activeElement === document.body) {
                    (document.forms.projectname.myproject).focus();
                }
            }, 0);
        };
        info.onclick = null;

        ScratchJr.onBackButtonCallback.push(function () {
            var e2 = document.createEvent('TouchEvent');
            e2.initTouchEvent();
            e2.preventDefault();
            e2.stopPropagation();
            UI.hideInfoBox(e2);
        });

        ScratchAudio.sndFX('entertap.wav');
        ScratchJr.stopStrips();
        if (!Project.metadata.ctime) {
            Project.metadata.mtime = (new Date()).getTime();
            Project.metadata.ctime = UI.formatTime((new Date()).getTime());
        }

        UI.showCloudPanel(null);
        UI.renderCloudIdList();

        if (ScratchJr.isEditable()) {
            var name = Project.metadata.name;
            if (ScratchJr.editmode == 'storyStarter') {
                name = Localization.localizeSampleName(name);
            }
            (document.forms.projectname.myproject).value = name;
        } else {
            gn('pname').textContent = Project.metadata.name;
        }
        gn('infobox').className = 'infobox fade in';
        openDialog(gn('infobox'));
        setTimeout(function () {
            if (ScratchJr.isEditable() && projectNameTextInput) {
                projectNameTextInput.focus();
                return;
            }
            if (okclicky) {
                okclicky.focus();
            }
        }, 0);
    }

    static formatTime(unixtime) {
        var date = new Date(unixtime);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
    }

    static hideInfoBox(e) {
        e.preventDefault();
        e.stopPropagation();
        Alert.close();
        ScratchJr.onBackButtonCallback.pop();

        // Prevent button thrashing
        okclicky.onclick = null;
        setTimeout(function () {
            info.onclick = UI.showInfoBox;
        }, 500);

        if (ScratchJr.isEditable()) {
            (document.forms.projectname.myproject).blur();
            UI.handleTextFieldSave();
        } else {
            ScratchAudio.sndFX('exittap.wav');
            gn('infobox').className = 'infobox fade';
        }
        closeDialog(gn('infobox'));
        try {
            gn('sharebuttons').style.visibility = 'hidden';
            gn('parentsection').style.visibility = 'visible';
        } catch { }
        infoBoxOpen = false;
    }

    //////////////////////////////////////
    //   Library
    /////////////////////////////////////

    static layoutLibrary(sl) {
        var sprites = newHTML('div', 'thumbpanel', sl);
        sprites.setAttribute('id', 'library');
        //scrolling area
        var p = newHTML('div', 'spritethumbs', sprites);
        p.setAttribute('id', 'spriteScrollContainer');
        var div = newHTML('div', 'spritecc', p);
        div.setAttribute('id', 'spritecc');
        div.setAttribute('role', 'group');
        div.setAttribute('aria-label', UI.getGuideControlLabel('INTERFACE_GUIDE_CHARACTERS'));
        // div.ontouchstart = UI.spriteThumbsActions;
        // div.onmousedown = UI.spriteThumbsActions;
        if (isTablet) {
            div.ontouchstart = UI.spriteThumbsActions;
        } else {
            div.onpointerdown = UI.spriteThumbsActions;
        }

        // scrollbar
        var sb = newHTML('div', 'scrollbar', sprites);
        sb.setAttribute('id', 'scrollbar');
        var sbthumb = newHTML('div', 'sbthumb', sb);
        sbthumb.setAttribute('id', 'sbthumb');
        UI.configureScrollBar(p, sb, sbthumb);

        // new sprite
        if (ScratchJr.isEditable()) {
            var ns = newButton('addsprite', p, {
                ariaLabel: Localization.localize('A11Y_CREATE') + ' ' + Localization.localize('LIBRARY_CHARACTER')
            });
            ns.onclick = UI.addSprite;
            ns.setAttribute('id', 'addsprite');
        }
        UI.updateSpriteLibraryForMartyMode({ refreshSprites: false });
    }

    static mascotData(page) {
        var sprAttr = {
            flip: false,
            angle: 0,
            shown: true,
            type: 'sprite',
            scale: 0.5,
            defaultScale: 0.5,
            speed: 2,
            dirx: 1,
            diry: 1,
            sounds: ['pop.mp3'],
            homex: 240,
            homey: 180,
            xcoor: 240,
            ycoor: 180,
            homeshown: true,
            homeflip: false,
            homescale: 0.5,
            scripts: []
        };
        sprAttr.page = page;
        sprAttr.md5 = ScratchJr.defaultSprite;
        var catkey = MediaLib.keys[sprAttr.md5].name;
        sprAttr.id = getIdFor(catkey);
        sprAttr.name = catkey;
        return sprAttr;
    }

    //////////////////////////////////////
    // Scrolling
    //////////////////////////////////////

    static needsScroll() {
        UI.updateScrollBar(gn('spritecc')?.parentNode, gn('scrollbar'), gn('sbthumb'));
    }

    static updateSpriteScroll() {
        UI.needsScroll();
    }

    static updatePageScroll() {
        UI.updateScrollBar(gn('pagecc'), gn('pagescrollbar'), gn('pagesbthumb'));
    }

    static updateScrollBar(container, scrollbar, thumb) {
        if (!container || !scrollbar || !thumb) {
            return;
        }
        var maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
        if (maxScroll <= Math.max(1, scaleMultiplier)) {
            scrollbar.setAttribute('class', 'scrollbar off');
            scrollbar.setAttribute('aria-valuemax', '0');
            scrollbar.setAttribute('aria-valuenow', '0');
            thumb.style.height = '0px';
            thumb.style.top = '0px';
            return;
        }
        scrollbar.setAttribute('class', 'scrollbar on');
        var thumbSize = (container.clientHeight / container.scrollHeight) * scrollbar.clientHeight;
        var availableTrack = Math.max(0, scrollbar.clientHeight - thumbSize);
        var thumbTop = availableTrack * (container.scrollTop / maxScroll);
        thumb.style.height = thumbSize + 'px';
        thumb.style.top = thumbTop + 'px';
        scrollbar.setAttribute('aria-valuemax', Math.round(maxScroll).toString());
        scrollbar.setAttribute('aria-valuenow', Math.round(container.scrollTop).toString());
    }

    static configureScrollBar(container, scrollbar, thumb) {
        if (!container || !scrollbar || !thumb) {
            return;
        }
        scrollbar.setAttribute('role', 'scrollbar');
        scrollbar.setAttribute('tabindex', '0');
        scrollbar.setAttribute('aria-orientation', 'vertical');
        scrollbar.setAttribute('aria-controls', container.id);
        scrollbar.setAttribute('aria-valuemin', '0');
        var labelledContainer = container.getAttribute('aria-label') ? container :
            container.querySelector('[aria-label]');
        if (labelledContainer) {
            scrollbar.setAttribute('aria-label', labelledContainer.getAttribute('aria-label'));
        }

        var update = function () {
            UI.updateScrollBar(container, scrollbar, thumb);
        };
        container.addEventListener('scroll', update);
        scrollbar.onkeydown = function (event) {
            var amount = 0;
            if ((event.key == 'ArrowDown') || (event.key == 'ArrowRight')) {
                amount = 40 * scaleMultiplier;
            } else if ((event.key == 'ArrowUp') || (event.key == 'ArrowLeft')) {
                amount = -40 * scaleMultiplier;
            } else if (event.key == 'PageDown') {
                amount = container.clientHeight;
            } else if (event.key == 'PageUp') {
                amount = -container.clientHeight;
            } else if (event.key == 'Home') {
                container.scrollTop = 0;
            } else if (event.key == 'End') {
                container.scrollTop = container.scrollHeight;
            } else {
                return;
            }
            if (amount != 0) {
                container.scrollTop += amount;
            }
            event.preventDefault();
            event.stopPropagation();
            update();
        };
        var startDrag = function (event) {
            UI.startScrollBarDrag(event, container, scrollbar, thumb);
        };
        if (isTablet) {
            scrollbar.ontouchstart = startDrag;
        } else {
            scrollbar.onpointerdown = startDrag;
        }
        if (window.MutationObserver) {
            var observer = new MutationObserver(update);
            observer.observe(container, { childList: true, subtree: true });
        }
        if (window.ResizeObserver) {
            var resizeObserver = new ResizeObserver(update);
            resizeObserver.observe(container);
        }
        window.setTimeout(update, 0);
    }

    static startScrollBarDrag(event, container, scrollbar, thumb) {
        if (event.touches && (event.touches.length > 1)) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        var point = Events.getTargetPoint(event);
        var trackRect = scrollbar.getBoundingClientRect();
        var thumbRect = thumb.getBoundingClientRect();
        var grabOffset = event.target == thumb ? point.y - thumbRect.top : thumbRect.height / 2;
        var move = function (moveEvent) {
            if (moveEvent.cancelable) {
                moveEvent.preventDefault();
            }
            var movePoint = Events.getTargetPoint(moveEvent);
            var availableTrack = Math.max(0, scrollbar.clientHeight - thumb.offsetHeight);
            var requestedTop = Math.max(0, Math.min(availableTrack,
                movePoint.y - trackRect.top - grabOffset));
            var maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
            container.scrollTop = availableTrack == 0 ? 0 : (requestedTop / availableTrack) * maxScroll;
            UI.updateScrollBar(container, scrollbar, thumb);
        };
        var stop = function () {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', stop);
            window.removeEventListener('pointercancel', stop);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('touchend', stop);
            window.removeEventListener('touchcancel', stop);
        };
        if (event.touches) {
            window.addEventListener('touchmove', move, { passive: false });
            window.addEventListener('touchend', stop);
            window.addEventListener('touchcancel', stop);
        } else {
            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', stop);
            window.addEventListener('pointercancel', stop);
        }
        move(event);
    }

    static scrollContents(dy) {
        var sc = gn('spritecc');
        if (!sc || !sc.parentNode) {
            return;
        }
        sc.parentNode.scrollTop += dy;
    }

    static spriteInView(spr) {
        var sc = gn('spritecc');
        var parentOfSc = sc.parentNode;
        if (!parentOfSc) {
            console.warn('spriteInView: spritecc parent not found');
            return;
        }
        var achild = spr.thumbnail;
        if (!achild) {
            return;
        }
        if (achild.offsetTop < parentOfSc.scrollTop) {
            parentOfSc.scrollTop = achild.offsetTop;
        } else if ((achild.offsetTop + achild.offsetHeight) >
            (parentOfSc.scrollTop + parentOfSc.clientHeight)) {
            parentOfSc.scrollTop = achild.offsetTop + achild.offsetHeight - parentOfSc.clientHeight;
        }
        UI.needsScroll();
    }

    static resetSpriteLibrary() {
        if (!ScratchJr.getSprite()) {
            return;
        }
        UI.spriteInView(ScratchJr.getSprite());
    }

    ///////////////////////////////////
    // Sprite Thumbs Events
    //////////////////////////////////

    static spriteThumbsActions(e) {
        if (isTablet && e.touches && (e.touches.length > 1)) {
            return;
        }
        if (ScratchJr.onHold) {
            return;
        }
        var t;
        var pt = Events.getTargetPoint(e);
        if (window.event) {
            t = window.event.srcElement;
        } else {
            t = e.target;
        }
        //	if ((t.nodeName == "INPUT") || (t.nodeName == "FORM")) return;
        e.preventDefault();
        e.stopPropagation();
        ScratchJr.blur();
        t.focus();
        if (t.className == 'brush') {
            UI.putInPaintEditor(e); return;
        }
        var tb = Thumbs.getType(t, 'spritethumb');
        if (!tb) {
            if (ScratchJr.shaking) {
                ScratchJr.clearSelection();
            }
            return;
        }
        var x = localx(t, pt.x);
        if (tb && (x < 70) && ScratchJr.isEditable()) {
            Thumbs.startDragThumb(e, tb);
        } else {
            UI.startSpriteScroll(e, tb);
        }
    }

    static startSpriteScroll(e, tb) {
        if (ScratchJr.shaking) {
            ScratchJr.clearSelection();
        }
        if (!tb) {
            return;
        }
        if (gn('scrollbar').className == 'scrollbar off') {
            Events.startDrag(e, tb, UI.ignoreEvent, UI.ignoreEvent, UI.ignoreEvent, UI.spriteClicked,
                ScratchJr.isEditable() ? Thumbs.startCharShaking : undefined);
        } else {
            Events.startDrag(e, tb, UI.prepareToScroll, UI.stopScroll, UI.spriteScolling, UI.spriteClicked,
                ScratchJr.isEditable() ? Thumbs.startCharShaking : undefined);
        }
    }

    static ignoreEvent(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    static prepareToScroll(e) {
        e.preventDefault();
        e.stopPropagation();
        UI.spriteScolling(e, Events.dragthumbnail);
    }

    static stopScroll(e) {
        e.preventDefault();
        e.stopPropagation();
        UI.spriteScolling(e, Events.dragthumbnail);
    }

    static spriteScolling(e) {
        var pt = Events.getTargetPoint(e);
        var deltay = Events.dragmousey - pt.y;
        Events.dragmousey = pt.y;
        var p = gn('spritecc').parentNode;
        p.scrollTop += deltay;
        UI.updateSpriteScroll();
    }

    static spriteClicked(e, el) {
        e.preventDefault();
        e.stopPropagation();
        var t;
        if (window.event) {
            t = window.event.srcElement;
        } else {
            t = e.target;
        }
        if (ScratchJr.isEditable() && ScratchJr.getSprite() &&
            (((t.className == 'sname') && (el.owner == ScratchJr.getSprite().id))
                || (t.className == 'brush'))) {
            if (el.owner.includes('Marty')) return; // Marty sprites are not editable 
            UI.putInPaintEditor(e);
            return;
        }
        if (el.className.indexOf('shakeme') < 0) {
            el.setAttribute('class', 'spritethumb on');
        }

        Thumbs.clickOnSprite(e, el);
    }

    static putInPaintEditor(e) {
        ScratchJr.unfocus(e);
        var s = ScratchJr.getSprite();
        if (!UI.isSpritePaintEditable(s)) {
            return;
        }
        ScratchJr.stopStrips();
        Paint.open(false, s.md5, s.id, s.name, s.defaultScale, Math.round(s.w), Math.round(s.h));
    }

    static isSpritePaintEditable(sprite) {
        var isMartySprite = Boolean(sprite && sprite.id && sprite.id.includes('Marty'));
        return Boolean(sprite) && !isMartySprite &&
            (!sprite.animationFrames || sprite.animationFrames.length < 2);
    }

    ///////////////////////////////
    // Setup Stage Variables
    //////////////////////////////

    static stageArea(inner) {
        var outerDiv = newHTML('div', 'centerpanel', inner);
        var div = newHTML('div', 'stageframe', outerDiv);
        div.setAttribute('id', 'stageframe');
        ScratchJr.stage = new Stage(div);
        Grid.init(div);
        Trace.init(ScratchJr.stage.div);
        if (ScratchJr.isEditable()) {
            UI.createTopBarClicky(div, 'addtext', 'addText', UI.addText);
            UI.createTopBarClicky(div, 'setbkg', 'changeBkg', UI.addBackground);
        }
        UI.createTopBarClicky(div, 'grid', 'gridToggle off', UI.switchGrid);
        UI.createTopBarClicky(div, 'traceBtn', 'traceToggle off', UI.switchTrace);
        UI.createTopBarClicky(div, 'traceClear', 'traceClear', Trace.clear);
        UI.createTopBarClicky(div, 'go', 'go on', UI.toggleRun);
        UI.createTopBarClicky(div, 'resetall', 'resetall', UI.resetAllSprites);
        UI.createTopBarClicky(div, 'full', 'fullscreen', ScratchJr.fullScreen);
        UI.setShowGrid(false);
        UI.setShowTrace(false);
    }

    static createCounter() {
        const stageDiv = gn('stage');
        const counter = newHTML('div', 'counter', stageDiv);
        counter.setAttribute('id', 'counter');

        return counter;
    }

    static destroyCounter() {
        const counter = gn('counter');
        if (counter) {
            counter.remove();
        }
    }

    static addTextToCounter(text) {
        const counter = gn('counter');
        if (counter) {
            counter.textContent = text;

            // Adjust font size based on the value
            if (parseInt(text) > 999 || parseInt(text) < -999) {
                counter.style.fontSize = '1.8rem';
            } else {
                counter.style.fontSize = ''; // Reset to default font size
            }

            // Trigger animation by adding and removing the animate class
            counter.classList.remove('animate'); // Remove class if it exists
            void counter.offsetWidth; // Trigger reflow to restart the animation
            counter.classList.add('animate'); // Add class to trigger animation
        }
    }

    static getCounterText() {
        const counter = gn('counter');
        return counter ? counter.textContent : '';
    }

    static counterExist() {
        return !!gn('counter');
    }

    static resetAllSprites(e) {
        e.preventDefault();
        e.stopPropagation();
        if (ScratchJr.onHold) {
            return;
        }
        ScratchAudio.sndFX('tap.wav');
        if (!ScratchJr.runtime.inactive()) {
            ScratchJr.stopStripsFromTop(e);
        }
        ScratchJr.resetSprites();
    }

    static switchTrace() {
        ScratchAudio.sndFX('tap.wav');
        UI.setShowTrace(Trace.hidden);

        OS.analyticsEvent('editor', Trace.hidden ? 'hide_trace' : 'show_trace');
    }

    static toggleRun(e) {
        var isOff = ScratchJr.runtime.inactive();
        if (isOff) {
            ScratchJr.runStrips(e);
        } else {
            ScratchJr.stopStripsFromTop(e);
            // Send stop commands to all connected rafts
            window.martyManager.stopAllMartys();
            window.cogManager.stopAllCogs();
            window.microBitManager?.stopAllMicroBits?.();
        }
    }

    static switchGrid() {
        ScratchAudio.sndFX('tap.wav');
        UI.setShowGrid(Grid.hidden);
        OS.analyticsEvent('editor', Grid.hidden ? 'hide_grid' : 'show_grid');
    }

    static setShowGrid(b) {
        Grid.hide(!b);
        gn('grid').className = Grid.hidden ? 'gridToggle off' : 'gridToggle on';
        setPressedState(gn('grid'), !Grid.hidden);
    }

    static setShowTrace(b) {
        Trace.hide(!b);
        gn('traceBtn').className = Trace.hidden ? 'traceToggle off' : 'traceToggle on';
        setPressedState(gn('traceBtn'), !Trace.hidden);
    }

    static createTopBarClicky(p, str, mstyle, fcn) {
        var label = UI.getControlAriaLabel(str);
        var toggle = newButton(mstyle, p, {
            ariaLabel: label
        });
        toggle.setAttribute('data-tooltip', label);
        toggle.onclick = fcn;
        toggle.setAttribute('id', str);
        if (str == 'grid' || str == 'traceBtn' || str == 'martyMode') {
            setPressedState(toggle, mstyle.indexOf(' on') > -1);
        }
        if (str == 'go') {
            setPressedState(toggle, false);
        }
    }

    static updateTopBarControlLabel(id) {
        const control = gn(id);
        const label = UI.getControlAriaLabel(id);
        if (!control || !label || (control.getAttribute('aria-label') === label &&
            control.getAttribute('data-tooltip') === label)) {
            return;
        }
        control.setAttribute('aria-label', label);
        control.setAttribute('data-tooltip', label);
    }

    static fullscreenControls() {
        UI.nextpage = newButton('nextpage off', frame, {
            ariaLabel: UI.getControlAriaLabel('nextpage')
        });
        UI.prevpage = newButton('nextpage off', frame, {
            ariaLabel: UI.getControlAriaLabel('prevpage')
        });
        UI.nextpage.id = 'nextpage';
        UI.prevpage.id = 'prevpage';
        UI.nextpage.onclick = UI.nextPage;
        UI.prevpage.onclick = UI.prevPage;
    }

    static updatePageControls() {
        var n = ScratchJr.stage.pages.indexOf(ScratchJr.stage.currentPage);
        if (n == 0) {
            UI.prevpage.setAttribute('class', 'prevpage off');
            UI.prevpage.disabled = true;
        } else {
            UI.prevpage.setAttribute('class', 'prevpage on');
            UI.prevpage.disabled = false;
        }
        if (n == (ScratchJr.stage.pages.length - 1)) {
            UI.nextpage.setAttribute('class', 'nextpage off');
            UI.nextpage.disabled = true;
        } else {
            UI.nextpage.setAttribute('class', 'nextpage on');
            UI.nextpage.disabled = false;
        }
    }

    static nextPage(e) {
        e.preventDefault();
        e.stopPropagation();
        var n = ScratchJr.stage.pages.indexOf(ScratchJr.stage.currentPage);
        n++;
        if (n >= ScratchJr.stage.pages.length) {
            return;
        }
        ScratchJr.stage.setPage(ScratchJr.stage.pages[n], false);
    }

    static prevPage(e) {
        e.preventDefault();
        e.stopPropagation();
        var n = ScratchJr.stage.pages.indexOf(ScratchJr.stage.currentPage);
        if (n < 1) {
            return;
        }
        ScratchJr.stage.setPage(ScratchJr.stage.pages[n - 1], false);
    }

    static enterFullScreen() {
        var w = Math.min(getDocumentWidth(), frame.offsetWidth);
        var h = Math.max(getDocumentHeight(), frame.offsetHeight);
        frame.appendChild(gn('stage'));
        var list = ['go', 'full'];
        for (var i = 0; i < list.length; i++) {
            gn(list[i]).className = gn(list[i]).className + ' presentationmode';
            frame.appendChild(gn(list[i]));
        }
        var scale = Math.min(
            (w - (fullscreenScaleMultiplier * scaleMultiplier)) / gn('stage').owner.width,
            h / gn('stage').owner.height
        );
        var dx = Math.floor((w - (gn('stage').owner.width * scale)) / 2);
        var dy = Math.floor((h - (gn('stage').owner.height * scale)) / 2);

        ScratchJr.stage.setStageScaleAndPosition(scale, dx / scale, dy / scale);

        gn('stage').owner.currentZoom = Math.floor(scale * 100) / 100;
        gn('stage').style.webkitTextSizeAdjust = Math.floor(gn('stage').owner.currentZoom * 100) + '%';
        document.body.parentNode.style.background = 'black';
        gn('stage').setAttribute('class', 'stage fullscreen');
        UI.nextpage.setAttribute('class', 'nextpage on');
    }

    static quitFullScreen() {
        var div = gn('stageframe');
        div.appendChild(gn('stage'));
        ScratchJr.stage.setStageScaleAndPosition(scaleMultiplier, 46, 74);
        gn('go').className = 'go off nopresent';
        div.appendChild(gn('go'));
        gn('full').className = 'fullscreen';
        div.appendChild(gn('full'));
        gn('stage').owner.currentZoom = 1;
        gn('stage').style.webkitTextSizeAdjust = '100%';
        document.body.parentNode.style.background = 'none';
        gn('stage').setAttribute('class', 'stage normal');
        UI.nextpage.setAttribute('class', 'nextpage off');
        UI.prevpage.setAttribute('class', 'nextpage off');
        ScratchJr.stage.setViewPage(ScratchJr.stage.currentPage);
        Thumbs.updateSprites();
        Thumbs.updatePages();
    }

    //////////////////////////////////////
    //   Right panel
    /////////////////////////////////////

    static rightPanel(div) {
        var rp = newHTML('div', 'rightpanel', div);
        var tb = newHTML('div', 'pages', rp);
        tb.setAttribute('id', 'pages');
        var ndiv = newHTML('div', 'pagescc', tb);
        ndiv.setAttribute('id', 'pagecc');
        ndiv.setAttribute('role', 'group');
        ndiv.setAttribute('aria-label', UI.getGuideControlLabel('INTERFACE_GUIDE_PAGES'));
        var pageList = newHTML('div', 'pagelist', ndiv);
        pageList.setAttribute('id', 'pagelist');
        var pageActions = newHTML('div', 'pageactions', ndiv);
        pageActions.setAttribute('id', 'pageactions');
        var sb = newHTML('div', 'scrollbar', tb);
        sb.setAttribute('id', 'pagescrollbar');
        var sbthumb = newHTML('div', 'sbthumb', sb);
        sbthumb.setAttribute('id', 'pagesbthumb');
        UI.configureScrollBar(ndiv, sb, sbthumb);

        UI.addMartyModeButton(rp);
    }

    static addMartyModeButton(rightPanel) {
        var mm = newButton('martyMode', rightPanel, {
            ariaLabel: Localization.localize('A11Y_MARTY_MODE')
        });
        mm.setAttribute('id', 'martyMode');
        mm.onclick = UI.toggleMartyMode;
        setPressedState(mm, ScratchJr.isMartyModeEnabled);

        // Add SVG assets

        // sprite icon
        var spriteSvgDiv = newHTML('div', 'spriteModeIcon', mm);
        spriteSvgDiv.innerHTML = stripInlineSvgIds(spriteSvg);

        // toggle icon
        var toggleDiv = newHTML('div', 'martyModeToggle spriteToggleOn', mm);
        toggleDiv.innerHTML = stripInlineSvgIds(spriteToggleOn);

        // Marty icon
        var martySvgDiv = newHTML('div', 'martyModeIcon', mm);
        martySvgDiv.innerHTML = stripInlineSvgIds(martyDeselectedSvg);
    }
    /*MartyMode*/
    static renderCorrectMartyModeIcon() {
        UI.updateSpriteLibraryForMartyMode();
        const martyModeButton = gn('martyMode');
        if (!martyModeButton) {
            return;
        }
        var toggleDiv = martyModeButton.getElementsByClassName('martyModeToggle')[0];
        var spriteIcon = martyModeButton.getElementsByClassName('spriteModeIcon')[0];
        var martyIcon = martyModeButton.getElementsByClassName('martyModeIcon')[0];

        if (ScratchJr.isMartyModeEnabled) {
            spriteIcon.innerHTML = stripInlineSvgIds(spriteDeselectedSvg);
            martyIcon.innerHTML = stripInlineSvgIds(martySvg);
            toggleDiv.innerHTML = stripInlineSvgIds(martyToggleOn);

        } else {
            spriteIcon.innerHTML = stripInlineSvgIds(spriteSvg);
            martyIcon.innerHTML = stripInlineSvgIds(martyDeselectedSvg);
            toggleDiv.innerHTML = stripInlineSvgIds(spriteToggleOn);
        }
        setPressedState(martyModeButton, ScratchJr.isMartyModeEnabled);
        UI.updateTopBarControlLabel('setbkg');
    }

    /*MartyMode*/
    static toggleMartyMode() {
        const connectedMarty = window.applicationManager?.getTheCurrentlySelectedDeviceOrFirstOfItsKind('Marty');
        if (connectedMarty) {
            UI.updateMartySensorAvailability(connectedMarty, getMartySensorAvailabilityFromRaft(connectedMarty));
        }
        UI.setMartyModeEnabled(!ScratchJr.isMartyModeEnabled, { playSound: true });
    }

    static updateSpriteLibraryForMartyMode(options = {}) {
        const library = gn('library');
        if (library) {
            library.className = ScratchJr.isMartyModeEnabled ? 'thumbpanel marty-mode-library' : 'thumbpanel';
        }

        const addSpriteButton = gn('addsprite');
        if (addSpriteButton) {
            const isMartyMode = ScratchJr.isMartyModeEnabled;
            addSpriteButton.style.display = isMartyMode ? 'none' : 'inline-block';
            addSpriteButton.disabled = isMartyMode;
            addSpriteButton.setAttribute('aria-hidden', isMartyMode ? 'true' : 'false');
        }

        const spriteContainer = gn('spritecc');
        if (options.refreshSprites === false || !spriteContainer || !ScratchJr.stage?.currentPage) {
            return;
        }
        Thumbs.updateSprites();
    }

    //////////////////////////////////////
    //   Tools
    /////////////////////////////////////

    static layoutToolbar(div) {
        var h = 56;
        var w = 66 * 2;
        var tb = newDiv(div, 220, 0, w, h, {
            position: 'absolute'
        });
        tb.setAttribute('id', 'toolbar');
        var addt = newButton('addText', tb, {
            ariaLabel: UI.getGuideControlLabel('INTERFACE_GUIDE_ADD_TEXT')
        });
        addt.onclick = UI.addText;
        var changebkg = newButton('changeBkg', tb, {
            ariaLabel: UI.getGuideControlLabel('INTERFACE_GUIDE_CHANGE_BG')
        });
        changebkg.onclick = UI.addBackground;
    }

    static addSprite(e) {
        if (ScratchJr.isMartyModeEnabled) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return;
        }
        if (ScratchJr.onHold) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        var pt = Events.getTargetPoint(e);
        if (pt.x > (globalx(e.target) + 167)) {
            return;
        }
        ScratchAudio.sndFX('tap.wav');
        ScratchJr.stopStrips();
        ScratchJr.unfocus(e);
        if (Events.dragthumbnail) {
            Events.mouseUp(e);
        }
        Library.open('costumes');
    }

    static addBackground(e) {
        if (ScratchJr.onHold) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        ScratchJr.stopStrips();
        ScratchJr.unfocus(e);
        if (Events.dragthumbnail) {
            Events.mouseUp(e);
        }
        Library.open('backgrounds');
    }

    static addText(e) {
        if (ScratchJr.onHold) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (isAndroid) {
            if (gn('textbox').style.visibility === 'visible') {
                return;
            }
        }
        ScratchJr.unfocus(e);
        ScratchJr.stage.currentPage.createText();
    }

    //////////////////////////////////
    // Key Handling in TextBox
    //////////////////////////////////

    static createFormForText(p) {
        var tf = newHTML('div', 'pagetext off', p);
        tf.setAttribute('id', 'textbox');
        // If the textbox background is clicked or touched, the input loses focus,
        // which causes the text input to close unexpectedly
        var eatEvent = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };
        // tf.ontouchstart = eatEvent;
        // tf.onmousedown = eatEvent;
        if (isTablet) {
            tf.ontouchstart = eatEvent;
        } else {
            tf.onpointerdown = eatEvent;
        }
        var activetb = newHTML('form', 'pageform', tf);
        activetb.name = 'activetextbox';
        activetb.id = 'myform';
        activetb.textsprite = null;
        var field = newTextInput(activetb, 'text');
        field.name = 'typing';
        field.setAttribute('class', 'edittext');
        field.maxLength = 50;
        field.onkeypress = undefined;
        field.autocomplete = 'off';
        field.autocorrect = false;
        field.onblur = undefined;
        activetb.onsubmit = undefined;
        var ta = newHTML('div', 'pagetextactions', tf);
        var clicky = newHTML('div', 'fontsizeText off', ta);
        clicky.setAttribute('id', 'fontsizebutton');
        // clicky.ontouchstart = UI.openFontSizeMenu;
        // clicky.onmousedown = UI.openFontSizeMenu;
        if (isTablet) {
            clicky.ontouchstart = UI.openFontSizeMenu;
        } else {
            clicky.onpointerdown = UI.openFontSizeMenu;
        }
        var col = newHTML('div', 'changecolorText off', ta);
        col.setAttribute('id', 'fontcolorbutton');
        if (isTablet) {
            col.ontouchstart = UI.topLevelColor;
        } else {
            col.onpointerdown = UI.topLevelColor;
        }
        // col.ontouchstart = UI.topLevelColor;
        // col.onmousedown = UI.topLevelColor;
        UI.createColorMenu(tf);
        UI.createTextSizeMenu(tf);
    }

    static createColorMenu(div) {
        var swatchlist = BlockSpecs.fontcolors;
        var spal = newHTML('div', 'textuicolormenu off', div);
        spal.setAttribute('id', 'textcolormenu');
        for (var i = 0; i < swatchlist.length; i++) {
            var colour = newHTML('div', 'textcolorbucket', spal);
            // bucket
            var sf = newHTML('div', 'swatchframe', colour);
            var sc = newHTML('div', 'swatchcolor', sf);
            sc.style.background = swatchlist[i];
            //
            sf = newHTML('div', 'splasharea off', colour);
            Paint.setSplashColor(sf, Paint.splash, swatchlist[i]);
            Paint.addImageUrl(sf, Paint.splashshade);
            // colour.ontouchstart = UI.setTextColor;
            // colour.onmousedown = UI.setTextColor;
            if (isTablet) {
                colour.ontouchstart = UI.setTextColor;
            } else {
                colour.onpointerdown = UI.setTextColor;
            }

        }
        UI.setMenuTextColor(gn('textcolormenu').childNodes[9]);
    }

    static createTextSizeMenu(div) {
        var sizes = BlockSpecs.fontsizes;
        var spal = newHTML('div', 'textuifont off', div);
        spal.setAttribute('id', 'textfontsizes');
        for (var i = 0; i < sizes.length; i++) {
            var textuisize = newHTML('div', 'textuisize t' + (i + 1), spal);
            textuisize.fs = sizes[i];
            var sf = newHTML('span', undefined, textuisize);
            sf.textContent = 'A';
            // textuisize.ontouchstart = UI.setTextSize;
            // textuisize.onmousedown = UI.setTextSize;
            if (isTablet) {
                textuisize.ontouchstart = UI.setTextSize;
            } else {
                textuisize.onpointerdown = UI.setTextSize;
            }
        }
        UI.setMenuTextSize(gn('textfontsizes').childNodes[5]);
    }

    static setMenuTextColor(t) {
        var c = t.childNodes[0].childNodes[0].style.backgroundColor;
        for (var i = 0; i < gn('textcolormenu').childElementCount; i++) {
            var mycolor = gn('textcolormenu').childNodes[i].childNodes[0].childNodes[0].style.backgroundColor;
            if (c == mycolor) {
                gn('textcolormenu').childNodes[i].childNodes[1].setAttribute('class', 'splasharea on');
            } else {
                gn('textcolormenu').childNodes[i].childNodes[1].setAttribute('class', 'splasharea off');
            }
        }
    }

    static setMenuTextSize(t) {
        var c = t.fs;
        for (var i = 0; i < gn('textfontsizes').childElementCount; i++) {
            var kid = gn('textfontsizes').childNodes[i];
            var fs = kid.fs;
            var ckid = kid.className.split(' ')[1];
            if (c == fs) {
                gn('textfontsizes').childNodes[i].className = 'textuisize ' + ckid + ' on';
            } else {
                gn('textfontsizes').childNodes[i].className = 'textuisize ' + ckid + ' off';
            }
        }
    }

    /////////////////////////////////////////////////////////
    // Text color and size
    /////////////////////////////////////////////////////////

    static topLevelColor(e) {
        e.preventDefault();
        e.stopPropagation();
        if (gn('fontcolorbutton').className == 'changecolorText on') {
            gn('fontcolorbutton').className = 'changecolorText off';
            gn('textcolormenu').className = 'textuicolormenu off';
        } else {
            gn('fontsizebutton').className = 'fontsizeText off';
            gn('textfontsizes').className = 'textuifont off';
            var text = document.forms.activetextbox.textsprite;
            var indx = BlockSpecs.fontcolors.indexOf(text);
            if (indx > -1) {
                UI.setMenuTextColor(gn('textcolormenu').childNodes[indx]);
            }
            gn('textcolormenu').className = 'textuicolormenu on';
            gn('fontcolorbutton').className = 'changecolorText on';
        }
    }

    static setTextColor(e) {
        if (e.touches && (e.touches.length > 1)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (window.event) {
            t = window.event.srcElement;
        } else {
            t = e.target;
        }
        var b = 'textcolorbucket' != t.className;
        while (b) {
            var t = t.parentNode;
            b = t && ('textcolorbucket' != t.className);
        }
        if (!t) {
            return;
        }
        ScratchAudio.sndFX('splash.wav');
        UI.setMenuTextColor(t);
        var text = document.forms.activetextbox.textsprite;
        var c = t.childNodes[0].childNodes[0].style.background;
        text.setColor(c);
        Undo.record({
            action: 'edittext',
            where: text.div.parentNode.owner.id,
            who: text.id
        });
        ScratchJr.storyStart('UI.setTextColor'); // Record a change for sample projects in story-starter mode
        var ti = document.forms.activetextbox.typing;
        ti.style.color = c;
    }

    static openFontSizeMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        if (gn('fontsizebutton').className == 'fontsizeText on') {
            gn('fontsizebutton').className = 'fontsizeText off';
            gn('textfontsizes').className = 'textuifont off';
        } else {
            gn('fontcolorbutton').className = 'changecolorText off';
            gn('textcolormenu').className = 'textuicolormenu off';
            var text = document.forms.activetextbox.textsprite;
            var indx = BlockSpecs.fontsizes.indexOf(text.fontsize);
            if (indx > -1) {
                UI.setMenuTextSize(gn('textfontsizes').childNodes[indx]);
            }
            gn('textfontsizes').className = 'textuifont on';
            gn('fontsizebutton').className = 'fontsizeText on';
        }
    }

    static setTextSize(e) {
        e.preventDefault();
        e.stopPropagation();
        var t;
        if (window.event) {
            t = window.event.srcElement;
        } else {
            t = e.target;
        }
        if (t.nodeName == 'SPAN') {
            t = t.parentNode;
        }
        if (!t) {
            return;
        }
        var ckid = t.className.split(' ')[0];
        if (ckid != 'textuisize') {
            return;
        }
        UI.setMenuTextSize(t);
        var text = document.forms.activetextbox.textsprite;
        text.setFontSize(t.fs);
        Undo.record({
            action: 'edittext',
            where: text.div.parentNode.owner.id,
            who: text.id
        });
        ScratchJr.storyStart('UI.setTextSize'); // Record a change for sample projects in story-starter mode
        var ti = document.forms.activetextbox.typing;
        ti.style.fontSize = (t.fs * scaleMultiplier) + 'px';
        setProps(document.forms.activetextbox.style, {
            height: ((t.fs + 10) * scaleMultiplier) + 'px'
        });
    }

    ///////////////////////////////////////////
    // UI clear
    /////////////////////////////////////////

    static clear() {
        var costumes = gn('spritecc');
        while (costumes.childElementCount > 0) {
            costumes.removeChild(costumes.childNodes[0]);
        }
        var pthumbs = Thumbs.getPageList();
        while (pthumbs.childElementCount > 0) {
            pthumbs.removeChild(pthumbs.childNodes[0]);
        }
        var pageActions = gn('pageactions');
        while (pageActions && pageActions.childElementCount > 0) {
            pageActions.removeChild(pageActions.childNodes[0]);
        }
    }
}
