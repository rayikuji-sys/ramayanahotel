export const layouts=['Theatre','Classroom','Round tables','U-shape','Boardroom','Custom'] as const;
export type Layout=typeof layouts[number];
export type Capacities=Partial<Record<Layout,number>>;
export type Price={amount:number;unit:string;status:'draft'|'needs-review'|'current'|'expired';validFrom:string;validTo:string;verified:boolean};
export type EventRecord={id:string;kind:'venue'|'package'|'campaign'|'reference';slug:string;title:string;category:string;description:string;image:string;published:boolean;verified:boolean;source:string;notes:string;features:string[];venueIds:string[];minimum:number;duration:string;price:Price;floor:string;plan:string;capacitySources:{source:string;values:Capacities}[];displayCapacity:Capacities;capacityVerified:boolean;year:number;status:'draft'|'upcoming'|'available'|'limited'|'sold-out'|'ended';startDate:string;endDate:string;eventStart:string;eventEnd:string;bookingDeadline:string;inquiryEnabled:boolean;menu:string[];schedule:string[];terms:string[];updatedAt:string};
export type PublicEventRecord=Omit<EventRecord,'source'|'notes'|'price'> & {price:Price|null};
export const categories=[
 {slug:'corporate-meeting',key:'corporate',title:'Corporate & meeting',copy:'Rapat kerja, pelatihan, seminar, dan agenda tim dengan detail yang terencana.'},
 {slug:'government-meeting',key:'government',title:'Agenda instansi',copy:'Sampaikan TOR, kebutuhan ruang, konsumsi, dan akomodasi untuk penawaran yang sesuai.'},
 {slug:'wedding',key:'wedding',title:'Wedding & engagement',copy:'Dari pertemuan keluarga hingga resepsi. Temukan paket dan susunan acara yang terasa personal.'},
 {slug:'gathering',key:'gathering',title:'Gathering & komunitas',copy:'Ruang untuk bertemu, berbagi cerita, dan merayakan kebersamaan.'},
 {slug:'birthday',key:'birthday',title:'Birthday & social',copy:'Perayaan hangat bersama orang terdekat, dengan pilihan venue dan jamuan.'},
 {slug:'manasik',key:'manasik',title:'Manasik',copy:'Rencanakan sesi pembekalan, kebutuhan presentasi, jamuan, dan kamar rombongan.'},
 {slug:'romantic-dinner',key:'romantic-dinner',title:'Romantic dinner',copy:'Momen makan malam berdua yang direncanakan bersama tim hotel.'},
] as const;
export const eventTypes=['corporate','government','meeting','conference','seminar','training','workshop','gathering','wedding','engagement','birthday','social','romantic-dinner','manasik','ramadan','new-year','seasonal','custom'] as const;
export const leadStatuses=['new','contacted','proposal_sent','site_inspection','negotiation','tentative','confirmed','lost','closed'] as const;
export function makassarDate(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Makassar',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);}
export function priceVisible(p:Price,today=makassarDate()){return p.verified&&p.status==='current'&&p.amount>0&&!!p.validFrom&&!!p.validTo&&p.validFrom<=today&&p.validTo>=today;}
export function campaignStatus(r:EventRecord|PublicEventRecord,today=makassarDate()){
 if(r.status==='draft'||r.status==='ended')return r.status;
 if((r.endDate&&r.endDate<today)||(r.eventEnd&&r.eventEnd<today))return 'ended';
 return r.startDate&&r.startDate>today?'upcoming':r.status;
}
export function publicEvents(records:EventRecord[],today=makassarDate()):PublicEventRecord[]{return records.filter(r=>r.published&&r.verified&&r.kind!=='reference'&&(r.kind!=='campaign'||r.status!=='draft')).map(r=>{
 const {source,notes,price,...safe}=r;void source;void notes;
 const confirmedPrice=priceVisible(price,today);
 return {...safe,...r.kind==='package'&&r.slug.startsWith('rental-')&&!confirmedPrice?{duration:'Sesuai penawaran',features:['Penggunaan ruang; durasi dan fasilitas dikonfirmasi dalam penawaran.']}:{},status:campaignStatus(r,today),price:confirmedPrice?price:null};
});}
export function capacityRange(r:PublicEventRecord|EventRecord,l:Layout){
 if(r.capacityVerified&&r.displayCapacity[l])return [r.displayCapacity[l]!,r.displayCapacity[l]!] as const;
 const values=r.capacitySources.map(s=>s.values[l]).filter((v):v is number=>typeof v==='number');
 return values.length?[Math.min(...values),Math.max(...values)] as const:null;
}
export function capacityLabel(r:PublicEventRecord|EventRecord,l:Layout){const range=capacityRange(r,l);return !range?'Diskusikan':range[0]===range[1]?String(range[0]):range[0]+'–'+range[1];}
export function findVenues(records:PublicEventRecord[],guests:number,layout:Layout){if(!Number.isInteger(guests)||guests<1||guests>2000)return [];return records.filter(r=>r.kind==='venue'&&(layout==='Custom'||(capacityRange(r,layout)?.[1]||0)>=guests));}
export function rupiah(amount:number){return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(amount);}
export function eventWhatsApp(number:string,context:string){return 'https://wa.me/'+number.replace(/\D/g,'')+'?text='+encodeURIComponent('Halo Tim Ramayana Hotel, saya ingin berdiskusi mengenai '+context+'. Mohon informasi ketersediaan dan penawaran terbaru.');}
export const eventEquipment=['LCD / projector screen','Sound system & mikrofon','Whiteboard','Flipchart','Podium','Notepad & pensil','Air mineral & candies','Akses internet'];
export const eventsFlags={finder:true,comparison:true,proposal:true,attachments:true,inspection:true,groupStay:true,seasonal:true,payments:false,liveAvailability:false,testimonials:false,clientLogos:false};

