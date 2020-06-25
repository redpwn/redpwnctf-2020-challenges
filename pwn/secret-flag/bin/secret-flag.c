#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SIZE 0x100

int main(void)
{
  char* flag;
  char name[20];
  int fd;
  
  flag = malloc(SIZE);
  fd = open("flag.txt", 0);
  read(fd, flag, SIZE);

  setbuf(stdout, NULL);
  setbuf(stdin, NULL);
  setbuf(stderr, NULL);

  puts("I have a secret flag, which you'll never get!");
  puts("What is your name, young adventurer?");

  fgets(name, 20, stdin);
  printf("Hello there: ");
  printf(name);
}

