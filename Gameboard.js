// ==========
// Gameboard stuff
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Gameboard(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

Gameboard.prototype.foodCounter = 0;
Gameboard.prototype.foodLeft = 0;

// Initial, inheritable, default values
Gameboard.prototype.tileArray = [];
Gameboard.prototype.level = 1;
var g_levelMap = g_levels[0];

Gameboard.prototype.nextLevel = function() {

    if(this.level === g_levels.length){
        // YOU WIN!!

        // kalla á win aðferð?

        main.gameOver();
    }
    this.reset(this.level+1);

    entityManager._pacman[0].reset();
    entityManager._ghost[0].reset();

    main.init();
};


//tileArray consists of Tile objects...
Gameboard.prototype.fillBoard = function() {
    for(var i = 0; i < g_levelMap.length; i++){
       // console.log("i : " + i);
       // console.log("g_levelMap.length[i] : " + g_levelMap[0].length);
        for(var j = 0; j < g_levelMap[i].length; j++){
            var tileSize = 24; //width and height is the same
            var xPos = j*24;
            var yPos = i*24;
            var mapPos = [j, i];
            if(g_levelMap[i][j] === 1) {var type = "maze";}                                 // m
            else if(g_levelMap[i][j] === 2) {var type = "food"; this.foodLeft++; }          // f
            else if(g_levelMap[i][j] === 3) {var type = "ghostbox";}                        // g
            else if(g_levelMap[i][j] === 4) {var type = "magicBean"; this.foodLeft++ }      // b
            else {var type = "foodeaten";}

            this.tileArray.push(new Tile(xPos, yPos, type, mapPos)); 
        }
    }
};

Gameboard.prototype.firstCherryEaten = false;
Gameboard.prototype.secondCherryEaten = false;

Gameboard.prototype.cherryEaten = function(){
    if(!this.firstCherryEaten){
        this.firstCherryEaten = true;
        return;
    }
    if(!this.secondCherryEaten){
        this.secondCherryEaten = true;
        return;
    }
}

Gameboard.prototype.update = function (du) {
    //setja cherry a stað 10, 10 í tile position (fyrir neðan draugabox);
    if(this.foodCounter > 49 && !this.firstCherryEaten){
        var cherryPosition = 10 + 10*g_levelMap[10].length; //frá 2d í 1d fylkja index
        this.tileArray[220].type = "cherry";
    }

    if(this.foodCounter > 124 && this.firstCherryEaten && !this.secondCherryEaten){
        var cherryPosition = 10 + 10*g_levelMap[10].length; //frá 2d í 1d fylkja index
        this.tileArray[220].type = "cherry";
    }

    if(this.foodLeft === 0) {
        this.nextLevel();
    }

};


Gameboard.prototype.render = function (ctx) {
    for (var i = 0; i < this.tileArray.length; i++) 
    {    
        Tile.prototype.makeTile(ctx, this.tileArray[i].x, this.tileArray[i].y, 
                                this.tileArray[i].type);     
    }


    /*
    ctx.save();
    ctx.fillStyle = "red";
    ctx.fillRect(this.tileArray[220].x, this.tileArray[220].y, 24, 24);
    ctx.restore();*/
};

Gameboard.prototype.clearBoard = function(){
    while(this.tileArray.length > 0){
        this.tileArray.pop();
    }
};

Gameboard.prototype.reset = function(level){
    this.level = level;
    this.clearBoard();
    g_levelMap = g_levels[level - 1];
    this.fillBoard();
    this.firstCherryEaten = false;
    this.secondCherryEaten = false;
    this.foodCounter = 0;
    this.foodLeft = 0;
};

Gameboard.prototype.fillBoard();



