import Localization from './Localization';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
].join(',');

const dialogStates = new WeakMap();

function isVisible(element) {
    if (!element) {
        return false;
    }
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
}

function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
        if (!isVisible(element)) {
            return false;
        }
        return !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true';
    });
}

function getState(dialog) {
    return dialogStates.get(dialog);
}

function hideSiblingsExcept(scope, allowedElements, records) {
    const children = Array.from(scope.children || []);
    for (const child of children) {
        const isAllowedElement = allowedElements.some((allowed) => child === allowed);
        if (isAllowedElement) {
            continue;
        }
        const containsAllowedElement = allowedElements.some((allowed) => child.contains(allowed));
        if (containsAllowedElement) {
            hideSiblingsExcept(child, allowedElements, records);
            continue;
        }
        records.push({
            element: child,
            ariaHidden: child.getAttribute('aria-hidden'),
            inert: child.inert
        });
        child.setAttribute('aria-hidden', 'true');
        if ('inert' in child) {
            child.inert = true;
        }
    }
}

function restoreHiddenElements(records) {
    records.forEach((record) => {
        if (record.ariaHidden === null) {
            record.element.removeAttribute('aria-hidden');
        } else {
            record.element.setAttribute('aria-hidden', record.ariaHidden);
        }
        if ('inert' in record.element) {
            record.element.inert = record.inert;
        }
    });
}

function trapFocus(event, dialog) {
    if (event.key !== 'Tab') {
        return;
    }
    const focusable = getFocusableElements(dialog);
    if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey) {
        if (document.activeElement === first || document.activeElement === dialog) {
            event.preventDefault();
            last.focus();
        }
        return;
    }
    if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

export function newLocalizedTitle(titleKey, formatting) {
    const pageTitle = Localization.localizeOptional(titleKey, formatting);
    if (pageTitle.indexOf('ScratchJr') !== -1) {
        return pageTitle;
    }
    return pageTitle + ' - ScratchJr';
}

export function setLocalizedDocumentTitle(titleKey, formatting) {
    document.title = newLocalizedTitle(titleKey, formatting);
}

export function setDocumentLanguage(locale) {
    if (locale) {
        document.documentElement.lang = locale;
    }
}

export function ensureSkipLink(targetId, label) {
    if (!document.body) {
        return null;
    }
    let skipLink = document.getElementById('skip-link');
    if (!skipLink) {
        skipLink = document.createElement('a');
        skipLink.id = 'skip-link';
        skipLink.className = 'skip-link';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    skipLink.href = '#' + targetId;
    skipLink.textContent = label;
    return skipLink;
}

export function setMainLandmark(element, options = {}) {
    if (!element) {
        return null;
    }
    if (options.id) {
        element.id = options.id;
    }
    if (element.tagName.toLowerCase() !== 'main') {
        element.setAttribute('role', 'main');
    }
    if (options.label) {
        element.setAttribute('aria-label', options.label);
    }
    if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '-1');
    }
    return element;
}

export function setNavigationLandmark(element, label) {
    if (!element) {
        return null;
    }
    element.setAttribute('role', 'navigation');
    if (label) {
        element.setAttribute('aria-label', label);
    }
    return element;
}

export function setPressedState(element, pressed) {
    if (!element) {
        return;
    }
    element.setAttribute('aria-pressed', pressed ? 'true' : 'false');
}

export function setSelectedState(element, selected) {
    if (!element) {
        return;
    }
    if (selected) {
        element.setAttribute('aria-current', 'page');
    } else {
        element.removeAttribute('aria-current');
    }
}

export function setDialogLabel(dialog, options = {}) {
    if (!dialog) {
        return;
    }
    if (options.labelledBy) {
        dialog.setAttribute('aria-labelledby', options.labelledBy);
        dialog.removeAttribute('aria-label');
    } else if (options.label) {
        dialog.setAttribute('aria-label', options.label);
        dialog.removeAttribute('aria-labelledby');
    }
    if (options.describedBy) {
        dialog.setAttribute('aria-describedby', options.describedBy);
    }
}

export function registerDialog(dialog, options = {}) {
    if (!dialog) {
        return null;
    }
    dialog.setAttribute('role', options.role || 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    if (!dialog.hasAttribute('tabindex')) {
        dialog.setAttribute('tabindex', '-1');
    }
    setDialogLabel(dialog, options);
    const state = {
        closeOnEscape: options.closeOnEscape !== false,
        onRequestClose: options.onRequestClose || null,
        initialFocus: options.initialFocus || null,
        scope: options.scope || document.body,
        extraActiveElements: options.extraActiveElements || [],
        hiddenRecords: [],
        previouslyFocused: null,
        keydownHandler: null,
        isOpen: false
    };
    dialogStates.set(dialog, state);
    return dialog;
}

export function updateDialogOptions(dialog, options = {}) {
    const state = getState(dialog);
    if (!state) {
        return;
    }
    if (options.initialFocus !== undefined) {
        state.initialFocus = options.initialFocus;
    }
    if (options.scope) {
        state.scope = options.scope;
    }
    if (options.extraActiveElements) {
        state.extraActiveElements = options.extraActiveElements;
    }
    if (options.onRequestClose !== undefined) {
        state.onRequestClose = options.onRequestClose;
    }
    if (options.closeOnEscape !== undefined) {
        state.closeOnEscape = options.closeOnEscape;
    }
    setDialogLabel(dialog, options);
}

export function openDialog(dialog, options = {}) {
    const state = getState(dialog);
    if (!state || state.isOpen) {
        return;
    }
    updateDialogOptions(dialog, options);
    state.previouslyFocused = document.activeElement;
    state.hiddenRecords = [];
    hideSiblingsExcept(state.scope, [dialog].concat(state.extraActiveElements || []), state.hiddenRecords);
    state.keydownHandler = function (event) {
        if (event.key === 'Escape' && state.closeOnEscape && state.onRequestClose) {
            event.preventDefault();
            state.onRequestClose(event);
            return;
        }
        trapFocus(event, dialog);
    };
    document.addEventListener('keydown', state.keydownHandler, true);
    state.isOpen = true;

    const initialFocus = typeof state.initialFocus === 'function'
        ? state.initialFocus()
        : state.initialFocus;
    const focusTarget = initialFocus || getFocusableElements(dialog)[0] || dialog;
    window.setTimeout(() => {
        focusTarget.focus();
    }, 0);
}

export function closeDialog(dialog, options = {}) {
    const state = getState(dialog);
    if (!state || !state.isOpen) {
        return;
    }
    if (state.keydownHandler) {
        document.removeEventListener('keydown', state.keydownHandler, true);
        state.keydownHandler = null;
    }
    restoreHiddenElements(state.hiddenRecords);
    state.hiddenRecords = [];
    state.isOpen = false;
    const shouldRestoreFocus = options.restoreFocus !== false;
    if (shouldRestoreFocus && state.previouslyFocused && document.contains(state.previouslyFocused)) {
        state.previouslyFocused.focus();
    }
}
