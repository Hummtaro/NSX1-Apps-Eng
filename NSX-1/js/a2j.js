var RomanLetter = [
	["A"   ,"a"     ,"あ"  ],	["I"   ,"i"     ,"い"  ],	["U"   ,"M"     ,"う"  ],	["E"    ,"e"    ,"え"  ],	["O"    ,"o"    ,"お"  ],
	["KA"  ,"k a"   ,"か"  ],	["KI"  ,"k' i"  ,"き"  ],	["KU"  ,"k M"   ,"く"  ],	["KE"   ,"k e"  ,"け"  ],	["KO"   ,"k o"  ,"こ"  ],
	["GA"  ,"g a"   ,"が"  ],	["GI"  ,"g' i"  ,"ぎ"  ],	["GU"  ,"g M"   ,"ぐ"  ],	["GE"   ,"g e"  ,"げ"  ],	["GO"   ,"g o"  ,"ご"  ],
	["SA"  ,"s a"   ,"さ"  ],	["SI"  ,"S i"   ,"し"  ],	["SU"  ,"s M"   ,"す"  ],	["SE"   ,"s e"  ,"せ"  ],	["SO"   ,"s o"  ,"そ"  ],
	["ZA"  ,"dz a"  ,"ざ"  ],	["ZI"  ,"dZ i"  ,"じ"  ],	["ZU"  ,"dz M"  ,"ず"  ],	["ZE"   ,"dz e" ,"ぜ"  ],	["ZO"   ,"dz o" ,"ぞ"  ],
	["TA"  ,"t a"   ,"た"  ],	["TI"  ,"tS i"  ,"ち"  ],	["TU"  ,"ts M"  ,"つ"  ],	["TE"   ,"t e"  ,"て"  ],	["TO"   ,"t o"  ,"と"  ],
	["DA"  ,"d a"   ,"だ"  ],	["DI"  ,"dZ i"  ,"ぢ"  ],	["DU"  ,"dz M"  ,"づ"  ],	["DE"   ,"d e"  ,"で"  ],	["DO"   ,"d o"  ,"ど"  ],
	["NA"  ,"n a"   ,"な"  ],	["NI"  ,"J i"   ,"に"  ],	["NU"  ,"n M"   ,"ぬ"  ],	["NE"   ,"n e"  ,"ね"  ],	["NO"   ,"n o"  ,"の"  ],
	["HA"  ,"h a"   ,"は"  ],	["HI"  ,"C i"   ,"ひ"  ],	["HU"  ,"p\\ M" ,"ふ"  ],	["HE"   ,"h e"  ,"へ"  ],	["HO"   ,"h o"  ,"ほ"  ],
	["BA"  ,"b a"   ,"ば"  ],	["BI"  ,"b' i"  ,"び"  ],	["BU"  ,"b M"   ,"ぶ"  ],	["BE"   ,"b e"  ,"べ"  ],	["BO"   ,"b o"  ,"ぼ"  ],
	["PA"  ,"p a"   ,"ぱ"  ],	["PI"  ,"p' i"  ,"ぴ"  ],	["PU"  ,"p M"   ,"ぷ"  ],	["PE"   ,"p e"  ,"ぺ"  ],	["PO"   ,"p o"  ,"ぽ"  ],
	["MA"  ,"m a"   ,"ま"  ],	["MI"  ,"m' i"  ,"み"  ],	["MU"  ,"m M"   ,"む"  ],	["ME"   ,"m e"  ,"め"  ],	["MO"   ,"m o"  ,"も"  ],
	["YA"  ,"j a"   ,"や"  ],								["YU"  ,"j M"   ,"ゆ"  ],	["YE"   ,"j e"  ,"いぇ"],	["YO"   ,"j o"  ,"よ"  ],
	["RA"  ,"4 a"   ,"ら"  ],	["RI"  ,"4' i"  ,"り"  ],	["RU"  ,"4 M"   ,"る"  ],	["RE"   ,"4 e"  ,"れ"  ],	["RO"   ,"4 o"  ,"ろ"  ],
	["WA"  ,"w a"   ,"わ"  ],	["WI"  ,"w i"   ,"うぃ"],								["WE"   ,"w e"  ,"うぇ"],	["WO"   ,"w o"  ,"うぉ"],
	["NN"  ,"N\\"   ,"ん"  ],	["MM"  ,"N\\"   ,"ん"  ],
	["KYA" ,"k' a"  ,"きゃ"],	["KYI" ,"k' i"  ,"き"  ],	["KYU" ,"k' M"  ,"きゅ"],	["KYE"  ,"k' e" ,"きぇ"],	["KYO"  ,"k' o" ,"きょ"],
	["GYA" ,"N' a"  ,"ぎゃ"],	["GYI" ,"g' i"  ,"ぎ"  ],	["GYU" ,"g' M"  ,"ぎゅ"],	["GYE"  ,"g' e" ,"ぎぇ"],	["GYO"  ,"N' o" ,"ぎょ"],
	["SYA" ,"S a"   ,"しゃ"],	["SYI" ,"S i"   ,"し"  ],	["SYU" ,"S M"   ,"しゅ"],	["SYE"  ,"S e"  ,"しぇ"],	["SYO"  ,"S o"  ,"しょ"],
	["TYA" ,"tS a"  ,"ちゃ"],	["TYI" ,"tS i"  ,"ち  "],	["TYU" ,"tS M"  ,"ちゅ"],	["TYE"  ,"tS e" ,"ちぇ"],	["TYO"  ,"tS o" ,"ちょ"],
	["ZYA" ,"dZ a"  ,"じゃ"],	["ZYI" ,"dZ i"  ,"じ"  ],	["ZYU" ,"dZ M"  ,"じゅ" ],	["ZYE"  ,"dZ e" ,"じぇ"],	["ZYO"  ,"dZ o" ,"じょ"],
	["DYA" ,"dZ a"  ,"ぢゃ"],	["DYI" ,"dZ i"  ,"ぢ"  ],	["DYU" ,"dZ M"  ,"ぢゅ" ],	["DYE"  ,"dZ e" ,"ぢぇ"],	["DYO"  ,"dZ o" ,"ぢょ"],
	["TJA" ,"t' a"  ,"てゃ"],	["TJI" ,"t' i"  ,"てぃ"],	["TJU" ,"t' M"  ,"てゅ"],	["TJE"  ,"t' e" ,"てぇ"],	["TJO"  ,"t' o" ,"てょ"],
	["DJA" ,"d' a"  ,"でゃ"],	["DJI" ,"d' i"  ,"でぃ"],	["DJU" ,"d' M"  ,"でゅ"],	["DJE"  ,"d' e" ,"でぇ"],	["DJO"  ,"d' o" ,"でょ"],
	["NYA" ,"J a"   ,"にゃ"],	["NYI" ,"J i"   ,"に"  ],	["NYU" ,"J M"   ,"にゅ"],	["NYE"  ,"J e"  ,"にぇ"],	["NYO"  ,"J o"  ,"にょ"],
	["HYA" ,"C a"   ,"ひゃ"],	["HYI" ,"C i"   ,"ひ"  ],	["HYU" ,"C M"   ,"ひゅ"],	["HYE"  ,"C e"  ,"ひぇ"],	["HYO"  ,"C o"  ,"ひょ"],
	["BYA" ,"b' a"  ,"びゃ"],	["BYI" ,"b' i"  ,"び"  ],	["BYU" ,"b' M"  ,"びゅ"],	["BYE"  ,"b' e" ,"びぇ"],	["BYO"  ,"b' o" ,"びょ"],
	["PYA" ,"p' a"  ,"ぴゃ"],	["PYI" ,"p' i"  ,"ぴ"  ],	["PYU" ,"p' M"  ,"ぴゅ"],	["PYE"  ,"p' e" ,"ぴぇ"],	["PYO"  ,"p' o" ,"ぴょ"],
	["FYA" ,"p\\' a","ふゃ"],								["FYU" ,"p\\' M","ふゅ"],								["FYO"  ,"C o"  ,"ふょ"],
	["MYA" ,"m' a"  ,"みゃ"],	["MYI" ,"m' i" ,"み"  ],	["MYU" ,"m' M"  ,"みゅ"],	["MYE"	,"m' e" ,"みぇ" ],	["MYO"  ,"m' o" ,"みょ"],
	["RYA" ,"4' a"  ,"りゃ"],	["RYI" ,"4' i" ,"り"  ],	["RYU" ,"4' M"  ,"りゅ"],	["RYE"  ,"4' e" ,"りぇ"],	["RYO"  ,"4' o" ,"りょ"],
	["SHA" ,"S a"   ,"しゃ"],	["SHI" ,"S i"  ,"し"  ],	["SHU" ,"S M"   ,"しゅ"],	["SHE"  ,"S e"  ,"しぇ"],	["SHO"  ,"S o"  ,"しょ"],
	["JA"  ,"dZ a"  ,"じゃ"],	["JI"  ,"dZ i" ,"じ"  ],	["JU"  ,"dZ M"  ,"じゅ"],	["JE"   ,"dZ e" ,"じぇ"],	["JO"   ,"dZ o" ,"じょ"],
	["CHA" ,"tS a"  ,"ちゃ"],	["CHI" ,"tS i" ,"ち"  ],	["CHU" ,"tS M"  ,"ちゅ"],	["CHE"  ,"tS e" ,"ちぇ"],	["CHO"  ,"tS o" ,"ちょ"],
	["TSA" ,"ts a"  ,"つぁ"],	["TSI" ,"ts i" ,"つぃ"],	["TSU" ,"ts M"  ,"つ"  ],	["TSE"  ,"ts e" ,"つぇ"],	["TSO"  ,"ts o" ,"つぉ"],
	["SWA" ,"s a"   ,"さ"  ],	["SWI" ,"s i"  ,"すぃ"],	["SWU" ,"s M"   ,"す"  ],	["SWE"  ,"s e"  ,"せ"  ],	["SWO"  ,"s o"  ,"そ"  ],
	["ZWA" ,"dz a"  ,"ざ"  ],	["ZWI" ,"dz i" ,"ずぃ"],	["ZWU" ,"dz M"  ,"ず"  ],	["ZWE"  ,"dz e" ,"ぜ"  ],	["ZWO"  ,"dz o" ,"ぞ"  ],
	["TWA" ,"t a"   ,"た"  ],	["TWI" ,"t' i" ,"てぃ"],	["TWU" ,"t M"   ,"とぅ"],	["TWE"  ,"t' e" ,"てぇ"],	["TWO"  ,"t o"  ,"と"  ],
	["DWA" ,"d a"   ,"だ"  ],	["DWI" ,"d' i" ,"でぃ"],	["DWU" ,"d M"   ,"どぅ"],	["DWE"  ,"d' e" ,"でぇ"],	["DWO"  ,"d o"  ,"ど"  ],
	["FA"  ,"p\\ a" ,"ふぁ"],	["FI"  ,"p\\' i","ふぃ"],	["FU"  ,"p\\ M" ,"ふ"  ],	["FE"   ,"p\\ e","ふぇ"],	["FO"   ,"p\\ o","ふぉ"],
	[0     ,0       ,0     ],
];

function ConvertCode( ttt ){
	var		ccc;
	var		i;
	var 	m_strKana = "";

	for( i = 0; ; i++ ){
		if( RomanLetter[i][0][0] == 0x00 ){
			ccc = "";
			m_strKana = "";
			break;
		}
		if( RomanLetter[i][0] == ttt ){
			ccc  = RomanLetter[i][1];
			m_strKana = RomanLetter[i][2];
			break;
		}
	}
	return m_strKana;
}

function a2j(str){
	var m_strRsltKana = "";
    var ttt = "";
	var len = str.length;
	for( var i=0; i<len; i++ ){
		// 1文字ずつ処理、大文字化する
		var rdt = str.charAt(i).toUpperCase();
		// アルファベットか判断
		if( rdt.match(/[a-z]/gi) ){
			ttt += rdt;
			// 母音なら変換、
			if( rdt.match(/[AIUEO]/gi) ){
				if( (uuu = ConvertCode( ttt )) != "" ){
					ttt  = "";
					m_strRsltKana += uuu;
				}
			}
			else if( (ttt == "NN") || (ttt == "MM") ){
				uuu = ConvertCode( ttt );
				ttt  = "";
				m_strRsltKana += uuu;
			}
		}
	}
//	document.write( m_strRsltKana );
	return m_strRsltKana;
}
