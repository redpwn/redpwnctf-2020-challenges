#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SIZE 0x100
#define MAX_SIZE 0x4000

int main(void)
{
  char name[SIZE];

  setbuf(stdout, NULL);
  setbuf(stdin, NULL);
  setbuf(stderr, NULL);
  
  printf("What is your name: ");
  safe_read(0, name, SIZE + 0x20);

  printf("Hello ");
  printf(name);
}

void safe_read(int fd, char* buff, size_t len) {
  if (len > MAX_SIZE) {
    len = MAX_SIZE;
  }

  int ret = read(fd, buff, len);
  if(ret == -1) {
    write(2, "read error\n", 11);
    _exit(-1);
  }
}

