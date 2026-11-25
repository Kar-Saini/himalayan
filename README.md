# Himalaya Tulsi Healthcare — responsive website starter

## Pages
- `index.html` — home, services, featured hospitals and patient journey
- `hospitals.html` — six hospital profiles with search/filter and official links
- `doctors.html` — searchable starter directory with official hospital doctor-directory links
- `consultation.html` — highlighted enquiry form
- `styles.css`, `script.js` — responsive styling and interactions
- `backend/contact.php` — basic PHP email handler
- `assets/logo.png`, `assets/wallpaper.png` — supplied assets

## Important setup before going live
1. Upload the complete folder to a PHP-capable web host and enable HTTPS. Opening the HTML files directly from a computer will not send email.
2. In `backend/contact.php`, replace `REPLACE_WITH_ADMIN_EMAIL@example.com` with the administrator's inbox. Configure the hosting server's mail delivery; in production, an authenticated transactional email provider (SMTP/API) is more reliable than PHP `mail()`.
3. Update `YOUR_ADMIN_EMAIL` and all placeholder contact information in the HTML pages.
4. Configure a real privacy notice, retention policy, access controls, spam protection/rate limits and secure handling for any medical records. This starter does not upload medical files.
5. The language selector currently translates the main navigation labels only. It is a working UI foundation, not a complete translation of every page. Arrange professional translations before marketing to patients in each language.
6. The doctor directory contains selected examples from official hospital directories, not every doctor. Those lists change frequently and some hospitals have hundreds of profiles. To provide a truly complete and maintainable directory, obtain permission where needed and import verified current profiles from each hospital's official data/feed/API or curated source list. Official directory links are provided in `doctors.html`.
7. Review hospital names, locations, credentials, legal statements, contact details and service claims before launch. No hospital partnership or accreditation is implied by this website starter.

## Email workflow
The form posts to `backend/contact.php`. The PHP handler validates required fields, uses a honeypot, and emails the configured admin address. It returns a JSON status. A production deployment should add robust rate limiting, CAPTCHA or equivalent abuse protection, logging, SPF/DKIM/DMARC-aligned sender configuration, and a transactional email provider. Do not collect sensitive medical documents until secure storage and access control are implemented.

## Local preview
Use a local web server to preview all pages. For example, from this folder run `php -S localhost:8000`, then visit `http://localhost:8000/`. The email handler will not deliver until the server's mail system and recipient are configured.

## Doctor listings
The site includes selected doctor examples verified against hospital listings and links to each hospital's official directory. Do not describe the embedded examples as a complete roster: doctor lists, credentials and availability change frequently. The official directory links provide the current full listings where published.

## Google Translate
The fixed language picker uses Google Translate's website widget. It requires JavaScript and network access, so it will not work in a fully offline preview. Test it on your hosted HTTPS domain.
