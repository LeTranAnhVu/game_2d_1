class Sprite {
    constructor({context, position, imageSrc}) {
        this.context = context
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
    }

    create() {
        if (!this.image) return
        this.context.drawImage(this.image, this.position.x, this.position.y)
        return this
    }
}

export default Sprite