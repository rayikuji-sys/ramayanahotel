import {LocalizedText as T} from '@/components/hotel/language-provider';
import Link from 'next/link';
export default function NotFound(){return <main id="main" className="container page-intro section-bottom"><p className="eyebrow"><T>A DIFFERENT DIRECTION</T></p><h1><T>Let’s find your way.</T></h1><p><T>This page is not available.</T></p><Link className="button" href="/"><T>Back to Ramayana</T></Link></main>;}
