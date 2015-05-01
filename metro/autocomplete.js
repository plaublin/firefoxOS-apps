"use strict";

function setupPage() {
	//Generated with: 
	// $ grep "\"line\"" converter.rb | awk -F: '{print $2}' | tr '\n' ' '
	var lines = ["A3", "A5", "A35", "A1", "A", "P a Auber", "P a Chatelet", "A2", "A4", "B4", "B2", "B", "P a Gare du Nord", "P St Michel", "B3", "B5", "C1", "Coorespondances C ouest parisien", "C7", "C5", "C57", "C", "C2", "C468", "C46", "C8", "C4", "C6", "D1", "D2", "D4", "D6", "E1", "P Haussmann St Lazare", "E2", "E4", "M1", "M10", "M11", "M12", "M13", "M14", "M2", "M3", "M3 bis", "M4", "M5", "M6", "M7", "M7 bis", "M8", "M9", "T1", "T2", "T3", "H", "H1", "H11", "H12", "H2", "H21", "H211", "H22", "H3", "H3"];

	if (typeof String.prototype.startsWith != 'function') {
		// see below for better implementation!
		String.prototype.startsWith = function (str){
			return this.indexOf(str) == 0;
		};
	}

	String.prototype.removeSpecialCharacters = function(){
		var accent = [
			/[\300-\306]/g, /[\340-\346]/g, // A, a
			/[\310-\313]/g, /[\350-\353]/g, // E, e
			/[\314-\317]/g, /[\354-\357]/g, // I, i
				/[\322-\330]/g, /[\362-\370]/g, // O, o
				/[\331-\334]/g, /[\371-\374]/g, // U, u
					/[\321]/g, /[\361]/g, // N, n
					/[\307]/g, /[\347]/g, // C, c
						/[']/g
		];
		var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c', ' '];

		var str = this;
		for(var i = 0; i < accent.length; i++){
			str = str.replace(accent[i], noaccent[i]);
		}

		return str;
	}

	function setupTrie() {
		function purifyString(s) {
			var p = "";
			return s.toLowerCase().removeSpecialCharacters();
		}

		function autoComplete() {
			function addResult(s) {
				var label = document.createElement("label");
				var text = document.createTextNode(s);
				label.appendChild(text);
				document.getElementById("autoCompleteResults").appendChild(label);
			}

			var element = document.getElementById("autoCompleteResults");
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}

			var name = purifyString(textField.value);
			if (name == "") {
				return;
			}

			var names = {};

			// The trie is useful for 1 thing: getting the results that really
			// complete name at first position in the names set
			var completeList = trie.find(name);
			if (completeList != null) {
				completeList = completeList.getWords();
				for (var i=0; i<completeList.length; i++) {
					names[completeList[i]] = true;
				}
			}
		
			for (var entry in simpleName2ActualName) {
				if (entry.indexOf(name) > -1) {
					names[entry] = true;
				}
			}

			var empty = true;
			for (var entry in names) {
				addResult(simpleName2ActualName[entry]);
				empty = false;
			}

			if (empty) {
				addResult("Auncun résultat !");
			}
		}

		for (var s in map) {
			var found = false;
			for (var i=0; i<lines.length; i++) {
				if (s.startsWith(lines[i] + " ")) {
					found = true;
					break;
				}
			}

			// add only the meta stations
			if (!found) {
				var purified_str = purifyString(s);
				simpleName2ActualName[purified_str] = s;
				trie.add(purified_str);
			}
		}

		var textField = document.getElementById("stationName");
		textField.onkeyup = autoComplete;
	}

	/*
	function setupStationList() {
		//for each line
		//  add new span with name of line and css
		//    for each station of this line
		//      add a label
		//    //this sub list should be hidden by default 

		var string = "";
		for (var i=0; i<lines.length; i++) {
			if (lines[i].length <= 3) {
				string += lines[i].replace(/\sbis/g, "b").				
					replace(/^M([0-9]+b?)/g, "<span class='metro symbole'>Metro</span><span class='metro ligne$1'>Ligne $1</span>").
					replace(/^([A-F])[0-9]* /g, "<span class='rer symbole'>RER</span><span class='rer ligne$1'>Ligne $1</span>").
					replace(/^([G-S])[0-9]* /g, "<span class='transilien symbole'>Transilien</span><span class='transilien ligne$1'>Ligne $1</span>").
					replace(/^T([0-9]b?)/g, "<span class='tram symbole'>Tram</span><span class='tram ligne$1'>Ligne $1</span>");

				string += "<br />";
			}
		}
		document.getElementById("lines").innerHTML = string;
	}
	*/

	var simpleName2ActualName = {};
	var trie = new Trie();

	setupTrie();
//	setupStationList();
}
