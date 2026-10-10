'use client';
export default function assetImageLoader({src,width,quality}:{src:string;width:number;quality?:number}){
 if(!src.startsWith('/media/')||src.endsWith('.svg'))return src;
 const params=new URLSearchParams({key:'website:'+src.slice(7),w:String(width),q:String(quality&&[60,75,85,90].includes(quality)?quality:75)});
 return '/api/assets/image?'+params;
}
