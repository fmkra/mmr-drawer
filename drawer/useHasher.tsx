'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { KeccakHasher } from '@accumulators/hashers/lib/keccak-hasher';
import { PoseidonHasher } from '@accumulators/hashers/lib/poseidon-hasher';
import { StarkPoseidonHasher } from '@accumulators/hashers/lib/stark-poseidon-hasher';

type Hasher = (a: string, b: string) => string;

export default function useHashers() {
    const keccakHasher = useMemo(() => new KeccakHasher(), []);
    const starkPoseidonHasher = useMemo(() => new StarkPoseidonHasher(), []);
    const [poseidonHasher, setPoseidonHasher] = useState<PoseidonHasher | null>(
        null,
    );

    const [currentHasher, setCurrentHasher] = useState<number>(1);
    const hasher: Hasher | undefined = useMemo(() => {
        if (currentHasher == 1) {
            return (a, b) => keccakHasher.hash([a, b]);
        } else if (currentHasher == 2) {
            return (a, b) => poseidonHasher?.hash([a, b]) ?? 'loading';
        } else if (currentHasher == 3) {
            return (a, b) => starkPoseidonHasher.hash([a, b]);
        }
    }, [currentHasher, poseidonHasher, keccakHasher, starkPoseidonHasher]);

    useEffect(() => {
        PoseidonHasher.create().then(setPoseidonHasher);
    }, []);

    const selector = (
        <>
            <select
                className="rounded border border-white bg-black px-2 py-1"
                onChange={(e) => {
                    const value = e.target.value;
                    setCurrentHasher(parseInt(value));
                }}
                value={currentHasher}
            >
                <option value={0}>None</option>
                <option value={1}>Keccak</option>
                <option value={2}>Poseidon</option>
                <option value={3}>Stark Poseidon</option>
            </select>
        </>
    );

    return { selector, hasher };
}
