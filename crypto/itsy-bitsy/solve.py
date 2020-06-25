#!/usr/bin/env python3

from pwn import *
from Crypto.Util.number import *

def primes(n):
    for i in range(n):
        if isPrime(i):
            yield i

def gen_ctxt(i,j):
    r = remote('2020.redpwnc.tf',31284,level='error')
    r.send(f'{i}\n{j}\n'.encode())
    r.recvuntil(b'Ciphertext: ')
    return r.recv().strip().decode()

def main():
    n = len(gen_ctxt(1,2))
    ptxt = [0] * n
    ptxt[:35] = ''.join(bin(ord(c))[2:] for c in 'flag{')
    ptxt[-7:] = bin(ord('}'))[2:]
    for p in primes(n):
        ctxt = list(gen_ctxt(p-1,p))
        for i in range(ceil_div(n,p)):
            ptxt[p*i] = str(int(ctxt[p*i]) ^ 1)
    flag = ''
    for i in range(len(ptxt)//7):
        b = ''.join(ptxt[i*7:(i+1)*7])
        c = chr(int(b,2))
        flag += c
    print(flag)

if __name__ == '__main__':
    main()
