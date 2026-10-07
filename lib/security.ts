import {randomBytes,scryptSync,timingSafeEqual,createHash} from 'node:crypto';
import {db} from './db.ts';
export function hashPassword(password:string){const salt=randomBytes(16).toString('hex');return `${salt}:${scryptSync(password,salt,64).toString('hex')}`;}
export function verifyPassword(password:string,stored:string){const [salt,hash]=stored.split(':');if(!salt||!hash)return false;const expected=Buffer.from(hash,'hex');const actual=scryptSync(password,salt,64);return expected.length===actual.length&&timingSafeEqual(expected,actual);}
export const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
export function createSession(adminId:string){const token=randomBytes(32).toString('hex');db().prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());db().prepare('INSERT INTO sessions VALUES(?,?,?)').run(digest(token),adminId,Date.now()+28800000);return token;}
export function sessionAdmin(token:string|undefined){if(!token||!/^[a-f0-9]{64}$/.test(token))return null;return db().prepare('SELECT a.id,a.email FROM admins a JOIN sessions s ON a.id=s.admin_id WHERE s.token_hash=? AND s.expires_at>?').get(digest(token),Date.now()) as {id:string;email:string}|undefined;}
export function rateLimit(key:string,limit:number,windowMs:number){const now=Date.now();const sql=db();sql.prepare('DELETE FROM rate_limits WHERE reset_at < ?').run(now-windowMs);sql.prepare('INSERT INTO rate_limits VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN reset_at<=? THEN 1 ELSE count+1 END,reset_at=CASE WHEN reset_at<=? THEN excluded.reset_at ELSE reset_at END').run(key,now+windowMs,now,now);return (sql.prepare('SELECT count FROM rate_limits WHERE key=?').get(key) as {count:number}).count<=limit;}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');const expected=process.env.APP_URL||new URL(request.url).origin;return origin===new URL(expected).origin;}
export function clientKey(request:Request){return process.env.TRUST_PROXY==='true'?(request.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown'):'shared';}
export class RequestBodyError extends Error {
 status:number;
 constructor(message:string,status:number){super(message);this.name='RequestBodyError';this.status=status;}
}
export async function readBody(request:Request,max=24000):Promise<unknown>{
 if(request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='application/json')throw new RequestBodyError('Expected JSON',415);
 const reader=request.body?.getReader();if(!reader)throw new RequestBodyError('Missing body',400);
 let length=0;const chunks:Uint8Array[]=[];
 try{
  while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>max){await reader.cancel();throw new RequestBodyError('Request too large',413);}chunks.push(value);}
 }finally{reader.releaseLock();}
 try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw new RequestBodyError('Invalid JSON',400);}
}
