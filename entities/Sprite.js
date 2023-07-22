class Sprite {
    constructor({context, position, image, scale = 1}) {
        this.context = context
        this.position = position
        this.scale = scale
        this.changeImage(image)
    }

    changeImage(imageMeta) {
        this.frameRate = imageMeta.frameRate
        this.sourceX = 0
        this.currentFrame = 0
        this.frameDelay = imageMeta.frameDelay
        const image = new Image()
        image.src = imageMeta.imageSrc
        image.onload = () => {
            this.image = image
            this.width = (this.image.width / this.frameRate) * this.scale
            this.height = this.image.height * this.scale
        }
    }

    create() {
        if (!this.image) return false
        // this.context.fillStyle = 'rgba(255, 0, 0, 0.2)'
        // this.context.fillRect(this.position.x, this.position.y, this.width, this.height)
        this.context.drawImage(
            this.image,
            this.sourceX, 0,
            this.image.width / this.frameRate, this.image.height,
            this.position.x, this.position.y,
            this.width, this.height,
        )

        return true
    }

    animate() {
        if (this.currentFrame < this.frameRate * this.frameDelay) {
            this.currentFrame++
        } else {
            this.currentFrame = 1
        }

        if (this.currentFrame % this.frameDelay === 0) {
            this.sourceX = (this.image.width / this.frameRate) * (this.currentFrame / this.frameDelay - 1)
        }
    }
}

export default Sprite