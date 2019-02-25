import { Injectable } from '@angular/core';
import { NLM } from './midi-controller';

@Injectable({
  providedIn: 'root'
})
export class MidiService {
  static controller: NLM;
  constructor() {
    MidiService.controller = new NLM();
    function midiInit(midi) {
      var inputs = midi.inputs.values();
      for (var input = inputs.next();
        input && !input.done;
        input = inputs.next()) {
        if (input.value.name.startsWith('Launchpad Mini')) {
          // each time there is a midi message call the onMIDIMessage function
          input.value.onmidimessage = (message)=>{MidiService.controller.incomingData(message)};
          break;
        }
      }
  
      var outputs = midi.outputs.values();
      for (var output = outputs.next();
        output && !output.done;
        output = outputs.next()) {
        if (output.value.name.startsWith('Launchpad Mini')) {
          // each time there is a midi message call the onMIDIMessage function
          console.log('Found output midi');
          MidiService.controller.sendToDevice = function (data) {
            output.value.send(data);
          }
          MidiService.controller.drawPage();
          break;
        }
      }
  
    };
  
    function midiFailure() {
      console.log('Error initializing MIDI');
    }

    if (navigator.requestMIDIAccess) {
      console.log('Browser supports MIDI!');
      navigator.requestMIDIAccess().then(
        midiInit, midiFailure
      );
    }

  }

  getController(){
    return MidiService.controller;
  }

}
