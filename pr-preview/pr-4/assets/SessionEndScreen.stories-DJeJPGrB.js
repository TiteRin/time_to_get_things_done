import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./tasks-DD79alit.js";function i(e){let t=Math.floor(e/1e3),n=Math.floor(t/60),r=t%60;return`${String(n).padStart(2,`0`)}:${String(r).padStart(2,`0`)}`}function a({tasks:e,timeline:t,footer:n}){let r=t[0]?.at??0;return(0,o.jsxs)(`main`,{className:`min-h-dvh bg-slate-900 px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-8 text-slate-50`,children:[(0,o.jsx)(`h1`,{className:`mb-6 text-3xl font-bold`,children:`Session terminée`}),t.length===0?(0,o.jsx)(`p`,{className:`text-slate-400`,children:`Aucune action enregistrée.`}):(0,o.jsx)(`ol`,{"aria-label":`Timeline`,className:`flex flex-col gap-3`,children:t.map((t,n)=>(0,o.jsxs)(`li`,{className:`flex gap-4`,children:[(0,o.jsx)(`span`,{className:`text-slate-400 tabular-nums`,children:i(t.at-r)}),(0,o.jsxs)(`span`,{children:[s[t.type],` · `,e[t.taskIndex]?.name]})]},n))}),n&&(0,o.jsx)(`div`,{className:`mt-8 text-center`,children:n})]})}var o,s;function c(){return(c=e((()=>{o=t(),s={start:`Démarrer`,pause:`Pause`,resume:`Reprise`,complete:`Tâche faite`,finish:`Session terminée`},a.__docgenInfo={description:`Placeholder until the Débriefing screen exists: dumps the raw timeline`,methods:[],displayName:`SessionEndScreen`,props:{tasks:{required:!0,tsType:{name:`Array`,elements:[{name:`Task`}],raw:`Task[]`},description:``},timeline:{required:!0,tsType:{name:`Array`,elements:[{name:`TimelineEntry`}],raw:`TimelineEntry[]`},description:``},footer:{required:!1,tsType:{name:`ReactNode`},description:``}}}})))()}var l,u,d,f;function p(){return(p=e((()=>{r(),c(),l={title:`Exécution/SessionEndScreen`,component:a,args:{tasks:n,timeline:[]}},u={args:{timeline:[{type:`start`,taskIndex:0,at:0},{type:`complete`,taskIndex:0,at:24e4},{type:`start`,taskIndex:1,at:25e4},{type:`pause`,taskIndex:1,at:4e5},{type:`resume`,taskIndex:1,at:52e4},{type:`complete`,taskIndex:1,at:7e5},{type:`start`,taskIndex:2,at:71e4},{type:`finish`,taskIndex:2,at:13e5}]}},d={},f=[`Completed`,`Empty`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    timeline: [{
      type: 'start',
      taskIndex: 0,
      at: 0
    }, {
      type: 'complete',
      taskIndex: 0,
      at: 240_000
    }, {
      type: 'start',
      taskIndex: 1,
      at: 250_000
    }, {
      type: 'pause',
      taskIndex: 1,
      at: 400_000
    }, {
      type: 'resume',
      taskIndex: 1,
      at: 520_000
    }, {
      type: 'complete',
      taskIndex: 1,
      at: 700_000
    }, {
      type: 'start',
      taskIndex: 2,
      at: 710_000
    }, {
      type: 'finish',
      taskIndex: 2,
      at: 1_300_000
    }]
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{}`,...d.parameters?.docs?.source}}}})))()}p();export{u as Completed,d as Empty,f as __namedExportsOrder,l as default};