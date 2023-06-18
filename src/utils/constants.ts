import { InstrumentOptions } from "./types";

export const NOTES: { [key: string]: number } = {
    c: 16,
    "c#": 17.32,
    d: 18.35,
    "d#": 19.45,
    e: 20.6,
    f: 21.83,
    "f#": 23.12,
    g: 24.5,
    "g#": 25.96,
    a: 27.5,
    "a#": 29.14,
    b: 30.87,
} as const;

export const DEFAULT_BPM = 120 as const;
export const NOTE_HEIGHT = 32 as const;
export const NOTE_WIDTH = 8 as const;
export const PIANO_WIDTH = 100 as const;
export const DEFAULT_NOTE_LENGTH = 8 as const;
export const DEFAULT_SNAP_VALUE = 2 as const;
export const RIGHT_CLICK = 2 as const;
export const LEFT_CLICK = 0 as const;
export const DEFAULT_SAVE_TIME = 1000 as const;
export const NOTE_COLOR = "rgb(96 165 250)" as const;
export const NOTE_STROKE_COLOR = "#1e40af" as const;
export const SELECTED_NOTE_COLOR = "#bfdbfe" as const;
export const BAR_LENGTH = 32 as const;
export const SCROLL_VALUE = 20 as const;

export const INSTRUMENT_OPTIONS: InstrumentOptions[] = [
    {
        name: "Acoustic Grand Piano",
        value: "acoustic_grand_piano",
    },
    {
        name: "Bright Acoustic Piano",
        value: "bright_acoustic_piano",
    },
    {
        name: "Electric Grand Piano",
        value: "electric_grand_piano",
    },
    {
        name: "Honkytonk Piano",
        value: "honkytonk_piano",
    },
    {
        name: "Electric Piano 1",
        value: "electric_piano_1",
    },
    {
        name: "Electric Piano 2",
        value: "electric_piano_2",
    },
    {
        name: "Harpsichord",
        value: "harpsichord",
    },
    {
        name: "Clavinet",
        value: "clavinet",
    },
    {
        name: "Celesta",
        value: "celesta",
    },
    {
        name: "Glockenspiel",
        value: "glockenspiel",
    },
    {
        name: "Music Box",
        value: "music_box",
    },
    {
        name: "Vibraphone",
        value: "vibraphone",
    },
    {
        name: "Marimba",
        value: "marimba",
    },
    {
        name: "Xylophone",
        value: "xylophone",
    },
    {
        name: "Tubular Bells",
        value: "tubular_bells",
    },
    {
        name: "Dulcimer",
        value: "dulcimer",
    },
    {
        name: "Drawbar Organ",
        value: "drawbar_organ",
    },
    {
        name: "Percussive Organ",
        value: "percussive_organ",
    },
    {
        name: "Rock Organ",
        value: "rock_organ",
    },
    {
        name: "Church Organ",
        value: "church_organ",
    },
    {
        name: "Reed Organ",
        value: "reed_organ",
    },
    {
        name: "Accordion",
        value: "accordion",
    },
    {
        name: "Harmonica",
        value: "harmonica",
    },
    {
        name: "Tango Accordion",
        value: "tango_accordion",
    },
    {
        name: "Acoustic Guitar Nylon",
        value: "acoustic_guitar_nylon",
    },
    {
        name: "Acoustic Guitar Steel",
        value: "acoustic_guitar_steel",
    },
    {
        name: "Electric Guitar Jazz",
        value: "electric_guitar_jazz",
    },
    {
        name: "Electric Guitar Clean",
        value: "electric_guitar_clean",
    },
    {
        name: "Electric Guitar Muted",
        value: "electric_guitar_muted",
    },
    {
        name: "Overdriven Guitar",
        value: "overdriven_guitar",
    },
    {
        name: "Distortion Guitar",
        value: "distortion_guitar",
    },
    {
        name: "Guitar Harmonics",
        value: "guitar_harmonics",
    },
    {
        name: "Acoustic Bass",
        value: "acoustic_bass",
    },
    {
        name: "Electric Bass Finger",
        value: "electric_bass_finger",
    },
    {
        name: "Electric Bass Pick",
        value: "electric_bass_pick",
    },
    {
        name: "Fretless Bass",
        value: "fretless_bass",
    },
    {
        name: "Slap Bass 1",
        value: "slap_bass_1",
    },
    {
        name: "Slap Bass 2",
        value: "slap_bass_2",
    },
    {
        name: "Synth Bass 1",
        value: "synth_bass_1",
    },
    {
        name: "Synth Bass 2",
        value: "synth_bass_2",
    },
    {
        name: "Violin",
        value: "violin",
    },
    {
        name: "Viola",
        value: "viola",
    },
    {
        name: "Cello",
        value: "cello",
    },
    {
        name: "Contrabass",
        value: "contrabass",
    },
    {
        name: "Tremolo Strings",
        value: "tremolo_strings",
    },
    {
        name: "Pizzicato Strings",
        value: "pizzicato_strings",
    },
    {
        name: "Orchestral Harp",
        value: "orchestral_harp",
    },
    {
        name: "Timpani",
        value: "timpani",
    },
    {
        name: "String Ensemble 1",
        value: "string_ensemble_1",
    },
    {
        name: "String Ensemble 2",
        value: "string_ensemble_2",
    },
    {
        name: "Synth Strings 1",
        value: "synth_strings_1",
    },
    {
        name: "Synth Strings 2",
        value: "synth_strings_2",
    },
    {
        name: "Choir Aahs",
        value: "choir_aahs",
    },
    {
        name: "Voice Oohs",
        value: "voice_oohs",
    },
    {
        name: "Synth Choir",
        value: "synth_choir",
    },
    {
        name: "Orchestra Hit",
        value: "orchestra_hit",
    },
    {
        name: "Trumpet",
        value: "trumpet",
    },
    {
        name: "Trombone",
        value: "trombone",
    },
    {
        name: "Tuba",
        value: "tuba",
    },
    {
        name: "Muted Trumpet",
        value: "muted_trumpet",
    },
    {
        name: "French Horn",
        value: "french_horn",
    },
    {
        name: "Brass Section",
        value: "brass_section",
    },
    {
        name: "Synth Brass 1",
        value: "synth_brass_1",
    },
    {
        name: "Synth Brass 2",
        value: "synth_brass_2",
    },
    {
        name: "Soprano Sax",
        value: "soprano_sax",
    },
    {
        name: "Alto Sax",
        value: "alto_sax",
    },
    {
        name: "Tenor Sax",
        value: "tenor_sax",
    },
    {
        name: "Baritone Sax",
        value: "baritone_sax",
    },
    {
        name: "Oboe",
        value: "oboe",
    },
    {
        name: "English Horn",
        value: "english_horn",
    },
    {
        name: "Bassoon",
        value: "bassoon",
    },
    {
        name: "Clarinet",
        value: "clarinet",
    },
    {
        name: "Piccolo",
        value: "piccolo",
    },
    {
        name: "Flute",
        value: "flute",
    },
    {
        name: "Recorder",
        value: "recorder",
    },
    {
        name: "Pan Flute",
        value: "pan_flute",
    },
    {
        name: "Blown Bottle",
        value: "blown_bottle",
    },
    {
        name: "Shakuhachi",
        value: "shakuhachi",
    },
    {
        name: "Whistle",
        value: "whistle",
    },
    {
        name: "Ocarina",
        value: "ocarina",
    },
    {
        name: "Lead 1 (Square)",
        value: "lead_1_square",
    },
    {
        name: "Lead 2 (Sawtooth)",
        value: "lead_2_sawtooth",
    },
    {
        name: "Lead 3 (Calliope)",
        value: "lead_3_calliope",
    },
    {
        name: "Lead 4 (Chiff)",
        value: "lead_4_chiff",
    },
    {
        name: "Lead 5 (Charang)",
        value: "lead_5_charang",
    },
    {
        name: "Lead 6 (Voice)",
        value: "lead_6_voice",
    },
    {
        name: "Lead 7 (Fifths)",
        value: "lead_7_fifths",
    },
    {
        name: "Lead 8 (Bass + Lead)",
        value: "lead_8_bass__lead",
    },
    {
        name: "Pad 1 (New Age)",
        value: "pad_1_new_age",
    },
    {
        name: "Pad 2 (Warm)",
        value: "pad_2_warm",
    },
    {
        name: "Pad 3 (Polysynth)",
        value: "pad_3_polysynth",
    },
    {
        name: "Pad 4 (Choir)",
        value: "pad_4_choir",
    },
    {
        name: "Pad 5 (Bowed)",
        value: "pad_5_bowed",
    },
    {
        name: "Pad 6 (Metallic)",
        value: "pad_6_metallic",
    },
    {
        name: "Pad 7 (Halo)",
        value: "pad_7_halo",
    },
    {
        name: "Pad 8 (Sweep)",
        value: "pad_8_sweep",
    },
    {
        name: "FX 1 (Rain)",
        value: "fx_1_rain",
    },
    {
        name: "FX 2 (Soundtrack)",
        value: "fx_2_soundtrack",
    },
    {
        name: "FX 3 (Crystal)",
        value: "fx_3_crystal",
    },
    {
        name: "FX 4 (Atmosphere)",
        value: "fx_4_atmosphere",
    },
    {
        name: "FX 5 (Brightness)",
        value: "fx_5_brightness",
    },
    {
        name: "FX 6 (Goblins)",
        value: "fx_6_goblins",
    },
    {
        name: "FX 7 (Echoes)",
        value: "fx_7_echoes",
    },
    {
        name: "FX 8 (Sci-fi)",
        value: "fx_8_scifi",
    },
    {
        name: "Sitar",
        value: "sitar",
    },
    {
        name: "Banjo",
        value: "banjo",
    },
    {
        name: "Shamisen",
        value: "shamisen",
    },
    {
        name: "Koto",
        value: "koto",
    },
    {
        name: "Kalimba",
        value: "kalimba",
    },
    {
        name: "Bagpipe",
        value: "bagpipe",
    },
    {
        name: "Fiddle",
        value: "fiddle",
    },
    {
        name: "Shanai",
        value: "shanai",
    },
    {
        name: "Tinkle Bell",
        value: "tinkle_bell",
    },
    {
        name: "Agogo",
        value: "agogo",
    },
    {
        name: "Steel Drums",
        value: "steel_drums",
    },
    {
        name: "Woodblock",
        value: "woodblock",
    },
    {
        name: "Taiko Drum",
        value: "taiko_drum",
    },
    {
        name: "Melodic Tom",
        value: "melodic_tom",
    },
    {
        name: "Synth Drum",
        value: "synth_drum",
    },
    {
        name: "Reverse Cymbal",
        value: "reverse_cymbal",
    },
    {
        name: "Guitar Fret Noise",
        value: "guitar_fret_noise",
    },
    {
        name: "Breath Noise",
        value: "breath_noise",
    },
    {
        name: "Seashore",
        value: "seashore",
    },
    {
        name: "Bird Tweet",
        value: "bird_tweet",
    },
    {
        name: "Telephone Ring",
        value: "telephone_ring",
    },
    {
        name: "Helicopter",
        value: "helicopter",
    },
    {
        name: "Applause",
        value: "applause",
    },
    {
        name: "Gunshot",
        value: "gunshot",
    },
];
