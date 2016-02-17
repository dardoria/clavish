'use strict';


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
  contructor(midiInput, midiOutput) {
    this.input = midiInput;
    //todo register onMessage
    this.output = midiOutput;
  }

  onMessage(event) {}

  sendMessage(data, timestamp=null) {
    this.output.send(data, timestamp);
  }

  clear() {
    this.output.clear();
  }
}
