// DEV-ONLY preview products.
//
// The Abide booklet exists in Firestore as a *draft* (status !== 'published'),
// so the live storefront query (which filters published + is enforced by
// security rules) can't see it yet. To preview the full launch on localhost
// without writing to the live database, `useProducts` merges these entries in
// — but ONLY when `import.meta.env.DEV` is true. In a production build this is
// inert (and tree-shaken out).
//
// These values mirror exactly what must be set on the real Firestore doc before
// go-live (see docs/superpowers/specs/2026-06-21-abide-booklet-launch-design.md).

const ABIDE_DESCRIPTION = `Spiritual practices for day-to-day life — by Annabelle McLennan.

Abide is a guided booklet for anyone who's ever felt a gap between their faith and their everyday life. It walks you through twelve spiritual practices — the everyday rhythms we see Jesus living out in the gospels — as simple, doable invitations rather than boxes to tick.

Each practice comes with the why behind it, scripture to sit with, a simple way to begin, and honest reflection questions to make it your own:

Solitude · Rest · Reading the Bible · Prayer · Service · Generosity · Fasting · Community · Witness · Simplicity · Worship · Stewardship

Come as you are. You can't make God love you any more or any less than He already does — but you can deepen the relationship. Abide is a gentle, practical way in, whether for personal devotion, a youth group, or ministry.

Part of Beyond Experience Kindred, a ministry of Scripture Union New Zealand.`

export const previewProducts = [
  {
    id: '2FsLT36JM7wVUkkq4dof',
    slug: 'abide-spiritual-practices-booklet',
    title: 'Abide - Spiritual Practices Booklet',
    subtitle: 'Spiritual Practices For Day-To-Day Life',
    description: ABIDE_DESCRIPTION,
    priceNZD: 2000,
    compareAtPrice: null,
    inventory: null,
    sortOrder: 1,
    status: 'published',
    theme: 'abide',
    seo: {
      title: 'Abide — Spiritual Practices Booklet | My Living Hope',
      description:
        'A guided booklet of 12 spiritual practices for everyday faith — solitude, prayer, rest, generosity and more. Simple, doable ways to walk with God.',
    },
    images: [
      'https://firebasestorage.googleapis.com/v0/b/my-living-hope.firebasestorage.app/o/storeProducts%2F1782006474233_Gemini_Generated_Image_5cz0d75cz0d75cz0.png?alt=media&token=85199cd7-48f3-4afb-a5d8-1e78e09c2699',
      'https://firebasestorage.googleapis.com/v0/b/my-living-hope.firebasestorage.app/o/storeProducts%2F1782019312065_Gemini_Generated_Image_i5a8o8i5a8o8i5a8.png?alt=media&token=9eb1f81c-7080-4be7-96c1-53f7b61979a8',
    ],
  },
]
