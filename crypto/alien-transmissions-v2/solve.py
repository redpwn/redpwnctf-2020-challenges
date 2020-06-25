from itertools import cycle
f = open("encrypted.txt")
encrypted = f.read().split("\n")[:-1]

common = []
len1 = 21
len2 = 19
keylen = 21 * 19
for i in range(keylen):
    chars = encrypted[i::keylen]
    count = [0] * 512
    for char in chars:
        count[int(char)] += 1
    max = 0
    curr = 0
    for char, num in enumerate(count):
        if num > max:
            max = num
            curr = char
    common.append(curr)

deliminator = 481
decrypted = []
for char in common:
    decrypted.append(char ^ deliminator)


for i in range(255):
    key1 = [-1] * len1
    key2 = [-1] * len2

    key1[0] = i
    for d, k1, k2 in zip(decrypted, cycle(range(len1)), cycle(range(len2))):
        if key1[k1] == -1 and key2[k2] == -1:
            continue
        if key1[k1] != -1 and key2[k2] != -1:
            continue
        if key1[k1] == -1:
            key1[k1] = key2[k2] ^ d
        if key2[k2] == -1:
            key2[k2] = key1[k1] ^ d

    print(''.join(map(chr, key1)) + ''.join(map(chr, key2)))
