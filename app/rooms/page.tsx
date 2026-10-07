import {content} from '@/lib/db';
import {RoomCollection} from '@/components/hotel/room-collection';
export const dynamic='force-dynamic';
export const metadata={title:'Rooms & Suites',description:'Explore eight Ramayana room categories from 20 to 40 m², compare amenities and promotional packages, and request your stay.'};
export default function RoomsPage(){return <main id="main" className="collection-page container"><RoomCollection rooms={content().filter(item=>item.kind==='room')}/></main>;}
