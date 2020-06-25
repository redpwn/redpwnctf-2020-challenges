#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SIZE 1

void alloc();
void delete();
void show();
void bye();
int promptIdx();

char* arr[SIZE];

int main(void)
{
  int choice;
  int ops;

  setbuf(stdout, NULL);
  setbuf(stdin, NULL);
  setbuf(stderr, NULL);

  puts("{{introductory_statement}}");
  
  ops = 0;
  while(1) {
    if(ops >= 15) {
      puts("{{arbitrary_operation_limit_reached}}");
      bye();
    }
    ops++;

    puts("{{menu}}");
    printf("{{prompts.menu}}: ");
    scanf("%d", &choice);

    switch(choice) {
      case 1: 
        alloc();
        break;
      case 2:
        delete();
        break;
      case 3: 
        show();
        break;
      case 4:
        bye();
    }


  }
}

int promptIdx() {
  int idx;

  printf("{{prompts.index}}: ");
  scanf("%d", &idx);

  if(idx < 0 || idx >= SIZE) bye();

  return idx;
}

void alloc() {
  int idx;
  int size;
  int amt;

  puts("{{flavortext.alloc}}");
  idx = promptIdx();

  printf("{{prompts.size}}: ");
  scanf("%d", &size);
  getchar();

  if(size <= 0 || size > 0x1000) bye();

  arr[idx] = (char*) malloc(size);

  printf("{{prompts.read}}: ");
  amt = read(0, arr[idx], size - 1);

  if(amt == -1) bye();
  arr[amt] = '\x00';
}

void delete() {
  int idx;

  puts("{{flavortext.free}}");
  idx = promptIdx();

  free(arr[idx]);

  puts("{{flavortext.vuln_is_here}}");
}

void show() {
  int idx;

  puts("{{flavortext.show}}");
  idx = promptIdx();

  puts(arr[idx]);

  puts("{{flavortext.use_after_free}}");
}

void bye() {
  puts("{{ending_statement}}");
  _exit(0);
}
