(this["webpackJsonpquick-snippet"]=this["webpackJsonpquick-snippet"]||[]).push([[96],{750:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return d}));var n=a(16),c=a(6),i=a(386),s=a(0),l=a(15),r=a(52);function d(e){var t=Object(s.useState)(null),a=Object(n.a)(t,2),l=a[0],d=a[1];Object(s.useEffect)((function(){d(e.canvas.toDataURL())}),[e.canvas]);var j=Object(s.useState)(!0),b=Object(n.a)(j,2),p=b[0],h=b[1],O=Object(s.useMemo)((function(){var t="![Code Snippet](".concat(l,")");return p?"[".concat(t,"](").concat(Object(r.b)({code:e.code,settings:e.settings}),")"):t}),[p,l,e.settings,e.code]);return Object(c.jsx)(i.d,{isOpen:!0,title:"Preview",className:"bp3-dark",onClose:e.onClose,style:{width:.8*window.innerWidth},children:Object(c.jsxs)("div",{className:o,children:[Object(c.jsx)("div",{ref:function(t){t&&e.canvas?t.appendChild(e.canvas):e.onClose()},className:u}),Object(c.jsx)("div",{style:{margin:"1rem 0"},children:Object(c.jsx)("small",{children:"(Right click and save image)"})}),Object(c.jsx)(i.e,{label:"Data URI",labelFor:"datauri-input",children:Object(c.jsx)(i.o,{rows:5,id:"datauri-input",placeholder:"Placeholder text",value:null!==l&&void 0!==l?l:"",readOnly:!0,style:{width:"100%"}})}),Object(c.jsx)(i.e,{label:"Markdown",labelFor:"md-input",children:Object(c.jsx)(i.o,{id:"md-input",rows:5,value:O,readOnly:!0,style:{width:"100%"}})}),Object(c.jsx)(i.c,{id:"permalink-md-check",checked:p,onChange:function(e){h(e.currentTarget.checked)},label:"Include permalink in Markdown"})]})})}var o=Object(l.a)({margin:"10px",position:"relative"}),u=Object(l.a)({maxHeight:"300px",width:"100%",overflow:"auto",$nest:{canvas:{margin:"auto"}}})}}]);
//# sourceMappingURL=96.bd874d1d.chunk.js.map