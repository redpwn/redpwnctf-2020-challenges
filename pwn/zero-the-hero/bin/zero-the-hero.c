#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void)
{
  char* buffer;
  long size;

  setbuf(stdout, NULL);
	setbuf(stdin, NULL);
	setbuf(stderr, NULL);

  puts("How many zeroes do you want?");
  scanf("%ld", &size);

  buffer = malloc(size);
  printf("I put a bunch of zeroes here: %p\n", buffer);

  puts("How much do you want to read?");
  scanf("%ld", &size);
  
 // if(size > 0 && size < 0x1000) read(0, buffer, size);
  buffer[size] = '0';

  puts("How badly do you want to be a hero?");
  scanf("%ms", &size);

  if(size == main) system("echo flag.txt");

  _exit(0);
}

