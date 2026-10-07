import {publicPlanner} from '@/lib/planner-store';
export const dynamic='force-dynamic';
export async function GET(){return Response.json(publicPlanner(),{headers:{'Cache-Control':'no-store'}});}
