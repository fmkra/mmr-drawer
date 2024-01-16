'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Hasher, Node, getHashWithError, getTree, update } from './node';
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

    const append = (values: string[]) => {
        let cLeafCount = leafCount;
        let cLeafCapacity = leafCapacity;
        let cSizeCapacity = sizeCapacity;
        let cHeight = height;
        let cRoot = root;
        let cSize = size;
        for (const value of values) {
            if (cLeafCount == cLeafCapacity) {
                const rightSubtree = getTree(cSizeCapacity + 1, cHeight, hash);
                cRoot = {
                    index: rightSubtree.index + 1,
                    left: cRoot,
                    right: rightSubtree,
                    hash: getHashWithError(cRoot.hash, rightSubtree.hash, hash),
                };
                cHeight++;
                cLeafCapacity = 2 * cLeafCapacity;
                cSizeCapacity = 2 * cSizeCapacity + 1;
            }
            cLeafCount++;
            cSize = leafIndexToMmrIndex(cLeafCount + 1) - 1;
            cRoot = update(cRoot, cSize, value, hash, 1, cSizeCapacity);
        }
        setLeafCount(cLeafCount);
        setSize(cSize);
        setHeight(cHeight);
        setRoot(cRoot);
        setLeafCapacity(cLeafCapacity);
        setSizeCapacity(cSizeCapacity);
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
