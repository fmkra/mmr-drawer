'use client';

import { useMemo, useRef, useState } from 'react';
import { Node, getTree } from './node';
import { bitLength, leafIndexToMmrIndex } from './utils';

export function useMmr(initialLeafCount: number) {
    const leafs = useRef<Node[]>([]);
    const [leafCount, setLeafCount] = useState(() =>
        initialLeafCount < 1 ? 1 : initialLeafCount,
    );
    const [size, setSize] = useState(
        () => leafIndexToMmrIndex(leafCount + 1) - 1,
    );
    const [height, setHeight] = useState(() =>
        leafCount == 1 ? 0 : bitLength(leafCount - 1),
    );
    const [root, setRoot] = useState<Node>(() => getTree(1, height));
    const [leafCapacity, setLeafCapacity] = useState(() => 1 << height);
    const [sizeCapacity, setSizeCapacity] = useState(
        () => leafIndexToMmrIndex(leafCapacity + 1) - 1,
    );

    const append = () => {
        if (leafCount == leafCapacity) {
            const rightSubtree = getTree(sizeCapacity + 1, height);
            const newRoot = {
                index: rightSubtree.index + 1,
                left: root,
                right: rightSubtree,
                hash: root.hash + rightSubtree.hash,
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

    return {
        root,
        size,
        append,
        virtual: {
            leafCount: leafCapacity,
            size: sizeCapacity,
        },
        _setRoot: setRoot,
    };
}
