// src/utils/instrumentFactory.js
import * as Tone from "tone";

export const createInstrument = (id, settings) => {
    switch (id) {
        case "synth":
            return new Tone.Synth({
                oscillator: { type: "sine" },
                envelope: {
                    attack: settings.attack,
                    decay: settings.decay,
                    sustain: settings.sustain,
                    release: settings.release,
                },
                volume: Tone.gainToDb(settings.volume),
            });
        case "toneSynth":
            return new Tone.PolySynth(Tone.Synth).set({
                oscillator: { type: "triangle" },
                envelope: {
                    attack: settings.attack,
                    decay: settings.decay,
                    sustain: settings.sustain,
                    release: settings.release,
                },
                volume: Tone.gainToDb(settings.volume),
            });
        case "drums":
            return new Tone.MembraneSynth({
                pitchDecay: 0.05,
                octaves: 2,
                envelope: {
                    attack: settings.attack,
                    decay: settings.decay,
                    sustain: settings.sustain,
                    release: settings.release,
                },
                volume: Tone.gainToDb(settings.volume),
            });
        case "piano":
            return new Tone.Sampler({
                urls: {
                    A4: "A4.mp3",
                    C5: "C5.mp3",
                },
                baseUrl: "/samples/piano/",
                volume: Tone.gainToDb(settings.volume),
            });
        case "bass":
            return new Tone.Synth({
                oscillator: { type: "sawtooth" },
                envelope: {
                    attack: settings.attack,
                    decay: settings.decay,
                    sustain: settings.sustain,
                    release: settings.release,
                },
                volume: Tone.gainToDb(settings.volume),
            });
        default:
            return new Tone.Synth(); // Fallback to a simple synth
    }
};