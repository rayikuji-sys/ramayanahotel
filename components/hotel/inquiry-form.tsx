'use client';
import {LocalizedText as T} from '@/components/hotel/language-provider';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,CheckCircle2,LoaderCircle} from 'lucide-react';
import type {HotelSettings,Inquiry} from '@/lib/types';
import {ContactReservationProvider} from '@/lib/booking';
import {track} from '@/lib/analytics';
import {useLanguage} from './language-provider';
import {translateText} from '@/lib/translations';
export function InquiryForm({kind='reservation',settings,room='',context={},onComplete}:{kind?:Inquiry['kind'];settings:HotelSettings;room?:string;context?:Record<string,string|number>;onComplete?:(id:string)=>void}){
 const {locale}=useLanguage();
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [reference,setReference]=useState('');
 const links=ContactReservationProvider.channels(settings,`Hello Ramayana Hotel, I would like to ask about ${room||kind}.`);
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setError('');setBusy(true);const f=new FormData(e.currentTarget);const extra={...context};if(kind==='reservation'){if(room)extra.room=room;extra.checkIn=String(f.get('checkIn'));extra.checkOut=String(f.get('checkOut'));extra.guests=Number(f.get('guests'));}
 try{const response=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind,name:f.get('name'),email:f.get('email'),phone:f.get('phone'),message:f.get('message')||'',website:f.get('website')||'',consent:f.get('consent')==='on',source:window.location.pathname,context:extra})});const result=await response.json();if(!response.ok)throw new Error(result.error);setReference(result.id);track(`${kind}_lead_submit`);onComplete?.(result.id);}catch(err){setError(err instanceof Error?err.message:'Unable to send. Please try again.');}finally{setBusy(false);}}
 if(reference)return <div className="success-panel" role="status"><CheckCircle2 size={42}/><p className="eyebrow"><T>REQUEST RECEIVED</T></p><h3><T>We look forward to talking.</T></h3><p><T>Your reference is </T><strong><T>{reference}</T></strong><T>. Our team will review your request and contact you to confirm the details.</T></p><p className="fine"><T>This is a request, not a confirmed reservation or quotation.</T></p><a className="button" href={ContactReservationProvider.channels(settings,`Hello, please follow up my ${kind} request ${reference}.`).whatsapp} target="_blank" rel="noreferrer"><T>Follow up on WhatsApp </T><ArrowUpRight size={17}/></a></div>;
 return <form className="inquiry-form" onSubmit={submit}>
 {kind==='reservation'&&<><p className="form-note">{room?`Your room preference: ${room}. `:''}<T>Send your dates and our team will confirm availability and rates.</T></p><div className="form-grid"><label><T>Arrival</T><input name="checkIn" type="date" required/></label><label><T>Departure</T><input name="checkOut" type="date" required/></label><label><T>Guests</T><input name="guests" type="number" min="1" max="2000" defaultValue="2" required/></label></div></>}
 <div className="form-grid"><label><T>Your name</T><input name="name" autoComplete="name" required minLength={2} maxLength={100}/></label><label><T>Phone / WhatsApp</T><input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30}/></label><label className="span-two"><T>Email</T><input name="email" type="email" autoComplete="email" required maxLength={254}/></label></div>
 <label><T>Anything we should know?</T><textarea name="message" rows={3} maxLength={3000} placeholder={translateText('Anything we should know?',locale)}/></label>
 <label className="honeypot" aria-hidden="true"><T>Website</T><input name="website" tabIndex={-1} autoComplete="off"/></label>
 <label className="check-label"><input name="consent" type="checkbox" required/><span><T>I agree that Ramayana Hotel may use these details to respond to my request. </T><Link href="/privacy"><T>Privacy information</T></Link></span></label>
 {error&&<p className="error-message" role="alert"><T>{error}</T></p>}
 <button className="button" disabled={busy} type="submit">{busy?<><LoaderCircle size={18} className="spin"/><T>Sending…</T></>:<><T>Send request</T><ArrowUpRight size={18}/></>}</button>
 <p className="fine"><T>Prefer to talk? </T><a href={links.phone}><T>Call us</T></a><T> · </T><a href={links.whatsapp} target="_blank" rel="noreferrer"><T>WhatsApp</T></a><T> · </T><a href={links.email}><T>Email</T></a></p>
 </form>;
}
