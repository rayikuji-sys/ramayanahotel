export const locales=[
 {code:'en',name:'English',label:'EN',notice:'Navigation and essential guest information are translated. Some detailed content remains in its original language.'},
 {code:'id',name:'Bahasa Indonesia',label:'ID',notice:'Navigasi dan informasi utama diterjemahkan. Sebagian rincian tetap ditampilkan dalam bahasa aslinya.'},
 {code:'zh',name:'简体中文',label:'中文',notice:'导航和主要宾客信息已翻译。部分详细内容仍以原文显示。'},
 {code:'ja',name:'日本語',label:'日本語',notice:'ナビゲーションと主な宿泊情報を翻訳しています。一部の詳細は原文で表示されます。'},
 {code:'ko',name:'한국어',label:'한국어',notice:'메뉴와 주요 투숙 정보를 번역합니다. 일부 세부 정보는 원문으로 표시됩니다.'},
 {code:'ar',name:'العربية',label:'العربية',notice:'تتوفر ترجمة للقوائم ومعلومات الإقامة الأساسية. تظهر بعض التفاصيل بلغتها الأصلية.'},
 {code:'de',name:'Deutsch',label:'DE',notice:'Navigation und wichtige Gästeinformationen sind übersetzt. Einige Details bleiben in der Originalsprache.'},
 {code:'fr',name:'Français',label:'FR',notice:'La navigation et les informations essentielles sont traduites. Certains détails restent dans leur langue d’origine.'},
 {code:'nl',name:'Nederlands',label:'NL',notice:'Navigatie en belangrijke gastinformatie zijn vertaald. Sommige details blijven in de oorspronkelijke taal.'},
 {code:'es',name:'Español',label:'ES',notice:'La navegación y la información esencial están traducidas. Algunos detalles se muestran en su idioma original.'},
 {code:'ru',name:'Русский',label:'RU',notice:'Навигация и основная информация для гостей переведены. Некоторые подробности остаются на языке оригинала.'},
] as const;
export type Locale=typeof locales[number]['code'];
export const isLocale=(value:unknown):value is Locale=>typeof value==='string'&&locales.some(l=>l.code===value);
export const localeDirection=(locale:Locale)=>locale==='ar'?'rtl':'ltr';
export const localeStorageKey='ramayana.language.v1';
