'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Hasher, Node, getHashWithError, getTree } from './node';
import { bitLength, leafIndexToMmrIndex } from './utils';

export function useMmr(initialLeafCount: number, hasher: Hasher) {
    const [leafCount, setLeafCount] = useState(() =>
        initialLeafCount < 1 ? 1 : initialLeafCount,
    );
    const [size, setSize] = useState(
        () => leafIndexToMmrIndex(leafCount + 1) - 1,
    );
    const [height, setHeight] = useState(() =>
        leafCount == 1 ? 0 : bitLength(leafCount - 1),
    );
    const [root, setRoot] = useState<Node>(() => getTree(1, height, hasher));
    const [leafCapacity, setLeafCapacity] = useState(() => 1 << height);
    const [sizeCapacity, setSizeCapacity] = useState(
        () => leafIndexToMmrIndex(leafCapacity + 1) - 1,
    );

    const append = () => {
        if (leafCount == leafCapacity) {
            const rightSubtree = getTree(sizeCapacity + 1, height, hasher);
            const newRoot = {
                index: rightSubtree.index + 1,
                left: root,
                right: rightSubtree,
                hash: getHashWithError(root.hash, rightSubtree.hash, hasher),
            };
            setRoot(newRoot);
            setHeight(height + 1);
            setLeafCapacity(2 * leafCapacity);
            setSizeCapacity(2 * sizeCapacity + 1);
        }
        setLeafCount((x) => x + 1);
        const newSize = leafIndexToMmrIndex(leafCount + 2) - 1;
        setSize(newSize);
    };

    const peaks = useMemo(() => {
        let x = size;
        let lastPeak = 0;
        const peaks = [];
        for (let i = bitLength(x) - 1; i > 0; i--) {
            const peakSize = (1 << i) - 1;
            if (peakSize <= x) {
                lastPeak += peakSize;
                peaks.push(lastPeak);
                x -= peakSize;
            }
        }
        return peaks;
    }, [size]);

    return {
        root,
        size,
        append,
        peaks,
        virtual: {
            leafCount: leafCapacity,
            size: sizeCapacity,
        },
        drawerHashProp: {
            updateRoot: setRoot,
            hasher: hasher,
        },
    };
}
