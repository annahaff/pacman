"use strict";
/*jslint nomen: true, white: true, plusplus: true*/

var entityManager = {
    _gameboard    : [],
    _pacman       : [],
    _ghost        : [],
    _timer        : [],

    // "PRIVATE" METHODS
    _forEachOf : function(aCategory, fn) {
        for (var i = 0; i < aCategory.length; ++i) {
    	   fn.call(aCategory[i]);
        }
    },

    // PUBLIC METHODS

    // Some things must be deferred until after initial construction
    // i.e. thing which need `this` to be defined.
    //
    deferredSetup : function () {
        this._categories = [this._gameboard, this._pacman, this._ghost, this._timer];
    },
    
    init: function() {
        this.generatePacman();
        this.generateGameboard();
        this.generateGhost();
        this.generateTimer();
    },

    resetTimer : function() {
        this._timer[0].reset(); 
    },

    generateTimer : function(descr) {
        this._timer.push(new Timer(descr));
    },

    generateGameboard : function(descr) {
        this._gameboard.push(new Gameboard(descr));
    },

    generatePacman : function(descr) {
        this._pacman.push(new Pacman({
            x : 24*10,
            y : 24*13,
            width : tile_width,
            height : tile_height,
            cx : 24+tile_width/2,
            cy : 24+tile_height/2,
            lives : 3,
            score : 0
        }));
    },

    generateGhost : function(descr) {
        var colors = ['orange', 'red', 'pink', 'blue'];
        var pos = [[240, 216], [216, 192], [240, 192], [264, 192]];
        var targets = [[1, 1], [1, 17], [19, 17], [19, 1]];
        var initialPos = [[10, 9], [9, 8], [10, 8], [9, 9]];

        this._ghost.push(new Ghost({
            x : pos[0][0],           
            y : pos[0][1],     
            cx : pos[0][0] + tile_width/2,
            cy : pos[0][1] + tile_width/2,      
            color : colors[0],
            targetX : targets[0][0],
            targetY : targets[0][1], 
            tilePosX : initialPos[0][0],
            tilePosY : initialPos[0][1],
            mode : 'scatter'
        }));

        for(var i = 1; i < colors.length; i++)
        {
            this._ghost.push(new Ghost({
                x : pos[i][0],           
                y : pos[i][1],     
                cx : pos[i][0] + tile_width/2,
                cy : pos[i][1] + tile_width/2,      
                color : colors[i],
                targetX : targets[i][0],
                targetY : targets[i][1], 
                tilePosX : initialPos[i][0],
                tilePosY : initialPos[i][1],
                mode : 'chase'
            }));
        }
    },

    update: function(du) {
        for (var c = 0; c < this._categories.length; ++c) {
            var aCategory = this._categories[c];
            var i = 0;
            while (i < aCategory.length)
            {
                var status = aCategory[i].update(du);
                ++i;
            }
        }
    },

    render: function(ctx) {
        for (var i = 0; i < this._categories.length; ++i) {
            var aCategory = this._categories[i];
            for (var j = 0; j < aCategory.length; ++j) {
                aCategory[j].render(ctx);
            }
        }
    },

    setMode : function(mode) {
        for (var i = 0; i < this._ghost.length; ++i) {
            if (mode === 'frightened' && this._ghost[i].mode === 'dead') {
                this._ghost[i].setMode('dead');
            }
            else {
                this._ghost[i].setMode(mode);
            }
        }
        this.resetTimer();
    },

    //set ghost modes to scatter/chase
    switchModes : function() {
        for (var i = 0; i < this._ghost.length; i++) {
            var ghost = this._ghost[i];
            if (ghost.mode === 'scatter') {// || this._ghost[i].mode === 'frightened') {
                ghost.setMode('chase');
                if (i === 3) {
                    this._ghost[0].setMode('scatter');
                }
                else {
                    this._ghost[i+1].setMode('scatter');
                }
                return;
            }
        }
    },

    //check if pacman has eaten ghost
    checkCollide : function() {
        var pacman = this._pacman[0];
        for (var i = 0; i < this._ghost.length; i++) {
            var ghost = this._ghost[i];
            if (this._ghost[i].mode === 'frightened' && 
               (ghost.x <= pacman.cx && pacman.cx <= ghost.x+tile_width) &&
               (ghost.y <= pacman.cy && pacman.cy <= ghost.y+tile_width)) {
                ghost.setMode('dead');
                var snd = new Audio("pacman_eatghost.wav"); // buffers automatically when created
                snd.play();
                this.resetTimer();
            }
        }
    },
    restart : function(){
        var pacman = this._pacman[0];
        main._isGameOver = false;
        main.init();
        pacman.score = 0;
        pacman.lives = 3;
        document.getElementById('gameOver').style.display = "none";
        var gameboard = this._gameboard[0];
        gameboard.fillBoard();

    }
}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
entityManager.init();