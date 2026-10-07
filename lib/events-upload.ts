import {extname} from 'node:path';
export const uploadLimit=5*1024*1024;
const mime:Record<string,string>={'.pdf':'application/pdf','.doc':'application/msword','.xls':'application/vnd.ms-excel','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'};
export function validateAttachment(filename:string,bytes:Buffer){
 const ext=extname(filename).toLowerCase();
 if(!mime[ext]||!bytes.length||bytes.length>uploadLimit)throw new Error('TOR harus PDF, DOC, DOCX, XLS, atau XLSX, maksimal 5 MB.');
 const pdf=bytes.subarray(0,5).toString()==='%PDF-';
 const ole=bytes.subarray(0,8).equals(Buffer.from('d0cf11e0a1b11ae1','hex'));
 const zip=bytes.subarray(0,4).equals(Buffer.from('504b0304','hex'));
 const word=bytes.includes(Buffer.from('word/document.xml'));
 const sheet=bytes.includes(Buffer.from('xl/workbook.xml'));
 if(ext==='.pdf'?!pdf:ext==='.doc'||ext==='.xls'?!ole:!zip||!bytes.includes(Buffer.from('[Content_Types].xml'))||(ext==='.docx'?!word:!sheet))throw new Error('Isi berkas tidak sesuai format yang dipilih.');
 const safe=filename.split(/[\\/]/).pop()!.replace(/[^a-zA-Z0-9._ ()-]/g,'_').slice(-120);
 return {filename:safe||'dokumen'+ext,mime:mime[ext]};
}
export async function boundedFormData(request:Request){
 if(!request.headers.get('content-type')?.startsWith('multipart/form-data;'))throw new Error('Format permintaan tidak valid.');
 const reader=request.body?.getReader();if(!reader)throw new Error('Permintaan kosong.');
 const chunks:Uint8Array[]=[];let total=0;
 while(true){const {value,done}=await reader.read();if(done)break;total+=value.length;if(total>uploadLimit+200000){await reader.cancel();throw new Error('Berkas melebihi batas 5 MB.');}chunks.push(value);}
 return new Response(Buffer.concat(chunks),{headers:{'Content-Type':request.headers.get('content-type')!}}).formData();
}

