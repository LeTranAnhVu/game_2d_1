import './style.css'
import Player from "./entities/Player.js"
import Sprite from "./entities/Sprite.js";
import bgUrl from "./public/background.png"
import idleUrl from "./public/player/Idle.png"
import idleLeftUrl from "./public/player/IdleLeft.png"
import runUrl from "./public/player/Run.png"
import runLeftUrl from "./public/player/RunLeft.png"
import fallUrl from "./public/player/Fall.png"
import fallLeftUrl from "./public/player/FallLeft.png"
import jumpUrl from "./public/player/Jump.png"
import jumpLeftUrl from "./public/player/JumpLeft.png"
import {buildBoxesFromTiles, from1DTo2D} from "./utils/tiled.js";
import {tiledFloorCollisions, tiledPlatformCollisions} from "./utils/tiledCollisions.js";

const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 576
const GRAVITY = 9.8 / 20
const canvas = document.querySelector('canvas')
const cxt = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

const BG_SCALE = 4

const scaledCanvas = {
    height: CANVAS_HEIGHT / BG_SCALE,
    width: CANVAS_WIDTH / BG_SCALE
}

function zoom(context, scale, cb) {
    context.save()
    context.scale(scale, scale)

    cb()
    context.restore()
}

const playerAnimations = {
    idle: {
        imageSrc: idleUrl,
        frameRate: 8,
        frameDelay: 2
    },
    idleLeft: {
        imageSrc: idleLeftUrl,
        frameRate: 8,
        frameDelay: 2
    },
    run: {
        imageSrc: runUrl,
        frameRate: 8,
        frameDelay: 4
    },
    runLeft: {
        imageSrc: runLeftUrl,
        frameRate: 8,
        frameDelay: 4
    },
    fall: {
        imageSrc: fallUrl,
        frameRate: 2,
        frameDelay: 2
    },
    fallLeft: {
        imageSrc: fallLeftUrl,
        frameRate: 2,
        frameDelay: 2
    },
    jump: {
        imageSrc: jumpUrl,
        frameRate: 2,
        frameDelay: 2
    },
    jumpLeft: {
        imageSrc: jumpLeftUrl,
        frameRate: 2,
        frameDelay: 2
    },
}

const bg = new Sprite({context: cxt, position: {x: 0, y: 0}, image: {imageSrc: bgUrl, frameRate: 1, frameDelay: 1}})

const floorCollisionTiles = from1DTo2D(tiledFloorCollisions, 36)
const floorCollisionBoxes = buildBoxesFromTiles(floorCollisionTiles, cxt, 16)

const platformCollisionTiles = from1DTo2D(tiledPlatformCollisions, 36)
const platformCollisionBoxes = buildBoxesFromTiles(platformCollisionTiles, cxt, 16)

const playerA = new Player({
    context: cxt,
    position: {x: 0, y: 200},
    gravity: GRAVITY,
    scale: 0.5,
    animations: playerAnimations,
    obstacles: floorCollisionBoxes,
    platformObstacles: platformCollisionBoxes,
    // environment: {
    //     width: 576,
    //     height: 432
    // }
})
const camera = {
    position: {
        x: 0,
        y: undefined
    },

    width: scaledCanvas.width,
    height: scaledCanvas.height
}

function play() {
    window.requestAnimationFrame(play)

    // Zoom in
    // All the dimension of unscale objects should be divided by scale factor when it calculates inside this zoom in
    zoom(cxt, BG_SCALE, () => {
        const translateY = isNaN(camera.position.y) ? -bg.height + scaledCanvas.height : camera.position.y
        cxt.translate(camera.position.x, translateY)
        bg.create()
        camera.position.y = camera.position.y === undefined || isNaN(camera.position.y) ? -bg.height + scaledCanvas.height : camera.position.y
        // floorCollisionBoxes.forEach(b => b.play())
        // platformCollisionBoxes.forEach(b => b.play())

        playerA.loadEnvironment({width: bg.width, height: bg.height})
        playerA.play()
        playerA.shouldPanCameraToTheLeft(Math.abs(camera.position.x), (delta) => {
            camera.position.x += delta
        })
        playerA.shouldPanCameraToTheRight(scaledCanvas.width + Math.abs(camera.position.x), (delta) => {
            camera.position.x -= delta
        })

        playerA.shouldPanCameraToTheTop(Math.abs(camera.position.y), (delta) => {
            camera.position.y += delta
        })

        playerA.shouldPanCameraToTheBottom((Math.abs(camera.position.y) + scaledCanvas.height / 1.5) , (delta) => {
            if (camera.position.y  <= -bg.height + scaledCanvas.height) {
                camera.position.y = -bg.height + scaledCanvas.height
            } else {
                camera.position.y -= delta
            }
        })
    })
}

play()

window.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'a'].includes(event.key)) {
        playerA.moveLeft(3)
    } else if (['ArrowRight', 'd'].includes(event.key)) {
        playerA.moveRight(3)
    } else if (['ArrowDown', 's'].includes(event.key)) {
        // don't need
    } else if ([' ', 'w', 'ArrowUp'].includes(event.key)) {
        // Jump
        playerA.jump(6)
    }
})

window.addEventListener('keyup', (event) => {
    if (['ArrowLeft', 'a'].includes(event.key)) {
        playerA.stopHorizontalMovement()
    } else if (['ArrowRight', 'd'].includes(event.key)) {
        playerA.stopHorizontalMovement()
    } else if (['ArrowDown', 's'].includes(event.key)) {
        // don't need
    } else if ([' ', 'w', 'ArrowUp'].includes(event.key)) {
        playerA.endJump()
    }
})
