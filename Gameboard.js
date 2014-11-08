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
                ["m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m"], //1
                ["m", "f", "f", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //2
                ["m", "f", "g", "f", "m", "f", "m", "m", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "g", "f", "m"], //3
                ["m", "f", "f", "f", "f", "f", "f", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //4
                ["m", "f", "m", "m", "m", "m", "m", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //5
                ["m", "f", "f", "f", "m", "f", "f", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //6
                ["m", "f", "m", "f", "m", "f", "m", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //7
                ["m", "f", "m", "f", "f", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //8
                ["m", "f", "m", "f", "m", "f", "m", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //9
                ["m", "f", "f", "f", "m", "f", "f", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //10
                ["m", "f", "m", "f", "m", "f", "m", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //11
                ["m", "f", "m", "f", "f", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //12
                ["m", "f", "m", "f", "m", "f", "m", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //13
                ["m", "f", "f", "f", "m", "f", "f", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //14
                ["m", "f", "m", "m", "m", "m", "m", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //15
                ["m", "f", "f", "f", "f", "f", "f", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //16
                ["m", "f", "g", "f", "m", "f", "m", "m", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "g", "f", "m"], //17
                ["m", "f", "f", "f", "m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //18    
                ["m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m"], //19              
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
            
            if(g_levelMap[i][j] === "m") {var type = "maze"};
            if(g_levelMap[i][j] === "f") {var type = "food"};
            if(g_levelMap[i][j] === "g") {var type = "ghostbox"};
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

