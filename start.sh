#!/usr/bin/env bash

export KIOSK_PORT=3000
export KIOSK_IMG_DIR=/media/greenbank/WAITINGROOM

date "+[%F %T] Greenbank kiosk starting..." >&2
exec node server.js --port $KIOSK_PORT --img-dir $KIOSK_IMG_DIR