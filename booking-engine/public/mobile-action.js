// Keep the existing checkout action reachable on small screens, without a second
// checkout implementation or bypassing the guest form's native validation.
export function installMobileAction(main, t) {
  let frame=0, signature='', dock;
  const update=()=>{
    frame=0;
    const action=main.querySelector('#extra-next, #guest .actions button:not([type="button"]), #pay');
    const total=main.querySelector('.reference-summary .ref-total strong')?.textContent;
    if(!action||!total){dock?.remove();dock=null;signature='';return;}
    const next=[action.id,action.textContent,total,action.disabled,document.documentElement.lang].join('|');
    if(next===signature)return;
    signature=next;
    if(!dock){dock=document.createElement('div');dock.className='checkout-dock';main.after(dock);}
    const amount=document.createElement('span');amount.textContent=t('Total pemesanan','Booking total');
    const strong=document.createElement('strong');strong.textContent=total;amount.append(strong);
    const button=document.createElement('button');button.type='button';button.disabled=action.disabled;
    button.textContent=action.id==='pay'?t('Bayar · Simulasi','Pay · Simulation'):t('Lanjut','Continue');
    button.setAttribute('aria-label',action.textContent.trim());
    button.onclick=()=>{if(action.isConnected&&!action.disabled)action.click();};
    dock.replaceChildren(amount,button);
  };
  const observer=new MutationObserver(()=>{if(!frame)frame=requestAnimationFrame(update);});
  observer.observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled']});
  update();
}
