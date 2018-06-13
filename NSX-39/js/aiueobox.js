/*
* aiueoBox.js v1.0.0 by @ryoyakawai
* Copyright (c) 2014 Yamaha Corporation. All rights reserved.
*/

var aiueoBox = function(arElemId) {
    this.pi = Math.PI;
    this.offset={"x":10.5, "y":10.5};
    this.button={"Size": 78, "Space": 8, "bdrRadius": 10};
    this.mOverNow={"key":false, "Idx":false};
    this.canvas=[];
    this.ctx=[];
    this.cursor="default";
    this.closeImg=new Image();
    this.closeImg.src="images/close.png";
    this.dragImg=new Image();
    this.dragImg.src="images/drag.png";
    this.drag={"click":false, "Idx":false};
    this.pointerPos={"x":0, "y":0};
    
    for(var i=0; i<arElemId.length; i++) { 
        var Idx=i+1;
        this.canvas[Idx]=document.querySelector(arElemId[i]);
        this.ctx[Idx]=this.canvas[Idx].getContext("2d");
    }

    this.color={
        "button":{
            "fill":        "#efffef", //"#dcdcdc",
            "text":        "#137a7f",
            "guideText":   "#000000",
            "stroke":      "#d7e0d7",//#bbc6bb", //"#a9a9a9",
            "strokeClick": "#bbc6bb", //"#a9a9a9",
            "mOver":       "#fffafa",
            "bDelete":     "rgba(232, 230, 227, 0.83)",
            "bMove":       "rgba(76, 212, 125, 0.84)",
            "bMoveOver":   "rgba(76, 212, 125, 0.20)",
            "mClick":      "#7fffd4",
            "shadow":      "#afafaf"
        }
    };
    this.uiMode="Play"; // play, edit, add, move
    this.bPosition=[
        [],
        [
            {"wa": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"wo": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"n": {"x":0, "y":0} },
            {"ra": {"x":0, "y":0} }, {"ri": {"x":0, "y":0} }, {"ru": {"x":0, "y":0} }, {"re": {"x":0, "y":0} }, {"ro": {"x":0, "y":0} },
            {"ya": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"yu": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"yo": {"x":0, "y":0} },
            {"ma": {"x":0, "y":0} }, {"mi": {"x":0, "y":0} }, {"mu": {"x":0, "y":0} }, {"me": {"x":0, "y":0} }, {"mo": {"x":0, "y":0} },
            {"ha": {"x":0, "y":0} }, {"hi": {"x":0, "y":0} }, {"hu": {"x":0, "y":0} }, {"he": {"x":0, "y":0} }, {"ho": {"x":0, "y":0} },
            {"na": {"x":0, "y":0} }, {"ni": {"x":0, "y":0} }, {"nu": {"x":0, "y":0} }, {"ne": {"x":0, "y":0} }, {"no": {"x":0, "y":0} },
            {"ta": {"x":0, "y":0} }, {"ti": {"x":0, "y":0} }, {"tu": {"x":0, "y":0} }, {"te": {"x":0, "y":0} }, {"to": {"x":0, "y":0} },
            {"sa": {"x":0, "y":0} }, {"shi": {"x":0, "y":0} }, {"su": {"x":0, "y":0} }, {"se": {"x":0, "y":0} }, {"so": {"x":0, "y":0} },
            {"ka": {"x":0, "y":0} }, {"ki": {"x":0, "y":0} }, {"ku": {"x":0, "y":0} }, {"ke": {"x":0, "y":0} }, {"ko": {"x":0, "y":0} },
            {"a": {"x":0, "y":0} }, {"i": {"x":0, "y":0} }, {"u": {"x":0, "y":0} }, {"e": {"x":0, "y":0} }, {"o": {"x":0, "y":0} }
        ],
        [
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} },
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} },
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} },
            {"pa": {"x":0, "y":0} }, {"pi": {"x":0, "y":0} }, {"pu": {"x":0, "y":0} }, {"pe": {"x":0, "y":0} }, {"po": {"x":0, "y":0} },
            {"ba": {"x":0, "y":0} }, {"bi": {"x":0, "y":0} }, {"bu": {"x":0, "y":0} }, {"be": {"x":0, "y":0} }, {"bo": {"x":0, "y":0} },
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} },
            {"da": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"de": {"x":0, "y":0} }, {"do": {"x":0, "y":0} },
            {"za": {"x":0, "y":0} }, {"zi": {"x":0, "y":0} }, {"zu": {"x":0, "y":0} }, {"ze": {"x":0, "y":0} }, {"zo": {"x":0, "y":0} },
            {"ga": {"x":0, "y":0} }, {"gi": {"x":0, "y":0} }, {"gu": {"x":0, "y":0} }, {"ge": {"x":0, "y":0} }, {"go": {"x":0, "y":0} },
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }
        ],
        [
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} },
            {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} }, {"d0": {"x":0, "y":0} },
            {"ja": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"ju": {"x":0, "y":0} }, {"je": {"x":0, "y":0} }, {"jo": {"x":0, "y":0} },
            {"sha": {"x":0, "y":0} }, {"si"  : {"x":0, "y":0} }, {"shu": {"x":0, "y":0} }, {"she": {"x":0, "y":0} }, {"sho": {"x":0, "y":0} },
            {"d0"  : {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"tyu": {"x":0, "y":0} }, {"dyu": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} },
            {"d0"  : {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"tu": {"x":0, "y":0} }, {"du": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} },
            {"zwa": {"x":0, "y":0} }, {"zwi": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"zwe": {"x":0, "y":0} }, {"zwo": {"x":0, "y":0} },
            {"d0"  : {"x":0, "y":0} }, {"swi": {"x":0, "y":0} }, {"zwi": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} },
            {"kya": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"kyu": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"kyo": {"x":0, "y":0} },
            {"d0"  : {"x":0, "y":0} }, {"wi": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"we": {"x":0, "y":0} }, {"wo": {"x":0, "y":0} }
        ],
        [
            {"rya": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"ryu": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"ryo": {"x":0, "y":0} },
            {"mya": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"myu": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"myo": {"x":0, "y":0} },
            {"nya": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"nyu": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"nyo": {"x":0, "y":0} },
            {"fa": {"x":0, "y":0} }, {"fi": {"x":0, "y":0} }, {"fu": {"x":0, "y":0} }, {"fe": {"x":0, "y":0} }, {"fo": {"x":0, "y":0} },
            {"pya": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"pyu": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"pyo": {"x":0, "y":0} },
            {"bya": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"byu": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"byo": {"x":0, "y":0} },
            {"hya": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"hyu": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"hyo": {"x":0, "y":0} },
            {"d0"  : {"x":0, "y":0} }, {"ti": {"x":0, "y":0} }, {"di": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} },
            {"tsa": {"x":0, "y":0} }, {"tsi": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"tse": {"x":0, "y":0} }, {"tso": {"x":0, "y":0} },
            {"cha": {"x":0, "y":0} }, {"d0"  : {"x":0, "y":0} }, {"chu": {"x":0, "y":0} }, {"che": {"x":0, "y":0} }, {"cho": {"x":0, "y":0} }
        ],
        [
            {"ko":{"x":5,"y":6}},     {"no":{"x":90,"y":6}},    {"no":{"x":388,"y":6}},     {"bo":{"x":502,"y":7}},   {"ta":{"x":584,"y":6}},
            {"n":{"x":666,"y":7}},   {"ha":{"x":773,"y":4}},   {"tsu":{"x":63,"y":122}},    {"i":{"x":28,"y":238}},  {"ka":{"x":228,"y":130}},
            {"sa":{"x":404,"y":131}}, {"ku":{"x":489,"y":126}}, {"jo":{"x":576,"y":121}}, {"i":{"x":143,"y":124}}, {"do":{"x":109,"y":238}},
            {"u":{"x":608,"y":236}}, {"ga":{"x":325,"y":232}}, {"ji":{"x":445,"y":244}},   {"yu":{"x":528,"y":240}}, {"u":{"x":187,"y":242}},
            {"ni":{"x":761,"y":224}}, {"o":{"x":113,"y":346}}, {"ko":{"x":191,"y":346}},   {"na":{"x":275,"y":344}}, {"e":{"x":357,"y":341}},
            {"ma":{"x":438,"y":340}}, {"su":{"x":519,"y":339}}, {"ta":{"x":200,"y":7}},     {"bu":{"x":282,"y":5}},   {"d0":{"x":0,"y":0}},
            {"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},
            {"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},
            {"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},
            {"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}},{"d0":{"x":0,"y":0}}
        ]
    ];
    this.bPositionT=[  [], [], [], [], []  ];
    // init position
    var btnSpace=this.button.Space;
    var btnSize=this.button.Size;
    for(var ii=0; ii<this.bPosition.length-1; ii++) {
        var Idx=ii+1;
        var count=0, k;
        for(var i=0; i<10; i++) {
            for(var j=0; j<5; j++) {
                k=Object.keys(this.bPosition[Idx][count])[0];
                if(k.match(/^d0/)==null) {
                    switch(Idx){
                      case 5:
                        if(this.bPosition[Idx][count][k].x==0 && this.bPosition[Idx][count][k].y==0) {
                            this.bPosition[Idx][count][k].x=this.offset.x + i*(btnSpace+btnSize);
                            this.bPosition[Idx][count][k].y=this.offset.y + j*(btnSpace+btnSize);
                        }
                        break;
                    default:
                        this.bPosition[Idx][count][k].x=this.offset.x + i*(btnSpace+btnSize);
                        this.bPosition[Idx][count][k].y=this.offset.y + j*(btnSpace+btnSize);
                        break;
                    }
                }
                count++;
            }
        }
    }
};

aiueoBox.prototype={
    spliceReplace: function(idx){
        this.bPositionT[idx]=new Array();
        for(var i=0; i<this.bPosition[idx].length; i++) {
            var k=Object.keys(this.bPosition[idx][i])[0];
            if( k!="d0" ) {
                this.bPositionT[idx].push(this.bPosition[idx][i]);
            }
        }
        while(this.bPositionT[idx].length<50) {
            this.bPositionT[idx].push({"d0": {"x":0, "y":0} });
        }
        this.bPosition[idx]=this.bPositionT[idx];
    },
    getAvailableLetterCount: function(idx){
        var count=0;        
        for(var i=0; i<this.bPosition[idx].length; i++) {
            var k=Object.keys(this.bPosition[idx][i])[0];
            if( k=="d0" ) {
                count++;
            }
        }
        return count;
    },

    drawAiueo: function(tabStatus) {
        var btnSpace=this.button.Space;
        var btnSize=this.button.Size;
        this.spliceReplace(5);
        
        for(var ii=0; ii<this.ctx.length; ii++) {
            var Idx=ii+1;
            var tabName="t_aiueo0"+Idx;
            if(tabStatus[tabName]==true) {
                this.ctx[Idx].beginPath();
                this.ctx[Idx].clearRect(0, 0, this.canvas[Idx].width, this.canvas[Idx].height);
                this.ctx[Idx].stroke();
                
                this.ctx[Idx].beginPath();
                var count=0, k;
                for(var i=0; i<10; i++) {
                    for(var j=0; j<5; j++) {
                        k=Object.keys(this.bPosition[Idx][count])[0];
                        if(k.match(/^d0/)==null) {
                            var btnPos=this.bPosition[Idx][count][k];
                            drawBlock.bind(this)(this.ctx[Idx], btnPos.x, btnPos.y, k, count);
                        }
                        count++;
                    }
                }
                this.ctx[Idx].closePath();
            }
        }
        
        function drawBlock(context, x, y, k, dNum) {
            // set shadow
            switch(this.uiMode) {
              case "Move":
              case "Delete":
                break;
              case "Play":
                context.shadowBlur = 10;
                context.shadowColor = this.color.button.shadow;
                context.shadowOffsetX = 2;
                context.shadowOffsetY = -2;
                break;
            }
            
            context.fillStyle=this.color.button.fill; // "#dcdcdc";
            if(this.mOverNow.Idx==dNum && this.drag.click==false) {
                switch(this.uiMode) {
                  case "Play":
                    context.fillStyle=this.color.button.mOver; // "#dcdcdc";
                    break;
                  case "Delete":
                    context.fillStyle=this.color.button.bDelete;
                    break;
                  case "Move":
                    context.fillStyle=this.color.button.bMoveOver;
                    break;
                }
            } else if(this.drag.Idx==dNum && this.drag.click==true) {
                switch(this.uiMode) {
                  case "Play":
                    context.fillStyle=this.color.button.mOver; // "#dcdcdc";
                    break;
                  case "Move":
                    context.fillStyle=this.color.button.bMove;
                    break;
                }
            }
            context.strokeStyle=this.color.button.stroke;
            var shake={ "x":0, "y":0 };
            switch(this.uiMode){
              case "Move":
              case "Delete":
                var r={"a":Math.floor(Math.random() * 3), "b": Math.floor(Math.random() * 3)};
                shake={ "x": r.a-r.b, "y": r.b-r.a};
                break;
            }
            
            this.fillRoundRect(context, "fill", x+shake.x, y+shake.y, btnSize, btnSize, this.button.bdrRadius, 0);
            this.fillRoundRect(context, "stroke", x+shake.x, y+shake.y, btnSize, btnSize, this.button.bdrRadius, 0);
            
            context.shadowBlur = 0;
            context.shadowColor = this.color.button.shadow;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;

            // text
            context.fillStyle=this.color.button.text;
            context.font="25px Arial";
            context.strokeStyle=this.color.button.strokeClick;
            var xPos=x+btnSize/2-0.34*btnSize;
            var yPos=y+btnSize-0.6*btnSize;
            if(this.mOverNow.Idx==dNum && this.drag.click==false) {
                switch(this.uiMode) {
                default:
                  case "Play":
                    this.cursor="default";
                    context.font="Bold 32px Arial";
                    xPos-=8; yPos+=5;
                    break;
                  case "Delete":
                    var dMsg="Click to delete";
                    context.fillStyle=this.color.button.guideText;
                    context.font="Bold 10px Arial";
                    context.fillText(dMsg, xPos-2.5+shake.x, yPos+35.5+shake.y);
                    context.font="25px Arial";
                    context.drawImage(this.closeImg, x+25.5+shake.x, y+30.5+shake.y);
                    context.fillStyle=this.color.button.text;
                    this.fillRoundRect(context, "stroke", x+shake.x, y+shake.y, btnSize, btnSize, this.button.bdrRadius, 0);
                    break;
                  case "Move":
                    var dMsg="Drag to move";
                    this.cursor="pointer";
                    context.fillStyle=this.color.button.guideText;
                    context.font="Bold 9px Arial";
                    context.fillText(dMsg, xPos-8.5+shake.x, yPos+35.5+shake.y);
                    context.font="25px Arial";
                    context.drawImage(this.dragImg, x+25.5+shake.x, y+30.5+shake.y);
                    context.fillStyle=this.color.button.guideText;
                    this.fillRoundRect(context, "stroke", x+shake.x, y+shake.y, btnSize, btnSize, this.button.bdrRadius, 0);
                    break;
                }
            } else if(this.drag.Idx==dNum && this.drag.click==true) {
                switch(this.uiMode) {
                default:
                  case "Play":
                    this.cursor="default";
                    context.font="Bold 32px Arial";
                    xPos-=8; yPos+=5;
                    break;
                  case "Move":
                    var dMsg="Drag to move";
                    this.cursor="pointer";
                    context.fillStyle=this.color.button.guideText;
                    context.font="Bold 10px Arial";
                    context.fillText(dMsg, xPos-8.5+shake.x, yPos+35.5+shake.y);
                    context.font="25px Arial";
                    context.drawImage(this.dragImg, x+25.5+shake.x, y+30.5+shake.y);
                    context.fillStyle=this.color.button.guideText;
                    this.fillRoundRect(context, "stroke", x+shake.x, y+shake.y, btnSize, btnSize, this.button.bdrRadius, 0);
                    break;
                }
            }
            context.fillText(k, xPos+shake.x, yPos+shake.y); 
        }
    },

    setButtonPos: function(Idx, x, y) {
        var offset=this.button.Size/2;
        this.bPosition[Idx][this.drag.Idx][this.drag.key]={"x":x-offset, "y":y-offset};
    },
    
    // Refferd URL: http://devlabo.blogspot.jp/2010/03/javascriptcanvas.html
    // l: left, t: top, w: width, h: height, r: radius, rotate
    fillRoundRect: function(context, type, l, t, w, h, r, rotate) {
        var pi = this.pi;
        if(typeof rotate!="number") rotate=0;
        context.save();
        context.beginPath();
        context.rotate( rotate * this.pi / 180 );
        context.arc(l + r, t + r, r, - this.pi, - 0.5 * this.pi, false);
        context.arc(l + w - r, t + r, r, - 0.5 * this.pi, 0, false);
        context.arc(l + w - r, t + h - r, r, 0, 0.5 * this.pi, false);
        context.arc(l + r, t + h - r, r, 0.5 * this.pi, this.pi, false);
        context.closePath();
        switch(type) {
          case "fill":
            context.fill();
            break;
          case "stroke":
            context.stroke();
            break;
        }
        context.restore();
    },

    getPosIdx: function(bPIdx, x, y) {
       var out={"key":false, "Idx":false};
        for(var i=this.bPosition[bPIdx].length-1; i>=0; i--) {
            var key=Object.keys(this.bPosition[bPIdx][i])[0];
            var pos=this.bPosition[bPIdx][i][key];
            if( (key!="d0" &&
                 x>pos.x && x<pos.x+this.button.Size) &&
                (y>pos.y && y<pos.y+this.button.Size) ) {
                out={"key": key, "Idx":i};
                this.mOverNow=out;
                break;
            }
        }
        return out;
    },

    deleteBlock: function(canvasIdx, arrIdx) {
        for(var i=0; i<arrIdx.length; i++) {
            delete this.bPosition[canvasIdx][arrIdx[i]];
            this.bPosition[canvasIdx][arrIdx[i]]={"d0": {"x":0, "y":0} };
        }
    },

    exportSandbox: function() {
    }
    
};

