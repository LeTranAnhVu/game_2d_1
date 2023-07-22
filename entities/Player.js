import Sprite from "./Sprite.js";
import {isCollided} from "../utils/IsCollided.js";

class Player extends Sprite {
    constructor({context, position, gravity, animations, scale, obstacles = []}) {
        super({context, position, scale, image: animations.idle})
        this.isRightDirection = true
        this.animations = animations
        this.currentAnimation = animations.idle
        this.position = position
        this.gravity = gravity
        this.velocity = {x: 0, y: 0}
        this.isJumping = false
        this.maxJumpCount = 2
        this.jumpCount = 0
        this.obstacles = obstacles
    }

    events = {
        landed: []
    }

    getHitBox() {
        const width = 38 * this.scale
        const height = 64  * this.scale
        const x = this.position.x + this.width / 2 - width / 2
        const y = this.position.y + this.height - height
        return {
            position: {
                x: x,
                y: y
            },
            width: width,
            height: height
        }
    }

    getCameraView() {
        const width = 380 * this.scale
        const height = 170  * this.scale
        const x = this.position.x + this.width / 2 - width / 2
        const y = this.position.y + this.height - height
        return {
            position: {
                x: x,
                y: y
            },
            width: width,
            height: height
        }
    }

    findThePossibleCollidedObstacles() {
        const hitBox = this.getHitBox()
        const horizontalHitBoxCenter = (hitBox.position.x + hitBox.position.x + hitBox.width) / 2
        let collidedObstacles = this.obstacles.filter(o => {
            return o.position.x - o.width <= horizontalHitBoxCenter && horizontalHitBoxCenter <= o.position.x + o.width + o.width
        })
        return collidedObstacles
    }

    createHitBox() {
        const hitBox = this.getHitBox()
        if (!hitBox) return
        this.context.fillStyle = 'rgba(0, 255, 0, 0.2)'
        this.context.fillRect(
            hitBox.position.x,
            hitBox.position.y,
            hitBox.width,
            hitBox.height)
    }

    createCameraView() {
        const cam = this.getCameraView()
        if (!cam) return
        this.context.fillStyle = 'rgba(222,185,129,0.43)'
        this.context.fillRect(
            cam.position.x,
            cam.position.y,
            cam.width,
            cam.height)
    }

    shouldPanCameraToTheRight(bgRight, cb){
        const cam = this.getCameraView()
        if(!cam) return
        const camRight = cam.position.x + cam.width

        if(camRight >= 2304/4) return

        if(camRight >= bgRight){
            cb(camRight-bgRight)
        }
    }

    shouldPanCameraToTheLeft(bgLeft, cb){
        const cam = this.getCameraView()
        if(!cam) return

        if(cam.position.x <= 0) return

        if(cam.position.x <= bgLeft){
            cb(bgLeft - cam.position.x)
        }
    }

    isMovingLeft = () => this.velocity.x < 0
    isMovingRight = () => this.velocity.x > 0
    isMovingUp = () => this.velocity.y < 0
    isFalling = () => this.velocity.y > 0

    applyMovement() {
        const hitBox = this.getHitBox()
        const collidedObstacles = this.findThePossibleCollidedObstacles()
        for (let obstacle of collidedObstacles) {
            const pos = isCollided(hitBox, obstacle)
            if (pos) {
                if (this.isMovingUp() && pos === 2) {
                    this.velocity.y = 0
                    this.position.y = obstacle.position.y + obstacle.height - Math.abs(this.height - hitBox.height) - 0.01
                    // break
                } else if (this.isFalling() && pos === 4) {
                    this.velocity.y = 0
                    this.position.y = obstacle.position.y - this.height + 0.01
                    // break
                }

                if (this.isMovingLeft() && pos === 1) {
                    this.velocity.x = 0
                    this.position.x = obstacle.position.x + obstacle.width - (this.width - hitBox.width) / 2 + 0.02 // TODO fix it later
                    // break
                } else if (this.isMovingRight() && pos === 3) {
                    this.velocity.x = 0
                    this.position.x = obstacle.position.x - this.width + (this.width - hitBox.width) / 2 - 0.02

                    // break
                }
            }
        }

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if (this.position.y + this.height >= 1728 / 4 && this.isFalling()) {
            this.velocity.y = 0
            this.position.y = 1728 / 4 - this.height
        }

        // Block left
        if (this.position.x <= 0 - (this.width - hitBox.width) / 2 && this.isMovingLeft()) {
            this.velocity.x = 0
            this.position.x = 0 - (this.width - hitBox.width) / 2
        }

        // Block right
        if (this.position.x + this.width >= 2304/4 + (this.width - hitBox.width) / 2 && this.isMovingRight()) {
            this.velocity.x = 0
            this.position.x = 2304/4 + (this.width - hitBox.width) / 2 - this.width
        }
    }
    addGravity() {
        this.velocity.y += this.gravity
    }

    play() {
        if(!this.create()) return false
        // this.createHitBox()
        // this.createCameraView()
        this.animate()

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
        this.applyMovement()

        let nextAnimation = this.animations.idle
        if (this.isMovingUp()) {
            nextAnimation = this.isRightDirection ? this.animations.jump : this.animations.jumpLeft
        } else if (this.isFalling()) {
            nextAnimation = this.isRightDirection ? this.animations.fall : this.animations.fallLeft
        } else if (this.isMovingLeft()) {
            nextAnimation = this.animations.runLeft
        } else if (this.isMovingRight()) {
            nextAnimation = this.animations.run
        } else {
            nextAnimation = this.isRightDirection ? this.animations.idle : this.animations.idleLeft
        }

        if (this.currentAnimation.imageSrc !== nextAnimation.imageSrc) {
            this.changeImage(nextAnimation)
            this.currentAnimation = nextAnimation
        }

        return this
    }

    stopHorizontalMovement() {
        this.events.landed.push(() => {
            this.velocity.x = 0
        })
    }

    moveLeft(speed) {
        this.velocity.x = 0 - speed
        this.isRightDirection = false
    }

    moveRight(speed) {
        this.velocity.x = speed
        this.isRightDirection = true
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