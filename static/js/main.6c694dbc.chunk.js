(this.webpackJsonpwebnovel=this.webpackJsonpwebnovel||[]).push([[0],{41:function(e,t,a){},60:function(e,t,a){},69:function(e,t,a){},71:function(e,t,a){},72:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(17),o=a.n(r),c=(a(41),a(14)),i=a(8),l=a(9),u=a(11),p=a(10),j=a(2),h=a(20),b=a.n(h),d=(a(60),a(1)),O=function(e){Object(u.a)(a,e);var t=Object(p.a)(a);function a(e){var n;return Object(i.a)(this,a),(n=t.call(this,e)).state={showMenu:!1,userName:"\ub85c\uadf8\uc778 \ub418\uc9c0 \uc54a\uc740 \uc0ac\uc6a9\uc790",userToken:0,userTokenP:0,priceModalOpen:!1,loginModalOpen:!1,user:!1},n}return Object(l.a)(a,[{key:"render",value:function(){return Object(d.jsx)("header",{children:Object(d.jsx)(c.b,{to:"/",children:Object(d.jsx)("span",{class:"logo",children:"Bloger"})})})}}]),a}(n.Component),g=a(23),f=a.n(g),v=a(35),x=a(24),m=a(15),k=a(74),C=a(16),y=(a(68),a(69),function(e){Object(u.a)(a,e);var t=Object(p.a)(a);function a(){var e;return Object(i.a)(this,a),(e=t.call(this)).state={input:"",output:"",outputBeforeTlanslate:"",outputAfterTlanslate:"",loading:!1,story:""},e.handleChange=e.handleChange.bind(Object(m.a)(e)),e.requestcontents=e.requestcontents.bind(Object(m.a)(e)),e}return Object(l.a)(a,[{key:"handleChange",value:function(e){e.target.value.length<20&&"Main_Events"===e.target.name||e.target.value.split(" ").length<7?this.setState(Object(x.a)({},e.target.name,e.target.value)):C.b.error("\ud83e\udd84 ".concat(e.target.value.split(" ").length,"\ub2e8\uc5b4\ub97c \ub118\uc5b4\uac08 \uc218 \uc5c6\uc5b4\uc694!"),{position:"top-right",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0})}},{key:"requestcontents",value:function(){var e=Object(v.a)(f.a.mark((function e(t){var a,n=this;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(""!=(a=this.state.story)){e.next=4;break}return C.b.error("\uc8fc\uc81c\ub97c \uc785\ub825\ud574 \uc8fc\uc138\uc694!",{position:"top-right",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0}),e.abrupt("return");case 4:this.setState({loading:!0}),b.a.post("".concat("https://appplatform.cafe24.com:5001/api/v1","/blog"),{Story:a},{headers:{timeout:1e5}}).then((function(e){console.log(e.data),n.setState({outputAfterTlanslate:e.data[0]}),n.setState({outputBeforeTlanslate:e.data[1]}),n.setState({loading:!1})})).catch((function(e){412===e.response.status&&(n.setState({loading:!1}),C.b.error("\ub2e4\uc2dc \uc2dc\ub3c4\ud574 \uc8fc\uc138\uc694!",{position:"top-right",autoClose:3e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0}))}));case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){return Object(d.jsxs)(n.Fragment,{children:[Object(d.jsx)("div",{class:"mainpage",children:Object(d.jsxs)("div",{class:"main",children:[this.state.loading?Object(d.jsxs)("div",{class:"loading",children:[" ",Object(d.jsx)(k.a,{size:"8px",color:"#3b2479"})," "]}):null,Object(d.jsx)("textarea",{class:"sub_input_text",value:this.state.story,onChange:this.handleChange,name:"story",placeholder:"\uc8fc\uc81c"}),Object(d.jsx)("button",{class:"start",onClick:this.requestcontents,children:"\ub9cc\ub4e4\uae30"}),Object(d.jsxs)("div",{class:"outputDiv",children:[Object(d.jsx)("textarea",{class:"output",value:this.state.outputAfterTlanslate,onChange:this.handleStory,readOnly:!0}),Object(d.jsx)("textarea",{class:"output_right",value:this.state.outputBeforeTlanslate,readOnly:!0})]})]})}),Object(d.jsx)(C.a,{position:"top-right",autoClose:3e3,hideProgressBar:!1,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!1,draggable:!0,pauseOnHover:!0})]})}}]),a}(n.Component)),S=(a(71),function(e){Object(u.a)(a,e);var t=Object(p.a)(a);function a(){return Object(i.a)(this,a),t.apply(this,arguments)}return Object(l.a)(a,[{key:"render",value:function(){return Object(d.jsx)("footer",{children:Object(d.jsxs)("p",{class:"info",children:[Object(d.jsx)("a",{href:"mailto:support@appplatform.co.kr",class:"email",children:"support@appplatform.co.kr "}),"\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",Object(d.jsx)("a",{href:"https://www.notion.so/appplatform/d99f247a66d141bbbdf227739861a0a2",class:"email",children:" \uac1c\uc778\uc815\ubcf4 \ucc98\ub9ac\ubc29\uce68"}),Object(d.jsx)("br",{}),"Address: #702 BS B/D seocho-daero 334 ,Seocho-gu, Seoul, Korea",Object(d.jsx)("br",{}),"\u321cAppplatform 115-87-01388 \ub300\ud45c \uae40\ucd98\ub0a8 115-87-01388  02-6959-4330",Object(d.jsx)("br",{}),"\xa9Appplatform, Inc All Rights Reserved"]})})}}]),a}(n.Component)),w=function(){return Object(d.jsxs)("div",{children:[Object(d.jsx)(O,{}),Object(d.jsx)(y,{}),Object(d.jsx)(S,{})]})},B=function(e){Object(u.a)(a,e);var t=Object(p.a)(a);function a(){return Object(i.a)(this,a),t.apply(this,arguments)}return Object(l.a)(a,[{key:"render",value:function(){return Object(d.jsx)("div",{children:Object(d.jsx)(j.a,{exact:!0,path:"/",component:w})})}}]),a}(n.Component),T=function(){return Object(d.jsx)(c.a,{children:Object(d.jsx)(B,{})})};o.a.render(Object(d.jsx)(s.a.StrictMode,{children:Object(d.jsx)(T,{})}),document.getElementById("root"))}},[[72,1,2]]]);
//# sourceMappingURL=main.6c694dbc.chunk.js.map