#!/usr/bin/env python3

# values from transcribed-ciphertext.jpg
b12_ctxt = [
	[8,6],
	[9,0],
	[8,1],
	[8,7],
	[10,3],
	[4,9],
	[9,9],
	[4,3],
	[9,7],
	[9,7],
	[4,1],
	[9,2],
	[4,9],
	[7,11],
	[4,1],
	[9,7],
	[7,11],
	[4,4],
	[9,2],
	[7,11],
	[4,4],
	[9,6],
	[9,8],
	[10,5]
]

flag = ''

for a,b in b12_ctxt:
    n = a * 12 + b
    flag += chr(n)

print(flag)