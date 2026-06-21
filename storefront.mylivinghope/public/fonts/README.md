# Fonts

## BorisBlackBoxx (Abide header font)

The Abide brand uses **BorisBlackBoxx** as its display/header font. It is not a Google Font,
so the web font file must live here.

**Active file:** `BorisBlackBloxx.ttf` (the real font is spelled "Boris Black Bloxx").
`src/index.css` references it via `@font-face` (`url("/fonts/BorisBlackBloxx.ttf")`,
family name `"BorisBlackBoxx"`). If the file is missing, the Abide surfaces fall back to
**Archivo Black** (Google Fonts), a close chunky display face.

To shrink it, convert the `.ttf` to `.woff2` and update the `@font-face` `src`.

Convert an `.otf`/`.ttf` to `.woff2` with e.g. https://www.fontsquirrel.com/tools/webfont-generator
or `fonttools`/`woff2_compress`.
