// Suite packages on the hotel website include breakfast for two for Rp100,000.
// Other room types use the hotel's additional-breakfast rate per paying guest.
export function breakfastSupplement(roomId,adults,children=[]){
 const guests=adults+children.filter(age=>age>=6).length;
 return ['junior-suite','ramayana-suite'].includes(roomId)
  ?100000+Math.max(0,guests-2)*55000
  :guests*55000;
}
