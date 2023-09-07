'use client'

import { Drawer, useMmr } from '@/drawer'

export function Animation({ size: s, node }: { size: number; node: number }) {
    const { root, size } = useMmr(s)

    return (
        <Drawer
            node={root}
            size={size}
            showVirtual={false}
            colorSettings={{
                standard: '#fff',
                virtual: '#f00',
                peak: '#0f0',
            }}
        />
    )
}
