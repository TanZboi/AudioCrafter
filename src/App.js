// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import Header from './components/Header';
import SequencerGrid from './components/SequencerGrid';
import TransportControls from './components/TransportControls';
import TrackSelector from './components/TrackSelector';
import AddTrackModal from './components/AddTrackModal';
import InstrumentEditor from './components/InstrumentEditor';
import WamInstrument from './components/WamInstrument';

function App() {
    // ----- Global Sequencer Settings -----
    const numberOfRows = 48; // 4 octaves (48 semitones)
    const initialPieces = 6; // 6 timeline pieces initially
    const initialPieceCols = initialPieces * 8; // 48 columns initially

    // Generate note names descending from C6 (top) to lower pitches.
    const startNote = "C6";
    const noteMapping = [];
    for (let i = 0; i < numberOfRows; i++) {
        noteMapping.push(Tone.Frequency(startNote).transpose(-i).toNote());
    }

    // Create a default sequence for a track: 48 rows x initialPieceCols columns of zeros.
    // 0 = off, 1 = note start, 2 = sustain.
    const defaultSequence = Array.from({ length: numberOfRows }, () =>
        Array(initialPieceCols).fill(0)
    );
    // Helper to deep-clone the default sequence.
    const cloneSequence = () => JSON.parse(JSON.stringify(defaultSequence));

    // ----- BPM State -----
    const [bpm, setBpm] = useState(120);
    useEffect(() => {
        Tone.Transport.bpm.value = bpm;
    }, [bpm]);

    // ----- Instrument & Track Management -----
    const instruments = [
        { id: 'synth', name: 'Synth', color: '#27ae60', settings: { volume: 0.8, attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.2 } },
        { id: 'toneSynth', name: 'Tone Synth', color: '#00aced', settings: { volume: 0.8, attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.2 } },
        { id: 'drums', name: 'Drums', color: '#e74c3c', settings: { volume: 0.8, attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.1 } },
        { id: 'piano', name: 'Piano', color: '#f1c40f', settings: { volume: 0.8, attack: 0.2, decay: 0.3, sustain: 0.6, release: 0.3 } },
        { id: 'bass', name: 'Bass', color: '#9b59b6', settings: { volume: 0.8, attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.4 } }
    ];

    // Each track gets its own independent sequence.
    const [tracks, setTracks] = useState([
        { id: 1, name: 'Track 1', instrument: instruments[0], noteType: instruments[0].id, sequence: cloneSequence() }
    ]);
    const [selectedTrack, setSelectedTrack] = useState(1);
    const [showAddTrackModal, setShowAddTrackModal] = useState(false);

    // Convenience: the currently selected track.
    const currentTrack = tracks.find(track => track.id === selectedTrack);

    // ----- Global Timeline Synchronization -----
    // Global timeline length is the maximum length among all tracks.
    const globalTimelineLength =
        tracks.length > 0 ? Math.max(...tracks.map(track => track.sequence[0].length)) : 0;
    // Ensure every track's sequence is padded to the global timeline length.
    useEffect(() => {
        setTracks(prevTracks =>
            prevTracks.map(track => {
                const currentLength = track.sequence[0].length;
                if (currentLength < globalTimelineLength) {
                    return {
                        ...track,
                        sequence: track.sequence.map(row => [...row, ...new Array(globalTimelineLength - currentLength).fill(0)])
                    };
                }
                return track;
            })
        );
    }, [globalTimelineLength]);

    // ----- Track Addition -----
    const addTrack = (instrument) => {
        const newId = tracks.length ? tracks[tracks.length - 1].id + 1 : 1;
        const newSequence = Array.from({ length: numberOfRows }, () =>
            Array(globalTimelineLength).fill(0)
        );
        setTracks([...tracks, { id: newId, name: `Track ${newId}`, instrument, noteType: instrument.id, sequence: newSequence }]);
        setSelectedTrack(newId);
        setShowAddTrackModal(false);
    };
    const handleAddTrack = () => {
        setShowAddTrackModal(true);
    };

    // ----- Global Timeline Extension Based on Last Piece -----
    // If any track has a note in its last 8 columns, extend all tracks.
    useEffect(() => {
        if (tracks.length === 0) return;
        const currentLength = tracks[0].sequence[0].length;
        const lastPieceStart = currentLength - 8;
        let shouldExtend = false;
        tracks.forEach(track => {
            track.sequence.forEach(row => {
                for (let c = lastPieceStart; c < currentLength; c++) {
                    if (row[c] !== 0) {
                        shouldExtend = true;
                        return;
                    }
                }
            });
        });
        if (shouldExtend) {
            setTracks(prevTracks =>
                prevTracks.map(track => ({
                    ...track,
                    sequence: track.sequence.map(row => [...row, ...new Array(8).fill(0)])
                }))
            );
        }
    }, [tracks]);

    // ----- Global Playback Loop for All Tracks -----
    const [currentStep, setCurrentStep] = useState(0);
    const stepCounterRef = useRef(0);
    // We'll store a synth per track.
    const synthsRef = useRef({});

    // Create synths for each track if they don't already exist.
    useEffect(() => {
        tracks.forEach(track => {
            if (!synthsRef.current[track.id]) {
                if (track.noteType === 'toneSynth') {
                    synthsRef.current[track.id] = new Tone.Synth().toDestination();
                } else {
                    synthsRef.current[track.id] = new Tone.PolySynth(Tone.Synth).toDestination();
                }
            }
        });
    }, [tracks]);

    // Global playback loop iterating over the global timeline length.
    useEffect(() => {
        Tone.Transport.bpm.value = bpm;
        const loop = new Tone.Loop((time) => {
            const stepIndex = stepCounterRef.current;
            setCurrentStep(stepIndex);
            tracks.forEach(track => {
                const seq = track.sequence;
                if (stepIndex < seq[0].length) {
                    seq.forEach((row, rowIndex) => {
                        if (row[stepIndex] === 1) {
                            if (synthsRef.current[track.id]) {
                                synthsRef.current[track.id].triggerAttackRelease(noteMapping[rowIndex], "8n", time);
                            }
                        }
                    });
                }
            });
            let nextStep = stepIndex + 1;
            if (tracks.length > 0 && nextStep >= globalTimelineLength) {
                nextStep = 0;
            }
            stepCounterRef.current = nextStep;
        }, "4n").start(0);
        return () => loop.dispose();
    }, [tracks, noteMapping, bpm, globalTimelineLength]);

    // ----- Drag & Sustain Functions for a Specific Track -----
    const [draggingNote, setDraggingNote] = useState(null);
    const updateNoteForTrack = (trackId, rowIndex, startCol, endCol) => {
        setTracks(prevTracks =>
            prevTracks.map(track => {
                if (track.id === trackId) {
                    const newSeq = track.sequence.map((row, rIdx) => {
                        if (rIdx === rowIndex) {
                            return row.map((cell, cIdx) => {
                                if (cIdx === startCol) return 1;
                                if (cIdx > startCol && cIdx <= endCol) return 2;
                                return cell;
                            });
                        }
                        return row;
                    });
                    return { ...track, sequence: newSeq };
                }
                return track;
            })
        );
    };

    const deleteNoteForTrack = (trackId, rowIndex, startCol, endCol) => {
        setTracks(prevTracks =>
            prevTracks.map(track => {
                if (track.id === trackId) {
                    const newSeq = track.sequence.map((row, rIdx) => {
                        if (rIdx === rowIndex) {
                            return row.map((cell, cIdx) => (cIdx >= startCol && cIdx <= endCol ? 0 : cell));
                        }
                        return row;
                    });
                    return { ...track, sequence: newSeq };
                }
                return track;
            })
        );
    };

    // Convenience functions for the current track.
    const updateNoteCurrent = (rowIndex, startCol, endCol) => {
        if (!currentTrack) return;
        updateNoteForTrack(currentTrack.id, rowIndex, startCol, endCol);
    };

    const deleteNoteCurrent = (rowIndex, startCol, endCol) => {
        if (!currentTrack) return;
        deleteNoteForTrack(currentTrack.id, rowIndex, startCol, endCol);
    };

    // ----- Transport Controls Functions -----
    const startTransport = async () => {
        await Tone.start();
        Tone.Transport.start();
    };
    const stopTransport = () => {
        Tone.Transport.stop();
    };

    // ----- Instrument Editor: update instrument settings for a track -----
    const updateTrackInstrument = (trackId, newSettings) => {
        setTracks(prevTracks =>
            prevTracks.map(track =>
                track.id === trackId
                    ? { ...track, instrument: { ...track.instrument, settings: newSettings } }
                    : track
            )
        );
    };

    const currentTrackData = currentTrack;

    const [instrumentInstances, setInstrumentInstances] = useState({});
    
    // ----- Render -----
    return (
        <div style={{
            display: 'flex',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#0d1b2a',
            color: 'white'
        }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <TransportControls
                    startTransport={startTransport}
                    stopTransport={stopTransport}
                    bpm={bpm}
                    setBpm={setBpm}
                    metronomeEnabled={false}
                    setMetronomeEnabled={() => {}}
                    instruments={instruments}
                    selectedInstrument={currentTrack ? currentTrack.instrument : instruments[0]}
                    setSelectedInstrument={() => {}}
                />
                {/* Sequencer Area: Overlay all tracks in a single relative container */}
                <div style={{
                    flex: 1,
                    overflow: 'auto',
                    border: '1px solid #34495e',
                    padding: '5px',
                    margin: '5px',
                    position: 'relative',
                    height: '100%'
                }}>
                    {tracks.map(track => {
                        const isEditable = track.id === selectedTrack;
                        return (
                            <div key={track.id} style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                pointerEvents: isEditable ? 'auto' : 'none',
                                opacity: isEditable ? 1 : 0.3,
                                zIndex: isEditable ? 2 : 1
                            }}>
                                <SequencerGrid
                                    sequence={track.sequence}
                                    noteMapping={noteMapping}
                                    totalCols={track.sequence[0].length}
                                    currentStep={currentStep}
                                    updateNote={isEditable ? ((rowIndex, start, end) => updateNoteForTrack(track.id, rowIndex, start, end)) : () => {}}
                                    deleteNote={isEditable ? ((rowIndex, start, end) => deleteNoteForTrack(track.id, rowIndex, start, end)) : () => {}}
                                    draggingNote={isEditable ? draggingNote : null}
                                    setDraggingNote={isEditable ? setDraggingNote : () => {}}
                                    currentTrack={track}
                                    showMarker={isEditable}  // Only show marker for editable track.
                                    editable={isEditable}
                                />
                            </div>
                        );
                    })}
                </div>
                <InstrumentEditor
                    track={currentTrackData}
                    updateTrackInstrument={updateTrackInstrument}
                />
            </div>
            <TrackSelector
                tracks={tracks}
                selectedTrack={selectedTrack}
                setSelectedTrack={setSelectedTrack}
                onAddTrack={handleAddTrack}
            />
            {showAddTrackModal && (
                <AddTrackModal
                    instruments={instruments}
                    onSelect={(inst) => addTrack(inst)}
                    onClose={() => setShowAddTrackModal(false)}
                />
            )}
        </div>
    );
}

export default App;
