"use strict";var _slicedToArray=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],a=!0,o=!1,i=void 0;try{for(var l,s=e[Symbol.iterator]();!(a=(l=s.next()).done)&&(n.push(l.value),!t||n.length!==t);a=!0);}catch(e){o=!0,i=e}finally{try{!a&&s.return&&s.return()}finally{if(o)throw i}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var getHtmlElement=function(e){return document.querySelector(e)},addClass=function(e,t){e.classList.add(t)},removeClass=function(e,t){e.classList.remove(t)},toggleClass=function(e,t){e.classList.toggle(t)},renderBox=getHtmlElement(".markdown-body"),textarea=getHtmlElement("textarea"),mainSection=getHtmlElement("section.main"),historySection=getHtmlElement("section.history"),settingsSection=getHtmlElement("section.settings"),notelistSection=getHtmlElement("section.notelist"),noteaddSection=getHtmlElement("section.notes-add"),noteeditSection=getHtmlElement("section.notes-edit"),rawText=localStorage.getItem("rawText"),activeModals=[],saveHistory=void 0,sectionMainEventListener=void 0,converter=void 0,toggleDisplay=function(e){e?(removeClass(textarea,"nodisplay"),addClass(renderBox,"nodisplay")):(addClass(textarea,"nodisplay"),removeClass(renderBox,"nodisplay"))},moveCaretToStart=function(){if("number"==typeof textarea.selectionStart)textarea.selectionStart=textarea.selectionEnd=0;else if(void 0!==textarea.createTextRange){textarea.focus();var e=textarea.createTextRange();e.collapse(!0),e.select()}},show=function(){toggleDisplay(0),moveCaretToStart(),textarea.focus(),textarea.scrollTop=0;var e=textarea.value,t=converter.makeHtml(e);renderBox.innerHTML=t},edit=function(){toggleDisplay(1),moveCaretToStart(),textarea.focus(),textarea.scrollTop=0},save=function(){toggleDisplay(0);var e=textarea.value,t=converter.makeHtml(e);if(renderBox.innerHTML=t,t!==converter.makeHtml(rawText))if("default"===lastOpenedNote)localStorage.setItem("rawText",e),localStorage.setItem("lastEdited",new Date),rawText=e,saveHistory&&setHistory();else{var n=localStorage.getItem("notes");if(null!==n){var a=JSON.parse(n);if(lastOpenedNote in a){var o=a[lastOpenedNote];o.rawText=e,rawText=e,o.lastEdited=new Date,a[lastOpenedNote]=o,o.history=updateNoteHistory(o),localStorage.setItem("notes",JSON.stringify(a))}}}},getNote=function(e){var t=localStorage.getItem("notes");if(null!==t){var n=JSON.parse(t);if(e in n)return n[e]}return null},setNoteHistory=function(e){var t=localStorage.getItem("notes");if(null!==t){var n=JSON.parse(t);if(lastOpenedNote in n)n[lastOpenedNote].history=e,localStorage.setItem("notes",JSON.stringify(n))}},updateNoteHistory=function(e){var t=e.history,n={date:new Date,text:rawText};return t.unshift(n),t},getNoteHistory=function(){if("default"===lastOpenedNote)return getHistory();var e=localStorage.getItem("notes");if(null!==e){var t=JSON.parse(e);if(lastOpenedNote in t)return t[lastOpenedNote].history}return[]},getHistory=function(){var e=localStorage.getItem("history");return null===e?[]:JSON.parse(e)},setHistory=function(){var e=getHistory(),t={date:new Date,text:rawText};e.unshift(t),localStorage.setItem("history",JSON.stringify(e))},displayMarkdown=function(e){var t=decodeURIComponent(escape(atob(e.getAttribute("data-text")))),n=e.children[1],a=e.children[2];n.innerHTML=converter.makeHtml(t),removeClass(n,"nodisplay"),addClass(a,"nodisplay")},displayTextarea=function(e){var t=decodeURIComponent(escape(atob(e.getAttribute("data-text")))),n=e.children[1],a=e.children[2];addClass(n,"nodisplay"),removeClass(a,"nodisplay"),a.innerHTML=t},populateHistoryHtml=function e(){var t="",n="default"===lastOpenedNote?getHistory():getNoteHistory(),a=n.length;n.map(function(e,n){var o=new Date(Date.parse(e.date)),i=o.toDateString().slice(4)+", "+o.toTimeString().slice(0,8),l=btoa(unescape(encodeURIComponent(e.text)));t+="<div class='item' data-text='"+l+"'>\n                <div class='label flex'>\n                    <div>\n                        <p class='id'>#"+(a-n)+"</p>\n                        <p class='date'>"+i+"</p>\n                    </div>\n                    <div class='noselect flex'>\n                        <div class='button'>\n                            <img class='nodrag' src='/assets/svg/bin.svg'/>\n                        </div>\n                        <div class='button'>\n                            <img class='nodrag' src='/assets/svg/view.svg'/>\n                        </div>\n                    </div>\n                </div>\n                <div class='markdown-body'></div>\n                <textarea class='nodisplay' readonly></textarea>\n            </div>"}),getHtmlElement("section.history .list").innerHTML=t,[].concat(_toConsumableArray(document.querySelectorAll("section.history .item"))).reverse().map(function(t,o){displayMarkdown(t);var i=_slicedToArray(t.children[0].children[1].children,2),l=i[0],s=i[1];l.addEventListener("click",function(){n.splice(a-o-1,1),"default"===lastOpenedNote?localStorage.setItem("history",JSON.stringify(n)):setNoteHistory(n),e()}),s.addEventListener("click",function(){t.children[2].classList.contains("nodisplay")?displayTextarea(t):displayMarkdown(t)})})},getSettings=function(){var e=localStorage.getItem("settings");return null===e?null:JSON.parse(e)},setSettings=function(e,t){var n=getSettings();null===n?n={saveHistory:!0,enablePowerMode:!0,PowerModeColor:!1,PowerModeShake:!1}:n[e]=t,localStorage.setItem("settings",JSON.stringify(n))},settingsControl=function e(){var t=getSettings(),n=document.querySelectorAll("section.settings .item");[].concat(_toConsumableArray(n)).map(function(n){var a=n.getAttribute("data-setting"),o=t[a];removeClass(n,o?"off":"on"),addClass(n,o?"on":"off"),n.onclick=function(){setSettings(a,!o),e()}}),applySettings()},applySettings=function(){var e=getSettings();saveHistory=e.saveHistory,e.enablePowerMode?textarea.addEventListener("input",POWERMODE,!1):textarea.removeEventListener("input",POWERMODE,!1),POWERMODE.colorful=e.PowerModeColor,POWERMODE.shake=e.PowerModeShake},openModal=function(e,t){t&&t(),-1===activeModals.indexOf(e)&&activeModals.push(e),1===activeModals.length?(removeClass(e,"z-index-3"),addClass(e,"z-index-2")):2===activeModals.length&&(removeClass(e,"z-index-2"),addClass(e,"z-index-3")),removeClass(e,"nodisplay"),removeClass(mainSection,"noblur"),addClass(mainSection,"blur"),sectionMainEventListener||(sectionMainEventListener=!0,mainSection.addEventListener("click",function(){return closeModal(activeModals)},!1))},closeModal=function e(t){t.constructor===Array?t.map(function(t){return e(t)}):(-1!==activeModals.indexOf(t)&&activeModals.splice(activeModals.indexOf(t),1),addClass(t,"nodisplay")),0===activeModals.length&&(removeClass(mainSection,"blur"),addClass(mainSection,"noblur"))},dragModal=function(e){var t=getHtmlElement("section."+e),n=0,a=0,o=0,i=0,l=function(e){(e=e||window.event).preventDefault(),n=o-e.clientX,a=i-e.clientY,o=e.clientX,i=e.clientY,t.style.top=t.offsetTop-a+"px",t.style.left=t.offsetLeft-n+"px"},s=function e(){document.removeEventListener("mouseup",e,!1),document.removeEventListener("mousemove",l,!1)};getHtmlElement("section."+e+" .header").addEventListener("mousedown",function(e){(e=e||window.event).preventDefault(),o=e.clientX,i=e.clientY,document.addEventListener("mouseup",s,!1),document.addEventListener("mousemove",l,!1)},!1)},timeDisplay=function(){var e=getHtmlElement("#time");setInterval(function(){var t=new Date,n=(t.getDate()<10?"0"+t.getDate():t.getDate())+"/"+(t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1)+"/"+(t.getFullYear()<10?"0"+t.getFullYear():t.getFullYear())+" - "+(t.getHours()<10?"0"+t.getHours():t.getHours())+":"+(t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes())+":"+(t.getSeconds()<10?"0"+t.getSeconds():t.getSeconds());e.innerHTML="&nbsp;-&nbsp;"+n},1e3)},initiate=function(){setSettings(),settingsControl(),(converter=new showdown.Converter({simplifiedAutoLink:!0,excludeTrailingPunctuationFromURLs:!0,strikethrough:!0,tables:!0,tasklist:!0,ghCodeBlocks:!0,smoothLivePreview:!0,smartIndentationFix:!0,simpleLineBreaks:!0,openLinksInNewWindow:!0,emoji:!0})).setFlavor("github"),populateNotes();getHtmlElement("#name").innerHTML="Default";var e=localStorage.getItem("lastOpened");if(null===e||"default"===e)textarea.value=null===rawText?"# Hello, world!\n\nStart editing right now by clicking the *edit* button or pressing <kbd>"+(navigator.platform.match("Mac")?"Cmd":"Ctrl")+"</kbd> + <kbd>X</kbd>.\n\nTo save the file click the *save* button or press <kbd>"+(navigator.platform.match("Mac")?"Cmd":"Ctrl")+"</kbd> + <kbd>S</kbd>.\n\nCheers!":rawText,save();else{var t=getNote(e);null!==t&&switchNote(t)}dragModal("history"),dragModal("settings"),timeDisplay(),setInterval(function(){var e=localStorage.getItem("lastEdited");"default"!==lastOpenedNote&&(e=getNote(lastOpenedNote).lastEdited),getHtmlElement("#lastEdited").innerHTML="Last edited: "+timeago().format(Date.parse(e))},1e3),getHtmlElement("#edit").addEventListener("click",function(){edit()},!1),getHtmlElement("#save").addEventListener("click",function(){save()},!1),getHtmlElement("#lastEdited").addEventListener("click",function(){openModal(historySection,populateHistoryHtml)},!1),getHtmlElement("#closeHistory").addEventListener("click",function(){closeModal(historySection)},!1),getHtmlElement("#settings").addEventListener("click",function(){openModal(settingsSection,settingsControl)},!1),getHtmlElement("#closeSettings").addEventListener("click",function(){closeModal(settingsSection)},!1),getHtmlElement("#settings-add").addEventListener("click",function(){toggleClass(notelistSection,"nodisplay")},!1),getHtmlElement("#closeNotesAdd").addEventListener("click",function(){closeModal(noteaddSection)},!1),getHtmlElement("#closeNotesEdit").addEventListener("click",function(){closeModal(noteeditSection)},!1),getHtmlElement("#note-submit").addEventListener("click",function(){addNote()},!1),getHtmlElement("#name").addEventListener("click",function(){editNoteMetaData()},!1),document.addEventListener("keydown",function(e){(navigator.platform.match("Mac")?e.metaKey:e.ctrlKey)?83===e.keyCode?(e.preventDefault(),save()):88===e.keyCode&&textarea.classList.contains("nodisplay")&&(e.preventDefault(),edit()):27===e.keyCode&&activeModals.length>0&&closeModal([].concat(activeModals).pop())},!1)},editNoteMetaData=function(){if("default"===lastOpenedNote)alert("Default Note cannot be modifed!");else{var e=getNote(lastOpenedNote);if(null===e)return;getHtmlElement("#note-edit-name").value=e.name,openModal(noteeditSection),getHtmlElement("#note-name-submit").addEventListener("click",function(){e.name=getHtmlElement("#note-edit-name").value;var t=localStorage.getItem("notes");if(null!=t){var n=JSON.parse(t);e.id in n&&(n[e.id]=e),localStorage.setItem("notes",JSON.stringify(n)),switchNote(e)}closeModal(noteeditSection),populateNotes()}),getHtmlElement("#note-delete").addEventListener("click",function(){e.name=getHtmlElement("#note-edit-name").value;var t=localStorage.getItem("notes");if(null!=t){var n=JSON.parse(t);e.id in n&&(delete n[e.id],localStorage.setItem("notes",JSON.stringify(n)),switchToDefaultNote())}closeModal(noteeditSection),populateNotes()})}},populateNotes=function(){var e="",t=localStorage.getItem("notes");[].concat(_toConsumableArray(document.querySelectorAll("section.notelist .item"))).reverse().map(function(e,t){"note"===e.getAttribute("data-setting")&&e.remove()}),null!==t&&t.length>0&&(t=JSON.parse(t),Object.keys(t).map(function(n,a){var o=t[n].name,i=t[n].id;e+='<div class="item flex" data-setting="note" id='+i+'><div class="main flex"><label>'+o+"</label></div></div>"})),getHtmlElement("section.notelist").innerHTML+=e,[].concat(_toConsumableArray(document.querySelectorAll("section.notelist .item"))).reverse().map(function(e,t){"note"===e.getAttribute("data-setting")?e.addEventListener("click",function(){var t=getNote(e.id);null!==t?switchNote(t):alert("Error Fetching Note with name: "+e.innerHTML)}):"notelist-default"==e.id&&e.addEventListener("click",function(){switchToDefaultNote()})}),getHtmlElement("#notelist-add-note").addEventListener("click",function(){openModal(noteaddSection,hideNoteAddSection)},!1)},hideNoteAddSection=function(){addClass(notelistSection,"nodisplay")},switchToDefaultNote=function(){var e={id:"default",name:"Default"};e.rawText=localStorage.getItem("rawText"),switchNote(e)},switchNote=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];lastOpenedNote=e.id,textarea.value=e.rawText,getHtmlElement("#name").innerHTML=""+e.name,t?edit():show(),hideNoteAddSection(),localStorage.setItem("lastOpened",lastOpenedNote)},lastOpenedNote="default",addNote=function(){var e=getHtmlElement("#note-add-name").value,t=localStorage.getItem("notes");if(t=null===t?{}:JSON.parse(t),null!==e&&e.length>0){var n={};n.name=e,n.id="note_id_"+(new Date).getTime(),n.rawText="Click to start editing!",n.history=[],n.lastEdited=new Date,t[n.id]=n,localStorage.setItem("notes",JSON.stringify(t)),closeModal(noteaddSection),switchNote(n,!0),populateNotes()}};initiate();