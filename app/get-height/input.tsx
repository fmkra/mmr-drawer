'use client';

import { Drawer, useMmr } from '@/drawer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function Mmr({ size: s }: { size: number }) {
    const { root, size } = useMmr(s, () => ``);

    return (
        <Drawer
            node={root}
            size={size}
            showVirtual={false}
            colorSettings={{
                standard: '#fff',
                virtual: '#f00',
                peak: '#0f0',
                root: '#00f',
            }}
        />
    );
}

export function Input() {
    const [size, setSize] = useState<number | null>(null);
    const [node, setNode] = useState<number | null>(null);
    const [page, setPage] = useState(0);

    const router = useRouter();

    return (
        <div>
            <h1>Get Height</h1>

            {page == 0 ? (
                <div>
                    <label htmlFor="size">Number of leaves</label>
                    <input
                        key={1}
                        type="number"
                        id="size"
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="block border border-white bg-black p-1 focus:outline-none"
                    />
                    {size !== null && size > 16 && (
                        <p className="text-red-600">
                            It is not recommended to create more than 16 leaves.
                        </p>
                    )}
                    <button
                        disabled={size === null || isNaN(size)}
                        onClick={() => setPage(1)}
                    >
                        Next
                    </button>
                </div>
            ) : (
                <div>
                    <label htmlFor="node">Node</label>
                    <input
                        key={2}
                        type="number"
                        id="node"
                        onChange={(e) => setNode(parseInt(e.target.value))}
                        className="block border border-white bg-black p-1 focus:outline-none"
                    />

                    <button
                        disabled={node === null || isNaN(node)}
                        onClick={() =>
                            router.push(`?size=${size}&node=${node}`)
                        }
                    >
                        Start animation
                    </button>

                    <Mmr size={size as number} />
                </div>
            )}
        </div>
    );
}
