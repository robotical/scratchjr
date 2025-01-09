

export default class CogMusicBlocks {

    constructor(cog) {
        this.cog = cog;
        this.bpm = 120;
    }


    setTempo(bpm) {
        this.bpm = bpm;
    }

    rest(beats) {
        const rtttl = `audio/rtttl/Rest:d=4,o=5,b=${this.bpm}:${(4 + 1) - beats}p`;
        const duration = calculateRTTTLDur(rtttl);
        this.cog.sendRestMessage(rtttl);
        return duration;
    }

    playSound(sound) {
        switch (sound) {
            case "disbelief":
                const rtttlDisbelief = `audio/rtttl/Disbelief:d=4,o=5,b=${this.bpm}:g,8d#,8e,8f,8f#,8g,8a,8b,8c6,8p,8c6,8b,8a,8g,8f#,8e,8f,8d#,8p,8g`;
                const durationDisbelief = calculateRTTTLDur(rtttlDisbelief);
                this.cog.sendRestMessage(rtttlDisbelief);
                return durationDisbelief;
            case "confusion":
                const rtttlConfusion = `audio/rtttl/Confusion:d=4,o=5,b=${this.bpm}:c,e,g,c6,e6,g6,c,e,g,c6,e6,g6,c,e,g,a,a,b,b,c6`;
                const durationConfusion = calculateRTTTLDur(rtttlConfusion);
                this.cog.sendRestMessage(rtttlConfusion);
                return durationConfusion;
            case "excitement":
                const rtttlExcitement = `audio/rtttl/Excitement:d=4,o=5,b=${this.bpm}:c,e,g,8c6,16p,8c6,16p,8c6,16p,c,e,g,8c6,16p,8c6,16p,8c6,16p,c,e,g,8c6`;
                const durationExcitement = calculateRTTTLDur(rtttlExcitement);
                this.cog.sendRestMessage(rtttlExcitement);
                return durationExcitement;
            case "noway":
                const rtttlNoWay = `audio/rtttl/NoWay:d=4,o=5,b=${this.bpm}:p,8g,8p,8c6,8p,8g,8p,8a,8p,8f,8p,8e,8p,8d,8p,8c,8p,8g,8p,8c6,8p,8g`;
                const durationNoWay = calculateRTTTLDur(rtttlNoWay);
                this.cog.sendRestMessage(rtttlNoWay);
                return durationNoWay;
            case "no":
                const rtttlNo = `audio/rtttl/No:d=4,o=5,b=${this.bpm}:p,8c,8p,8c,8p,8c,8p,8c`;
                const durationNo = calculateRTTTLDur(rtttlNo);
                this.cog.sendRestMessage(rtttlNo);
                return durationNo;
            case "whistle":
                const rtttlWhistle = `audio/rtttl/Whistle:d=4,o=6,b=${this.bpm}:16b5,16p,16b5,16p,16b5,16p,16g,16p,16e,16p,16g,16p,16c7,16p,16c7,16p,16c7,16p,16a,16p,16f,16p,16a,16p,16d7`;
                const durationWhistle = calculateRTTTLDur(rtttlWhistle);
                this.cog.sendRestMessage(rtttlWhistle);
                return durationWhistle;
            default:
                break;
        }
    }

    playNote(note) {
        switch (note) {
            case "notec":
                const rtttlNoteC = `audio/rtttl/NoteC:d=4,o=5,b=${this.bpm}:c`;
                const durationNoteC = calculateRTTTLDur(rtttlNoteC);
                this.cog.sendRestMessage(rtttlNoteC);
                return durationNoteC;
            case "notecsharp":
                const rtttlNoteCSharp = `audio/rtttl/NoteCSharp:d=4,o=5,b=${this.bpm}:c#`;
                const durationNoteCSharp = calculateRTTTLDur(rtttlNoteCSharp);
                this.cog.sendRestMessage(rtttlNoteCSharp);
                return durationNoteCSharp;
            case "noted":
                const rtttlNoteD = `audio/rtttl/NoteD:d=4,o=5,b=${this.bpm}:d`;
                const durationNoteD = calculateRTTTLDur(rtttlNoteD);
                this.cog.sendRestMessage(rtttlNoteD);
                return durationNoteD;
            case "notedsharp":
                const rtttlNoteDSharp = `audio/rtttl/NoteDSharp:d=4,o=5,b=${this.bpm}:d#`;
                const durationNoteDSharp = calculateRTTTLDur(rtttlNoteDSharp);
                this.cog.sendRestMessage(rtttlNoteDSharp);
                return durationNoteDSharp;
            case "notee":
                const rtttlNoteE = `audio/rtttl/NoteE:d=4,o=5,b=${this.bpm}:e`;
                const durationNoteE = calculateRTTTLDur(rtttlNoteE);
                this.cog.sendRestMessage(rtttlNoteE);
                return durationNoteE;
            case "notef":
                const rtttlNoteF = `audio/rtttl/NoteF:d=4,o=5,b=${this.bpm}:f`;
                const durationNoteF = calculateRTTTLDur(rtttlNoteF);
                this.cog.sendRestMessage(rtttlNoteF);
                return durationNoteF;
            case "notefsharp":
                const rtttlNoteFSharp = `audio/rtttl/NoteFSharp:d=4,o=5,b=${this.bpm}:f#`;
                const durationNoteFSharp = calculateRTTTLDur(rtttlNoteFSharp);
                this.cog.sendRestMessage(rtttlNoteFSharp);
                return durationNoteFSharp;
            case "noteg":
                const rtttlNoteG = `audio/rtttl/NoteG:d=4,o=5,b=${this.bpm}:g`;
                const durationNoteG = calculateRTTTLDur(rtttlNoteG);
                this.cog.sendRestMessage(rtttlNoteG);
                return durationNoteG;
            case "notegsharp":
                const rtttlNoteGSharp = `audio/rtttl/NoteGSharp:d=4,o=5,b=${this.bpm}:g#`;
                const durationNoteGSharp = calculateRTTTLDur(rtttlNoteGSharp);
                this.cog.sendRestMessage(rtttlNoteGSharp);
                return durationNoteGSharp;
            default:
                break;
        }
    }
}


function calculateRTTTLDur(rtttl) {
    // Extract the parameters and notes from the RTTTL string
    const [header, notesString] = rtttl.split(":").slice(1);
    const params = Object.fromEntries(header.split(",").map(p => p.split("=")));
    const notes = notesString.split(",");

    // Extract tempo (BPM) and default duration
    const bpm = parseInt(params.b, 10); // Beats per minute
    const defaultDuration = parseInt(params.d, 10); // Default note duration (e.g., 4 = quarter note)

    // Calculate the duration of a whole note in ms
    const wholeNoteDuration = (60000 * 4) / bpm;

    let totalDuration = 0;

    // Calculate the duration for each note or rest
    for (const note of notes) {
        // Match note-specific duration or use default
        const match = note.match(/^(\d+)?([a-gp#]+)/i); // Match duration and note/rest
        if (!match) continue;
        const noteDuration = match[1] ? parseInt(match[1], 10) : defaultDuration; // Specific or default duration
        // Calculate the duration for the note/rest
        const duration = wholeNoteDuration * (1 / noteDuration);

        // Accumulate total duration
        totalDuration += duration;
    }

    return totalDuration;
}

