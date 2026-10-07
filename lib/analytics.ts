export function track(event:string,parameters:Record<string,string|number>={}){if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('ramayana:analytics',{detail:{event,parameters}}));}
