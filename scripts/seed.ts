import {db,closeDb} from '../lib/db.ts';
db();console.log('Database initialized. Existing content was preserved.');closeDb();
