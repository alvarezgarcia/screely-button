#!/bin/bash

SCREENSHOT_TOOL=/usr/bin/gnome-screenshot
SCREENSHOT_ARGS="-i"
SCREENSHOT_CMD="$SCREENSHOT_TOOL $SCREENSHOT_ARGS"

export SCREENSHOT_DIR=/home/sebastian/Imágenes

SLEEP_TIME=3

DIR=$(dirname "$0")

# If you use NVM you have to set it to PATH
NVM_BIN=/home/sebastian/.nvm/versions/node/v9.2.0/bin
PATH=$PATH:$NVM_BIN

eval $SCREENSHOT_CMD
echo "Waiting $SLEEP_TIME seconds before uploading to Screely"

cd $DIR
npm run dev 2&> /tmp/screely-button.log
