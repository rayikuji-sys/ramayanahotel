import {receiptByToken,receiptHtml} from '@/lib/event-receipts';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request:Request,{params}:{params:Promise<{token:string}>}){
 const receipt=receiptByToken((await params).token);
 const headers:Record<string,string>={'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow','Content-Type':'text/html; charset=utf-8'};
 if(!receipt)return new Response('Bukti tidak ditemukan atau tautan sudah kedaluwarsa. Hubungi tim Events dengan nomor referensi Anda.',{status:404,headers});
 if(new URL(request.url).searchParams.has('download'))headers['Content-Disposition']=`attachment; filename="${receipt.reference}.html"`;
 return new Response(receiptHtml(receipt,{print:true}),{headers});
}
