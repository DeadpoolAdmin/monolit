export interface IPromotion {
    _id: string;
    id: string;
    status: 'active' | 'inactive' | string;
    type: 'custom' | 'default' | string;
    promotionTitle: string;
    targetAudience: string[];
    startDate: string; // ISO date string
    endDate: string;   // ISO date string
    schedule: string;
    tags: string[];
    content: string;
    orgId: number;
    views: number;
    clicks: number;
    redemptions: number;
    image : string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
  }
  