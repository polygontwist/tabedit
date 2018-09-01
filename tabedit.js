"use strict";
/*
	Version 0.3
	
	Copyright (c) 2018 Andreas Kosmehl
	MIT License
*/
 
 
 var tabedit=function(){
	var zeichen={		//https://www.w3schools.com/charsets/ref_utf_geometric.asp
		up:"▼",			//&#9660;
		down:"▲",		//&#9650;
		updown:"▲▼",	//nicht ausgewählt
		right:"►",		// &#9658;
		left:"◄",		// &#9668;
		rightleft:"◄►"	
	};
	
	//Basics
	var cE=function(ziel,e,id,cn){
		var newNode=document.createElement(e);
		if(id!=undefined && id!="")newNode.id=id;
		if(cn!=undefined && cn!="")newNode.className=cn;
		if(ziel)ziel.appendChild(newNode);
		return newNode;
	}
	var addClass=function(htmlNode,Classe){	
		var newClass;
		if(htmlNode!=undefined){
			newClass=htmlNode.className;
			if(newClass==undefined || newClass=="")newClass=Classe;
			else
			if(!istClass(htmlNode,Classe))newClass+=' '+Classe;	
			htmlNode.className=newClass;
		}			
	}
	 
	var subClass=function(htmlNode,Classe){
			var aClass,i;
			if(htmlNode!=undefined && htmlNode.className!=undefined){
				aClass=htmlNode.className.split(" ");	
				var newClass="";
				for(i=0;i<aClass.length;i++){
					if(aClass[i]!=Classe){
						if(newClass!="")newClass+=" ";
						newClass+=aClass[i];
						}
				}
				htmlNode.className=newClass;
			}
	}
	var istClass=function(htmlNode,Classe){
		if(htmlNode.className){
			var i,aClass=htmlNode.className.split(' ');
			for(i=0;i<aClass.length;i++){
					if(aClass[i]==Classe)return true;
			}	
		}		
		return false;
	}
	
	
	//Tabellenobjekt 
	var initab=function(tabelle){
		var buttons=[];
		
		var resetButtStat=function(ausser){
			var i;
			for(i=0;i<buttons.length;i++){
				if(i!=ausser)buttons[i].status=0;
			}
		}
		
		var setButtStat=function(){
			var i,o,s;
			for(i=0;i<buttons.length;i++){
				o=buttons[i];
				if(o.richtung=="row"){
					switch(o.status){
						case 0:
							s=zeichen.updown;
							break;
						case 1:
							s=zeichen.up;
							break;
						case 2:
							s=zeichen.down;
							break;
					}
				}else{
					switch(o.status){
						case 0:
							s=zeichen.rightleft;
							break;
						case 1:
							s=zeichen.right;
							break;
						case 2:
							s=zeichen.left;
							break;
					}
				}
				o.butt.innerHTML=s;
				subClass(o.butt,"tabeditbaktiv")
				if(o.status>0)addClass(o.butt,"tabeditbaktiv")
			}
		}
		
		
		var tabsrtup=function(a,b){
			//wenn eines eine Zahl ist und das andere leer, leere auf 0 setzen
			if(a.sortvalue==="" && !isNaN(b.sortvalue))a.sortvalue=0;
			if(b.sortvalue==="" && !isNaN(a.sortvalue))b.sortvalue=0;
			
			var isnumbers=!(isNaN(a.sortvalue) || isNaN(b.sortvalue));			
			if(isnumbers)
			{	//Zahlensort
				if( parseFloat(a.sortvalue)<parseFloat(b.sortvalue) )return -1
				else
				if( parseFloat(a.sortvalue)>parseFloat(b.sortvalue) )return 1
				else
				return 0;
			}
			else
				return a.sortvalue.toLowerCase().localeCompare(b.sortvalue.toLowerCase());
		}
		var tabsrtdown=function(a,b){
			//tabsrtup gegenteilig nutzen
			return tabsrtup(b,a);
		}
		var sortTablebyTD=function(nr,isup){
			var i,node,tr,td,
				zeilen=tabelle.getElementsByTagName("tr"),
				zeilenlist=[],
				parentnode=zeilen[0].parentNode
				;
			if(isup==undefined)isup=true;
			
			//zu sortierende Elemente sammeln
			for(i=0;i<zeilen.length;i++){
				tr=zeilen[i];
				td=tr.getElementsByTagName("td")[nr];
				if(td!=undefined){
					zeilenlist.push({"node":tr,"sortvalue":td.innerHTML});
				}
			}
			
			//entfernen
			for(i=0;i<zeilenlist.length;i++){
				node=zeilenlist[i].node;
				node.parentNode.removeChild(node);
			}
			
			//sortieren
			if(isup)
				zeilenlist.sort(tabsrtup);
			else
				zeilenlist.sort(tabsrtdown);
			
			//einfügen
			for(i=0;i<zeilenlist.length;i++){
				parentnode.appendChild(zeilenlist[i].node);
			}
		}
		
		
		var sortTablebyTR=function(nr,isup){
			var i,t,node,tr,td,
				zeilen=tabelle.getElementsByTagName("tr"),
				spaltenlist=[],
				parentnode,
				tds
				;
			if(isup==undefined)isup=true;
			
			//inline wegen nr
			var tabsrtleft=function(a,b){
				//wenn eines eine Zahl ist und das andere leer, leere auf 0 setzen
				if(a.tds[nr].sortvalue==="" && !isNaN(b.tds[nr].sortvalue))a.sortvalue=0;
				if(b.tds[nr].sortvalue==="" && !isNaN(a.tds[nr].sortvalue))b.tds[nr].sortvalue=0;
				
				var isnumbers=!(isNaN(a.tds[nr].sortvalue) || isNaN(b.tds[nr].sortvalue));			
				if(isnumbers)
				{	//Zahlensort
					if( parseFloat(a.tds[nr].sortvalue)<parseFloat(b.tds[nr].sortvalue) )return -1
					else
					if( parseFloat(a.tds[nr].sortvalue)>parseFloat(b.tds[nr].sortvalue) )return 1
					else
					return 0;
				}
				else
					return a.tds[nr].sortvalue.toLowerCase().localeCompare(b.tds[nr].sortvalue.toLowerCase());
			}
			
			var tabsrtright=function(a,b){
				return tabsrtleft(b,a);
			}
			
			//zu sortierende Elemente sammeln
			var ospalten=[];
			for(i=0;i<zeilen.length;i++){
				tds=zeilen[i].getElementsByTagName("td");
				for(t=0;t<tds.length;t++){
					if(i==0){
						ospalten.push( {"tds":[ {"node":tds[t],sortvalue:tds[t].innerHTML} ] ,"nr":t} );
					}else{
						
						ospalten[t].tds.push( {"node":tds[t],sortvalue:tds[t].innerHTML} );
					}
				}
			}
			
			//entfernen
			for(t=0;t<ospalten.length;t++)
			for(i=0;i<ospalten[t].tds.length;i++){
				node=ospalten[t].tds[i].node;
				node.parentNode.removeChild(node);
			}
			
			//sortieren
			if(isup)
				ospalten.sort(tabsrtleft);
			else
				ospalten.sort(tabsrtright);
			
			//einfügen
			for(i=0;i<ospalten.length;i++){
				for(t=0;t<ospalten[i].tds.length;t++){
					parentnode=zeilen[t];
					parentnode.appendChild(ospalten[i].tds[t].node);
				}
			}
		}
			
		
		
		var sortby=function(dat){
			var s;
			resetButtStat(dat.nr);
			
			if(dat.status==0)
				dat.status=1;
			else
			if(dat.status==1)
				dat.status=2;
			else
			if(dat.status==2)
				dat.status=1;
			
			setButtStat();
			if(dat.richtung=="row")
				sortTablebyTD(dat.nr,dat.status==1);
			else
				sortTablebyTR(dat.nr,dat.status==1);
		}
				
		var clickbutt=function(e){
			sortby(e.target.data);
			e.preventDefault();
		}
		
		var ini=function(){
			var i,butt,o,initobj=undefined,tr,richtung="row";
			//create Button im th
			var th=tabelle.getElementsByTagName("th");
			
			//row or col?
			var tr=tabelle.getElementsByTagName("tr")[0],
				iscol=tr.getElementsByTagName("th").length==1;
						
			if(iscol)richtung="col";
			
			for(i=0;i<th.length;i++){				
				butt=cE(th[i],"button",undefined,"tabeditbutt");
				butt.addEventListener('click',clickbutt);
				o={ "butt":butt,
					"nr":i,
					"status":0, 			//0=n.d. 1=up|left 2=down|right
					"richtung":richtung		//"row"|"col"
					};
				butt.data=o;
				if(istClass(th[i],"tabeditdefault"))initobj=o;
				buttons.push(o);
			}
			setButtStat();
			if(initobj!=undefined)sortby(initobj);
			
		}		
		
		ini();
	}
	
	//Seiteninit
	var ini=function(){
		var i,
			tabs=document.getElementsByClassName("tabedit");
		for(i=0;i<tabs.length;i++){
			new initab(tabs[i]);
		}
	}
	
	
	window.addEventListener('load', function(){ini() }, false);
 }
 
 tabedit();
 