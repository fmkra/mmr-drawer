'use client'

import { useState } from 'react'
import Drawer from './drawer'
import { Node, getTree } from './node'
import { useMMr } from './useMmr'

export default function Home() {
    // const [size, setSize] = useState(10)
    const [showVirtual, setShowVirtual] = useState(false)
    // const node = getTree(1, 4)
    const { root: node, append, size } = useMMr()

    return (
        <div>
            <button onClick={append}>Append</button>
            <button className="p-2 rounded border border-white" onClick={() => setSize((s) => s + 1)}>
                {size}
            </button>
            <button className="p-2 rounded border border-white" onClick={() => setShowVirtual((s) => !s)}>
                {showVirtual ? 'true' : 'false'}
            </button>
            <div className="overflow-x-auto overflow-y-hidden">
                <Drawer node={node} size={size} showVirtual={showVirtual} />
            </div>
        </div>
    )
}
