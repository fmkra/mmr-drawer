export function Line({ side, color }: { side: 'left' | 'right'; color: string }) {
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
                stroke={color}
                x1={side == 'right' ? 0 : 1}
                y1={0}
                x2={side == 'left' ? 0 : 1}
                y2={1}
            />
        </svg>
    )
}
