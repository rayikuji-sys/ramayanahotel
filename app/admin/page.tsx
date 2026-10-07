import {cookies} from 'next/headers';import type {Metadata} from 'next';
import {sessionAdmin} from '@/lib/security';import {content,inquiries,settings} from '@/lib/db';import {AdminDashboard,AdminLogin} from '@/components/hotel/admin';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Staff workspace',robots:{index:false,follow:false}};
export default async function Admin(){const admin=sessionAdmin((await cookies()).get('ramayana_session')?.value);if(!admin)return <AdminLogin/>;return <AdminDashboard email={admin.email} initial={{items:content(true),settings:settings(),inquiries:inquiries()}}/>;}
