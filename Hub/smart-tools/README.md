# SmartTools Hub

SmartTools is a static, browser-only tool hub for Victorious Visuals. It has no build step, server, database, or user account requirement.

## GitHub Pages placement

To publish this at:

`https://victoriousvisuals.site/Hub/smart-tools/`

place the contents of this folder in the GitHub Pages repository at exactly:

```text
Hub/
  smart-tools/
    index.html
    app.js
    styles.css
    shell.css
    layout-fix.css
    crop-fix.css
    templates/
      frame-01.webp
      frame-02.webp
      frame-03.webp
      frame-04.webp
      frame-05.webp
      frame-06.webp
      frame-07.webp
      frame-08.webp
      frame-09.webp
      frame-10.webp
```

Do not rename `index.html`, `app.js`, the CSS files, or the `templates` folder. The app uses relative paths so it works from the `/Hub/smart-tools/` subpath without a root-domain configuration.

## GitHub Pages checklist

1. Push the `Hub/smart-tools/` folder to the branch used by GitHub Pages.
2. In repository settings, set Pages to deploy from that branch and its chosen folder.
3. Keep the custom domain configured at the repository or organization Pages level.
4. Open `https://victoriousvisuals.site/Hub/smart-tools/` after deployment. A trailing slash is recommended for relative asset resolution.