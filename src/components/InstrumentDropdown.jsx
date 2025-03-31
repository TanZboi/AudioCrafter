// src/components/InstrumentDropdown.jsx
import React, { useState } from 'react';

const InstrumentDropdown = ({ instruments, selectedInstrument, setSelectedInstrument }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const toggleDropdown = () => {
        setOpen(!open);
    };

    const handleSelect = (instrument) => {
        setSelectedInstrument(instrument);
        setOpen(false);
        setSearch('');
    };

    // Filter instruments based on the search query.
    const filteredInstruments = instruments.filter(inst =>
        inst.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ position: 'relative', display: 'inline-block', marginRight: '20px' }}>
            <button
                onClick={toggleDropdown}
                style={{
                    backgroundColor: '#2c3e50',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
            >
                {selectedInstrument ? selectedInstrument.name : 'Select Instrument'} &#9662;
            </button>
            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        backgroundColor: '#2c3e50',
                        boxShadow: '0px 8px 16px rgba(0,0,0,0.2)',
                        zIndex: 100, // High z-index so it appears above other elements
                        minWidth: '200px',
                        padding: '8px',
                        borderRadius: '4px'
                    }}
                >
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        style={{
                            width: '100%',
                            padding: '4px 8px',
                            marginBottom: '8px',
                            borderRadius: '4px',
                            border: '1px solid #34495e',
                            backgroundColor: '#1c2b36',
                            color: 'white'
                        }}
                    />
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {filteredInstruments.map(inst => (
                            <div
                                key={inst.id}
                                onClick={() => handleSelect(inst)}
                                style={{
                                    padding: '6px 8px',
                                    marginBottom: '4px',
                                    borderRadius: '4px',
                                    backgroundColor: inst.color,
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                {inst.name}
                            </div>
                        ))}
                        {filteredInstruments.length === 0 && (
                            <div style={{ padding: '6px 8px', color: 'gray' }}>
                                No instruments found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstrumentDropdown;
