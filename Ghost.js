// ==========
// Pacman stuff
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Ghost(descr) {
    for (var property in descr) {
        this[property] = descr[property];
        this.reset_x = this.x;
        this.reset_y = this.y;
    }
}

Ghost.prototype.xVel = 0;
Ghost.prototype.yVel = 0;
Ghost.prototype.direction;
Ghost.prototype.lifeSpan = 30 * SECS_TO_NOMINALS;

Ghost.prototype.turn = function (direction, xy, rail, xVel, yVel) {
    for (var i = 0; i < rail.length; i++) {
        if (xy === this.cy) var r = rail[i][1];
        if (xy === this.cx) var r = rail[i][0];
        if (xy === r) {
            var nextXVel = xVel;
            var nextYVel = yVel;
            var testNextX = this.x + nextXVel;
            var testNextY = this.y + nextYVel;
            
            //make sure we are not trying to turn into a wall
            if (!this.checkMazeCollision(nextXVel, nextYVel, testNextX, testNextY)) {
                this.xVel = nextXVel;
                this.yVel = nextYVel;
                this.direction = direction;
            }
        }
    }
};

// returns which tile the ghost should choose to turn
// the tile is the closest distance to the target
Ghost.prototype.shortestDistance = function (neighbors, target) {
    var shortestDist;
    var tileArray = Gameboard.prototype.tileArray;
    var checkArray = [];
    var posArray = [];
    var tilePos;

    for (var i = 0; i < neighbors.length; i++) {
        for (var j = 0; j < tileArray.length; j++) {
            if (tileArray[j].pos[0] === neighbors[i][0] && tileArray[j].pos[1] === neighbors[i][1]) {
                tilePos = tileArray[j];
                break;
            }
        }
        if (tilePos === undefined) {
            return;
        }
        var check = Math.abs(target[0] - tilePos.x) + Math.abs(target[1] - tilePos.y);
        checkArray.push(check);
        posArray.push(tilePos);           
    }

    var shortest = Math.min.apply(null, checkArray);
    var index = checkArray.indexOf(shortest);        
    shortestDist = posArray[index];
    if (shortestDist != undefined) return shortestDist.pos;
}

Array.prototype.min = function() {
    return Math.min.apply(null, this);
}

// check legal directions for ghosts (since they cannot reverse direction)
Ghost.prototype.checkNeighbors = function () {
    var legal_neighbors = [];
    // check if tile above is a maze
    if(!(g_levelMap[this.tilePosY-1][this.tilePosX] === 1) && !(this.direction === "down")) {
        legal_neighbors.push([this.tilePosX, this.tilePosY-1]);
    }
    // tile below
    if(!(g_levelMap[this.tilePosY+1][this.tilePosX] === 1) && !(this.direction === "up")) {
        legal_neighbors.push([this.tilePosX, this.tilePosY+1]);
    }
    // tile to the left
    if(!(g_levelMap[this.tilePosY][this.tilePosX-1] === 1) && !(this.direction === "right")) {
        legal_neighbors.push([this.tilePosX-1, this.tilePosY]);
    }
    // tile to the right
    if(!(g_levelMap[this.tilePosY][this.tilePosX+1] === 1) && !(this.direction === "left")) {
        legal_neighbors.push([this.tilePosX+1, this.tilePosY]);
    }
    return legal_neighbors;
}

// chase mode
Ghost.prototype.chase = function (shortestDist, tilePosX, tilePosY) {       
    if (shortestDist[0] < tilePosX) {
        this.turn("left", this.cy, rail, -1, 0);
    }
    if (shortestDist[0] > tilePosX) {
        this.turn("right", this.cy, rail, 1, 0);
    }
    if (shortestDist[1] < tilePosY) {
        this.turn("up", this.cx, rail, 0, -1);
    }
    if (shortestDist[1] > tilePosY) {
        this.turn("down", this.cx, rail, 0, 1);
    }            
}

// scatter mode, each ghost has a specific targetX and targetY tile
// they all seem to be heading for the same target now, needs to be fixed :P
Ghost.prototype.scatter = function (targetX, targetY, tilePosX, tilePosY) {    
    var neighbors = this.checkNeighbors();
    var shortestDist = this.shortestDistance(neighbors, [targetX, targetY]);
    console.log(this.color + " " + this.targetX + " " + this.targetY + " " + shortestDist);

    if (shortestDist[0] < this.tilePosX) {
        this.turn("left", this.cy, rail, -1, 0);
    }
    if (shortestDist[0] > this.tilePosX) {
        this.turn("right", this.cy, rail, 1, 0);
    }
    if (shortestDist[1] < this.tilePosY) {
        this.turn("up", this.cx, rail, 0, -1);
    }
    if (shortestDist[1] > this.tilePosY) {
        this.turn("down", this.cx, rail, 0, 1);
    }
    /*if (this.targetX < this.tilePosX) {
        this.turn("left", this.cy, rail, -1, 0);
    }
    if (this.targetX > this.tilePosX) {
        this.turn("right", this.cy, rail, 1, 0);
    }
    if (this.targetY < this.tilePosY) {
        this.turn("up", this.cx, rail, 0, -1);
    }
    if (this.targetY > this.tilePosY) {
        this.turn("down", this.cx, rail, 0, 1);
    }    */

    /*if (targetX < tilePosX) {
        this.turn("left", this.cy, rail, -1, 0);
    }
    if (targetX > tilePosX) {
        this.turn("right", this.cy, rail, 1, 0);
    }
    if (targetY < tilePosY) {
        this.turn("up", this.cx, rail, 0, -1);
    }
    if (targetY > tilePosY) {
        this.turn("down", this.cx, rail, 0, 1);
    }  */
    //console.log(this.color + " " + targetX + " " + targetY);
}


// frightened mode, ghost changes color, decreases speed and goes into directions
// based on pesudorandom choices
Ghost.prototype.frightened = function (neighbors, tilePosX, tilePosY) {
    var random = neighbors[Math.floor(Math.random() * neighbors.length)];
    if (random[0] < tilePosX) {
        this.turn("left", this.cy, rail, -0.5, 0);
    }
    if (random[0] > tilePosX) {
        this.turn("right", this.cy, rail, 0.5, 0);
    }
    if (random[1] < tilePosY) {
        this.turn("up", this.cx, rail, 0, -0.5);
    }
    if (random[1] > tilePosY) {
        this.turn("down", this.cx, rail, 0, 0.5);
    }  
}

Ghost.prototype.update = function (du) {
    //timer resets to 30 seconds when it gets to 0
    if (this.lifeSpan < 0)
    {
        this.lifeSpan = 30 * SECS_TO_NOMINALS;
    }
    this.lifeSpan -= du;
    var prevX = this.x;
    var prevY = this.y;
    var nextX = prevX + this.xVel;
    var nextY = prevY + this.yVel;
    var halfwidth = 12;
    var board = Gameboard.prototype;
    var pacman = entityManager._pacman[0];

    if (this.x > g_canvas.width) {
        this.x = 0;
    }
    if (this.x < 0) {
        this.x = g_canvas.width;
    }
    
    //if (this.lifeSpan >= 1200) {
    //chase mode
    if (this.mode === 'chase' && this.tilePosX != undefined && this.tilePosY != undefined) {
        this.mode = 'chase';

        console.log('chase');
        
        this.checkPacmanCollision(pacman);

        var neighbors = this.checkNeighbors();
        var shortestDist = this.shortestDistance(neighbors, [pacman.x, pacman.y]);

        if (shortestDist != undefined) {
            this.chase(shortestDist, this.tilePosX, this.tilePosY);          
        }
    }
    //scatter mode
    //else if (this.lifeSpan >= 600) {
    else if (this.mode === 'scatter') {
        this.mode = 'scatter';
        var neighbors = this.checkNeighbors();
        var shortestDist = this.shortestDistance(neighbors, [this.targetX, this.targetY]);
        this.scatter(this.targetX, this.targetY, this.tilePosX, this.tilePosY);
    }
    //frightened mode
    //else if (this.lifeSpan >= 1) {
    else if (this.mode === 'frightened') {
        this.mode = 'frightened';
        var neighbors = this.checkNeighbors();
        this.frightened(neighbors, this.tilePosX, this.tilePosY);
    }

    var newNextX = this.x + this.xVel;
    var newNextY = this.y + this.yVel;

    if (this.checkMazeCollision(this.xVel, this.yVel, newNextX, newNextY)) {
        return true;
    }

    this.x += this.xVel;
    this.y += this.yVel;
    this.cx = this.x + halfwidth;
    this.cy = this.y + halfwidth; 
};

// check if ghost has caught pacman
Ghost.prototype.checkPacmanCollision = function(pacman) {
    if (this.cx === pacman.cx && this.cy === pacman.cy) {       
        pacman.lives--;
        
        pacman.reset();
        this.reset();

        if (pacman.lives === 0)
        {
            main.gameOver();
        }
    }
}

Ghost.prototype.halt = function() {
    this.xVel = 0;
    this.yVel = 0;
};

Ghost.prototype.checkMazeCollision = function(tempXVel, tempYVel, nextX, nextY) {
    //24 is the tile size  global variable tile_width)
    var xFactor = 0;
    var yFactor = 0;

    if(tempXVel === 1) xFactor = 23;
    if(tempYVel === 1) yFactor = 23;

    this.tilePosX = Math.floor((nextX+xFactor)/tile_width);
    this.tilePosY = Math.floor((nextY+yFactor)/tile_width);
    var nextTileX = Math.floor((nextX+xFactor)/tile_width);
    var nextTileY = Math.floor((nextY+yFactor)/tile_width);

    if(g_levelMap[nextTileY][nextTileX] === 1) {
        return true;  
    }
};

Ghost.prototype.c = 0;
Ghost.prototype.d = 0;
Ghost.prototype.positionsG = [];   //starting position

Ghost.prototype.render = function (ctx) {
    if (this.mode === 'frightened') {
        this.positionsG = [30, 31];
    }
    else {
        // going left
        if (this.xVel < 0) {
            if (this.color === 'red') this.positionsG = [55, 56];
            if (this.color === 'pink') this.positionsG = [59, 60];
            if (this.color === 'blue') this.positionsG = [57, 58];
            if (this.color === 'orange') this.positionsG = [61, 62];
        }
        // going right
        else if (this.xVel > 0) {
            if (this.color === 'red') this.positionsG = [21, 22];
            if (this.color === 'pink') this.positionsG = [25, 26];
            if (this.color === 'blue') this.positionsG = [23, 24];
            if (this.color === 'orange') this.positionsG = [27, 28];
        }
        // going up
        else if (this.yVel < 0) {
            if (this.color === 'red') this.positionsG = [4, 5];
            if (this.color === 'pink') this.positionsG = [8, 9];
            if (this.color === 'blue') this.positionsG = [6, 7];
            if (this.color === 'orange') this.positionsG = [10, 11];
        }
        // going down
        else if (this.yVel > 0) {
            if (this.color === 'red') this.positionsG = [38, 39];
            if (this.color === 'pink') this.positionsG = [42, 43];
            if (this.color === 'blue') this.positionsG = [40, 41];
            if (this.color === 'orange') this.positionsG = [44, 45];
        }
    }
    g_sprites[this.positionsG[this.c]].drawAt(ctx, this.x, this.y);
    this.d += 0.5;
    if (this.d % 1 === 0) ++this.c;   
    if (this.c === 2) this.c = 0;
};

Ghost.prototype.setPos = function (x, y) {
    this.x = x;
    this.y = y;
};
Ghost.prototype.reset = function () {
    for (var i = 0; i < entityManager._ghost.length; i++)
    {
        var ghost = entityManager._ghost[i];
        ghost.setPos(ghost.reset_x, ghost.reset_y);
    }
};