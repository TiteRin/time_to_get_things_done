import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{f as t}from"./iframe-VtOptyiE.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./tasks-DD79alit.js";import{n as a,t as o}from"./TopMenu-C9ZPwcem.js";function s({onSwipeUp:e,threshold:t=50}){let n=(0,c.useRef)(null),r=(0,c.useRef)(!1);return{onPointerDown:e=>{n.current={x:e.clientX,y:e.clientY},r.current=!1},onPointerUp:i=>{if(!n.current)return;let a=i.clientX-n.current.x,o=n.current.y-i.clientY;n.current=null,o>=t&&o>Math.abs(a)&&(r.current=!0,e())},onPointerCancel:()=>{n.current=null},onClickCapture:e=>{r.current&&(r.current=!1,e.stopPropagation(),e.preventDefault())}}}var c;function l(){return(l=e((()=>{c=t()})))()}function u({task:e,status:t,menuOpen:n,position:r,total:i,onToggle:a,onNext:c,onOpenMenu:l,onCloseMenu:u,onFinish:m,menuExtra:h}){let g=s({onSwipeUp:c}),_=r===i;return(0,d.jsxs)(`main`,{className:`relative grid h-dvh w-full touch-none grid-rows-[20%_1fr_20%] overflow-hidden bg-slate-900 text-slate-50 select-none`,...n?{}:g,children:[(0,d.jsxs)(`button`,{type:`button`,"aria-label":`Afficher le menu`,onClick:l,className:`flex flex-col items-center justify-start gap-1 pt-[max(1rem,env(safe-area-inset-top))] text-slate-400 active:bg-slate-800/50`,children:[(0,d.jsxs)(`span`,{className:`text-sm tabular-nums`,children:[r,` / `,i]}),(0,d.jsx)(`span`,{"aria-hidden":`true`,className:`text-lg leading-none`,children:`⌄`})]}),(0,d.jsxs)(`div`,{className:`relative flex flex-col items-center justify-center gap-6 px-6 text-center`,children:[(0,d.jsx)(`button`,{type:`button`,"aria-label":f[t],onClick:a,className:`absolute inset-0 active:bg-slate-800/30`}),(0,d.jsx)(`h1`,{className:`pointer-events-none relative text-4xl font-bold text-balance transition-opacity ${t===`paused`?`opacity-50`:``}`,children:e.name}),(0,d.jsxs)(`p`,{className:`pointer-events-none relative flex items-center gap-2 text-slate-400`,children:[t===`running`&&(0,d.jsx)(`span`,{"aria-hidden":`true`,className:`size-2 animate-pulse rounded-full bg-emerald-400`}),p[t]]})]}),(0,d.jsxs)(`button`,{type:`button`,"aria-label":`Tâche suivante`,onClick:c,className:`flex flex-col items-center justify-end gap-1 pb-[max(1rem,env(safe-area-inset-bottom))] text-slate-400 active:bg-slate-800/50`,children:[(0,d.jsx)(`span`,{"aria-hidden":`true`,className:`text-lg leading-none`,children:`⌃`}),(0,d.jsx)(`span`,{className:`text-sm`,children:_?`Dernière tâche`:`Tâche suivante`})]}),n&&(0,d.jsx)(o,{onCancel:u,onFinish:m,children:h})]})}var d,f,p;function m(){return(m=e((()=>{a(),l(),d=n(),f={idle:`Démarrer`,running:`Pause`,paused:`Reprendre`},p={idle:`Touchez pour commencer`,running:`En cours`,paused:`En pause`},u.__docgenInfo={description:``,methods:[],displayName:`ExecutionScreen`,props:{task:{required:!0,tsType:{name:`Task`},description:``},status:{required:!0,tsType:{name:`Exclude`,elements:[{name:`SessionStatus`},{name:`literal`,value:`'ended'`}],raw:`Exclude<SessionStatus, 'ended'>`},description:``},menuOpen:{required:!0,tsType:{name:`boolean`},description:``},position:{required:!0,tsType:{name:`number`},description:`1-based position of the task in the session`},total:{required:!0,tsType:{name:`number`},description:``},onToggle:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onNext:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onOpenMenu:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onCloseMenu:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},onFinish:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:``},menuExtra:{required:!1,tsType:{name:`ReactNode`},description:`Extra actions shown at the bottom of the top menu`}}}})))()}var h,g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{i(),m(),{expect:h,fn:g,userEvent:_,within:v}=__STORYBOOK_MODULE_TEST__,y={title:`Exécution/ExecutionScreen`,component:u,args:{task:r[3],status:`idle`,menuOpen:!1,position:1,total:r.length,onToggle:g(),onNext:g(),onOpenMenu:g(),onCloseMenu:g(),onFinish:g()}},b={play:async({canvasElement:e,args:t})=>{let n=v(e);await _.click(n.getByRole(`button`,{name:`Démarrer`})),await h(t.onToggle).toHaveBeenCalledOnce()}},x={args:{status:`running`}},S={args:{status:`paused`}},C={args:{status:`running`,menuOpen:!0},play:async({canvasElement:e,args:t})=>{let n=v(e);await _.click(n.getByRole(`button`,{name:`Terminer`})),await h(t.onFinish).toHaveBeenCalledOnce()}},w={args:{position:r.length,task:r.at(-1)}},T={args:{task:{...r[0],name:`Nettoyer la salle de bain à fond, y compris les joints du carrelage`}}},E=[`Idle`,`Running`,`Paused`,`MenuOpen`,`LastTask`,`LongName`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Démarrer'
    }));
    await expect(args.onToggle).toHaveBeenCalledOnce();
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'running'
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'paused'
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'running',
    menuOpen: true
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {
      name: 'Terminer'
    }));
    await expect(args.onFinish).toHaveBeenCalledOnce();
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    position: sampleTasks.length,
    task: sampleTasks.at(-1)!
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    task: {
      ...sampleTasks[0],
      name: 'Nettoyer la salle de bain à fond, y compris les joints du carrelage'
    }
  }
}`,...T.parameters?.docs?.source}}}})))()}D();export{b as Idle,w as LastTask,T as LongName,C as MenuOpen,S as Paused,x as Running,E as __namedExportsOrder,y as default};