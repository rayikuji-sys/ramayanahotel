export const kinds=['room','facility','dining','service','place','event','faq','policy','testimonial','partnership','trust','social','section','seo'] as const;
export type ContentKind=typeof kinds[number];
export type ContentItem={id:string;kind:ContentKind;slug:string;title:string;description:string;image:string;category:string;details:Record<string,string>;published:boolean;verified:boolean;active:boolean;sortOrder:number;sourceNote:string;verifiedBy:string;verifiedAt:string;updatedAt:string};
export type HotelSettings={name:string;tagline:string;address:string;phone:string;whatsapp:string;email:string;instagram:string;heroImage:string;heroVideo:string;intro:string};
export type Inquiry={id:string;kind:'reservation'|'event'|'contact';name:string;email:string;phone:string;message:string;context:Record<string,string|number>;status:'new'|'contacted'|'proposal_sent'|'site_inspection'|'negotiation'|'tentative'|'confirmed'|'lost'|'closed';attachments?:{id:string;filename:string}[];salesOwner?:string;followUpDate?:string;staffNote:string;source:string;consentAt:string;createdAt:string;updatedAt:string};
export type PublicData={settings:HotelSettings;items:ContentItem[]};
