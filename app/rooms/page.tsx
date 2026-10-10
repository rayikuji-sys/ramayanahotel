import {content} from '@/lib/db';
import {ReferenceRooms} from '@/components/hotel/reference-public';
export const dynamic='force-dynamic';
export const metadata={title:'Rooms & Suites',description:'Explore eight Ramayana room categories from 20 to 40 m², compare amenities and promotional packages, and request your stay.'};
export default function RoomsPage(){return <main id="main" className="detail-page"><ReferenceRooms rooms={content().filter(item=>item.kind==='room')}/></main>;}
