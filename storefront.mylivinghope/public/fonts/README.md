# Fonts

## BorisBlackBoxx (Abide header font)

The Abide brand uses **BorisBlackBoxx** as its display/header font. It is not a Google Font,
so the web font file must live here.

**To activate it:**
1. Drop `BorisBlackBoxx.woff2` into this folder (`public/fonts/`).
2. That's it — `src/index.css` already has the matching `@font-face` rule
   (`url("/fonts/BorisBlackBoxx.woff2")`).

Until the file is present, the Abide surfaces fall back to **Archivo Black**
(loaded from Google Fonts), a close chunky display face.

Convert an `.otf`/`.ttf` to `.woff2` with e.g. https://www.fontsquirrel.com/tools/webfont-generator
or `fonttools`/`woff2_compress`.
