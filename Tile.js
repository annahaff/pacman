// ==========
// Food stuff
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

//Tile object
function Tile(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
}


//drawing tiles stuff
Tile.prototype.makeTile = function(ctx, x, y, type) {
    util.fillBox(ctx, x, y, tile_width, tile_height, 'black');

    //if tile is food, then draw food
    if (type === "food") {
        util.fillCircle(ctx, x+(tile_width/2), y+(tile_height/2), 2.5);
    }

    //if tile is maze, then draw maze
    else if (type === "maze") {
        util.fillBox(ctx, x, y, tile_width, tile_height, 'blue');
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
        (nextY > horizontalEdge && prevY <= horizontalEdge))
    {
        if (nextX >= this.x && nextX <= this.x + tile_width)
        {
            if (this.type === "food") 
            {
                this.type = "foodeaten";              //pacman has eaten food
            }
        }
    }
    //going left/right
    else if ((nextX < verticalEdge && prevX >= verticalEdge) ||
            (nextX > verticalEdge && prevX <= verticalEdge))
    {
        if (nextY >= this.y && nextY <= this.y + tile_height)
        {
            if (this.type === "food") 
            {
                this.type = "foodeaten";              //pacman has eaten food
            }
        }
    }
    
};





