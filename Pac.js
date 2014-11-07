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
Pacman.prototype.cy = 24+ tile_height/2;                    //center y

Pacman.prototype.xVel = 0;
Pacman.prototype.yVel = 0;
Pacman.prototype.mazecollision = false;

var pacman = Pacman.prototype;

var face;
var leftedge;
var rightedge;
var topedge;
var bottomedge;

var turn = false;
var lastturn; 

var rail = [];

for (var i = 12; i < g_canvas.width; i += 24) {
    for (var j = 12; j < g_canvas.height; j += 24) {
        rail.push([i, j]);
    }
}

for (var i = 0; i < rail.length; i++) {
    //console.log(rail[i]);

}

Pacman.prototype.keepGoing = function(direction, x, y)
{

}

var lastturn = "";


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
    

    if (this.x != (g_canvas.width-this.width) && keys[this.GO_RIGHT]) {
        //face = rightedge
        //when pacman is moving right his x-coordinate is increasing...
        //the y coordinate stays the same
        //pacman can only turn to the right if he is on a horizontal rail

        for (var i = 0; i < rail.length; i++) {
            
            /*if (this.cy != rail[i][1])
            {
                if (lastturn === "down")
                {
                    while (this.cy < rail[i][1])
                    {
                        this.y += this.yVel;
                        this.cy = this.y + halfwidth;

                        if (this.cy === rail[i][1])
                        {
                            console.log("===");
                            this.xVel = 1;
                            this.yVel = 0;
                            lastturn === "right";
                            return;
                        }
                    }
                }
                else if (lastturn === "up")
                {
                    while (this.cy > rail[i][1])
                    {
                        this.y += this.yVel;
                        this.cy = this.y + halfwidth;

                        if (this.cy === rail[i][1])
                        {
                            console.log("===");
                            this.xVel = 1;
                            this.yVel = 0;
                            lastturn === "right";
                            return;
                        }
                    }

                }
            }
            else
            {*/                    
                if (this.cy === rail[i][1]) {
                    this.xVel = 1;
                    this.yVel = 0;
                    break;
                }
            //}
        }
    }

    else if (this.x != 0 && keys[this.GO_LEFT]) {
        //face = leftedge
        for (var i = 0; i < rail.length; i++) {

            if (this.cy === rail[i][1]) {
                this.xVel = -1;
                this.yVel = 0;
            }
            /*while (this.cy != rail[i][1])
            {
                this.x += this.xVel;
                this.y += this.yVel;
                this.cx = this.x + halfwidth;
                this.cy = this.y + halfwidth;

                if (this.cy === rail[i][1]) {
                    this.xVel = -1;
                    this.yVel = 0;
                    break;
                }
            }*/

        }
    }

    else if (this.y != 0 && keys[this.GO_UP]) {
        //face = topedge;
        for (var i = 0; i < rail.length; i++) {

            
            if (this.cx === rail[i][0]) {
                this.xVel = 0;
                this.yVel = -1;
                lastturn = "up";
            }

            /*while (this.cx != rail[i][0])
            {
                this.x += this.xVel;
                this.y += this.yVel;
                this.cx = this.x + halfwidth;
                this.cy = this.y + halfwidth;
            }*/
        } 
    }
    else if (this.y != (g_canvas.height-this.height) && keys[this.GO_DOWN]) {
        //face = bottomedge;
        for (var i = 0; i < rail.length; i++) {
            /*while (this.cx != rail[i][0])
            {
                this.x += this.xVel;
                this.y += this.yVel;
                this.cx = this.x + halfwidth;
                this.cy = this.y + halfwidth;            
            }*/
            if (this.cx === rail[i][0]) {
                this.xVel = 0;
                this.yVel = 1;
                lastturn = "down";
            }
        }
    }

    else if (pacman.mazecollision || (face === "leftedge" && (leftedge === 12)) ||
        (face === "rightedge" && (rightedge === g_canvas.width)) || 
        (face === "topedge" && (topedge === 12 )) ||  
        (face === "bottomedge" && (bottomedge === g_canvas.height))) 
    {
        this.halt();
        //console.log("halt");
    }

    //----------------------------------------------------------------------------
    //console.log("still inside update routine?");
    //console.log("x: " + this.x + ", y: " +  this.y);
    //check for collision to the maze tiles
    //var tempXVel = 0;
    //if(keys[this.GO_RIGHT]){ var tempXVel = 1};
    var newNextX = this.x + this.xVel;
    var newNextY = this.y + this.yVel;
    var collided = this.checkMazeCollision(prevX, prevY, newNextX, newNextY);
    //------------------------------------------------------------------------------

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

//--------------------------Bætt við
Pacman.prototype.checkMazeCollision = function(prevX, prevY, nextX, nextY){
    //24 is the tile size
    //var tileX = Math.floor(prevX/24);
   // var tileY = Math.floor(prevY/24);

    var xFactor = 0;
    var yFactor = 0;
    var tempXVel = this.xVel;
    var tempYVel = this.yVel;

    if(keys[this.GO_RIGHT]){ tempXVel = 1;}
    if(keys[this.GO_DOWN]) { tempYVel = 1;}

    if(tempXVel === 1) xFactor = 23;
    if(tempYVel === 1) yFactor = 23;

    var nextTileX = Math.floor((nextX+xFactor)/24);
    var nextTileY = Math.floor((nextY+yFactor)/24);
    console.log("nextTileX: " + nextTileX  + ", nextTileY" + nextTileY);

   if(g_levelMap[nextTileY][nextTileX] == "m"){
        //this.x = prevX;
        //this.y = prevY;
        this.halt();  
    }

};


var a = 0;
var b = 0;
var positions = [18, 18, 18, 18];   //starting position

Pacman.prototype.render = function (ctx) {
    leftedge = this.x + this.height/2;
    rightedge = leftedge + this.width/2;
    topedge = this.y + this.width/2;
    bottomedge = topedge + this.height/2;

    // going left
    if (this.xVel < 0) {
        positions = [51, 52, 53, 54];
        face = "leftedge";
    }
    // going right
    else if (this.xVel > 0) {
        positions = [17, 18, 19, 20];
        face = "rightedge";
    }
    // going up
    else if (this.yVel < 0) {
        positions = [0, 1, 2, 3];
        face = "topedge";
    }
    // going down
    else if (this.yVel > 0) {
        positions = [34, 35, 36, 37];
        face = "bottomedge";
    }
    /*if (face === "topedge") console.log("topedge");
    if (face === "bottomedge") console.log("bottomedge");
    if (face === "leftedge") console.log("leftedge");
    if (face === "rightedge") console.log("rightedge");*/
    //console.log(face);
    //console.log(leftedge);
    //console.log(rightedge);
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

