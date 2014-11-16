"use strict";
/*jslint nomen: true, white: true, plusplus: true*/

var entityManager = {
    _gameboard    : [],
    _pacman       : [],
    _ghost        : [],

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
        this._categories = [this._gameboard, this._pacman, this._ghost];
    },
    
    init: function() {
        this.generatePacman();
        this.generateGameboard();
        this.generateGhost();
    },


    generateGameboard : function(descr) {
        this._gameboard.push(new Gameboard(descr));
    },

    generatePacman : function(descr) {
        //this._pacman.push(new Pacman(descr));

        this._pacman.push(new Pacman({
            x : 24*10,
            y : 24*13,
            width : tile_width,
            height : tile_height,
            cx : 24+tile_width/2,
            cy : 24+tile_height/2,
            lives : 3
        }));
    },

    generateGhost : function(descr) {
        var colors = ['orange', 'red', 'pink', 'blue'];
        var pos = [[240, 216], [216, 192], [240, 192], [264, 192]];
        var targets = [[1, 1], [1, 17], [19, 17], [19, 1]];
        var initialPos = [[10, 9], [9, 8], [10, 8], [9, 9]];
        
        for(var i = 0; i < colors.length; i++)
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
                //console.log("render");
            }
        }
    }
}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
entityManager.init();