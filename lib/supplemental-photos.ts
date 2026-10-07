import type {HotelPhoto} from './photo-catalog.ts';

// Additional frames from the hotel's PC/Fasilitas delivery, visually reviewed.
// Folder names do not determine the category: the desk belongs to room details.
export const supplementalPhotos:HotelPhoto[]=[
 {id:'reception-details',src:'/media/collection/reception-details.webp',title:'Small details at reception',category:'Spaces',caption:'A woven basket, floral details, and guest information arranged on the reception counter.',source:'C:/Users/ramay/OneDrive/Documents/Desktop/PC/Fasilitas/Fasilitas/ONC05849.JPG'},
 {id:'lobby-artwork',src:'/media/collection/lobby-artwork.webp',title:'Art between the lamps',category:'Spaces',caption:'A cityscape print and a pair of table lamps add a decorative detail to the hotel interior.',source:'C:/Users/ramay/OneDrive/Documents/Desktop/PC/Fasilitas/Fasilitas/ONC05856.JPG'},
 {id:'room-desk-storage',src:'/media/collection/room-desk-storage.webp',title:'A desk beside the wardrobe',category:'Rooms',caption:'A curved writing desk, woven chair, television, and dark storage cabinet. The supplied photograph does not identify the room category.',source:'C:/Users/ramay/OneDrive/Documents/Desktop/PC/Fasilitas/Fasilitas/ONC05878.JPG'},
];

export const supplementalPhotoCopy:Array<[string,string]>=[
 ['Small details at reception','Detail kecil di resepsionis'],
 ['A woven basket, floral details, and guest information arranged on the reception counter.','Keranjang anyaman, rangkaian bunga, dan informasi tamu tertata di meja resepsionis.'],
 ['Art between the lamps','Karya seni di antara lampu'],
 ['A cityscape print and a pair of table lamps add a decorative detail to the hotel interior.','Gambar pemandangan kota dan sepasang lampu meja memberi sentuhan dekoratif pada interior hotel.'],
 ['A desk beside the wardrobe','Meja tulis di samping lemari'],
 ['A curved writing desk, woven chair, television, and dark storage cabinet. The supplied photograph does not identify the room category.','Meja tulis melengkung, kursi anyaman, televisi, dan lemari penyimpanan gelap. Kategori kamar tidak tercantum pada foto yang diberikan.'],
];
