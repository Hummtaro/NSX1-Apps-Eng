/*
* nsx39.js v1.0.1 by @ryoyakawai
* Copyright (c) 2014 Yamaha Corporation. All rights reserved.
*/

var Nsx39=function(){
    this.sysExPrefix=[ 0xF0, 0x43, 0x79, 0x09, 0x11 ];
    this.sysExSuffix=[ 0xF7 ];
    this.devide=64;
    this.textMap={
		1: {
            "a": 0x00, "i": 0x01, "u": 0x02, "e": 0x03, "o": 0x04,
			"n": 0x7B
		},
		2: {
			"ka": 0x05, "ki": 0x06, "ku": 0x07, "ke": 0x08, "ko": 0x09,
			"ga": 0x0A, "gi": 0x0B, "gu": 0x0C, "ge": 0x0D, "go": 0x0E,
            "sa": 0x15, "si": 0x16, "su": 0x17, "se": 0x18, "so": 0x19,
			"za": 0x1A, "zi": 0x1B, "zu": 0x1C, "ze": 0x1D, "zo": 0x1E,
			"ja": 0x24, "ji": 0x25, "ju": 0x26, "je": 0x27, "jo": 0x28, 
            "ta": 0x29, "ti": 0x2A, "tu": 0x2B, "te": 0x2C, "to": 0x2D,
			"da": 0x2E, "di": 0x2F, "du": 0x30, "de": 0x31, "do": 0x32,
			"na": 0x3F, "ni": 0x40, "nu": 0x41, "ne": 0x42, "no": 0x43,
			"ha": 0x47, "hi": 0x48, "fu": 0x49, "he": 0x4A, "ho": 0x4B,
			"ba": 0x4C, "bi": 0x4D, "bu": 0x4E, "be": 0x4F, "bo": 0x50,
			"pa": 0x51, "pi": 0x52, "pu": 0x53, "pe": 0x54, "po": 0x55,
			"fa": 0x5F, "fi": 0x60, "fe": 0x62, "fo": 0x63, 
            "ma": 0x64, "mi": 0x65, "mu": 0x66, "me": 0x67, "mo": 0x68,
			"ya": 0x6C, "yu": 0x6D, "yo": 0x6E,
			"ra": 0x6F, "ri": 0x70, "ru": 0x71, "re": 0x72, "ro": 0x73,
			"wa": 0x77, "wi": 0x78, "we": 0x79, "wo": 0x7A,
			"n1": 0x7B, "n2": 0x7C, "n3": 0x7D, "n4": 0x7E, "n5": 0x7F
		},
		3: {
            "kya": 0x0F, "kyu": 0x10, "kyo": 0x11,
			"gya": 0x12, "gyu": 0x13, "gyo": 0x14,  
            "swi": 0x16,
            "zwa": 0x1A, "zwi": 0x1B, "zwe": 0x1D, "zwo": 0x1E, 
            "sha": 0x1F, "shi": 0x20, "shu": 0x21, "she": 0x22, "sho": 0x23,   
            "tyu": 0x33, "dyu": 0x34,
			"cha": 0x35, "chi": 0x36, "chu": 0x37, "che": 0x38, "cho": 0x39,
			"tsa": 0x3A, "tsi": 0x3B, "tsu": 0x3C, "tse": 0x3D, "tso": 0x3E, 
            "nya": 0x44, "nyu": 0x45, "nyo": 0x46,
            "hya": 0x56, "hyu": 0x57, "hyo": 0x58,
			"bya": 0x59, "byu": 0x5A, "byo": 0x5B,
			"pya": 0x5C, "pyu": 0x5D, "pyo": 0x5E, 
            "fyu": 0x61, 
            "mya": 0x69, "myu": 0x6A, "myo": 0x6B, 
            "rya": 0x74, "ryu": 0x75, "ryo": 0x76
		}
    };
    // create Phonetic Symbol's RegExp 
    for(var i=1, rexp=[]; i<=3; i++) {
        for(var key in this.textMap[i]) {
            rexp.push(key);
        }
    };
    this.pRegExp=rexp;
};

Nsx39.prototype={
    addd0: function(d0) {
        this.sysExPrefix.push( d0 );
    },
    deleted0: function() {
        this.sysExPrefix.splice(this.sysExPrefix.length-1, 1);
    },
    setDevide: function(devide) {
        this.devide=devide;
    },
    getUpdateSysExByText: function(ls, Idx, chop) {
        this.addd0( 0x0A );
        var errCount=0;
        var outTmp=[], out=[];
        var devide=this.devide;
        outTmp=[];
        outTmp.push(Idx);
        
        var tmp=ls.replace(/ /g,"");
        
        for(var j=0; j<tmp.length; j++) {
            var t;
			
			t=this.textMap[3][tmp.substring(j, j+3)];
			if(typeof t==="undefined") {
				t=this.textMap[2][tmp.substring(j, j+2)];
				if(typeof t==="undefined") {
					t=this.textMap[1][tmp.substring(j, j+1)];
				} else {
					j++;
				}
			} else {
                j++;
				j++;
            }

            if(typeof t==="undefined") {
                errCount++;
            } else {
                outTmp.push(t);
            }
			
			if(chop==true && outTmp.length > 64) {
				break;
			}
        }
        out=this.sysExPrefix.concat(outTmp, this.sysExSuffix);

        for(var i=0, tmp=""; i<out.length; i++) {
            tmp=tmp + "0x" + out[i].toString(16) + " " ;
        }
        this.deleted0();
        return {"sysEx": out, "errCount": errCount};
    },
    getTextBySysEx: function(msg, Idx) {
        var out="", breakF=false;
        this.addd0( 0x1F );
        for(var i=0; i<this.sysExPrefix.length; i++) {
            if(i!=5 && msg[i]!=this.sysExPrefix[i]) {
                this.deleted0();
                return false;
            }
        }
        for(var i=this.sysExPrefix.length+1; i<msg.length-1; i++) {
            for(var val0 in this.textMap ) {
                for(var val1 in this.textMap[val0]) {
                    if(this.textMap[val0][val1]==msg[i]) {
                        out = out + val1 + " ";
                        breakF=true;
                        break;
                    }
                }
                if(breakF==true) {
                    breakF=false;
                    break;
                }
            }
        }
        var arOut=this.createLyricsReqOrder(out);
        this.deleted0();
        return {"lyrics": out, "lyricsOrder":arOut};
    },
    createLyricsReqOrder: function(w){
        for(var i=0, arOut=[]; i<w.length; i++) {
			if(!w.substr(i, 1).includes(" ")){
				arOut.push(i);
			}
			if(w.substr(i, 3).length==3 && typeof this.textMap[3][w.substr(i, 3)]!="undefined") {
				i++;
				i++;
			}
			else if(w.substr(i, 2).length==2 && typeof this.textMap[2][w.substr(i, 2)]!="undefined") {
				i++;
			}
        }
        return arOut;
    },
    acceptablePhoneticSym: function(w) {
        var sysExC=this.getUpdateSysExByText(w, 0, false);
        var sysEx=sysExC.sysEx;
        var aw=this.getTextBySysEx(sysEx, 0);
        // -2: d0, slotNo
        var count=sysEx.length-this.sysExPrefix.length-this.sysExSuffix.length-2;
        return {"count": parseInt(count), "aw": aw.lyrics, "errCount":sysExC.errCount, realCount:w.length};
    }

};


var nsx39=new Nsx39();
