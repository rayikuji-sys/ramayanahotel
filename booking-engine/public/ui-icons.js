const paths={
 eye:'M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
 search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
 heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
 filter:'M4 6h16M7 12h10M10 18h4',home:'m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8',
 bed:'M3 20V8m18 12V8M3 15h18M5 8h14v7M9 8v7m6-7v7',
 calendar:'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2ZM7 2v5m10-5v5M3 10h18',
 users:'M16 21v-2a6 6 0 0 0-12 0v2M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M17 3a4 4 0 0 1 0 8m2 3a6 6 0 0 1 3 5v2',
 card:'M3 5h18v14H3ZM3 10h18M7 15h3',tag:'M3 3h8l10 10-8 8L3 11ZM7 7h.01',
 tasks:'M9 6h12M9 12h12M9 18h12M3 6l1 1 2-3m-3 8 1 1 2-3m-3 8 1 1 2-3',
 chart:'M4 20V10m8 10V4m8 16v-7',link:'m9 15 6-6M8 16l-2 2a4 4 0 0 1-5-5l5-5a4 4 0 0 1 5 0m2 8a4 4 0 0 0 5 0l5-5a4 4 0 0 0-5-5l-2 2',
 settings:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 mail:'M3 5h18v14H3ZM3 5l9 7 9-7',doc:'M5 3h10l4 4v14H5ZM14 3v5h5M8 12h8m-8 4h5',
 arrow:'M4 12h16m-6-6 6 6-6 6',close:'m6 6 12 12M6 18 18 6',menu:'M4 6h16M4 12h16M4 18h16',
 check:'m5 12 4 4L20 5',clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 6v6l4 2',
 download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',refresh:'M20 7a8 8 0 0 0-14-2L3 8m0-5v5h5M4 17a8 8 0 0 0 14 2l3-3m0 5v-5h-5',
 star:'m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z',
 globe:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18',
 phone:'m8 3-4 2c0 8 7 15 15 15l2-4-5-3-2 2-5-5 2-2Z',shield:'m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Zm-4 10 3 3 5-6',
 logout:'M9 3H3v18h6m5-15 6 6-6 6M8 12h12'
};
export const uiIcon=(name)=>`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.doc}"/></svg>`;
