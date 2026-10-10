import {content,settings} from '@/lib/db';
import {galleryMedia} from '@/lib/gallery-media';
import {ReferenceGallery} from '@/components/hotel/reference-public';
export const dynamic='force-dynamic';
export const metadata={title:'Photos & Videos',description:'Explore Ramayana Hotel Makassar through a collection of rooms, shared spaces, facilities, dining and meeting photos, plus our hotel film.'};
export default function GalleryPage(){return <main id="main" className="detail-page"><ReferenceGallery media={galleryMedia(content(),settings().heroVideo)}/></main>;}
