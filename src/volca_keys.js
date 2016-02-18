import { MidiSpec, OutputDevice } from "./midi";

const voices = {
  poly: 0x00,
  unison: 0x0D,
  octave: 0x26,
  fifth: 0x3F,
  unisonRing: 0x58,
  polyRing: 0x71
};

const octaves = {
  32: 0x00,
  16: 0x16,
  8: 0x2C,
  4: 0x42,
  2: 0x58,
  1: 0x6E
};


const volcaKeysMessageTypes = {
  0x80: 'noteOff',
  0x90: 'noteOn',
  0xB0: 'controlChange',
  0xE0: 'pitchBend',
  0xF2: 'songPosition',
  0xF8: 'clock',
  0xFA: 'start',
  0xFB: 'continue',
  0xFC: 'stop',
  0xFE: 'activeSensing'
}

const volcaKeysControls = {
  0x05: 'portamentoTime',
  0x0B: 'expression',
  0x28: 'voice',
  0x29: 'octave',
  0x2A: 'detune',
  0x2B: 'vcoEgInt',
  0x2C: 'cutoff',
  0x2D: 'vcfEgInt',
  0x2E: 'lfoRate',
  0x2F: 'lfoPitchInt',
  0x30: 'lfoCutoffInt',
  0x31: 'egAttack',
  0x32: 'egDecay',
  0x33: 'egSustain',
  0x34: 'delayTime',
  0x35: 'delayFeedback'
}

export class VolcaKeys extends OutputDevice {
  constructor(input, midiSpec=null) {
    super(input, new MidiSpec(volcaKeysMessageTypes, volcaKeysControls));
  }
}
