import { Line } from '@/drawer/line';
import { Node, update } from './node';
import { bitLength } from './utils';

interface ColorSettings {
    standard: string;
    virtual: string;
    peak: string;
}

interface DrawerProps {
    node: Node;
    size: number;
    showVirtual: boolean;
    hashUpdateRoot?: (root: Node) => void;
    colorSettings: ColorSettings;
    overwriteNodeColor?: Record<number, string>;
}

interface CustomDrawerProps extends DrawerProps {
    _isParentVirtual?: boolean;
    _updateHash?: (index: number, hash: string) => void;
}

export function Drawer(props: DrawerProps) {
    return (
        <div className="max-w-full overflow-x-auto overflow-y-hidden">
            <div className="-mb-10 w-max p-4">
                <CustomDrawer {...props} />
            </div>
        </div>
    );
}

function CustomDrawer({ node, ...props }: CustomDrawerProps) {
    const isVirtual = node.index > props.size;
    const showNode = props.showVirtual || !isVirtual;

    const ipv = props._isParentVirtual ?? true;
    const colorType = isVirtual ? 'virtual' : ipv ? 'peak' : 'standard';
    const overwrittenColor = props.overwriteNodeColor?.[node.index];
    const nodeColor = overwrittenColor ?? props.colorSettings[colorType];
    const lineColor =
        colorType == 'peak'
            ? props.colorSettings['standard']
            : props.colorSettings[colorType];

    const updateHash =
        props._updateHash ??
        ((index, value) => {
            props.hashUpdateRoot?.(
                update(node, index, value, 1, (1 << bitLength(props.size)) - 1),
            );
        });

    return (
        <div className="grid w-full grid-cols-[1fr_3rem_1fr] grid-rows-[auto_3rem_auto]">
            <div />
            <div
                className="relative z-10 flex aspect-square items-center justify-center rounded-full bg-black transition-colors"
                style={{
                    borderColor: nodeColor,
                    borderWidth: showNode ? '3px' : '0px',
                }}
            >
                <span>{showNode && node.index}</span>
                {showNode && props.hashUpdateRoot && (
                    <span className="z-12 group absolute top-12 bg-black p-px text-sm">
                        {node.hash.substring(0, 6)}...
                        <input
                            value={node.hash}
                            onChange={
                                (e) =>
                                    console.log(
                                        updateHash(node.index, e.target.value),
                                    )
                                // props.hash?.update(node.index, e.target.value)
                            }
                            className={`absolute bottom-full z-50 hidden max-w-[8rem] rounded border border-white bg-black p-2 group-hover:block ${
                                node.index == 1
                                    ? `-left-4`
                                    : `right-1/2 translate-x-1/2`
                            }`}
                        />
                    </span>
                )}
            </div>
            <div />

            <div className="relative w-full">
                <div className="absolute -inset-y-6 -right-6 left-1/2">
                    {node.left !== null && showNode && (
                        <Line side="left" color={lineColor} />
                    )}
                </div>
            </div>
            <div />
            <div className="relative w-full">
                <div className="absolute -inset-y-6 -left-6 right-1/2">
                    {node.right !== null && showNode && (
                        <Line side="right" color={lineColor} />
                    )}
                </div>
            </div>

            {node.left !== null ? (
                <CustomDrawer
                    node={node.left}
                    {...props}
                    _isParentVirtual={isVirtual}
                    _updateHash={updateHash}
                />
            ) : (
                <div />
            )}
            <div />
            {node.right !== null ? (
                <CustomDrawer
                    node={node.right}
                    {...props}
                    _updateHash={updateHash}
                    _isParentVirtual={isVirtual}
                />
            ) : (
                <div />
            )}
        </div>
    );
}
