import React from 'react';
import * as Tone from 'tone';

function App() {
  const playSynth = () => {
    const synth = new Tone.Synth().toDestination();
    // Trigger a middle 'C' for half a second
    synth.triggerAttackRelease("C4", "0.5");
  };

  return (
      <div>
        <h1>Online Sequencer</h1>
        <button onClick={playSynth}>Play Note</button>
      </div>
  );
}

export default App;
