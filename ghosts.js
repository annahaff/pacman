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
Ghost.prototype.xR = 72;                     //R stendur fyrir red, as in red ghost
Ghost.prototype.yR = 264;                    

Ghost.prototype.xG = 72;                     //Green ghost
Ghost.prototype.yG = 72;

Ghost.prototype.xP = 192;                     //Pink ghost
Ghost.prototype.yP = 72;

Ghost.prototype.xO = 192;                     //Orange ghost
Ghost.prototype.yO = 264;


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
    var prevX = this.xR;
    var prevY = this.yR;
    var nextX = prevX + this.xVel;
    var nextY = prevY + this.yVel;
    var halfwidth = this.width/2;
    var halfheight = this.height/2;
    var board = Gameboard.prototype;
    
    var turn = false;

    //check for tile collision
   

    if (this.xR != (g_canvas.width-this.width) && goingright) {
        for (var i = 0; i < rail.length; i++) {
            
                         
                if (this.cy === rail[i][1]) {
                    this.xVel = 1;
                    this.yVel = 0;
                    break;
                }
        }
    }

    else if (this.xR != 0 && goingleft) {
        for (var i = 0; i < rail.length; i++) {

            if (this.cy === rail[i][1]) {
                this.xVel = -1;
                this.yVel = 0;
            }
        }
    }

    else if (this.yR != 0 && goingup) {
        for (var i = 0; i < rail.length; i++) {   
            if (this.cx === rail[i][0]) {
                this.xVel = 0;
                this.yVel = -1;
                lastturn = "up";
            }

        } 
    }
    else if (this.yR != (g_canvas.height-this.height) && goingdown) {
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
    //ef draugurinn klessir á vegg ætlum við að stoppa og snúa
    if(this.checkMazeCollision(this.xVel, this.yVel, newNextX, newNextY)) 
    {
        this.halt();
        this.turn();
    }
    //------------------------------------------------------------------------------

    this.xR += this.xVel;
    this.yR += this.yVel;
    this.cx = this.xR + halfwidth;
    this.cy = this.yR + halfwidth;
    
};

//Þetta fall snýr draugnum í þá átt sem er líklegust til að færa hann nær pacman
Ghost.prototype.turn = function()
{
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
    //Ef draugurinn er að fara til vinstri þegar hann klessir á vegginn, þá æthugum við fyrst hvort vænlegra er að færa drauginn eftir
    //x-ás eða y-ás, ef það er vænlegra að færa hann eftir x-ás, þá er bara ein leið í boði, þannig að við vitum að það er bara
    //vænlegt ef pacman er hægra megin við okkur. 
    if(goingleft){
        goingleft = false;                        
        if((xdif2 > ydif2) && (xdif > 0)){
            goingright = true;
            this.xVel = 1;
            this.yVel = 0;
        }
        //Nú vitum við að við viljum ferðast eftir y-ás, athugum hvort pacman sé fyrir ofan eða neðan okkur.
        else if(ydif < 0){                      //Er hann fyrir ofan?
            goingup = true;
            this.xVel = 0;
            this.yVel = -1;
        }
        else{                                      //Þá hlýtur hann að vera fyrir neðan
            goingdown = true;
            this.xVel = 0;
            this.yVel = 1;
        }
    }
    //Ef draugurinn er að fara til hægri þegar hann klessir á vegginn, þá æthugum við fyrst hvort vænlegra er að færa drauginn eftir
    //x-ás eða y-ás, ef það er vænlegra að færa hann eftir x-ás, þá er bara ein leið í boði, þannig að við vitum að það er bara
    //vænlegt ef pacman er vinstra megin við okkur. 
    else if(goingright){
        goingright = false;
        if((xdif2 > ydif2) && (xdif < 0)){
            goingleft = true;
            this.xVel = -1;
            this.yVel = 0;
        }
        //Hér vitum við að við viljum ferðast eftir y-ás, þannig að við athugum hvort pacman sé fyrir ofan eða neða okkur
        else if(ydif < 0){
            goingup = true;
            this.xVel = 0;
            this.yVel = -1;
        }
        else{
            goingdown = true;
            this.xVel = 0;
            this.yVel = 1; 
        }
    }
    //Ef draugurinn er að fara niður þegar hann klessir á vegg, þá athugum við fyrst hvort vænlegast sé að fara upp, það er að
    //segja, hvort sniðugast sé að ferðast eftir y-ás og pacman sé fyrir ofan okkur.
    else if(goingdown){
        goingdown = false;
        if((ydif2 > xdif2) && (ydif < 0)){
            goingup = true;
            this.xVel = 0;
            this.yVel = -1;
        }
        //Hér vitum við að við viljum ferðast eftir x-ás, þannig að við athugum hvort pacman sé hægra megin eða vinstra megin við okkur
        else if(xdif > 0){              //Er hann hægra megin við okkur?
            goingright = true;
            this.xVel = 1;
            this.yVel = 0;
        }
        else{                           //Þá hlýtur hann að vera vinstra megin við okkur...
            goingleft = true;
            this.xVel = -1;
            this.yVel = 0;
        }
    }
    //Ef draugurinn er að fara upp þegar hann klessir á vegg, þá athugum við fyrst hvort vænlegast sé að fara niðu, það er að
    //segja, hvort sniðugast sé að ferðast eftir y-ás og pacman sé fyrir neðan okkur.
    else if(goingup){
        goingup = false;
        if((ydif2 > xdif2) && (ydif > 0)){
            goingdown = true;
            this.xVel = 0;
            this.yVel = 1;
        }
        //Hér vitum við að við viljum ferðast eftir x-ás, þannig að við athugum hvort pacman sé hægra megin eða vinstra megin við okkur
        else if(xdif > 0){
            goingright = true;
            this.xVel = 1;
            this.yVel = 0;
        }
        else{
            goingleft = true;
            this.xVel = -1;
            this.yVel = 0;
        }  
    }

    
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
};


//--------------------------Bætt við
/*Ghost.prototype.checkMazeCollision = function(prevX, prevY, nextX, nextY){
    //24 is the tile size
    //var tileX = Math.floor(prevX/24);
    // var tileY = Math.floor(prevY/24);






    /*var xFactor = 0;
    var yFactor = 0;
    var tempXVel = this.xVel;
    var tempYVel = this.yVel;

    if(goingright){ tempXVel = 1;}
    if(goingdown) { tempYVel = 1;}

    if(tempXVel === 1) xFactor = 23;
    if(tempYVel === 1) yFactor = 23;

    var nextTileX = Math.floor((nextX+xFactor)/24);
    var nextTileY = Math.floor((nextY+yFactor)/24);
    //console.log("nextTileX: " + nextTileX  + ", nextTileY" + nextTileY);

   if(g_levelMap[nextTileY][nextTileX] == "m"){
        //this.x = prevX;
        //this.y = prevY;
        this.halt();
        this.turn();
    }*/

//};

Ghost.prototype.checkPacCollision = function(prevX, prevY, nextX, nextY){

}


var c = 0;
var d = 0;
var positionsG = [4, 4];   //starting position

Ghost.prototype.render = function (ctx) {
    leftedge = this.xR + this.height/2;
    rightedge = leftedge + this.width/2;
    topedge = this.yR + this.width/2;
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
    /*if (face === "topedge") console.log("topedge");
    if (face === "bottomedge") console.log("bottomedge");
    if (face === "leftedge") console.log("leftedge");
    if (face === "rightedge") console.log("rightedge");*/
    //console.log(face);
    //console.log(leftedge);
    //console.log(rightedge);
    g_sprites[positionsG[c]].drawAt(ctx, this.xR, this.yR);
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

