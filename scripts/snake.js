(function () {
    function Snake () {};
    Snake.prototype = {
        init: function (id, length, godmode) {
            this.id = id;
            this.length = length;
            this.godmode = godmode;
        },
        get: function (att) {
            return this[att];
        }
    }
    
})()