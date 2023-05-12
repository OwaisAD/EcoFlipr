export type SaleOffer = {
  notification_count: number;
  id: string;
  creator_id: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  is_shippable: boolean;
  city: {
    id: string;
    zip_code: string;
    name: string;
  };
  price: number;
  imgs: string[];
  created_at: string;
  updated_at: string;
};

export type SaleOfferData = {
  data: {
    id: string;
    creator_id: string;
    description: string;
    category: {
      id: string;
      name: string;
    };
    is_shippable: boolean;
    city: {
      id: string;
      zip_code: string;
      name: string;
    };
    price: number;
    imgs: string[];
    created_at: string;
    updated_at: string;
  };
};

export type SaleOffers = SaleOffer[];

export type SaleOfferBasic = {
  id: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  is_shippable: boolean;
  city: {
    id: string;
    zip_code: string;
    name: string;
  };
  price: number;
  imgs: string[];
};

export type SaleOffersBasic = {
  saleOffers: SaleOfferBasic[];
};

export interface SaleOfferInterface {
  id: string;
  creator_id: string;
  description: string;
  category: {
    id: string;
    name: string;
  };
  is_shippable: boolean;
  city: {
    id: string;
    zip_code: string;
    name: string;
  };
  price: number;
  imgs: string[];
  threads: {
    id: string;
    sale_offer_id: string;
    creator_id: string;
    comments: {
      id: string;
      thread_id: string;
      author_id: string;
      content: string;
      is_read: boolean;
      created_at: string;
    }[];
  }[];
  created_at: string;
  updated_at: string;
}
