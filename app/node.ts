export interface Node {
    index: number
    left: Node | null
    right: Node | null
}

export function getTree(startIndex: number, height: number): Node {
    if (height == 0) {
        return {
            index: startIndex,
            left: null,
            right: null,
        }
    }
    const leftSubtree = getTree(startIndex, height - 1)
    const rightSubtree = getTree(leftSubtree.index + 1, height - 1)
    const rootNode = {
        index: rightSubtree.index + 1,
        left: leftSubtree,
        right: rightSubtree,
    }
    return rootNode
}
