game.backgroundImage(game.getImg("sea"));
let swimmerR = new spriteSheetPainter(game.getImg("hero"), 4, 3);
blockPainter = new imgPainter(game.getImg("box")),
block = new entity("block", blockPainter);
block.config(10, 20, 100, 100);
let speed = 10;

const swimmerbehavior = function (swimmer) {
    swimmerR.animateAllFrames = true;
    hero.observeEntity(block)
    swimmerR.delay = 8;
    if (down === true) {
        swimmer.top += speed;
    }
    down = false;
    
    if (right === true) {
        swimmer.left += speed;
    }
    right = false;
    if (left === true) {
        swimmer.left -= speed;
    }
    left = false;
    if (up === true) {
        swimmer.top -= speed;
    }
    up = false;
};

const hero = new entity("hero", swimmerR, swimmerbehavior);
hero.config(400, 700, 60, 120)
game.assemble(hero, block);