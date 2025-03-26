// src/components/Dropdown.jsx
import React, { useState } from 'react';

const Dropdown = ({ label, options }) => {
    const [open, setOpen] = useState(false);

    return (
        <div style={{ position: "relative", display: "inline-block", marginRight: "20px" }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    backgroundColor: "#2c3e50",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "16px"
                }}
            >
                {label} &#9662;
            </button>
            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        backgroundColor: "#2c3e50",
                        boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
                        zIndex: 1,
                        minWidth: "120px"
                    }}
                >
                    {options.map((option, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: "8px 12px",
                                color: "white",
                                cursor: "pointer",
                                borderBottom: idx < options.length - 1 ? "1px solid #34495e" : "none"
                            }}
                            onClick={() => setOpen(false)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
