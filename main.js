import './style.css'
import Player from "./entities/Player.js"
import Sprite from "./entities/Sprite.js";
import bgUrl from "./public/background.png"
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

const bg = new Sprite({context: cxt, position: {x: 0, y: 0 }, imageSrc: bgUrl})
const playerA = new Player(cxt, 'red', 300, 100, 50, 50, GRAVITY, {x: 9, y: 25})

function play() {
    window.requestAnimationFrame(play)

    // Zoom in

    // All the dimension of unscale objects should be divided by scale factor when it calculates inside this zoom in
    zoom(cxt, BG_SCALE, () => {
        cxt.translate(0,   -bg.image.height + scaledCanvas.height)
        bg.create()
    })

    playerA.create().play()
}

play()

window.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'a'].includes(event.key)) {
        playerA.moveLeft()
    } else if (['ArrowRight', 'd'].includes(event.key)) {
        playerA.moveRight()
    } else if (['ArrowDown', 's'].includes(event.key)) {
        // don't need
    } else if ([' ', 'w', 'ArrowUp'].includes(event.key)) {
        // Jump
        playerA.jump()
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
