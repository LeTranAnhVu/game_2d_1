import Sprite from "./Sprite.js";

class Player extends Sprite {
    constructor({context, position, imageSrc, gravity, frameRate}) {
        super({context, position, imageSrc, frameRate, frameDelay: 4})
        this.position = position
        this.gravity = gravity
        this.velocity = {x: 0, y: 0}
        this.isJumping = false
        this.maxJumpCount = 2
        this.jumpCount = 0
        this.hitBox = {
            relativePosition: {
                x: 64,
                y: 45
            },
            width: 35,
            height: 64
        }
    }

    events = {
        landed: []
    }

    hitBox = {
        relativePosition: {
            x: 64,
            y: 45
        },
        width: 35,
        height: 64
    }


    createHitBox() {
        if(!this.hitBox) return
        this.context.fillStyle = 'rgba(0, 255, 0, 0.2)'
        this.context.fillRect(
            this.position.x + this.hitBox.relativePosition.x,
            this.position.y + this.hitBox.relativePosition.y,
            this.hitBox.width,
            this.hitBox.height)
    }

    play() {
        this.create()
        this.createHitBox()
        this.animate()

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        const height = this.image.height
        // Gravity
        if (this.position.y + height < this.context.canvas.height) {
            this.velocity.y += this.gravity
        } else {
            // Landing
            // Stop falling as the ground
            this.velocity.y = 0
            this.position.y = this.context.canvas.height - height

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

        return this
    }

    stopHorizontalMovement() {
        // Handle it later
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