import { useContext } from "react";
import { InstrumentContext } from "../../utils/context";

export const InstrumentOptions = () => {
    const { instrument, setInstrument } = useContext(InstrumentContext);
    const handleInstrumentChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setInstrument(e.target.value);
    };
    return (
        <div>
            <select
                className="rounded-sm"
                onChange={handleInstrumentChange}
                value={instrument}
            >
                <option value="acoustic_grand_piano">
                    Acoustic Grand Piano
                </option>
                <option value="bright_acoustic_piano">
                    Bright Acoustic Piano
                </option>
                <option value="electric_grand_piano">
                    Electric Grand Piano
                </option>
                <option value="honkytonk_piano">Honkytonk Piano</option>
                <option value="electric_piano_1">Electric Piano 1</option>
                <option value="electric_piano_2">Electric Piano 2</option>
                <option value="harpsichord">Harpsichord</option>
                <option value="clavinet">Clavinet</option>

                <option value="celesta">Celesta</option>
                <option value="glockenspiel">Glockenspiel</option>
                <option value="music_box">Music Box</option>
                <option value="vibraphone">Vibraphone</option>
                <option value="marimba">Marimba</option>
                <option value="xylophone">Xylophone</option>
                <option value="tubular_bells">Tubular Bells</option>
                <option value="dulcimer">Dulcimer</option>

                <option value="drawbar_organ">Drawbar Organ</option>
                <option value="percussive_organ">Percussive Organ</option>
                <option value="rock_organ">Rock Organ</option>
                <option value="church_organ">Church Organ</option>
                <option value="reed_organ">Reed Organ</option>
                <option value="accordion">Accordion</option>
                <option value="harmonica">Harmonica</option>
                <option value="tango_accordion">Tango Accordion</option>

                <option value="acoustic_guitar_nylon">
                    Acoustic Guitar Nylon
                </option>
                <option value="acoustic_guitar_steel">
                    Acoustic Guitar Steel
                </option>
                <option value="electric_guitar_jazz">
                    Electric Guitar Jazz
                </option>
                <option value="electric_guitar_clean">
                    Electric Guitar Clean
                </option>
                <option value="electric_guitar_muted">
                    Electric Guitar Muted
                </option>
                <option value="overdriven_guitar">Overdriven Guitar</option>
                <option value="distortion_guitar">Distortion Guitar</option>
                <option value="guitar_harmonics">Guitar Harmonics</option>

                <option value="acoustic_bass">Acoustic Bass</option>
                <option value="electric_bass_finger">
                    Electric Bass Finger
                </option>
                <option value="electric_bass_pick">Electric Bass Pick</option>
                <option value="fretless_bass">Fretless Bass</option>
                <option value="slap_bass_1">Slap Bass 1</option>
                <option value="slap_bass_2">Slap Bass 2</option>
                <option value="synth_bass_1">Synth Bass 1</option>
                <option value="synth_bass_2">Synth Bass 2</option>

                <option value="violin">Violin</option>
                <option value="viola">Viola</option>
                <option value="cello">Cello</option>
                <option value="contrabass">Contrabass</option>
                <option value="tremolo_strings">Tremolo Strings</option>
                <option value="pizzicato_strings">Pizzicato Strings</option>
                <option value="orchestral_harp">Orchestral Harp</option>
                <option value="timpani">Timpani</option>

                <option value="string_ensemble_1">String Ensemble 1</option>
                <option value="string_ensemble_2">String Ensemble 2</option>
                <option value="synth_strings_1">Synth Strings 1</option>
                <option value="synth_strings_2">Synth Strings 2</option>
                <option value="choir_aahs">Choir Aahs</option>
                <option value="voice_oohs">Voice Oohs</option>
                <option value="synth_choir">Synth Choir</option>
                <option value="orchestra_hit">Orchestra Hit</option>

                <option value="trumpet">Trumpet</option>
                <option value="trombone">Trombone</option>
                <option value="tuba">Tuba</option>
                <option value="muted_trumpet">Muted Trumpet</option>
                <option value="french_horn">French Horn</option>
                <option value="brass_section">Brass Section</option>
                <option value="synth_brass_1">Synth Brass 1</option>
                <option value="synth_brass_2">Synth Brass 2</option>

                <option value="soprano_sax">Soprano Sax</option>
                <option value="alto_sax">Alto Sax</option>
                <option value="tenor_sax">Tenor Sax</option>
                <option value="baritone_sax">Baritone Sax</option>
                <option value="oboe">Oboe</option>
                <option value="english_horn">English Horn</option>
                <option value="bassoon">Bassoon</option>
                <option value="clarinet">Clarinet</option>

                <option value="piccolo">Piccolo</option>
                <option value="flute">Flute</option>
                <option value="recorder">Recorder</option>
                <option value="pan_flute">Pan Flute</option>
                <option value="blown_bottle">Blown Bottle</option>
                <option value="shakuhachi">Shakuhachi</option>
                <option value="whistle">Whistle</option>
                <option value="ocarina">Ocarina</option>

                <option value="lead_1_square">Lead 1 (Square)</option>
                <option value="lead_2_sawtooth">Lead 2 (Sawtooth)</option>
                <option value="lead_3_calliope">Lead 3 (Calliope)</option>
                <option value="lead_4_chiff">Lead 4 (Chiff)</option>
                <option value="lead_5_charang">Lead 5 (Charang)</option>
                <option value="lead_6_voice">Lead 6 (Voice)</option>
                <option value="lead_7_fifths">Lead 7 (Fifths)</option>
                <option value="lead_8_bass__lead">Lead 8 (Bass + Lead)</option>

                <option value="pad_1_new_age">Pad 1 (New Age)</option>
                <option value="pad_2_warm">Pad 2 (Warm)</option>
                <option value="pad_3_polysynth">Pad 3 (Polysynth)</option>
                <option value="pad_4_choir">Pad 4 (Choir)</option>
                <option value="pad_5_bowed">Pad 5 (Bowed)</option>
                <option value="pad_6_metallic">Pad 6 (Metallic)</option>
                <option value="pad_7_halo">Pad 7 (Halo)</option>
                <option value="pad_8_sweep">Pad 8 (Sweep)</option>

                <option value="fx_1_rain">FX 1 (Rain)</option>
                <option value="fx_2_soundtrack">FX 2 (Soundtrack)</option>
                <option value="fx_3_crystal">FX 3 (Crystal)</option>
                <option value="fx_4_atmosphere">FX 4 (Atmosphere)</option>
                <option value="fx_5_brightness">FX 5 (Brightness)</option>
                <option value="fx_6_goblins">FX 6 (Goblins)</option>
                <option value="fx_7_echoes">FX 7 (Echoes)</option>
                <option value="fx_8_scifi">FX 8 (Sci-fi)</option>

                <option value="sitar">Sitar</option>
                <option value="banjo">Banjo</option>
                <option value="shamisen">Shamisen</option>
                <option value="koto">Koto</option>
                <option value="kalimba">Kalimba</option>
                <option value="bagpipe">Bagpipe</option>
                <option value="fiddle">Fiddle</option>
                <option value="shanai">Shanai</option>

                <option value="tinkle_bell">Tinkle Bell</option>
                <option value="agogo">Agogo</option>
                <option value="steel_drums">Steel Drums</option>
                <option value="woodblock">Woodblock</option>
                <option value="taiko_drum">Taiko Drum</option>
                <option value="melodic_tom">Melodic Tom</option>
                <option value="synth_drum">Synth Drum</option>
                <option value="reverse_cymbal">Reverse Cymbal</option>

                <option value="guitar_fret_noise">Guitar Fret Noise</option>
                <option value="breath_noise">Breath Noise</option>
                <option value="seashore">Seashore</option>
                <option value="bird_tweet">Bird Tweet</option>
                <option value="telephone_ring">Telephone Ring</option>
                <option value="helicopter">Helicopter</option>
                <option value="applause">Applause</option>
                <option value="gunshot">Gunshot</option>
            </select>
        </div>
    );
};
