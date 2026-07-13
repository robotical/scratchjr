import { gn, newHTML } from '../utils/lib';
import { setMainLandmark, setSelectedState } from '../utils/accessibility';
import Localization from '../utils/Localization';
import TutorialFetcher from '../tutorial/TutorialFetcher';

function getNavigationHref(baseHref, fileName, query) {
    const cleanHref = baseHref.split('#')[0].split('?')[0];
    const inappMarker = '/inapp/';
    let resolvedBaseHref = cleanHref.slice(0, cleanHref.lastIndexOf('/') + 1);

    if (cleanHref.indexOf(inappMarker) > -1) {
        resolvedBaseHref = cleanHref.slice(0, cleanHref.indexOf(inappMarker) + 1);
    }

    return resolvedBaseHref + fileName + (query ? '?' + query : '');
}

function navigateFromTutorials(fileName, query) {
    try {
        if (window.parent && window.parent !== window) {
            window.parent.location.href = getNavigationHref(window.parent.location.href, fileName, query);
            return;
        }
    } catch (e) {
        console.log(e);
    }

    window.location.href = getNavigationHref(window.location.href, fileName, query);
}

function setupGuidePage() {
    setMainLandmark(gn('content'), {
        id: 'content',
        label: Localization.localize('A11Y_MAIN_CONTENT')
    });
}

function markDecorativeImages(selector) {
    const images = document.querySelectorAll(selector);
    images.forEach((image) => {
        image.alt = '';
    });
}

export function inappAbout() {
    setupGuidePage();
    var aboutContent = {
        aboutBlocksJrTitle: 'ABOUT_SCRATCHJR',
        aboutBlocksJrEyebrow: 'ABOUT_BLOCKS_JR_EYEBROW',
        aboutBlocksJrTagline: 'ABOUT_BLOCKS_JR_TAGLINE',
        aboutBlocksJrIntroductionTitle: 'ABOUT_BLOCKS_JR_INTRODUCTION_TITLE',
        aboutBlocksJrIntroductionDescription: 'ABOUT_BLOCKS_JR_INTRODUCTION_DESCRIPTION',
        aboutBlocksJrFeaturesTitle: 'ABOUT_BLOCKS_JR_FEATURES_TITLE',
        aboutBlocksJrCreateTitle: 'ABOUT_BLOCKS_JR_CREATE_TITLE',
        aboutBlocksJrCreateDescription: 'ABOUT_BLOCKS_JR_CREATE_DESCRIPTION',
        aboutBlocksJrCodeTitle: 'ABOUT_BLOCKS_JR_CODE_TITLE',
        aboutBlocksJrCodeDescription: 'ABOUT_BLOCKS_JR_CODE_DESCRIPTION',
        aboutBlocksJrConnectTitle: 'ABOUT_BLOCKS_JR_CONNECT_TITLE',
        aboutBlocksJrConnectDescription: 'ABOUT_BLOCKS_JR_CONNECT_DESCRIPTION',
        aboutBlocksJrRoboticalTitle: 'ABOUT_BLOCKS_JR_ROBOTICAL_TITLE',
        aboutBlocksJrRoboticalDescription: 'ABOUT_BLOCKS_JR_ROBOTICAL_DESCRIPTION',
        aboutBlocksJrFoundationTitle: 'ABOUT_BLOCKS_JR_FOUNDATION_TITLE',
        aboutBlocksJrFoundationDescription: 'ABOUT_BLOCKS_JR_FOUNDATION_DESCRIPTION'
    };

    Object.keys(aboutContent).forEach(function (elementId) {
        gn(elementId).textContent = Localization.localize(aboutContent[elementId]);
    });

    // PBS-only
    if (window.Settings.edition == 'PBS') {
        gn('aboutWhatIsPbs').innerHTML = Localization.localize('ABOUT_WHAT_IS_PBS');
        gn('aboutWhatIsPbsDescription').innerHTML = Localization.localize('ABOUT_WHAT_IS_PBS_DESCRIPTION');
        gn('aboutPbsShows').innerHTML = Localization.localize('ABOUT_PBS_SHOWS');
        gn('aboutPbsShowsDescription').innerHTML = Localization.localize('ABOUT_PBS_SHOWS_DESCRIPTION');
    }
}

export function inappInterfaceGuide() {
    setupGuidePage();
    var interfaceKeyHeaderNode = gn('interface-key-header');
    var interfaceKeyDescriptionNode = gn('interface-key-description');
    gn('interface-guide-eyebrow').textContent = Localization.localize('INTERFACE_GUIDE');
    gn('interface-guide-hint').textContent = Localization.localize('INTERFACE_GUIDE_SELECT_HINT');

    var interfaceKeys = [
        'SAVE',
        'DEVICE_CONNECTIONS',
        'EXTENSIONS',
        'SPRITES_AND_DEVICES',
        'PRESENTATION_MODE',
        'GRID',
        'TRACE',
        'CLEAR_TRACE',
        'CHANGE_BG',
        'ADD_TEXT',
        'RESET_CHAR',
        'GREEN_FLAG',
        'STAGE',
        'MARTY_MODE',
        'PAGES',
        'DUPLICATE_PAGE',
        'PROJECT_INFO',
        'BLOCKS_CATEGORIES',
        'DEVICE_BLOCK_CATEGORIES',
        'BLOCKS_PALETTE',
        'PROGRAMMING_SCRIPT',
        'PROGRAMMING_AREA',
        'UNDO_REDO',
        'ZOOM'
    ];

    var interfaceDescriptions = {};
    for (var i = 0; i < interfaceKeys.length; i++) {
        var key = interfaceKeys[i];
        interfaceDescriptions[key] = [
            Localization.localize('INTERFACE_GUIDE_' + key, { N: i + 1 }),
            Localization.localize('INTERFACE_GUIDE_' + key + '_DESCRIPTION')
        ];
    }

    var currentButton;

    var setConnectorSelectedState = function (button, selected) {
        var connector = document.querySelector(
            '.interface-connector[data-guide-key="' + button.getAttribute('data-guide-key') + '"]'
        );
        if (connector) {
            connector.classList.toggle('interface-connector-selected', selected);
        }
    };

    var selectGuideFeature = function (button, playSound) {
        if (!button) {
            return;
        }
        var description = interfaceDescriptions[button.getAttribute('data-guide-key')];
        if (!description) {
            return;
        }
        interfaceKeyHeaderNode.textContent = description[0];
        interfaceKeyDescriptionNode.textContent = description[1];
        if (currentButton) {
            currentButton.classList.remove('interface-button-selected');
            setSelectedState(currentButton, false);
            setConnectorSelectedState(currentButton, false);
        }
        currentButton = button;
        currentButton.classList.add('interface-button-selected');
        setSelectedState(currentButton, true);
        setConnectorSelectedState(currentButton, true);
        if (playSound) {
            window.parent.ScratchAudio.sndFXWithVolume('keydown.wav', 0.3);
        }
    };

    var switchHelp = function (e) {
        var target = e.target.closest('.interface-button');
        if (target) {
            selectGuideFeature(target, true);
        }
    };
    document.addEventListener('click', switchHelp, false);
    const buttons = document.querySelectorAll('.interface-button');
    buttons.forEach(function (button) {
        var description = interfaceDescriptions[button.getAttribute('data-guide-key')];
        if (description) {
            button.setAttribute('aria-label', description[0]);
            button.setAttribute('aria-controls', 'interface-key');
            setSelectedState(button, false);
        }
    });
    selectGuideFeature(document.getElementById('interface-button-save'), false);
    markDecorativeImages('.ipad-project-view');
}

export function inappPaintEditorGuide() {
    setupGuidePage();
    var paintKeyHeaderNode = gn('paint-key-header');
    var paintKeyDescriptionNode = gn('paint-key-description');

    paintKeyHeaderNode.textContent = Localization.localize('PAINT_GUIDE_UNDO', { N: 1 });
    paintKeyDescriptionNode.textContent = Localization.localize('PAINT_GUIDE_UNDO_DESCRIPTION');

    var paintKeys = [
        'UNDO',
        'REDO',
        'SHAPE',
        'CHARACTER_NAME',
        'CUT',
        'DUPLICATE',
        'ROTATE',
        'DRAG',
        'SAVE',
        'FILL',
        'CAMERA',
        'COLOR',
        'LINE_WIDTH'
    ];

    var paintDescriptions = [];
    for (var i = 0; i < paintKeys.length; i++) {
        var key = paintKeys[i];
        paintDescriptions.push([
            Localization.localize('PAINT_GUIDE_' + key, { N: i + 1 }),
            Localization.localize('PAINT_GUIDE_' + key + '_DESCRIPTION')
        ]);
    }


    var currentButton = document.getElementById('paint-button-undo');
    setSelectedState(currentButton, true);

    var switchHelp = function (e) {
        var target = e.target.closest('.paint-button');
        if (target) {
            var descriptionId = parseInt(target.textContent, 10) - 1;
            paintKeyHeaderNode.textContent = paintDescriptions[descriptionId][0];
            paintKeyDescriptionNode.textContent = paintDescriptions[descriptionId][1];
            currentButton.className = 'paint-button';
            setSelectedState(currentButton, false);
            currentButton = target;
            currentButton.className = currentButton.className + ' paint-button-selected';
            setSelectedState(currentButton, true);
            window.parent.ScratchAudio.sndFXWithVolume('keydown.wav', 0.3);
        }
    };
    document.addEventListener('click', switchHelp, false);
    const buttons = document.querySelectorAll('.paint-button');
    buttons.forEach((button) => {
        var descriptionId = parseInt(button.textContent, 10) - 1;
        if (!isNaN(descriptionId) && paintDescriptions[descriptionId]) {
            button.setAttribute('aria-label', paintDescriptions[descriptionId][0]);
        }
    });
    markDecorativeImages('.ipad-project-view');
}

export function inappBlocksGuide() {
    setupGuidePage();
    // Localized category names
    gn('yellow-block-category-header').textContent = Localization.localize('BLOCKS_TRIGGERING_BLOCKS');
    gn('blue-block-category-header').textContent = Localization.localize('BLOCKS_MOTION_BLOCKS');
    gn('purple-block-category-header').textContent = Localization.localize('BLOCKS_LOOKS_BLOCKS');
    gn('green-block-category-header').textContent = Localization.localize('BLOCKS_SOUND_BLOCKS');
    gn('orange-block-category-header').textContent = Localization.localize('BLOCKS_CONTROL_BLOCKS');
    gn('red-block-category-header').textContent = Localization.localize('BLOCKS_END_BLOCKS');

    var blockDescriptionKeys = [
        'BLOCKS_GREEN_FLAG',
        'BLOCKS_GREEN_FLAG_DESCRIPTION',
        'BLOCKS_MOVE_RIGHT',
        'BLOCKS_MOVE_RIGHT_DESCRIPTION',
        'BLOCKS_MOVE_LEFT',
        'BLOCKS_MOVE_LEFT_DESCRIPTION',
        'BLOCKS_MOVE_UP',
        'BLOCKS_MOVE_UP_DESCRIPTION',
        'BLOCKS_MOVE_DOWN',
        'BLOCKS_MOVE_DOWN_DESCRIPTION',
        'BLOCKS_TURN_RIGHT',
        'BLOCKS_TURN_RIGHT_DESCRIPTION',
        'BLOCKS_TURN_LEFT',
        'BLOCKS_TURN_LEFT_DESCRIPTION',
        'BLOCK_KICK_RIGHT',
        'BLOCK_KICK_RIGHT_DESCRIPTION',
        'BLOCK_KICK_LEFT',
        'BLOCK_KICK_LEFT_DESCRIPTION',
        'BLOCK_MOVE_GETREADY',
        'BLOCK_MOVE_GETREADY_DESCRIPTION',
        'BLOCK_MOVE_DANCE',
        'BLOCK_MOVE_DANCE_DESCRIPTION',
        'BLOCK_EYES_EXCITED',
        'BLOCK_EYES_EXCITED_DESCRIPTION',
        'BLOCK_EYES_WIDE',
        'BLOCK_EYES_WIDE_DESCRIPTION',
        'BLOCK_EYES_ANGRY',
        'BLOCK_EYES_ANGRY_DESCRIPTION',
        'BLOCK_EYES_NORMAL',
        'BLOCK_EYES_NORMAL_DESCRIPTION',
        'BLOCK_EYES_WIGGLE',
        'BLOCK_EYES_WIGGLE_DESCRIPTION',
        'BLOCK_WAVE_LEFT',
        'BLOCK_WAVE_LEFT_DESCRIPTION',
        'BLOCK_WAVE_RIGHT',
        'BLOCK_WAVE_RIGHT_DESCRIPTION',
        'BLOCK_LED_EYES_P1',
        'BLOCK_LED_EYES_P1_DESCRIPTION',
        'BLOCK_LED_EYES_P2',
        'BLOCK_LED_EYES_P2_DESCRIPTION',
        'BLOCK_LED_EYES_Cog',
        'BLOCK_LED_EYES_Cog_DESCRIPTION',
        'BLOCK_LED_EYES_COLOUR',
        'BLOCK_LED_EYES_COLOUR_DESCRIPTION',
        'BLOCK_CELEBRATE',
        'BLOCK_CELEBRATE_DESCRIPTION',
        'BLOCK_PLAY_CONFUSION_SOUND',
        'BLOCK_PLAY_CONFUSION_SOUND_DESCRIPTION',
        'BLOCK_PLAY_DISBELIEF_SOUND',
        'BLOCK_PLAY_DISBELIEF_SOUND_DESCRIPTION',
        'BLOCK_PLAY_EXCITEMENT_SOUND',
        'BLOCK_PLAY_EXCITEMENT_SOUND_DESCRIPTION',
        'BLOCK_PLAY_NOWAY_SOUND',
        'BLOCK_PLAY_NOWAY_SOUND_DESCRIPTION',
        'BLOCK_PLAY_NO_SOUND',
        'BLOCK_PLAY_NO_SOUND_DESCRIPTION',
        'BLOCK_PLAY_WHISTLE_SOUND',
        'BLOCK_PLAY_WHISTLE_SOUND_DESCRIPTION',
        'BLOCK_DESC_WAIT_CROTCHET',
        'BLOCK_DESC_WAIT_CROTCHET_DESCRIPTION',
        'BLOCK_DESC_SET_TEMPO',
        'BLOCK_DESC_SET_TEMPO_DESCRIPTION',
        'BLOCK_DESC_SET_COG_VOLUME',
        'BLOCK_DESC_SET_COG_VOLUME_DESCRIPTION',
        'BLOCKS_WAIT',
        'BLOCKS_WAIT_DESCRIPTION',
        'BLOCKS_STOP',
        'BLOCKS_STOP_DESCRIPTION',
        'BLOCKS_REPEAT',
        'BLOCKS_REPEAT_DESCRIPTION',
        'BLOCKS_END',
        'BLOCKS_END_DESCRIPTION',
        'BLOCKS_REPEAT_FOREVER',
        'BLOCKS_REPEAT_FOREVER_DESCRIPTION',
        'BLOCKS_ON_TILT',
        'BLOCKS_ON_TILT_DESCRIPTION',
        'BLOCK_DESC_ON_STEER',
        'BLOCKS_ON_STEER_COG_DESCRIPTION',
        'BLOCKS_ON_TOUCH_Cog',
        'BLOCKS_ON_TOUCH_Cog_DESCRIPTION',
        'BLOCKS_ON_MOVE',
        'BLOCKS_ON_MOVE_DESCRIPTION',
        'BLOCKS_ON_TAP',
        'BLOCKS_ON_TAP_DESCRIPTION',
        'BLOCKS_ON_TOUCH',
        'BLOCKS_ON_TOUCH_DESCRIPTION',
        'BLOCKS_ON_MESSAGE',
        'BLOCKS_ON_MESSAGE_DESCRIPTION',
        'BLOCKS_SEND_MESSAGE',
        'BLOCKS_SEND_MESSAGE_DESCRIPTION',
        'BLOCK_DESC_MARTY_ON_COLOUR_SENSED',
        'BLOCK_DESC_MARTY_ON_COLOUR_SENSED_DESCRIPTION',
        'BLOCK_DESC_MARTY_ON_OBSTACLE_SENSED',
        'BLOCK_DESC_MARTY_ON_OBSTACLE_SENSED_DESCRIPTION',
        'BLOCK_DESC_MARTY_ON_LIGHT_SENSED',
        'BLOCK_DESC_MARTY_ON_LIGHT_SENSED_DESCRIPTION',
        'BLOCK_DESC_MARTY_ON_NOISE_SENSED',
        'BLOCK_DESC_MARTY_ON_NOISE_SENSED_DESCRIPTION',
        'BLOCKS_HOP',
        'BLOCKS_HOP_DESCRIPTION',
        'BLOCKS_GO_HOME',
        'BLOCKS_GO_HOME_DESCRIPTION',
        'BLOCKS_SELECT_COLOUR',
        'BLOCKS_SELECT_COLOUR_DESCRIPTION',
        'BLOCKS_SET_PATTERN',
        'BLOCKS_SET_PATTERN_DESCRIPTION',
        'BLOCKS_SAY',  
        'BLOCKS_SAY_DESCRIPTION',
        'BLOCKS_GROW',
        'BLOCKS_GROW_DESCRIPTION',
        'BLOCKS_SHRINK',
        'BLOCKS_SHRINK_DESCRIPTION',
        'BLOCKS_HIDE',  
        'BLOCKS_HIDE_DESCRIPTION',
        'BLOCKS_SHOW',
        'BLOCKS_SHOW_DESCRIPTION',
        'BLOCKS_SET_SPEED',
        'BLOCKS_SET_SPEED_DESCRIPTION',
        'BLOCKS_GO_TO_PAGE',
        'BLOCKS_GO_TO_PAGE_DESCRIPTION',
    ];




    for (let i = 0; i < blockDescriptionKeys.length; i++) {
        try {
            gn(blockDescriptionKeys[i]).textContent = Localization.localize(blockDescriptionKeys[i]);
        } catch (e) { console.log(e) }
    }
    markDecorativeImages('.block-image, .block-image-repeat');
}

export function inappTutorials() {
    const title = gn('tutorials-title');
    const content = gn('tutorials-content');
    title.textContent = Localization.localize('TUTORIALS');
    setMainLandmark(gn('tutorials-page'), {
        label: Localization.localize('TUTORIALS')
    });

    const tutorials = TutorialFetcher.fetchTutorials({ platform: 'blocksjr' });
    const groups = [
        {
            title: 'Marty',
            tutorials: tutorials.filter((tutorial) => tutorial.id.indexOf('marty-jr-blocks-') === 0)
        },
        {
            title: 'Cog',
            tutorials: tutorials.filter((tutorial) => tutorial.id.indexOf('cog-jrblocks-') === 0)
        },
        {
            title: 'Cog + Marty',
            tutorials: tutorials.filter((tutorial) => tutorial.id === 'cog-and-marty-tutorial')
        }
    ];

    groups.forEach((group) => {
        if (group.tutorials.length === 0) {
            return;
        }

        const section = newHTML('section', 'tutorials-group', content);
        const header = newHTML('h2', 'tutorials-group-title', section);
        header.textContent = group.title;

        const list = newHTML('div', 'tutorials-group-list', section);
        group.tutorials.forEach((tutorial) => {
            const card = newHTML('button', 'tutorial-card', list);
            card.type = 'button';
            card.setAttribute('data-tutorial-id', tutorial.id);

            const cardTitle = newHTML('div', 'tutorial-card-title', card);
            cardTitle.textContent = tutorial.title;

            const cardDescription = newHTML('div', 'tutorial-card-description', card);
            cardDescription.textContent = tutorial.description;

            card.onclick = () => {
                const query = [
                    'pmd5=-1',
                    'mode=edit',
                    'tutorial=' + encodeURIComponent(tutorial.id),
                    'tutorialReturnPlace=book',
                    'tutorialReturnSubmenu=tutorials'
                ].join('&');
                navigateFromTutorials('editor.html', query);
            };
        });
    });
}

export function inappPrivacyPolicy() {
    setupGuidePage();
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function (item) {
        const key = item.getAttribute('data-i18n');
        item.innerHTML = Localization.localize(key);
    });
}
