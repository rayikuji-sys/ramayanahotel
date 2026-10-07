import {randomBytes,randomUUID} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {db,closeDb} from '../lib/db.ts';
import {hashPassword} from '../lib/security.ts';
const email=(process.env.ADMIN_EMAIL||'admin@ramayana.local').trim().toLowerCase();
if(db().prepare('SELECT id FROM admins WHERE email=?').get(email)){console.log('Admin already exists. No password changed.');closeDb();process.exit(0);}
const password=process.env.ADMIN_PASSWORD||randomBytes(20).toString('base64url');
if(password.length<14)throw new Error('Use at least 14 characters for ADMIN_PASSWORD');
db().prepare('INSERT INTO admins VALUES(?,?,?)').run(randomUUID(),email,hashPassword(password));
mkdirSync('.local',{recursive:true});writeFileSync('.local/admin-access.txt',`Ramayana staff dashboard\nURL: http://localhost:3001/admin\nEmail: ${email}\nPassword: ${password}\n\nKeep this file private. Delete after storing the credentials in your password manager.\n`,{mode:0o600});
console.log('Created admin. Credentials saved privately to .local/admin-access.txt.');closeDb();
