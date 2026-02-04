// Example Sanity queries for future use
// These will be used when you set up your Sanity Studio

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    title,
    description,
    logo,
    favicon,
    socialLinks
  }
`;

export const PAGE_QUERY = `
  *[_type == "page" && slug.current == $slug][0] {
    title,
    slug,
    content,
    seo {
      title,
      description,
      image
    }
  }
`;

export const BLOG_POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    mainImage,
    author-> {
      name,
      image
    }
  }
`;

export const BLOG_POST_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    excerpt,
    publishedAt,
    mainImage,
    author-> {
      name,
      image,
      bio
    },
    seo {
      title,
      description,
      image
    }
  }
`;

export const TESTIMONIALS_QUERY = `
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    quote,
    name,
    role,
    initials,
    image
  }
`;
