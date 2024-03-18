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
kiosk https://acryps.com/cloud
```

## Full setup guide
The listed guides have been tested by us when we set up kiosks on different platforms. Install the OS and then execute the script over SSH or in the terminal **as the root user**. 

- [Raspberry Pi](setup/raspberry-pi)
- [Debian with LXDE](setup/debian/lxde)
