# @acryps/kiosk
Kiosk watcher for embedded browsers.

Uses puppeteer to launch a chromium window in kiosk mode, then makes sure that the page can be loaded.

Example usage in a start script
```
#!/bin/sh

# set active display
export DISPLAY=:0

# install the latest version on startup
npm install --global @acryps/kiosk@latest

# show the cloud page
kiosk https://acryps.com/cloud --some-chrome-option
```

Add a `window.kioskAlive()` function to your website, which will be called every second to ensure that the page is working.
The page will be reloaded if the function returns an error or a non `true` value.
The function is not awaited, it must return a value immediately.

The screen will turn dark gray if the health check failed and the page is trying to reload.
```
// just make sure that the page loaded
(globalThis as any).kioskAlive = () => true;

// fail if the network connection is broken
(globalThis as any).kioskAlive = () => navigator.onLine;

// fail when the first unhandled error occurs
window.onerror = () => {
	delete (globalThis as any).kioskAlive;
};
```

## Full setup guide
The listed guides have been tested by us when we set up kiosks on different platforms. Install the OS and then execute the script over SSH or in the terminal **as the root user**. 

- [Raspberry Pi](setup/raspberry-pi)
- [Debian with LXDE](setup/debian/lxde)
