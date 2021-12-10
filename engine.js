/** This is the game engine algorithm*/

const game = (function () {
  // the start function starts the game
  // and manages the dom

    let canvas,
  id, context, fps, fpso = 0,
  lastdt = 0, pause = false,
  deltaTime, started = false,
      useBg = false,
      gameStart = true;
  const bg = [], entitysArray = [],
  
  screen = buildCanvas("uiedbook_game_canvas"),
    painter = screen.getContext("2d");
 const gameframe = build("div", { id: "gameframe" });

  const start = (fps = 0) => {
    const canvas = buildCanvas("gamecanvas");
    document.body.append(gameframe)
    u(document.body).style({
      margin: "0px",
      padding: "0px",
      boxSizing: "border-box",
      border: "none",
      backgroundColor: "black",
      overflow: "hidden",
    });

    u(gameframe).style({
      width: "100vw",
      height: "100vh",
      position: "fixed",
      top: "0px",
      left: "0px",
      bottom: "0px",
      right: "0px",
      zIndex: "0",
      backgroundColor: "black",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: "0px",
      padding: "0px",
      boxSizing: "border-box"
    });
      gameframe.append(canvas);
      _render(canvas, fps);
  };
  // this stops the game
  const end = () => {
    gameframe.parentElement.removeChild(gameframe);
    toggleRendering();
  };

  function contentLoader(type, id, url) {
    if (type === "img") {
      const p = new Image();
        p.src = url;
        p.id = id;
      return p;
    } else {
      if (type === "aud") {
        const p = new Audio();
        p.src = url;
        p.id = id;
          return p;
      }
    }
  }

  const imagesArray = [],
    audioArray = [];
  function loadImage(img, id) {
    if (Array.isArray(img) && !id) {
      for (let i = 0; i < img.length; i++) {
        if (!img[i][0] || !img[i][1]) {
          throw new Error(`uiedbook: image url or id not specified correctly for the ${i} image`);
        }
        const p = contentLoader("img", img[i][1], img[i][0]);
        imagesArray.push(p);
      }
    } else {
      if (img && id) {
        const i = contentLoader("img", img, id);
        imagesArray.push(i);
      } else {
        throw new Error(`uiedbook: image url or id not specified`);
      }
    }
    return imagesArray;
  }
  function loadAudio(img, id) {
    if (Array.isArray(img) && !id) {
      for (let i = 0; i < img.length; i++) {
         if (!img[i][0] || !img[i][1]) {
          throw new Error(`uiedbook: audio url or id not specified correctly for the ${i} audio`);
        }
        const p = contentLoader("aud", img[i][1], img[i][0]);
        audioArray.push(p);
      }
    } else {
      if (img && id) {
        const i = contentLoader("aud", img, id);
        audioArray.push(i);
      } else {
        throw new Error(`uiedbook: audio url or id not specified`);
      }
    }
    return audioArray;
  }

  function getAud(id) {
    const p = audioArray.find(ent => ent.id === id);

    if (p) {
      return p;
    } else {
      throw new Error('uiedbook: audio of id "' + id + '" not found');
    }
  }

  function getImg(id) {
    const p = imagesArray.find(ent => ent.id === id);
    if (p) {
      return p;
    } else {
      throw new Error('uiedbook: image of id "' + id + '" not found');
    }
  }


  
  function bgPaint(img, speed, up, left) {
    const bgImg = new bgPainter(img, speed, up, left);
    bg.push(bgImg);
    useBg = true;
  }
  
  
  function _assemble(...players) {
    if (!players) throw new Error("uiedbook: No players assembled");
    players.forEach(player => {
      entitysArray.push(player);
    });

    if (gameStart) {
      start()
      gameStart = false;
    }
    return entitysArray;
  }
  
   function detectCollision(ent, entityArray, reduce = 0, freeMan) {
    if (typeof entityArray === "string") {
      entityArray = renderer.getAllEtities(entityArray);
    }

    for (let j = 0; j < entityArray.length; j++) {
      if (entityArray[j].name === ent.name) {
        continue;
      } else {
        if (
          (ent.left - reduce) > (entityArray[j].left + entityArray[j].width) ||
          (ent.left + ent.width) < (entityArray[j].left - reduce) ||
          ent.top + reduce > (entityArray[j].top + entityArray[j].height) ||
          (ent.top + ent.height) < (entityArray[j].top - reduce)
        ) {
          continue;
        } else {
          entityArray[j].isHit = true;
          ent.isHit = true;
          if (entityArray[j].name !== freeMan) {
            entityArray.splice(j,1);
            --j;
            continue;
          }
        }
      }
    }
    return entityArray;
   }
  

  function copyCanvasTo(c, opacity, border) {
    const cx = c.getContext("2d");
    cx.drawImage(screen, 0, 0, c.width, c.height);
    c.style.opacity = opacity;
    c.style.borderRadius = border;
    return c;
  }
  
  function toggleRendering() {
    if (!started) {
      throw new Error("uiedbook: no entities has been assemmbled")
    }
    if (pause) {
      window.requestAnimationFrame(animate);
            pause = false;
          } else {
            window.cancelAnimationFrame(id);
            pause = true;
          }
        }
        
        function currentFPS() {
          return fpso;
        }
        
        let seconds = 1000;
        function calcFPS(dt) {
          deltaTime = Math.round(dt - lastdt);
          lastdt = dt;
          seconds = seconds - deltaTime;
          fpso++;
          if (seconds < 1) {
            console.log("current fps is  " + fpso);
            fpso = 0;
            seconds = 1000;
          }
          
          if (deltaTime > fps) {      
            return true;
          } else {
            return false;
          }
        }
        
        
        function  animate(dt) {
          id = window.requestAnimationFrame(animate);
          if (calcFPS(dt)) {
            try {
              
              if (useBg){ 
                bg.forEach(b => {
                  b.paint(painter, screen.width, screen.height);
                  b.update();
                });
              }
              
              entitysArray.forEach((ent, i) => {
                if (ent.delete) {
                  entitysArray.splice(i, 1);
                  --i;
                }
                
                ent.update(painter);
                ent.paint(painter);
                ent.run(painter);
                
                if (ent.border) {
                  ent.observeBorder(screen.width, screen.height);
                }
                
              });
              
              context.drawImage(screen, 0, 0, canvas.width, canvas.height);
              painter.clearRect(0, 0, screen.width, screen.height)
            } catch (error) {
              throw new Error(`uiedbook: The canvas cannot be animated due to some errors | ${error}`);
            }
          }
        }
        
        
        function _render(canv, fpso) {
          canvas = canv;
          context = canv.getContext("2d");
          screen.height = canvas.height;
          screen.width = canvas.width;
          fps = fpso;
          started = true;
          id =  window.requestAnimationFrame(animate);
        }
        
        
        function getAllEtities(name) {
          if (name === "all") {
            return entitysArray; 
          } else {
            const these = [];
            for (let i = 0; i < entitysArray.length; i++) {
              if (entitysArray[i].name === name || entitysArray[i].id === name) {
                these.push(entitysArray[i])
              }
            }
            return these;
          }
        }
        
        return {
          assemble: _assemble,
          loadImage: loadImage,
          loadAudio: loadAudio,
          getImg: getImg,
          getAud: getAud,
          backgroundImage: bgPaint,
          detectCollision: detectCollision,
          copyCanvasTo: copyCanvasTo,
          currentFPS: currentFPS,
          getAllEtities: getAllEtities,
          toggleRendering: toggleRendering,
          end: end
        };
})();
      






class entity{
  constructor(name, painter, behaviors) {
    if (!painter) {
      throw new Error("cannot create entity without a paiter object");
    }
  this.id = name || "none" //name of the entity for identification can be used out side here******
  this.name = name || "none";
  this.painter = painter; // callback for paint the entity     can be used out side here******
  this.behaviors = behaviors; // this is a callback to add additional properties to the entity at runtime
  this.width = 0; // width of entiity                              can be used out side here******
  this.height = 0; // height of entity                             can be used out side here******
  this.top = 0; // distance from the top of the canvas              can be used out side here******
  this.left = 0; // distance from the left of the canvas            can be used out side here******
  this.visible = true; // to check if the entity is displayed        can be used out side here******
  this.behaviors = behaviors; // this is a callback to add additional properties to the entity at runtime
  this.delete = false; //  to delete an entity                        can be used out side here******
  this.border = true; //   to make the entity observer sides or not   can be used out side here******
    this.isHit = false;
    this.credentials = false;
}

config(top, left, bottom, right) {
    if (!top || !left || !bottom || !right) {
      throw new Error(`uiedbook: entity.config(top, left, bottom, right) on ${this.name} is invalid`)
    }
    this.left = left;
    this.top = top;
    this.height = bottom;
    this.width = right;
  }


observeEntity = function (ent) {
    if ( (this.left > ent.left + ent.width) || (this.left + this.width < ent.left) || (this.top > ent.top + ent.height) || (this.top + this.height < ent.top) ) {
      return false;
    } else {
    return true;
  }
}


  update(context, lastDeltalTime) {
    if (this.painter.update && this.visible) {
      this.painter.update(this, context, lastDeltalTime);
    }
  }


  paint(context, lastDeltalTime) {
    if (!this.credentials) {
      this.credentials = [this, context, lastDeltalTime]
    }
    if (this.painter.paint && this.visible) {
      this.painter.paint(this, context, lastDeltalTime);
    } else {
      throw new Error(`uiedbook: entity with name of ${this.name} has no paint function`);
    }
  }


  observeBorder(w, h) {
    if (this.top <= 0) {
      this.top *= 0.8 ;
    } else {
      if (h && this.top + this.height >= h) {
        this.top = h - this.height;
      }
    }
    if (this.left <= 0) {
      this.left *= 0.8;
    } else {
      if (w && this.left + this.width >= w) {
        this.left = (w - this.width);
      }
    }
  }


  run(context, lastDeltalTime) {
    // here the entity don't have to be visble
    if (this.behaviors) {
      this.behaviors(this, context, lastDeltalTime);
    }
  }
  callBack(...functions) {
    if (Array.isArray(this.credentials)) {
      functions.forEach((fuc) => fuc.call(...this.credentials));
    }
  }
}



class imgPainter{
  constructor(img, delay = 1){
  this.image = img;
  this.delay = delay;
  this.range = 0;
  this.rotate = false;
    this.observeChange = false;
  }
  
  update(entity) {
        this.range++;
    if (this.range % this.delay === 0) {
      if (lit(this.observeChange, 422)({ left: entity.left, top: entity.top, width: entity.width, height: entity.height })) return;
      this.observeChange = { left: entity.left, top: entity.top, width: entity.width, height: entity.height };
       }

    if (this.range > 100) {
      this.range = 1;
    }
  }
  
  paint(entity, context) {
      context.drawImage(this.image, entity.left, entity.top, entity.width, entity.height);
  }
};


// this is a powerful sprite algorithm for
// rendering the exact sprite from a
// spritesheet in successful orders
class spriteSheetPainter{
  constructor(img, horizontal = 1, vertical = 1, delay = 1) {
  this.image = img;
  this.framesWidth = Math.round(this.image.width / horizontal);
  this.framesHeight = Math.round(this.image.height / vertical);
  this.horizontalPictures = horizontal;
  this.verticalPictures = vertical;
  this.frameHeightCount = 0;
  this.frameWidthCount = 0;
  this.range = 0;
  this.delay = delay;
  this.isLastImage = false;
  this.animateAllFrames = (horizontal === 1) && (vertical === 1)? false: true;
  this.animate = true;
    this.rotate = false;
    this.bugCorrecter = 3;
  }
  
  changeSheet(img, horizontal = 0, vertical = 0, delay = 1) {
    this.image = img;
    this.framesWidth = Math.round(this.image.width / horizontal);
    this.framesHeight = Math.round(this.image.height / vertical);
    this.horizontalPictures = horizontal;
    this.verticalPictures = vertical;
    this.delay = delay;
  this.animateAllFrames = (horizontal === 1) && (vertical === 1)? false: true;    
  };

   animateFrameOf(frameY = 0) {
    this.frameY = frameY;
   }
  
  
    update() {
    this.range++;
    if (this.range % this.delay === 0 && this.animate) {
      if (this.animateAllFrames) {
        // animating all frames from the fisrt image to last in an infinite loop
        if (this.frameHeightCount < this.verticalPictures - 1) {
          if (this.frameWidthCount <= this.horizontalPictures - 2) {
            this.frameWidthCount++;
          } else {
            this.frameWidthCount = 0;
            this.frameHeightCount++;
          }
        } else {
          this.isLastImage = true;
          this.frameHeightCount = 0;
        }
        if (this.frameHeightCount === this.verticalPictures - 1) {
          this.isLastImage = false;
        }
      }

    if (this.frameY) {
    this.frameHeightCount = this.frameY;
   if (this.frameWidthCount < this.horizontalPictures - 1) {
      this.frameWidthCount++;
    } else {
      this.frameWidthCount = 0;
    }
  }
 }

    if (this.range > 100) {
      this.range = 1;
    }
      
    if (this.bugCorrecter > 1) {
        this.bugCorrecter--;
      this.changeSheet(this.image, this.horizontalPictures,this.verticalPictures);
    }
    }
  
  paint(entity, context) {
     context.save();
    if (this.rotate) {
      context.translate(entity.left, entity.top);
      context.rotate(this.rotate * Math.PI / 180);
      context.translate(-entity.left, -entity.top)
    }
    context.drawImage(
      this.image,
      this.framesWidth * this.frameWidthCount,
      this.framesHeight * this.frameHeightCount,
      this.framesWidth,
      this.framesHeight,
      entity.left,
      entity.top,
      entity.width,
      entity.height
    );
      context.restore();
  }
};


// play mp3 or wav audio from a local file or url
class audio{
  constructor(audio, volumeScale = 1,  loop = 0) {
  this.audio = audio;
  this.audio.loop = loop;
    this.audio.volume = volumeScale;
  }
play() {
    this.audio.play();
  }
  pause() {
    this.audio.pause();
  }
  toggle() {
    if (this.audio.pause) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

};


class bgPainter {
  constructor(img, speed = 10, up, left, t, l, delay = 0){
  this.image = img;
  this.speed = speed;
  this.range = 0;
  this.width = this.image.width;
  this.height = this.image.height;
  this.GoesUp = up;
  this.GoesLeft = left;
  this.top = t || 0;
  this.left = l || 0;
  this.delay = delay;
    this.shouldPaint = false;
  }

  update() {
    this.range++;
    if (this.delay % this.range === 0) {
      this.shouldPaint = true;

          if (this.GoesLeft) {
      if (this.left <= - this.width) {
        this.left = 0;
      }
      this.left -= this.speed;
    }

    if (this.GoesUp) {
      if (this.top >= this.height) {
        this.top = 0;
      }
      this.top += this.speed;
    }


    }
  }

  paint(context, w, h) {
    if (this.shouldPaint === true) {
    if (this.GoesLeft) {
      context.drawImage(this.image, this.left, this.top, w, h);
      context.drawImage(this.image, this.left + this.width, this.top, this.width, h);
    } else {
      context.drawImage(this.image, this.left, this.top, w, h);
      context.drawImage(this.image, this.left, this.top - this.height, w, this.height);
      }
      this.shouldPaint = false;
    }
  }
};

      
      const book = {
        game,
        entity,
        imgPainter,
        spriteSheetPainter,
        audio,
        bgPainter,
      };
      
if (typeof module !== "undefined") {
  module["exports"] = book;
} else if(!window.game) window.game = book;
