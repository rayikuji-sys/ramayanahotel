'use client';
import {useEffect,useRef} from 'react';
import {X} from 'lucide-react';
export function Dialog({title,onClose,children,wide=false}:{title:string;onClose:()=>void;children:React.ReactNode;wide?:boolean}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const previous=document.activeElement as HTMLElement;const dialog=ref.current;dialog?.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{dialog?.close();document.body.style.overflow=overflow;previous?.focus();};},[]);
 return <dialog ref={ref} className={`hotel-dialog ${wide?'wide':''}`} aria-label={title} onCancel={onClose} onClick={e=>{if(e.target===ref.current)onClose();}}><div className="dialog-inner"><button className="icon-button dialog-close" onClick={onClose} aria-label={`Close ${title}`}><X size={22}/></button>{children}</div></dialog>;
}
