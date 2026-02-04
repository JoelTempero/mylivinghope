export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyMoney;
  };
  featuredImage: ShopifyImage | null;
  images: {
    edges: Array<{ node: ShopifyImage }>;
  };
  variants: {
    edges: Array<{ node: ShopifyProductVariant }>;
  };
  seo: {
    title: string | null;
    description: string | null;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products?: {
    edges: Array<{ node: ShopifyProduct }>;
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: ShopifyMoney;
    product: {
      title: string;
      handle: string;
      featuredImage: ShopifyImage | null;
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{ node: ShopifyCartLine }>;
  };
  cost: {
    subtotalAmount: ShopifyMoney;
    totalAmount: ShopifyMoney;
  };
}

// Response types
export interface GetAllProductsResponse {
  products: {
    edges: Array<{ node: ShopifyProduct }>;
  };
}

export interface GetProductByHandleResponse {
  product: ShopifyProduct | null;
}

export interface GetProductsByCollectionResponse {
  collection: ShopifyCollection | null;
}

export interface GetAllCollectionsResponse {
  collections: {
    edges: Array<{ node: ShopifyCollection }>;
  };
}

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart;
    userErrors: Array<{ field: string; message: string }>;
  };
}

export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart;
    userErrors: Array<{ field: string; message: string }>;
  };
}

export interface GetCartResponse {
  cart: ShopifyCart | null;
}
