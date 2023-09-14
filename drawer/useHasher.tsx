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

    const [currentHasher, setCurrentHasher] = useState<number>(0);
    const hasher: Hasher = useMemo(() => {
        if (currentHasher == 0) {
            return (a, b) => keccakHasher.hash([a, b]);
        } else if (currentHasher == 1) {
            return (a, b) => poseidonHasher?.hash([a, b]) ?? 'loading';
        } else {
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
                <option value={0}>Keccak</option>
                <option value={1}>Poseidon</option>
                <option value={2}>Stark Poseidon</option>
            </select>
        </>
    );

    return { selector, hasher };
}
