'use strict';

const defaultMessageTypes = {
  //channel voice messages
  0x80: 'noteOff',
  0x90: 'noteOn',
  0xA0: 'keyPressureAftertouch',
  0xB0: 'controlChange',
  0xC0: 'programChange',
  0xD0: 'channelPressureAftertouch',
  0xE0: 'pitchBend',
  //system messages
  0xF1: 'timeCodeQuarterFrame',
  0xF2: 'songPosition',
  0xF3: 'songSelect',
  0xF6: 'tuneReqeust',
  0xF7: 'eox',
  0xF8: 'clock',
  0xFA: 'start',
  0xFB: 'continue',
  0xFC: 'stop',
  0xFE: 'activeSensing',
  0xFF: 'systemReset'
};

const defaultControls = {
  //TODO there are a few more
  0x00: 'bankSelect',
  0x01: 'modulationWheel',
  0x02: 'breath',
  0x04: 'foot',
  0x05: 'portamentoTime',
  0x07: 'channelVolume',
  0x08: 'balance',
  0x0A: 'pan',
  0x0B: 'expression',
  0x0C: 'effect1',
  0x0D: 'effect2',
  0x40: 'sustain',
  0x41: 'portamentoSwitch',
  0x42: 'sostenuto',
  0x43: 'softPedal',
  0x44: 'legatoFootswitch',
  0x45: 'hold2',
  0x46: 'sound1',
  0x47: 'sound2',
  0x48: 'sound3',
  0x49: 'sound4',
  0x4A: 'sound5',
  0x4B: 'sound6',
  0x4C: 'sound7',
  0x4D: 'sound8',
  0x4E: 'sound9',
  0x4F: 'sound10',
  0x54: 'portamentoControl',
  0x5B: 'effect1Depth',
  0x5C: 'effect2Depth',
  0x5D: 'effect3Depth',
  0x5E: 'effect4Depth',
  0x5F: 'effect5Depth',
  0x60: 'dataIncrement',
  0x61: 'dataDecrement'
};

export class MidiSpec {
  constructor(messageTypes=defaultMessageTypes, controls=defaultControls) {
    this._inputMessageTypes = messageTypes;
    this._inputControls = controls;

    this._outputMessageTypes = {};
    for (let [key, value] of Object.entries(messageTypes)) {
      this.outputMessageTypes[value] = key;
    }

    this._outputControls = {};
    for (let [key, value] of Object.entries(messageTypes)) {
      this.outputControls[value] = key;
    }
  }

  get inputMessageTypes() {
    return this._inputMessageTypes;
  }

  get inputControls() {
    return this._inputControls;
  }

  get outputMessageTypes() {
    return this._outputMessageTypes;
  }

  get outputControls() {
    return this._outputControls;
  }
}

export class MidiOutputMessage {
  constructor(midiSpec, messageType, channel, data1, data2, timestamp=null) {
    this.midiSpec = midiSpec;
    this.messageType = messageType;
    this.channel = channel;
    this.status = null; //TODO construct status
    this.data1 = data1;
    this.data2 = data2;
    this.timestamp = timestamp;
  }
}

export class MidiInputMessage {
  constructor(data, midiSpec) {
    this.midiSpec = midiSpec;

    this.status = data[0];
    this.data1 = data[1]; //todo check range
    this.data2 = data[2]; //todo check range

    let typeIndex = this.status & 0xF0;

    if (typeIndex === 0xB0) {
      // control message - set subtype
      this.messageType = this.midiSpec.inputControls[this.data1];
    } else if (typeIndex === 0x90 && this.data2 === 0) {
      // noteOn with 0 velocity - set as noteOff
      this.messageType = this.midiSpec.inputMessageTypes[0x80];
    } else {
      this.messageType = this.midiSpec.inputMessageTypes[typeIndex];
    }

    if (typeIndex < 0xF0) {
      this.channel = this.status & 0x0F;
    }
  }
}

export class MidiController {
  constructor(onInit, onError) {
    if (typeof navigator.requestMIDIAccess == "undefined") {
      throw "MIDI not supported by browser.";
    }

    navigator.requestMIDIAccess()
      .then((midiAccess) => {
        this.midiAccess = midiAccess;
      })
      .then(() => {
        if (onInit) {
          onInit();
        }
      })
      .catch(error => {
        if (onError) {
          onError(error);
        }
      });
  }

  get inputs() {
    return this.midiAccess.inputs;
  }

  get outputs () {
    return this.midiAccess.outputs;
  }
}

export class MidiDevice {
  constructor(port, midiSpec) {
    this.port = port;
    this.midiSpec = midiSpec;
  }

  get name() {
    return `${this.port.manufacturer} ${this.port.name}`;

  }
}

export class InputDevice extends MidiDevice {
  constructor(input, midiSpec=new MidiSpec()) {
    super(input, midiSpec);
    this.port.onmidimessage = this.onMessage.bind(this);
  }

  onMessage(event) {
    console.log(new MidiInputMessage(event.data, this.midiSpec));
  }
}

export class OutputDevice extends MidiDevice {
  constructor(output, midiSpec=new MidiSpec()) {
    super(output, midiSpec);
  }

  sendMessage(channel=0, status, data1=0x00, data2=0x00, timestamp=null) {
    const newStatus = status < 0xF0 ? status | channel : status;
    this.port.send([newStatus, data1, data2], timestamp);
  }

  clear() {
    this.port.clear();
  }
}
