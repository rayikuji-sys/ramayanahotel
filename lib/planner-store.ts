import {eventDatabase,eventRecords} from './events-store.ts';
import {publicEvents} from './events-model.ts';
import {defaultFurniture,defaultRoom,plannerData,type PlannerConfig} from './planner-model.ts';
export function plannerConfig():PlannerConfig{const sql=eventDatabase();sql.exec('CREATE TABLE IF NOT EXISTS planner_configuration(id INTEGER PRIMARY KEY,payload TEXT NOT NULL); CREATE TABLE IF NOT EXISTS event_layouts(inquiry_id TEXT PRIMARY KEY,payload TEXT NOT NULL);');const row=sql.prepare('SELECT payload FROM planner_configuration WHERE id=1').get() as {payload:string}|undefined;return row?JSON.parse(row.payload):{furniture:defaultFurniture,rooms:publicEvents(eventRecords()).filter(r=>r.kind==='venue').map(r=>defaultRoom(r.id))};}
export function savePlannerConfig(config:PlannerConfig){plannerConfig();eventDatabase().prepare('INSERT INTO planner_configuration VALUES(1,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(JSON.stringify(config));}
export function publicPlanner(){return plannerData(publicEvents(eventRecords()),plannerConfig());}
