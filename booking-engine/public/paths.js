export const base=new URL(document.baseURI).pathname.replace(/\/$/,'');
export const path=()=>location.pathname.slice(base.length)||'/';
export const link=value=>base+value;
export const asset=value=>value?.startsWith('/assets/')?'.'+value:value;
