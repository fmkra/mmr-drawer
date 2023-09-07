function countOnes(n: number): number {
    return n.toString(2).split('1').length - 1
}

export function bitLength(n: number): number {
    return n.toString(2).length
}

export function leafIndexToMmrIndex(leafIndex: number): number {
    return 2 * leafIndex - 1 - countOnes(leafIndex - 1)
}
