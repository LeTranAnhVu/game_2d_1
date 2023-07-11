class Sprite {
    constructor({context, position, imageSrc, frameRate = 1, frameDelay = 1}) {
        this.context = context
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
        this.frameRate = frameRate
        this.croppedWidth = this.image.width / this.frameRate
        this.sourceX = 0
        this.currentFrame = 0
        this.frameDelay = frameDelay
    }

    create() {
        if (!this.image) return
        this.context.fillStyle = 'rgba(255, 0, 0, 0.2)'
        this.context.fillRect(this.position.x, this.position.y, this.croppedWidth, this.image.height)
        this.context.drawImage(
            this.image,
            this.sourceX, 0,
            this.croppedWidth, this.image.height,
            this.position.x, this.position.y,
            this.croppedWidth, this.image.height,
        )
    }

    animate() {
        if (this.currentFrame < this.frameRate * this.frameDelay) {
            this.currentFrame++
        } else {
            this.currentFrame = 1
        }

        if (this.currentFrame % this.frameDelay === 0) {
            this.sourceX = this.croppedWidth * (this.currentFrame / this.frameDelay -1)
        }
    }
}

export default Sprite