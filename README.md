# My Living Hope - Website

![My Living Hope](https://mylivinghope.org.nz/cdn/shop/files/MyLivingHope_Lantern_Cream.png?height=100)

**Light in the Darkness** | Prayer Portals helping you go deeper with Jesus

A modern, SEO-optimized website for My Living Hope, a Christian ministry selling Prayer Portal cards that help people connect their emotions with Scripture and grow in their prayer life.

## 🕯️ About

My Living Hope is a Christian resource dedicated to helping people go deeper with Jesus through Prayer Portals—beautifully designed cards that connect emotions and needs with Bible verses and prayer starters.

**Key Contact:** Jesse Major - 027 569 0061

## 🎨 Brand Guidelines

Based on the official Style Guide by Tempero Creative.

### Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Charcoal Black | `#212021` | Primary text, dark backgrounds |
| Soft Blush | `#F5D7CF` | Accent backgrounds, highlights |
| Forest Green | `#336F49` | Primary brand color, buttons, links |

### Typography
- **Primary Font:** Goudy Old Style Bold (web: Libre Baskerville)
- **Secondary Font:** Proxima Nova Regular (web: Montserrat)

### Logo
The lantern icon represents "the lamp for our feet and the light to our path" (Psalm 119:105). The flame inside represents our relationship with Jesus.

## 📁 Project Structure

```
mylivinghope-v2/
├── index.html          # Main homepage
├── 404.html            # Error page
├── robots.txt          # SEO crawling rules
├── sitemap.xml         # SEO sitemap
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   └── main.js         # JavaScript functionality
└── assets/
    └── images/         # Local image assets (optional)
```

## 🚀 Deployment

### GitHub Pages
1. Push to a GitHub repository
2. Go to Settings → Pages
3. Select branch `main` and folder `/ (root)`
4. Your site will be live at `https://username.github.io/repo-name`

### Netlify
1. Connect your GitHub repository
2. Build command: (leave blank)
3. Publish directory: `/`
4. Deploy!

### Vercel
1. Import from GitHub
2. Framework preset: Other
3. Deploy!

### Custom Domain
Update these files when adding a custom domain:
- `index.html` - Update canonical URLs and Open Graph tags
- `sitemap.xml` - Update all URLs
- `robots.txt` - Update sitemap URL

## 🔧 Configuration

### Contact Form
The contact form uses [Formspree](https://formspree.io/) by default. To configure:

1. Create a free account at formspree.io
2. Create a new form
3. Replace `your-form-id` in `index.html` with your form endpoint

### Shopify Integration

#### Option 1: Direct Links (Current)
Products link directly to the Shopify store. No configuration needed.

#### Option 2: Embedded Buy Buttons
For embedded cart functionality:

1. Get your Storefront Access Token from Shopify Admin:
   - Go to Apps → Develop apps
   - Create an app with Storefront API access
   - Copy the Storefront Access Token

2. In `js/main.js`, find the Shopify integration section and:
   - Uncomment the code block
   - Replace `'your-storefront-access-token'` with your token
   - Verify product variant IDs match your store

## 📊 SEO Features

- ✅ Semantic HTML5 structure
- ✅ Schema.org structured data (Organization, Products, Website)
- ✅ Open Graph meta tags for social sharing
- ✅ Twitter Card meta tags
- ✅ Canonical URLs
- ✅ XML Sitemap
- ✅ robots.txt
- ✅ Geo meta tags for local SEO
- ✅ Accessibility features (ARIA labels, skip links, semantic landmarks)
- ✅ Mobile-responsive design
- ✅ Fast loading (minimal dependencies)

## ♿ Accessibility

- Skip to main content link
- Proper heading hierarchy
- ARIA labels and roles
- Keyboard navigation support
- Reduced motion support
- High contrast ratios
- Alt text for all images

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## 📝 License

© 2026 My Living Hope. All rights reserved.

Website design and development by Tempero Creative.

---

**"Your word is a lamp for my feet, a light on my path."** — Psalm 119:105
