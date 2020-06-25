#!/bin/sh

set -e

FILE="source.zip"

rm -f "$FILE"
zip -r "$FILE" api web notes main.py notes.py
