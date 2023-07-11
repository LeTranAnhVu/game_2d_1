class Sprite {
    constructor({context, position, imageSrc, frameRate = 1}) {
        this.context = context
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
        this.frameRate = frameRate
        this.croppedWidth = this.image.width / this.frameRate
    }


    create() {
        if (!this.image) return
        this.context.fillStyle = 'rgba(255, 0, 0, 0.2)'
        this.context.fillRect(this.position.x, this.position.y, this.croppedWidth, this.image.height)


        this.context.drawImage(
            this.image,
            0, 0,
            this.croppedWidth, this.image.height,
            this.position.x, this.position.y,
            this.croppedWidth, this.image.height,
        )
    }
}

export default Sprite