let lp, tp, rp, bp;
function makeSharks(number, swimmer) {
        // imgString = `Sharks${rad(6,1,6)}`;
    for (let i = 0; i < number; i++) {
        // let  SharksPainter = new spriteSheetPainter(game.getImg(imgString),1,1,1);
        let SharksPainter = new spriteSheetPainter(game.getImg("bad"), 4, 4, 12);
        SharksPainter.animateFrameOf(2);
        let SharksBehaviour = function (Shark) {
                // updating global swimmer position
    lp = swimmer.left;
    tp = swimmer.top;
    rp = swimmer.left + swimmer.width;
    bp = swimmer.top + swimmer.height;
    u(Shark).config({lp: lp, tp: tp, rp: rp, bp: bp})
    Shark.left += rad(12);
        

        // defining angle of rotaions        
        if (Shark.left < Shark.lp && Shark.top + Shark.height < Shark.bp) {
            SharksPainter.rotate = -75;
        } else {
           SharksPainter.rotate = 75;
        }
            
        if (Shark.top + Shark.height > Shark.tp && Shark.top + Shark.height > Shark.bp) {
            SharksPainter.rotate = -35;
        } else {
           SharksPainter.rotate = 35;
        }
        }
        let Shark = new entity("Shark", SharksPainter, SharksBehaviour);
        
        Shark.config(280, 100, 80, 80);
            game.assemble(Shark);
   }
}



// u("#play").on("click", () => {
//     if (!start) {
//         return
//     }
//         u(opener).scaleIn()
//         // waves.toggle();
//     u(endGame).scaleIn();
// });
// u(pop).on("click", ()=>{
//     u(opener).scaleOut()
//     u(endGame).scaleIn()
//     game.toggleRendering()
//     // waves.toggle();
// });

// u("#pause").on("click", () => {
//     game.toggleRendering()
//     // waves.toggle()
// });
