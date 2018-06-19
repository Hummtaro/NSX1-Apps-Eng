// ■Chrome 66対応を追加 timestampまわりがおかしいので暫定的に 2018/05/09
//slot select
$(function(){
  $('#slot a').click(function(){
    //反映先の要素名を取得
    var visibleTag = $(this).parents('ul').attr('visibleTag');
    var hiddenTag = $(this).parents('ul').attr('hiddenTag');
    //選択された内容でボタンの表示を変える
    $(visibleTag).html($(this).attr('value'));
    //選択された内容でhidden項目の値を変える
    $(hiddenTag).val($(this).attr('value'));
  })
})


//regulation
var tou_url="regulations/yamaha_webapp.txt";
var dRgl=new DispRegulation();
dRgl.show(tou_url);

document.getElementById("showToUJ").addEventListener("click", function() {
    dRgl.getRegulation(tou_url, dRgl);
    var tTimerId=setInterval(function() {
        if(dRgl.xhrDone==true) {
            clearInterval(tTimerId);
            document.getElementById("regContent").innerHTML=dRgl.regulationText;
        }
    },10);
});

// midi out select modal
var $midiOutModal=$("#midiOutSelM").modal({
    show: false
});
$("#divSetOutput").on("click", function() {
    $midiOutModal.modal("show");
});
$("#midiOutSelM").on("shown.bs.modal", function(event) {
    clearAllAlertMessageInModal("divMidiOutSelWarning");
    showMidiInOutSelM("divMidiOutSelWarning", "OUT");
});
$("#midiOutSelM").on("hidden.bs.modal", function(event) {
    clearAllAlertMessageInModal("divMidiOutSelWarning");
});

// midi in select modal
var $midiInModal=$("#midiInSelM").modal({
    show: false
});
$("#divSetInput").on("click", function() {
    $midiInModal.modal("show");
});
$("#midiInSelM").on("shown.bs.modal", function(event) {
    clearAllAlertMessageInModal("divMidiInSelWarning");
    showMidiInOutSelM("divMidiInSelWarning", "IN");
});
$("#midiInSelM").on("hidden.bs.modal", function(event) {
    clearAllAlertMessageInModal("divMidiInSelWarning");
});

function clearAllAlertMessageInModal(parentElem) {
    var messageInModal=document.getElementById(parentElem);
    while(messageInModal.firstChild) {
        messageInModal.removeChild(messageInModal.firstChild);
    }
}

function showMidiInOutSelM(elem, checkType) {
    var message="", className="", elemName="";
    switch(checkType) {
      case "IN":
        elemName="divSetInput";
        if(outputs.length<1) {
            message="Please Connect MIDI input devices to use.";
        } else {
            message="Select MIDI input device.";
            className="alert alert-info";
        }
        break;
      case "OUT":
        elemName="divSetOutput";
        if(outputs.length<1) {
            message="Please Connect MIDI output devices. This application needs at least one MIDI Device.";
            className="alert alert-danger";
        } else {
            message="Select MIDI output device.";
            className="alert alert-info";
        } 
        break;
    }

    if(message!="") {
        var divAlert=document.createElement("div");
        divAlert.className=className;
        divAlert.innerHTML=message;
        document.getElementById(elem).appendChild(divAlert);
    }
    var type="click";
    var e=document.createEvent('MouseEvent');
    var b=document.getElementById(elemName);
    e.initEvent(type, true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    b.dispatchEvent(e);
}

// virtual Keyboard
var fKey = new FlatKeyboard("keyboard");
var timerId = setInterval(function(){
    fKey.draw();
}, 80);
document.getElementById("keyboard").addEventListener("click", function(){
    if(fKey.connected==false) {
        if(typeof mOut!="object") {
            showMidiInOutSelM("divMidiOutSelWarning", "OUT", "resetAllController");
            return;
        }
    }
});

// sing mode
var singMode="inputtext"; // autodoremi
document.getElementById("inputTextMode").addEventListener("click", function(event){
    singMode="inputtext";
    document.getElementById("inputText").removeAttribute("disabled");
    document.getElementById("inputTextButton").removeAttribute("disabled");
    document.getElementById("modeName").innerHTML="<span class=\"glyphicon glyphicon-pencil\"></span> InputText</span>";

    // automatically send text
    var type="click";
    var e=document.createEvent('MouseEvent');
    var b=document.getElementById("inputTextButton");
    e.initEvent(type, true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    b.dispatchEvent(e);    
});
document.getElementById("autoDoremiMode").addEventListener("click", function(event){
    singMode="autodoremi";
    document.getElementById("inputText").setAttribute("disabled", "disabled");
    document.getElementById("inputTextButton").setAttribute("disabled", "disabled");
    document.getElementById("setletter").innerHTML=" --";
    document.getElementById("setletterSysx").innerHTML=" --";//●
    document.getElementById("setletterSysxHex").innerHTML=" --";//●
    document.getElementById("modeName").innerHTML="<span class=\"glyphicon glyphicon-music\"></span> DoReMi</span>";
});

// Web MIDI API
var midi;
var inputs, outputs;
var mIn, mOut;
navigator.requestMIDIAccess( { sysex: true } ).then( scb, ecb );

function scb(access){
    var midi=access;
    /*
    inputs=midi.inputs();
    outputs=midi.outputs();
    */

    //ここから 追加
    if (typeof midi.inputs === "function") {
        inputs=midi.inputs();
        outputs=midi.outputs();
    } else {
        var inputIterator = midi.inputs.values();
        inputs = [];
        for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
            inputs.push(o.value)
        }
        var outputIterator = midi.outputs.values();
        outputs = [];
        for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
            outputs.push(o.value)
        }
    }
    //ここまで

    // MIDI IN
    var mi=document.getElementById("midiInSel");
    for(var i=0; i<inputs.length; i++) {
        // in modal
        mi.options[i]=new Option(inputs[i]["name"], i);

        document.getElementById("midiInSelB").addEventListener("click", function(){
            var selIdx=document.getElementById("midiInSel").selectedIndex;
            mIn = inputs[selIdx];
            $("#midiInSelM").modal("hide");
            document.getElementById("setInput").innerHTML=inputs[selIdx].name;
            document.getElementById("divSetInput").style.setProperty("background-color", "#5cb85c");
            document.getElementById("divSetInput").style.setProperty("border-color", "#5cb8af");
            document.getElementById("divSetInput").style.setProperty("color", "#ffffff");
            
            mIn.onmidimessage=function(event) {
                if(typeof mOut=="object") {
                    if(event.data[0]==0x80 || event.data[0]==0x90) {
                        fKey.onmessage(event.data);
                    }
                    switch(singMode) {
                      case "inputtext":
                        mOut.send(event.data);
                        break;
                      case "autodoremi":
                        if(event.data[0]==0x80 || event.data[0]==0x90) {
                            var w=nsx1.getSysExByNoteNo(event.data[1]);
                            mOut.send(w[0]);
                            switch(w[1]) {
                              case 'n':
                                var now=window.performance.now()+2;
                                mOut.send(event.data, now);
                                break;
                              case 's':
                                var now=window.performance.now()+2;
                                mOut.send(event.data, now);
                                mOut.send([event.data[0], event.data[1], 0x00], now+100); //note off
                                mOut.send(event.data, now+100);
                                mOut.send([event.data[0], event.data[1], 0x00], now+300); //note off
                                mOut.send(event.data, now+300);
                                break;
                            }
                        } else {
                            mOut.send(event.data);
                        }
                        break;
                    }
                }
            };
        });
    }
    
    
    // MIDI OUT
    var mo=document.getElementById("midiOutSel");
    for(var i=0; i<outputs.length; i++) {
        // in modal
        mo.options[i]=new Option(outputs[i]["name"], i);
    }
    for(var i=0; i<outputs.length; i++) {
      if(mo.options[i].text.match(/NSX-39|eVY1/)){
        mo.options.selectedIndex = i;
      }
    }
    // set device in modal
    document.getElementById("midiOutSelB").addEventListener("click", function(){
        var selIdx=document.getElementById("midiOutSel").selectedIndex;
        selectMidiOut(selIdx);
        $("#midiOutSelM").modal("hide");

        // send word
        var type="click";
        var e=document.createEvent('MouseEvent');
        var b=document.getElementById("inputTextButton");
        e.initEvent(type, true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        b.dispatchEvent(e);
        
        // virtual keyboard
        fKey.setConnected(); 
        fKey.noteOn=function(noteNo) {
            var now=window.performance.now()+30;
            switch(singMode) {
              case "inputtext":
                mOut.send([0x90, noteNo, 0x7f]);
                break;
              case "autodoremi":
                var w=nsx1.getSysExByNoteNo(noteNo);
                mOut.send(w[0]);
                switch(w[1]) {
                  case 'n':
                    mOut.send([0x90, noteNo, 0x7f], now);
                    break;
                  case 's':
                    mOut.send([0x90, noteNo, 0x7f], now);
                    mOut.send([0x90, noteNo, 0x00], now+100); //note off
                    mOut.send([0x90, noteNo, 0x7f], now+100);
                    mOut.send([0x90, noteNo, 0x00], now+300); //note off
                    mOut.send([0x90, noteNo, 0x7f], now+300);
                    break;
                }
                break;
            }
            
        };
        fKey.noteOff=function(noteNo) {
            var now=window.performance.now();
            //mOut.send([0x80, noteNo, 0x00], now+200);
            mOut.send([0x80, noteNo, 0x00]);  // ■Chrome 66 暫定対応 2018/05/09
        };
    });
    
    // send text to NSX-1
    document.getElementById("inputTextButton").addEventListener("click", function(){

        /* ●出力存在チェック  外す
        // check whether midi out is set or not
        if(typeof mOut!="object") {
            showMidiInOutSelM("divMidiOutSelWarning", "OUT", "resetAllController");
            return;
        }
        */

        var text=document.getElementById("inputText").value;
        var sysEx=nsx1.getSysExByText(text);//   console.log(sysEx);//●配列

        //●nsx39
        var slotNum;
        if($("#visibleValue").text() == "slot"){
           slotNum = 0;
        } else {
           console.log("#visibleValue: " + $("#visibleValue").text());
           slotNum = parseInt($("#visibleValue").text(),10);
        }

        //console.log("Slot Number: " + slotNum);
        var sysEx39=nsx39.getUpdateSysExByText(text, 0, true);
        var sysEx39c = Array();
            sysEx39c[0] = sysEx39["sysEx"];
            sysEx39c[0][6] = slotNum;



        //●元のやつ
        var now=window.performance.now();
        for(var i=0; i<sysEx.length; i++) {

            if(typeof mOut=="object") { //●出力存在チェック追加
              mOut.send(sysEx[i], now+i*20);//●＊10
            }
            var s16="";
            for(var j=0; j<sysEx[i].length; j++) {
                s16 = s16 + " " + ("0" + sysEx[i][j].toString(16).toUpperCase()).substr(-2);
            }
            //console.log("sysExorg: " + sysEx);//console.log(sysEx);
            //console.log("s16org: " + s16);
        }

        //●39 
        var now=window.performance.now();
        for(var i=0; i<sysEx39c.length; i++) {// console.log(sysEx39c.length);
            if(typeof mOut=="object") { //●出力存在チェック
              //mOut.send(sysEx39c[i], now+i*20);//●＊10
              mOut.send(sysEx39c[i]);//●＊10  －－－－－－－－－－－－－－－－ ■Chrome 66対応 2018/05/09
            }
            var s16_39="";
            for(var j=0; j<sysEx39c[i].length; j++) {
                s16_39 = s16_39 + " " + ("0" + sysEx39c[i][j].toString(16).toUpperCase()).substr(-2);
            }
            //console.log("sysEx39c: " + sysEx39c);
            //console.log("s16_39: " + s16_39);
        }

        document.getElementById("setletter").innerHTML=text;
        document.getElementById("setletterSysx").value=sysEx;//●Sysex表示
        document.getElementById("setletterSysxHex").value=s16;//●Sysex16進数表示
        document.getElementById("setletterSysx39").value=sysEx39c;//●Sysex表示
        document.getElementById("setletterSysxHex39").value=s16_39;//●Sysex16進数表示

    });

}
function selectMidiOut(selIdx) {
    mOut = outputs[selIdx];
    document.getElementById("setOutput").innerHTML=outputs[selIdx].name;
    document.getElementById("divSetOutput").style.setProperty("background-color", "#5cb85c");
    document.getElementById("divSetOutput").style.setProperty("border-color", "#5cb8af");
    document.getElementById("divSetOutput").style.setProperty("color", "#ffffff");
}

function ecb(msg) {
    console.log("[Error]", msg);
}

function midiInputEvent(event) {
    mOut.send(event.data);
}

document.getElementById("resetAllController").addEventListener("click", function(event){
    // check whether midi out is set or not
    if(typeof mOut!="object") {
        showMidiInOutSelM("divMidiOutSelWarning", "OUT", "resetAllController");
        return;
    }
    
    var msg=[ 0xB0, 0x79, 0x00 ];
    mOut.send( msg );

    var msg=[ 0xB0, 0x7B, 0x00 ];
    mOut.send( msg );

    var msg=[ 0xB0, 0x78, 0x00 ];
    mOut.send( msg );

});
