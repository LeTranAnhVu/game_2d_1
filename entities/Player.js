import Sprite from "./Sprite.js";

function isCollided(boxA, boxB) {
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
        const index = overlaps.indexOf(minValue)
        return index + 1 // 1 ==> left, 2 ==> top, 3 ==> right, 4 ==> bottom
    }

    return 0
}

class Player extends Sprite {
    constructor({context, position, gravity, image, obstacles = []}) {
        const {imageSrc, frameRate, frameDelay} = image
        super({context, position, imageSrc, frameRate, frameDelay: frameDelay})
        this.position = position
        this.gravity = gravity
        this.velocity = {x: 0, y: 0}
        this.isJumping = false
        this.maxJumpCount = 2
        this.jumpCount = 0
        this.hitBox = {
            relativePosition: {
                x: 64, y: 45
            }, width: 35, height: 64
        }

        this.obstacles = obstacles
        this.collidedObstacle = null
    }

    events = {
        landed: []
    }

    hitBox = {
        relativePosition: {
            x: 64, y: 45
        }, width: 35, height: 64
    }

    createHitBox() {
        if (!this.hitBox) return
        this.context.fillStyle = 'rgba(0, 255, 0, 0.2)'
        this.context.fillRect(
            this.position.x + this.hitBox.relativePosition.x,
            this.position.y + this.hitBox.relativePosition.y,
            this.hitBox.width,
            this.hitBox.height)
    }

    isMovingLeft = () => this.velocity.x < 0
    isMovingRight = () => this.velocity.x > 0
    isMovingUp = () => this.velocity.y < 0
    isFalling = () => this.velocity.y > 0

    applyMovement() {
        for (let obstacle of this.obstacles) {
            const pos = isCollided(this, obstacle)
            if (pos) {
                if (this.isMovingUp() && pos === 2) {
                    this.velocity.y = 0
                    this.position.y = obstacle.position.y + obstacle.height
                    break
                }

                if (this.isFalling() && pos === 4) {
                    this.velocity.y = 0
                    this.position.y = obstacle.position.y - this.height
                    break
                }
                if (this.isMovingLeft() && pos === 1) {
                    this.velocity.x = 0
                    this.position.x = obstacle.position.x + obstacle.width
                    break
                }

                if (this.isMovingRight() && pos === 3) {
                    this.velocity.x = 0
                    this.position.x = obstacle.position.x - this.width
                    break
                }
            }
        }

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if (this.position.y + this.height >= this.context.canvas.height) {
            this.velocity.y = !this.isMovingUp() ? 0 : this.velocity.y
            this.position.y = this.context.canvas.height - this.height
        }

    }

    addGravity() {
        this.velocity.y += this.gravity
    }

    play() {
        this.create()
        this.createHitBox()
        this.animate()
        this.applyMovement()
        if (this.velocity.y === 0) {
            // Reset the jumping state
            this.isJumping = false
            this.jumpCount = 0

            // Handle 'landed' event if it has
            if (this.events.landed.length) {
                for (const event of this.events.landed) {
                    event()
                }
                this.events.landed = []
            }
        }

        this.addGravity()
        return this
    }

    stopHorizontalMovement() {
        this.events.landed.push(() => {
            this.velocity.x = 0
        })
    }

    moveLeft(speed) {
        this.velocity.x = 0 - speed
    }

    moveRight(speed) {
        this.velocity.x = speed
    }

    jump(speed) {
        // Ignore when it is jumping
        if (this.isJumping) {
            return
        }

        this.jumpCount++
        this.velocity.y = 0 - speed
        this.isJumping = true
    }

    // End a jump action
    endJump() {
        if (this.jumpCount < this.maxJumpCount) {
            this.isJumping = false
        }
    }
}

export default Player