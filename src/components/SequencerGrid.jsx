// src/components/SequencerGrid.jsx
import React from 'react';

const SequencerGrid = ({ sequence, noteMapping, totalCols, currentStep, toggleStep }) => {
    // Build the marker row.
    const markerRow = (
        <div style={{
            display: "grid",
            gridTemplateColumns: `60px repeat(${totalCols}, 30px)`,
            gap: "2px",
            marginBottom: "2px"
        }}>
            <div></div>
            {Array.from({ length: totalCols }).map((_, colIndex) => (
                <div key={colIndex} style={{
                    width: "30px",
                    textAlign: "center",
                    fontSize: "16px"
                }}>
                    {colIndex === currentStep && <span style={{ color: "red" }}>▼</span>}
                </div>
            ))}
        </div>
    );

    return (
        <div>
            {markerRow}
            {sequence.map((row, rowIndex) => (
                <div key={rowIndex} style={{
                    display: "grid",
                    gridTemplateColumns: `60px repeat(${totalCols}, 30px)`,
                    alignItems: "center",
                    gap: "2px",
                    marginBottom: "2px"
                }}>
                    <div style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "10px"
                    }}>
                        {noteMapping[rowIndex]}
                    </div>
                    {row.map((active, colIndex) => (
                        <div key={colIndex}
                             onClick={() => toggleStep(rowIndex, colIndex)}
                             style={{
                                 width: "30px",
                                 height: "30px",
                                 backgroundColor: active ? "#27ae60" : "#2c3e50",
                                 border: "1px solid #34495e",
                                 cursor: "pointer"
                             }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default SequencerGrid;
