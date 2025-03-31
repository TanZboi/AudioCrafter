// src/components/TrackSelector.jsx
import React from 'react';

const TrackSelector = ({ tracks, selectedTrack, setSelectedTrack, onAddTrack }) => {
    return (
        <div
            style={{
                width: '200px',
                backgroundColor: '#1c2b36',
                padding: '10px',
                boxSizing: 'border-box',
                borderLeft: '1px solid #34495e',
                height: '100vh',
                overflowY: 'auto'
            }}
        >
            <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>Tracks</h3>
            <div>
                {tracks.map((track) => (
                    <div
                        key={track.id}
                        onClick={() => setSelectedTrack(track.id)}
                        style={{
                            padding: '8px',
                            marginBottom: '5px',
                            backgroundColor:
                                track.id === selectedTrack ? '#2c3e50' : '#1c2b36',
                            color: 'white',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                    >
                        {track.name} - {track.instrument.name}
                    </div>
                ))}
            </div>
            <button
                onClick={onAddTrack}
                style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#27ae60',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px'
                }}
            >
                Add Track
            </button>
        </div>
    );
};

export default TrackSelector;
