class World {
    character = new Character();
    level = level1;
    canvas; 
    ctx;
    keyboard;
    camera_x = 0;
    statusbarHealth = new StatusbarHealth();
    throwableObjects = [];
    statusbarBottle = new Bottlebar();
    statusbarCoin = new Coinbar();
    enbosshealthBar = new EndbossHealthBar();
    collidesWithEndboss = false;
    lastThrow = false;
    alreadyThrow = false;
    endbossIsInvulnerable = false;
    characterIsInvulnerable = false;



    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d'); 
        this.canvas = canvas; 
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }


    setWorld() {
        this.character.world = this;   
    }


    run() {
        setStoppableInterval(() => {
            this.checkCollisionsWithChicken();
            this.checkCollisionsWithEndboss();
            this.checkTimerForThrow();
            this.collectBottles();
            this.collectCoins();
            this.killEnemyWithBottle();
        }, 1000 / 25);
    }


    checkTimerForThrow() {
        setStoppableInterval(() => this.checkThrowObjects() , 1000 / 60);
    }


    checkThrowObjects() {
        if (this.keyboard.E && this.character.bottles > 0 && !this.lastThrow) {
            this.alreadyThrow = true;
            this.lastThrow = true;
            let bottle = new ThrowableObject(this.character.x + 20, this.character.y + 100, this.character.otherDirection);
            throwSound.play();
            this.throwableObjects.push(bottle);
            this.character.bottles -= 10;
            this.statusbarBottle.setPercentage(this.character.bottles);
        } else {
            this.timerForThrow();
        }
    }


    timerForThrow() {
        if (this.alreadyThrow) {
            this.alreadyThrow = false;
            setTimeout(() => {
                this.lastThrow = false;
            }, 2000);
        }
    }


    checkCollisionsWithChicken() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && !this.character.isHurt()) {
                if (this.character.isAboveGround()) {
                    this.killChicken(enemy);
                } else {
                    this.character.hit();
                    this.statusbarHealth.setPercentage(this.character.energy);
                }
            }
        });
    }


    checkCollisionsWithEndboss() {
        this.level.endboss.forEach((endboss) => {
            if (this.character.isColliding(endboss) && !this.characterIsInvulnerable) {
                this.character.hit();
                this.statusbarHealth.setPercentage(this.character.energy);
                this.characterIsInvulnerable = true;
                setTimeout(() => {
                    this.characterIsInvulnerable = false;
                }, 750);
            }
        });
    }


    killChicken(enemy) {
        this.character.speedY = 30;
        deadChicken.play();
        enemy.chickenKilled();

        setTimeout(() => {
        this.deleteEnemy(enemy);
        }, 500);
    }


    killChickenWithBottle() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach(enemy => {
                if (bottle.isColliding(enemy)) {
                    this.chickenKilledWithBottle(enemy);
                }
            });
        });
    }


    chickenKilledWithBottle(enemy) {
        deadChicken.play();
        enemy.chickenKilled();

        setTimeout(() => {
            this.deleteEnemy(enemy);
        }, 500);
    }


    killEnemyWithBottle() {
        this.hitEndboss();
        this.killChickenWithBottle();
    }


    hitEndboss() {
        this.throwableObjects.forEach((bottle) => {
            this.level.endboss.forEach(endboss => {
                if (this.bottleCollidingEndboss(endboss, bottle)) {
                        this.endbossIsHurt(endboss);
                }
            });
        });
    }


    bottleCollidingEndboss(endboss, bottle) {
        return bottle.isColliding(endboss) && !this.endbossIsInvulnerable;
    }


    endbossIsHurt(endboss) {
        this.collidesWithEndboss = true;
        endboss.hurtEndboss();
        this.endbossIsInvulnerable = true;
        setTimeout(() => {
            this.endbossIsInvulnerable = false;
        }, 500);
        this.enbosshealthBar.setPercentage(world.level.endboss[0].energy);
    }


    deleteEnemy(enemy) {
        let i = this.level.enemies.indexOf(enemy);
        if (i > -1) {
            this.level.enemies.splice(i, 1);
        }
    }


    collectBottles() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle) && this.character.bottles < 50) {
                this.bottleCollected(bottle);
                bottleSound.play();
                this.character.addBottle();
                this.statusbarBottle.setPercentage(this.character.bottles);
            }
        });
    }


    collectCoins() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.coinCollected(coin);
                coinSound.play();
                this.character.addCoin();
                this.statusbarCoin.setPercentage(this.character.coins);
            }
        })
    }


    bottleCollected(bottle) {
        let i = this.level.bottles.indexOf(bottle);
        this.level.bottles.splice(i, 1);
    }


    coinCollected(coin) {
        let i = this.level.coins.indexOf(coin);
        this.level.coins.splice(i, 1);
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.statusbarHealth);
        this.addToMap(this.statusbarBottle);
        this.addToMap(this.statusbarCoin);
        this.addToMap(this.enbosshealthBar);

        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.addObjectsToMap(this.level.coins);

        this.ctx.translate(-this.camera_x, 0); 

        let self = this;
        requestAnimationFrame(function () { 
            self.draw();             
        });
    }


    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }


    /**
     * Checks if otherDirection is true (when push button <- or A) so the character walks into the other direction.
     *  First it saves the current state if the canvas (ctx.save()).
     * Then it translates the canvas along the x-axis (ctx.translate) and scales it horizontally by x-axis (ctx.scale).
     * Finally the method sets the x property of mo its negative value.
     * @param {object} mo - A param for a movable object (like the character)
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);        

        mo.draw(this.ctx);
        // mo.drawFrame(this.ctx);

        if (mo.otherDirection) this.flipImageBack(mo);        
    }


    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}