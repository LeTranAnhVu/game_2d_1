class Player {
    constructor(context, color, initialX, initialY, width, height, gravity, abilityVelocity = {x: 0, y: 0}) {
        this.context = context
        this.color = color
        this.x = initialX
        this.y = initialY
        this.width = width
        this.height = height
        this.gravity = gravity
        this.velocity = {x: 0, y: 0}
        this.abilityVelocity = abilityVelocity
        this.isJumping = false
        this.maxJumpCount = 2
        this.jumpCount = 0
    }

    events = {
        landed : []
    }

    create() {
        this.context.fillStyle = this.color
        this.context.fillRect(this.x, this.y, this.width, this.height)
        return this
    }

    play() {
        this.y += this.velocity.y
        this.x += this.velocity.x

        // Gravity
        if (this.y + this.height < this.context.canvas.height) {
            this.velocity.y += this.gravity
        } else {
            // Landing

            // Stop falling as the ground
            this.velocity.y = 0
            this.y = this.context.canvas.height - this.height

            // Reset the jumping state
            this.isJumping = false
            this.jumpCount = 0

            // Handle 'landed' event if it has
            if(this.events.landed.length){
                for(const event of this.events.landed){
                    event()
                }
                this.events.landed = []
            }
        }

        return this
    }

    stopHorizontalMovement() {
        // Handle it later
        this.events.landed.push(() => {this.velocity.x = 0})
    }

    moveLeft() {
        this.velocity.x = 0 - this.abilityVelocity.x
    }

    moveRight() {
        this.velocity.x = this.abilityVelocity.x
    }

    jump() {
        // Ignore when it is jumping
        if (this.isJumping) {
            return
        }

        this.jumpCount++
        this.velocity.y = 0 - this.abilityVelocity.y
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