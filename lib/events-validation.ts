import {z} from 'zod';
import {savedLayoutSchema} from './planner-model.ts';
import {layouts,eventTypes,makassarDate} from './events-model.ts';
const text=z.string().trim().max(300);
export const eventDate=z.string().refine(v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v,'Tanggal tidak valid.');
const optionalDate=eventDate.or(z.literal(''));
const time=z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).or(z.literal(''));
export const proposalSchema=z.object({
 setupType:z.enum(['hotel-recommendation','standard','custom']).default('hotel-recommendation'),customLayout:savedLayoutSchema.nullable().optional(),
 mode:z.enum(['proposal','site-inspection','group-stay']),
 name:z.string().trim().min(2,'Nama minimal 2 karakter.').max(100),company:text,position:text,
 email:z.string().trim().email('Email tidak valid.').max(254),phone:z.string().min(7).max(30).regex(/^[+\d\s().-]+$/),
 preferredContact:z.enum(['WhatsApp','Email','Telepon']),eventName:text,eventType:z.enum(eventTypes),
 date:eventDate,alternativeDate:optionalDate,startTime:time,endTime:time,
 guests:z.number().int().min(1).max(2000),venue:text,packageId:text,campaignId:text,
 layout:z.enum(layouts),duration:text,requirements:z.array(z.enum(['meeting','coffee-break','lunch','dinner','BBQ','LCD','sound','microphone','flipchart','whiteboard','podium','decor','entertainment','MC'])).max(14),
 accommodation:z.boolean(),rooms:z.number().int().min(0).max(77),checkIn:optionalDate,checkOut:optionalDate,roomType:text,
 budgetPerPerson:z.number().min(0).max(1000000000),budgetTotal:z.number().min(0).max(100000000000),
 visitDate:optionalDate,visitTime:time,message:z.string().trim().max(3000),
 consent:z.literal(true,{errorMap:()=>({message:'Persetujuan penggunaan data diperlukan.'})}),website:z.literal(''),source:z.string().max(250).regex(/^\/events(?:[/?]|$)/)
}).strict().superRefine((v,ctx)=>{
 const issue=(path:string,message:string)=>ctx.addIssue({code:'custom',path:[path],message});
 if(v.setupType==='custom'&&(!v.customLayout||v.customLayout.roomId!==v.venue))issue('customLayout','Simpan layout untuk venue yang dipilih, atau gunakan rekomendasi hotel.');
 if(v.setupType!=='custom'&&v.customLayout)issue('customLayout','Layout hanya dilampirkan pada pilihan custom.');
 if(v.customLayout&&v.customLayout.guestCount!==v.guests)issue('customLayout','Jumlah peserta pada layout harus sama dengan formulir. Buka dan simpan kembali layout.');
 if(v.date<makassarDate())issue('date','Tanggal acara harus hari ini atau setelahnya.');
 if(v.alternativeDate&&v.alternativeDate<makassarDate())issue('alternativeDate','Tanggal alternatif sudah berlalu.');
 if(v.startTime&&v.endTime&&v.endTime<=v.startTime)issue('endTime','Jam selesai harus setelah jam mulai.');
 if(v.accommodation||v.mode==='group-stay'){
  if(v.rooms<1||!v.checkIn||!v.checkOut)issue('rooms','Lengkapi jumlah kamar dan tanggal menginap.');
  if(v.checkIn&&v.checkIn<makassarDate())issue('checkIn','Tanggal check-in sudah berlalu.');
  if(v.checkIn&&v.checkOut&&v.checkOut<=v.checkIn)issue('checkOut','Check-out harus setelah check-in.');
 }
 if(v.mode==='site-inspection'&&(!v.visitDate||v.visitDate<makassarDate()||!v.visitTime))issue('visitDate','Lengkapi tanggal dan jam kunjungan yang akan datang.');
});
const asset=z.string().regex(/^\/media\/[a-zA-Z0-9_. ()/-]+$/).refine(v=>!v.includes('..')).or(z.literal(''));
const values=z.object(Object.fromEntries(layouts.map(l=>[l,z.number().int().min(1).max(2000).optional()]))).strict();
export const eventRecordSchema=z.object({
 id:z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),kind:z.enum(['venue','package','campaign','reference']),slug:z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
 title:z.string().min(2).max(150),category:text,description:z.string().max(3000),image:asset,published:z.boolean(),verified:z.boolean(),source:z.string().max(2000),notes:z.string().max(5000),
 features:z.array(z.string().max(1000)).max(40),venueIds:z.array(z.string().max(100)).max(10),minimum:z.number().int().min(0).max(2000),duration:text,
 price:z.object({amount:z.number().min(0).max(100000000000),unit:z.string().max(80),status:z.enum(['draft','needs-review','current','expired']),validFrom:optionalDate,validTo:optionalDate,verified:z.boolean()}).strict(),
 floor:text,plan:asset,capacitySources:z.array(z.object({source:text,values})).max(5),displayCapacity:values,capacityVerified:z.boolean(),
 year:z.number().int().min(0).max(2200),status:z.enum(['draft','upcoming','available','limited','sold-out','ended']),
 startDate:optionalDate,endDate:optionalDate,eventStart:optionalDate,eventEnd:optionalDate,bookingDeadline:optionalDate,inquiryEnabled:z.boolean(),
 menu:z.array(text).max(40),schedule:z.array(text).max(40),terms:z.array(z.string().max(1000)).max(30),updatedAt:z.string().max(40)
}).strict().superRefine((v,ctx)=>{
 const error=(message:string)=>ctx.addIssue({code:'custom',message});
 if(v.published&&(!v.verified||v.source.trim().length<6))error('Publikasi membutuhkan verifikasi konten dan sumber.');
 if(v.price.verified&&v.price.status==='current'&&(!v.price.validFrom||!v.price.validTo||v.price.validFrom>v.price.validTo))error('Harga aktif memerlukan periode berlaku yang valid.');
 if(v.kind==='reference'&&v.published)error('Referensi internal tidak boleh dipublikasikan.');
 if(v.kind==='campaign'&&v.published){
  if(v.status==='draft'||!v.startDate||!v.endDate||!v.eventStart||!v.eventEnd||v.startDate>v.endDate||v.eventStart>v.eventEnd)error('Lengkapi status dan periode kampanye/acara sebelum publikasi.');
  if(v.bookingDeadline&&v.bookingDeadline>v.eventEnd)error('Batas pemesanan harus sebelum acara berakhir.');
 }
 if(v.capacityVerified&&!Object.keys(v.displayCapacity).length)error('Kapasitas final belum diisi.');
});

