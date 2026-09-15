import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./taskGrouping-BWB4-72a.js";function i({tasks:e,rooms:t,onSelect:n}){let i=r(e,t);return(0,a.jsx)(`div`,{className:`flex flex-col gap-6`,children:i.map(e=>(0,a.jsxs)(`section`,{children:[(0,a.jsx)(`h2`,{className:`mb-1 text-sm font-medium text-slate-400`,children:e.name}),(0,a.jsx)(`ul`,{className:`flex flex-col divide-y divide-slate-700`,children:e.tasks.map(e=>(0,a.jsx)(`li`,{children:(0,a.jsx)(`button`,{type:`button`,onClick:()=>n?.(e),className:`w-full py-3 text-left font-medium text-slate-100`,children:e.name})},e.id))})]},e.id??`no-room`))})}var a;function o(){return(o=e((()=>{n(),a=t(),i.__docgenInfo={description:``,methods:[],displayName:`TaskList`,props:{tasks:{required:!0,tsType:{name:`Array`,elements:[{name:`Task`}],raw:`Task[]`},description:``},rooms:{required:!0,tsType:{name:`Array`,elements:[{name:`Room`}],raw:`Room[]`},description:``},onSelect:{required:!1,tsType:{name:`signature`,type:`function`,raw:`(task: Task) => void`,signature:{arguments:[{type:{name:`Task`},name:`task`}],return:{name:`void`}}},description:``}}}})))()}var s,c,l,u,d,f;function p(){return(p=e((()=>{o(),s=t(),{fn:c}=__STORYBOOK_MODULE_TEST__,l={title:`Configuration/TaskList`,component:i,args:{rooms:[{id:`salon`,name:`Salon`},{id:`cuisine`,name:`Cuisine`}],onSelect:c()},decorators:[e=>(0,s.jsx)(`div`,{className:`min-h-dvh bg-slate-900 p-6`,children:(0,s.jsx)(e,{})})]},u={args:{tasks:[{id:`t1`,name:`Épousseter`,roomId:`salon`},{id:`t2`,name:`Aspirer`},{id:`t3`,name:`Passer le balai`,roomId:`cuisine`},{id:`t4`,name:`Passer le balai`,roomId:`salon`}]}},d={args:{tasks:[]}},f=[`Filled`,`Empty`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    tasks: [{
      id: 't1',
      name: 'Épousseter',
      roomId: 'salon'
    }, {
      id: 't2',
      name: 'Aspirer'
    }, {
      id: 't3',
      name: 'Passer le balai',
      roomId: 'cuisine'
    }, {
      id: 't4',
      name: 'Passer le balai',
      roomId: 'salon'
    }]
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    tasks: []
  }
}`,...d.parameters?.docs?.source}}}})))()}p();export{d as Empty,u as Filled,f as __namedExportsOrder,l as default};