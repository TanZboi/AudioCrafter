// src/components/Header.jsx
import React from 'react';
import Dropdown from './Dropdown';

const Header = () => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
            backgroundColor: "#0d1b2a",
            borderBottom: "1px solid #34495e"
        }}>
            <h1 style={{ margin: "0", color: "white" }}>AudioCrafter</h1>
            <div style={{ display: "flex", gap: "20px" }}>
                <Dropdown label="File" options={["New", "Open", "Save", "Close"]} />
                <Dropdown label="Export" options={["MP3", "WAV", "MIDI"]} />
                <Dropdown label="Settings" options={["Preferences", "Themes"]} />
            </div>
        </div>
    );
};

export default Header;
