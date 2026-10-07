import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{return {rules:process.env.PUBLIC_SITE==='true'?{userAgent:'*',allow:'/',disallow:['/admin','/api']}:{userAgent:'*',disallow:'/'},...(process.env.PUBLIC_SITE==='true'&&process.env.APP_URL?{sitemap:`${process.env.APP_URL}/sitemap.xml`}:{})};}
