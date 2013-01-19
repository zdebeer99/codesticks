/**
 * Code for handling template generation and data parsing.
 */

var simpletxt = (function () {
	var m = {template_escape : '@',
			template_open : '{',
			template_close : '}',
			col_delimit : ',',
			col_escape : '"',
			row_delimit : '\n'};
	
	function _test()
	{
		var a = parseRow('1,"2,3",4,5');
		return a;
	}
	
	function matchtext(text,exp,pos)
	{
		var a=0;
		if (text.length < pos+exp.length)
			return false;			
		for(var i=pos; i < pos + exp.length; i++){
			if (a>=exp.length)
				return true;
			var ch1 = text[i];
			var ch2 = exp[a];
			if (ch1!=ch2)
				return false;
			a++;
		}
		return exp.length==a;		
	}
	
	function createRow(line){
		var o = {
			text:line,
			pos:0
		};
		o.len = o.text.length;
		o.ch = function(pos){return o.text[pos];};
		o.curr = function(){return o.text[o.pos];};
		o.move = function(){o.pos++;return o.text[o.pos-1];};
		o.skip = function(exp){
			var hasmatch = o.match(exp);
			if (hasmatch)
				o.pos+=exp.length;
			return hasmatch;
		};
		o.match = function(exp)
		{
			return matchtext(o.text,exp,o.pos);
		};
		o.prev = function(exp){
			var npos = o.pos-exp.length;
			if (npos<0)
				return false;
			return matchtext(o.text,exp,npos);
		};
		o.isDone = function(){return o.pos>=o.len;};
		return o;
	}
	
	function parseRow(txtline)
	{
		var cx = createRow(txtline), item = "" , result = {}, escape=false;		
		var a=0,safe=0;
		while(!cx.isDone())
		{	
			safe++;
			if (safe>10000)
				throw "ERR! Loop over flow.";
			//test for delimiter
			if (cx.match(m.col_delimit)&&!escape){
				cx.skip(m.col_delimit);
				result[a.toString()]=item;
				item="";a++;continue;
			}			
			//test for qoutes escape
			if (cx.match(m.col_escape))
			{
				if (cx.prev(m.col_delimit) && !escape){
					cx.skip(m.col_escape);escape=true;continue;
				}				
				if (cx.match(m.col_escape + m.col_delimit) && escape){
					cx.skip(m.col_escape + m.col_delimit);
					result[a.toString()]=item;
					item="";escape=false;a++;continue;
				}
			}			
			item += cx.move();
		}			
		result[a.toString()] = item;		
		return result;
	}	
	
	function generate(data,template)
	{
		var lines = data.split(m.row_delimit), result="";
		
		for(var i=0;i<lines.length;i++){
			var line = lines[i];
			var values = parseRow(line);
			result+=genTemplate(template,values);
		}
		return result;
	}
	
	function genTemplate(template,values)
	{
		var mode=0,result="",varn="",escape=false;
		for(var i=0;i<template.length;i++){
			var ch = template[i];			
			
			if (ch==m.template_escape && !escape){
				escape=true; continue;
			}
			
			//set template mode for code.
			if(ch==m.template_open && mode==0){
				if (!escape){					
					varn="",mode=1; continue;
				}				
			}
			escape=false;
			
			//handle invalid opening token.
			if(ch==m.template_open && mode==1){
				result+=m.template_open+varn;
				varn="";
				continue;
			}
			//set text and set mode back to text mode.
			if(ch==m.template_close && mode==1){
				value = values[varn];
				if (value==undefined)
					result += m.template_open+varn+m.template_close;
				else
					result += value;
				mode=0; continue;
			}
			//handle text mode
			if (mode==0)
				result+=ch;
			//handle code mode.
			if (mode==1)
				varn+=ch;
		}
		return result;
	}
	
	// public
	m.test = _test;
	m.generate = generate;
	return m;
}());

