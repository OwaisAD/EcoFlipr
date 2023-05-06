export type SaleOffer = {
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

export type SaleOffers = {
  saleOffers: SaleOffer[];
};

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

export type SaleOfferBasicForRecentAndRandom = {
  saleOffer: SaleOfferBasic
};

export type SaleOffersBasic = {
  saleOffers: SaleOfferBasic[];
};
