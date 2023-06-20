declare module 'audiobuffer-to-wav' {
    export default function toWav(buffer: AudioBuffer, mono?: boolean): ArrayBuffer;
}