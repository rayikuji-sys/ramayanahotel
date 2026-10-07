// Original hotel brochure artwork, matched by its printed package name.
export type PackageArtwork = {id:string;title:string;src:string;original:string;width:number;height:number;caption:string};
const artwork=(id:string,title:string,width=1423,height=2000):PackageArtwork=>({id,title,src:`/media/packages/${id}.webp`,original:`/media/packages/${id}.png`,width,height,caption:'Desain brosur hotel. Harga dan ketentuan pada gambar mengikuti materi sumber; konfirmasikan penawaran terbaru dengan tim Events.'});
export const brochures={
 weddingCover:artwork('wedding-collection','Wedding · pilihan paket & dekorasi',2000,1545),
 weddingDetails:artwork('wedding-details','Wedding · Bahagia, Cantik & Indah',2000,1545),
 weddingAnggun:artwork('wedding-anggun','Wedding · Anggun & galeri',2000,1545),
 business:artwork('private-business','Private Business Package'),
 birthday:artwork('birthday','Birthday Package'),
 community:artwork('community','Community Package'),
 gathering:artwork('gathering','Gathering Package'),
 socialita:artwork('socialita','Sosialita Package'),
 romantic:artwork('romantic-dinner','Romantic Dinner'),
 manasik:artwork('manasik','Manasik Package'),
};
export function packageArtwork(slug:string):PackageArtwork[]{
 if(slug.startsWith('wedding-'))return slug==='wedding-anggun'?[brochures.weddingAnggun,brochures.weddingCover,brochures.weddingDetails]:[brochures.weddingDetails,brochures.weddingCover,brochures.weddingAnggun];
 const match:Record<string,PackageArtwork>={'private-business':brochures.business,birthday:brochures.birthday,community:brochures.community,gathering:brochures.gathering,socialita:brochures.socialita,'romantic-dinner':brochures.romantic,manasik:brochures.manasik};
 return match[slug]?[match[slug]]:[];
}
export function packageCover(slug:string):PackageArtwork|undefined{
 if(slug.startsWith('wedding-'))return {...packageArtwork(slug)[0],src:`/media/packages/${slug}-panel.webp`,width:667,height:1545};
 return packageArtwork(slug)[0];
}
export const packageStories:Record<string,string>={
 'wedding-bahagia':'Resepsi di Majapahit untuk 200 tamu dalam panduan paket, dengan buffet, dekorasi standar, hiburan, dan satu kamar Superior. Awal yang hangat untuk merayakan bersama keluarga.',
 'wedding-cantik':'Sambut 300 tamu di Majapahit dengan buffet, dekorasi, dan hiburan. Brosur Cantik juga memuat kue ucapan serta pilihan akomodasi untuk melengkapi hari istimewa Anda.',
 'wedding-indah':'Panduan resepsi untuk 300 tamu dengan enam menu buffet, dekorasi standar, dan kue ucapan. Pilihan kamar Deluxe atau Junior Suite tercantum dalam brosur untuk dibahas bersama tim hotel.',
 'wedding-anggun':'Perayaan untuk 300 tamu dengan tujuh menu buffet, kue ucapan, pilihan MC, dan akomodasi Ramayana Suite dalam panduan. Temukan rincian hadiah dan layanan pada brosur Anggun.',
 'private-business':'Pertemuan yang fokus selama empat jam, diikuti buffet lunch atau dinner di Arjuna Resto. Panduan paket mencakup LCD dan sound system untuk minimum 30 peserta.',
 birthday:'Rayakan bersama orang terdekat dengan buffet, MC, hiburan, backdrop, dan satu kamar Superior dalam panduan paket. Dirancang untuk minimum 30 tamu; sesuaikan detail perayaan bersama tim hotel.',
 community:'Ruang untuk komunitas Anda: berkumpul di Rama Shinta Lounge atau Arjuna Resto, ditemani teh atau kopi untuk 30 orang, sound system, dan musik santai sesuai panduan brosur.',
 gathering:'Kebersamaan di sekeliling meja, dengan BBQ dinner di Rama Shinta Lounge atau Arjuna Resto. Panduan paket untuk minimum 50 tamu mencantumkan LCD, sound system, serta voucher gym untuk dua orang.',
 socialita:'Pertemuan santai dengan buffet lunch atau dinner dan afternoon tea. Pilih Rama Shinta Lounge atau Arjuna Resto untuk minimum 30 tamu, dengan LCD dan sound system dalam panduan paket.',
 'romantic-dinner':'Sebuah meja untuk berdua, makan malam, dan musik romantis. Diskusikan suasana yang Anda inginkan di Rama Shinta Lounge atau Arjuna Resto bersama tim hotel.',
 manasik:'Siapkan sesi pembekalan dengan penggunaan ruang empat jam, LCD, sound system, dan buffet lunch atau dinner. Panduan Manasik berlaku untuk minimum 30 peserta.',
};
