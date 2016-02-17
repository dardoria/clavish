import { MidiDevice } from "./midi";

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

export class VolcaKeys extends MidiDevice {

  noteOff(channel, pitch, velocity = 0x00) {
    this.validateRange(channel, 0x00, 0x0F);
    this.validateRange(velocity, 0x00, 0x7F);
    const status = velocity === 0x00 ? 0x09 : 0x08;
    this.sendChannelMessage(channel, status, pitch, velocity);
  }

  noteOn(channel, pitch, velocity) {
    this.validateRange(channel, 0x00, 0x0F);
    this.validateRange(velocity, 0x01, 0x7F);
    this.sendChannelMessage(channel, 0x09, pitch, velocity);
  }

  portamento(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x09, 0x05, value);
  }

  expression(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x0B, value);
  }

  voice(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.validateValueIn(value, voices);
    this.sendChannelMessage(channel, 0x0B, 0x28, value);
  }

  octave(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.validateValueIn(value, octaves);
    this.sendChannelMessage(channel, 0x0B, 0x29, value);
  }

  detune(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x2A, value);
  }

  vcoEgInt(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x2B, value);
  }

  cutoff(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x2C, value);
  }

  vcfEgInt(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x2D, value);
  }

  lfoRate(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x2E, value);
  }

  lfoPitchInt(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x2F, value);
  }

  lfoCutoffInt(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x30, value);
  }

  egAttack(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x31, value);
  }

  egDecay(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x32, value);
  }

  egSustain(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x33, value);
  }

  delayTime(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x34, value);
  }

  delayFeedback(channel, value) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0B, 0x35, value);
  }

  pitchBend(channel, low, high) {
    this.validateRange(channel, 0x00, 0x0F);
    this.sendChannelMessage(channel, 0x0E, low, high);
  }

  songPosition(step) {
    this.validateRange(step, 0, 15);
    this.sendMessage(0xF2, 0x00, step);
  }

  clockTime() {
    this.sendMessage(0xF8, null, null);
  }

  clockStart() {
    this.sendMessage(0xFA, null, null);
  }

  clockContinue() {
    this.sendMessage(0xFB, null, null);
  }

  clockStop() {
    this.sendMessage(0xFC, null, null);
  }

  activeSensing() {
    this.sendMessage(0xFE, null, null);
  }

  validateRange(value, min, max) {
    if (value < min || value > max) {
      throw "Value outside of range.";
    }
  }

  validateValueIn(value, obj) {
    if (!value in obj) {
      throw "Invalid value.";
    }
  }

  sendChannelMessage(channel, status, data1, data2) {
    const newStatus = status << 4 | channel;
    this.sendMessage([newStatus, data1, data2]);
  }
}
