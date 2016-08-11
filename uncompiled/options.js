"use strict"
var JSBtnOptions = {
	data:null,
	getScripts: function(){
		var me = this;
		// Load stored scripts
		chrome.storage.sync.get("jsbtn",function(jsbtn){
			var container,i,len,tmp,removeBtns;
			this.data = jsbtn.jsbtn;
			// Display the active scripts
			container = document.querySelector("#jsBtnList tbody");
			if(this.data.pages && this.data.pages instanceof Array && this.data.pages.length){
				for(i = 0, len = this.data.pages.length; i < len; i++){
					tmp = document.createElement("tr");
					container.appendChild(tmp);
					tmp.id = 'item' + i;
					tmp.innerHTML = '<td>' +
									'	<button name="jsBtn_Btn' + i + '" id="jsBtn_Btn' + i + '" class="jsBtnRemove">X</button>' +
									'</td><td>' + 
									'	<input type="text" name="jsBtn_Sites[' + i + ']" id="jsBtn_Site' + i + '" value="' + this.data.pages[i].replace(/"/g, "'").replace(/'/g, '\'') + '">'+
									'</td><td>' + 
									'	<textarea name="jsBtn_Scripts[' + i + ']" id="jsBtn_Script' + i + '" class="jsBtnScript" rows="5">' + this.data.scripts[i].replace(/"/g, "'").replace(/'/g, '\'') + '</textarea>' +
									'</td>';
				}
			}else{
				document.querySelector(".jsBtnList").style.display = "none";
			}
			// Display Conf saved values:
			if(this.data.def){
				document.querySelector("#jsBtnDefault").innerHTML = this.data.def.script;
				document.querySelector("#jsBtnUseDef").checked = this.data.def.active || false;
			}
			// Add remove actions
			removeBtns = document.querySelectorAll(".jsBtnRemove");
			for(i = 0, len = removeBtns.length; i < len; i++){
				tmp = removeBtns[i];
				tmp.addEventListener('click',function(e){
					e.preventDefault();
					me.removeScript(this.id);
				});
			}
		});
	},
	addScript: function(){
		var site = document.querySelector("#jsBtnAddSite").value || false,
			script = document.querySelector("#jsBtnAddScript").value || false,
			next = document.querySelectorAll("#jsBtnList tbody td").length,
			container = document.querySelector("#jsBtnList tbody"),
			me = this,
			tmp,i,len,removeBtns;
		if(!site || !script){
			alert("Please fill the 'Site or Page' and 'Script' in order to add a new item.");
			return;
		}
		script = script.replace(/"/g, "'").replace(/'/g, '\'');
		site = site.replace(/"/g, "'").replace(/'/g, '\'');
		
		tmp = document.createElement("tr");
		container.appendChild(tmp);
		tmp.id = 'item' + next;
		
		this.data = this.data || {};
		this.data.pages = this.data.pages || [];
		this.data.scripts = this.data.scripts || [];
		
		this.data.pages.push(site);
		this.data.scripts.push(script);
		tmp.innerHTML = '<td>' +
						'	<button name="jsBtn_Btn' + next + '" id="jsBtn_Btn' + next + '" class="jsBtnRemove"></button>' +
						'</td><td>' + 
						'	<input type="text" name="jsBtn_Sites[' + next + ']" id="jsBtn_Site' + next + '" value="' + site + '">'+
						'</td><td>' + 
						'	<textarea name="jsBtn_Scripts[' + next + ']" id="jsBtn_Script' + next + '" class="jsBtnScript" rows="5">' + script + '</textarea>' +
						'</td>';
		
		document.querySelector(".jsBtnList").style.display = "block";
		document.querySelector("#jsBtnAddSite").value = "";
		document.querySelector("#jsBtnAddScript").value = "";
		document.querySelector("#jsBtn_Btn" + next).addEventListener('click',function(e){
			e.preventDefault();
			me.removeScript(this.id);
		});
	},
	removeScript: function(index){
		var ind = parseInt(index.replace("jsBtn_Btn","")),
			toDelete,i,len;
		document.querySelector("#item" + ind).style.display = "none";
		toDelete = document.querySelectorAll("#item" + ind + " input");
		for(i = 0, len = toDelete.length; i < len; i++){
			toDelete[i].remove();
		}
	},
	saveData: function(){
		var form = document.forms.jsBtnForm,
			me = this,
			data,tmp;
		
		this.data = {
			pages:[],
			scripts:[],
			def:{}
		}
		var data = new FormData(form);
		data.forEach(function(val, name){
			if(name == "") return;
			switch(name){
				case "jsBtnDefault":
					me.data.def.script = val;
				break;
				case "jsBtnUseDef":
					me.data.def.active = val || false;
				break;
				default:
					if(name.indexOf("jsBtn_Sites") == 0){
						me.data.pages.push(val);
					}
					if(name.indexOf("jsBtn_Scripts") == 0){
						me.data.scripts.push(val);
					}
				break;
			}
		});
		chrome.storage.sync.set({jsbtn:this.data},function(){window.close();});
	},
	init: function(){
		var me = this;
		this.getScripts();
		document.querySelector("#jsBtnSave").addEventListener('click',function(e){
			e.preventDefault();
			me.saveData();
		});
		document.querySelector("#jsBtnSaveAdd").addEventListener('click',function(e){
			e.preventDefault();
			me.addScript();
		});
	}
}
document.addEventListener('DOMContentLoaded', function () {
	JSBtnOptions.init();
});
