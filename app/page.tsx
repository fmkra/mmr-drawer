'use client'

import { useState } from 'react'
import Drawer from './drawer'
import { useMMr } from './useMmr'

export default function Home() {
    const [showVirtual, setShowVirtual] = useState(false)
    const { root, append, size } = useMMr(6)

    return (
        <div>
            <div className="p-4">
                <button
                    className="px-2 py-1 rounded border border-white transition-color hover:bg-white hover:text-black"
                    onClick={append}
                >
                    Append
                </button>
                <div className="mt-2">
                    <input
                        type="checkbox"
                        id="show-virtual"
                        checked={showVirtual}
                        onChange={(e) => setShowVirtual(e.target.checked)}
                    />
                    <label htmlFor="show-virtual" className="ml-2">
                        Show virtual nodes
                    </label>
                </div>
            </div>
            <div className="w-max overflow-x-auto overflow-y-hidden">
                <Drawer node={root} size={size} showVirtual={showVirtual} />
            </div>
        </div>
    )
}
