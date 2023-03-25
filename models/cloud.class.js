class Cloud extends MovableObject {
    y = 20;
    height = 250;
    width = 500;

    constructor() {
        super().loadImage('./img/5_background/layers/4_clouds/1.png');

        this.x = 100 + Math.random() * 3200; // Number between 200 and 700
        this.animate();
    }


    animate() {
        this.moveLeft();
    }
}