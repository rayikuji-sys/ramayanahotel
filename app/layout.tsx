import type {Metadata} from 'next';
import '@fontsource/playfair-display/500.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import './globals.css';
import {SiteShell} from '@/components/hotel/site-shell';
import {LanguageProvider} from '@/components/hotel/language-provider';
import {content,settings} from '@/lib/db';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:{default:'Ramayana Hotel Makassar | Where you feel homey & happy',template:'%s | Ramayana Hotel Makassar'},description:'Discover rooms, dining, and gathering spaces at Ramayana Hotel Makassar. Contact Reservations or plan an event with our team.',icons:{icon:'/favicon.svg'},robots:{index:process.env.PUBLIC_SITE==='true',follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){const hotel=settings();return <html lang="en"><body><LanguageProvider><SiteShell data={{settings:hotel,items:content()}}>{children}</SiteShell></LanguageProvider></body></html>;}
