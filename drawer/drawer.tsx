import { Line } from '@/drawer/line';
import { Hasher, Node, update, updateAll as _updateAll } from './node';
import { bitLength } from './utils';
import { useEffect, useRef } from 'react';

interface ColorSettings {
    standard: string;
    virtual: string;
    peak: string;
    root: string;
}

interface CommonProps {
    node: Node;
    size: number;
    showVirtual: boolean;
    hash?: {
        updateRoot: (root: Node) => void;
        hasher: Hasher;
    };
    colorSettings: ColorSettings;
    overwriteNodeColor?: Record<number, string>;
}
interface DrawerProps extends CommonProps {
    peaks?: [[number, string][], string[]];
}
interface CustomDrawerProps extends CommonProps {
    _isParentVirtual: boolean;
    _updateIndex: (index: number, hash: string) => void;
}

export function Drawer({ peaks, ...props }: DrawerProps) {
    const updateIndex = (index: number, value: string) => {
        props.hash?.updateRoot?.(
            update(
                props.node,
                index,
                value,
                props.hash.hasher,
                1,
                (1 << bitLength(props.size)) - 1,
            ),
        );
    };

    useEffect(() => {
        if (props.hash)
            props.hash?.updateRoot?.(_updateAll(props.node, props.hash.hasher));
    }, [props.hash?.hasher]);

    return (
        <>
            <div className="max-w-full overflow-x-auto overflow-y-hidden">
                <div className="-mb-3 w-max px-10 py-4">
                    <CustomDrawer
                        {...props}
                        _updateIndex={updateIndex}
                        _isParentVirtual={true}
                    />
                </div>
            </div>
            <div className="max-w-full overflow-x-auto overflow-y-hidden">
                <div className="relative mb-6 w-max py-4 pl-28 pr-10">
                    {peaks !== undefined && (
                        <>
                            <p className="w-12 py-4 text-center">Peaks</p>
                            <PeakDrawer
                                peaks={peaks}
                                start={0}
                                colorSettings={props.colorSettings}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

function CustomDrawer({ node, ...props }: CustomDrawerProps) {
    const isVirtual = node.index > props.size;
    const showNode = props.showVirtual || !isVirtual;
    const isLeaf = node.left === null && node.right === null;

    const ipv = props._isParentVirtual ?? true;
    const colorType = isVirtual ? 'virtual' : ipv ? 'peak' : 'standard';
    const overwrittenColor = props.overwriteNodeColor?.[node.index];
    const nodeColor = overwrittenColor ?? props.colorSettings[colorType];
    const lineColor =
        colorType == 'peak'
            ? props.colorSettings['standard']
            : props.colorSettings[colorType];

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
                {showNode && <span>{node.index}</span>}
                {showNode && props.hash && !isVirtual && (
                    <span className="z-12 group absolute top-12 rounded bg-neutral-800 p-1 text-sm">
                        {node.hash.substring(0, 8)}
                        {node.hash.length > 8 && `...`}
                        <input
                            value={node.hash}
                            disabled={!isLeaf}
                            onChange={(e) =>
                                props._updateIndex(node.index, e.target.value)
                            }
                            className="absolute bottom-full right-1/2 z-50 hidden max-w-[8rem] translate-x-1/2 rounded border border-white bg-black p-2 text-center group-hover:block"
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
                />
            ) : (
                <div />
            )}
            <div />
            {node.right !== null ? (
                <CustomDrawer
                    node={node.right}
                    {...props}
                    _isParentVirtual={isVirtual}
                />
            ) : (
                <div />
            )}
        </div>
    );
}

interface PeakDrawerProps {
    peaks: [[number, string][], string[]];
    start: number;
    colorSettings: ColorSettings;
}

function PeakDrawer({ peaks, start, colorSettings }: PeakDrawerProps) {
    const [index, hash] = peaks[0][start];
    const parentHash = peaks[1][start];

    if (start == peaks[0].length - 1)
        return (
            <div
                className="relative z-10 flex aspect-square w-12 items-center justify-center rounded-full border-[3px] bg-black transition-colors"
                style={{
                    borderColor: colorSettings[start == 0 ? `root` : `peak`],
                }}
            >
                {start == 0 ? (
                    <span className="text-xs">root</span>
                ) : (
                    <span>{index}</span>
                )}
                <span className="z-12 group absolute top-12 rounded bg-neutral-800 p-1 text-sm">
                    {hash.substring(0, 8)}
                    {hash.length > 8 && `...`}
                    <input
                        value={hash}
                        disabled
                        className="absolute bottom-full right-1/2 z-50 hidden max-w-[8rem] translate-x-1/2 rounded border border-white bg-black p-2 text-center group-hover:block"
                    />
                </span>
            </div>
        );

    return (
        <div className="relative">
            <div
                className="relative z-10 flex aspect-square w-12 items-center justify-center rounded-full border-[3px] bg-black transition-colors"
                style={{
                    borderColor:
                        colorSettings[start == 0 ? `root` : `standard`],
                }}
            >
                {start == 0 && <span className="text-xs">root</span>}
                <span className="z-12 group absolute top-12 rounded bg-neutral-800 p-1 text-sm">
                    {parentHash.substring(0, 8)}
                    {parentHash.length > 8 && `...`}
                    <input
                        value={parentHash}
                        disabled
                        className="absolute bottom-full right-1/2 z-50 hidden max-w-[8rem] translate-x-1/2 rounded border border-white bg-black p-2 text-center group-hover:block"
                    />
                </span>
            </div>

            <div className="absolute -left-12 top-6 h-24 w-[4.5rem]">
                <Line side="left" color={colorSettings.standard} />
            </div>
            <div />
            <div className="-mt-6 ml-6 h-24 w-[4.5rem]">
                <Line side="right" color={colorSettings.standard} />
            </div>

            <div
                className="absolute left-[-4.5rem] top-24 z-10 flex aspect-square w-12 items-center justify-center rounded-full border-[3px] bg-black transition-colors"
                style={{
                    borderColor: colorSettings.peak,
                }}
            >
                <span>{index}</span>
                <span className="group absolute top-12 rounded bg-neutral-800 p-1 text-sm">
                    {hash.substring(0, 8)}
                    {hash.length > 8 && `...`}
                    <input
                        value={hash}
                        disabled
                        className="absolute bottom-full right-1/2 z-50 hidden max-w-[8rem] translate-x-1/2 rounded border border-white bg-black p-2 text-center group-hover:block"
                    />
                </span>
            </div>

            <div className="-mt-6 ml-[4.5rem]">
                <PeakDrawer {...{ peaks, colorSettings }} start={start + 1} />
            </div>
        </div>
    );
}
