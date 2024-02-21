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

## Full install from scratch
Sets up everything required to run kiosk on a fresh raspbian install (run in sudo).

```
URL=https://acryps.com/
LAUNCH_SCRIPT_LOCATION=/boot/firmware/kiosk
SERVICE_NAME=kiosk
SERVICE_FILE=/etc/systemd/system/$SERVICE_NAME.service
BROWSER_USER=$(ls /home/ | head -n 1)

# install nodejs and npm
apt install -y nodejs npm chromium

# create launch file
echo '#!/bin/sh' > $LAUNCH_SCRIPT_LOCATION
echo "export DISPLAY=:0" >> $LAUNCH_SCRIPT_LOCATION
echo "export PUPPETEER_EXECUTABLE_PATH=$(which chromium)"
echo 'npm install --global @acryps/kiosk@latest' >> $LAUNCH_SCRIPT_LOCATION
echo "kiosk $URL" >> $LAUNCH_SCRIPT_LOCATION
chmod +x $LAUNCH_SCRIPT_LOCATION

# create launch service
echo "[Unit]" > $SERVICE_FILE
echo "Description=Kiosk Browser" >> $SERVICE_FILE
echo >> $SERVICE_FILE
echo "[Service]" >> $SERVICE_FILE
echo "User=$BROWSER_USER" >> $SERVICE_FILE
echo "Group=$BROWSER_USER" >> $SERVICE_FILE
echo "ExecStart=$LAUNCH_SCRIPT_LOCATION" >> $SERVICE_FILE
echo >> $SERVICE_FILE
echo "[Install]" >> $SERVICE_FILE
echo "WantedBy=multi-user.target" >> $SERVICE_FILE

# activate service
systemctl start $SERVICE_NAME.service
systemctl enable $SERVICE_NAME.service
```
