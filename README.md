# projectstatus
Using Raspberry to display a projects health and build status

The dummy_onoff_nodemodule can replace the onoff module if you have no GPIO on your macbook.

sudo apt-get install libusb-1.0-0-dev is required for the USB on RPI3
Or, sudo apt-get install libudev-dev -y

Update of old Node JS.
sudo apt-get remove nodered -y
sudo apt-get remove nodejs nodejs-legacy -y
sudo apt-get remove npm -y
sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo bash -
sudo apt-get install -y nodejs

On error LIBUSB_ERROR_ACCESS: 
echo "SUBSYSTEM==\"usb\", ATTR{idVendor}==\"20a0\", ATTR{idProduct}==\"41e5\", MODE:=\"0666\"" | sudo tee /etc/udev/rules.d/85-blinkstick.rules

sudo apt-get install flite is required for speech on RPI3


