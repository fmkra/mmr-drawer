'use client'

import { Drawer, useMmr } from '@/drawer'
import { useMemo, useState } from 'react'
import L from 'react-latex-next'
import 'katex/dist/katex.min.css'

function Hovered({ f, children }: { f: (b: boolean) => void; children: React.ReactNode }) {
    return (
        <span className="text-blue-500 hover:cursor-pointer relative">
            {children}
            <span onMouseEnter={() => f(true)} onMouseLeave={() => f(false)} className="block absolute inset-0"></span>
        </span>
    )
}

export function Animation({ size: s, node }: { size: number; node: number }) {
    const { root, size, virtual } = useMmr(s)
    const [leftmostLit, setLeftmostLit] = useState(false)

    const [subtreeRoot, setSubtreeRoot] = useState(0)
    const [currentNode, setCurrentNode] = useState(0)
    const jumpNode =
        subtreeRoot == currentNode
            ? 0
            : currentNode > subtreeRoot / 2
            ? currentNode - Math.floor(subtreeRoot / 2)
            : currentNode

    const leftmostNodes = useMemo(() => {
        const nodes: Record<number, string> = {}
        let v = virtual.size
        while (v > 0) {
            nodes[v] = `#3b83f6`
            v = Math.floor(v / 2)
        }
        return nodes
    }, [virtual.size])

    const page1 = () => {
        setPage(node == virtual.size ? 3 : 1)
        setSubtreeRoot(virtual.size)
        setCurrentNode(node)
    }

    const page2 = () => {
        setPage(2)
        const newSubtreeRoot = Math.floor(subtreeRoot / 2)
        setSubtreeRoot(newSubtreeRoot)
        setCurrentNode(jumpNode)
        if (newSubtreeRoot == jumpNode) {
            setPage(3)
        }
    }

    const pages = {
        0: (
            <>
                <p className="my-2">
                    First, let&apos;s notice that it&apos;s easy to calculate getHeight for{' '}
                    <Hovered f={setLeftmostLit}>left-most</Hovered> vertices. They always have <L>$2^n-1$</L> index and
                    height <L>$n-1$</L>, so to calculate their heights we can just take length of the bit representation
                    of the index and subtract 1.
                </p>
                <p className="my-2">
                    To generalize this, we need to somehow jump from the given node to the left-most node without
                    changing the height in the process.
                </p>
                <button
                    className="block mx-auto px-4 py-1 border border-white rounded-md transition-all hover:bg-white hover:text-black"
                    onClick={() => page1()}
                >
                    Next
                </button>
            </>
        ),
        1: (
            <>
                <p className="my-2">
                    So to achieve that, we will start from the root node. Let&apos;s say its index is <L>$2^n-1$</L>.
                    Now, if the given node is in the right subtree, we need to jump to the corresponding node in the
                    left subtree. To do that, we need to use the observation that in the left subtree, the indices are
                    in range <L>{`$[1;2^{n-1}-1]$`}</L>, and in the right subtree, the indices are in range{' '}
                    <L>{`$[2^{n-1};2^n-2]$`}</L>. This also means that the difference between corresponding nodes in the
                    left and right subtrees is <L>{`$2^{n-1}-1$`}</L>. So to jump to the left subtree, we need to
                    subtract that from the current index. If the given node is already in the left subtree, we
                    don&apos;t do anything.
                </p>
                <p className="my-2">
                    In our case the root node is <L>{`$${virtual.size}$`}</L>. Since our input node -{` `}
                    <L>{`$${node}$`}</L>
                    {' is in range '}
                    {node > virtual.size / 2 ? (
                        <L>{`$[${Math.ceil(virtual.size / 2)}; ${
                            virtual.size - 1
                        }]$ it means that current node is in the right subtree, so we need to subtract $${Math.floor(
                            virtual.size / 2
                        )}$ to jump to the corresponding node in the left subtree.`}</L>
                    ) : (
                        <L>{`$[1;${Math.floor(
                            virtual.size / 2
                        )}]$ it means that current node is already in the left subtree, so we don't need to do anything.`}</L>
                    )}
                </p>
                <button
                    className="block mx-auto px-4 py-1 border border-white rounded-md transition-all hover:bg-white hover:text-black"
                    onClick={() => page2()}
                >
                    Next
                </button>
            </>
        ),
        2: (
            <>
                <p className="my-2">
                    Now, we take the left child of the root as a new root and repeat the process. We keep doing that
                    until our current node reaches the subtree root. The number of steps we need to take is at most the
                    height of the tree.
                </p>
                <p className="my-2">
                    In this case the current root is <L>{`$${subtreeRoot}$`}</L>. Since our current node -{` `}
                    <L>{`$${currentNode}$`}</L>
                    {' is in range '}
                    {currentNode > subtreeRoot / 2 ? (
                        <L>{`$[${Math.ceil(subtreeRoot / 2)}; ${
                            subtreeRoot - 1
                        }]$ it means that current node is in the right subtree, so we need to subtract $${Math.floor(
                            subtreeRoot / 2
                        )}$ to jump to the corresponding node in the left subtree.`}</L>
                    ) : (
                        <L>{`$[1;${Math.floor(
                            subtreeRoot / 2
                        )}]$, it means that current node is already in the left subtree, so we don't need to do anything.`}</L>
                    )}
                </p>
                <button
                    className="block mx-auto px-4 py-1 border border-white rounded-md transition-all hover:bg-white hover:text-black"
                    onClick={() => page2()}
                >
                    Next
                </button>
            </>
        ),
        3: (
            <>
                <p className="my-2">
                    Because{' '}
                    {node == virtual.size
                        ? `the queried node is also the root, we can just`
                        : `the current node reached our subtree root node, we can finish jumping and`}{' '}
                    calculate bit length of the {node != virtual.size && `current`} node.{' '}
                    <L>{`$${currentNode}$ is $${currentNode.toString(2)}$`}</L> in binary, so its bit length is{' '}
                    <L>{`$${currentNode.toString(2).length}$`}</L>. Therefore, the answer is{' '}
                    <L>{`$${currentNode.toString(2).length - 1}$`}</L>.
                </p>
                <p className="my-2">
                    <L>{`\\[\\operatorname{getHeight}(${node}) = ${currentNode.toString(2).length - 1}\\]`}</L>
                </p>
            </>
        ),
    }
    const [page, setPage] = useState<keyof typeof pages>(0)

    return (
        <>
            <Drawer
                node={root}
                size={size}
                showVirtual={true}
                overwriteNodeColor={{
                    [subtreeRoot]: '#ff0',
                    [jumpNode]: '#43f0ed',
                    [currentNode]: '#0f0',
                    ...(leftmostLit ? leftmostNodes : {}),
                }}
                colorSettings={{
                    standard: '#fff',
                    virtual: '#444',
                    peak: '#fff',
                }}
            />

            <div className="mx-auto mb-8 px-2 max-w-5xl text-justify">
                {page > 0 && (
                    <div className="flex flex-wrap gap-4 justify-around my-4">
                        {currentNode != subtreeRoot && (
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full border-[3px] border-[#ff0] aspect-square bg-black relative z-10">
                                    <span>{subtreeRoot}</span>
                                </div>
                                <span className="shrink-0">Subtree root</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full border-[3px] border-[#0f0] aspect-square bg-black relative z-10">
                                <span>{currentNode}</span>
                            </div>
                            <span className="shrink-0">Current node</span>
                        </div>
                        {currentNode != jumpNode && jumpNode != 0 && (
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full border-[3px] aspect-square bg-black relative z-10 border-[#43f0ed]">
                                    <span>{jumpNode}</span>
                                </div>
                                <span className="shrink-0">Jump node</span>
                            </div>
                        )}
                    </div>
                )}
                {pages[page]}
            </div>
        </>
    )
}
