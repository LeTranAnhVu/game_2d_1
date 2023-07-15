class Box {
    constructor({context, position, width, height, color = 'red', gravity = null}) {
        this.context = context
        this.position = position
        this.width = width
        this.height = height
        this.color = color
        this.gravity = gravity
        this.velocity = {x: 0, y: 0}
    }

    create() {
        this.context.fillStyle = this.color
        this.context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    applyMovement() {
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
    }

    play() {
        this.create()
        this.applyMovement()
        const y = this.position.y
        const h = this.height
        const canvasH = this.context.canvas.height
        if (this.gravity) {
            // Gravity
            if (y + h < canvasH) {
                this.velocity.y += this.gravity
            } else {
                // Landing
                // Stop falling as the ground
                this.velocity.y = 0
                this.position.y = this.context.canvas.height - h
            }
        }
    }
}

export default Box