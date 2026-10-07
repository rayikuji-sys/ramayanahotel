import {bookingDestination} from '@/lib/booking-link';
export const dynamic='force-dynamic';

export function GET(request:Request){
 const configured=process.env.BOOKING_ENGINE_URL;
 try{
  const destination=bookingDestination(new URL(request.url).searchParams,configured||new URL('/booking',process.env.APP_URL||request.url).href);
  return new Response(null,{status:307,headers:{Location:destination.href,'Cache-Control':'no-store'}});
 }catch{return new Response('Alamat booking engine belum valid. Silakan hubungi hotel.',{status:503});}
}
