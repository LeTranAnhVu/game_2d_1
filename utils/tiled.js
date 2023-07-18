import Box from "../entities/Box.js";

export function from1DTo2D(tiles, columns) {
    let twoDArr = []
    let clonedTiles = [...tiles]
    let rowIndex = 0
    let columnIndex = 0
    while (clonedTiles.length) {
        if (!twoDArr[rowIndex]) {
            twoDArr[rowIndex] = []
        }
        const tile = clonedTiles.shift()
        twoDArr[rowIndex].push(tile)
        columnIndex++
        if (columnIndex === columns) {
            columnIndex = 0
            rowIndex++
        }
    }


    return twoDArr
}

export function buildBoxesFromTiles(twoDTiles, context, sizePerTile) {
    let boxes = []
    for (let row = 0; row < twoDTiles.length; row++) {
        const tilesInARow = twoDTiles[row]
        for (let column = 0; column < tilesInARow.length; column++) {
            if (tilesInARow[column]) {
                boxes.push(
                    new Box({
                        context: context,
                        position: {x: column * sizePerTile, y: row * sizePerTile},
                        width: sizePerTile,
                        height: sizePerTile,
                        color: 'rgba(255,37,116,0.47)',
                        gravity: null
                    })
                )
            }
        }
    }

    return boxes
}