'use client'

import { useRef, useState } from 'react'
import { Node, getTree } from './node'
import { bitLength, leafIndexToMmrIndex } from './utils'

export function useMMr(initialLeafCount: number) {
    const [leafCount, setLeafCount] = useState(() => (initialLeafCount < 1 ? 1 : initialLeafCount))
    const [size, setSize] = useState(() => leafIndexToMmrIndex(leafCount + 1) - 1)
    const [height, setHeight] = useState(() => (leafCount == 1 ? 0 : bitLength(leafCount - 1)))
    const [root, setRoot] = useState<Node>(() => getTree(1, height))
    const [leafCapacity, setLeafCapacity] = useState(() => 1 << height)
    const [sizeCapacity, setSizeCapacity] = useState(() => leafIndexToMmrIndex(leafCapacity + 1) - 1)

    const append = () => {
        if (leafCount == leafCapacity) {
            const rightSubtree = getTree(sizeCapacity + 1, height)
            const newRoot = {
                index: rightSubtree.index + 1,
                left: root,
                right: rightSubtree,
            }
            setRoot(newRoot)
            setHeight(height + 1)
            setLeafCapacity(2 * leafCapacity)
            setSizeCapacity(2 * sizeCapacity + 1)
        }
        setLeafCount((x) => x + 1)
        setSize(leafIndexToMmrIndex(leafCount + 2) - 1)
    }

    return { root, size, append }
}
