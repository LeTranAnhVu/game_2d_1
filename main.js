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
import Box from "./entities/Box.js";
import box from "./entities/Box.js";
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


const box1 = new Box({
    context: cxt,
    position: {x: 600, y:0},
    width: 90,
    height: 100,
    color: 'rgb(255,37,116)',
    gravity: GRAVITY
})


const box2 = new Box({
    context: cxt,
    position: {x: 0, y:0},
    width: 200,
    height: 60,
    color: 'rgb(255,37,116)',
    gravity: GRAVITY
})

const box3 = new Box({
    context: cxt,
    position: {x: 550, y:270},
    width: 400,
    height: 60,
    color: 'rgb(255,37,116)',
    gravity: null
})

const box4 = new Box({
    context: cxt,
    position: {x: 700, y:0},
    width: 90,
    height: 150,
    color: 'rgb(255,37,116)',
    gravity: GRAVITY
})

const box5 = new Box({
    context: cxt,
    position: {x: 800, y:0},
    width: 90,
    height: 50,
    color: 'rgb(255,37,116)',
    gravity: GRAVITY
})

const obstacles = [box1, box2, box3, box4, box5]

const playerA = new Player({
    context: cxt,
    position: {x: 500, y: 300},
    gravity: GRAVITY,
    image: playerImages.idle,
    obstacles: obstacles
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
    obstacles.forEach(object => object.play())
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
