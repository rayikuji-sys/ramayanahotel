export function bridgeKey():string;
export function trustedBridge(headers:Record<string,string|undefined>):boolean;
export function bridgeActor(headers:Record<string,string|undefined>):{id:string;email:string;role:string;website:boolean}|null;
