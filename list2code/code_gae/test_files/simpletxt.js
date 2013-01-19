/**
 * Code for handling template generation and data parsing.
 */

var simpletxt = (function (){
	//privates

	function _context(text){
		text: text,
		pos:0
		Equals: function 
	}
	
	
	function _parseLine(line)
	{
		var item = "" , result = {}, i = 0, escape=false;
		for(c in line){
			var ch = line[c];			
			if (ch==data-delimit){				
				result[i.toString()]=item; item="";escape=false; i++; continue;}
			item+=ch;
		}
		result[i.toString()] = item;
		result["date"]=new Date().toString();
		return result;
	}
	
	
	
	//public
	return {
		template-escape : '@',
		template-open : '{',
		template-close : '}',
		data-delimit : ',',
		data-columnEscape : '"',		
		genTemplate : function(template,values){
			
		},
		parseLine : function(Line){
			return _parseLine(Line);
		}
	};	
	
}());

