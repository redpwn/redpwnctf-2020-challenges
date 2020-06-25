#!/usr/bin/env python3
import numpy as np
from Crypto.Util.number import *
from random import randint

flag = open('flag.txt','rb').read()

p = getPrime(1024)
q = getPrime(1024)
n = p*q
e = 65537

message = bytes_to_long(b'redpwnCTF is a cybersecurity competition hosted by the redpwn CTF team.')

def menu():
    print()
    print('[1] Sign')
    print('[2] Verify')
    print('[3] Exit')
    return input()

print(p)

while True:
	choice = menu()

	if choice == '1':
		msg = bytes_to_long(input('Message: ').encode())
		if msg == message:
			print('Invalid message!')
			continue

		n1 = [randint(0,11) for _ in range(29)]
		n2 = [randint(0,2**(max(p.bit_length(),q.bit_length())-11)-1) for _ in range(29)]
		a = sum(n1[i]*n2[i] for i in range(29))

		enc = [pow(msg,i,n) for i in n2]
		P = np.prod(list(map(lambda x,y: pow(x,y,p),enc,n1)))
		Q = np.prod(list(map(lambda x,y: pow(x,y,q),enc,n1)))
		
		b = inverse(e,(p-1)*(q-1))-a
		sig1 = b%(p-1)+randint(0,q-2)*(p-1)
		sig2 = b%(q-1)+randint(0,p-2)*(q-1)
		print(sig1,sig2)
		
		sp = pow(msg,sig1,n)*P%p
		sq = pow(msg,sig2,n)*Q%q
		s = (q*inverse(q,p)*sp + p*inverse(p,q)*sq) % n

		print(s)
		print("Signed!")

	elif choice == '2':
		try:
			msg = bytes_to_long(input('Message: ').encode())
			sig = int(input('Signature: '))
			if pow(sig,e,n) == msg:
				print("Verified!")
				if msg == message:
					print("Here's your flag: {}".format(flag))
			else:
				print("ERROR HAS OCCURRED...")
		except:
			print("Invalid signature!")

	elif choice == '3':
		print("Good bye!")
		break