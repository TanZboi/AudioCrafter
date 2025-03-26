// src/components/TransportControls.jsx
import React from 'react';

const TransportControls = ({ startTransport, stopTransport, bpm, setBpm, metronomeEnabled, setMetronomeEnabled }) => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            padding: "10px",
            backgroundColor: "#0d1b2a",
            borderBottom: "1px solid #34495e"
        }}>
            <button onClick={startTransport} style={{
                backgroundColor: "#2c3e50",
                color: "white",
                border: "none",
                padding: "8px",
                cursor: "pointer",
                fontSize: "24px"
            }}>
                ▶
            </button>
            <button onClick={stopTransport} style={{
                backgroundColor: "#2c3e50",
                color: "white",
                border: "none",
                padding: "8px",
                cursor: "pointer",
                fontSize: "24px"
            }}>
                ⏹
            </button>
            <button onClick={() => setMetronomeEnabled(!metronomeEnabled)} style={{
                backgroundColor: "#2c3e50",
                color: "white",
                border: "none",
                padding: "8px",
                cursor: "pointer",
                fontSize: "14px"
            }}>
                {metronomeEnabled ? "Metronome On" : "Metronome Off"}
            </button>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }}>
                <label style={{ margin: "0", fontSize: "16px" }}>BPM:</label>
                <input
                    type="range"
                    min="60"
                    max="200"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    style={{ verticalAlign: "middle" }}
                />
                <span style={{ fontSize: "16px" }}>{bpm}</span>
            </div>
        </div>
    );
};

export default TransportControls;
