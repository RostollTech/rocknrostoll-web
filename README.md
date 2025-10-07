# Rostoll Web

A Vite + React site for the Rostoll festival.

## External link security

This project uses `target="_blank"` for several social media and email links so they open in a new tab. To avoid the security and privacy issues that come with opening third-party pages, each of those anchors also includes `rel="noopener noreferrer"`:

- `noopener` prevents the newly opened page from getting a reference to the origin tab via `window.opener`, which mitigates tabnabbing attacks where the external page could redirect the original site to a phishing URL.
- `noreferrer` blocks the browser from sending the original page's URL in the `Referer` header, so the external service does not learn which page launched the link.

Keeping both values together ensures external tabs are isolated from our application while also protecting the festival's visitors from referrer leaks.
