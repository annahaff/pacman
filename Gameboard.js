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

// Initial, inheritable, default values
Gameboard.prototype.tileArray = [];
var g_levelMap = [                
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //1
                [1, 2, 2, 2, 4, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 4, 2, 2, 2, 1], //2
                [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1], //3
                [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], //4
                [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1], //5
                [1, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 1], //6
                [1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 2, 1, 1, 1, 1], //7
                [1, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 2, 1, 1, 1, 1], //8
                [0, 2, 2, 2, 2, 2, 2, 2, 0, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 0], //9
                [1, 1, 1, 1, 2, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 2, 1, 1, 1, 1], //10
                [1, 1, 1, 1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 2, 1, 1, 1, 1], //11
                [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1], //12
                [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1], //13
                [1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1], //14
                [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1], //15
                [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1], //16
                [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1], //17
                [1, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 1], //18    
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //19              
            ];


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
            if(g_levelMap[i][j] === 1) {var type = "maze";}              // m
            else if(g_levelMap[i][j] === 2) {var type = "food";}         // f
            else if(g_levelMap[i][j] === 3) {var type = "ghostbox";}     // g
            else if(g_levelMap[i][j] === 4) {var type = "magicBean";}    // b
            else {var type = "foodeaten";}

            this.tileArray.push(new Tile(xPos, yPos, type, mapPos));        
        }
    }
};


Gameboard.prototype.findPos = function (x, y) {
    for (var j = 0; j < this.tileArray.length; j++) {
        if (this.tileArray[j].x === x && this.tileArray[j].y === y) {
            return this.tileArray[j].pos;
        }
    }
};



Gameboard.prototype.findPos2 = function (xPos, yPos) {
    for (var j = 0; j < this.tileArray.length; j++) {
        if (this.tileArray[j].pos[0] === xPos && this.tileArray[j].pos[1] === yPos) {
            return this.tileArray[j];
        }
    }
}

Gameboard.prototype.update = function (du) {

};


Gameboard.prototype.render = function (ctx) {
    for (var i = 0; i < this.tileArray.length; i++) 
    {    
        Tile.prototype.makeTile(ctx, this.tileArray[i].x, this.tileArray[i].y, 
                                this.tileArray[i].type);     
    }
};

Gameboard.prototype.clearBoard = function(){
    while(this.tileArray.length > 0){
        this.tileArray.pop();
    }
}

Gameboard.prototype.fillBoard();

