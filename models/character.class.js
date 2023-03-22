class Character extends MovableObject{
    height = 280;
    y = 155;
    speed = 10;
    IMAGES_WALKING = [
        './img/2_character_pepe/2_walk/W-21.png',
        './img/2_character_pepe/2_walk/W-22.png',
        './img/2_character_pepe/2_walk/W-23.png',
        './img/2_character_pepe/2_walk/W-24.png',
        './img/2_character_pepe/2_walk/W-25.png',
        './img/2_character_pepe/2_walk/W-26.png'
    ];

    world;

constructor() {
    super().loadImage('./img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);

    this.animate();
}

animate() {

    setInterval( () => {
        if(this.world.keyboard.RIGHT || this.world.keyboard.D) {
            this.x += this.speed;
            this.otherDirection = false;
        }

        if(this.world.keyboard.LEFT || this.world.keyboard.A) {
            this.x -= this.speed;
            this.otherDirection = true;
        }
    }, 1000/60);


    setInterval( () => {

        if(this.world.keyboard.RIGHT || this.world.keyboard.D || this.world.keyboard.LEFT || this.world.keyboard.A) {


            let i = this.currenImage % this.IMAGES_WALKING.length; // let i = 0 % 6 (0 / 6 = 0 Rest 6 usw bis 6 / 6 = 1 Rest 0)
            // i = 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, usw
            let path = this.IMAGES_WALKING[i];
            this.img = this.imageCache[path];
            this.currenImage++;
        }

    }, 50);
}

    jump() {

    }
}