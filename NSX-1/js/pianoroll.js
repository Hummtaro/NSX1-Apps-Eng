var PianoRoll = function() {
    this.sizes={
        zoom:{ x:1 }
    };
    this.fGrid={ // frame grid
        offset: {x:0, y:0},
        previous: {x:0, y:0, tick:{no:false}}  // mouseup 直前の座標
    };
    
    this.color = {
        outWire: "rgb(0,0,0)",
        noteInputArea:{
            roll: {d: "rgb(78,169,174)", l: "rgb(152,202,199)", //l:light, d:dark
                   line16: "rgb(28,117,123)", line4: "rgb(53, 144, 150)", line1: "rgb(184,191,191)",
                   note: "rgb(9, 227, 241)", current: "rgb(255,0,255)",
                   noteSelected: "rgb(255, 255, 255)", noteOutline:"rgb(192, 192, 192)",
                   noteSelectedLine: "rgb(220, 20, 60)"
                  }
        },
        keyboard:{b: "rgb(0,0,0)", w: "rgb(255,255,250)", outLine: "rgb(0,0,0)"},
        musicalBarArea:{background:"rgb(169,169,169)",
                        dline:"rgb(0,0,0)",lline:"rgb(128,128,128)",
                        letter: "rgb(255,255,255)"}, //lline:light line, dline:dark line
        grabArea:{background:"rgb(169,169,169)",
                  dline:"rgb(0,0,0)",lline:"rgb(128,128,128)",
                  letter: "rgb(255,255,255)"} //lline:light line, dline:dark line
    };
    this.font={
        grabArea:"13px Arial",
        musicalBarArea:"13px Arial"    
    };
    this.mAction={ // mouse action
        mdTimerId: null,      // timerId for mousedown
        clicked:{ status: false, note:null, tick:false, place:null , event:false },       // flag whether mouse down or not
        initial: {x: 0, y:0}, // grid where drag starts
        moving: {x: 0, y:0},  // grid where draggin
        distance: {x: 0, y:0 }, // distance between drag start grid and dragging   
        pointer:{ previous:{x:0} }
    };
        
    this.noteStack=new Array();// {note: ,s: , e: } s:start, e:end

    this.sizes.canvas={width: 800, height: 300},
    this.pr=document.getElementById("pianoroll");
    this.pr.setAttribute("width", this.sizes.canvas.width+"px");
    this.pr.setAttribute("height", this.sizes.canvas.height+"px");
    this.prCtx=this.pr.getContext("2d");

    this.now={x:0, y:0};
    this.tempDraw=new Array();

    this.timerId=null;

    this.time={ start: null, latency: 800 /* msec */};

    this.pr.addEventListener("mousedown", this.mousedownAction.bind(this), false);
    this.pr.addEventListener("mouseup", this.mouseupAction.bind(this), false);
    this.pr.addEventListener("mousemove", this.mousemoveAction.bind(this), false);
    this.pr.addEventListener("contextmenu", this.contextmenuAction, false);


};

PianoRoll.prototype={
    noteOnFunc: function(param) {
        console.log("[Fired] noteOnFunc", param);
    },
    noteOffFunc: function(param) {
        console.log("[Fired] noteOffFunc", param);
    },
    exportNoteStackFunc: function(param) {
        console.log("[Fired] exportNoteStackFunc", param);
    },
    importNoteStackFunc: function(param) {
        console.log("[Fired] importNoteStackFunc", param);
    },
    
    render: function() {
        this.initSizes();
        this.clearAll(this.prCtx);
        this.drawBase(this.prCtx, this.fGrid.offset);
        this.drawRoll(this.prCtx, this.fGrid.offset);
        this.drawNotes(this.prCtx, this.fGrid.offset);
        this.drawKeyboard(this.prCtx, this.fGrid.offset);
        this.drawGrabMusicalBarArea(this.prCtx, this.fGrid.offset);
        this.drawPointer(this.prCtx, this.fGrid.offset, this.now);
        this.drawOutWire(this.prCtx);
        if(this.mAction.clicked.status===true &&
           (this.mAction.clicked.place=="onNote"
            || this.mAction.clicked.place=="onNote.s"
            || this.mAction.clicked.place=="onNote.e"
            || this.mAction.clicked.place=="noteInputArea"
           )) {
            this.drawNoteSelectedLine(this.prCtx, this.fGrid.offset);
        }
    
        requestAnimationFrame(this.render.bind(this));
    },

    setZoom: function(zoom) {
        this.sizes.zoom.x=zoom.x;
    },
    
    initSizes: function() {
        this.sizes={
            canvas: {width: this.sizes.canvas.width, height: this.sizes.canvas.height},
            frame: {x:0, y:0},
            musicalBarArea: {y:40, initialSpace:{x:80}, pointer:{x0:null, x1:null, grab: false, width: 12, height:15 }},
            grabArea: {x:40},
            noteInputArea: {x:null, y:null},
            antiAlias: 0.5,
            keyboard: {b:{x:null, y:{n:null, w:null}}, w:{x:80, y:null}, octave:8}, // w:wide, n:narrw
            outBackground: {y:50},
            roll:{mBarCount:8, tick1:15, tick4:null, tick16:null, note:{width:null}}, // mBarCount:Count of Musical Bar
            zoom:{ x: this.sizes.zoom.x }
        };
        this.sizes.roll.tick1=this.sizes.zoom.x*this.sizes.roll.tick1;

        this.sizes.roll = {
            mBarCount: this.sizes.roll.mBarCount,
            tick1: this.sizes.roll.tick1,
            tick4: 4*this.sizes.roll.tick1,
            tick16: 16*this.sizes.roll.tick1,
            note:{width: this.sizes.roll.note.width}
        };
        this.sizes.canvas={
            width: this.sizes.canvas.width, height: this.sizes.canvas.height,
            x: this.sizes.canvas.width, y: this.sizes.canvas.height
        };
        this.sizes.keyboard.b.x=Math.round(0.6*this.sizes.keyboard.w.x);
        this.sizes.keyboard.w.y=Math.round(0.38*this.sizes.keyboard.w.x);
        this.sizes.keyboard.b.y={n:4*this.sizes.keyboard.w.y/7, w:3*this.sizes.keyboard.w.y/5};
        this.sizes.roll.note.width=this.sizes.keyboard.b.y.n-8; // note width in noteInputArea
        this.sizes.noteInputArea={x:this.sizes.roll.mBarCount*this.sizes.roll.tick16, y:this.sizes.keyboard.octave*(7*this.sizes.keyboard.w.y)-2*this.sizes.frame.x};

        this.noteGrid={ 108: this.sizes.musicalBarArea.y };

        // create frequency and MIDI mapping
        this.midiInfo = {
            freqMidiMap: new Array(),
            maxKey: 107,
            axis: new Array()
        };
        var r = Math.pow( 2.0, 1.0 / 12.0 );
        this.midiInfo.freqMidiMap[69] = 440 ;
        for(var i=70; i<=127; i++) {
            this.midiInfo.freqMidiMap[i] = this.midiInfo.freqMidiMap[i-1] * r;
        }
        for (var i=68; i>=0; i--) {
            this.midiInfo.freqMidiMap[i] = this.midiInfo.freqMidiMap[i+1] / r;
            }
        // axis in center of the key
        var count=this.midiInfo.maxKey+1;
        for(var i=0; i<=this.sizes.keyboard.octave-1; i++) {
            var octaveOffset = i * this.sizes.keyboard.w.y*7;
            for(var j=0; j<12; j++) {
                this.midiInfo.axis[count--]=this.sizes.musicalBarArea.y + octaveOffset + (j-0.5)*this.sizes.keyboard.b.y.n;
            }
        }
    },
    
    moveCurrent: function(tempo) {
        var tempo=tempo*2;
        var tempoInterval=1000*60/tempo/this.sizes.roll.tick1;
        var t=1;
        var time_tick1=this.sizes.roll.tick1/this.sizes.roll.tick1;
        this.time.start=performance.now();
        var self=this;
        var noteOn=[];
        this.timerId=setInterval(function() {
            t++;
            self.now.x+=time_tick1;
            for(var ns=0; ns<self.noteStack.length; ns++) {
                var n=self.noteStack[ns];
                // noteOn
                if(n.s==Math.ceil(10*self.now.x/(self.sizes.roll.tick1))/10+self.time.latency/1000) {
                    switch(n.type) {
                      case 0x90:
                        if(noteOn[ns]!==true) {
                            self.noteOnFunc([0x90, n.note, 0x59], (n.s-1) * 1000*60/tempo + self.time.start);
                            noteOn[ns]=true;
                        }
                        break;
                    }
                }
                if(n.e==Math.ceil(10*self.now.x/(self.sizes.roll.tick1))/10+self.time.latency/1000) {
                    switch(n.type) {
                      case 0x90:
                        self.noteOnFunc([0x80, n.note, 0x59], (n.e) * 1000*60/tempo + self.time.start);
                        break;
                    }
                }
            }
        }, tempoInterval);
    },

    
    movePos: function(pos) {
        this.fGrid.offset={
            x:pos.x,
            y:pos.y
        };
        this.fGrid.previous={
            x:pos.x,
            y:pos.y,
            tick:{no:false}
        };
    },

    stopCurrent: function() {
        clearInterval(this.timerId);
    },
        
    deleteNote: function(){
        for(var i=0; i<this.noteStack.length; i++){
            if(this.noteStack[i].status=="selected") {
                this.noteStack.splice(i, 1);
            }
        }
    },

    contextmenuAction: function(event) {
        event.preventDefault();
    },
    
    drawBase: function(prCtx, offset) {
        // background
        var grad  = prCtx.createLinearGradient(0, this.sizes.frame.y+this.sizes.musicalBarArea.y, 0, this.sizes.frame.y+this.sizes.canvas.height);
        var gPercent= this.sizes.outBackground.y/(this.sizes.canvas.height-this.sizes.musicalBarArea.y);
        grad.addColorStop(0,          "rgb(78,169,174)");
        grad.addColorStop(gPercent,   "rgb(0,119,121)");
        grad.addColorStop(1-gPercent, "rgb(0,119,121)");
        grad.addColorStop(1,          "rgb(78,169,174)");
        prCtx.fillStyle=this.color.noteInputArea.roll.d;//grad;
        prCtx.beginPath();
        prCtx.fillRect(0, 0, this.sizes.canvas.width, this.sizes.canvas.height);
        prCtx.closePath();
        
        // noteInputArea
        prCtx.fillStyle=this.color.noteInputArea.roll.l;
        prCtx.beginPath();
        prCtx.fillRect(this.sizes.frame.x+this.sizes.grabArea.x+this.sizes.keyboard.w.x+offset.x, (this.sizes.frame.y+this.sizes.musicalBarArea.y)+offset.y, this.sizes.noteInputArea.x+ this.sizes.musicalBarArea.initialSpace.x, this.sizes.noteInputArea.y);
        prCtx.closePath();
        
    },

    // draw keyboard
    drawKeyboard: function(prCtx, offset){
        for(var i=0; i<=this.sizes.keyboard.octave-1; i++) {
            var octaveOffset = i * this.sizes.keyboard.w.y*7 + offset.y;
            // white
            for(var w=0; w<7; w++) {
                // keyboard
                prCtx.fillStyle=this.color.keyboard.w;
                prCtx.beginPath();
                prCtx.fillRect(this.sizes.frame.x+this.sizes.grabArea.x+this.sizes.antiAlias,
                               octaveOffset + this.sizes.musicalBarArea.y+w*this.sizes.keyboard.w.y+this.sizes.antiAlias,
                               this.sizes.keyboard.w.x, this.sizes.keyboard.w.y);
                prCtx.strokeStyle=this.color.keyboard.outLine;
                prCtx.rect(this.sizes.frame.x+this.sizes.grabArea.x+this.sizes.antiAlias,
                           octaveOffset + this.sizes.musicalBarArea.y+w*this.sizes.keyboard.w.y+this.sizes.antiAlias,
                           this.sizes.keyboard.w.x, this.sizes.keyboard.w.y);
                prCtx.stroke();
                prCtx.closePath();
                
            }
            // black
            for(var b=0; b<13; b++) {
                if(b%2==1 && b!=7) {
                    prCtx.beginPath();
                    if(b<7) {
                        prCtx.fillStyle=this.color.keyboard.b;
                        prCtx.fillRect(this.sizes.frame.x+this.sizes.grabArea.x,
                                       octaveOffset + this.sizes.musicalBarArea.y+b*this.sizes.keyboard.b.y.n,
                                       this.sizes.keyboard.b.x, this.sizes.keyboard.b.y.n);                
                        
                    } else {
                        var n_os=6*this.sizes.keyboard.b.y.n; // narrow side's offset
                        prCtx.fillStyle=this.color.keyboard.b;
                        prCtx.fillRect(this.sizes.frame.x+this.sizes.grabArea.x,
                                       octaveOffset + this.sizes.musicalBarArea.y+(b-7)*this.sizes.keyboard.b.y.n+n_os,
                                       this.sizes.keyboard.b.x, this.sizes.keyboard.b.y.n);
                        
                    }
                    prCtx.closePath();
                }
            }
        }
    },

    drawGrabMusicalBarArea: function(prCtx, offset) {
        // grabArea
        prCtx.fillStyle=this.color.grabArea.background;
        prCtx.beginPath();
        prCtx.fillRect(this.sizes.frame.x, this.sizes.frame.y, this.sizes.grabArea.x, this.sizes.canvas.y);
        prCtx.closePath();
        // // line
        prCtx.beginPath();
        prCtx.strokeStyle=this.color.grabArea.lline;
        prCtx.moveTo(this.sizes.frame.x+this.sizes.antiAlias, this.sizes.musicalBarArea.y+this.sizes.antiAlias);
        prCtx.lineTo(this.sizes.frame.x+this.sizes.grabArea.x +this.sizes.antiAlias, this.sizes.musicalBarArea.y+this.sizes.antiAlias);
        prCtx.stroke();
        prCtx.closePath();
        prCtx.beginPath();
        prCtx.strokeStyle=this.color.grabArea.dline;
        prCtx.moveTo(this.sizes.frame.x+this.sizes.grabArea.x+this.sizes.antiAlias, this.sizes.musicalBarArea.y+this.sizes.antiAlias);
        prCtx.lineTo(this.sizes.noteInputArea.x+ this.sizes.musicalBarArea.initialSpace.x, this.sizes.musicalBarArea.y+this.sizes.antiAlias);
        prCtx.stroke();
        prCtx.closePath();
        // // Octave number display
        var counter=this.sizes.keyboard.octave-1;
        for(var o=1; o<=this.sizes.keyboard.octave; o++) {
            prCtx.beginPath();
            prCtx.fillStyle=this.color.grabArea.letter;
            prCtx.font=this.font.grabArea;
            prCtx.fillText("C"+counter, this.sizes.frame.x+0.2*this.sizes.grabArea.x+2+this.sizes.antiAlias, this.sizes.musicalBarArea.y+o*7*this.sizes.keyboard.w.y-3+offset.y+this.sizes.antiAlias, this.sizes.grabArea.x);
            prCtx.strokeStyle=this.color.grabArea.letter;
            prCtx.moveTo(this.sizes.frame.x+0.2*this.sizes.grabArea.x+this.sizes.antiAlias, this.sizes.musicalBarArea.y+o*7*this.sizes.keyboard.w.y+offset.y+this.sizes.antiAlias);
            prCtx.lineTo(this.sizes.frame.x+1.0*this.sizes.grabArea.x+this.sizes.antiAlias, this.sizes.musicalBarArea.y+o*7*this.sizes.keyboard.w.y+offset.y+this.sizes.antiAlias);
            prCtx.stroke();
            prCtx.closePath();
            counter--;
        }
        
        // musicalBarArea
        prCtx.fillStyle=this.color.musicalBarArea.background;
        prCtx.beginPath();
        prCtx.fillRect(this.sizes.frame.x, this.sizes.frame.y, this.sizes.noteInputArea.x+ this.sizes.musicalBarArea.initialSpace.x, this.sizes.musicalBarArea.y);
        prCtx.closePath();
        // // musical bar number dispalay
        var count=0, num=1;
        for(var m=0; m<=this.sizes.roll.mBarCount*this.sizes.roll.tick16; m=m+this.sizes.roll.tick1) {
            if(count==0) {
                prCtx.beginPath();
                prCtx.fillStyle=this.color.musicalBarArea.letter;
                prCtx.font=this.font.musicalBarArea;
                prCtx.strokeStyle=this.color.musicalBarArea.letter;
                prCtx.fillText(num, offset.x + this.sizes.frame.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.grabArea.x+this.sizes.keyboard.w.x + m +this.sizes.antiAlias+3,
                               this.sizes.frame.y+0.2*this.sizes.musicalBarArea.y+10);
                prCtx.moveTo(offset.x + this.sizes.frame.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.grabArea.x+this.sizes.keyboard.w.x + m +this.sizes.antiAlias,
                             this.sizes.frame.y+0.2*this.sizes.musicalBarArea.y);
                prCtx.lineTo(offset.x + this.sizes.frame.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.grabArea.x+this.sizes.keyboard.w.x + m +this.sizes.antiAlias,
                             this.sizes.frame.y+this.sizes.musicalBarArea.y);
                prCtx.stroke();
                prCtx.closePath();
                num++;
            }
            if(count<15) {
                count++;
            } else {
                count=0;
            }
        }
    },

    // drow pointer
    drawPointer: function(prCtx, offset, now) {
        this.sizes.musicalBarArea.pointer.x0=this.sizes.grabArea.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.keyboard.w.x-this.sizes.musicalBarArea.pointer.width/2;
        this.sizes.musicalBarArea.pointer.x1=this.sizes.grabArea.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.keyboard.w.x+this.sizes.musicalBarArea.pointer.width/2;
        prCtx.beginPath();
        prCtx.strokeStyle=this.color.noteInputArea.roll.current;
        prCtx.fillStyle=this.color.noteInputArea.roll.current;
        prCtx.moveTo(this.sizes.grabArea.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.keyboard.w.x+now.x+offset.x, this.sizes.musicalBarArea.y);
        prCtx.lineTo(this.sizes.musicalBarArea.pointer.x0+now.x+offset.x, this.sizes.musicalBarArea.y-this.sizes.musicalBarArea.pointer.height);
        prCtx.lineTo(this.sizes.musicalBarArea.pointer.x1+now.x+offset.x, this.sizes.musicalBarArea.y-this.sizes.musicalBarArea.pointer.height);
        prCtx.lineTo(this.sizes.grabArea.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.keyboard.w.x+now.x+offset.x, this.sizes.musicalBarArea.y);
        prCtx.stroke();
        prCtx.fill();
        prCtx.lineTo(this.sizes.grabArea.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.keyboard.w.x+now.x+offset.x, this.sizes.noteInputArea.y);
        prCtx.stroke();
        prCtx.closePath();
    },

    drawOutWire: function(prCtx) {
        prCtx.strokeStyle=this.color.outWire;
        prCtx.beginPath();
        prCtx.rect(0+this.sizes.antiAlias, 0+this.sizes.antiAlias, this.sizes.canvas.width-this.sizes.antiAlias, this.sizes.canvas.height-this.sizes.antiAlias);
        prCtx.stroke();
        prCtx.closePath();
    },

    // draw roll
    drawRoll: function(prCtx, offset){
        var noteGridCount=108;
        for(var i=0; i<=this.sizes.keyboard.octave-1; i++) {
            var octaveOffset = i * this.sizes.keyboard.w.y*7 + offset.y;
            for(var w=0; w<7; w++) {
                if((i!=0&&w==0) || w==4) {
                    prCtx.beginPath();
                    prCtx.strokeStyle=this.color.noteInputArea.roll.d;
                    prCtx.moveTo(offset.x + this.sizes.frame.x + this.sizes.grabArea.x+this.sizes.antiAlias+this.sizes.keyboard.w.x,
                                 octaveOffset + this.sizes.musicalBarArea.y+w*this.sizes.keyboard.w.y+this.sizes.antiAlias);
                    prCtx.lineTo(offset.x + this.sizes.frame.x + this.sizes.musicalBarArea.initialSpace.x + this.sizes.grabArea.x+this.sizes.antiAlias+this.sizes.keyboard.w.x+this.sizes.noteInputArea.x,
                                 octaveOffset + this.sizes.musicalBarArea.y+w*this.sizes.keyboard.w.y+this.sizes.antiAlias);
                    prCtx.stroke();
                    prCtx.closePath();
                }
            }
            for(var b=0; b<13; b++) {
                if(b%2==1 && b!=7) {
                    prCtx.beginPath();
                    if(b<7) {
                        prCtx.fillStyle=this.color.noteInputArea.roll.d;
                        prCtx.fillRect(offset.x + this.sizes.frame.x + this.sizes.grabArea.x+this.sizes.keyboard.w.x,
                                       octaveOffset + this.sizes.musicalBarArea.y+b*this.sizes.keyboard.b.y.n,
                                       this.sizes.noteInputArea.x + this.sizes.musicalBarArea.initialSpace.x, this.sizes.keyboard.b.y.n);
                    } else {
                        var n_os=6*this.sizes.keyboard.b.y.n; // narrow side's offset
                        // roll
                        prCtx.fillStyle=this.color.noteInputArea.roll.d;
                        prCtx.fillRect(offset.x + this.sizes.frame.x + this.sizes.grabArea.x+this.sizes.keyboard.w.x,
                                       octaveOffset + this.sizes.musicalBarArea.y+(b-7)*this.sizes.keyboard.b.y.n+n_os,
                                       this.sizes.noteInputArea.x + this.sizes.musicalBarArea.initialSpace.x, this.sizes.keyboard.b.y.n);
                    }
                    prCtx.closePath();
                }
            }
            
        }
        
        // draw Virtical Line
        var count=0, num=1;
        for(var m=0; m<=this.sizes.roll.mBarCount*this.sizes.roll.tick16; m=m+this.sizes.roll.tick1) {
            if(count==0) {
                prCtx.beginPath();
                prCtx.strokeStyle=this.color.noteInputArea.roll.line16;
                prCtx.moveTo(offset.x + this.sizes.frame.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.grabArea.x+this.sizes.keyboard.w.x + m +this.sizes.antiAlias,
                             this.sizes.frame.y+this.sizes.musicalBarArea.y);
                prCtx.lineTo(offset.x + this.sizes.frame.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.grabArea.x+this.sizes.keyboard.w.x + m +this.sizes.antiAlias,
                             this.sizes.frame.y+this.sizes.noteInputArea.y);
                prCtx.stroke();
                prCtx.closePath();
                num++;
            }
            if(count==4 || count==8 || count==12) {
                prCtx.beginPath();
                prCtx.strokeStyle=this.color.noteInputArea.roll.line4;
                prCtx.moveTo(offset.x + this.sizes.frame.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.grabArea.x+this.sizes.keyboard.w.x + m +this.sizes.antiAlias,
                             this.sizes.frame.y+this.sizes.musicalBarArea.y);
                prCtx.lineTo(offset.x + this.sizes.frame.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.grabArea.x+this.sizes.keyboard.w.x + m +this.sizes.antiAlias,
                             this.sizes.frame.y+this.sizes.noteInputArea.y);
                prCtx.stroke();
                prCtx.closePath();
            }
            if(count==1 || count==2 || count==3
               || count==5 || count==6 || count==7
               || count==9 || count==10 || count==11
               || count==13 || count==14 || count==15
              ) {
                prCtx.beginPath();
                prCtx.strokeStyle=this.color.noteInputArea.roll.line1;
                prCtx.moveTo(offset.x + this.sizes.frame.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.grabArea.x+this.sizes.keyboard.w.x + m +this.sizes.antiAlias,
                             this.sizes.frame.y+this.sizes.musicalBarArea.y);
                prCtx.lineTo(offset.x + this.sizes.frame.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.grabArea.x+this.sizes.keyboard.w.x + m +this.sizes.antiAlias,
                             this.sizes.frame.y+this.sizes.noteInputArea.y);
                prCtx.stroke();
                prCtx.closePath();
            }
            if(count<15) {
                count++;
            } else {
                count=0;
            }
        }
    },

    /**
     * input 
     * return (object) { s:(numner), e:(number) } or false(if target does NOT exist)
     */
    retTickAxis: function(ns) { // noteStack
        return {
            s:this.sizes.grabArea.x+this.sizes.keyboard.w.x+this.sizes.musicalBarArea.initialSpace.x+(ns.s-1)*this.sizes.roll.tick1,
            e:this.sizes.grabArea.x+this.sizes.keyboard.w.x+this.sizes.musicalBarArea.initialSpace.x+(ns.e)*this.sizes.roll.tick1
        };
    },

    drawNoteSelectedLine: function(prCtx, offset) {
        var selNote = this.getSelectedNote();
        if(this.mAction.clicked.status===true) {
            switch(this.mAction.clicked.place) {
              case "onNote":
                var c=this.color.noteInputArea.roll.noteSelectedLine;
                var t_t=this.noteStack[selNote.id];
                break;
              case "onNote.s":
              case "onNote.e":
                var c="blue";
                var t_t=this.noteStack[selNote.id];
                break;
              case "noteInputArea":
                var c=this.color.noteInputArea.roll.noteSelectedLine;
                var tick=this.getMBTickNo(this.mAction.clicked.event);
                var initial=this.getMBTickNo({clientX:this.mAction.initial.x, target:false});
                var t_t={s:initial.no+1 ,e:tick.no}; // tick tmp // +1 is tuning
                
                var m_n=this.getMidiNo(this.mAction.clicked.event); // midino
                break;
            }
            var t_ns=this.retTickAxis(t_t);
            
            prCtx.beginPath();
            prCtx.strokeStyle=c;
            prCtx.moveTo(t_ns.s+offset.x+this.sizes.antiAlias, this.sizes.musicalBarArea.y);
            prCtx.lineTo(t_ns.s+offset.x+this.sizes.antiAlias, this.sizes.musicalBarArea.y+this.sizes.noteInputArea.y);
            prCtx.moveTo(t_ns.e+offset.x+this.sizes.antiAlias, this.sizes.musicalBarArea.y);
            prCtx.lineTo(t_ns.e+offset.x+this.sizes.antiAlias, this.sizes.musicalBarArea.y+this.sizes.noteInputArea.y);
            prCtx.stroke();
            prCtx.closePath();
            
            if(this.mAction.clicked.place=="noteInputArea") {
                prCtx.beginPath();
                prCtx.lineWidth=this.sizes.roll.note.width;
                prCtx.strokeStyle=this.color.noteInputArea.roll.noteSelectedLine;
                prCtx.moveTo(t_ns.s+offset.x, this.midiInfo.axis[m_n.midiNo]+offset.y);
                prCtx.lineTo(t_ns.e+offset.x, this.midiInfo.axis[m_n.midiNo]+offset.y);
                prCtx.stroke();
                prCtx.lineWidth=1;
                prCtx.closePath();
            }
        }
    },

    drawNotes: function(prCtx, offset) {
        for(var i=0; i<this.noteStack.length; i++) {
            if(this.noteStack[i].status=="selected") {
                prCtx.strokeStyle="rgb(255, 255, 255)";
            } else {
                prCtx.strokeStyle=this.color.noteInputArea.roll.note;
            }
            var t_ns=this.retTickAxis(this.noteStack[i]);
            prCtx.beginPath();
            prCtx.lineWidth=this.sizes.roll.note.width;
            prCtx.moveTo(t_ns.s+offset.x, this.midiInfo.axis[this.noteStack[i].note]+offset.y);
            prCtx.lineTo(t_ns.e+offset.x-1, this.midiInfo.axis[this.noteStack[i].note]+offset.y);
            prCtx.stroke();
            prCtx.closePath();
            prCtx.beginPath();
            prCtx.strokeStyle=this.color.noteInputArea.roll.noteOutline;
            prCtx.lineWidth=1;
            prCtx.rect(t_ns.s+offset.x-this.sizes.antiAlias, this.midiInfo.axis[this.noteStack[i].note]+offset.y-this.sizes.roll.note.width/2-this.sizes.antiAlias,
                       (t_ns.e+offset.x-1)-(t_ns.s+offset.x+1)+2*this.sizes.antiAlias, this.sizes.roll.note.width+this.sizes.antiAlias);
            prCtx.stroke();
            prCtx.closePath();
        }
        prCtx.lineWidth=1;
    },

    /**
     * return (object) { midiNo:(numner), freq:(number) } or false(if target does NOT exist)
     */
    getMidiNo: function(event) {
        var pointer, midiNo, freq;
        pointer=event.offsetY-this.fGrid.offset.y;
        midiNo=0;
        for(i=0; i<this.midiInfo.axis.length; i++) {
            if(typeof this.midiInfo.axis[i]!="undefined") {
                if(this.midiInfo.axis[i]-this.sizes.keyboard.b.y.n/2<=pointer && this.midiInfo.axis[i]+this.sizes.keyboard.b.y.n/2>pointer){
                    midiNo=i;
                    i=99999;
                }
            }
        }
        
        freq=this.midiInfo.freqMidiMap[midiNo];
        if(event.clientX<this.sizes.musicalBarArea.y) {
            midiNo=false;
            freq=false;
        }
        return {
            midiNo: midiNo,
            freq: freq
        };
    },
        
    /**
     * return (object) { no:(numner) } or false(if target does NOT exist)
     */
    getMBTickNo: function(event) { // return Musical Bar Tick No
        var rect={left:0, top:0};
        if(event.target!==false) {
            rect=event.target.getBoundingClientRect();
        }
        var no=Math.round(2*((-this.fGrid.offset.x-this.sizes.grabArea.x-this.sizes.keyboard.w.x-this.sizes.musicalBarArea.initialSpace.x+(event.clientX - rect.left))/this.sizes.roll.tick1))/2; // 1/32
        if(no<=0) {
            no=false;
        }
        return {
            no: no
        };
    },

    /**
     * return (numner) i or false(if target does NOT exist)
     */
    getIDfromNoteTick: function(note, tick){
        for(var i=0; i<this.noteStack.length; i++) {
            if(note.midiNo==this.noteStack[i].note) {
                if(tick.no>=this.noteStack[i].s && tick.no<=this.noteStack[i].e) {
                    return i;
                }
            }
        }
        return false;
    },

    checkOnNote: function(note, tick) {
        for(var i=0; i<this.noteStack.length; i++){
            if(note.midiNo==this.noteStack[i].note) {
                if(this.noteStack[i].s<=tick.no && this.noteStack[i].e>=tick.no) {
                    return {id:i, note:this.noteStack[i]};
                }
            }
        }
        return false;
    },

    getSelectedNote: function() {
        for(var i=0; i<this.noteStack.length; i++){
            if(this.noteStack[i].status=="selected") {
                return {id:i, note:this.noteStack[i]};
            }
        }
        return false;
    },

    dragAction: function(event) {
        var note=this.getMidiNo(event);
        var tick=this.getMBTickNo(event);
        var id=this.getIDfromNoteTick(note, tick);
    },

    deleteNote: function (){
        for(var i=0; i<this.noteStack.length; i++){
            if(this.noteStack[i].status=="selected") {
                this.noteStack.splice(i, 1);
            }
        }
    },

    backPointerToZero: function () {
        this.now={x:0, y:0};
    },

    // mouse Action
    mousedownAction: function(event) {
        var rect = event.target.getBoundingClientRect();
        // for PC browser
        this.mAction.initial.x = event.clientX - rect.left;
        this.mAction.initial.y = event.clientY - rect.top;
        this.mAction.clicked.event=event;
        
        // select note in noteInputArea
        var note=this.getMidiNo(event);
        var tick=this.getMBTickNo(event);
        var id=this.getIDfromNoteTick(note, tick);
        
        // re-select start
        for(var i=0; i<this.noteStack.length; i++){
            this.noteStack[i].status=false;
        }
        if(id!==false) {
            this.noteStack[id].status="selected";
        }
        // re-select end
        
        this.mAction.clicked.status=true;
        var ptNow=this.sizes.grabArea.x+this.sizes.musicalBarArea.initialSpace.x+this.sizes.keyboard.w.x+this.now.x;
        
        if(this.mAction.initial.x<ptNow+this.sizes.musicalBarArea.pointer.width/2
           && this.mAction.initial.x>ptNow-this.sizes.musicalBarArea.pointer.width/2 ) {
            this.mAction.clicked.place="pointer";
            //console.log("pointer");
        } else if(this.mAction.initial.x<this.sizes.grabArea.x || this.mAction.initial.y<this.sizes.musicalBarArea.y) {
            //console.log("musicalBarArea");
            this.mAction.clicked.place="musicalBarArea";
            if(this.mAction.initial.x>this.sizes.musicalBarArea.pointer.x0 && this.mAction.initial.x<this.sizes.musicalBarArea.pointer.x1){
                this.sizes.musicalBarArea.pointer.grab=true;
            }
        } else if(this.mAction.initial.x>this.sizes.grabArea.x && this.mAction.initial.x<this.sizes.grabArea.x+this.sizes.keyboard.w.x) {
            //console.log("keyboardArea");
            this.mAction.clicked.place="keyboardArea";
        } else {
            this.mAction.clicked.place="noteInputArea";
            this.mAction.clicked.note=this.getMidiNo(event);
            this.mAction.clicked.tick=this.getMBTickNo(event);
            
            if(this.checkOnNote(note, tick)!==false) {
                this.mAction.clicked.place="onNote";
                if(tick.no==this.noteStack[id].s) {
                    this.mAction.clicked.place="onNote.s";
                } else if(tick.no==this.noteStack[id].e) {
                    this.mAction.clicked.place="onNote.e";
                } else {
                    this.mAction.clicked.place="onNote";
                }
                
            }
            
        }
        
    },

    mouseupAction: function(event) {
        if(this.mAction.clicked.status==true) {
            var note=this.getMidiNo(event);
            var tick=this.getMBTickNo(event);
            var id=this.getIDfromNoteTick(note, tick);
            switch(this.mAction.clicked.place) {
              case "noteInputArea":
                if(this.mAction.clicked.tick.no!=tick.no) {
                    if(this.mAction.clicked.tick.no > tick.no) {
                        var t=this.mAction.clicked.tick.no;
                        this.mAction.clicked.tick.no=tick.no;
                        tick.no=t;
                    }
                    this.noteStack.push({"note": note.midiNo, "s": this.mAction.clicked.tick.no+1.0, "e": tick.no, "status": false, "type": 0x90});
                }
                break;
              case "onNote":
                break;
            }
            
            // intiate
            this.mAction.clicked= {
                status:false,
                note:null,
                tick:false,
                event:false
            };
            this.sizes.musicalBarArea.pointer.grab=false;
            
            this.mAction.clicked.place=null;
            this.mAction.pointer.previous.x=0;
            this.fGrid.previous.x=this.fGrid.offset.x;
            this.fGrid.previous.y=this.fGrid.offset.y;
            
        }
    },
    
    mousemoveAction: function(event) {
        if(this.mAction.clicked.status===true) {
            var note=this.getMidiNo(event);
            var tick=this.getMBTickNo(event);
            var st=this.getSelectedNote(); // selected
            var delta=tick.no-this.mAction.clicked.tick.no;
            var noteSECheck=false;
            this.mAction.clicked.event=event;
            switch(this.mAction.clicked.place) {
              case "musicalBarArea":
                var rect = event.target.getBoundingClientRect();
                this.mAction.moving.x = event.clientX - rect.left;
                this.mAction.moving.y = event.clientY - rect.top;
                
                if(this.mAction.moving.x > 0 || this.mAction.moving.x < sizes.canvas.width
                   || this.mAction.moving.y > 0 || this.mAction.moving.y < sizes.canvas.height ) {
                    this.mAction.distance.x = this.mAction.moving.x - this.mAction.initial.x;
                    this.mAction.distance.y = this.mAction.moving.y - this.mAction.initial.y;
                    
                    this.fGrid.offset.x=this.mAction.distance.x+this.fGrid.previous.x;
                    this.fGrid.offset.y=this.mAction.distance.y+this.fGrid.previous.y;
                    
                }
                
                var os_protrution=0; // protrution
                if(this.fGrid.offset.y>os_protrution) {
                    this.fGrid.offset.y=os_protrution;
                }
                var os_ymin=-7*this.sizes.keyboard.w.y*this.sizes.keyboard.octave+(this.sizes.canvas.height-os_protrution-this.sizes.musicalBarArea.y); // offset y min
                if(this.fGrid.offset.y<=os_ymin) {
                    this.fGrid.offset.y=os_ymin;
                }
                if(this.fGrid.offset.x>os_protrution) {
                    this.fGrid.offset.x=os_protrution;
                }
                var right=-1*(this.sizes.roll.tick16*this.sizes.roll.mBarCount-
                              (this.sizes.canvas.width-this.sizes.musicalBarArea.y-this.sizes.musicalBarArea.initialSpace.x-this.sizes.keyboard.w.x)+os_protrution);
                if(this.fGrid.offset.x<right) {
                    this.fGrid.offset.x=right;
                }
                break;
              case "noteInputArea":
                break;
              case "onNote":
                this.mAction.clicked.tick.no=tick.no;
                this.noteStack[st.id].note=note.midiNo;
                this.noteStack[st.id].s=this.noteStack[st.id].s+delta;
                this.noteStack[st.id].e=this.noteStack[st.id].e+delta;
                break;
              case "onNote.s":
                this.mAction.clicked.tick.no=tick.no;
                this.noteStack[st.id].note=note.midiNo;
                this.noteStack[st.id].s=this.noteStack[st.id].s+delta;
                noteSECheck=true;
                //console.log("onNote StartPoint");
                break;
              case "onNote.e":
                this.mAction.clicked.tick.no=tick.no;
                this.noteStack[st.id].note=note.midiNo;
                this.noteStack[st.id].e=this.noteStack[st.id].e+delta;
                noteSECheck=true;
                //console.log("onNote EndPoint");
                break;
              case "pointer":
                var rect = event.target.getBoundingClientRect();
                if(this.mAction.pointer.previous.x==0) {
                    this.mAction.pointer.previous.x=this.mAction.initial.x;
                }
                var d=(event.clientX-rect.left)-this.mAction.pointer.previous.x;
                this.mAction.pointer.previous.x=event.clientX-rect.left;
                this.now.x=this.now.x+d;
                if(this.now.x<0) {
                    this.now.x=0;
                }
                //console.log(this.now.x, this.mAction.pointer.previous.x);
                break;
            }
            if( noteSECheck===true ) {
                if(this.noteStack[st.id].s > this.noteStack[st.id].e) {
                    var tmp=this.noteStack[st.id].e;
                    this.noteStack[st.id].e=this.noteStack[st.id].s;
                    this.noteStack[st.id].s=tmp;
                }
            }
            
        }
    },
    
    clearAll: function (prCtx) {
        prCtx.clearRect(0, 0, this.sizes.canvas.width, this.sizes.canvas.height);
    }
    
};


