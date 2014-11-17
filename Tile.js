// ==========
// Tile stuff
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

//Tile object
function Tile(x, y, type, pos) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.pos = pos;
}

//drawing tiles stuff
Tile.prototype.makeTile = function(ctx, x, y, type) {
    util.fillBox(ctx, x, y, tile_width, tile_height, 'black');
    if (type === "food") {
        util.fillCircle(ctx, x+(tile_width/2), y+(tile_height/2), 2.5);
    }
    if (type === "magicBean") {
        util.fillCircle(ctx, x+(tile_width/2), y+(tile_height/2), 4, "#00FF00");
    }
    else if (type === "maze") {
        util.fillBox(ctx, x+2, y+2, tile_width-2, tile_height-2, 'lawngreen') 
    }
    else if (type === "ghostbox") {
        ctx.strokeStyle = "white";
        ctx.strokeRect(x+1, y+1, tile_width-1, tile_height-1);
    }
    else if (type === "foodeaten") {
        util.fillBox(ctx, x, y, tile_width, tile_height, 'black');
    }

    if(type === "cherry"){
        g_cherrySprite.drawAt(ctx, x, y);
    }

};

Tile.prototype.collidesWith = function (prevX, prevY, nextX, nextY) {
    var verticalEdge = this.x + (tile_width/2);     //center x-coordinate
    var horizontalEdge = this.y + (tile_height/2);  //center y-coordinate
    var pacman = entityManager._pacman[0];
    var board = entityManager._gameboard[0];
 

    //going up/down
    if ((nextY < horizontalEdge && prevY >= horizontalEdge) ||
        (nextY > horizontalEdge && prevY <= horizontalEdge)) {
        if (nextX >= this.x && nextX <= this.x + tile_width) {
            if (this.type === "food") {
                var snd = new Audio("pacman_coinin.wav"); // buffers automatically when created
                snd.play();
                this.type = "foodeaten";              //pacman has eaten food
                pacman.score = pacman.score + 20;
                board.foodCounter += 1;
            }
            if (this.type === "magicBean") {
                var snd5 = new Audio("pacman_power1.wav"); // buffers automatically when created
                snd5.play();
                var snd4 = new Audio("pacman_alarm1.wav");
                snd4.play();
                this.type = "foodeaten";              //pacman has eaten magic food
                entityManager.setMode('frightened');
                entityManager.resetTimer();
                pacman.score = pacman.score + 50;
            }
            if(this.type ==="cherry"){
                pacman.score = pacman.score + 100;
                this.type = "foodeaten";
                board.cherryEaten();
            }
        }
    }
    //going left/right
    else if ((nextX < verticalEdge && prevX >= verticalEdge) ||
            (nextX > verticalEdge && prevX <= verticalEdge)) {
        if (nextY >= this.y && nextY <= this.y + tile_height) {
            if (this.type === "food") {
                var snd3 = new Audio("pacman_coinin.wav");
                snd3.play();
                this.type = "foodeaten";              //pacman has eaten food
                pacman.score = pacman.score + 20;
                entityManager._gameboard[0].foodCounter += 1;
            }
            if (this.type === "magicBean")  {
                var snd6 = new Audio("pacman_power1.wav"); // buffers automatically when created
                snd6.play();
                var snd7 = new Audio("pacman_alarm1.wav");
                snd7.play();
                this.type = "foodeaten";              //pacman has eaten magic food
                entityManager.setMode('frightened');
                entityManager.resetTimer();
                pacman.score = pacman.score + 50;
            }
            if(this.type ==="cherry"){
                pacman.score = pacman.score + 100;
                this.type = "foodeaten";
                board.cherryEaten();
            }
        }
    }
    document.getElementById('output').innerHTML = "Score: " + pacman.score;
};









