#!/usr/bin/env python3

from Crypto.Util.number import *
import random

flag = open('flag.txt','rb').read()

class Generator:
	def __init__(self,bits):
		self.p = getPrime(bits)
		self.q = getPrime(bits)
		self.N = self.p*self.q
		print(self.N)

	def gen(self):
		numbers = []
		for round in range(4):
			x = getPrime((1<<10)-random.randint(1<<0,1<<8))
			y = inverse(x,(self.p-1)*(self.q-1)//GCD(self.p-1,self.q-1))
			numbers.append(y)
		print(numbers)

	def encrypt(self,m):
		return pow(m,0x1337,self.N)

g = Generator(1024)
g.gen()
m = bytes_to_long(flag)
print(g.encrypt(m))