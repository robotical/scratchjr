import { gn, newHTML } from '../utils/lib';
import { moveFocusByKey, setMainLandmark, setSelectedState } from '../utils/accessibility';
import Localization from '../utils/Localization';
import TutorialFetcher from '../tutorial/TutorialFetcher';
import { BLOCK_GUIDE_EXTENSION, BLOCK_GUIDE_MODES } from '../editor/blocks/BlockGuideRegistry';

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
    var localizeGuideText = function (key, fallback, formatting) {
        var fallbackText = fallback || '';
        if (formatting) {
            Object.keys(formatting).forEach(function (formatKey) {
                fallbackText = fallbackText.replace('{' + formatKey + '}', formatting[formatKey]);
            });
        }
        if (!key) {
            return fallbackText;
        }
        var localized = Localization.localizeOptional(key, formatting);
        return localized === key ? fallbackText : localized;
    };

    var blockCountText = function (count) {
        return localizeGuideText('BLOCK_GUIDE_BLOCK_COUNT', '{COUNT} blocks', {COUNT: count});
    };

    var renderBlockCard = function (block, category, parent, headingTag) {
        var card = newHTML('article', 'block-guide-card', parent);
        card.setAttribute('data-block-id', block.id);

        var preview = newHTML('div',
            'block-guide-preview blocks-guide-category-' + category.id, card);
        preview.setAttribute('aria-hidden', 'true');
        if (block.icon) {
            var image = newHTML('img', 'block-guide-icon', preview);
            image.src = block.icon;
            image.alt = '';
        } else {
            var symbol = newHTML('span', 'block-guide-symbol', preview);
            symbol.textContent = block.symbol || '?';
        }

        var copy = newHTML('div', 'block-guide-card-copy', card);
        var title = newHTML(headingTag, '', copy);
        var isEnglish = (Localization.currentLocale || 'en').split('-')[0] === 'en';
        title.textContent = isEnglish ? block.title : localizeGuideText(block.titleKey, block.title);
        var description = newHTML('p', '', copy);
        description.textContent = isEnglish
            ? block.description
            : localizeGuideText(block.descriptionKey, block.description);
        if (block.note) {
            var note = newHTML('span', 'block-guide-note', copy);
            note.textContent = isEnglish ? block.note : localizeGuideText(block.noteKey, block.note);
        }
    };

    var renderCategory = function (category, parent, options) {
        var section = newHTML('section',
            'blocks-guide-category blocks-guide-category-' + category.id, parent);
        section.setAttribute('data-guide-category', category.id);

        var heading = newHTML('div', 'blocks-guide-category-heading', section);
        var dot = newHTML('span', 'blocks-guide-category-dot', heading);
        dot.setAttribute('aria-hidden', 'true');
        var title = newHTML(options.categoryHeadingTag, 'blocks-guide-category-title', heading);
        title.textContent = localizeGuideText(category.titleKey, category.title);
        var count = newHTML('span', 'blocks-guide-category-count', heading);
        count.textContent = blockCountText(category.blocks.length);

        var grid = newHTML('div', 'blocks-guide-card-grid', section);
        category.blocks.forEach(function (item) {
            renderBlockCard(item, category, grid, options.cardHeadingTag);
        });
    };

    gn('blocks-guide-eyebrow').textContent = localizeGuideText(
        'BLOCK_GUIDE_REFERENCE', 'Complete block reference');
    gn('blocks-guide-title').textContent = Localization.localize('BLOCKS_GUIDE');
    gn('blocks-guide-introduction').textContent = localizeGuideText(
        'BLOCK_GUIDE_INTRODUCTION',
        'Choose a programming target to see every block in the same categories and order used by the editor.');

    ['M', 'S', 'C', '+'].forEach(function (label) {
        var summaryBlock = newHTML('span', 'blocks-guide-summary-block', gn('blocks-guide-summary'));
        summaryBlock.textContent = label;
    });

    var tabs = [];
    var panels = [];
    var tabsContainer = gn('blocks-guide-tabs');
    tabsContainer.setAttribute('aria-label', localizeGuideText(
        'BLOCK_GUIDE_MODE_SELECTOR', 'Choose a block group'));

    BLOCK_GUIDE_MODES.forEach(function (mode) {
        var tab = newHTML('button', 'blocks-guide-tab', tabsContainer);
        tab.type = 'button';
        tab.id = 'blocks-guide-tab-' + mode.id;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', 'blocks-guide-panel-' + mode.id);
        tab.setAttribute('data-guide-mode', mode.id);

        var tabLabel = newHTML('span', 'blocks-guide-tab-label', tab);
        var localizedModeTitle = localizeGuideText(mode.titleKey, mode.title);
        tab.setAttribute('aria-label', localizedModeTitle);
        tabLabel.textContent = localizedModeTitle;
        var tabCount = newHTML('span', 'blocks-guide-tab-count', tab);
        tabCount.textContent = mode.blockCount;

        var panel = newHTML('section', 'blocks-guide-panel', gn('blocks-guide-panels'));
        panel.id = 'blocks-guide-panel-' + mode.id;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.setAttribute('data-guide-mode-panel', mode.id);

        var modeHeader = newHTML('header', 'blocks-guide-mode-header', panel);
        var modeHeaderCopy = newHTML('div', '', modeHeader);
        var modeTitle = newHTML('h2', '', modeHeaderCopy);
        modeTitle.textContent = localizeGuideText(mode.titleKey, mode.title);
        var modeDescription = newHTML('p', '', modeHeaderCopy);
        modeDescription.textContent = localizeGuideText(mode.descriptionKey, mode.description);
        var modeTotal = newHTML('span', 'blocks-guide-mode-total', modeHeader);
        modeTotal.textContent = blockCountText(mode.blockCount);

        mode.categories.forEach(function (category) {
            renderCategory(category, panel, {
                categoryHeadingTag: 'h3',
                cardHeadingTag: 'h4'
            });
        });

        tabs.push(tab);
        panels.push(panel);
    });

    var selectMode = function (modeId, scrollToSelection) {
        var selectedPanel;
        tabs.forEach(function (tab, index) {
            var selected = tab.getAttribute('data-guide-mode') === modeId;
            tab.setAttribute('aria-selected', selected ? 'true' : 'false');
            tab.tabIndex = selected ? 0 : -1;
            panels[index].hidden = !selected;
            if (selected) {
                selectedPanel = panels[index];
            }
        });

        if (scrollToSelection && selectedPanel) {
            var tabsShell = gn('blocks-guide-tabs').parentNode;
            var panelTop = window.pageYOffset + selectedPanel.getBoundingClientRect().top;
            window.scrollTo(0, Math.max(0, panelTop - tabsShell.offsetHeight - 8));
        }
    };

    tabs.forEach(function (tab) {
        tab.onclick = function () {
            selectMode(tab.getAttribute('data-guide-mode'), true);
        };
        tab.onkeydown = function (event) {
            if (moveFocusByKey(event, tabs, tab, {horizontal: true, vertical: false})) {
                selectMode(document.activeElement.getAttribute('data-guide-mode'), true);
            }
        };
    });
    selectMode(BLOCK_GUIDE_MODES[0].id);

    var extension = gn('blocks-guide-extension');
    var extensionTitle = newHTML('h2', '', extension);
    extensionTitle.textContent = localizeGuideText(BLOCK_GUIDE_EXTENSION.titleKey, BLOCK_GUIDE_EXTENSION.title);
    var extensionName = newHTML('h3', '', extension);
    extensionName.textContent = localizeGuideText(BLOCK_GUIDE_EXTENSION.nameKey, BLOCK_GUIDE_EXTENSION.name);
    var extensionDescription = newHTML('p', 'blocks-guide-extension-intro', extension);
    extensionDescription.textContent = localizeGuideText(
        BLOCK_GUIDE_EXTENSION.descriptionKey, BLOCK_GUIDE_EXTENSION.description);
    BLOCK_GUIDE_EXTENSION.categories.forEach(function (category) {
        renderCategory(category, extension, {
            categoryHeadingTag: 'h4',
            cardHeadingTag: 'h5'
        });
    });
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
