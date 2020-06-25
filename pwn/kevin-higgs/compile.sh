#!/bin/sh

gcc kevin-higgs.c -o kevin-higgs -m32 -no-pie -g0 -O0 # -Wl,-Ttext=0xdeadbeef -v
strip kevin-higgs

# "GCC: (GNU) 10.1.0" => "i use arch btw :) "
