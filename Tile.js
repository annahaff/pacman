// ==========
// Food stuff
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

//Tile object
function Tile(x, y, food, maze) {
    this.x = x;
    this.y = y;
    this.isFood = food;
    this.isMaze = maze;
}


//drawing tiles stuff
Tile.prototype.makeTile = function(ctx, x, y, isFood, isMaze) {
    util.fillBox(ctx, x, y, tile_width, tile_height, 'black');

    //if tile is food, then draw food
    if (isFood === true) {
        util.fillCircle(ctx, x+(tile_width/2), y+(tile_height/2), 2.5);
    }

    //if tile is maze, then draw maze
    else if (isMaze === true) {
        util.fillBox(ctx, x, y, tile_width, tile_height, 'blue');
        return;
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
            if (this.isFood) 
            {
                console.log("food");
                //pacman.mazecollision = false;
                this.isFood = false;              //pacman has eaten food
            }

            else if (this.isMaze) 
            {
                console.log("maze");
                //pacman.mazecollision = true;
                //pacman.mazecollide = true;
            }
        }
    }
    //going left/right
    else if ((nextX < verticalEdge && prevX >= verticalEdge) ||
            (nextX > verticalEdge && prevX <= verticalEdge))
    {
        if (nextY >= this.y && nextY <= this.y + tile_height)
        {
            if (this.isFood) 
            {
                this.isFood = false;              //pacman has eaten food
            }

            else if (this.isMaze) 
            {
                console.log("maze");
                //pacman.mazecollide = true;
            }
        }
    }
    
};





