// ==========
// Pacman stuff
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Ghost(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}



// Initial, inheritable, default values
/*Ghost.prototype.x = 72;                     //R stendur fyrir red, as in red ghost
Ghost.prototype.y = 264;                    

Ghost.prototype.xG = 72;                     //Green ghost
Ghost.prototype.yG = 72;

Ghost.prototype.xP = 192;                     //Pink ghost
Ghost.prototype.yP = 72;

Ghost.prototype.xO = 192;                     //Orange ghost
Ghost.prototype.yO = 264;*/

Ghost.prototype.x = 72;
Ghost.prototype.y = 264;

Ghost.prototype.width = tile_width;
Ghost.prototype.height = tile_height;
Ghost.prototype.cx = 50+tile_width/2;                    //center x
Ghost.prototype.cy = 50+tile_height/2;                    //center y

Ghost.prototype.xVel = 0;
Ghost.prototype.yVel = 0;
Ghost.prototype.mazecollision = false;

var ghost = Ghost.prototype;

var leftedge;
var rightedge;
var topedge;
var bottomedge;
var goingright = true;
var goingleft = false;
var goingup = false;
var goingdown = false;

var turn = false;
var lastturn = "";

Ghost.prototype.update = function (du) {
    var prevX = this.x;
    var prevY = this.y;
    var nextX = prevX + this.xVel;
    var nextY = prevY + this.yVel;
    var halfwidth = this.width/2;
    var halfheight = this.height/2;
    var board = Gameboard.prototype;
    
    var turn = false;

    this.checkPacCollision();
    //check for tile collision
   if(this.x % 24 === 0 && this.y % 24 === 0){
        this.checkpos();
   }

    if (this.x != (g_canvas.width-this.width) && goingright) {
        for (var i = 0; i < rail.length; i++) {         
                if (this.cy === rail[i][1]) {
                    this.xVel = 1;
                    this.yVel = 0;
                    break;
                }
        }
    }

    else if (this.x != 0 && goingleft) {
        for (var i = 0; i < rail.length; i++) {
            if (this.cy === rail[i][1]) {
                this.xVel = -1;
                this.yVel = 0;
            }
        }
    }

    else if (this.y != 0 && goingup) {
        for (var i = 0; i < rail.length; i++) {   
            if (this.cx === rail[i][0]) {
                this.xVel = 0;
                this.yVel = -1;
                lastturn = "up";
            }

        } 
    }
    else if (this.y != (g_canvas.height-this.height) && goingdown) {
        for (var i = 0; i < rail.length; i++) {
            if (this.cx === rail[i][0]) {
                this.xVel = 0;
                this.yVel = 1;
                lastturn = "down";
            }
        }
    }

 
    //----------------------------------------------------------------------------
    var newNextX = this.x + this.xVel;
    var newNextY = this.y + this.yVel;
    

    //if(this.checkMazeCollision(this.xVel, this.yVel, newNextX, newNextY)) 
    //{
    //    this.halt();
    //    this.turn();
    //}
    //------------------------------------------------------------------------------

    this.x += this.xVel;
    this.y += this.yVel;
    this.cx = this.x + halfwidth;
    this.cy = this.y + halfwidth;
    
};

Ghost.prototype.checkpos = function()
{
    //ef draugurinn klessir á vegg ætlum við að stoppa og snúa
    var pacman = entityManager._pacman[0];
    var Px = pacman.x;                          // x hnit pacman
    var Py = pacman.y;                          // y hnit pacman
    //console.log(Py);
    var xdif = Px - this.x;                    // Lengdin milli pacman og draugs á x-ás (gæti verið mínus tala)
    var ydif = Py - this.y;                    // Lengdin á milli pacman og draugs á y-ás (gæti verið mínus tala)
    var xdif2 = xdif;
    var ydif2 = ydif;
    if(xdif < 0){
        xdif2 = xdif*-1;                        // algildið af lengdinni á x-ás
    }
    if(ydif < 0){
        ydif2 = ydif*-1;                        // algildið af lengdinni á y-ás
    }
    var nextrightX = this.x+1;
    var nextleftX = this.x-1;
    var nextupY = this.y-1;
    var nextdownY = this.y+1;
    //athuga hvort sé veggur fyrir ofan
    var wallup = this.checkMazeCollision(0, -1, this.x, nextupY);
    //athuga hvort sé veggur fyrir neðan      
    var walldown = this.checkMazeCollision(0, 1, this.x, nextdownY); 
    //athuga hvort sé veggur til hægri
    var wallright = this.checkMazeCollision(1, 0, nextrightX, this.y);
    //athuga hvort sé veggur til vinstri
    var wallleft = this.checkMazeCollision(-1, 0, nextleftX, this.y);
    //console.log(wallup);
    if(wallup || walldown || wallright || wallleft){
        this.halt();
    }
    //ef það er ekki veggur fyrir ofan
    if(wallup === false){
        if(xdif2 >= ydif2){                                  //ef það er betra að ferðast eftir x-ás, þurfum við að athuga til hægri og vinstri
            if(xdif > 0){                                   //ef pacman er hægra megin og það er ekki veggur til hægri, þá förum til hægri
                if(wallright === false){
                    this.goingright();
                }
                else if(wallright === true && ydif > 0){   //ef pacman er til hægri og það er veggur til hægri, þá ath við hvort pacman sé fyrir ofan eða neðan
                    if(walldown === false){
                        this.goingdown();                   //ef hann er fyrir neðan og það er ekki veggur fyrir neða, þá förum við niður
                    }
                    else{
                        this.goingup();                     //annars upp
                    }
                }else{
                    this.goingup();
                }
            }else if(xdif < 0){                             //ef pacman er vinstramegin förum við til vinstri nema þar sé veggur
                if(wallleft === false){
                    this.goingleft();
                }
                else if(wallleft === true && ydif > 0){
                    if(walldown === false){                 //ef veggur er til vinstri og packman er fyrir neðan, þá förum við niður
                        this.goingdown();
                    }
                    else if(wallright === false){
                        this.goingright();                     //annars upp
                    }
                    else{
                        this.goingup();
                    }
                }else{
                    this.goingup();
                }
            }
        }
        else if(ydif >= 0){                                 //Ef það borgar sig að fara um y-ás, þá athugum við hvort pacman sé fyrir neðan
            if(walldown === false){                         //ef hann er fyrir neðan og það er ekki veggur fyrir neðan, förum við niður
                this.goingdown();
            }
            else if(walldown === true && xdif > 0){         //ef pacman er fyrir neðan en það er veggur fyrir neðan draug og pacman er hægra megin, förum við til hægri
                if(wallright === false){
                    this.goingright();
                }
                else{
                    this.goingup();                         //annars upp
                }
            }else if(walldown === true && xdif < 0){           // ef pacman er vinstra megin, þá förum við til vinstri, nema ef veggur er, þá upp
                if(wallleft === false){
                    this.goingleft();
                }
                else{
                    this.goingup();
                }
            }
        }
        else if(ydif < 0){
            this.goingup();
        }
    }else if(wallup === true){                                                  // ef það hins vegar er veggur fyrir ofan
        if(ydif2 >= xdif2 && ydif > 0){                                       //ef pacman er fyrir neðan og við viljum ferðast eftir y-ás
            if(walldown === false){
                this.goingdown();
            }
            else if(walldown === true && xdif > 0){                            //ef pacman er fyrir neðan en það er veggur fyrir neðan
                if(wallright === false){
                    this.goingright();
                }
                else{
                    this.goingleft();
                }
            }
            else if(walldown === true && xdif < 0){
                if(wallleft === false){
                    this.goingleft();
                }
                else{
                    this.goingright();
                }
            }
        }
        else if(xdif >= 0){                                                  //ef pacman er hægra megin
            if(wallright === false){
                this.goingright();
            }
            else if(wallleft === false){
                this.goingleft();
            }
            else{
                this.goingdown();
            }
        }else{
            if(wallleft === false){                                         //ef pacman er vinstra megin
                this.goingleft();
            }
            else if(walldown === false){
                this.goingdown();
            }
            else{
                this.goingright();
            }
        }                                    
    }
}


Ghost.prototype.goingright = function()
{
    goingright = true;
    goingleft = false;
    goingup = false;
    goingdown = false;
    this.xVel = 1;
    this.yVel = 0;
}

Ghost.prototype.goingleft = function()
{
    goingright = false;
    goingleft = true;
    goingup = false;
    goingdown = false;
    this.xVel = -1;
    this.yVel = 0;
}

Ghost.prototype.goingup = function()
{
    goingright = false;
    goingleft = false;
    goingup = true;
    goingdown = false;
    this.xVel = 0;
    this.yVel = -1;
}

Ghost.prototype.goingdown = function()
{
    goingright = false;
    goingleft = false;
    goingup = false;
    goingdown = true;
    this.xVel = 0;
    this.yVel = 1;
}


Ghost.prototype.halt = function()
{
    this.xVel = 0;
    this.yVel = 0;
}

Ghost.prototype.checkMazeCollision = function(tempXVel, tempYVel, nextX, nextY) {
    //24 is the tile size  global variable tile_width)

    var xFactor = 0;
    var yFactor = 0;

    if(tempXVel === 1) xFactor = 23;
    if(tempYVel === 1) yFactor = 23;

    var nextTileX = Math.floor((nextX+xFactor)/tile_width);
    var nextTileY = Math.floor((nextY+yFactor)/tile_width);

    if(g_levelMap[nextTileY][nextTileX] === "m") {
        return true;  
    }
    else{return false;}
};


Ghost.prototype.checkPacCollision = function(prevX, prevY, nextX, nextY){
    var pacman = entityManager._pacman[0];
    var Px = pacman.x;                          // x hnit pacman
    var Py = pacman.y;
    var pacmanWidth = pacman.width;
    var pacmanMiddleX = Px + pacmanWidth/2;
    var pacmanMiddleY = Py + pacmanWidth/2;
  
    if((this.x <= pacmanMiddleX && pacmanMiddleX <= this.x+this.width) && (this.y <= pacmanMiddleY && pacmanMiddleY<= this.y+this.height)){
        main.gameOver();
    }    
}


var c = 0;
var d = 0;
var positionsG = [4, 4];   //starting position

Ghost.prototype.render = function (ctx) {
    leftedge = this.x + this.height/2;
    rightedge = leftedge + this.width/2;
    topedge = this.y + this.width/2;
    bottomedge = topedge + this.height/2;

    // going left
    if (this.xVel < 0) {
        positionsG = [55, 56];
        goingleft = true;
        goingright = false;
        goingup = false;
        goingdown = false;
    }
    // going right
    else if (this.xVel > 0) {
        positionsG = [21, 22];
        goingright = true;
        goingleft = false;
        goingup = false;
        goingdown = false;
    }
    // going up
    else if (this.yVel < 0) {
        positionsG = [4,5];
        goingup = true;
        goingright = false;
        goingleft = false;
        goingdown = false;
    }
    // going down
    else if (this.yVel > 0) {
        positionsG = [38,39];
        goingdown = true;
        goingright = false;
        goingup = false;
        goingleft = false;
    }
    
    g_sprites[positionsG[c]].drawAt(ctx, this.x, this.y);
    d += 0.5;
    if (d % 1 === 0) ++c;    
    if (c === 2) c = 0;
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

