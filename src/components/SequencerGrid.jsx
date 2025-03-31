// src/components/SequencerGrid.jsx
import React from 'react';

// Helper: convert hex color to RGBA with specified opacity.
const hexToRGBA = (hex, alpha = 1) => {
    let cleanedHex = hex.replace('#', '');
    if (cleanedHex.length === 3) {
        cleanedHex = cleanedHex.split('').map(c => c + c).join('');
    }
    const r = parseInt(cleanedHex.substring(0, 2), 16);
    const g = parseInt(cleanedHex.substring(2, 4), 16);
    const b = parseInt(cleanedHex.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
};

const SequencerGrid = ({
                           sequence,
                           noteMapping,
                           totalCols,
                           currentStep,
                           updateNote,
                           deleteNote,
                           draggingNote,
                           setDraggingNote,
                           currentTrack,
                           editable = true,    // if false, this grid is rendered as onion skin
                           showMarker = true   // if true, the marker row is rendered
                       }) => {
    const gridFullWidth = 40 + totalCols * 30; // 40px for the note label column

    // Marker row (shows the current step) – rendered only if showMarker is true.
    const markerRow = showMarker && (
        <div style={{
            position: "sticky",
            top: 0,
            left: 0,
            width: gridFullWidth,
            display: "grid",
            gridTemplateColumns: `40px repeat(${totalCols}, 30px)`,
            gap: "2px",
            marginBottom: "2px",
            backgroundColor: "#0d1b2a",
            zIndex: 10
        }}>
            <div></div>
            {Array.from({ length: totalCols }).map((_, colIndex) => (
                <div key={colIndex} style={{
                    width: "30px",
                    height: "20px",
                    textAlign: "center",
                    fontSize: "16px"
                }}>
                    {colIndex === currentStep && <span style={{ color: "red" }}>▼</span>}
                </div>
            ))}
        </div>
    );

    // Event handlers – only active if editable.
    const handleMouseDown = (e, rowIndex, colIndex) => {
        if (!editable) return;
        if (e.button !== 0) return; // Only process left clicks.
        setDraggingNote({ rowIndex, startCol: colIndex, endCol: colIndex });
    };

    const handleMouseEnter = (rowIndex, colIndex) => {
        if (!editable) return;
        if (draggingNote && draggingNote.rowIndex === rowIndex) {
            setDraggingNote({ ...draggingNote, endCol: colIndex });
        }
    };

    const handleMouseUp = (rowIndex) => {
        if (!editable) return;
        if (draggingNote && draggingNote.rowIndex === rowIndex) {
            const start = Math.min(draggingNote.startCol, draggingNote.endCol);
            const end = Math.max(draggingNote.startCol, draggingNote.endCol);
            updateNote(rowIndex, start, end);
            setDraggingNote(null);
        }
    };

    const handleMouseLeave = (rowIndex) => {
        if (!editable) return;
        if (draggingNote && draggingNote.rowIndex === rowIndex) {
            setDraggingNote(null);
        }
    };

    const handleRightClick = (e, rowIndex, colIndex) => {
        // Right-click deletes a note.
        e.preventDefault();
        if (sequence[rowIndex][colIndex] === 0) return;
        let start = colIndex;
        while (start > 0 && sequence[rowIndex][start - 1] !== 0) {
            start--;
        }
        let end = colIndex;
        while (end < totalCols - 1 && sequence[rowIndex][end + 1] !== 0) {
            end++;
        }
        deleteNote(rowIndex, start, end);
    };

    return (
        <div style={{
            padding: "10px",
            minWidth: gridFullWidth,
            // If not editable, lower opacity and disable pointer events.
            opacity: editable ? 1 : 0.3,
            pointerEvents: editable ? "auto" : "none"
        }}>
            {markerRow}
            {sequence.map((row, rowIndex) => (
                <div key={rowIndex}
                     onMouseLeave={() => handleMouseLeave(rowIndex)}
                     style={{
                         display: "grid",
                         gridTemplateColumns: `40px repeat(${totalCols}, 30px)`,
                         alignItems: "center",
                         gap: "2px",
                         marginBottom: "2px",
                         minWidth: gridFullWidth
                     }}>
                    <div style={{
                        width: "40px",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "10px",
                        height: "20px"
                    }}>
                        {noteMapping[rowIndex]}
                    </div>
                    {row.map((cell, colIndex) => {
                        // Determine the cell's background color.
                        let backgroundColor = "#2c3e50"; // off state
                        const fallbackColor = "#27ae60";
                        if (cell === 1) {
                            backgroundColor = currentTrack ? currentTrack.instrument.color : fallbackColor;
                        } else if (cell === 2) {
                            backgroundColor = currentTrack ? hexToRGBA(currentTrack.instrument.color, 0.7) : hexToRGBA(fallbackColor, 0.7);
                        }
                        // Highlight the dragging region if applicable.
                        let border = "1px solid #34495e";
                        if (draggingNote && draggingNote.rowIndex === rowIndex &&
                            colIndex >= Math.min(draggingNote.startCol, draggingNote.endCol) &&
                            colIndex <= Math.max(draggingNote.startCol, draggingNote.endCol)) {
                            border = "2px solid yellow";
                        }
                        return (
                            <div key={colIndex}
                                 onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                                 onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                 onMouseUp={() => handleMouseUp(rowIndex)}
                                 onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                                 style={{
                                     width: "30px",
                                     height: "20px",
                                     backgroundColor: backgroundColor,
                                     border: border,
                                     cursor: "pointer"
                                 }}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default SequencerGrid;
