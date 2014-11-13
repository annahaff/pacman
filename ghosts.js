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
Ghost.prototype.xR = 216;                     //R stendur fyrir red, as in red ghost
Ghost.prototype.yR = 192;     

Ghost.prototype.xG = 240;                     //Green ghost
Ghost.prototype.yG = 192;

Ghost.prototype.xP = 216;                     //Pink ghost
Ghost.prototype.yP = 216;

Ghost.prototype.xO = 240;                     //Orange ghost
Ghost.prototype.yO = 216;


Ghost.prototype.width = tile_width;
Ghost.prototype.height = tile_height;
Ghost.prototype.cx = 24*10+tile_width/2;                    //center x
Ghost.prototype.cy = 24*9+tile_height/2;                    //center y

Ghost.prototype.scaredFlag = false;

Ghost.prototype.xVel = 0;
Ghost.prototype.yVel = 0;
Ghost.prototype.mazecollision = false;

var ghost = Ghost.prototype;

var leftedge;
var rightedge;
var topedge;
var bottomedge;
Ghost.prototype.goingright = false;
Ghost.prototype.goingleft = false;
Ghost.prototype.goingup = false;
Ghost.prototype.goingdown = false;

var turn = false;
var lastturn = "";

Ghost.prototype.reset = function(){
    this.xR = 24*10;
    this.yR = 24*9;

    this.cx = 24*10+tile_width/2;  
    this.cy = 24*9+tile_height/2; 

    this.xVel = 0;
    this.yVel = 0;
}

Ghost.prototype.update = function (du) {
    var prevX = this.xR;
    var prevY = this.yR;
    var nextX = prevX + this.xVel;
    var nextY = prevY + this.yVel;
    var halfwidth = this.width/2;
    var halfheight = this.height/2;
    var board = Gameboard.prototype;
    
    var turn = false;


    this.checkPacCollision();

    //check for tile collision

   if(this.xR % 24 === 0 && this.yR % 24 === 0){
        this.checkpos();
   }

    if (this.xR != (g_canvas.width-this.width) && this.goingright) {
        for (var i = 0; i < rail.length; i++) {         
                if (this.cy === rail[i][1]) {
                    this.xVel = 1;
                    this.yVel = 0;
                    break;
                }
        }
    }

    else if (this.xR != 0 && this.goingleft) {
        for (var i = 0; i < rail.length; i++) {
            if (this.cy === rail[i][1]) {
                this.xVel = -1;
                this.yVel = 0;
            }
        }
    }

    else if (this.yR != 0 && this.goingup) {
        for (var i = 0; i < rail.length; i++) {   
            if (this.cx === rail[i][0]) {
                this.xVel = 0;
                this.yVel = -1;
                lastturn = "up";
            }

        } 
    }
    else if (this.yR != (g_canvas.height-this.height) && this.goingdown) {
        for (var i = 0; i < rail.length; i++) {
            if (this.cx === rail[i][0]) {
                this.xVel = 0;
                this.yVel = 1;
                lastturn = "down";
            }
        }
    }

 
    //----------------------------------------------------------------------------
    var newNextX = this.xR + this.xVel;
    var newNextY = this.yR + this.yVel;
    

    //if(this.checkMazeCollision(this.xVel, this.yVel, newNextX, newNextY)) 
    //{
    //    this.halt();
    //    this.turn();
    //}
    //------------------------------------------------------------------------------

    this.xR += this.xVel;
    this.yR += this.yVel;
    this.cx = this.xR + halfwidth;
    this.cy = this.yR + halfwidth;
    
};

Ghost.prototype.checkpos = function()
{
    //ef draugurinn klessir á vegg ætlum við að stoppa og snúa
    var pacman = entityManager._pacman[0];
    var Px = pacman.x;                          // x hnit pacman
    var Py = pacman.y;                          // y hnit pacman
    //console.log(Py);
    var xdif = Px - this.xR;                    // Lengdin milli pacman og draugs á x-ás (gæti verið mínus tala)
    var ydif = Py - this.yR;                    // Lengdin á milli pacman og draugs á y-ás (gæti verið mínus tala)
    var xdif2 = xdif;
    var ydif2 = ydif;
    if(xdif < 0){
        xdif2 = xdif*-1;                        // algildið af lengdinni á x-ás
    }
    if(ydif < 0){
        ydif2 = ydif*-1;                        // algildið af lengdinni á y-ás
    }
    var nextrightX = this.xR+1;
    var nextleftX = this.xR-1;
    var nextupY = this.yR-1;
    var nextdownY = this.yR+1;
    //athuga hvort sé veggur fyrir ofan
    var wallup = this.checkMazeCollision(0, -1, this.xR, nextupY);
    //athuga hvort sé veggur fyrir neðan      
    var walldown = this.checkMazeCollision(0, 1, this.xR, nextdownY); 
    //athuga hvort sé veggur til hægri
    var wallright = this.checkMazeCollision(1, 0, nextrightX, this.yR);
    //athuga hvort sé veggur til vinstri
    var wallleft = this.checkMazeCollision(-1, 0, nextleftX, this.yR);
    //console.log(wallup);
    if(wallup || walldown || wallright || wallleft){
        this.halt();
    }
    //ef það er ekki veggur fyrir ofan
    if(wallup === false){
        if(xdif2 >= ydif2){                                  //ef það er betra að ferðast eftir x-ás, þurfum við að athuga til hægri og vinstri
            if(xdif > 0){                                   //ef pacman er hægra megin og það er ekki veggur til hægri, þá förum til hægri
                if(wallright === false){
                    this.goingRight();
                }
                else if(wallright === true && ydif > 0){   //ef pacman er til hægri og það er veggur til hægri, þá ath við hvort pacman sé fyrir ofan eða neðan
                    if(walldown === false){
                        this.goingDown();                   //ef hann er fyrir neðan og það er ekki veggur fyrir neða, þá förum við niður
                    }
                    else{
                        this.goingUp();                     //annars upp
                    }
                }else{
                    this.goingUp();
                }
            }else if(xdif < 0){                             //ef pacman er vinstramegin förum við til vinstri nema þar sé veggur
                if(wallleft === false){
                    this.goingLeft();
                }
                else if(wallleft === true && ydif > 0){
                    if(walldown === false){                 //ef veggur er til vinstri og packman er fyrir neðan, þá förum við niður
                        this.goingDown();
                    }
                    else if(wallright === false){
                        this.goingRight();                     //annars upp
                    }
                    else{
                        this.goingUp();
                    }
                }else{
                    this.goingUp();
                }
            }
        }
        else if(ydif >= 0){                                 //Ef það borgar sig að fara um y-ás, þá athugum við hvort pacman sé fyrir neðan
            if(walldown === false){                         //ef hann er fyrir neðan og það er ekki veggur fyrir neðan, förum við niður
                this.goingDown();
            }
            else if(walldown === true && xdif > 0){         //ef pacman er fyrir neðan en það er veggur fyrir neðan draug og pacman er hægra megin, förum við til hægri
                if(wallright === false){
                    this.goingRight();
                }
                else{
                    this.goingUp();                         //annars upp
                }
            }else if(walldown === true && xdif < 0){           // ef pacman er vinstra megin, þá förum við til vinstri, nema ef veggur er, þá upp
                if(wallleft === false){
                    this.goingLeft();
                }
                else{
                    this.goingUp();
                }
            }
        }
        else if(ydif < 0){
            this.goingUp();
        }
    }else if(wallup === true){                                                  // ef það hins vegar er veggur fyrir ofan
        if(ydif2 >= xdif2 && ydif > 0){                                       //ef pacman er fyrir neðan og við viljum ferðast eftir y-ás
            if(walldown === false){
                this.goingDown();
            }
            else if(walldown === true && xdif > 0){                            //ef pacman er fyrir neðan en það er veggur fyrir neðan
                if(wallright === false){
                    this.goingRight();
                }
                else{
                    this.goingLeft();
                }
            }
            else if(walldown === true && xdif < 0){
                if(wallleft === false){
                    this.goingLeft();
                }
                else{
                    this.goingRight();
                }
            }
        }
        else if(xdif >= 0){                                                  //ef pacman er hægra megin
            if(wallright === false){
                this.goingRight();
            }
            else if(wallleft === false){
                this.goingLeft();
            }
            else{
                this.goingDown();
            }
        }else{
            if(wallleft === false){                                         //ef pacman er vinstra megin
                this.goingLeft();
            }
            else if(walldown === false){
                this.goingDown();
            }
            else{
                this.goingRight();
            }
        }                                    
    }
}


Ghost.prototype.goingRight = function()
{
    this.goingright = true;
    this.goingleft = false;
    this.goingup = false;
    this.goingdown = false;
    this.xVel = 1;
    this.yVel = 0;
}

Ghost.prototype.goingLeft = function()
{
    this.goingright = false;
    this.goingleft = true;
    this.goingup = false;
    this.goingdown = false;
    this.xVel = -1;
    this.yVel = 0;
}

Ghost.prototype.goingUp = function()
{
    this.goingright = false;
    this.goingleft = false;
    this.goingup = true;
    this.goingdown = false;
    this.xVel = 0;
    this.yVel = -1;
}

Ghost.prototype.goingDown = function()
{
    this.goingright = false;
    this.goingleft = false;
    this.goingup = false;
    this.goingdown = true;
    this.xVel = 0;
    this.yVel = 1;
}


Ghost.prototype.halt = function(){
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

    if(g_levelMap[nextTileY][nextTileX] === 1) { // maze
        return true;  
    }
    return false;
};


Ghost.prototype.checkPacCollision = function(prevX, prevY, nextX, nextY){

    var pacman = entityManager._pacman[0];
    var Px = pacman.x;                          // x hnit pacman
    var Py = pacman.y;
    var pacmanWidth = pacman.width;
    var pacmanMiddleX = Px + pacmanWidth/2;
    var pacmanMiddleY = Py + pacmanWidth/2;
  
    if((this.xR <= pacmanMiddleX && pacmanMiddleX <= this.xR+this.width) && (this.yR <= pacmanMiddleY && pacmanMiddleY<= this.yR+this.height)){

        pacman.lives--;
        pacman.reset();
        this.reset();
    }    

}


var c = 0;
var d = 0;
Ghost.prototype.positionsG = [4, 4];   //starting position

Ghost.prototype.render = function (ctx) {
    leftedge = this.xR + this.height/2;
    rightedge = leftedge + this.width/2;
    topedge = this.yR + this.width/2;
    bottomedge = topedge + this.height/2;

    // going left
    if (this.xVel < 0) {
        this.positionsG = [55, 56];
        if(this.scaredFlag) this.positionsG = [64,65];
        this.goingleft = true;
        this.goingright = false;
        this.goingup = false;
        this.goingdown = false;
    }
    // going right
    else if (this.xVel > 0) {
        this.positionsG = [21, 22];
        if(this.scaredFlag) this.positionsG = [30,31];
        this.goingright = true;
        this.goingleft = false;
        this.goingup = false;
        this.goingdown = false;
    }
    // going up
    else if (this.yVel < 0) {
        this.positionsG = [4,5];
        if(this.scaredFlag) this.positionsG = [13,14];
        this.goingup = true;
        this.goingright = false;
        this.goingleft = false;
        this.goingdown = false;
    }
    // going down
    else if (this.yVel > 0) {
        this.positionsG = [38,39];
        if(this.scaredFlag) this.positionsG = [47,48];
        this.goingdown = true;
        this.goingright = false;
        this.goingup = false;
        this.goingleft = false;
    }

    
    
    g_sprites[this.positionsG[c]].drawAt(ctx, this.xR, this.yR);
    d += 0.5;
    if (d % 1 === 0) ++c;    
    if (c === 1) c = 0;
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



//---------------------------------- Bæta við hinum draugunum---------------------------------
//Bæti við hinum draugunum með inheritance, svo það verði auðveldara að bæta við sér
//hegðun f. hvern draug ef við viljum




Pinky.prototype = new Ghost();
Pinky.prototype.constructor = Pinky;
function Pinky(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}


Pinky.prototype.xR = 216+24;                     //R stendur fyrir red, as in red ghost
Pinky.prototype.yR = 192;


Pinky.prototype.positionsG = [8, 9];   //starting position

Pinky.prototype.render = function (ctx) {
    leftedge = this.xR + this.height/2;
    rightedge = leftedge + this.width/2;
    topedge = this.yR + this.width/2;
    bottomedge = topedge + this.height/2;

    this.updateRenderDirection();
    
    g_sprites[this.positionsG[c]].drawAt(ctx, this.xR, this.yR);
    d += 0.5;
    if (d % 1 === 0) ++c;    
    if (c === 1) c = 0;
};



Pinky.prototype.updateRenderDirection = function(){

    // going left
    if (this.xVel < 0) {
        this.positionsG = [55, 56];
        if(this.scaredFlag) this.positionsG = [64,65];
        this.goingleft = true;
        this.goingright = false;
        this.goingup = false;
        this.goingdown = false;
    }
    // going right
    else if (this.xVel > 0) {
        this.positionsG = [21, 22];
        if(this.scaredFlag) this.positionsG = [30,31];
        this.goingright = true;
        this.goingleft = false;
        this.goingup = false;
        this.goingdown = false;
    }
    // going up
    else if (this.yVel < 0) {
        this.positionsG = [4,5];
        if(this.scaredFlag) this.positionsG = [13,14];
        this.goingup = true;
        this.goingright = false;
        this.goingleft = false;
        this.goingdown = false;
    }
    // going down
    else if (this.yVel > 0) {
        this.positionsG = [38,39];
        if(this.scaredFlag) this.positionsG = [47,48];
        this.goingdown = true;
        this.goingright = false;
        this.goingup = false;
        this.goingleft = false;
    }
    this.positionsG[0] += 4;
    this.positionsG[1] += 4;
    //console.log(this.positionsG[0]);

};