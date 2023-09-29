'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Hasher, Node, getHashWithError, getTree } from './node';
import { bitLength, leafIndexToMmrIndex } from './utils';

export function useMmr(initialLeafCount: number, hasher?: Hasher) {
    const hash = useMemo(() => hasher ?? (() => ''), [hasher]);
    const [leafCount, setLeafCount] = useState(() =>
        initialLeafCount < 1 ? 1 : initialLeafCount,
    );
    const [size, setSize] = useState(
        () => leafIndexToMmrIndex(leafCount + 1) - 1,
    );
    const [height, setHeight] = useState(() =>
        leafCount == 1 ? 0 : bitLength(leafCount - 1),
    );
    const [root, setRoot] = useState<Node>(() => getTree(1, height, hash));
    const [leafCapacity, setLeafCapacity] = useState(() => 1 << height);
    const [sizeCapacity, setSizeCapacity] = useState(
        () => leafIndexToMmrIndex(leafCapacity + 1) - 1,
    );

    const reset = () => {
        setLeafCount(1);
        setSize(1);
        setHeight(0);
        setRoot(getTree(1, 0, hash));
        setLeafCapacity(1);
        setSizeCapacity(1);
    };

    const append = () => {
        if (leafCount == leafCapacity) {
            const rightSubtree = getTree(sizeCapacity + 1, height, hash);
            const newRoot = {
                index: rightSubtree.index + 1,
                left: root,
                right: rightSubtree,
                hash: getHashWithError(root.hash, rightSubtree.hash, hash),
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

    const peaks: [[number, string][], string[]] = useMemo(() => {
        let node = root;
        const hashes: [number, string][] = [[0, `${size}`]];
        if (node.index === size) {
            hashes.push([root.index, root.hash]);
            return [
                hashes,
                [getHashWithError(hashes[0][1], hashes[1][1], hash)],
            ];
        }
        while (node.left !== null) {
            if (node.left.index <= size) {
                hashes.push([node.left.index, node.left.hash]);
                node = node.right as Node;
            } else {
                node = node.left as Node;
            }
        }
        const pathHashes = [];

        if (hashes.length == 1) pathHashes[0] = root.hash;
        else
            pathHashes[hashes.length - 2] = getHashWithError(
                hashes[hashes.length - 2][1],
                hashes[hashes.length - 1][1],
                hash,
            );

        for (let i = hashes.length - 3; i >= 0; i--) {
            pathHashes[i] = getHashWithError(
                hashes[i][1],
                pathHashes[i + 1],
                hash,
            );
        }
        return [hashes, pathHashes] as [[number, string][], string[]];
    }, [root, size, hash]);

    return {
        root,
        size,
        append,
        reset,
        peaks,
        virtual: {
            leafCount: leafCapacity,
            size: sizeCapacity,
        },
        drawerHashProp: hasher
            ? {
                  updateRoot: setRoot,
                  hasher: hash,
              }
            : undefined,
    };
}
