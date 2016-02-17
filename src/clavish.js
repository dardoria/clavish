import { MidiController } from "./midi";
import * as volcaKeys from "./volca_keys";


//TODO this is as an example only
const midiController = new MidiController(
  () => {
    console.log(midiController.outputs);
  }
);
