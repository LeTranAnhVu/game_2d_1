class Sprite {
    constructor({context, position, image, scale = 1, offset = null}) {
        this.context = context
        this.position = position
        this.scale = scale
        this.offset = offset
        this.changeImage(image)
    }

    changeImage(imageMeta) {
        this.frameRate = imageMeta.frameRate
        this.isReversed = !!imageMeta.isReversed
        this.frameDelay = imageMeta.frameDelay
        this.currentFrame = this.isReversed ? this.frameRate * this.frameDelay : 1
        const image = new Image()
        image.src = imageMeta.imageSrc
        image.onload = () => {
            this.image = image
            this.width = (this.image.width / this.frameRate) * this.scale
            this.height = this.image.height * this.scale
            this.sourceX = this.isReversed ? (this.image.width / this.frameRate) * (this.currentFrame / this.frameDelay - 1) : 0
            this.isLoadingImage = false
        }
    }

    create() {
        if (!this.image || this.isLoadingImage) return false
        // this.context.fillStyle = 'rgba(255, 0, 0, 0.2)'
        // this.context.fillRect(this.position.x, this.position.y, this.width, this.height)
        this.context.drawImage(
            this.image,
            this.sourceX, 0,
            this.image.width / this.frameRate, this.image.height + (this.offset?.bottom || 0),
            this.position.x, this.position.y,
            this.width, this.height,
        )

        return true
    }

    animate() {
        if (this.isReversed) {
            if (this.currentFrame > 1) {
                this.currentFrame--
            } else {
                this.currentFrame = this.frameRate * this.frameDelay
            }
            if (this.currentFrame % this.frameDelay === 0) {
                this.sourceX = (this.image.width / this.frameRate) * (this.currentFrame / this.frameDelay - 1)
            }
        } else {
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
}

export default Sprite