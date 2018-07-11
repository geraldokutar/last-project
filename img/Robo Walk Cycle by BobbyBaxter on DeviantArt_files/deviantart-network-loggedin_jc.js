/*
 *  (c) 2000-2014 deviantART, Inc. All rights reserved.
 */
DWait.ready(["jms/lib/jquery/jquery.current.js","jms/lib/ruler.js","jms/lib/glbl.js","jms/lib/browser.js","jms/lib/events.js"],function(){DDD={DEFAULT_SNAP_TRESHOLD:4,subject:null,subject_snap_treshold:null,p_down:null,mod_down:null,snapped:!1,preventDraggingToDesktop:function(e){e.preventDefault()},hookMouse:function(e){Events.hook(document,"mousedown",e),Browser.isTouch&&Events.hook(document,"touchstart",e)},unhookMouse:function(e){Events.unhook(document,"mousedown",e),Browser.isTouch&&Events.unhook(document,"touchstart",e)},mouseDown:function(e,D,o,s){return Glbl("Site.is_mobile")||DDD.subject||Browser.isTouch&&"touchstart"===e.type||(e.which||e.button)>1?!1:(D.ddd.node=this,DDD.subject=D,DDD.subject_snap_treshold=o==Number(o)?o:DDD.DEFAULT_SNAP_TRESHOLD,DDD.p_down=Ruler.document.pointer(e),DDD.mod_down=Ruler.clickMod(Ruler.document.node(DDD.subject.ddd.node,s),DDD.p_down),Events.hook(document,"mousemove",DDD.mouseDrag),Events.hook(document,"mouseup",DDD.mouseDrop),Browser.isTouch&&(Events.hook(document,"touchmove",DDD.mouseDrag),Events.hook(document,"touchend",DDD.mouseDrop)),Browser.isIE&&($(DDD.subject.ddd.node).bind("mousemove",DDD.preventDraggingToDesktop),Browser.isIE8&&(document.onselectstart=function(){return!1})),DDD.p_current=null,0==DDD.subject_snap_treshold&&DDD.mouseDrag(e),!0)},mouseDrop:function(e){DDD.snapped&&DDD.subject.ddd.drop.call(DDD.subject,e),DDD.mouseUp(e)},mouseUp:function(){DDD.p_down=null,DDD.snapped=!1,Browser.isIE&&(DDD.subject&&$(DDD.subject.ddd.node).unbind("mousemove",DDD.preventDraggingToDesktop),Browser.isIE8&&(document.onselectstart=null)),DDD.subject=null,Events.unhook(document,"mousemove",DDD.mouseDrag),Events.unhook(document,"mouseup",DDD.mouseDrop),Browser.isTouch&&(Events.unhook(document,"touchmove",DDD.mouseDrag),Events.unhook(document,"touchend",DDD.mouseDrop))},mouseDrag:function(e){var D;if(!DDD.subject)return!0;if(DDD.p_previous=DDD.p_current,DDD.p_current=D=Ruler.document.pointer(e),!DDD.snapped){if(!(Math.abs(DDD.p_down.x-D.x)>=DDD.subject_snap_treshold||Math.abs(DDD.p_down.y-D.y)>=DDD.subject_snap_treshold))return!0;DDD.snapped=!0,DDD.subject.ddd.snap.call(DDD.subject,e)}return DDD.subject.ddd.drag.call(DDD.subject,e),!1},eventKeys:function(e){return Browser.isMac&&!Browser.isOpera?{range:e.shiftKey,multiple:e.metaKey}:{range:e.shiftKey,multiple:e.ctrlKey}}},window.DWait&&DWait.run("jms/lib/ddd.js")});
DWait.ready(["jms/lib/browser.js","jms/lib/surfer2.js","jms/lib/surfer.js","jms/lib/ruler.js","jms/lib/bind.js"],function(){DDDUtils={mix:function(t){var r,e=DDDUtils.mixer;for(r in e)if(t[r]!=e[r]){if(t[r])throw Error("subject."+r+" already exists");t[r]=e[r]}},mixer:{dddTickStart:function(t){this.drag_data.top_drag_offset||(this.drag_data.top_drag_offset=0),this.drag_data.scroll_timer=setInterval(this._dddTickIterate.bind(this),200),this.dddTickUpdate(t)},dddTickUpdate:function(t){this.drag_data.event_cache={clientX:t.clientX,clientY:t.clientY,x:t.x,y:t.y}},dddTickEnd:function(){clearInterval(this.drag_data.scroll_timer)},_dddTickIterate:function(){var t,r;if(t=Ruler.screen.pointer(this.drag_data.event_cache),t.y>this.drag_data.top_drag_offset&&this.drag_data.top_drag_offset+48>t.y||t.y>Ruler.screen.rect().y2-24){if(this.drag_data.surfers)for(r=0;this.drag_data.surfers[r];r++)Surfer.update(this.drag_data.surfers[r],this.drag_data.event_cache);else this.drag_data.surfer2&&Surfer2.update(this.drag_data.surfer2,this.drag_data.event_cache);this.drag_data.top_drag_offset+48>t.y?Browser.isGecko||Browser.isIE?document.documentElement.scrollTop-=48:document.body.scrollTop-=48:Browser.isGecko||Browser.isIE?document.documentElement.scrollTop+=48:document.body.scrollTop+=48}}}},window.DWait&&DWait.run("jms/lib/ddd.utils.js")});
DWait.ready(["jms/lib/events.js","jms/lib/bind.js","jms/lib/jquery/jquery.current.js","jms/lib/dtlocal.js"],function(){window.Renamer=function(t,i,e){DTLocal.infect(this),this.init(t,i,e)},Renamer.prototype={template:'<input type="text" class="itext renamer"/>',init:function(t,i,e){this.node=$(this.template)[0],this.owner=t,this.callback=i,this.localEventHook(this.node,"blur",this.blurred.bind(this)),this.localEventHook(this.node,"keydown",this.keyd.bind(this)),this.localEventHook(this.node,"keyup",this.keyu.bind(this)),this.localEventHook(this.node,"click",this.clicked.bind(this)),this.localEventHook(this.node,"mousedown",this.clicked.bind(this)),this.previous_name=e,this.node.value=e,setTimeout(this.focus.bind(this),1)},localRecv:function(t){var i;"destroy"==t&&(i=this.node.value,this.node.cancelled&&(i=null),this.node.parentNode&&this.node.parentNode.removeChild(this.node),this.callback&&this.callback.call(this.owner,i,this.previous_name))},clicked:function(t){return t.cancelBubble=!0,t.stopPropagation&&t.stopPropagation(),!0},focus:function(){this.node.focus(),this.node.select()},blurred:function(){this.done()},done:function(){this.dead||(this.dead=!0,setTimeout(this.localDestroy.bind(this),1))},keyd:function(t){return 13==t.keyCode?(this.done(),!1):void 0},keyu:function(t){return 27==t.keyCode?(this.node.value="",this.done(),!1):void 0}},window.DWait&&DWait.run("jms/lib/renamer.js")});
DWait.ready(["jms/lib/Base.js","jms/lib/wo.js","jms/lib/ddd.utils.js","jms/lib/surfer2.js","jms/lib/popup2.js","jms/lib/ddd.js","jms/lib/ruler.js","jms/lib/browser.js","jms/lib/events.js","jms/lib/bind.js","jms/lib/simple_selection.js"],function(){window.Selection=SimpleSelection.extend({constructor:function(e,t){this.base(e,t),this.ieonmousedown=this.ieonmousedown.bind(this),this.onmousedown=this.onmousedown.bind(this),this.onclick=this.onclick.bind(this),this.ie_last_button=null},fnull:function(){},hook:function(e){var e;if("object"!=typeof arguments[0]&&(e={include_keyboard:arguments[0],allow_multiple:arguments[1]}),this.options=e,this.options.include_click!==!1&&Events.hook(this.root,"click",this.onclick),this.options.include_keyboard&&(this.options.include_keyboard="h"==this.options.include_keyboard?{37:!0,39:!0}:{38:!0,40:!0},Events.hook(document.documentElement,Browser.isGecko?"keypress":"keydown",this.onkeydown=this.onkeydown.bind(this))),this.options.allow_multiple){if(!window.DDD)throw Error("Cannot hook multiple without ddd.js present");Events.hook(this.options.selectable_area||this.root,"mousedown",this.onmousedown),this.root.onselectstart=this.cancelEvent}else this.options.fast_clicks&&Events.hook(this.root,"mousedown",this.onclick);Browser.isIE&&this.options.ieOnClickMouseButtonHack&&Events.hook(this.root,"mousedown",this.ieonmousedown),this.options.global_mouse_cancel&&Selection.mouseInit().addListener(this._bound_sel=this.setSelection.bind(this,null,"mousedown")),this.drag_rect_ruler=this.options.drag_rect_ruler||Ruler.document.node},cancelEvent:function(e){return(e||window.event).cancelBubble=!0,!1},unhook:function(){Events.unhook(this.root,"click",this.onclick),Browser.isIE&&Events.unhook(this.root,"mousedown",this.ieonmousedown),this.options.include_keyboard&&Events.unhook(document.documentElement,Browser.isGecko?"keypress":"keydown",this.onkeydown),this.options.allow_multiple?(Events.unhook(this.options.selectable_area||this.root,"mousedown",this.onmousedown),this.root.onselectstart=null):this.options.fast_clicks&&Events.unhook(this.root,"mousedown",this.onclick),this.options.global_mouse_cancel&&Selection.mouseInit().removeListener(this._bound_sel)},onclick:function(e){var t,o,s,n;if(e=e||window.event,s=this.options.allow_multiple&&"ignore"!=this.options.allow_multiple||this.options.ignore_keyclicks?Selection.eventKeys(e):{},this.options.ignore_keyclicks&&(s.multiple||s.range))return!0;var l=Browser.isIE?this.ie_last_button:e.button;if(l>(Browser.isGecko||Browser.isKHTML?0:1))return!0;if(!window.Admin||!Admin.active){Selection.focused=this,t=e.target||e.srcElement;do if(this.isSelectable(t)){if(n=this.isSelected(t),s.multiple||s.range){if(n)this.deselect(t);else{if(s.range&&this.getSelection().length){var r=!1,c=!0,a=this.getAllSelectable();for(i=0;node=a[i];i++){if(node==t){if(c=!1,r)break;r=!0}!r&&c&&this.isSelected(node)&&(r=!0),r&&this.select(node)}}this.select(t)}this.callback&&this.callback(this.getSelection(),[],"click"),o=!0}else{if(this.options.ignore_clicks){o=n&&!this.next_sel_click_volatile,this.next_sel_click_volatile=!0;break}this.setSelection(t,"click"),o=!0}break}while(t!=this.root&&(t=t.parentNode));if(o||this.options.sticky_selection||this.setSelection(null,"click"),this.options.ignore_clicks)return!0;if(t&&t.blur)try{t.blur()}catch(e){}return e.returnValue=!1}},onkeydown:function(e){var t;if(e=e||event,e.ctrlKey||e.metaKey||e.altKey||e.shiftKey)return!0;if((e.target||e.srcElement).tagName in{TEXTAREA:1,INPUT:1})return!0;if((e.target||e.srcElement).isContentEditable||(e.target||e.srcElement).getAttribute("contenteditable"))return!0;if(Selection.focused==this){if(e.keyCode in this.options.include_keyboard)return t=e.keyCode in{37:1,38:1}?-1:1,this.setRelativeSelection(t,1),this.scroll(t),!1;if(27==e.keyCode){if(this.cancel_next_esc)return this.cancel_next_esc=0,!0;setTimeout(this.setSelection.bind(this,null,"keyboard"),1)}}return!0},ieonmousedown:function(e){e=e||window.event,this.ie_last_button=e.buttons||e.button},onmousedown:function(e){var t;if(e=e||window.event,e.button>(Browser.isGecko?0:1));else{for(t=e.target||e.srcElement;t&&t!=document.documentElement&&("DIV"!=t.tagName||t.parentNode.className.indexOf("thumb")>=0||t.className.indexOf("stash-tt-a")>=0||t.className.indexOf("stash-thumb-container")>=0||t.parentNode.parentNode.className.indexOf("wrap")>=0);){if("A"==t.tagName&&0>t.className.indexOf("no-drag"))return!0;if("INPUT"==t.tagName)return!0;t=t.parentNode}if(window.event&&(window.event.cancelBubble=!0),e.stopPropagation&&e.stopPropagation(),DDD.mouseDown.call(this.root,e,this,12,!0))return e.preventDefault&&e.preventDefault(),Popup2.hideAll(),!1}return!0},getAllSelectableRects:function(e,t,i){var o,s,n,l,r,c,a=0;for(l=this.getAllSelectable(),n=[],o=0;s=l[o];o++)(!this.options.skip_first_item||a++)&&(!t||!this.isSelected(s)&&i!==s?(c=this.drag_rect_ruler(s,!0),c.index=o,c.owner=e,c.node=s,t&&r&&(c.offset_mark=1),n.push(c)):r=!0);return n},ddd:{snap:function(e){var t,i,o;for(t=Selection.eventKeys(e),this.drag_data={surfer2:Surfer2.create(e,Ruler.document.pointer(e)),rects:[],initial_selection:[]},this.drag_data.rects="ignore"==this.options.allow_multiple?[]:this.getAllSelectableRects(),i=0;o=(this.drag_data.rects[i]||{}).node;i++)t&&(t.multiple||t.range)&&(this.drag_data.initial_selection[i]=this.isSelected(o));"rectangle"==this.options.allow_multiple&&(this.drag_data.surfer2.node.style.display="block"),window.DDDUtils&&DDDUtils.mix(this),this.dddTickStart&&this.dddTickStart(e)},drag:function(e){var t,i,o;for(this.dddTickUpdate&&this.dddTickUpdate(e),t=Surfer2.update(this.drag_data.surfer2,e),i=0;msg_rect=this.drag_data.rects[i];i++)o=msg_rect.x2>t.x&&t.x2>msg_rect.x&&msg_rect.y2>t.y&&t.y2>msg_rect.y,o^this.drag_data.initial_selection[i]?(this.next_sel_click_volatile=!1,this.select(this.drag_data.rects[i].node)):this.deselect(this.drag_data.rects[i].node)},drop:function(e){this.dddTickEnd&&this.dddTickEnd(e),Surfer2.clear(this.drag_data.surfer2),this.drag_data.surfer2={}}},scroll:function(e,t){var i;i=this.getSelection(),i.length&&(rect=Ruler.document.node(this.root),e>0?(t&&"y"!=t||(this.root.scrollTop=Math.max(this.root.scrollTop,0,Ruler.document.node(i[i.length-1]).y2-(rect.y+rect.h-8))),t&&"x"!=t||(this.root.scrollLeft=Math.max(this.root.scrollLeft,0,Ruler.document.node(i[i.length-1]).x2-(rect.x+rect.w-8)))):(t&&"y"!=t||(this.root.scrollTop=Math.min(this.root.scrollTop,Math.max(0,Ruler.document.node(i[0]).y-rect.y))),t&&"x"!=t||(this.root.scrollLeft=Math.min(this.root.scrollLeft,Math.max(0,Ruler.document.node(i[0]).x-rect.x)))))}}),Selection.eventKeys=function(e){return Browser.isMac&&!Browser.isOpera?{range:e.shiftKey,multiple:e.metaKey}:{range:e.shiftKey,multiple:e.ctrlKey}},Selection.mouseInit=function(){return this._mouse||(this._mouse=new WatchableObject),this._mouse},Selection.mouseCancel=function(e){this._mouse&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.shiftKey&&1>e.button&&this._mouse.broadcast(e)},window.DivOnlySelection=Selection.extend({getAllSelectable:function(){var e,t;for(e=[],t=0;t!=this.root.childNodes.length;t++)"div"==(this.root.childNodes[t].tagName||"").toLowerCase()&&e.push(this.root.childNodes[t]);return e},isSelectable:function(e){return e.parentNode==this.root&&"DIV"==e.tagName}}),window.LinkOnlySelection=Selection.extend({getAllSelectable:function(){return this.root.getElementsByTagName("a")},isSelectable:function(e){return e.parentNode==this.root&&"A"==e.tagName}}),window.DWait&&DWait.run("jms/lib/selection.js")});if(window.DWait){DWait.count()}