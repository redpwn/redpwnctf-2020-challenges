from random import randint
from itertools import cycle
keys = ["h3r3'5_th3_f1r5t_h4lf", "_th3_53c0nd_15_th15"]
deliminator = 481

print("Generating message...")
message = []
for _ in range(100000):
    wordlen = randint(8, 12)
    message.append(deliminator)
    for _ in range(wordlen):
        message.append(randint(0, 511))
message = message[1:]

print("Encrypting message...")
for key in keys:
    for i, (m, b) in enumerate(zip(message, cycle(key))):
        message[i] = m ^ ord(b)

print("Creating output...")
string = ""
for m in message:
    string += str(m) + "\n"
f = open("encrypted.txt", "w+")
f.write(string)
f.close()
