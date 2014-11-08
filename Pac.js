// ==========
// Pacman stuff
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Pacman(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}



Pacman.prototype.GO_LEFT   = 'A'.charCodeAt(0);
Pacman.prototype.GO_RIGHT  = 'D'.charCodeAt(0);
Pacman.prototype.GO_UP     = 'W'.charCodeAt(0);
Pacman.prototype.GO_DOWN   = 'S'.charCodeAt(0);

// Initial, inheritable, default values
Pacman.prototype.x = 24;                     //top left x
Pacman.prototype.y = 24;                     //top left y

Pacman.prototype.width = tile_width;
Pacman.prototype.height = tile_height;
Pacman.prototype.cx = 24+tile_width/2;                    //center x
Pacman.prototype.cy = 24+tile_height/2;                   //center y

Pacman.prototype.xVel = 0;
Pacman.prototype.yVel = 0;

var pacman = Pacman.prototype;

var face;
var leftedge;
var rightedge;
var topedge;
var bottomedge;

var turn = false;
var lastturn; 

var flag;

var rail = [];

for (var i = 12; i < g_canvas.width; i += 24) {
    for (var j = 12; j < g_canvas.height; j += 24) {
        rail.push([i, j]);
    }
}

Pacman.prototype.update = function (du) {
    var prevX = this.x;
    var prevY = this.y;
    var nextX = prevX + this.xVel;
    var nextY = prevY + this.yVel;
    var halfwidth = this.width/2;
    var board = Gameboard.prototype;
    
    var turn = false;

    //check for tile collision
    for (var i = 0; i < board.tileArray.length; i++)
    {
        board.tileArray[i].collidesWith(prevX + halfwidth, prevY + halfwidth, 
            nextX + halfwidth, nextY + halfwidth);
    }
    

    if (flag === "right" || (keys[this.GO_RIGHT])) {
        flag = "right";
        for (var i = 0; i < rail.length; i++) {
            
            if (this.cy === rail[i][1]) {
                
                var nextXVel = 1;
                var nextYVel = 0;
                var testNextX = this.x + nextXVel;
                var testNextY = this.y + nextYVel;
                
                //make sure we are not trying to turn into a wall
                if (!this.checkMazeCollision(nextXVel, nextYVel, testNextX, testNextY))
                {
                    flag = "";
                    this.xVel = nextXVel;
                    this.yVel = nextYVel;
                }
            }
        }
    }

    else if (flag === "left" || (keys[this.GO_LEFT])) {
        flag = "left";
        for (var i = 0; i < rail.length; i++) {

            if (this.cy === rail[i][1]) {
                
                var nextXVel = -1;
                var nextYVel = 0;
                var testNextX = this.x + nextXVel;
                var testNextY = this.y + nextYVel;
                
                //make sure we are not trying to turn into a wall
                if (!this.checkMazeCollision(nextXVel, nextYVel, testNextX, testNextY))
                {
                    flag = "";
                    this.xVel = nextXVel;
                    this.yVel = nextYVel;
                }          
            }
        }
    }

    else if (flag === "up" || (keys[this.GO_UP])) {
        flag = "up";
        for (var i = 0; i < rail.length; i++) {

            if (this.cx === rail[i][0]) {
                
                var nextXVel = 0;
                var nextYVel = -1;
                var testNextX = this.x + nextXVel;
                var testNextY = this.y + nextYVel;
                
                //make sure we are not trying to turn into a wall
                if (!this.checkMazeCollision(nextXVel, nextYVel, testNextX, testNextY))
                {
                    flag = "";
                    this.xVel = nextXVel;
                    this.yVel = nextYVel;
                }              
            }
        } 
    }

    else if (flag === "down" || (keys[this.GO_DOWN])) {
        flag = "down";
        for (var i = 0; i < rail.length; i++) {
            
            if (this.cx === rail[i][0]) {
                
                var nextXVel = 0;
                var nextYVel = 1;
                var testNextX = this.x + nextXVel;
                var testNextY = this.y + nextYVel;
                
                //make sure we are not trying to turn into a wall
                if (!this.checkMazeCollision(nextXVel, nextYVel, testNextX, testNextY))
                {
                    flag = "";
                    this.xVel = nextXVel;
                    this.yVel = nextYVel;
                }           
            }
        }
    }

    //----------------------------------------------------------------------------
    //console.log("still inside update routine?");
    //console.log("x: " + this.x + ", y: " +  this.y);
    //check for collision to the maze tiles
    //------------------------------------------------------------------------------

    console.log(flag);

    var newNextX = this.x + this.xVel;
    var newNextY = this.y + this.yVel;

    if (this.checkMazeCollision(this.xVel, this.yVel, newNextX, newNextY))
    {
        this.halt();
    }

    this.x += this.xVel;
    this.y += this.yVel;
    this.cx = this.x + halfwidth;
    this.cy = this.y + halfwidth; 
        
};


Pacman.prototype.halt = function()
{
    this.xVel = 0;
    this.yVel = 0;
}

Pacman.prototype.checkMazeCollision = function(tempXVel, tempYVel, nextX, nextY) {
    //24 is the tile size  global variable tile_width)

    var xFactor = 0;
    var yFactor = 0;

    if(tempXVel === 1) xFactor = 23;
    if(tempYVel === 1) yFactor = 23;

    var nextTileX = Math.floor((nextX+xFactor)/tile_width);
    var nextTileY = Math.floor((nextY+yFactor)/tile_width);

    if(g_levelMap[nextTileY][nextTileX] === "m" || 
       g_levelMap[nextTileY][nextTileX] === "g") 
    {
        return true;  
    }
};


var a = 0;
var b = 0;
var positions = [18, 18, 18, 18];   //starting position

Pacman.prototype.render = function (ctx) {
    // going left
    if (this.xVel < 0) {
        positions = [51, 52, 53, 54];
    }
    // going right
    else if (this.xVel > 0) {
        positions = [17, 18, 19, 20];
    }
    // going up
    else if (this.yVel < 0) {
        positions = [0, 1, 2, 3];
    }
    // going down
    else if (this.yVel > 0) {
        positions = [34, 35, 36, 37];
    }
    g_sprites[positions[a]].drawAt(ctx, this.x, this.y);
    b += 0.5;
    if (b % 1 === 0) ++a;    
    if (a === 3) a = 0;
};


/*Pacman.prototype.setPos = function (x, y) {
    this.x = x;
    this.y = y;
}

Pacman.prototype.getPos = function () {
    return {posX : this.x, posY : this.y};
}

/*Pacman.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);    
    this.halt();
};

Pacman.prototype.wrapPosition = function () {
    this.x = util.wrapRange(this.x, 0, g_canvas.width);
    this.y = util.wrapRange(this.y, 0, g_canvas.height);
};*/

