import { MidiSpec, InputDevice } from "./midi"

const keyRigMessageTypes = {
  0x80: 'noteOff',
  0x90: 'noteOn',
  0xB0: 'controlChange',
  0xE0: 'pitchBend'
}

const keyRigControls = {
  0x01: 'modulationWheel',
  0x07: 'channelVolume'
}

export class KeyRigFourtyNine extends InputDevice {
  constructor(input, midiSpec=null) {
    super(input, new MidiSpec(keyRigMessageTypes, keyRigControls));
  }
}
