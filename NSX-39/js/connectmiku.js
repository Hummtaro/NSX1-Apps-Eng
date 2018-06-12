/*
* connectMiku.js v1.0.0 by @ryoyakawai
* Copyright (c) 2014 Yamaha Corporation. All rights reserved.
*/

//var mIn, mOut;
var connectMiku=function(){    
    this.webMIDIStatus=false;
    this.requestStatus=false;
    this.midi;
    this.inputs;
    this.outputs;
    this.mIn=false;
    this.mOut=false;
    this.firstConnect=false;
};

connectMiku.prototype={
    onmidimessage: function(event){
        console.log("[connectMiku.js] onmidimessage", event);
    },
    checkWebMidiStatus: function() {
        this.webMIDIStatus=true;
        if(typeof navigator.requestMIDIAccess=="undefined") {
            this.webMIDIStatus=false;
        }
        return this.webMIDIStatus;
    },
    init: function(){
        var self=this;
        $(document).ready(function(){            
            navigator.requestMIDIAccess({sysex: true}).then(scb, ecb);
        });
        function scb(access) {
            if(self.mIn==false && self.mOut==false) {
                this.firstConnect=true;
            }
            self.midi=access;

            var inputIterator = self.midi.inputs.values();
            self.inputs = [];
            for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
                self.inputs.push(o.value);
            }
            var outputIterator = self.midi.outputs.values();
            self.outputs = [];
            for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
                self.outputs.push(o.value);
            }

            self.requestStatus=true;
            updateSelectTag.bind(self)("new", null);
            
				    access.onstatechange=function(event){
                var portObj=[], newPort=true;
                switch(event.port.type) {
                  case "input":
                    if(typeof self.input!="undefined") portObj=self.input;
                    break;
                  case "output":
                    if(typeof self.output!="undefined") portObj=self.output;
                    break;
                }
                for(var i=0; i<portObj.length; i++) {
                    if(event.port.id==portObj[i].id) {
                        portObj[i]=event.port;
                        newPort=false;
                        break;
                    }
                }
                if(newPort==true) {
                    portObj.push(event.port);
                }
                updateSelectTag.bind(self)("update", event);
				    };

            function updateSelectTag(type, port) {
                var mi=document.getElementById("midiInSel");
                var mo=document.getElementById("midiOutSel");

                switch(type) {
                  case "new":
                    // MIDI In
                    for(var i=0; i<this.inputs.length; i++) {
                        // in modal
                        var deviceName=this.inputs[i]["name"];
                        var id=this.inputs[i]["id"];
                        mi.options[i]=new Option(deviceName, id);
                        // check miku
                        if(deviceName.search(/NSX-39/i)>-1) {
                            mi.options[i].selected=true;
                        }
                    }

                    // MIDI OUT
                    for(var i=0; i<this.outputs.length; i++) {
                        // in modal
                        var deviceName=this.outputs[i]["name"];
                        var id=this.outputs[i]["id"];
                        mo.options[i]=new Option(deviceName, id);
                        // check miku
                        if(deviceName.search(/NSX-39/i)>-1) {
                            mo.options[i].selected=true;
                        }
                    }
                    break;
                  case "update":
                    var portObj;
                    switch(event.port.type) {
                      case "input":
                        portObj=mi;
                        break;
                      case "output":
                        portObj=mo;
                        break;
                    }
					          if(event.port && event.port.state=="connected") {
                        var newPort=true;
                        for(var i=0; i<portObj.length; i++) {
                            if(event.port.id==portObj[i].value) {
                                newPort=false;
                                break;
                            }
                        }
                        if(newPort==true) {
                            var addIdx=portObj.length;
                            portObj.options[addIdx]=new Option(event.port.name, event.port.id);
                            if(event.port.name.search(/NSX-39/i)>-1) {
                                portObj.options[addIdx].selected=true;
                            }
                        }
					          }
                    if(event.port && event.port.state=="disconnected") {
                        for(var i=0; i<portObj.length; i++) {
                            if(event.port.id==portObj[i].value) {
                                portObj.remove(i);
                                break;
                            }
                        }
                    }
                    switch(event.port.type) {
                      case "input":
                        mi=portObj;
                        break;
                      case "output":
                        mo=portObj;
                        break;
                    }
                    break;
                }
            }
            
            if(self.inputs.length==0 || self.outputs.length==0) {
                document.querySelector("#divMidiInSelWarning").style.removeProperty("display");
                document.querySelector("#connectSelB").setAttribute("disabled", "disabled");
                document.querySelector("#divMIDIArea").style.setProperty("display", "none");
            }
            
            // Connect to Device
            document.getElementById("connectSelB").addEventListener("click", function(){
                var selIdx, selVal=document.getElementById("midiInSel").value;
                for(var i=0; i<self.inputs.length; i++) {
                    if(selVal==self.inputs[i].id) {
                        selIdx=i;
                        break;
                    }
                }
                self.mIn=false;
                self.mIn = self.inputs[selIdx];
                self.mIn.onmidimessage=function(event) {
                    self.onmidimessage(event);
                };
                
                var selIdx, selVal=document.getElementById("midiOutSel").value;
                for(var i=0; i<self.outputs.length; i++) {
                    if(selVal==self.outputs[i].id) {
                        selIdx=i;
                        break;
                    }
                }
                self.mOut=false;
                self.mOut = self.outputs[selIdx];

                self.closeConnectionDialog();
                //self.getLiricsFromDevice();
            });

        }
        
        function ecb() {
            console.log("[ERROR] Connect to Miku.");
        }
        
    },
    checkMikuConnected: function() {
    },
    getLiricsFromDevice: function() {
    },
    closeConnectionDialog: function() {
    },
    sysExtoString: function(data) {
        for(var i=0, tmp="", a; i<data.length; i++) {
            a=data[i].toString(16).toUpperCase();
            if(a.length==1) {
                a="0"+a;
            }
            tmp=tmp + " 0x" +a;
        }
        return tmp;
    }

};

var connMk= new connectMiku();


