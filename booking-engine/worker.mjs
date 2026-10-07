import {openStore} from './domain/store.mjs';import {runWorker} from './domain/booking.mjs';
import {dispatchAutomatic,recoverNotificationAttempts} from './domain/notifications.mjs';
if(process.env.BOOKING_MODE&&process.env.BOOKING_MODE!=='sandbox')throw Error('Only sandbox is enabled.');
const db=openStore();recoverNotificationAttempts(db);let busy=false;
const tick=async()=>{if(busy)return;busy=true;try{const count=runWorker(db),emails=await dispatchAutomatic(db);if(count||emails)console.log(JSON.stringify({worker:'booking',captured:count,emailAttempts:emails}));}catch{console.error('Worker failed; pending jobs retained.');}finally{busy=false;}};
tick();const timer=setInterval(tick,15000);function stop(){clearInterval(timer);db.close();process.exit();}process.on('SIGINT',stop);process.on('SIGTERM',stop);
