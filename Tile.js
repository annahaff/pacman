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
var score = 0;

//drawing tiles stuff
Tile.prototype.makeTile = function(ctx, x, y, type) {
    util.fillBox(ctx, x, y, tile_width, tile_height, 'black');
    //if tile is food, then draw food
    if (type === "food") {
        util.fillCircle(ctx, x+(tile_width/2), y+(tile_height/2), 2.5);
    }
    //if tile is magicBean
    if (type === "magicBean") {
        util.fillCircle(ctx, x+(tile_width/2), y+(tile_height/2), 4, "#00FF00");
    }
    else if (type === "maze") {
        util.fillBox(ctx, x+2, y+2, tile_width-2, tile_height-2, 'lawngreen') // for Freydis
    }
    else if (type === "ghostbox") {
        ctx.strokeStyle = "white";
        ctx.strokeRect(x+1, y+1, tile_width-1, tile_height-1);
    }
    else if (type === "foodeaten") {
        util.fillBox(ctx, x, y, tile_width, tile_height, 'black');
    }
    
};

Tile.prototype.collidesWith = function (prevX, prevY, nextX, nextY) {
    var verticalEdge = this.x + (tile_width/2);     //center x-coordinate
    var horizontalEdge = this.y + (tile_height/2);  //center y-coordinate

    //going up/down
    if ((nextY < horizontalEdge && prevY >= horizontalEdge) ||
        (nextY > horizontalEdge && prevY <= horizontalEdge)) {
        if (nextX >= this.x && nextX <= this.x + tile_width) {
            if (this.type === "food") {
                this.type = "foodeaten";              //pacman has eaten food
                score = score + 20;
            }
            if (this.type === "magicBean") {
                this.type = "foodeaten";              //pacman has eaten magic food
                entityManager.setMode('frightened');
                score = score + 50;
            }
        }
    }
    //going left/right
    else if ((nextX < verticalEdge && prevX >= verticalEdge) ||
            (nextX > verticalEdge && prevX <= verticalEdge)) {
        if (nextY >= this.y && nextY <= this.y + tile_height) {
            if (this.type === "food") {
                this.type = "foodeaten";              //pacman has eaten food
                score = score + 20;
            }
            if (this.type === "magicBean")  {
                this.type = "foodeaten";              //pacman has eaten magic food
                entityManager.setMode('frightened');
                score = score + 50;
            }
        }
    }
    document.getElementById('output').innerHTML = "Score: " + score;
};









