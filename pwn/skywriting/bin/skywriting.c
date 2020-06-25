#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SIZE 0x100

char *msgs[5];
int i;

char* message(){
  i++;
  i %= 5;
  return msgs[i];
}

int main(void)
{
  msgs[0] = "use the right statistical randomness tests";
  msgs[1] = "disambiguate some homoglyphs";
  msgs[2] = "recognize the poem";
  msgs[3] = "interpret them as Google Drive IDs";
  msgs[4] = "recognize the logical clues";

  int choice;
  char buffer[128];

  setbuf(stdout, NULL);
  setbuf(stdin, NULL);
  setbuf(stderr, NULL);

  puts("Hello there, do you want to write on the sky? ");
  scanf("%d", &choice);

  if(choice == 1) {
    puts("Yay!");

    printf("Is the answer intuitive yet? Give it your best shot: ");
    read(0, buffer, 0x200);
    
    while(strcmp("notflag{a_cloud_is_just_someone_elses_computer}\n", buffer) != 0) {
      printf("%s??\n", buffer);
      printf("I can't believe you haven't gotten it yet. You just need to %s and its trivial\n", message());
      printf("Try again, give it another shot: ");
      
      read(0, buffer, 0x200);
    }

    puts("Good job! You did it!");
  } else {
    printf(":(, take this shell instead\n");
    system("/bin/zsh");
  }
}

