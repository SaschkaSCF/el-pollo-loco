class World {
    character = new Character();
    level = level1;

    canvas; // *1 We need this canvas in this class in the function draw() for clearRect 
    ctx;
    keyboard;
    camera_x = 0;
                // *2
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d'); // *2 We get this canvas from the game.js with the params in the constructor
        this.canvas = canvas; // *1 This canvas is the canvas variable above the constructor. 
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    // We "give" the variable world to the class character. So you can use 
    // the variable keyboard in the class character
    setWorld() {
        this.character.world = this;
    }


    draw() {
        // *1 clearRect clears the canvas too draw the next image. 
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 

        this.ctx.translate(this.camera_x, 0);// Pushes draw the ctx to the left side
        // Then we draw our elements in the ctx
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);

        this.ctx.translate(-this.camera_x, 0); // Finally we push the ctx back to the right

        let self = this;
        requestAnimationFrame(function() { // The function will start async and draw will repeat as
            self.draw();                // many fps as the vido card its quality is good.
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
        if(mo.otherDirection) { 
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.x = mo.x * -1;
        }

        this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);

        this.ctx.beginPath();
        this.ctx.lineWidth = '5';
        this.ctx.strokeStyle = 'blue';
        this.ctx.rect (mo.x, mo.y, mo.x + mo.width, mo.y + mo.height);
        this.ctx.stroke();

        // To restore otherDirection (false)
        if (mo.otherDirection) {
            mo.x = mo.x * -1;
            this.ctx.restore();
        }
    }
}