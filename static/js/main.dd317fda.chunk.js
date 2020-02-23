(this["webpackJsonptime-log"]=this["webpackJsonptime-log"]||[]).push([[0],{149:function(e,t,n){},164:function(e,t){},166:function(e,t,n){},167:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(40),i=n.n(o),c=n(23),l=n(4),s=n(5),u=n(33),m=n(29),d=n(34),f=n(84),p=n.n(f),g=n(25),h=n.n(g);n(95);function v(e){return r.a.createElement(c.b,{render:function(t){var n=t.history;return r.a.createElement(p.a,{dropdownMode:"scroll",showMonthDropdown:!0,showYearDropdown:!0,useShortMonthInDropdown:!0,showWeekNumbers:!0,todayButton:"today",dateFormat:"yyyy-MM-dd",selected:e.day,onChange:function(e){e&&(n.push("/days/".concat(h()(e).format("YYYY-MM-DD"))),window.location.reload())}})}})}var y=n(38),b=n(11),E=n(9),k=n.n(E),j=n(15),O=n(16),w=n.n(O),T=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,null,[{key:"saveTimelogs",value:function(t,n){var a=w.a.get(this.STORE_KEY,{});return a[e.timelogKeyFor(t)]=n,w.a.set(e.STORE_KEY,a),n}},{key:"getTimeLogsForDay",value:function(e){var t=w.a.get(this.STORE_KEY,{})[this.timelogKeyFor(e)];return t||[]}},{key:"timelogKeyFor",value:function(e){return h()(e).format("YYYY-MM-DD")}}]),e}();T.STORE_KEY="TimeLog";var S=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,null,[{key:"saveTimeLogsForDay",value:function(){var e=Object(j.a)(k.a.mark((function e(t,n){return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",Promise.resolve(T.saveTimelogs(t,n)));case 1:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"getTimeLogsForDay",value:function(){var e=Object(j.a)(k.a.mark((function e(t){return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",Promise.resolve(T.getTimeLogsForDay(t)));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),L={},x=L.m={symbol:"m",factor:1},N=L.h={symbol:"h",factor:60*x.factor},D=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,null,[{key:"minutesToJiraFormat",value:function(t){var n=Math.abs(t),a="".concat(e.hourPartOf(n)," ").concat(e.minutePartOf(n)).replace(/\s+/," ").trim();return""===a?"0"+x.symbol:t<0?"-"+a:a}},{key:"isValidJiraFormat",value:function(e){var t=Object.keys(L).join();return new RegExp("^-?\\s*((\\d+["+t+"]?(\\s+\\d+["+t+"]?)*?)|(0+))?\\s*$").test(e)}},{key:"jiraFormatToMinutes",value:function(t){if(!e.isValidJiraFormat(t))throw new Error("'"+t+"' is not a valid jira String");var n=t.startsWith("-");return(n?t.substr(1,t.length):t).split(/\s+/).map(e.toMinutes).reduce(C)*(n?-1:1)}},{key:"hoursOf",value:function(e){return Math.floor(e/N.factor)}},{key:"minutesOf",value:function(e){return Math.floor(e%N.factor/x.factor)}},{key:"minutePartOf",value:function(t){return e.unitStringFor(e.minutesOf(t),x)}},{key:"hourPartOf",value:function(t){return e.unitStringFor(e.hoursOf(t),N)}},{key:"unitStringFor",value:function(e,t){return 0===e?"":e+t.symbol}},{key:"toMinutes",value:function(e){return e.trim().match(/^\d+$/)?Number.parseInt(e):Object.keys(L).map((function(e){return L[e]})).map((function(t){var n=e.match(new RegExp("(\\d+)"+t.symbol,"g"));return n?n.map((function(e){return Number.parseInt(e.replace(t.symbol,""),0)*t.factor})).reduce(C):0})).reduce(C)}}]),e}();function C(e,t){return e+t}n(149);var M=n(87),F=n.n(M),I=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,null,[{key:"getExpectedDailyTimelogInMinutes",value:function(){var t=w.a.get(e.settingsObjectKey,e.emptySettings).expectedDailyTimelogInMinutes;return t||null}},{key:"setExpectedDailyTimelogInMinutes",value:function(t){var n=w.a.get(e.settingsObjectKey,e.emptySettings);w.a.set("timelogSettings",Object(b.a)({},n,{expectedDailyTimelogInMinutes:t}))}}]),e}();I.emptySettings={},I.settingsObjectKey="timelogSettings";var U=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,null,[{key:"setExpectedDailyTimelogInMinutes",value:function(){var e=Object(j.a)(k.a.mark((function e(t){return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:I.setExpectedDailyTimelogInMinutes(t);case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},{key:"getExpectedDailyTimelogInMinutes",value:function(){var e=Object(j.a)(k.a.mark((function e(){var t;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return 480,t=I.getExpectedDailyTimelogInMinutes(),e.abrupt("return",Promise.resolve(t||480));case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()}]),e}(),_=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(u.a)(this,Object(m.a)(t).call(this,e))).state={timeLogs:[],isLoadingTimeLogs:!0},n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.setState({isLoadingTimeLogs:!0}),S.getTimeLogsForDay(this.props.day).then((function(n){e.setState({timeLogs:0===n.length?[Object(b.a)({},t.emptyTimelogInput)]:n.map((function(e){return t.toTimelogInput(e)})),isLoadingTimeLogs:!1})})),U.getExpectedDailyTimelogInMinutes().then((function(t){return e.setState({expectedDailyTimeToLogInMinutes:t})}))}},{key:"componentDidUpdate",value:function(e,n){F()(this.state.timeLogs[this.state.timeLogs.length-1],t.emptyTimelogInput)||this.addTimelog()}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{onKeyDown:function(t){t.ctrlKey&&"s"===t.key&&e.store()}},r.a.createElement("form",{target:"_self",onSubmit:function(){return e.isEachTimeLogValid()&&e.store(),!1}},this.state.isLoadingTimeLogs?r.a.createElement("p",null,"Loading..."):r.a.createElement("table",{className:"table table-sm"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",{scope:"col",className:"text-sm-center"},"#"),r.a.createElement("th",{scope:"col",className:"text-sm-center"},"Start Time"),r.a.createElement("th",{scope:"col",className:"text-sm-center"},"Duration ",r.a.createElement("em",null,this.getDurationSumAsJiraFormat())),r.a.createElement("th",{scope:"col",className:"text-sm-center"},"Description"),r.a.createElement("th",{scope:"col",className:"text-sm-center"},"Issue"),r.a.createElement("th",{scope:"col",className:"text-sm-center"},"Notes"),r.a.createElement("th",{scope:"col",className:"text-sm-left"},"Actions"))),r.a.createElement("tbody",null,this.state.timeLogs.map((function(t,n){return r.a.createElement("tr",{key:n},r.a.createElement("th",{className:"text-sm-center",title:"TimeLog "+n},n),r.a.createElement("td",null,r.a.createElement("input",{className:"fullWidth",disabled:!0,title:"start time",placeholder:"09:15"})),r.a.createElement("td",null,r.a.createElement("input",{className:"fullWidth"+(D.isValidJiraFormat(t.duration)?"":" invalid-format alert-danger"),title:"duration",type:"text",placeholder:"5h 15m",value:t.duration,onChange:function(t){return e.updateDuration(n,t.target.value)}})),r.a.createElement("td",null,r.a.createElement("input",{className:"fullWidth",title:"description",type:"text",placeholder:"What did you to here",value:t.description,onChange:function(t){return e.updateDescription(n,t.target.value)}})),r.a.createElement("td",null,r.a.createElement("input",{className:"fullWidth",disabled:!0,title:"issue",placeholder:"e.g. ISSUEID-123"})),r.a.createElement("td",null,r.a.createElement("input",{className:"fullWidth",disabled:!0,title:"notes",placeholder:"Not supposed to get exported"})),r.a.createElement("td",null,r.a.createElement("span",{className:"btn-group actions"},r.a.createElement("button",{className:"btn btn-outline-primary",title:"add before this entry",onClick:function(){return e.addTimelogBefore(n)},type:"button"},r.a.createElement("i",{className:"fa fa-plus-circle"})),n<e.state.timeLogs.length-1?r.a.createElement("button",{className:"btn btn-outline-primary",title:"remove this entry",onClick:function(){return e.removeTimelogAt(n)},type:"button"},r.a.createElement("i",{className:"fa fa-minus-circle"})):r.a.createElement(r.a.Fragment,null))))})),r.a.createElement("tr",null,r.a.createElement("th",{colSpan:7},r.a.createElement("button",{className:"btn btn-primary fullWidth",title:"save",disabled:this.isAnyTimelogInValid(),type:"submit"},r.a.createElement("i",{className:"fa fa-save"})," save")))))),r.a.createElement("section",{className:"stats"},void 0===this.state.expectedDailyTimeToLogInMinutes?r.a.createElement(r.a.Fragment,null):r.a.createElement("label",null,"Time to log by daily expectation: ",r.a.createElement("input",{disabled:!0,title:"time left today only",value:D.minutesToJiraFormat(this.state.expectedDailyTimeToLogInMinutes-this.getDurationSum())}))))}},{key:"addTimelog",value:function(){this.addTimelogBefore(this.state.timeLogs.length+1)}},{key:"store",value:function(){var e=this;S.saveTimeLogsForDay(this.props.day,this.state.timeLogs.slice(0,this.state.timeLogs.length-1).map((function(e){return t.toTimelog(e)}))).then((function(n){return e.setState({timeLogs:n.map((function(e){return t.toTimelogInput(e)}))})}))}},{key:"addTimelogBefore",value:function(e){var n=Object(y.a)(this.state.timeLogs);n.splice(e,0,Object(b.a)({},t.emptyTimelogInput)),this.setState({timeLogs:n})}},{key:"removeTimelogAt",value:function(e){var t=Object(y.a)(this.state.timeLogs);t.splice(e,1),this.setState({timeLogs:t})}},{key:"updateDuration",value:function(e,t){var n=Object(y.a)(this.state.timeLogs);n[e].duration=t,this.setState({timeLogs:n})}},{key:"updateDescription",value:function(e,t){var n=Object(y.a)(this.state.timeLogs);n[e].description=t,this.setState({timeLogs:n})}},{key:"isAnyTimelogInValid",value:function(){return!this.isEachTimeLogValid()}},{key:"isEachTimeLogValid",value:function(){return this.state.timeLogs.map((function(e){return D.isValidJiraFormat(e.duration)})).reduce((function(e,t){return e&&t}),!0)}},{key:"getDurationSumAsJiraFormat",value:function(){return D.minutesToJiraFormat(this.getDurationSum())}},{key:"getDurationSum",value:function(){return this.state.timeLogs.map((function(e){var t=e.duration;return D.isValidJiraFormat(t)?D.jiraFormatToMinutes(t):0})).reduce((function(e,t){return e+t}),0)}}],[{key:"toTimelog",value:function(e){return{description:e.description,durationInMinutes:D.jiraFormatToMinutes(e.duration)}}},{key:"toTimelogInput",value:function(e){var t=e.description,n=e.durationInMinutes;return{description:t,duration:D.minutesToJiraFormat(n)}}}]),t}(r.a.Component);_.emptyTimelogInput={description:"",duration:""};var W=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(u.a)(this,Object(m.a)(t).call(this,e))).state={timeLogs:null},n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"card"},r.a.createElement("div",{className:"card-header d-flex justify-content-center"},r.a.createElement(v,{day:this.props.day})),r.a.createElement("div",{className:"card-body"},r.a.createElement(_,{day:this.props.day})))}}]),t}(r.a.Component),R=function(e){return r.a.createElement("div",null,r.a.createElement("h1",null,"Who told you about this location?"),r.a.createElement("p",null,"Nothing to see here at: ",r.a.createElement("em",null,e.location)))},J=(n(82),n(165),n(32)),P=n(22),A=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,null,[{key:"parse",value:function(e){return this.removeSearchStringOpening(e).split("&").filter((function(e){return e[0]})).map((function(e){return e.split("=")})).map((function(e){var t=Object(P.a)(e,2),n=t[0],a=t[1];return Object(J.a)({},n,a?decodeURIComponent(a):"")})).reduce((function(e,t){return Object(b.a)({},e,{},t)}),{})}},{key:"toSearchString",value:function(e){return Object.keys(e).length?"?"+Object.keys(e).map((function(t){return t+"="+encodeURIComponent(e[t])})).reduce((function(e,t){return e+"&"+t})):"?"}},{key:"removeSearchStringOpening",value:function(e){return e.replace(/^\?/,"")}}]),e}(),V=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,null,[{key:"getUserInfo",value:function(){var e=Object(j.a)(k.a.mark((function e(t){return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch("https://www.googleapis.com/oauth2/v2/userinfo",{method:"GET",headers:{Accept:"application/json",Authorization:"Bearer "+t}}).then((function(e){if(200!==e.status)throw new Error("Cannot get user infos. Request for User infos end with status code "+e.status);return e.json()})).then((function(e){return{email:e.email}})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),B=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,null,[{key:"reload",value:function(){window.location.reload()}},{key:"redirectTo",value:function(e){window.location.href=e}}]),e}(),Y=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,null,[{key:"removeCurrentUser",value:function(){return localStorage.removeItem("user")}},{key:"getCurrentUser",value:function(){return w.a.get("user",null)}},{key:"setCurrentUser",value:function(e){w.a.set("user",e)}}]),e}(),K=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,null,[{key:"logout",value:function(){z.logout(),Y.removeCurrentUser(),B.reload()}},{key:"getCurrentUser",value:function(){return Y.getCurrentUser()}},{key:"getMissingEnvironmentVariables",value:function(){return[]}},{key:"redirectToLogin",value:function(){var e={scope:"email https://www.googleapis.com/auth/drive.file",include_granted_scopes:!0,response_type:"token",state:"/",redirect_uri:"https://marmer.github.io/time-log/login.html",client_id:"431308487392-g08crft09t9iekjm4vn7385nicut8mus.apps.googleusercontent.com"},t="https://accounts.google.com/o/oauth2/v2/auth"+A.toSearchString(e);B.redirectTo(t)}},{key:"setCurrentuser",value:function(e){Y.setCurrentUser(e)}}]),e}(),z=function(){function e(){Object(l.a)(this,e)}return Object(s.a)(e,null,[{key:"logout",value:function(){var e=Object(j.a)(k.a.mark((function e(){var t,n;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=K.getCurrentUser(),e.abrupt("return",n?fetch("https://oauth2.googleapis.com/revoke?token="+(null===(t=K.getCurrentUser())||void 0===t?void 0:t.accessToken),{method:"GET",headers:{"content-type":"application/x-www-form-urlencoded"}}):Promise.resolve());case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"loginBySearchString",value:function(){var e=Object(j.a)(k.a.mark((function e(t){var n;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=A.parse(t),e.abrupt("return",V.getUserInfo(n.access_token).then((function(e){return K.setCurrentuser({email:e.email,accessToken:n.access_token}),{sourceUrl:n.state?n.state:"/"}})).catch((function(e){return Promise.reject(new Error("Not able to login the user. Reason: "+e.message))})));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),G=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(u.a)(this,Object(m.a)(t).call(this,e))).state={},n}return Object(d.a)(t,e),Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this;z.loginBySearchString(this.props.searchString).then((function(t){return e.setState({loginResult:t})})).catch((function(t){return e.setState({loginError:t})}))}},{key:"render",value:function(){var e,t;return this.state.loginResult?r.a.createElement(c.a,{to:null===(e=this.state.loginResult)||void 0===e?void 0:e.sourceUrl}):this.state.loginError?r.a.createElement("div",null,"Error while trying to log you in. Reason: ",null===(t=this.state.loginError)||void 0===t?void 0:t.message):r.a.createElement("div",null,"requesting user data...")}}]),t}(r.a.Component),q=n(88),$=n(20),H=function(){return r.a.createElement("header",null,r.a.createElement("nav",{className:"navbar navbar-dark bg-dark"},r.a.createElement($.b,{to:"/days/today",className:"navbar-brand"},r.a.createElement("img",{src:"/time-log/logo192.png",width:"30",height:"30",className:"d-inline-block align-top",alt:"logo"})," ",q.name),r.a.createElement("div",{className:"navbar-expand"},r.a.createElement("div",{className:"navbar-nav"},r.a.createElement($.c,{to:"/days/today",isActive:function(e,t){return t.pathname.startsWith("/day")},className:"nav-item nav-link",activeClassName:"active"},"Logs"),r.a.createElement($.c,{to:"/settings",className:"nav-item nav-link",activeClassName:"active"},"Settings")))))};function Q(e){return r.a.createElement("div",null,r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"id"),r.a.createElement("th",null,"name"),r.a.createElement("th",null,"content"),r.a.createElement("th",null,"action"))),r.a.createElement("tbody",null,Object.keys(e.files).map((function(t){return e.files[t]})).map((function(t){return r.a.createElement("tr",null,r.a.createElement("td",null,t.id),r.a.createElement("td",null,t.name),r.a.createElement("td",null,t.content),r.a.createElement("td",null,r.a.createElement("button",{onClick:function(){Z(t.id).then((function(){return e.deleteCallback(t)}))}},"delete")))})))))}function X(e){var t;K.getCurrentUser()&&fetch("https://www.googleapis.com/drive/v3/files?=",{method:"GET",headers:{accept:"application/json",authorization:"Bearer "+(null===(t=K.getCurrentUser())||void 0===t?void 0:t.accessToken)}}).then((function(e){if(200!==e.status)throw new Error("bad status code");return e.json()})).then((function(e){return e})).then((function(t){var n=t.files.map((function(e){var t=e.id,n=e.name;return Object(J.a)({},t,{id:t,name:n})})).reduce((function(e,t){return Object(b.a)({},e,{},t)}));e(n),function(e,t){K.getCurrentUser()&&Object.keys(e).forEach((function(n){var a;fetch("https://www.googleapis.com/drive/v3/files/".concat(n,"?alt=media"),{method:"GET",headers:{authorization:"Bearer ".concat(null===(a=K.getCurrentUser())||void 0===a?void 0:a.accessToken)}}).then((function(e){return console.log(e),e.text()})).then((function(a){var r=Object(b.a)({},e);r[n].content=a,t(r)})).catch((function(e){console.log(e)}))}))}(n,e)})).catch((function(e){console.log(e)}))}function Z(e){var t;return fetch("https://www.googleapis.com/drive/v3/files/".concat(e),{method:"DELETE",headers:{accept:"application/json",authorization:"Bearer ".concat(null===(t=K.getCurrentUser())||void 0===t?void 0:t.accessToken)}})}var ee=function(){var e=Object(a.useState)({}),t=Object(P.a)(e,2),n=t[0],o=t[1],i=Object(a.useState)('{\n  "some": "content"\n}'),c=Object(P.a)(i,2),l=c[0],s=c[1],u=Object(a.useState)("".concat(Math.random(),".json")),m=Object(P.a)(u,2),d=m[0],f=m[1];return Object(a.useEffect)((function(){X(o)}),[]),r.a.createElement("div",null,r.a.createElement("label",null,"File List of google drive files List metadata",r.a.createElement(Q,{files:n,deleteCallback:function(e){var t=Object(b.a)({},n);delete t[e.id],o(t)}})),r.a.createElement("button",{onClick:function(){(function(e){return K.getCurrentUser()?Promise.all(Object.keys(e).map((function(e){return Z(e)}))):Promise.resolve()})(n).then((function(){return o({})}))}},"Delete all!"),r.a.createElement("label",null,"File name",r.a.createElement("input",{value:d,onChange:function(e){return f(e.target.value)}})),r.a.createElement("label",null,"File content",r.a.createElement("textarea",{value:l,onChange:function(e){return s(e.target.value)}})),r.a.createElement("button",{onClick:function(){return function(e){var t;return fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",{method:"POST",headers:{accept:"application/json","content-type":"multipart/related; boundary=nice_boundary_name",authorization:"Bearer ".concat(null===(t=K.getCurrentUser())||void 0===t?void 0:t.accessToken)},body:'--nice_boundary_name\nContent-Type: application/json; charset=UTF-8\n\n{\n  "name": "'.concat(e.name,'"\n}\n\n--nice_boundary_name\nContent-Type: application/json; charset=UTF-8\n\n').concat(e.content,"\n\n--nice_boundary_name--")}).then((function(e){console.log(e)})).catch((function(e){console.log(e)}))}({name:d,content:l}).then((function(){return X(o)}))}},"add"))},te=function(){var e=K.getMissingEnvironmentVariables();if(e&&e.length)return r.a.createElement("section",null,r.a.createElement("strong",null,"Server Missconfiguration. Set the following environment variables are not set properly:"),e.map((function(e){return r.a.createElement("div",{key:e},e)})));var t=K.getCurrentUser();return t?r.a.createElement("section",null,r.a.createElement("p",null,t.email),r.a.createElement("button",{onClick:function(){return K.logout()}},"Logout")):r.a.createElement("section",null,r.a.createElement("button",{onClick:function(){return K.redirectToLogin()}},"Login"))};function ne(){return localStorage.getItem("devMode")?r.a.createElement("div",{className:"devMode"},r.a.createElement(te,null),r.a.createElement(ee,null)):r.a.createElement(r.a.Fragment,null)}var ae=function(){var e=Object(a.useState)({value:"Loading...",isLoading:!0}),t=Object(P.a)(e,2),n=t[0],o=t[1];return Object(a.useEffect)((function(){o({isLoading:!0,value:"Loading..."}),U.getExpectedDailyTimelogInMinutes().then((function(e){o({isLoading:!1,value:D.minutesToJiraFormat(e)})}))}),[]),r.a.createElement("div",{className:"card"},r.a.createElement("div",{className:"card-header"},"Day Settings"),r.a.createElement("div",{className:"form-group row card-body"},r.a.createElement("form",{onSubmit:function(e){return U.setExpectedDailyTimelogInMinutes(D.jiraFormatToMinutes(n.value)),!1}},r.a.createElement("label",null,"Expected Time to log per day ",r.a.createElement("input",{id:"expectedTimeToLog",type:"text",className:D.isValidJiraFormat(n.value)?"":" invalid-format alert-danger",disabled:n.isLoading,value:n.value,onChange:function(e){var t=e.target;return o(Object(b.a)({},n,{value:t.value}))},placeholder:"e.g. 7h 30m"})),r.a.createElement("button",{className:"btn btn-primary fullWidth",title:"save",disabled:!D.isValidJiraFormat(n.value),type:"submit"},r.a.createElement("i",{className:"fa fa-save"})," save"))))};var re=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function oe(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}n(166);i.a.render(r.a.createElement($.a,{basename:"time-log"},r.a.createElement((function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(H,null),r.a.createElement(ne,null),r.a.createElement("main",null,r.a.createElement(c.b,{render:function(e){return e.history.listen((function(){return window.location.reload()})),r.a.createElement(c.d,null,r.a.createElement(c.b,{exact:!0,path:"/login/:provider",render:function(e){return r.a.createElement(G,{searchString:e.location.search})}}),r.a.createElement(c.b,{exact:!0,path:"/"},r.a.createElement(c.a,{to:"/days"})),r.a.createElement(c.b,{exact:!0,path:"/days"},r.a.createElement(c.a,{to:"/days/today"})),r.a.createElement(c.b,{exact:!0,path:"/days/today"},r.a.createElement(W,{day:new Date})),r.a.createElement(c.b,{exact:!0,path:"/days/:day",render:function(e){return h()(e.match.params.day).isValid()?r.a.createElement(W,{day:h()(e.match.params.day).toDate()}):r.a.createElement(R,{location:e.location.pathname})}}),r.a.createElement(c.b,{exact:!0,path:"/settings"},r.a.createElement(ae,null)),r.a.createElement(c.b,{render:function(e){return r.a.createElement(R,{location:e.location.pathname})}}))}})))}),null)),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/time-log",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/time-log","/service-worker.js");re?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):oe(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):oe(t,e)}))}}()},88:function(e){e.exports=JSON.parse('{"name":"time-log","version":"0.1.0","private":true,"homepage":"https://marmer.github.io/time-log/","author":{"name":"MarMer"},"license":"GPL3","jest":{"coveragePathIgnorePatterns":["/src/serviceWorker.ts","/src/index.ts",".*__spikes__.*"],"coverageReporters":["cobertura","lcov"]},"dependencies":{"bootstrap":"^4.4.1","font-awesome":"^4.7.0","lockr":"^0.8.5","moment":"^2.24.0","npm":"^6.13.7","react":"^16.12.0","react-datepicker":"^2.11.0","react-dom":"^16.12.0","react-router-dom":"^5.1.2","react-scripts":"3.3.1","typescript":"~3.7.5","deep-equal":"^2.0.1"},"devDependencies":{"@types/deep-equal":"^1.0.1","fetch-mock":"9.0.0-beta.2","node-fetch":"^2.6.0","@types/lockr":"^0.8.6","@testing-library/jest-dom":"5.1.0","@testing-library/react":"^9.3.2","@testing-library/user-event":"^7.1.2","@types/jest":"25.1.1","@types/node":"^12.0.0","@types/react":"^16.9.0","@types/react-datepicker":"^2.10.0","@types/react-dom":"^16.9.0","@types/react-router-dom":"^5.1.3","express":"^4.17.1","express-favicon":"^2.0.1","webpack":"^4.41.5"},"scripts":{"predeploy":"npm run build","start":"react-scripts start","build":"react-scripts build","test":"react-scripts test --coverage","eject":"react-scripts eject","prod":"node server.js"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]},"eslintIgnore":["eslint-disable-next-line"]}')},89:function(e,t,n){e.exports=n(167)}},[[89,1,2]]]);
//# sourceMappingURL=main.dd317fda.chunk.js.map