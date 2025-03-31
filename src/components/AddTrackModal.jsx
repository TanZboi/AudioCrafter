// src/components/AddTrackModal.jsx
import React, { useState } from 'react';

const AddTrackModal = ({ instruments, onSelect, onClose }) => {
    const [search, setSearch] = useState('');

    const filteredInstruments = instruments.filter(inst =>
        inst.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 200
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#2c3e50',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '300px',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 style={{ color: 'white', marginTop: 0 }}>Select Instrument</h2>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    style={{
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        borderRadius: '4px',
                        border: '1px solid #34495e',
                        backgroundColor: '#1c2b36',
                        color: 'white'
                    }}
                />
                {filteredInstruments.map((inst) => (
                    <div
                        key={inst.id}
                        onClick={() => onSelect(inst)}
                        style={{
                            padding: '8px',
                            marginBottom: '6px',
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
                    <div style={{ color: 'gray' }}>No instruments found</div>
                )}
                <button
                    onClick={onClose}
                    style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddTrackModal;
