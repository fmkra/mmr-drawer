'use client'

import { useState } from 'react'
import Drawer from './drawer'
import { useMMr } from './useMmr'

export default function Home() {
    const [showVirtual, setShowVirtual] = useState(false)
    const { root: node, append, size } = useMMr()

    return (
        <div>
            <button onClick={append}>Append</button>
            <button className="p-2 rounded border border-white" onClick={() => setShowVirtual((s) => !s)}>
                {showVirtual ? 'true' : 'false'}
            </button>
            <div className="w-max overflow-x-auto overflow-y-hidden">
                <Drawer node={node} size={size} showVirtual={showVirtual} />
            </div>
        </div>
    )
}
