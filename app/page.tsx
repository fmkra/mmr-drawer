'use client';

import { useState } from 'react';
import { Drawer, useMmr } from '@/drawer';
import { Hasher } from '@/drawer/node';
import useHasher from '@/drawer/useHasher';

export default function Home() {
    const [showVirtual, setShowVirtual] = useState(false);
    const { selector, hasher } = useHasher();

    const { root, append, size, drawerHashProp } = useMmr(6, hasher);

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
                {selector}
            </div>

            <Drawer
                node={root}
                size={size}
                hash={drawerHashProp}
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
