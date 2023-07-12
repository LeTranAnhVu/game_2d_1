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
const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 576
const GRAVITY = 9.8 / 6
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

const playerImages = {
    idle: {
        imageSrc: idleUrl,
        frameRate: 8,
        frameDelay: 3
    },
    idleLeft: {
        imageSrc: idleLeftUrl,
        frameRate: 8,
        frameDelay: 3
    },
    run: {
        imageSrc: runUrl,
        frameRate: 8,
        frameDelay: 3
    },
    runLeft: {
        imageSrc: runLeftUrl,
        frameRate: 8,
        frameDelay: 3
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

const bg = new Sprite({context: cxt, position: {x: 0, y: 0 }, imageSrc: bgUrl})
const playerA = new Player({
    context: cxt,
    position: {x: 100, y: 300},
    gravity: GRAVITY,
    image: playerImages.idle
})

function play() {
    window.requestAnimationFrame(play)

    // Zoom in

    // All the dimension of unscale objects should be divided by scale factor when it calculates inside this zoom in
    zoom(cxt, BG_SCALE, () => {
        cxt.translate(0,   - bg.height + scaledCanvas.height)
        bg.create()
    })

    playerA.play()
}

play()

window.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'a'].includes(event.key)) {
        playerA.moveLeft(9)
    } else if (['ArrowRight', 'd'].includes(event.key)) {
        playerA.moveRight(9)
    } else if (['ArrowDown', 's'].includes(event.key)) {
        // don't need
    } else if ([' ', 'w', 'ArrowUp'].includes(event.key)) {
        // Jump
        playerA.jump(25)
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
