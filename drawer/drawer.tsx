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
    peaks?: number[];
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
        <div className="max-w-full overflow-x-auto overflow-y-hidden">
            <div className="-mb-3 w-max px-10 py-4">
                <CustomDrawer
                    {...props}
                    _updateIndex={updateIndex}
                    _isParentVirtual={true}
                />
                {peaks !== undefined && (
                    <>
                        <p className="w-60 py-4 text-center">Peaks</p>
                        <PeakDrawer
                            peaks={peaks}
                            start={0}
                            colorSettings={props.colorSettings}
                        />
                    </>
                )}
            </div>
        </div>
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
    peaks: number[];
    start: number;
    colorSettings: ColorSettings;
}

function PeakDrawer({ peaks, start, colorSettings }: PeakDrawerProps) {
    if (start == peaks.length - 1)
        return (
            <div
                className={`grid w-full grid-cols-[6rem_3rem_1fr] grid-rows-[auto_3rem_auto] ${
                    start != 0 ? `translate-x-[-4.5rem]` : ``
                }`}
            >
                <div />
                <div
                    className="relative z-10 mx-auto flex aspect-square w-12 items-center justify-center rounded-full border-[3px] bg-black transition-colors"
                    style={{
                        borderColor: colorSettings.peak,
                    }}
                >
                    <span>{peaks[start]}</span>
                </div>
            </div>
        );
    return (
        <div
            className={`grid w-full grid-cols-[6rem_3rem_1fr] grid-rows-[auto_3rem_auto] ${
                start != 0 ? `translate-x-[-4.5rem]` : ``
            }`}
        >
            <div />
            <div
                className="relative z-10 flex aspect-square items-center justify-center rounded-full border-[3px] bg-black transition-colors"
                style={{
                    borderColor:
                        colorSettings[start == 0 ? `root` : `standard`],
                }}
            />
            <div />

            <div className="relative w-full">
                <div className="absolute -inset-y-6 -right-6 left-1/2">
                    <Line side="left" color={colorSettings.standard} />
                </div>
            </div>
            <div />
            <div className="relative w-24">
                <div className="absolute -inset-y-6 -left-6 right-1/2">
                    <Line side="right" color={colorSettings.standard} />
                </div>
            </div>
            <div
                className="relative z-10 mx-auto flex aspect-square w-12 items-center justify-center rounded-full border-[3px] bg-black transition-colors"
                style={{
                    borderColor: colorSettings.peak,
                }}
            >
                <span>{peaks[start]}</span>
            </div>
            <div />
            <PeakDrawer {...{ peaks, colorSettings }} start={start + 1} />
        </div>
    );
}
