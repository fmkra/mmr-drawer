'use client';

import { useState } from 'react';
import { Drawer, useMmr } from '@/drawer';

export default function Home() {
    const [showVirtual, setShowVirtual] = useState(false);
    const { root, append, size } = useMmr(6);

    return (
        <div>
            <div className="p-4">
                <button
                    className="transition-color rounded border border-white px-2 py-1 hover:bg-white hover:text-black"
                    onClick={append}
                >
                    Append
                </button>
                <div className="mt-2">
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
            </div>

            <Drawer
                node={root}
                size={size}
                showVirtual={showVirtual}
                colorSettings={{
                    standard: '#fff',
                    virtual: '#f00',
                    peak: '#0f0',
                }}
            />
        </div>
    );
}
