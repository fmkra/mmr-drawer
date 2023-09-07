import { Line } from '@/drawer/line'
import { Node } from './node'

interface ColorSettings {
    standard: string
    virtual: string
    peak: string
}

interface DrawerProps {
    node: Node
    size: number
    showVirtual: boolean
    colorSettings: ColorSettings
    _isParentVirtual?: boolean
}

export function Drawer({ node, ...props }: DrawerProps) {
    const isVirtual = node.index > props.size
    const showNode = props.showVirtual || !isVirtual

    const ipv = props._isParentVirtual ?? true
    const colorType = isVirtual ? 'virtual' : ipv ? 'peak' : 'standard'
    const color = props.colorSettings[colorType]
    const lineColor = colorType == 'peak' ? props.colorSettings['standard'] : color

    return (
        <div className="w-full grid grid-cols-[1fr_3rem_1fr] grid-rows-[auto_3rem_auto]">
            <div />
            <div
                className="flex items-center justify-center rounded-full aspect-square bg-black relative z-10"
                style={{ borderColor: color, borderWidth: showNode ? '3px' : '0px' }}
            >
                <span className="text">{showNode && node.index}</span>
            </div>
            <div />

            <div className="w-full relative">
                <div className="absolute left-1/2 -right-6 -inset-y-6">
                    {node.left !== null && showNode && <Line side="left" color={lineColor} />}
                </div>
            </div>
            <div />
            <div className="w-full relative">
                <div className="absolute right-1/2 -left-6 -inset-y-6">
                    {node.right !== null && showNode && <Line side="right" color={lineColor} />}
                </div>
            </div>

            {node.left !== null ? <Drawer node={node.left} {...props} _isParentVirtual={isVirtual} /> : <div />}
            <div />
            {node.right !== null ? <Drawer node={node.right} {...props} _isParentVirtual={isVirtual} /> : <div />}
        </div>
    )
}
