// ==========
// Food stuff
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

// A generic contructor which accepts an arbitrary descriptor object
function Food(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

// Initial, inheritable, default values
Food.prototype.width = 24;
Food.prototype.height = 24;
Food.prototype.array = [];

Food.prototype.fillArray = function() {
    for (var i = 12; i < g_canvas.width; i += 24)       //g_canvas.width = 336, so 14 food columns (12, 36, 60, 84, ...)
    {
        for (var j = 12; j < g_canvas.height; j += 24)  //g_canvas.height = 432, so 18 food rows (12, 36, 60, 84, ...)
        {
            this.array.push([i, j]);                    //food array consists of center x and y coordinates
        }
    }    
};

Food.prototype.collidesWith = function (prevX, prevY, nextX, nextY) {
    for (var i = 0; i < this.array.length; i++)
    {
        var verticalEdge = this.array[i][0];     //center x-coordinate   
        var horizontalEdge = this.array[i][1];   //center y-coordinate

        //going up/down
        if ((nextY < horizontalEdge && prevY >= horizontalEdge) ||
            (nextY > horizontalEdge && prevY <= horizontalEdge))
        {
            if (nextX >= this.array[i][0] - (this.width/2) &&
                nextX <= this.array[i][0] + (this.width/2))
            {
                this.array.splice(i, 1);
            }
        }
        //going left/right
        else if ((nextX < verticalEdge && prevX >= verticalEdge) ||
                (nextX > verticalEdge && prevX <= verticalEdge))
        {
            if (nextY >= this.array[i][1] - (this.height/2) &&
                nextY <= this.array[i][1] + (this.height/2))
            {
                this.array.splice(i, 1);
            }
        }
    }
};

Food.prototype.update = function (du) {
   
};

Food.prototype.render = function (ctx) {
    for (var i = 0; i < this.array.length; i++) {
        util.fillCircle(ctx, this.array[i][0], this.array[i][1], 2.5);   
    }

    console.log("typpi");
};

Food.prototype.fillArray();




