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
var g_levelMap =[                                 // 7   8
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //1
                [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1], //2
                [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1], //3
                [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], //4
                [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1], //5
                [1, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 1], //6
                [1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 2, 1, 1, 1, 1], //7
                [1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1], //8
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2], //9
                [1, 1, 1, 1, 2, 1, 1, 1, 2, 3, 3, 3, 2, 1, 1, 1, 2, 1, 1, 1, 1], //10
                [1, 1, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1, 1], //11
                [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1], //12
                [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1], //13
                [1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1], //14
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
            //console.log("i = " + i + ", j = " + j);
            //console.log(g_levelMap[i][j]);
            //console.log(g_levelMap[i]);
            var tileSize = 24; //width and height is the same
            var xPos = j*24;
            var yPos = i*24;

            //console.log("x: " + xPos + ", y: " + yPos);
            
            if(g_levelMap[i][j] === 1) {var type = "maze"};         // m
            if(g_levelMap[i][j] === 2) {var type = "food"};         // f
            if(g_levelMap[i][j] === 3) {var type = "ghostbox"};     // g
            if(g_levelMap[i][j] === 4) {var type = "magicBean"};    // b
            this.tileArray.push(new Tile(xPos, yPos, type));
            
        }
    }
};

Gameboard.prototype.update = function (du) {

};


Gameboard.prototype.render = function (ctx) {
    for (var i = 0; i < this.tileArray.length; i++) 
    {    
        Tile.prototype.makeTile(ctx, this.tileArray[i].x, this.tileArray[i].y, 
                                this.tileArray[i].type);     
    }
};

Gameboard.prototype.fillBoard();

