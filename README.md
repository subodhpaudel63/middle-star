# Hotel Middle Star – website

A fast, static website: plain HTML, CSS and JavaScript. No frameworks, no build step, no tracking.
It works offline after the first visit.

## Run it

* **Quick look:** double-click `index.html` (works from disk; offline mode is skipped on `file://`).
* **Local server (enables offline mode):** run `python3 -m http.server 8000` in this folder, then open http://localhost:8000
* **Publish:** upload the whole folder to any web host. Use **HTTPS** so offline mode and "install as app" work.

## Pages (one HTML file each)

| File | Page |
|---|---|
| `index.html` | Home – cover, rooms, restaurant, highlights, about, gallery strip |
| `rooms.html` | Rooms, what is in every room, booking-agent links |
| `restaurant.html` | Roof top restaurant and bar |
| `gallery.html` | All photos with category filter and full-screen viewer |
| `about.html` | About the hotel, numbers, places to visit nearby |
| `contact.html` | Contact form, map card, FAQ |
| `404.html` | "Page not found" page (most hosts use it automatically) |

The header, footer and booking blocks are repeated in each file. If you change the menu or the footer, change it in every page (search the files for the `HEADER` / `FOOTER` comments).

## Folder structure

```
hotel-middle-star/
├── index.html rooms.html restaurant.html gallery.html about.html contact.html 404.html
├── sw.js                    Service worker – saves the site so it works with no internet
├── manifest.webmanifest     Lets visitors "install" the site as an app
├── robots.txt, sitemap.xml  Search-engine files (change the domain inside if needed)
└── assets/
    ├── css/    fonts, base, layout, hero, photos, components, animations, responsive (loaded in this order)
    ├── js/     main.js – animations, menu, gallery, FAQ, offline registration
    ├── images/ logo.png, favicon.png, icon-192/512.png, hotel photos
    └── fonts/  Inter (400/500/600) + Playfair Display (500/600), woff2 + licences
```

## How to change a photo

Every photo spot in the HTML has a `PHOTO:` comment, and the top of each page explains the steps.

1. **Easiest:** save your new photo in `assets/images/` with the **same file name** as the old one (e.g. `room-lake-view.jpg`). All pages update.
2. **New name:** put the photo in `assets/images/`, open `assets/css/photos.css`, copy one `.ph-…` rule, rename it (e.g. `.ph-my-room`), point `url()` to your file, then use `class="sc ph-my-room"` where the photo should appear.
3. **Gallery:** each photo is one `<button class="iw rv"> … </button>` block (see the comment above the grid in `gallery.html`). Copy a block to add a photo, change `data-c` (Rooms / Dining / Hotel), the `ph-…` class and the caption. Delete the block to remove it.

Best size: JPG, 1200–1600 px wide, under 300 KB.

## Other common changes

| I want to… | Edit |
|---|---|
| Text, prices, phone, email, address | The `.html` files (search for the old text) |
| Colours | `:root { … }` at the top of `assets/css/base.css` |
| Page title / description (Google) | `<title>` and `<meta name="description">` in each page's `<head>` |
| Booking.com / agent links | Search `booking.com` in the `.html` files and use the hotel's direct page links |
| Logo | Replace `assets/images/logo.png` (square, transparent background) |

## Offline mode (important when you update the site)

`sw.js` saves every file. After changing **any** file, open `sw.js` and raise `const CACHE = 'middle-star-v2'` to `v3`, `v4`… so returning visitors get the update. When you add a new page or image, also add it to the `ASSETS` list in `sw.js`.

## Notes

* The contact form opens the visitor's email app (`mailto:`); there is no server. For a real form, connect a service such as Formspree or Netlify Forms.
* The map on the Contact page is an illustration with buttons that open live Google Maps. On your own domain you can replace it with Google's embed iframe.
* Fonts: Inter and Playfair Display (SIL Open Font License, licences in `assets/fonts/`). Icons: Lucide (ISC licence).
