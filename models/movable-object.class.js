class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 3;
    energy = 50;
    lastHit = 0;
    coins = 0;
    bottles = 0;


    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }


    isAboveGround() {
        if (this instanceof ThrowableObject) { // Throwable object should always fall
            return true;
        } else {
            // console.log(this.y);
            return this.y < 155;
        }
    }



    // Character is colliding chicken
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x &&
            this.y < mo.y + mo.height;
    }


    hit() {
        this.energy -= 10;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }


    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit; // Difference in ms
        timePassed = timePassed / 1000;                         // Difference in sec
        return timePassed < 0.5;    // If the character was hit in the last 0.5 sec the function would return to true and playAnimation will start in the character class
    }


    addCoin() {
        this.coins += 10;
    }


    addBottle() {
        this.bottles += 10;
    }


    hitEndboss() {
        this.energy -= 10;
        console.log(this.energy);
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }
    

    endbossIsHurt() {
        let timePassed = new Date().getTime() - this.lastHit; 
        timePassed = timePassed / 1000;                         
        return timePassed < 0.5;    
    }


    isDead() {
        return this.energy == 0;
    }


    chickenKilled() {
        return this.energy = 0;
    }


    // plays an animation using a sequence of images. The function takes an array of image paths as input and cycles through the array to display each image in turn.
    // The function uses the modulo operator (%) to calculate the index of the current image to display.
    playAnimation(images) {
        let i = this.currenImage % images.length; // let i = 0 % 6 (0 / 6 = 0 Rest 6 usw bis 6 / 6 = 1 Rest 0)
        let path = images[i];
        this.img = this.imageCache[path];
        this.currenImage++;
    }


    moveRight() {
        this.x += this.speed;
    }

    // Animation to some objects like chickens or clouds. 
    // It decreases x (-=) with the speed variable and it refreshes 60/sec = 60 fps.
    moveLeft() {
        this.x -= this.speed;
    }
}