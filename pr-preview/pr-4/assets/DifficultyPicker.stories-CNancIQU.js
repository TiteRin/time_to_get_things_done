import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./DifficultyPicker-BcNQY_qu.js";var i,a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{n(),i=t(),{useArgs:a}=__STORYBOOK_MODULE_PREVIEW_API__,{expect:o,fn:s,userEvent:c,within:l}=__STORYBOOK_MODULE_TEST__,u={title:`Configuration/DifficultyPicker`,component:r,args:{onChange:s()},decorators:[e=>(0,i.jsx)(`div`,{className:`min-h-dvh bg-slate-900 p-6`,children:(0,i.jsx)(e,{})})],render:function(e){let[,t]=a();return(0,i.jsx)(r,{...e,onChange:n=>{e.onChange(n),t({value:n})}})}},d={play:async({canvasElement:e,args:t})=>{await c.click(l(e).getByRole(`button`,{name:`Moyen`})),await o(t.onChange).toHaveBeenCalledWith(`medium`)}},f={args:{value:`hard`}},p=[`Empty`,`Selected`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    await userEvent.click(within(canvasElement).getByRole('button', {
      name: 'Moyen'
    }));
    await expect(args.onChange).toHaveBeenCalledWith('medium');
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    value: 'hard'
  }
}`,...f.parameters?.docs?.source}}}})))()}m();export{d as Empty,f as Selected,p as __namedExportsOrder,u as default};