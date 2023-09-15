'use client';

import { useState } from 'react';
import { Drawer, useMmr } from '@/drawer';
import useHasher from '@/drawer/useHasher';

export default function Home() {
    const [showVirtual, setShowVirtual] = useState(false);
    const [hashWithSize, setHashWithSize] = useState(true);

    const { selector, hasher } = useHasher();
    const { root, append, size, peaks, drawerHashProp } = useMmr(7, hasher);

    return (
        <div>
            <div className="p-4">
                <button
                    className="transition-color rounded border border-white px-2 py-1 hover:bg-white hover:text-black"
                    onClick={append}
                >
                    Append
                </button>
                <div className="my-2">
                    <input
                        type="checkbox"
                        id="show-virtual"
                        checked={showVirtual}
                        onChange={(e) => setShowVirtual(e.target.checked)}
                    />
                    <label htmlFor="show-virtual" className="ml-2">
                        Show virtual nodes
                    </label>
                </div>
                <div className="my-2">
                    <input
                        type="checkbox"
                        id="hash-with-size"
                        checked={hashWithSize}
                        onChange={(e) => setHashWithSize(e.target.checked)}
                    />
                    <label htmlFor="hash-with-size" className="ml-2">
                        Hash with mmr size
                    </label>
                </div>
                {selector}
            </div>

            <Drawer
                node={root}
                size={size}
                hash={drawerHashProp}
                peaks={peaks}
                showVirtual={showVirtual}
                hashWithSize={hashWithSize}
                colorSettings={{
                    standard: '#fff',
                    virtual: '#444',
                    peak: '#0f0',
                    root: '#f00',
                    size: `#ff0`,
                }}
            />
        </div>
    );
}
