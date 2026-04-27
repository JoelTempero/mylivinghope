const IMAGE_FRAGMENT = `
  url
  altText
  width
  height
`

const VARIANT_FRAGMENT = `
  id
  title
  availableForSale
  price {
    amount
    currencyCode
  }
  compareAtPrice {
    amount
    currencyCode
  }
  selectedOptions {
    name
    value
  }
  image {
    ${IMAGE_FRAGMENT}
  }
`

const PRODUCT_FRAGMENT = `
  id
  handle
  title
  description
  descriptionHtml
  availableForSale
  productType
  tags
  seo {
    title
    description
  }
  featuredImage {
    ${IMAGE_FRAGMENT}
  }
  images(first: 10) {
    nodes {
      ${IMAGE_FRAGMENT}
    }
  }
  variants(first: 20) {
    nodes {
      ${VARIANT_FRAGMENT}
    }
  }
`

export const GET_PRODUCTS = `
  query GetProducts($first: Int = 20) {
    products(first: $first) {
      nodes {
        ${PRODUCT_FRAGMENT}
      }
    }
  }
`

export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ${PRODUCT_FRAGMENT}
    }
  }
`

export const GET_COLLECTION_BY_HANDLE = `
  query GetCollectionByHandle($handle: String!, $first: Int = 20) {
    collectionByHandle(handle: $handle) {
      id
      handle
      title
      description
      image {
        ${IMAGE_FRAGMENT}
      }
      products(first: $first) {
        nodes {
          ${PRODUCT_FRAGMENT}
        }
      }
    }
  }
`

export const GET_ALL_PRODUCT_HANDLES = `
  query GetAllProductHandles {
    products(first: 100) {
      nodes {
        handle
      }
    }
  }
`

const CART_FRAGMENT = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
  }
  lines(first: 50) {
    nodes {
      id
      quantity
      merchandise {
        ... on ProductVariant {
          id
          title
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          product {
            handle
            title
            featuredImage {
              ${IMAGE_FRAGMENT}
            }
          }
        }
      }
    }
  }
`

export const CREATE_CART = `
  mutation CreateCart {
    cartCreate {
      cart {
        ${CART_FRAGMENT}
      }
    }
  }
`

export const ADD_TO_CART = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FRAGMENT}
      }
    }
  }
`

export const UPDATE_CART_LINE = `
  mutation UpdateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FRAGMENT}
      }
    }
  }
`

export const REMOVE_FROM_CART = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FRAGMENT}
      }
    }
  }
`

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ${CART_FRAGMENT}
    }
  }
`
