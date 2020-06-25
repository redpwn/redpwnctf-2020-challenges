#!/bin/sh

set -e

export NUMBER_OF_FLIPS="$(/usr/local/bin/python /limit.py)"

if [ "x$NUMBER_OF_FLIPS" = "x" ]; then
    printf "There was an error when fetching the golf limit that prevented xinetd from running.\n"
    exit 1
fi

/kevin-higgs
