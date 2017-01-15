/*! Build time: 2017-01-15 05:13:26 */
;var floor=floor||{};floor.constants={clickColor:"green",CONFERENCE:"konferens",OFFICE:"kontor",CLASS_SHOW_FLOOR:"showFloor",CLASS_ADMIN_SHOW_FLOOR:"showFloorAdmin",UNDEFINED:"undefined"};var floor=floor||{};floor.utils=(function(){var a=null,b=null,c=[];if(typeof window.addEventListener==="function"){a=function(f,e,d){f.addEventListener(e,d,false);return f;};b=function(f,e,d){f.removeEventListener(e,d,false);};}else{if(typeof document.attachEvent==="function"){a=function(f,e,d){f.attachEvent("on"+e,d);return f;};b=function(f,e,d){f.detachEvent("on"+e,d);};}else{a=function(f,e,d){f["on"+e]=d;return f;};b=function(f,e,d){f["on"+e]=null;};}}return{addListener:function(f,e,d,g){c.push({el:f,type:e,fn:d,es:g});return a(f,e,d);},removeListener:b,removeAllActiveListeners:function(g){var e=c.length,f=null,d=[];for(;e--;){f=c[e];if(!g||(g&&f.es===g)){b(f.el,f.type,f.fn);}else{d.push(f);}}c=d;},removeChildNodes:function(e){var d=e.childNodes.length;for(;d--;){e.removeChild(e.childNodes[d]);}},bind:function(e,d){return function(){return d.apply(e,[].slice.call(arguments));};},addClass:function(d,e){d.className+=(" "+e);},removeClass:function(d,f){var e=new RegExp("(?:^|\\s)"+f+"(?:\\s|$)");d.className=d.className.replace(e," ");},manageArrows:function(f){var d=document.querySelector("#floor-back i");var e=document.querySelector("#floor-forward i");this.removeClass(d,"md-inactive");this.removeClass(e,"md-inactive");if(1===f){this.addClass(d,"md-inactive");}else{if(3===f){this.addClass(e,"md-inactive");}}},searchTextFieldsInObject:function(g,q,d){var k=-1,j=0,e=g.length,m=q.length,o=null,h=null,p=null,l=null,f=false,n=[];for(;j<e;j++){h=g[j];l={};f=false;for(o in h){if(h.hasOwnProperty(o)){if(d.indexOf(o)>=0){if(typeof h[o]==="string"){k=h[o].toLowerCase().indexOf(q);if(k>=0){p=h[o].substring(0,k);p+="<em class='match'>"+h[o].substring(k,k+m)+"</em>";p+=h[o].substr(k+m);l[o]=p;f=true;continue;}}else{throw new Error("Only string properties should be searchable");}}l[o]=h[o];}}if(f){n.push(l);}}return n;}};}());var floor=floor||{};floor.loader=(function(){var d=null,c=null,a=null,b=function(f,h){var g=new XMLHttpRequest();g.onreadystatechange=(function(j){return function(){if(j.readyState===4&&j.status===200){h(j);}};}(g));g.open("GET",f,true);g.setRequestHeader("Pragma","no-cache");g.setRequestHeader("Cache-Control","no-store, no-cache, must-revalidate, post-check=0, pre-check=0");g.setRequestHeader("Expires",0);g.setRequestHeader("Last-Modified",new Date(0));g.setRequestHeader("If-Modified-Since",new Date(0));g.send("");},e=function(){var h=d.pop(),g=h.path.lastIndexOf(".")+1,f=h.path.substring(g,h.path.length);console.log("loading resource - path: "+h.path+" with the extension: "+f);b(h.path,function(k){var j=k.responseText;if(f==="json"){j=JSON.parse(j);}h.dataTarget(j);if(d.length===0){console.log("All resources loaded - starting application");c.call(a);}else{e();}});};return{data:null,templates:{},setData:function(f){floor.loader.data=f;},setTemplates:function(g){var h=document.createDocumentFragment(),k=document.createElement("div"),f=null,j=0;k.innerHTML=g;while(k.childNodes.length>0){h.appendChild(k.childNodes[0]);}f=h.querySelectorAll("script");for(j=0;j<f.length;j++){floor.loader.templates[f[j].id]=f[j].innerHTML;}},init:function(f,h,g){c=h;a=g;d=f;e();}};}());var floor=floor||{};floor.dataHandler=(function(){var a=floor.loader,b=floor.constants;return{occupants:null,init:function(){var d=0,c=0,e=a.data.rooms.length;if(a.data===null){throw new Error("Error: Data has not been initialized. Run floor.loader.init()");}this.occupants=[];for(;d<e;d++){if(a.data.rooms[d].type===b.OFFICE&&a.data.rooms[d].occupants){for(c=0;c<floor.loader.data.rooms[d].occupants.length;c++){a.data.rooms[d].occupants[c].roomId=a.data.rooms[d].id;a.data.rooms[d].occupants[c].floor=a.data.rooms[d].floor;this.occupants.push(a.data.rooms[d].occupants[c]);}}else{floor.loader.data.rooms[d].roomId=a.data.rooms[d].id;this.occupants.push(a.data.rooms[d]);}}this.occupants.sort(function(g,f){if(typeof g.name===b.UNDEFINED&&typeof f.name!==b.UNDEFINED){return -1;}if(typeof g.name!==b.UNDEFINED&&typeof f.name===b.UNDEFINED){return 1;}if(typeof g.name===b.UNDEFINED&&typeof f.name===b.UNDEFINED){return 0;}if(g.name<f.name){return -1;}if(g.name>f.name){return 1;}return 0;});},getRoomData:function(d){var c=0;for(c=a.data.rooms.length;c--;){if(a.data.rooms[c].id===d){return a.data.rooms[c];}}return null;},getEmptyRooms:function(e){var c=0,d=a.data.rooms.length;for(;c<d;c++){if(a.data.rooms[c].type===b.OFFICE&&typeof a.data.rooms[c].occupants===b.UNDEFINED){e(a.data.rooms[c]);}}},getConferenceRooms:function(e){var c=0,d=a.data.rooms.length;for(;c<d;c++){if(a.data.rooms[c].type===b.CONFERENCE){e(a.data.rooms[c]);}}}};}());var floor=floor||{};floor.graph=(function(){var c=null,b=null,f=null,e="fill-hover",g="fill-processed",a="fill-selected",d="fill-none";return{init:function(h){c=document.getElementById("floor"+h).getSVGDocument();b=c.getElementById("svg2");f=b.namespaceURI;},initSelectableElement:function(h){var j=c.getElementById(h);j.setAttribute("pointer-events","visible");j.setAttribute("class",d);j.style.cssText=j.style.cssText.replace(/fill.?:.?none;/,"");return j;},processElementsInRange:function(h,j,m){var k=c.getElementById(h),l=null;while(k){l=k.firstChild;l.setAttribute("class",e);l.style.cssText=l.style.cssText.replace(/fill.?:.?none;/,"");m(l);k=k.id===j?null:k.nextSibling;}},getSvgDoc:function(){return c;},getSvg:function(){return b;},getSvgElementById:function(h){return c.getElementById(h);},drawTextBox:function(j,o,k){var n=c.createDocumentFragment(),l=c.createElementNS(f,"rect"),m=c.createElementNS(f,"text"),h=c.getElementById("g10");l.setAttribute("x",j);l.setAttribute("y",o);l.setAttribute("width",50);l.setAttribute("height",50);l.setAttribute("fill","white");l.setAttribute("stroke","black");l.setAttribute("stroke-width",2);n.appendChild(l);m.setAttribute("x",j+10);m.setAttribute("y",o+10);m.textContent="hejsan";n.appendChild(m);h.appendChild(n);},createSvgNodeFromNode:function(j){var h=c.getElementById(j),k=c.createElementNS(f,"path");k.setAttribute("id",h.id+"hover");k.setAttribute("d",h.getAttribute("d"));k.setAttribute("class","svgHover");k.setAttribute("style","fill:yellow;stroke:#000000;stroke-width:0.07;");h.parentNode.insertBefore(k,h);},fillProcessed:function(h){var j=c.getElementById(h);j.setAttribute("class",g);},fillHoverBG:function(h){h.setAttribute("class",e);},fillSelectedBG:function(h){h.setAttribute("class",a);},clearFill:function(h){if(h){h.setAttribute("class",d);}},setClearHover:function(h,l){var k=l?e:d,j=null;j=c.getElementById(h.id);j.setAttribute("class",k);}};}());var floor=floor||{};floor.searchPanel=(function(){var f=floor.dataHandler,a=floor.graph,n=floor.utils,t=floor.constants,h=floor.loader,g=null,j="accPanel",q="empty-rooms-btn",k="conference-rooms-btn",c="search-button",o=["name","prof"],b=null,e=null,p=null,s=function(){var u=document.getElementById(j);n.addListener(u,"click",r);n.addListener(u,"keydown",r);n.addListener(b,"click",m);},l=function(v){var u={};u.floor=v.floor;u.roomId=v.roomId;u.title=typeof v.name==="undefined"?"-- Tomt rum --":v.name;u.extras=[];if(v.type===t.CONFERENCE){u.extras.push("konferensrum");u.cls="conference";}else{if(typeof v.name!=="undefined"){u.extras.push(v.prof);u.cls="office";}else{if(typeof v.name==="undefined"){u.cls="empty";}}}return u;},d=function(w){var x=w.length,v=0,u={listItems:[]};for(;v<x;v++){u.listItems.push(l(w[v]));}b.innerHTML=Mustache.render(p,u);},r=function(v){var u=v.target,w=null,x=null;g.clearMultiSelect();if(u.id&&((u.id===q)||(u.id===k))){b.innerHTML="";g.deselectRoom();w=u.id===q?f.getEmptyRooms:f.getConferenceRooms;x=[];w(function(y){if(g.getCurrentFloorNumber()===y.floor){g.setMultiSelect(y);}x.push(y);});d(x);}else{if(v.which===13||v.keyCode===13||u.id&&u.id===c){if(e.value){d(n.searchTextFieldsInObject(f.occupants,e.value,o));}else{d(f.occupants);}}}v.stopPropagation();return false;},m=function(v){var u=v.target,w=null,y=null,x=3;g.clearMultiSelect();if(u.nodeName!=="LI"){u=u.parentNode;}x=parseInt(u.getAttribute("data-floornr"),10);if(g.getCurrentFloorNumber()!==x){g.changeFloor(x);}w=u.getAttribute("data-roomid");y=a.getSvgElementById(w);if(u.nodeName==="LI"){g.selectRoomAction(y);}v.stopPropagation();return false;};return{init:function(){var u=f.occupants;g=floor.app;if(u===null){throw new Error("Error: Occupant data has not been initialized. Run floor.dataHandler.init()");}e=document.getElementById("search-input");b=document.getElementById("plist");p=h.templates["tmpl-list-item"];Mustache.parse(p);e.value="";e.focus();d(u);s();}};}());var floor=floor||{};floor.app=(function(){var d=floor.graph,m=floor.loader,j=floor.dataHandler,C=floor.constants,a=floor.searchPanel,y=floor.utils,w=null,r=null,h=null,b=null,D=null,o=null,B=[],A=null,v=3,n=null,x=null,l=null,s=null,u="app",p=function(F){var G=null,E=0;for(E=m.data.rooms.length;E--;){if(F===m.data.rooms[E].floor){G=d.initSelectableElement(m.data.rooms[E].id);y.addListener(G,"click",f,u);y.addListener(G,"mouseover",t,u);y.addListener(G,"mouseout",g,u);}}},f=function(E){s.clearMultiSelect();s.selectRoomAction(E.target);E.stopPropagation();},t=function(E){z(E.target);E.stopPropagation();},g=function(E){c(E.target);E.stopPropagation();},q=function(E){w.innerHTML=e(E,x);},e=function(I,G){var J=j.getRoomData(I),E={},F=0,H=0;E.title=J.name;if(J.type===C.CONFERENCE){E.subTitle="Konferensrum";E.cls="conference";}else{if(typeof J.occupants!=="undefined"){E.occupants=[];for(F=0,H=J.occupants.length;F<H;F++){E.occupants.push({name:J.occupants[F].name,pic:J.occupants[F].pic});}}else{E.subTitle="Tomt!";E.cls="emptyRoom";}}return Mustache.render(G,E);},z=function(E){s.clearMultiSelect();if(!h||h.id!==E.id){d.fillHoverBG(E);}k(E);},c=function(E){if(!h||h.id!==E.id){d.clearFill(E);}b="";r.innerHTML="";},k=function(F){var H=null,G=null,E=0,I=0;if(!b||b!==F.id){b=F.id;H=F.getBoundingClientRect();E=H.left-D.left+(o.left-D.left)+(H.right-H.left)+5;I=H.top-D.top+(o.top-D.top)+((H.bottom-H.top)/2);G=document.createElement("div");r.innerHTML="";G.setAttribute("class","hoverBox");G.style.cssText="top: "+I+"px; left: "+E+"px;";G.innerHTML=e(F.id,l);r.appendChild(G);}};return{init:function(){var E=null;s=this;w=document.getElementById("room-data");r=document.getElementById("hoverLayer");A=document.getElementById("floorNumber");document.getElementById("floorLoader").style.cssText="display: none;";n=document.querySelectorAll(".floorplan");y.addClass(n[0],C.CLASS_SHOW_FLOOR);x=m.templates["tmpl-presentation"];l=m.templates["tmpl-hover"];Mustache.parse(x);Mustache.parse(l);j.init();a.init();this.reload();console.log("- initializing complete -");},reload:function(){floor.utils.removeAllActiveListeners(u);D=document.body.getBoundingClientRect();o=document.getElementById("col1").getBoundingClientRect();d.init(v);p(v);},selectRoomAction:function(E){s.deselectRoom();d.fillSelectedBG(E);q(E.id);h=E;},deselectRoom:function(){d.clearFill(h);h=null;w.innerHTML="";},setMultiSelect:function(E){B.push(E);d.setClearHover(E,true);},clearMultiSelect:function(){var E=0;if(B&&B.length>0){for(E=B.length;E--;){d.setClearHover(B[E],false);}B.length=0;}},getCurrentFloorNumber:function(){return v;},floorChooserBtnAction:function(E){var F=v+parseInt(E,10);if(F>=1&&F<=3){floor.app.changeFloor(F);}},changeFloor:function(F){floor.app.clearMultiSelect();v=F;for(i=n.length;i--;){y.removeClass(n[i],C.CLASS_SHOW_FLOOR);}var E=document.getElementById("level"+v);y.addClass(E,C.CLASS_SHOW_FLOOR);A.innerHTML=v;y.manageArrows(v);floor.app.reload();}};}());(function(){window.onload=function(){var a=[{path:"data.json",dataTarget:floor.loader.setData},{path:"templates.html",dataTarget:floor.loader.setTemplates}];floor.loader.init(a,floor.app.init,floor.app);};}());