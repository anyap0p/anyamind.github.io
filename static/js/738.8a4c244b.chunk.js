"use strict";(self.webpackChunkanyas_world=self.webpackChunkanyas_world||[]).push([[738],{222:(e,a,t)=>{t.d(a,{A:()=>c});t(43),t(79);var i=t(621),s=t(579);const c=function(e){let{jumpAnimation:a,moveInAnimation:t}=e;const c=(e,t)=>e.split("").map(((e,i)=>" "===e?(0,s.jsx)("span",{className:"nav-letter"+(a?"animate":""),style:{animationDelay:`${t+.1*i+1}s`},children:"\xa0"},i):(0,s.jsx)("span",{className:"nav-letter"+(a?"animate":""),style:{animationDelay:`${t+.1*i+1}s`},children:e},i)));return(0,s.jsxs)("div",{className:"left-nav-container"+(t?"animate":""),children:[(0,s.jsxs)("div",{className:"top-nav-box",children:[(0,s.jsx)("a",{href:"#/welcome",className:"head-text",children:c("anyamind",2.5)}),(0,s.jsx)("img",{src:i,className:"glitter-on-hover",alt:""})]}),(0,s.jsx)("div",{className:"nav-box",children:(0,s.jsx)("a",{href:"/#/about",style:{animationDelay:"5s"},className:"nav-text",children:c("about",3)})}),(0,s.jsx)("div",{className:"nav-box",children:(0,s.jsx)("a",{href:"/#/art",style:{animationDelay:"8s"},className:"nav-text",children:c("art",3.5)})})]})}},533:(e,a,t)=>{t.r(a),t.d(a,{default:()=>z});var i=t(43),s=t(222),c=t(216);if("undefined"!==typeof window){var n={get passive(){0}};window.addEventListener("testPassive",null,n),window.removeEventListener("testPassive",null,n)}"undefined"!==typeof window&&window.navigator&&window.navigator.platform&&(/iP(ad|hone|od)/.test(window.navigator.platform)||"MacIntel"===window.navigator.platform&&window.navigator.maxTouchPoints);var o=t(579);const d=e=>{let{title:a,body:t,image:s,hoverImage:n,aspectRatio:d,opacityEffect:r,link:l}=e;const[p,m]=(0,i.useState)(!1),[f,h]=(0,i.useState)(!1),[y,g]=(0,i.useState)(0),[u,v]=(0,i.useState)(!1),[b,x]=(0,i.useState)("default"),j=(0,i.useRef)(null),w=(0,c.Zp)(),k=(0,i.useCallback)((()=>{if(!1===r)return void g(1);if(!j.current)return;const e=j.current.getBoundingClientRect(),a=window.innerHeight;if(e.top<a&&e.bottom>0){const t=e.bottom-e.top,i=Math.min(t,2*(Math.min(a,e.bottom)-Math.max(0,e.top)));g(i/t)}else g(0)}),[r,j]);return(0,i.useEffect)((()=>!1===r?(x("default"),void g(1)):(window.addEventListener("scroll",k),k(),()=>window.removeEventListener("scroll",k))),[r,k]),(0,o.jsxs)("div",{ref:j,className:"work-box",style:{opacity:y},children:[u&&(0,o.jsx)("div",{className:"scrollbar-overlay"}),(0,o.jsxs)("div",{className:"work-box-content-container",onMouseEnter:()=>m(!0),onMouseLeave:()=>m(!1),onClick:()=>{l&&w(l)},children:[(0,o.jsxs)("div",{className:"work-title",children:[(0,o.jsx)("h1",{className:"work-header",children:" "}),(0,o.jsx)("h1",{className:"work-header",children:" "}),(0,o.jsx)("h1",{className:"work-header",children:a}),""!==t&&(0,o.jsx)("h3",{className:"work-body",children:t})]}),(0,o.jsx)("div",{className:"work-image-container",style:{aspectRatio:d,cursor:b},children:(0,o.jsx)("img",{className:"work-image",src:p?n:s,alt:""})}),!1]})]})},r=t.p+"static/media/kikisLobby2.c8e2f772e814135bdcbf.jpg",l=t.p+"static/media/kikilobby.a77b10f22da90e18ae28.gif";const p=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"kiki's lobby",body:"",image:r,hoverImage:l,header:"",skillsUsed:"",imageHeight:"40vh",aspectRatio:"4 / 5 ",delayAppearance:"1s",opacityEffect:a,underDevelopment:!0})},m=t.p+"static/media/labyrinth.35b4cebab1363d7191af.jpg",f=t.p+"static/media/labyrinthFast.91757d9fc33a8a8494ac.gif";const h=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"labyrinth",body:"",image:m,hoverImage:f,header:"",skillsUsed:"",delayAppearance:"5s",underDevelopment:!0,opacityEffect:a,imageHeight:"40vh",aspectRatio:"70 / 55"})},y=t.p+"static/media/thePassionOfSoapBracelet.8fa5ce027c83dd9015db.jpg";t(481);const g=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"the passion of soap bracelet",body:"",image:y,hoverImage:y,header:"",skillsUsed:"",delayAppearance:"2s",opacityEffect:a,imageHeight:"40vh",aspectRatio:"1 / 1"})},u=t.p+"static/media/onawalk.e62383a9d3a8501e653e.png",v=t.p+"static/media/onawalk.f7d2b5c8ce73b8b4ed0f.gif";const b=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"on a walk",body:"",image:u,hoverImage:v,header:"",skillsUsed:"",imageHeight:"40vh",aspectRatio:"5 / 4",delayAppearance:"5s",underDevelopment:!1,opacityEffect:a})},x=t.p+"static/media/lawAndRage.543047068c0abddcec9f.PNG";const j=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"law and rage",body:"",image:x,hoverImage:x,header:"",skillsUsed:"",delayAppearance:"5s",underDevelopment:!0,opacityEffect:a,imageHeight:"40vh",aspectRatio:"17 / 22"})},w=t.p+"static/media/ogden.fc5f7031be168f0594df.jpg",k=t.p+"static/media/ogden.46091768b55e7f2f52fd.gif";const E=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"ogden",body:"",image:w,hoverImage:k,header:"",skillsUsed:"",delayAppearance:"3s",opacityEffect:a,imageHeight:"40vh",aspectRatio:"11 / 8"})},N=t.p+"static/media/anyatv.d8277b61a578db65e6d3.png",A=t.p+"static/media/anyatv2.fb0bd28adb3c0654c7c0.gif";const R=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"ANYA.TV",body:"",image:N,hoverImage:A,header:"",skillsUsed:"",imageHeight:"40vh",aspectRatio:"5 / 4",delayAppearance:"1s",opacityEffect:a,underDevelopment:!0})},I=t.p+"static/media/shadowplay.8ff227a895cbcf671aa8.png",T=t.p+"static/media/shadowplay.7a7985945ec5c8685b67.gif";const D=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"shadow play",body:"",image:I,hoverImage:T,header:"",skillsUsed:"",imageHeight:"40vh",aspectRatio:"3 / 1",delayAppearance:"1s",opacityEffect:a,underDevelopment:!0})},H=t.p+"static/media/beast.f17c9a8cc93fcdb9e045.png",U=t.p+"static/media/beast.2418d51153bfceff122b.gif";const S=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"beast",body:"",image:H,hoverImage:U,header:"",skillsUsed:"",imageHeight:"40vh",aspectRatio:"5 / 4",delayAppearance:"1s",opacityEffect:a,underDevelopment:!0})},C=t.p+"static/media/tetrafold.92d9a248a9dee1695a0a.jpg",L=t.p+"static/media/tetrafold.8ccdb0f2ee499c0832a5.gif";const M=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"scenes from home",body:"",image:C,hoverImage:L,header:"",skillsUsed:"",imageHeight:"40vh",aspectRatio:"1 / 1",delayAppearance:"1s",opacityEffect:a,underDevelopment:!0})},P=t.p+"static/media/atthemall.9a8c1e279d6a1ceea464.jpg",B=t.p+"static/media/atthemall.48fd07e08662c2b3debb.gif";const $=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"at the mall",body:"",image:P,hoverImage:B,header:"",skillsUsed:"",imageHeight:"40vh",aspectRatio:"3 / 2",delayAppearance:"1s",opacityEffect:a,underDevelopment:!0})},_=t.p+"static/media/selfpromo.8d10e1b42b96e47885a3.jpg";const F=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"#mybrand",body:"",image:_,hoverImage:_,header:"",skillsUsed:"",imageHeight:"40vh",aspectRatio:"3 / 4",delayAppearance:"1s",opacityEffect:a,underDevelopment:!0})},G=t.p+"static/media/peep.d660adb4969c9ce8df8f.jpg";const O=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"through the blinds",body:"",image:G,hoverImage:G,header:"",skillsUsed:"",imageHeight:"40vh",aspectRatio:"1 / 1",delayAppearance:"1s",opacityEffect:a,underDevelopment:!0})},V=t.p+"static/media/selfportrait.039dc9658755644a2660.png",Y=t.p+"static/media/selfportrait.92213b8770a311128e9a.gif";const Z=function(e){let{opacityEffect:a}=e;return(0,o.jsx)(d,{title:"self portrait",body:"",image:V,hoverImage:Y,header:"",skillsUsed:"",imageHeight:"40vh",aspectRatio:"5 / 3",delayAppearance:"1s",opacityEffect:a,underDevelopment:!0})},q=[{id:0,component:(0,o.jsx)(R,{opacityEffect:!1}),mediaType:["performance","digital media"]},{id:11,component:(0,o.jsx)(g,{opacityEffect:!1}),mediaType:["performance","sculpture"]},{id:8,component:(0,o.jsx)(S,{opacityEffect:!1}),mediaType:["printed works","writing"]},{id:5,component:(0,o.jsx)(D,{opacityEffect:!1}),mediaType:["printed works"]},{id:2,component:(0,o.jsx)(Z,{opacityEffect:!1}),mediaType:["digital media"]},{id:13,component:(0,o.jsx)($,{opacityEffect:!1}),mediaType:["printed works","writing"]},{id:10,component:(0,o.jsx)(h,{opacityEffect:!1}),mediaType:["printed works"]},{id:7,component:(0,o.jsx)(p,{opacityEffect:!1}),mediaType:["printed works"]},{id:4,component:(0,o.jsx)(M,{opacityEffect:!1}),mediaType:["printed works"]},{id:1,component:(0,o.jsx)(j,{opacityEffect:!1}),mediaType:["printed works"]},{id:12,component:(0,o.jsx)(E,{opacityEffect:!1}),mediaType:["sculpture"]},{id:9,component:(0,o.jsx)(F,{opacityEffect:!1}),mediaType:["printed works","sculpture"]},{id:6,component:(0,o.jsx)(O,{opacityEffect:!1}),mediaType:["sculpture"]},{id:3,component:(0,o.jsx)(b,{opacityEffect:!1}),mediaType:["printed works","writing"]}];const z=function(){const[e,a]=(0,i.useState)("all"),t="all"===e?q:q.filter((a=>a.mediaType.includes(e))),c=[[],[],[]];return t.forEach(((e,a)=>{c[a%3].push(e)})),(0,o.jsxs)("div",{className:"page",children:[(0,o.jsx)(s.A,{jumpAnimation:!1,moveInAnimation:!1}),(0,o.jsx)("div",{className:"media-filter",children:["all","sculpture","performance","digital media","printed works","writing"].map((t=>(0,o.jsx)("button",{onClick:()=>a(t),className:e===t?"selected":"",children:t},t)))}),(0,o.jsxs)("sticky-grid-2",{children:[(0,o.jsx)("div",{className:"work-column-1",children:c[0].map((e=>(0,o.jsx)("div",{children:e.component},e.id)))}),(0,o.jsx)("div",{className:"work-column-2",children:c[1].map((e=>(0,o.jsx)("div",{children:e.component},e.id)))}),(0,o.jsx)("div",{className:"work-column-3",children:c[2].map((e=>(0,o.jsx)("div",{children:e.component},e.id)))})]})]})}},79:()=>{},481:(e,a,t)=>{e.exports=t.p+"static/media/altseeingi.e907c4f09f93fc6b1605.gif"},621:(e,a,t)=>{e.exports=t.p+"static/media/pink-sparkles.bddfbb1ddd4cc1e71e7a.png"}}]);
//# sourceMappingURL=738.8a4c244b.chunk.js.map