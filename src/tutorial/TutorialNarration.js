import narrationPlayer, {getNarrationMarty} from './ActivityNarrationPlayer';

// Request diagnostics stay in the console; narration fallback has no error popup.
/* eslint-disable no-console */
const warn = (...args) => console.warn(...args);
/* eslint-enable no-console */

export default class TutorialNarration {
    constructor ({root, player = narrationPlayer, getMarty = getNarrationMarty,
        getLocale = () => 'en', localize = text => text, readLabel = 'Read aloud'}) {
        this.player = player;
        this.getMarty = getMarty;
        this.getLocale = getLocale;
        this.localize = localize;
        this.readLabel = readLabel;
        this.group = root.querySelector('#tutorialAudioControls');
        this.deviceButton = root.querySelector('#tutorialReadAloud');
        this.martyButton = root.querySelector('#tutorialMartyReadAloud');
        this.text = '';
        this.locale = getLocale() || 'en';
        this.enabled = false;
        this.raft = null;
        this.states = {device: 'idle', marty: 'idle'};
        this.onDeviceState = state => this.onState('device', state);
        this.onMartyState = state => this.onState('marty', state);
        this.playDevice = this.playDevice.bind(this);
        this.playMarty = this.playMarty.bind(this);
        this.onPageHide = () => this.destroy();
        this.onVisibilityChange = () => {
            if (document.hidden) this.stop();
        };
        this.deviceButton.addEventListener('click', this.playDevice);
        this.martyButton.addEventListener('click', this.playMarty);
        window.addEventListener('pagehide', this.onPageHide);
        document.addEventListener('visibilitychange', this.onVisibilityChange);
        this.reconcileConnection();
        this.connectionTimer = setInterval(() => this.reconcileConnection(), 500);
    }

    onState (target, state) {
        if (this.destroyed) return;
        this.states[target] = state === 'error' ? 'idle' : state;
        this.render();
    }

    reconcileConnection () {
        if (this.destroyed) return;
        const locale = this.getLocale() || 'en';
        if (locale !== this.locale) {
            this.stop();
            this.locale = locale;
        }
        const raft = this.getMarty();
        if (raft !== this.raft) {
            this.player.stop(this.onMartyState).catch(error => warn('Marty narration stop failed:', error));
            this.raft = raft;
        }
        this.render();
    }

    setText (text) {
        if (text !== this.text) {
            this.stop();
            this.text = text;
        }
        this.render();
    }

    show (text) {
        this.enabled = true;
        this.setText(text);
    }

    hide () {
        this.enabled = false;
        this.stop();
        this.setText('');
    }

    async stop () {
        await Promise.all([
            this.player.stop(this.onDeviceState),
            this.player.stop(this.onMartyState)
        ]).catch(error => warn('Activity narration stop failed:', error));
    }

    async playDevice () {
        if (this.states.device !== 'idle') {
            await this.stop();
            return;
        }
        if (!this.enabled || !this.text) return;
        try {
            await this.player.playOnDevice(this.text, this.locale, this.onDeviceState);
        } catch (error) {
            if (error.name !== 'AbortError') warn('Device narration unavailable:', error.message);
        }
    }

    async playMarty () {
        if (this.states.marty !== 'idle') {
            await this.stop();
            return;
        }
        this.reconcileConnection();
        if (!this.enabled || !this.text || !this.raft) return;
        try {
            await this.player.play(this.raft, this.text, this.locale, this.onMartyState);
        } catch (error) {
            if (error.name !== 'AbortError') warn('Marty narration unavailable:', error.message);
        }
    }

    render () {
        if (this.destroyed) return;
        const available = this.enabled && Boolean(this.text);
        this.group.hidden = !available;
        this.martyButton.hidden = !this.raft;
        this.deviceButton.hidden = !window.AudioContext && !window.webkitAudioContext &&
            !(window.speechSynthesis && window.speechSynthesis.speak && window.SpeechSynthesisUtterance);
        for (const target of ['device', 'marty']) {
            const button = target === 'device' ? this.deviceButton : this.martyButton;
            const state = this.states[target];
            const active = state !== 'idle';
            const label = target === 'device' ? (active ? this.localize('Stop reading') : this.readLabel) :
                this.localize(active ? 'Stop Marty reading' : 'Marty, read this');
            button.disabled = !available;
            button.setAttribute('aria-label', label);
            button.setAttribute('aria-pressed', String(active));
            button.setAttribute('aria-busy', String(state === 'loading'));
            button.title = state === 'loading' ? this.localize('Getting ready…') : label;
        }
    }

    destroy () {
        if (this.destroyed) return;
        this.destroyed = true;
        clearInterval(this.connectionTimer);
        this.deviceButton.removeEventListener('click', this.playDevice);
        this.martyButton.removeEventListener('click', this.playMarty);
        window.removeEventListener('pagehide', this.onPageHide);
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        this.stop();
    }
}
