class Character extends MovableObject {
    height = 280;
    y = 155;
    speed = 5;
    world;
    lastMoveCharacter = 0;


    offset = {
        top: 120,
        bottom: 20,
        left: 40,
        right: 40
    }

    IMAGES_WALKING = [
        './img/2_character_pepe/2_walk/W-21.png',
        './img/2_character_pepe/2_walk/W-22.png',
        './img/2_character_pepe/2_walk/W-23.png',
        './img/2_character_pepe/2_walk/W-24.png',
        './img/2_character_pepe/2_walk/W-25.png',
        './img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        './img/2_character_pepe/3_jump/J-31.png',
        './img/2_character_pepe/3_jump/J-32.png',
        './img/2_character_pepe/3_jump/J-33.png',
        './img/2_character_pepe/3_jump/J-34.png',
        './img/2_character_pepe/3_jump/J-35.png',
        './img/2_character_pepe/3_jump/J-36.png',
        './img/2_character_pepe/3_jump/J-37.png',
        './img/2_character_pepe/3_jump/J-38.png',
        './img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        './img/2_character_pepe/5_dead/D-51.png',
        './img/2_character_pepe/5_dead/D-52.png',
        './img/2_character_pepe/5_dead/D-53.png',
        './img/2_character_pepe/5_dead/D-54.png',
        './img/2_character_pepe/5_dead/D-55.png',
        './img/2_character_pepe/5_dead/D-56.png',
        './img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        './img/2_character_pepe/4_hurt/H-41.png',
        './img/2_character_pepe/4_hurt/H-42.png',
        './img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_IDLE_CHARACTER = [
        './img/2_character_pepe/1_idle/idle/I-1.png',
        './img/2_character_pepe/1_idle/idle/I-2.png',
        './img/2_character_pepe/1_idle/idle/I-3.png',
        './img/2_character_pepe/1_idle/idle/I-4.png',
        './img/2_character_pepe/1_idle/idle/I-5.png',
        './img/2_character_pepe/1_idle/idle/I-6.png',
        './img/2_character_pepe/1_idle/idle/I-7.png',
        './img/2_character_pepe/1_idle/idle/I-8.png',
        './img/2_character_pepe/1_idle/idle/I-9.png',
        './img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE_CHARACTER = [
        './img/2_character_pepe/1_idle/long_idle/I-11.png',
        './img/2_character_pepe/1_idle/long_idle/I-12.png',
        './img/2_character_pepe/1_idle/long_idle/I-13.png',
        './img/2_character_pepe/1_idle/long_idle/I-14.png',
        './img/2_character_pepe/1_idle/long_idle/I-15.png',
        './img/2_character_pepe/1_idle/long_idle/I-16.png',
        './img/2_character_pepe/1_idle/long_idle/I-17.png',
        './img/2_character_pepe/1_idle/long_idle/I-18.png',
        './img/2_character_pepe/1_idle/long_idle/I-19.png',
        './img/2_character_pepe/1_idle/long_idle/I-20.png'
    ]


    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE_CHARACTER);
        this.loadImages(this.IMAGES_LONG_IDLE_CHARACTER);
        this.checkApplyGravity();
        this.animate();
    }


    animate() {
        setStoppableInterval(() => this.moveCharacter(), 1000 / 60);
        setStoppableInterval(() => this.playCharacter(), 100);
    }


    moveCharacter() {
        this.world.camera_x = -this.x + 100;
        walking_sound.pause();
        if (this.canMoveRight())
            this.moveRight();
        if (this.canMoveLeft())
            this.moveLeft();
        if (this.canJump())
            this.jump();
    }


    canMoveRight() {
        return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x || this.world.keyboard.D && this.x < this.world.level.level_end_x;
    }


    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;

        this.checkAboverGround();
    }


    canMoveLeft() {
        return this.world.keyboard.LEFT && this.x > 0 || this.world.keyboard.A && this.x > 0;
    }


    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = true;

        this.checkAboverGround();
    }


    checkAboverGround() {
        if (!this.isAboveGround())
            walking_sound.play();
    }


    canJump() {
        return this.world.keyboard.UP && !this.isAboveGround() || this.world.keyboard.SPACE && !this.isAboveGround();
    }


    playCharacter() {
        if (this.isDead()) {
            this.deathRoutine();
        } else if (this.isHurt()) {
            this.characterIsHurtRoutine();
        } else if (this.isAboveGround()) {
            this.characterJumpRoutine();
        } else if (this.checkCharacterWalking()) {
            this.characterWalkingRoutine();
        } else if (this.checkCharacterIdle()) {
            this.characterIdleAnimation();
        } else {
            this.characterIdleRoutine();
        }
    }


    characterIsHurtRoutine() {
        hurt_sound.play();
        this.playAnimation(this.IMAGES_HURT);
        this.lastMoveCharacter = 0;
    }


    characterJumpRoutine() {
        this.playAnimation(this.IMAGES_JUMPING);
        this.lastMoveCharacter = 0;
    }


    checkCharacterWalking() {
        return this.world.keyboard.RIGHT || this.world.keyboard.D || this.world.keyboard.LEFT || this.world.keyboard.A;
    }


    characterWalkingRoutine() {
        this.playAnimation(this.IMAGES_WALKING);
        this.lastMoveCharacter = 0;
    }


    characterIdleRoutine() {
        this.playAnimation(this.IMAGES_LONG_IDLE_CHARACTER);
        snoreSound.play();
    }


    jump() {
        this.speedY = 30;
        jumping_sound.play();
    }


    checkApplyGravity() {
        setStoppableInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } if (this.y > 155) {
                this.y = 155;
            }
        }, 1000 / 25);
    }


    deathRoutine() {
        this.playAnimation(this.IMAGES_DEAD);
        death_sound.currentTime = 0;
        death_sound.play();
        game_music.pause();
        stopGame();

        setTimeout(() => {
            deathScreen();
            snoreSound.volume = 0;
        }, 1000);
    }


    checkCharacterIdle() {
        return this.lastMoveCharacter < 50;
    }


    characterIdleAnimation() {
        this.playAnimation(this.IMAGES_IDLE_CHARACTER);
        this.lastMoveCharacter++;
        snoreSound.pause();
    }
}