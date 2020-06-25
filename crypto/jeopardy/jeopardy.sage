#!/usr/bin/env sage
import random
import time
import asyncio
import traceback

flag = open('flag.txt','r').read()

def isPrime(n):
    if n == 2: return True
    if n%2 == 0: return False
    r,d = 0,n-1
    while d%2 == 0: r += 1; d //= 2
    for k in range(1):
        a = random.randint(2,n-2)
        x = pow(a,d,n)
        if x == 1 or x == n-1: continue
        for i in range(r-1):
            x = pow(x,2,n)
            if x == n-1: continue
        else: return False
    return True


async def handle_conn(reader, writer):
    async def prompt(ptext):
        writer.write(ptext.encode())
        await writer.drain()
        return (await reader.readline()).decode()

    try:
        BITS = 200

        a = Integer(await prompt('a: '))
        b = Integer(await prompt('b: '))
        p = Integer(await prompt('p: '))

        E = EllipticCurve(GF(p), [a,b])
        assert E.order().nbits() >= BITS
        assert E.order() != p
        assert isPrime(E.order())

        G = E.gens()[0]
        writer.write(f'{G}\n'.encode())
        secret = random.randint(1,E.order()-1)
        pub = G * secret
        writer.write(f'{pub}\n'.encode())

        user = int(await prompt('secret?'))
        if user == secret:
            writer.write(f'{flag}\n'.encode())
            await writer.drain()
    except Exception:
        writer.write(traceback.format_exc(2).encode())
    finally:
        await writer.drain()
        writer.close()
        await writer.wait_closed()


async def main():
    server = await asyncio.start_server(handle_conn, '0.0.0.0', 9999)

    addr = server.sockets[0].getsockname()
    print(f'Listening on {addr}')

    async with server:
        await server.serve_forever()

asyncio.run(main())
