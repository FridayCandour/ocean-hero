// const { physics } = require("../uiedbook");

const ocean = game.build("ocean");
ocean_canvas = buildCanvas("ocean_canvas"); 
ocean.append(ocean_canvas);
renderer.backgroundImage(game.getImg("sea"), 20, false);
// renderer.backgroundImage(game.getImg("block"), 10, false, true);

let blockbev = function (block) {

    physics.detectCollision(hero, [block], 10);

    if (block.isHit) {
        hero.observeEntity(block.top, block.left, block.width, block.height)
    }
}
let blockPainter = new imgPainter(game.getImg("coin1"))
let block = new entity("block",blockPainter, blockbev),
    swimmerR = new spriteSheetPainter(game.getImg("hero"), 4, 3);
    // waves = new audio(game.getAud("sea.wav"),0.5,1),

const swimmerbehavior = function (swimmer, sea) {
    swimmerR.animateAllFrames = true;
        swimmerR.delay = 8;
    if (down === true) {
        swimmer.top += 50;
    swimmerR.animateFrame = 0;
    }
    down = false;

    if (right === true) {
        swimmer.left += 50;
        swimmerR.animateFrame = 2;
    }
    right = false;
    if (left === true) {
        swimmer.left -= 50;
    swimmerR.animateFrame = 1;

    }
    left = false;
    if (up === true) {
        swimmer.top -= 50;
    swimmerR.animateFrame = 3;
    }
    up = false;
},
    
hero = new entity("hero", swimmerR, swimmerbehavior);
hero.config(400, 700, 100, 200)
block.config(10, 20, 100, 100);

renderer.assemble(hero,block);
game.start(ocean_canvas,1);