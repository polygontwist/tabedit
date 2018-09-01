"use strict";
/*
	Version 0.2
	
	Copyright (c) 2018 Andreas Kosmehl
	MIT License
*/
 
 
 var tabedit=function(){
	var zeichen={
		up:"▼",
		down:"▲",
		updown:"▲▼"		//nicht ausgewählt
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
				
		var sortbyTD=function(dat){
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
			
			sortTablebyTD(dat.nr,dat.status==1);
		}
				
		var clickbutt=function(e){
			sortbyTD(e.target.data);
			e.preventDefault();
		}
		
		var ini=function(){
			var i,butt,o,initobj=undefined;
			//create Button im th
			var th=tabelle.getElementsByTagName("th");
			for(i=0;i<th.length;i++){				
				butt=cE(th[i],"button",undefined,"tabeditbutt");
				butt.innerHTML=zeichen.updown;
				butt.addEventListener('click',clickbutt);
				o={ "butt":butt,
					"nr":i,
					"status":0 //0=n.d. 1=up 2=down
					};
				butt.data=o;
				if(istClass(th[i],"tabeditdefault"))initobj=o;
				buttons.push(o);
			}
			if(initobj!=undefined)sortbyTD(initobj);
		}		
		
		ini();
	}
	
	//Seiteninit
	var ini=function(){
		var i;
		var tabs=document.getElementsByClassName("tabeditrow");
		
		for(i=0;i<tabs.length;i++){
			new initab(tabs[i]);
		}
	}
	
	
	window.addEventListener('load', function(){ini() }, false);
 }
 
 tabedit();
 