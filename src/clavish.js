import "babel-polyfill";
import { MidiController } from "./midi";
import { VolcaKeys } from "./volca_keys";
import { KeyRigFourtyNine } from "./key_rig_49";


//TODO this is as an example only
var keyRig;
const midiController = new MidiController(
  () => {
    for (var entry of midiController.inputs.values()) {
      keyRig = new KeyRigFourtyNine(entry);
      console.log(keyRig);
    }
  }
);
