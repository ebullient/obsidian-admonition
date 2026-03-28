# Color Formats

The `color:` parameter accepts multiple input formats. All are converted to an RGB triad internally and applied as `--callout-color` CSS custom property.

The documented format is an RGB triad. The others are undocumented but supported.

---

## RGB triad (documented)

Three integers 0–255 separated by commas.

```ad-note
title: color: 100, 149, 237
color: 100, 149, 237
Cornflower blue via RGB triad.
```

---

## rgb() function

```ad-note
title: color: rgb(255, 140, 0)
color: rgb(255, 140, 0)
Dark orange via `rgb()` function notation.
```

---

## Hex

```ad-note
title: color: #9370DB
color: #9370DB
Medium purple via hex.
```

---

## HSL

```ad-note
title: color: hsl(120, 60%, 40%)
color: hsl(120, 60%, 40%)
Forest green via HSL.
```

---

## HSB / HSV

Both `hsb()` and `hsv()` are accepted (they are equivalent).

```ad-note
title: color: hsb(200, 70%, 90%)
color: hsb(200, 70%, 90%)
Steel blue via HSB.
```

```ad-note
title: color: hsv(30, 80%, 95%)
color: hsv(30, 80%, 95%)
Sandy brown via HSV (same format as HSB).
```

---

## No color override

Without `color:`, the admonition uses the color defined in its type configuration.

```ad-warning
title: No color override
Uses the default warning color defined in plugin settings.
```
