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

    generateGameboard : function(descr) {
        this._gameboard.push(new Gameboard(descr));
    },

    generatePacman : function(descr) {
        this._pacman.push(new Pacman(descr));
    },

    generateGhost : function(descr) {
        this._ghost.push(new Ghost(descr));
    },

    init: function() {
        this.generatePacman();
        this.generateGameboard();
        this.generateGhost();
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
        for (var i = 0; i < this._categories.length; i++) {
            var aCategory = this._categories[i];
            for (var j = 0; j < aCategory.length; j++) {
                aCategory[j].render(ctx);
            }
        }
    }
}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
entityManager.init();