'use client';

import { useMemo, useState } from 'react';
import { Drawer, useMmr } from '@/drawer';
import useHasher from '@/drawer/useHasher';

export default function Home() {
    const [showVirtual, setShowVirtual] = useState(false);
    const [hashWithSize, setHashWithSize] = useState(true);

    const [appendValueStr, setAppendValueStr] = useState('0x0');
    const appendValues = useMemo(
        () => appendValueStr.split(',').filter((v) => v.trim() !== ''),
        [appendValueStr],
    );
    const appendValuesValid = useMemo(
        () => appendValues.every((v) => isFinite(Number(v))),
        [appendValues],
    );

    const { selector, hasher } = useHasher();
    const { root, append, reset, size, peaks, drawerHashProp } = useMmr(
        6,
        hasher,
    );

    return (
        <div>
            <div className="p-4">
                <input
                    className={
                        'h-full rounded border bg-black px-2 py-1.5 ' +
                        (appendValuesValid ? 'border-white' : 'border-red-500')
                    }
                    type="text"
                    value={appendValueStr}
                    onChange={(e) => setAppendValueStr(e.target.value)}
                />
                <button
                    className={
                        'mx-1 rounded border px-2 py-1 transition-colors hover:bg-white hover:text-black ' +
                        (appendValuesValid ? 'border-white' : 'border-red-500')
                    }
                    onClick={() => append(appendValues)}
                >
                    Append
                </button>
                <button
                    className="mx-1 rounded border border-white px-2 py-1 transition-colors hover:border-red-500 hover:bg-red-500"
                    onClick={reset}
                >
                    Reset
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
