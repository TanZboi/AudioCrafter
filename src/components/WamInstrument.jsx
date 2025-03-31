// src/components/WamInstrument.jsx
import React, { useEffect, useState } from 'react';
import { WamLoader } from '@webaudiomodules/wam-loader';

const WamInstrument = ({ audioContext, moduleUrl, onLoad }) => {
    const [wamNode, setWamNode] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadModule() {
            try {
                // Load the WAM module definition from the provided URL.
                const moduleDefinition = await WamLoader.loadModule(moduleUrl);
                // Instantiate the module (pass your AudioContext).
                const node = new moduleDefinition(audioContext);
                node.connect(audioContext.destination);
                setWamNode(node);
                setLoading(false);
                if (onLoad) onLoad(node);
            } catch (error) {
                console.error("Error loading WAM module:", error);
                setLoading(false);
            }
        }
        loadModule();
    }, [audioContext, moduleUrl, onLoad]);

    if (loading) {
        return <div style={{ color: 'white' }}>Loading WAM Instrument…</div>;
    }

    return (
        <div style={{ color: 'white' }}>
            {/* You could add additional UI controls here to interact with the WAM's parameters. */}
            WAM Instrument Loaded!
        </div>
    );
};

export default WamInstrument;
