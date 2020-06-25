#include <stdio.h>
#include <string.h>

int main(void)
{
  int choice;

  printf("Give me a magic number: ");
  scanf("%d", &choice);

  if(choice == 0x1337) {
    puts("First part is: flag{r0pes_ar3_");
    puts("Second part is: just_l0ng_str1ngs}");
  }
}

