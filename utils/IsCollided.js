export function isCollided(boxA, boxB) {
    const aTop = boxA.position.y
    const aBottom = boxA.position.y + boxA.height
    const aLeft = boxA.position.x
    const aRight = boxA.position.x + boxA.width

    const bTop = boxB.position.y
    const bBottom = boxB.position.y + boxB.height
    const bLeft = boxB.position.x
    const bRight = boxB.position.x + boxB.width

    if (aRight >= bLeft &&
        aLeft <= bRight &&
        aBottom >= bTop &&
        aTop <= bBottom) {
        const overlaps = [bRight - aLeft, bBottom - aTop, aRight - bLeft, aBottom - bTop]
        const minValue = Math.min(...overlaps)
        const index = overlaps.lastIndexOf(minValue) // Put the bottom as higher priority
        return index + 1 // 1 ==> left, 2 ==> top, 3 ==> right, 4 ==> bottom
    }

    return 0
}