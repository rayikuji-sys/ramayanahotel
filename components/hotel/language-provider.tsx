'use client';
import {Children,createContext,useContext,useEffect,useState,useSyncExternalStore,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import {Check,Globe2} from 'lucide-react';
import {Dialog} from './dialog';
import {isLocale,locales,localeDirection,localeStorageKey,type Locale} from '@/lib/locales';
import {translateText} from '@/lib/translations';

const LanguageContext=createContext<{locale:Locale;select:(locale:Locale)=>void}>({locale:'en',select:()=>{}});
export const useLanguage=()=>useContext(LanguageContext);
const languageChangeEvent='ramayana:language-change';
let sessionLocale:Locale|undefined;
function readLocale():Locale{
 if(sessionLocale)return sessionLocale;
 try{const saved=localStorage.getItem(localeStorageKey);return isLocale(saved)?saved:'en';}catch{return 'en';}
}
const serverLocale=():Locale=>'en';
function subscribeLocale(onChange:()=>void){
 const onStorage=(event:StorageEvent)=>{if(event.key===localeStorageKey||event.key===null){sessionLocale=undefined;onChange();}};
 window.addEventListener('storage',onStorage);
 window.addEventListener(languageChangeEvent,onChange);
 return()=>{window.removeEventListener('storage',onStorage);window.removeEventListener(languageChangeEvent,onChange);};
}
function selectLocale(value:Locale){
 if(!isLocale(value))return;
 sessionLocale=value;
 try{localStorage.setItem(localeStorageKey,value);}catch{}
 window.dispatchEvent(new Event(languageChangeEvent));
}
export function LanguageProvider({children}:{children:ReactNode}){
 const pathname=usePathname();
 // Hydrate with the server language, then read the saved preference without replacing the page tree.
 const locale=useSyncExternalStore(subscribeLocale,readLocale,serverLocale);
 const admin=pathname.startsWith('/admin');
 useEffect(()=>{const current=admin?'en':locale;document.documentElement.lang=current;document.documentElement.dir=localeDirection(current);},[locale,admin]);
 return <LanguageContext.Provider value={{locale:admin?'en':locale,select:selectLocale}}>{children}</LanguageContext.Provider>;
}
// React owns every text node. No DOM replacement, third-party widget, or form data transmission.
export function LocalizedText({children}:{children:ReactNode}){
 const {locale}=useLanguage();
 return <>{Children.map(children,child=>typeof child==='string'?translateText(child,locale):child)}</>;
}
export function LanguagePicker(){
 const {locale,select}=useLanguage();const [open,setOpen]=useState(false);const current=locales.find(l=>l.code===locale)!;
 return <div className="language-picker">
  <button className="language-trigger" onClick={()=>setOpen(true)} aria-label={translateText('Choose your language',locale)} aria-haspopup="dialog"><Globe2 size={18}/><span>{current.label}</span></button>
  {open&&<Dialog title={translateText('Choose your language',locale)} onClose={()=>setOpen(false)}>
   <div className="language-heading"><Globe2 size={28}/><p className="eyebrow">RAMAYANA / {translateText('Language',locale)}</p><h2>{translateText('Choose your language',locale)}</h2><p>{current.notice}</p></div>
   <div className="language-options">{locales.map(language=><button key={language.code} lang={language.code} dir={localeDirection(language.code)} aria-pressed={locale===language.code} onClick={()=>{select(language.code);setOpen(false);}}><span>{language.name}</span>{locale===language.code&&<Check size={18}/>}</button>)}</div>
  </Dialog>}
 </div>;
}
