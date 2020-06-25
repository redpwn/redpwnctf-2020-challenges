#!/usr/bin/env python3

from Crypto.Util.number import *
import random

flag = open('flag.txt','rb').read()
assert len(flag) < 100

def gen(bits):
	while True:
		alpha = getPrime(bits)
		beta = getPrime(bits)
		mod = alpha*beta
		x = random.randint(1, mod)
		y = alpha^(bytes_to_long(flag[len(flag)//2:])<<0x1f0)

		if pow(beta**2*x,(alpha-1)//2,alpha) + pow(alpha**2*x,(beta-1)//2,beta) == alpha+beta-2:
		    break
	return (x,y), mod

def encrypt(m,p,k):
	m = bin(bytes_to_long(m))[2:]
	x,a = p
	c = []

	for b in m:
		while True:
			y = random.randint(1,k)
			if GCD(y,k) == 1:
				c.append((x**int(b)*y**2)%k)
				break
	return c

a,b = gen(1024)
encrypted = encrypt(flag[:len(flag)//2],a,b)
print(encrypted, a[1], b)