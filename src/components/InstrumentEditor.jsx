// src/components/InstrumentEditor.jsx
import React from 'react';

const InstrumentEditor = ({ track, updateTrackInstrument }) => {
    if (!track || !track.instrument || !track.instrument.settings) return null;

    const { instrument } = track;
    const { settings } = instrument;

    const handleChange = (param, value) => {
        updateTrackInstrument(track.id, { ...settings, [param]: value });
    };

    return (
        <div style={{
            backgroundColor: '#1c2b36',
            padding: '10px',
            borderTop: '1px solid #34495e'
        }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Instrument Editor - {instrument.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                    <label style={{ marginRight: '10px' }}>Volume</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={settings.volume}
                        onChange={(e) => handleChange('volume', parseFloat(e.target.value))}
                    />
                    <span style={{ marginLeft: '5px' }}>{settings.volume}</span>
                </div>
                <div>
                    <label style={{ marginRight: '10px' }}>Attack</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={settings.attack}
                        onChange={(e) => handleChange('attack', parseFloat(e.target.value))}
                    />
                    <span style={{ marginLeft: '5px' }}>{settings.attack}</span>
                </div>
                <div>
                    <label style={{ marginRight: '10px' }}>Decay</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={settings.decay}
                        onChange={(e) => handleChange('decay', parseFloat(e.target.value))}
                    />
                    <span style={{ marginLeft: '5px' }}>{settings.decay}</span>
                </div>
                <div>
                    <label style={{ marginRight: '10px' }}>Sustain</label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={settings.sustain}
                        onChange={(e) => handleChange('sustain', parseFloat(e.target.value))}
                    />
                    <span style={{ marginLeft: '5px' }}>{settings.sustain}</span>
                </div>
                <div>
                    <label style={{ marginRight: '10px' }}>Release</label>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.01"
                        value={settings.release}
                        onChange={(e) => handleChange('release', parseFloat(e.target.value))}
                    />
                    <span style={{ marginLeft: '5px' }}>{settings.release}</span>
                </div>
            </div>
        </div>
    );
};

export default InstrumentEditor;
