import { Node } from './node'

function Line({ side }: { side: 'left' | 'right' }) {
    return (
        <svg
            version="1.1"
            baseProfile="tiny"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            className="w-full h-full"
        >
            <line
                fill="none"
                strokeWidth={0.01}
                stroke="#fff"
                x1={side == 'right' ? 0 : 1}
                y1={0}
                x2={side == 'left' ? 0 : 1}
                y2={1}
            />
        </svg>
    )
}

export default function Drawer({ node }: { node: Node }) {
    return (
        <div className="w-full grid grid-cols-[1fr_3rem_1fr] grid-rows-[auto_3rem_auto]">
            <div />
            <div className="flex items-center justify-center rounded-full aspect-square border-[3px] border-white bg-black relative z-10">
                <span className="text">{node.index}</span>
            </div>
            <div />

            <div className="w-full relative">
                <div className="absolute left-1/2 -right-6 -inset-y-6">
                    {node.left !== null && <Line side="left" />}
                </div>
            </div>
            <div />
            <div className="w-full relative">
                <div className="absolute right-1/2 -left-6 -inset-y-6">
                    {node.right !== null && <Line side="right" />}
                </div>
            </div>

            {node.left !== null ? <Drawer node={node.left} /> : <div />}
            <div />
            {node.right !== null ? <Drawer node={node.right} /> : <div />}
        </div>
    )
}

// export default function Drawer({ node }: { node: Node }) {
//     return (
//         <div className="w-full">
//             <div className="w-12 flex items-center justify-center mx-auto rounded-full aspect-square border-[3px] border-white bg-black relative z-10">
//                 <span className="text">{node.index}</span>
//             </div>
//             <div className="flex h-20">
//                 <div className="w-full relative">
//                     <div className="absolute left-1/2 -right-6 -inset-y-6 bg-red-600">
//                         {node.left !== null && <Line side="left" />}
//                     </div>
//                 </div>
//                 <div className="shrink-0 w-12"></div>
//                 <div className="w-full relative">
//                     <div className="absolute right-1/2 -left-6 -inset-y-6 bg-green-600">
//                         {node.right !== null && <Line side="right" />}
//                     </div>
//                 </div>
//             </div>
//             <div className="flex">
//                 {node.left !== null ? <Drawer node={node.left} /> : <div className="w-full"></div>}
//                 <div className="shrink-0 w-12"></div>
//                 {node.right !== null ? <Drawer node={node.right} /> : <div className="w-full"></div>}
//             </div>
//         </div>
//     )
// }
