import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {openStore,root} from '../domain/store.mjs';
const db=openStore();
try {
  const dir=resolve(root,'data/backups');mkdirSync(dir,{recursive:true});
  const file=resolve(dir,`booking-${new Date().toISOString().replace(/[:.]/g,'-')}.sqlite`);
  // VACUUM INTO creates a consistent independent snapshot, including WAL commits.
  db.exec(`VACUUM INTO '${file.replace(/'/g,"''")}'`);
  console.log(`Sandbox backup created: ${file}`);
} finally {db.close();}
