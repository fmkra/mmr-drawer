export interface Node {
    index: number;
    left: Node | null;
    right: Node | null;
    hash: string;
}

export type Hasher = (left: string, right: string) => string;

export function getTree(
    startIndex: number,
    height: number,
    hasher: Hasher,
): Node {
    if (height == 0) {
        return {
            index: startIndex,
            left: null,
            right: null,
            hash: '0x0',
        };
    }
    const leftSubtree = getTree(startIndex, height - 1, hasher);
    const rightSubtree = getTree(leftSubtree.index + 1, height - 1, hasher);
    const rootNode = {
        index: rightSubtree.index + 1,
        left: leftSubtree,
        right: rightSubtree,
        hash: hasher(leftSubtree.hash, rightSubtree.hash),
    };
    return rootNode;
}

export function update(
    root: Node,
    index: number,
    value: string,
    hasher: Hasher,
    left: number,
    right: number,
): Node {
    if (left == right) {
        return {
            ...root,
            hash: value,
        };
    }
    const mid = Math.floor(left + right) / 2;
    if (index < mid) {
        const newChild = update(
            root.left as Node,
            index,
            value,
            hasher,
            left,
            mid - 1,
        );
        return {
            ...root,
            left: newChild,
            hash: hasher(newChild.hash, (root.right as Node).hash),
        };
    } else {
        const newChild = update(
            root.right as Node,
            index,
            value,
            hasher,
            mid,
            right - 1,
        );
        return {
            ...root,
            right: newChild,
            hash: hasher((root.left as Node).hash, newChild.hash),
        };
    }
}
