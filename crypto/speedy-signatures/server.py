#!/usr/bin/env python3

from Crypto.Util.number import inverse
import ecdsa
import random
import hashlib

flag = open('flag.txt','rb').read()

C = ecdsa.NIST256p
G = C.generator
n = C.order
k = random.randint(1,n-1)

for i in range(100):
	print("> ROUND ",i+1)

	ans = random.randint(1,n-1)
	Q = G*ans
	print(Q.x(),Q.y())

	m1 = input("Enter first message: ").encode()
	h1 = int(hashlib.sha256(m1).hexdigest(),16)
	done = False
	while not done:
		k1 = k+random.randint(1,4096)
		P = k1*G
		r1 = P.x()%n
		if r1 == 0:
			continue
		s1 = inverse(k1,n)*(h1+r1*ans)%n
		if s1 == 0:
			continue
		done = True

	m2 = input("Enter second message: ").encode()
	h2 = int(hashlib.sha256(m2).hexdigest(),16)
	done = False
	while not done:
		k2 = k+random.randint(1,4096)
		if k1 == k2:
			continue
		P2 = k2*G
		r2 = P2.x()%n
		if r2 == 0:
			continue
		s2 = inverse(k2,n)*(h2+r2*ans)%n
		if s2 == 0:
			continue
		done = True

	sigs = [str(r1),str(s1),str(r2),str(s2)]
	random.shuffle(sigs)
	sigs.pop(random.randint(0,3))
	print(' '.join(sigs))

	user_ans = int(input("What's my number?\n").strip())
	if user_ans == ans:
		print("Correct!")
		if i == 99:
			print("Here's your flag: {}".format(flag))
	else:
		print("Wrong! Better luck next time...")
		break
	print()