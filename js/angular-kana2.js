var kana = angular.module('kana', []);
var kanaChoice = 1;

kana.controller('myAppController', ['$scope', '$element', function ($scope,$element) {

	$scope.changeKana = function() {
		if (kanaChoice == 1)
			{kanaChoice=0;$element.text("a")}
		else
			{kanaChoice=1;$element.text("あ")}
		
	}

    
}]);



kana.directive('toKana', ['kanaService',  function (kanaService) {

    function linker(scope, element, attr, timeout) {
	var kana_input = angular.element(element[0].querySelector('.kana'));
	var kana_button = angular.element(element[0].querySelector('button'));


    kana_input.on('keyup', function (event) {

	    keyval = event.which;
	    if (keyval == 27) {
		    if (kanaChoice == 1) 
			{kanaChoice = 0;kana_button.text("a")}
		else
			{kanaChoice = 1;kana_button.text("あ")}
	    }
            if (kanaChoice == 1) 
                    conversionFunction = kanaService.toJapanese;
            else
                    conversionFunction = kanaService.toAlpha;
            
	    value = kana_input.val();
	    	    
	    if ((keyval > 46) || (keyval == 32) || (keyval == 13)){
		length = value.length;
		to_start = length - kana_input[0].selectionStart;
		to_end = length - kana_input[0].selectionEnd;
		console.log(length + " " + to_start + " "  + to_end);
		kana_input.val(conversionFunction(value));
		new_start = kana_input.val().length - to_start;
		new_end = kana_input.val().length - to_end;
		kana_input[0].setSelectionRange(new_start,new_end);
		console.log(kanaService.kataToHira(kana_input.val()));
		}
	    
        });
    }

    return {
        link: linker,
        restrict: 'A',
        scope: {
            'toKana': '='
        }
    };
}])

// Based on node-bulk-replace (https://github.com/jeresig/node-bulk-replace/blob/master/bulk-replace.js)
kana.factory('bulkReplace', function () {
    return {
        replace: function (str, regex, map) {
            if (arguments.length === 2) {
                map = regex;
                regex = new RegExp(Object.keys(map).join(), "ig");
            }

            return str.replace(regex, function (all) {
                if (all in map) {
                    return map[all];
                }

                return all;
            });
        }
    };
});


// Based on hepburn (https://github.com/lovell/hepburn)
kana.factory('kanaService', ['bulkReplace', function (bulkReplace) {
   var half2kanaGraphs = {
	"ｧ": "ァ","ｨ": "ィ","ｩ": "ゥ","ｪ": "ェ","ｫ": "ォ","ｬ": "ャ","ｭ": "ュ","ｮ": "ョ","ｯ": "ッ",
	"ｰ": "ー",
	"ｱ": "ア","ｲ": "イ","ｳ": "ウ","ｴ": "エ","ｵ": "オ",
	"ｶ": "カ","ｷ": "キ","ｸ": "ク","ｹ": "ケ","ｺ": "コ",
	"ｻ": "サ","ｼ": "シ","ｽ": "ス","ｾ": "セ","ｿ": "ソ",
	"ﾀ": "タ","ﾁ": "チ","ﾂ": "ツ","ﾃ": "テ","ﾄ": "ト",
	"ﾅ": "ナ","ﾆ": "ニ","ﾇ": "ヌ","ﾈ": "ネ","ﾉ": "ノ",
	"ﾊ": "ハ","ﾋ": "ヒ","ﾌ": "フ","ﾍ": "ヘ","ﾎ": "ホ",
	"ﾏ": "マ","ﾐ": "ミ","ﾑ": "ム","ﾒ": "メ","ﾓ": "モ",
	"ﾔ": "ヤ","ﾕ": "ユ" ,"ﾖ": "ヨ",
	"ﾗ": "ラ","ﾘ": "リ","ﾙ": "ル","ﾚ": "レ","ﾛ": "ロ",
	"ﾜ": "ワ" ,"ｦ": "ヲ",
	"ﾝ": "ン",
	"ｶﾞ": "ガ","ｷﾞ": "ギ","ｸﾞ": "グ","ｹﾞ": "ゲ","ｺﾞ": "ゴ",
	"ｻﾞ": "ザ","ｼﾞ": "ジ","ｽﾞ": "ズ","ｾﾞ": "ゼ","ｿﾞ": "ゾ",
	"ﾀﾞ": "ダ","ﾁﾞ": "ヂ","ﾂﾞ": "ヅ","ﾃﾞ": "デ","ﾄﾞ": "ド",
	"ﾊﾞ": "バ","ﾋﾞ": "ビ","ﾌﾞ": "ブ","ﾍﾞ": "ベ","ﾎﾞ": "ボ",
	"ﾊﾟ": "パ","ﾋﾟ": "ピ","ﾌﾟ": "プ","ﾍﾟ": "ペ","ﾎﾟ": "ポ",
	"ｩﾞ": "ヴ"
	};

  var half2kanaMap = {};

Object.keys(half2kanaGraphs).forEach(function (key) {
        var value = half2kanaGraphs[key];

        if (!(key in half2kanaMap)) {
            half2kanaMap[key] = value;
        }
    });
    
   var kana2halfGraphs = {
	"ァ": "ｧ","ィ": "ｨ","ゥ": "ｩ","ェ": "ｪ","ォ": "ｫ","ャ": "ｬ","ュ": "ｭ","ョ": "ｮ","ッ": "ｯ",
	"ー": "ｰ",
	"ア": "ｱ","イ": "ｲ","ウ": "ｳ","エ": "ｴ","オ": "ｵ",
	"カ": "ｶ","キ": "ｷ","ク": "ｸ","ケ": "ｹ","コ": "ｺ",
	"サ": "ｻ","シ": "ｼ","ス": "ｽ","セ": "ｾ","ソ": "ｿ",
	"ﾀ": "タ","ﾁ": "チ","ﾂ": "ツ","ﾃ": "テ","ﾄ": "ト",
	"ナ": "ﾅ","ニ": "ﾆ","ヌ": "ﾇ","ネ": "ﾈ","ノ": "ﾉ",
	"ハ": "ﾊ","ヒ": "ﾋ","フ": "ﾌ","ヘ": "ﾍ","ホ": "ﾎ",
	"マ": "ﾏ","ミ": "ﾐ","ム": "ﾑ","メ": "ﾒ","モ": "ﾓ",
	"ヤ": "ﾔ","ユ": "ﾕ","ヨ": "ﾖ",
	"ラ": "ﾗ","リ": "ﾘ","ル": "ﾙ","レ": "ﾚ","ロ": "ﾛ",
	"ワ": "ﾜ" ,"ヲ": "ｦ",
	"ン": "ﾝ",
	"ガ": "ｶﾞ","ギ": "ｷﾞ","グ": "ｸﾞ","ゲ": "ｹﾞ","ゴ": "ｺﾞ",
	"ザ": "ｻﾞ","ジ": "ｼﾞ","ズ": "ｽﾞ","ゼ": "ｾﾞ","ゾ": "ｿﾞ",
	"ダ": "ﾀﾞ","ヂ": "ﾁﾞ","ヅ": "ﾂﾞ","デ": "ﾃﾞ","ド": "ﾄﾞ",
	"バ": "ﾊﾞ","ビ": "ﾋﾞ","ブ": "ﾌﾞ","ベ": "ﾍﾞ","ボ": "ﾎﾞ",
	"パ": "ﾊﾟ","ピ": "ﾋﾟ","プ": "ﾌﾟ","ペ": "ﾍﾟ","ポ": "ﾎﾟ",
	"ヴ": "ｩﾞ"
	};

  var kana2halfMap = {};

Object.keys(kana2halfGraphs).forEach(function (key) {
        var value = kana2halfGraphs[key];

        if (!(key in kana2halfMap)) {
            kana2halfMap[key] = value;
        }
    });
	
   var romajiGraphs = {
	"あ":"a","い":"i","う":"u","え":"e","お":"o",
	"か":"ka","き":"ki","く":"ku", "け":"ke","こ":"ko",
	"さ":"sa","し":"shi","す":"su","せ":"se", "そ":"so",
	"た":"ta", "ち":"chi","つ":"tsu","て":"te","と":"to",
	"な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no",
	"は":"ha","ひ":"hi","ふ":"fu","ふ":"hu","へ":"he","ほ":"ho",
	"ま":"ma","み":"mi","む":"mu","め":"me","も":"mo",
	"や":"ya","ゆ":"yu","よ":"yo", "いぃ": "yi", "いぇ": "ye",
	"ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro",
	"わ":"wa","ゐ":"wi","ゑ":"we","を":"wo","ん":"n'",
	"が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go",
	"ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo",
	"だ":"da","ぢ":"dji","づ":"dzu","で":"de","ど":"do",
	"ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo",
	"ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po",
	"ゔ":"vu",
	"ぁ":"a","ぃ":"i","ぅ":"u","ぇ":"e","ぉ":"o",
	"ゕ":"ka","ゖ":"ke",
	"ゃ":"ya","ゅ":"yu","ょ":"yo",
	"きゃ":"kya","きゅ":"kyu","きょ":"kyo", "きぇ": "kye",
	"しゃ":"sha","しゅ":"shu","しょ":"sho", "しぇ":"she",
	"ちゃ":"cha","ちゅ":"chu","ちょ":"cho", "ちぇ":"che",
	"にゃ":"nya","にゅ":"nyu","にょ":"nyo", "にぇ": "nye",
	"ひゃ":"hya","ひゅ":"hyu","ひょ":"hyo", "ひぇ": "hye", "ほぅ": "hu",
	"みゃ":"mya","みゅ":"myu","みょ":"myo", "みぇ": "mye",
	"りゃ":"rya","りゅ":"ryu","りょ":"ryo", "りぇ": "rye",
	"ぎゃ":"gya","ぎゅ":"gyu","ぎょ":"gyo", "ぎぇ": "gye",
	"じゃ":"ja","じゅ":"ju","じょ":"jo", "じぇ":"je",
	"びゃ":"bya","びゅ":"byu","びょ":"byo", "びぇ": "bye",
	"ぴゃ":"pya","ぴゅ":"pyu","ぴょ":"pyo", "ぴぇ": "pye",
	"ゔぁ":"va","ゔぃ":"vi","ゔぇ":"ve","ゔぉ":"vo",
	"ゔゃ":"vya","ゔゅ":"vyu","ゔぃぇ":"vye","ゔょ":"vyo",
	"つぁ":"tsa","つぃ":"tsi","つゅ":"tsyu","つぇ":"tse","つぉ":"tso",
	"づぁ":"dzwa","づぃ":"dzwi","づぇ":"dzwe","づぉ":"dzwo",
	"すぁ":"swa","すぃ":"swi","すぇ":"swe","すぉ":"swo",
	"ずぁ":"zwa","ずぃ":"zwi","ずぇ":"zwe","ずぉ":"zwo",
	"でゃ":"dya","でぃ":"di","でゅ":"dyu","でぇ":"dye","でょ":"dyo",
	"とぅ":"tu",
	"てゃ":"tya","てぃ":"ti","てゅ":"tyu","てぇ":"tye","てょ":"tyo",
	"すぃ": "si",
	"ずぃ":"zi",
	"ふぁ":"fa","ふぃ":"fi","ふぇ":"fe","ふぉ":"fo",
	"ふゃ": "fya", "ふゅ": "fyu", "ふぃぇ": "fye", "ふょ": "fyo",
	"くゎ":"kwa", "くぃ": "kwi", "くぇ": "kwe", "くぉ": "kwo",
	"ぐゎ":"gwa", "ぐぃ": "gwi", "ぐぇ": "gwe", "ぐぉ": "gwo",
	"ア":"A","イ":"I","ウ":"U","エ":"E","オ":"O",
	"カ":"KA","キ":"KI","ク":"KU","ケ":"KE","コ":"KO",
	"サ":"SA","シ":"SHI","ス":"SU","セ":"SE","ソ":"SO",
	"タ":"TA","チ":"CHI","ツ":"TSU","テ":"TE","ト":"TO",
	"ナ":"NA","ニ":"NI","ヌ":"NU","ネ":"NE","ノ":"NO",
	"ハ":"HA","ヒ":"HI","フ":"FU","ヘ":"HE","ホ":"HO",
	"マ":"MA","ミ":"MI","ム":"MU","メ":"ME","モ":"MO",
	"ヤ":"YA","ヨ":"YO","ユ":"YU", "イィ": "YI", "イェ": "YE",
	"ラ":"RA","リ":"RI","ル":"RU","レ":"RE","ロ":"RO",
	"ワ":"WA","ヰ":"WI","ヱ":"WE","ヲ":"WO",
	"ガ":"GA","ギ":"GI","グ":"GU","ゲ":"GE","ゴ":"GO",
	"ザ":"ZA","ジ":"JI","ズ":"ZU","ゼ":"ZE","ゾ":"ZO",
	"ダ":"DA","ヂ":"DJI","ヅ":"DZU","デ":"DE","ド":"DO",
	"バ":"BA","ビ":"BI","ブ":"BU","ベ":"BE","ボ":"BO",
	"パ":"PA","ピ":"PI","プ":"PU","ペ":"PE","ポ":"PO",
	"ヷ":"VA","ヸ":"VI","ヹ":"VE","ヺ":"VO",
	"ヴ":"VU",
	"ァ":"A","ィ":"I","ゥ":"U","ェ":"E","ォ":"O",
	"ヵ":"KA","ヶ":"KE",
	"ャ":"YA","ュ":"YU","ョ":"YO",
	"キョ":"KYO","キュ":"KYU","キャ":"KYA", "キェ": "KYE",
	"ショ":"SHO","シュ":"SHU","シャ":"SHA", "シェ":"SHE",
	"チョ":"CHO","チュ":"CHU","チャ":"CHA", "チェ":"CHE",
	"ニョ":"NYO","ニュ":"NYU","ニャ":"NYA", "ニェ": "NYE",
	"ヒョ":"HYO","ヒュ":"HYU","ヒャ":"HYA", "ヒェ": "HYE",
	"ミョ":"MYO","ミュ":"MYU","ミャ":"MYA", "ミェ": "MYE",
	"リョ":"RYO","リュ":"RYU","リャ":"RYA", "リェ": "RYE",
	"ギョ":"GYO","ギュ":"GYU","ギャ":"GYA", "ギェ": "GYE",
	"ジョ":"JO","ジュ":"JU","ジャ":"JA", "ジェ":"JE",
	"ビョ":"BYO","ビュ":"BYU","ビャ":"BYA", "ビェ": "BYE",
	"ピョ":"PYO","ピュ":"PYU","ピャ":"PYA", "ピェ": "PYE",
	"ヴァ":"VA","ヴィ":"VI","ヴェ":"VE","ヴォ":"VO",
	"ヴャ":"VYA","ヴュ":"VYU","ヴィェ":"VYE","ヴョ":"VYO",
	"ツァ":"TSA","ツィ":"TSI","ツュ":"TSYU","ツェ":"TSE","ツォ":"TSO",
	"デャ":"DYA","デュ":"DYU","デェ":"DYE","デョ":"DYO",
	"ティ":"TI","トゥ":"TU",
	"テャ":"TYA","テュ":"TYU","テェ":"TYE","テョ":"TYO",
	"クヮ":"KWA",  "クィ":"KWI", "クェ":"KWE","クォ":"KWO",
	"グヮ":"GWA","グィ":"GWI", "グェ":"GWE", "グォ":"GWO",
	"ディ":"DI","ドゥ":"DU",
	"ファ":"FA","フィ":"FI","フェ":"FE","フォ":"FO",
	"フャ":"FYA", "フュ":"FYU", "フィェ":"FYE", "フョ":"FYO",
	"ズィ":"ZI",
	"ヅァ":"DZWA","ヅィ":"DZWI","ヅェ":"DZWE","ヅォ":"DZWO",
	"スァ":"SWA","スィ":"SWI","スェ":"SWE","スォ":"SWO",
	"ズァ":"ZWA","ズィ":"ZWI","ズェ":"ZWE","ズォ":"ZWO",
	"ウィ": "WI", "ウゥ": "WU", "ウェ": "WE", "ウォ": "WO", "ウュ": "WYU",
	"ー":"-",
	"ン":"N'",
	"　":" ",
	"「":" ‹ ",
	"」":" › ",
	"『":" « ",
	"』":" » ",
	"、":", ","。":". ","〃":"\"",
	"【":" (","】":") ",
	"〈":" <","〉":"> ","〔":" {","〕":"} "
	};
	
    var romajiMap = {};

Object.keys(romajiGraphs).forEach(function (key) {
        var value = romajiGraphs[key];

        if (!(key in romajiMap)) {
            romajiMap[key] = value;
        }
    });
    
    var regulRomaji = {
	 "aa":"ā","A-":"Ā","AA":"Ā",
	 "ee":"ē","E-":"Ē","EE":"Ē",
	 "ii":"ī","I-":"Ī","II":"Ī",
	 "ou":"ō","oo":"ō","O-":"Ō","OO":"Ō","OU":"Ō",
	 "uu":"ū","U-":"Ū","UU":"Ū"
	 }; 
    var regul2Map = {};

Object.keys(regulRomaji).forEach(function (key) {
        var value = regulRomaji[key];

        if (!(key in regul2Map)) {
            regul2Map[key] = value;
        }
    });
 
  var regul2Regex = new RegExp(Object.keys(regul2Map).sort(function(a, b) {
        return b.length - a.length;
    }).join("|"), "g");
    
  var romajiRegex = new RegExp(Object.keys(romajiMap).sort(function(a, b) {
        return b.length - a.length;
    }).join("|"), "g");
    
    var japaneseGraphs = {
        "a": "あ", "i": "い", "u": "う", "e": "え", "o": "お",
        "ka": "か", "ki": "き", "ku": "く", "ke": "け", "ko": "こ",
        "sa": "さ", "shi": "し", "su": "す", "se": "せ", "so": "そ",
        "ta": "た", "chi": "ち", "tsu": "つ", "te": "て", "to": "と",
        "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね", "no": "の",
        "ha": "は", "hi": "ひ", "fu": "ふ", "hu": "ふ", "he": "へ", "ho": "ほ",
        "ma": "ま", "mi": "み", "mu": "む", "me": "め", "mo": "も",
        "ya": "や", "yu": "ゆ", "yo": "よ", "yi": "いぃ", "ye": "いぇ",
        "ra": "ら", "ri": "り", "ru": "る", "re": "れ", "ro": "ろ",
	"la": "ら", "li": "り", "lu": "る", "le": "れ", "lo": "ろ",
        "wa": "わ", "wi": "ゐ", "we": "ゑ", "wo": "を",
        "ga": "が", "gi": "ぎ", "gu": "ぐ", "ge": "げ", "go": "ご",
        "za": "ざ", "ji": "じ", "zu": "ず", "ze": "ぜ", "zo": "ぞ",
        "da": "だ", "dji": "ぢ", "dzu": "づ", "de": "で", "do": "ど",
        "ba": "ば", "bi": "び", "bu": "ぶ", "be": "べ", "bo": "ぼ",
        "pa": "ぱ", "pi": "ぴ", "pu": "ぷ", "pe": "ぺ", "po": "ぽ",
	"vu": "ゔ",
	"xa": "ぁ", "xi": "ぃ","xu": "ぅ", "xe": "ぇ", "xo": "ぉ",
	"xka": "ゕ", "xke": "ゖ",
	"xya": "ゃ", "xyu": "ゅ", "xyo": "ょ",
	"xtsu": "っ",
	"kya": "きゃ", "kyu": "きゅ", "kyo": "きょ", "kye": "きぇ",
        "sha": "しゃ", "shu": "しゅ", "sho": "しょ", "she": "しぇ",
        "cha": "ちゃ", "chu": "ちゅ", "cho": "ちょ", "che": "ちぇ",
        "nya": "にゃ", "nyu": "にゅ", "nyo": "にょ", "nye": "にぇ",
        "hya": "ひゃ", "hyu": "ひゅ", "hyo": "ひょ", "hye": "ひぇ",
	"hu": "ほぅ",
        "mya": "みゃ", "myu": "みゅ", "myo": "みょ", "mye": "みぇ",
        "rya": "りゃ", "ryu": "りゅ", "ryo": "りょ", "rye": "りぇ",
	"lya": "りゃ", "lyu": "りゅ", "lyo": "りょ", "lye": "りぇ",
        "gya": "ぎゃ", "gyu": "ぎゅ", "gyo": "ぎょ", "gye": "ぎぇ",
        "ja": "じゃ", "ju": "じゅ", "jo": "じょ", "je": "じぇ",
        "bya": "びゃ", "byu": "びゅ", "byo": "びょ", "bye": "びぇ",
        "pya": "ぴゃ", "pyu": "ぴゅ", "pyo": "ぴょ", "pye": "ぴぇ",
	"va": "ゔぁ", "vi": "ゔぃ", "ve": "ゔぇ", "vo": "ゔぉ",
	"vya": "ゔゃ", "vyu": "ゔゅ", "vye": "ゔぃぇ", "vyo": "ゔょ",
	"tsa": "つぁ", "tsi": "つぃ", "tsyu": "つゅ", "tse": "つぇ", "tso": "つぉ",
	"dzwa": "づぁ", "dzwi": "づぃ", "dzwe": "づぇ", "dzwo": "づぉ",
	"swa": "すぁ", "swi": "すぃ", "swe": "すぇ", "swo": "すぉ",
	"zwa": "ずぁ", "zwi": "ずぃ", "zwe": "ずぇ", "zwo": "ずぉ",
	"dya": "でゃ", "di": "でぃ", "dyu": "でゅ", "dye": "でぇ", "dyo": "でょ",
	"tu": "とぅ",
	"tya": "てゃ", "ti": "てぃ", "tyu": "てゅ", "tye": "てぇ", "tyo": "てょ",
	"si": "すぃ",
	"zi": "ずぃ",
	"fa": "ふぁ", "fi": "ふぃ", "fe": "ふぇ", "fo": "ふぉ",
	"fya": "ふゃ", "fyu": "ふゅ", "fye": "ふぃぇ", "fyo": "ふょ",
	"kwa": "くゎ", "kwi": "くぃ", "kwe": "くぇ", "kwo": "くぉ",
	"gwa": "ぐゎ", "gwi": "ぐぃ", "gwe": "ぐぇ", "gwo": "ぐぉ",
	
	"A": "ア", "I": "イ", "U": "ウ", "E": "エ", "O": "オ",
        "KA": "カ", "KI": "キ", "KU": "ク", "KE": "ケ", "KO": "コ",
        "SA": "サ", "SHI": "シ", "SU": "ス",  "SE": "セ", "SO": "ソ",
        "TA": "タ", "CHI": "チ", "TSU": "ツ", "TE": "テ", "TO": "ト",
        "NA": "ナ", "NI": "ニ", "NU": "ヌ", "NE": "ネ", "NO": "ノ",
        "HA": "ハ", "HI": "ヒ", "FU": "フ", "HE": "ヘ", "HO": "ホ",
        "MA": "マ", "MI": "ミ", "MU": "ム", "ME": "メ", "MO": "モ",
        "YA": "ヤ", "YO": "ヨ", "YU": "ユ", "YI": "イィ", "YE": "イェ",
        "RA": "ラ", "RI": "リ", "RU": "ル",  "RE": "レ", "RO": "ロ",
	"LA": "ラ", "LI": "リ", "LU": "ル",  "LE": "レ", "LO": "ロ",
        "WA": "ワ", "WI": "ヰ", "WE": "ヱ", "WO": "ヲ",
        "GA": "ガ", "GI": "ギ", "GU": "グ", "GE": "ゲ", "GO": "ゴ",
        "ZA": "ザ", "JI": "ジ", "ZU": "ズ", "ZE": "ゼ", "ZO": "ゾ",
        "DA": "ダ", "DJI": "ヂ", "DZU": "ヅ", "DE": "デ", "DO": "ド",
        "BA": "バ", "BI": "ビ", "BU": "ブ", "BE": "ベ", "BO": "ボ",
        "PA": "パ", "PI": "ピ", "PU": "プ", "PE": "ペ", "PO": "ポ",
	"Va": "ヷ", "Vi": "ヸ", "Ve": "ヹ", "Vo": "ヺ",
	"VU": "ヴ",
	"XA": "ァ", "XI": "ィ","XU": "ゥ", "XE": "ェ", "XO": "ォ",
	"XKA": "ヵ", "XKE": "ヶ",
	"XYA": "ャ", "XYU": "ュ", "XYO": "ョ",
	"XTSU": "ッ",
	"KYO": "キョ", "KYU": "キュ", "KYA": "キャ","KYE": "キェ",
        "SHO": "ショ", "SHU": "シュ", "SHA": "シャ", "SHE": "シェ",
        "CHO": "チョ", "CHU": "チュ", "CHA": "チャ", "CHE": "チェ",
        "NYO": "ニョ", "NYU": "ニュ", "NYA": "ニャ", "NYE": "ニェ",
        "HYO": "ヒョ", "HYU": "ヒュ", "HYA": "ヒャ", "HYE": "ヒェ",
        "MYO": "ミョ", "MYU": "ミュ", "MYA": "ミャ", "MYE": "ミェ",
        "RYO": "リョ", "RYU": "リュ", "RYA": "リャ", "RYE": "リェ",
	"LYO": "リョ", "LYU": "リュ", "LYA": "リャ", "LYE": "リェ",
        "GYO": "ギョ", "GYU": "ギュ", "GYA": "ギャ", "GYE": "ギェ",
        "JO": "ジョ", "JU": "ジュ", "JA": "ジャ", "JE": "ジェ",
        "BYO": "ビョ", "BYU": "ビュ", "BYA": "ビャ", "BYE": "ビェ",
        "PYO": "ピョ", "PYU": "ピュ", "PYA": "ピャ", "PYE": "ピェ",
	"VA": "ヴァ", "VI": "ヴィ", "VE": "ヴェ", "VO": "ヴォ",
	"VYA": "ヴャ", "VYU": "ヴュ", "VYE": "ヴィェ", "VYO": "ヴョ",
	"Wi": "ウィ", "Wu": "ウゥ", "We": "ウェ", "Wo": "ウォ", "Wyu": "ウュ",
	"TSA": "ツァ", "TSI": "ツィ", "TSYU": "ツュ", "TSE": "ツェ", "TSO": "ツォ",
	"DYA": "デャ","DYU": "デュ", "DYE": "デェ", "DYO": "デョ",
	"TI": "ティ", "TU": "トゥ",
	"TYA": "テャ","TYU": "テュ", "TYE": "テェ", "TYO": "テョ",
	"KWA": "クヮ", "KWI": "クィ", "KWE": "クェ","KWO": "クォ",
	"GWA": "グヮ","GWI": "グィ", "GWE": "グェ", "GWO": "グォ",
	"DI": "ディ", "DU": "ドゥ",
	"FA": "ファ", "FI": "フィ", "FE": "フェ", "FO": "フォ",
	"FYA": "フャ", "FYU": "フュ", "FYE": "フィェ", "FYO": "フョ",
	"HU": "ホゥ",
	"SI": "スィ",
	"ZI": "ズィ",
	"DZWA": "ヅァ", "DZWI": "ヅィ", "DZWE": "ヅェ", "DZWO": "ヅォ",
	"SWA": "スァ", "SWI": "スィ", "SWE": "スェ", "SWO": "スォ",
	"ZWA": "ズァ", "ZWI": "ズィ", "ZWE": "ズェ", "ZWO": "ズォ",
	"-": "ー",
	"NN": "ン",
	"N＇": "ン",
	"n＇": "ん",
	"nn": "ん",
	"n ": "ん",
	"N ": "ン",
	" ": "　", ",": "、", ".": "。", "×": "・", "\"": "〃",
	"[": "「", "]": "」", "<": "〈", ">": "〉", "{": "〔", "}": "〕",
	"(": "【", ")": "】",
	" «":"「",
	"» ":"」",
	" “":"「",
	"” ":"」",
	" „":"「",
	"“ ":"」"
    };


     var regulGraphs = {
	 "â": "aa", "Â": "A-", "ā": "aa", "Ā": "A-",
	 "ê": "ee", "Ê": "E-", "ē": "ee", "Ē": "E-",
	 "î": "ii", "Î": "I-", "ī": "ii", "Ī": "I-",
	 "ô": "ou", "Ô": "O-", "ō": "ou", "Ō": "O-",
	 "û": "uu", "Û": "U-","ū": "uu", "Ū": "U-"
	 };
    var regulMap = {};
    var japaneseMap = {};

    Object.keys(regulGraphs).forEach(function (key) {
        var value = regulGraphs[key];

        if (!(key in regulMap)) {
            regulMap[key] = value;
        }
    });


    var regulRegex = new RegExp(Object.keys(regulMap).sort(function(a, b) {
        return b.length - a.length;
    }).join("|"), "g");
    
    Object.keys(japaneseGraphs).forEach(function (key) {
        var value = japaneseGraphs[key];

        if (!(key in japaneseMap)) {
            japaneseMap[key] = value;
        }
    });


    var japaneseRegex = new RegExp(Object.keys(japaneseMap).sort(function(a, b) {
        return b.length - a.length;
    }).join("|"), "g");


    return {
	half2kana: function (str) {
	str = bulkReplace.replace(str, half2kanaRegex, half2kanaMap);
	return str;
	},
	kana2half: function (str) {
	str = bulkReplace.replace(str, kana2halfRegex, kana2halfMap);
	return str;
	},
	toRomaji: function (str) {
	str = str.replace(/([あいうえおかがきぎくぐけげこごさざしじすずせぜそぞただちぢつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもやゆよらりるれろわゐゑをんゔ][ぁぃぅゕゖぇゎぉょゃゅ]*)ゝ/g, "$1$1");
	str = str.replace(/([アイウエオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヰヱヲンヴ][ァィゥヵヶェヮォョャュ]*)ヽ/g, "$1$1");
	str = str.replace(/([かきくけこさしすせそたちつてとはひふへほ])ゞ/g,function(x){y=x.charCodeAt(0)+1;x=x.charCodeAt(0);return String.fromCharCode(x)+String.fromCharCode(y);});
	str = str.replace(/([カキクケコサシスセソタチツテトハヒフヘホ])ヾ/g,function(x){y=x.charCodeAt(0)+1;x=x.charCodeAt(0);return String.fromCharCode(x)+String.fromCharCode(y);});
	str = bulkReplace.replace(str, romajiRegex, romajiMap);
	str = bulkReplace.replace(str, regul2Regex, regul2Map);
	
	str = str.replace(/っ([zrtsdfghjkmwvy])/g, "$1$1");
	str = str.replace(/ッ([ZRTSDFGHJKMWVY])/g, "$1$1");
	str = str.replace(/n'([zrtsdfghjkmwvyn])/g, "n$1");
	str = str.replace(/n'([pb])/g, "m$1");
	str = str.replace(/N'([ZRTSDFGHJKMWVYN])/g, "N$1");
	str = str.replace(/N'([PB])/g, "M$1");
	return str;
	},
	 
	hiraToKata: function (str) {
	str = str.replace(/[ぁ-ゖゝ-ゟ]/g, function(x){x=x.charCodeAt(0)+96; return String.fromCharCode(x);});
	str = str.replace(/([ァアカヵガサザタダラヤワバパャヮ])ア/g, "$1ー");
	str = str.replace(/([イキシチニヒミリヰギジヂビピィ])イ/g, "$1ー");
	str = str.replace(/([ウクスツヌフムユルグズヅブプュゥ])ウ/g, "$1ー");
	str = str.replace(/([エケテセテネヘメレヱゲゼデベペェ])エ/g, "$1ー");
	str = str.replace(/([オコソトノホモヨロヲゴゾドボポョォ])[ウオ]/g, "$1ー");
	return str;
	},
	
	kataToHira: function (str) {
	str = str.replace(/[ァ-ヶヽ-ヿ]/g, function(x){x=x.charCodeAt(0)-96; return String.fromCharCode(x);});
	str = str.replace(/([ぁあかゕがさざただらやわばぱゃゎ])ー/g, "$1あ");
	str = str.replace(/([いきしちにひみりゐぎじぢびぴぃ])ー/g, "$1い");
	str = str.replace(/([うくすつぬふむゆるぐずづぶぷゅぅ])ー/g, "$1う");
	str = str.replace(/([えけてせてねへめれゑげぜでべぺぇ])ー/g, "$1え");
	str = str.replace(/([おこそとのほもよろをごぞどぼぽょぉ])ー/g, "$1う");
	return str;
	},
	 
        toJapanese: function (str) {

	// Voyelles longues
		
		str = str.replace(/([ァアカヵガサザタダラヤワバパャヮ])A/g, "$1ー");
		str = str.replace(/([イキシチニヒミリヰギジヂビピィ])I/g, "$1ー");
		str = str.replace(/([ウクスツヌフムユルグズヅブプュゥ])U/g, "$1ー");
		str = str.replace(/([エケテセテネヘメレヱゲゼデベペェ])E/g, "$1ー");
		str = str.replace(/([オコソトノホモヨロヲゴゾドボポョォ])[UO]/g, "$1ー");
		str = str.replace(/([ぁあかゕがさざただらやわばぱゃゎ])-/g, "$1あ");
		str = str.replace(/([いきしちにひみりゐぎじぢびぴぃ])-/g, "$1い");
		str = str.replace(/([うくすつぬふむゆるぐずづぶぷゅぅ])-/g, "$1う");
		str = str.replace(/([えけてせてねへめれゑげぜでべぺぇ])-/g, "$1え");
		str = str.replace(/([おこそとのほもよろをごぞどぼぽょぉ])-/g, "$1う");
		
	// Doubles consonnes
		str = str.replace(/([zrtpsdfghjklmwvby])\1/g, "っ$1");
		str = str.replace(/([ZRTPSDFGHJKLMWVBY])\1/g, "ッ$1");

	// Doubles crochets
		str = str.replace(/「\[/g, "『");
		str = str.replace(/」\]/g, "』");
		str = str.replace(/〈\</g, "《");
		str = str.replace(/〉\>/g, "》");
		str = str.replace(/〔\{/g, "〘");
		str = str.replace(/〕\}/g, "〙");
		str = str.replace(/【\(/g, "〖");
		str = str.replace(/】\)/g, "〗");

	// n devant une consonne
		str = str.replace(/n([zrtpsdfghjklmwvb])/g, "ん$1");
		str = str.replace(/m([pb])/g, "ん$1");
		str = str.replace(/N([ZRTPSDFGHJKLMWVB])/g, "ン$1");
		str = str.replace(/M([PB])/g, "ン$1");

	// Kurikaeshi
		str = str.replace(/([ぁ-ゖ])\"/g, "$1ゝ");
		str = str.replace(/ゝ\"/g, "ゞ");
		str = str.replace(/([ァ-ヺ])\"/g, "$1ヽ");
		str = str.replace(/ヽ\"/g, "ヾ");
		str = str.replace(/([\u3400-\u9FAF])\"/g, "$1々");

	//Chiffres et caractères spéciaux
		str = str.replace(/[/-\;\#-\'\\\?\*\+\^-`\~\|@=!]/g, function(x){x=x.charCodeAt(0)+65248; return String.fromCharCode(x);});

	// On applique les règles
		str = bulkReplace.replace(str, regulRegex, regulMap);
		str = bulkReplace.replace(str, japaneseRegex, japaneseMap);
		return str;
        },
	
	 toAlpha: function (str) {
		 str = str.replace(/ /g, "　");
		 str = str.replace(/[!-~]/g, function(x){x=x.charCodeAt(0)+65248; return String.fromCharCode(x);});
		 return str;
	 }


    };
}]);
