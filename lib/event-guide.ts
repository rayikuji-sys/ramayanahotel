// Planning guidance transcribed from the hotel-supplied brochure and seating plans.
// Where the two disagree, use the smaller capacity; final arrangements need hotel confirmation.
export const eventLayouts=['Theatre','Classroom','Round tables','U-shape'] as const;
export type EventLayout=typeof eventLayouts[number];
export const eventVenues=[
 {name:'Majapahit',floor:'3rd floor',description:'Our largest meeting room, for presentations, banquets and celebrations.',capacity:{Theatre:190,Classroom:122,'Round tables':110,'U-shape':100},plan:'/media/venue-majapahit.png'},
 {name:'Erlangga',floor:'3rd floor',description:'A versatile setting for workshops, company meetings and shared meals.',capacity:{Theatre:100,Classroom:70,'Round tables':80,'U-shape':50},plan:'/media/venue-erlangga.png'},
 {name:'Ganesha',floor:'2nd floor',description:'A more intimate space for focused conversations and smaller gatherings.',capacity:{Theatre:86,Classroom:40,'Round tables':60,'U-shape':41},plan:'/media/venue-ganesha.png'},
];
export function suitableVenues(guests:number,layout:EventLayout){return eventVenues.filter(v=>Number.isInteger(guests)&&guests>0&&v.capacity[layout]>=guests);}
export const eventPackages:Record<string,{subtitle:string;minimum:string;duration:string;features:string[]}>= {
 Business:{subtitle:'A productive day, thoughtfully arranged.',minimum:'30 guests',duration:'4-hour room use',features:['Buffet lunch or dinner at Arjuna Resto','LCD screen and sound system','Meeting room use']},
 Wedding:{subtitle:'Your people. Your day. Your memories.',minimum:'200 / 300 guest packages',duration:'Schedule with our team',features:['Buffet menu and mineral water','Standard wedding décor and sound system','Food tasting for up to five people','Room stay benefits vary by package','Entertainment and LCD presentation facilities']},
 Birthday:{subtitle:'Another year, beautifully celebrated.',minimum:'30 guests',duration:'Schedule with our team',features:['Buffet lunch or dinner','One Superior room','MC, entertainment and backdrop','LCD screen and sound system','Gym vouchers for two guests']},
 Gathering:{subtitle:'Make time for everyone around the table.',minimum:'50 guests',duration:'Schedule with our team',features:['BBQ dinner at Rama Shinta Lounge or Arjuna Resto','LCD screen and sound system','Gym vouchers for two guests']},
 Community:{subtitle:'Good company. Shared interests.',minimum:'30 guests',duration:'Schedule with our team',features:['Rama Shinta Lounge or Arjuna Resto','Tea or coffee for 30 guests','Sound system and background music']},
 Social:{subtitle:'Catch up over something lovely.',minimum:'30 guests',duration:'Schedule with our team',features:['Buffet lunch or dinner','Afternoon tea','LCD screen and sound system']},
 Manasik:{subtitle:'A considered space for preparation.',minimum:'30 guests',duration:'4-hour room use',features:['Buffet lunch or dinner in the meeting room','LCD screen and sound system','Meeting room use']},
 Other:{subtitle:'Let’s shape something around you.',minimum:'Tell us your guest count',duration:'Choose your preferred duration',features:['Discuss your occasion and preferred space','Choose catering and equipment needs','Ask about accommodation for your guests']},
};
export const eventEquipment=['Projector & screen','Sound system & microphone','Podium','Whiteboard & flipchart','Notepads & pencils','Internet access','Mineral water','Parking'];
