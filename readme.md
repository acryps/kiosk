# @acryps/kiosk
Kiosk watcher for embedded browsers.

Uses puppeteer to launch a chromium window in kiosk mode, then makes sure that the page can be loaded.

Example usage in a start script
```
#!/bin/sh

# install the latest version on startup
npm install @acryps/kiosk@latest

# show the cloud page
npx kiosk https://acryps.com/cloud
```