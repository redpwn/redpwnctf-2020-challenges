#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <errno.h>

void flip(unsigned long bit, unsigned short int offset);

char *messages[] = {
    "kevin higgs broke",
    "admin for kevin higgs?",
    "any hints for kevin??",
    "haha kevin higgs is impossible",
    "kevin higgs is quite an independent (binary|person)",
    "why does kevin higgs only work locally and not remotely?!",
    "it's so hard to exploit kevin higgs",
    "I don't understand kevin",
    "hi do u have flags for kevin? ill trade for inspector general fleg..",
    "how do you solve kevin higgs",
    "the stupidity of kevin higgs represents that of my life"
};

int DEBUG_MODE = 0;

void flip(unsigned long bit, unsigned short int offset) {
    unsigned long *b = (void*) (unsigned long) bit;
    unsigned short int val = *b;
    
    *b ^= 1UL << offset;

    printf("You flipped a bit! You should be proud of yourself, great job!\n");

    if (DEBUG_MODE) {
        printf("[debug] Here's your new byte: 0x%02hhx\n", *b);
    }

    return;
}

int main(unsigned long argc, char **argv) {
    setvbuf(stdout, NULL, _IONBF, 0);

    char input[11];
    char *numb_flips_str = getenv("NUMBER_OF_FLIPS");
    
    if (numb_flips_str == NULL) {
        printf("You need to specify the number of flips that you will be permitted to use through the $NUMBER_OF_FLIPS environmental variable.\n* if you do not understand the purpose of this, please reread the challenge description or reach out to an admin for help\n* the rate at which the number of bits permitted increases is accessible is displayed over netcat\n* once the first team solves this challenge, the clock will be stopped and all teams must find a solution using that number of bits or fewer\n\n");
        exit(1);
    }

    unsigned long numb_flips = (unsigned long) strtoul(numb_flips_str, NULL, 10);

    printf("Right now, this program will only let you flip %lu bit(s) anywhere in memory. That's all you get for now. No libc provided. Live up to kmh's expectations and get a shell. Note: Your HSCTF solutions don't work anymore :)\n\n", numb_flips);

    for (int i = 0; i < numb_flips; i++) {
        printf("Give me the address of the byte (hex uint32): ");
        fgets(input, 10, stdin);
        unsigned long decoded = (unsigned long) strtoul(input, NULL, 16);

        errno = 0;
        if (errno == ERANGE) {
            puts("Try again (please give hex uint32).\n");

            exit(1);
        } else {
            printf("Give me the index of the bit (0 to 7): ");
            fgets(input, 10, stdin);
            unsigned long offset = (unsigned long) strtoul(input, NULL, 10);

            if (offset < 0 || offset > 7) {
                printf("Try again (please give offset 0 to 7).\n");
                exit(1);
            }

            printf("Flipping 0x%08x at offset %lu...\n", decoded, offset);

            flip(decoded, (unsigned short int) offset);
        }
    }

    printf("Well, at least you tried.\n");
    exit(0);
}
