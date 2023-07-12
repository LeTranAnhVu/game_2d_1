class Sprite {
    constructor({context, position, imageSrc, frameRate = 1, frameDelay = 1}) {
        this.context = context
        this.position = position
        this.frameRate = frameRate
        this.sourceX = 0
        this.currentFrame = 0
        this.frameDelay = frameDelay
        const image = new Image()
        image.src = imageSrc
        image.onload = () => {
            this.image = image
            this.width = this.image.width / this.frameRate
            this.height = this.image.height
        }
    }

    create() {
        if (!this.image) return
        this.context.fillStyle = 'rgba(255, 0, 0, 0.2)'
        this.context.fillRect(this.position.x, this.position.y, this.width, this.image.height)
        this.context.drawImage(
            this.image,
            this.sourceX, 0,
            this.width, this.image.height,
            this.position.x, this.position.y,
            this.width, this.image.height,
        )
    }

    animate() {
        if (this.currentFrame < this.frameRate * this.frameDelay) {
            this.currentFrame++
        } else {
            this.currentFrame = 1
        }

        if (this.currentFrame % this.frameDelay === 0) {
            this.sourceX = this.width * (this.currentFrame / this.frameDelay - 1)
        }
    }
}

export default Sprite