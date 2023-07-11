import './style.css'
import Player from "./Player.js"

const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 576
const GRAVITY = 9.8 / 6
const canvas = document.querySelector('canvas')
const cxt = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

function refreshFrame(context) {
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
}

const playerA = new Player(cxt, 'red', 300, 100, 50, 50, GRAVITY, {x: 9, y: 25})

function play() {
    window.requestAnimationFrame(play)
    refreshFrame(cxt)
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
