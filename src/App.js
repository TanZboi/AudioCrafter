// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import Header from './components/Header';
import SequencerGrid from './components/SequencerGrid';
import TransportControls from './components/TransportControls';

function App() {
    const numberOfRows = 48; // 4 octaves (48 semitones)
    const initialPieceCols = 8; // one piece is 8 columns

    // Generate 48 note names descending from a starting note (C6 at the top)
    const startNote = "C6";
    const noteMapping = [];
    for (let i = 0; i < numberOfRows; i++) {
        noteMapping.push(Tone.Frequency(startNote).transpose(-i).toNote());
    }

    // Create the initial sequence: 48 rows x initialPieceCols columns (all false)
    const initialSequence = Array.from({ length: numberOfRows }, () =>
        Array(initialPieceCols).fill(false)
    );
    const [sequence, setSequence] = useState(initialSequence);
    const [currentStep, setCurrentStep] = useState(0);
    const totalCols = sequence[0].length;

    // Track grid extension (each piece = 8 columns)
    const lastExtendedPieceRef = useRef(totalCols / 8);

    // BPM state (each column is one beat)
    const [bpm, setBpm] = useState(120);
    useEffect(() => {
        Tone.Transport.bpm.value = bpm;
    }, [bpm]);

    // New state for metronome toggle
    const [metronomeEnabled, setMetronomeEnabled] = useState(false);
    // Create a ref so our loop callback always sees the latest metronome state without re-creating the loop.
    const metronomeEnabledRef = useRef(metronomeEnabled);
    useEffect(() => {
        metronomeEnabledRef.current = metronomeEnabled;
    }, [metronomeEnabled]);

    // Extend the grid if any cell in the last piece (rightmost 8 columns) is active.
    useEffect(() => {
        const currentTotalCols = sequence[0].length;
        const lastPieceStart = currentTotalCols - 8;
        let shouldExtend = false;
        for (let r = 0; r < sequence.length; r++) {
            for (let c = lastPieceStart; c < currentTotalCols; c++) {
                if (sequence[r][c] === true) {
                    shouldExtend = true;
                    break;
                }
            }
            if (shouldExtend) break;
        }
        const totalPieces = currentTotalCols / 8;
        if (shouldExtend && lastExtendedPieceRef.current === totalPieces) {
            setSequence(prevSequence =>
                prevSequence.map(row => [...row, ...new Array(8).fill(false)])
            );
            lastExtendedPieceRef.current = totalPieces + 1;
        }
    }, [sequence]);

    const synthRef = useRef(null);
    const metronomeSynthRef = useRef(null);
    // Use a linear step counter for the playback loop.
    const stepCounterRef = useRef(0);

    useEffect(() => {
        synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
        // Create a metronome synth (using a MembraneSynth for a short, percussive tick)
        metronomeSynthRef.current = new Tone.MembraneSynth().toDestination();
        Tone.Transport.bpm.value = bpm;
        // Set the loop interval to "4n" so each column equals one beat.
        const loop = new Tone.Loop((time) => {
            const stepIndex = stepCounterRef.current;
            setCurrentStep(stepIndex);
            if (stepIndex < sequence[0].length) {
                sequence.forEach((row, rowIndex) => {
                    if (row[stepIndex]) {
                        synthRef.current.triggerAttackRelease(noteMapping[rowIndex], "8n", time);
                    }
                });
            }
            // Trigger metronome tick if enabled.
            if (metronomeEnabledRef.current) {
                metronomeSynthRef.current.triggerAttackRelease("C2", "8n", time);
            }
            let nextStep = stepIndex + 1;
            if (nextStep >= sequence[0].length) {
                nextStep = 0;
            }
            stepCounterRef.current = nextStep;
        }, "4n").start(0);

        return () => loop.dispose();
    }, [noteMapping, sequence, bpm]);

    // When a cell is toggled, if it's being turned on, play its note immediately.
    const toggleStep = (rowIndex, colIndex) => {
        setSequence(prevSequence => {
            const wasActive = prevSequence[rowIndex][colIndex];
            const newSequence = prevSequence.map((row, rIdx) => {
                if (rIdx === rowIndex) {
                    return row.map((cell, cIdx) => (cIdx === colIndex ? !cell : cell));
                }
                return row;
            });
            if (!wasActive && synthRef.current) {
                synthRef.current.triggerAttackRelease(noteMapping[rowIndex], "8n", Tone.now());
            }
            return newSequence;
        });
    };

    const startTransport = async () => {
        await Tone.start();
        Tone.Transport.start();
    };

    const stopTransport = () => {
        Tone.Transport.stop();
    };

    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#0d1b2a",
            color: "white",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column"
        }}>
            <Header />
            <TransportControls
                startTransport={startTransport}
                stopTransport={stopTransport}
                bpm={bpm}
                setBpm={setBpm}
                metronomeEnabled={metronomeEnabled}
                setMetronomeEnabled={setMetronomeEnabled}
            />
            <div style={{
                flex: 1,
                overflow: "auto",
                border: "1px solid #34495e",
                padding: "5px",
                margin: "5px"
            }}>
                <SequencerGrid
                    sequence={sequence}
                    noteMapping={noteMapping}
                    totalCols={totalCols}
                    currentStep={currentStep}
                    toggleStep={toggleStep}
                />
            </div>
        </div>
    );
}

export default App;
