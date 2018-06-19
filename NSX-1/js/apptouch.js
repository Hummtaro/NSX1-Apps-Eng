$.fn.extend({
    touchInterface : function(up){
        var down    = (arguments.length > 1 ) ? arguments[1] : false;
        var move    = (arguments.length > 2 ) ? arguments[2] : false;
        var cancel  = (arguments.length > 3 ) ? arguments[3] : false;
        return $(this).on({
            'touchstart mousedown'  : function(e){
                e.preventDefault();
                this.touching = true;
                if(down)down(e,$(this));
            },
            'touchmove mousemove'   : function(e) {
                if(!this.touching)return;
                e.preventDefault();
                /*
                if(move)move(e,$(this));
                if('ontouchstart' in window){
                    //var touch = e.originalEvent.changedTouches[0];
                    var touch = e.originalEvent.changedTouches[0]?e.originalEvent.changedTouches[0]:null;
                    var offset = $(this).offset();
                    if( touch.pageX < offset.left || touch.pageX > $(this).outerWidth()  + offset.left ||
                        touch.pageY < offset.top  || touch.pageY > $(this).outerHeight() + offset.top  ){
                        this.touching = false;
                        if(cancel)cancel(e,$(this));
                    }
                }
                */
            },
            'touchcancel mouseout'  : function(e){
                if(!this.touching)return;
                e.preventDefault();
                if(cancel)cancel(e,$(this));
                this.touching = false;
            },
            'touchend mouseup'      : function(e){
                if(!this.touching)return;
                e.preventDefault();
                up(e,$(this));
                this.touching = false;
            }
        }).css('cursor','pointer');
    }
});
