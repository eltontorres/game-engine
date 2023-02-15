const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Object {
    constructor(x, y, color) {
        this.__x = x;
        this.__y = y;
        this.color = color;
        this.type = null;
    }
}

class Rect extends Object {
    constructor(x, y, width, height, color) {
        super(x, y, color);
        this.width = width;
        this.height = height;
        this.right = x + width;
        this.bottom = y + height;
        this.type = 'rect';
    }

    set posX(x) {
        this.__x = x;
        this.right = x + this.width;
    }

    get posX() {
        return this.__x;
    }

    set posY(y) {
        this.__y = y;
        this.bottom = y + this.height;
    }

    get posY() {
        return this.__y;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.__x, this.__y, this.width, this.height);
    }
}

class Circle extends Object {
    constructor(x, y, radius, color) {
        super(x, y, color);
        this.radius = radius;
        this.type = 'circle'
        this.accelerationX = 0;
        this.accelerationY = 0;
    }

    set posX(x) {
        this.__x = x;
    }

    get posX() {
        return this.__x;
    }

    set posY(y) {
        this.__y = y;
    }

    get posY() {
        return this.__y;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.arc(this.__x, this.__y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

class Snake extends Object {
    constructor(x, y, length, color) {
        super(x, y, color);
        this.direction = { x: 1, y: 0 }
        this.width = length;
        this.height = length;
        this.right = x + length;
        this.bottom = y + length;
        this.length = length;
        this.velocityX;
        this.velocityY;
        this.body = [];
        this.body.push({ x: x, y: y });
    }

    set posX(x) {
        this.__x = x;
        this.right = x + this.width;
    }

    get posX() {
        return this.__x;
    }

    set posY(y) {
        this.__y = y;
        this.bottom = y + this.height;
    }

    get posY() {
        return this.__y;
    }

    walk(element) {
        this.posX = this.body[this.body.length - 1].x + (this.direction.x * this.length);
        this.posY = this.body[this.body.length - 1].y + (this.direction.y * this.length);
        this.newHead = { x: this.posX, y: this.posY };

        if (this.newHead.x > element.width) {
            this.newHead.x = 0;
        } else if (this.newHead.y > element.height) {
            this.newHead.y = 0;
        } else if (this.newHead.x < 0) {
            this.newHead.x = element.width - this.length;
        } else if (this.newHead.y < 0) {
            this.newHead.y = element.height - this.length;
        }

        this.body.push(this.newHead);
        this.body.shift();
    }

    eat() {
        let x = this.body[this.body.length - 1].x + (this.direction.x * this.length);
        let y = this.body[this.body.length - 1].y + (this.direction.y * this.length);
        this.newHead = { x: x, y: y };
        this.body.push(this.newHead)
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        for (this.segment of this.body) {
            ctx.fillRect(this.segment.x, this.segment.y, this.width, this.height);
        }
    }
}

class Mouse {
    constructor(element) {
        this.element = element;
        this.posX = 0;
        this.posY = 0;
        this.buttonPress = [];
        this.selected = null;
        this.__event = (e) => {
            switch (e.type) {
                case 'mousedown':
                    this.buttonPress[e.button] = true;
                    break;
                case 'mouseup':
                    this.buttonPress[e.button] = false;
                    this.selected = null
                    break;
                case 'mouseover':
                    this.buttonPress = [];
                    this.selected = null;
                    break;
                case 'contextmenu':

                    e.preventDefault();
                    break;
                default:
                    break;
            }
            //console.log(this.buttonPress);
        }
        this.__getXandY = (e) => {
            this.posX = e.offsetX;
            this.posY = e.offsetY;
        }
    }

    enabled() {
        this.element.addEventListener('mousedown', this.__event, false);
        this.element.addEventListener('mousemove', this.__getXandY, false);
        this.element.addEventListener('mouseup', this.__event, false);
        this.element.addEventListener('mouseover', this.__event, false);
        this.element.addEventListener('contextmenu', this.__event, false);

    }
    disabled() {
        this.element.removeEventListener('mousedown', this.__event, false);
        this.element.removeEventListener('mousemove', this.__getXandY, false);
        this.element.removeEventListener('mouseup', this.__event, false);
        this.element.removeEventListener('mouseover', this.__event, false);
        this.element.removeEventListener('contextmenu', this.__event, false);
    }

}

class Keyboard {
    constructor(element) {
        this.element = element;
        this.keyPress = [];
        this.__event = (e) => {
            switch (e.type) {
                case 'keydown':
                    this.keyPress[e.key] = true;
                    break;
                case 'keyup':
                    this.keyPress[e.key] = false;
                    break;
                default:
                    break;
            }
        }
    }

    enabled() {
        this.element.addEventListener('keydown', this.__event, false);
        this.element.addEventListener('keyup', this.__event, false);
    }

    disabled() {
        this.element.removeEventListener('keydown', this.__event, false);
        this.element.removeEventListener('keyup', this.__event, false);
    }

}



class Scene {
    static collisionPointPoint(objA, objB) {
        if (objA.posX === objB.posX && objA.posY === objB.posY) {
            return true;
        }
        return false;
    }

    static collisionPointCircle(objA, objB) {
        let distance = Geometry.distance(objA, objB);
        if (objB.radius >= distance) {
            return true;
        }
        return false;
    }

    static collisionCircleCircle(objA, objB) {
        let distance = Geometry.distance(objA, objB);
        if ((objA.radius + objB.radius) >= distance) {
            return true;
        }
        return false;
    }

    static collisionPointRect(objA, objB) {
        if ((objA.posX >= objB.posX && objA.posX <= objB.right)
            && (objA.posY >= objB.posY && objA.posY <= objB.bottom)) {
            return true;
        }
        return false;
    }

    static collisionRectRect(objA, objB) {
        if ((objA.right >= objB.posX) &&
            (objA.posX <= objB.right) &&
            (objA.bottom >= objB.posY) &&
            (objA.posY <= objB.bottom)) {
            return true;
        }
        return false;
    }

    static collisionRectCircle(objA, objB) {
        let testX = objB.posX;
        let testY = objB.posY;

        if (objB.posX < objA.posX) {
            testX = objA.posX;
        } else if (objB.posX > objA.right) {
            testX = objA.right;
        }

        if (objB.posY < objA.posY) {
            testY = objA.posY;
        } else if (objB.posY > objA.bottom) {
            testY = objA.bottom;
        }

        let point = { posX: testX, posY: testY };

        let distance = Geometry.distance(point, objB);

        if (distance <= objB.radius) {
            return true;
        }
        return false;
    }



}

class Touch {
    constructor(element) {
        this.element = element
        this.posX = 0;
        this.posY = 0;
        this.amount = 0;
        this.point = null;
        this.__event = (e) => {
            switch (e.type) {
                case 'touchstart':
                    this.amount = e.changedTouches;
                    //console.log('click')
                    break;
                case 'touchend':
                    console.log('clink-end')
                default:
                    break;

            }
        }
        this.__getXandY = (e) => {
            console.log("e.changedTouches");
            this.point = e.changedTouches[0];
            this.posX = e.changedTouches[0].pageX;
            this.posY = e.changedTouches[0].pageY;

        }


    }

    enabled() {
        this.element.addEventListener('touchstart', this.__event, false);
        this.element.addEventListener('touchmove', this.__getXandY, false);
        this.element.addEventListener('touchend', this.__event, false);
    }
}

const keyboard = new Keyboard(document);
keyboard.enabled();

let scene = [
    new Snake(0, 0, 10, 'green')
]

const food = new Rect(60, 60, 50, 50, 'red');

console.log(scene[0]);

function update() {

    if (keyboard.keyPress['ArrowDown']) {
        scene[0].direction.x = 0;
        scene[0].direction.y = 1;
    } else if (keyboard.keyPress['ArrowLeft']) {
        scene[0].direction.x = -1;
        scene[0].direction.y = 0;
    } else if (keyboard.keyPress['ArrowRight']) {
        scene[0].direction.x = 1;
        scene[0].direction.y = 0;
    } else if (keyboard.keyPress['ArrowUp']) {
        scene[0].direction.x = 0;
        scene[0].direction.y = -1;
    }  else if (keyboard.keyPress['a']) {
        scene[0].eat();
    }

    if (Scene.collisionRectRect(scene[0], food)) {
        food.posX = canvas.width * Math.random();
        food.posY = canvas.height * Math.random();
        scene[0].eat();
    }

    scene[0].walk(canvas);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    food.draw(ctx);

    for (obj of scene) {
        obj.draw(ctx);
    }
}
let count = 0;
function main() {
    requestAnimationFrame(main);
    //console.log(obj1);
    //console.log(obj2);
    if (++count < 4) {
        return
    }
    count = 0;
    update();
    draw();
    
}

requestAnimationFrame(main);