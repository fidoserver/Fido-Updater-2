cd /root/GrovePi/Firmware;
avrdude -c gpio -p m328p -U flash:w:grove_pi_firmware.hex
