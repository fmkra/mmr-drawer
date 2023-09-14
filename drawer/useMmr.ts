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

    const peaks: [[number, string][], string[]] = useMemo(() => {
        let node = root;
        const hashes: [number, string][] = [];
        if (node.index === size)
            return [[[root.index, root.hash]], []] as [
                [number, string][],
                string[],
            ];
        while (node.left !== null) {
            if (node.left.index <= size) {
                hashes.push([node.left.index, node.left.hash]);
                node = node.right as Node;
            } else {
                node = node.left as Node;
            }
        }
        const pathHashes = [
            hashes.length == 1
                ? root.hash
                : getHashWithError(
                      hashes[hashes.length - 2][1],
                      hashes[hashes.length - 1][1],
                      hasher,
                  ),
        ];
        for (let i = hashes.length - 3; i >= 0; i--) {
            pathHashes.push(
                getHashWithError(
                    hashes[i][1],
                    pathHashes[pathHashes.length - 1],
                    hasher,
                ),
            );
        }
        return [hashes, pathHashes] as [[number, string][], string[]];
    }, [root, size, hasher]);

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
