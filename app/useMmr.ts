'use client'

import { useRef, useState } from 'react'
import { Node, getTree } from './node'
import { leafIndexToMmrIndex } from './utils'

const getNode = (index: number) => ({
    index,
    left: null,
    right: null,
})

export function useMMr() {
    const [leafCount, setLeafCount] = useState(1)
    const [size, setSize] = useState(1)
    const [root, setRoot] = useState<Node>(() => getNode(1))
    const leafCapacity = useRef(1)
    const sizeCapacity = useRef(1)
    const height = useRef(0)

    const append = () => {
        if (leafCount == leafCapacity.current) {
            const rightSubtree = getTree(sizeCapacity.current + 1, height.current)
            const newRoot = {
                index: rightSubtree.index + 1,
                left: root,
                right: rightSubtree,
            }
            setRoot(newRoot)
            height.current = height.current + 1
            leafCapacity.current = 2 * leafCapacity.current
            sizeCapacity.current = 2 * sizeCapacity.current + 1
        }
        setLeafCount((x) => x + 1)
        setSize(leafIndexToMmrIndex(leafCount + 2) - 1)
    }

    return { root, size, append }
}
