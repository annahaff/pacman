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
                ["m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m"], //1
                ["m", "f", "f", "f", "f", "f", "m", "m", "f", "f", "f", "f", "f", "m"], //2
                ["m", "f", "f", "f", "f", "f", "m", "m", "f", "f", "f", "f", "f", "m"], //3
                ["m", "f", "f", "f", "f", "f", "m", "m", "f", "f", "f", "f", "f", "m"], //4
                ["m", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "f", "m"], //5
                ["m", "f", "f", "f", "m", "m", "m", "m", "m", "m", "f", "f", "f", "m"], //6
                ["m", "f", "f", "f", "f", "f", "m", "m", "f", "f", "f", "f", "f", "m"], //7
                ["m", "m", "m", "m", "m", "f", "m", "m", "f", "m", "m", "m", "m", "m"], //8
                ["m", "m", "m", "m", "m", "f", "f", "f", "f", "m", "m", "m", "m", "m"], //9
                ["m", "f", "f", "f", "f", "f", "m", "m", "f", "f", "f", "f", "f", "m"], //10
                ["m", "f", "f", "f", "f", "f", "m", "m", "f", "f", "f", "f", "f", "m"], //11
                ["m", "f", "f", "f", "f", "f", "m", "m", "f", "f", "f", "f", "f", "m"], //12
                ["m", "f", "f", "f", "f", "f", "m", "m", "f", "f", "f", "f", "f", "m"], //13
                ["m", "f", "f", "f", "f", "f", "m", "m", "f", "f", "f", "f", "f", "m"], //14
                ["m", "f", "f", "f", "f", "f", "m", "m", "f", "f", "f", "f", "f", "m"], //15
                ["m", "f", "f", "f", "f", "f", "m", "m", "f", "f", "f", "f", "f", "m"], //16
                ["m", "f", "f", "f", "f", "f", "m", "m", "f", "f", "f", "f", "f", "m"], //17
                ["m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m", "m"], //18              
            ];


//tileArray consists of Tile objects...
Gameboard.prototype.fillBoard = function() {
    /*for (var i = 0; i < g_canvas.width; i += tile_width*2) {          //cols
        for (var j = 0; j < g_canvas.height; j += tile_height) {      //rows

            var food = true;
            var maze = false;
            this.tileArray.push(new Tile(i, j, food, maze));
        }
    }
    for (var i = 24; i < g_canvas.width; i += tile_width*2) {
        for (var j = 24; j < g_canvas.height-24; j += tile_height) {    //rows
            var food = false;
            var maze = true;
            this.tileArray.push(new Tile(i, j, food, maze));
        }
    }*/

    //fill with food
    /*for (var i = 0; i < g_canvas.width; i += tile_width) {
        for (var j = 0; j < g_canvas.height; j += tile_height) {
            var food = true;
            var maze = false;
            this.tileArray.push(new Tile(i, j, food, maze));
        }
    }*/
    for(var i = 0; i < g_levelMap.length; i++){
       // console.log("i : " + i);
       // console.log("g_levelMap.length[i] : " + g_levelMap[0].length);
        for(var j = 0; j < g_levelMap[i].length; j++){
            //console.log("i = " + i + ", j = " + j);
            //console.log(g_levelMap[i][j]);
           // console.log(g_levelMap[i]);
            var tileSize = 24; //width and height is the same
            var xPos = j*24;
            var yPos = i*24;

            //console.log("x: " + xPos + ", y: " + yPos);
            
            if(g_levelMap[i][j] === "m") {var maze = true; var food = false;}
            if(g_levelMap[i][j] === "f") {var maze = false; var food = true;}
            
            this.tileArray.push(new Tile(xPos, yPos, food, maze));
            
        }
    }
};

Gameboard.prototype.update = function (du) {

};


Gameboard.prototype.render = function (ctx) {
    for (var i = 0; i < this.tileArray.length; i++) 
    {    
        Tile.prototype.makeTile(ctx, this.tileArray[i].x, this.tileArray[i].y, 
                                this.tileArray[i].isFood, this.tileArray[i].isMaze);     
    }
};

Gameboard.prototype.fillBoard();

