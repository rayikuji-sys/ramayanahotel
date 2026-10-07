import {openStore} from '../domain/store.mjs';import {passwordHash} from '../domain/auth.mjs';import {uid} from '../domain/booking.mjs';
const email=process.env.BOOKING_ADMIN_EMAIL,password=process.env.BOOKING_ADMIN_PASSWORD,role=process.env.BOOKING_ADMIN_ROLE||'Admin';
if(!email||!password||password.length<14||!['Admin','Manager','FO','Sales','Finance'].includes(role))throw Error('Set BOOKING_ADMIN_EMAIL, BOOKING_ADMIN_PASSWORD (14+ chars), and optional BOOKING_ADMIN_ROLE in your local shell. Never share password in chat.');
const db=openStore();db.prepare('INSERT INTO admins VALUES(?,?,?,?)').run(uid(),email.toLowerCase(),passwordHash(password),role);db.close();console.log('Local booking staff account created.');
