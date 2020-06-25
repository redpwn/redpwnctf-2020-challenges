#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>

#define SIZE 100000
#define TESTS_SIZE 100000
const char *FLAG_FILE = "flag.txt";

// answer
unsigned int arr[SIZE];
int prefix[SIZE + 1];

// checks
int l[TESTS_SIZE];
int r[TESTS_SIZE];
int v[TESTS_SIZE];

// user input
int user_arr[SIZE];
int user_prefix[SIZE + 1];

int get_rand_int(int fd, int min, int max) {
    unsigned int num;
    if (read(fd, &num, sizeof num) < 0) {
        fprintf(stderr, "something went wrong. please contact an organizer.\n");
        fprintf(stderr, "info: could not read from /dev/urandom\n");
    }

    if (num & (1U << 31)) {
        num -= 1U << 31;
    }

    return (int)(num % (max - min + 1) + min);
}

void create_test_case() {
    int fd = open("/dev/urandom", O_RDONLY);
    if (fd < 0) {
        fprintf(stderr, "something went wrong. please contact an organizer.\n");
        fprintf(stderr, "info: could not read from /dev/urandom\n");
    }

    if (read(fd, arr, sizeof arr) < 0) {
        fprintf(stderr, "something went wrong. please contact an organizer.\n");
        fprintf(stderr, "info: could not read from /dev/urandom\n");
    }

    for (int i = 0; i < SIZE; i++) {
        if (arr[i] & (1U << 31)) {
            arr[i] -= 1U << 31;
        }
    }

    for (int i = 1; i <= SIZE; i++) {
        prefix[i] = prefix[i - 1] ^ arr[i - 1];
    }

    int cnt = 0;

    // check gaps of 10
    for (int i = 100; i <= SIZE; i += 100) {
        printf("%d %d %d\n", i - 9, i, prefix[i] ^ prefix[i - 10]);
        l[cnt] = i - 9;
        r[cnt] = i;
        v[cnt] = prefix[i] ^ prefix[i - 10];
        cnt++;
    }

    // check all together now a bunch
    int shift = get_rand_int(fd, 0, SIZE / 2);
    for (int i = 1; i <= 10; i++) {
        for (int j = i; j <= 10; j++) {
            int x = i + shift;
            int y = j + shift;
            printf("%d %d %d\n", x, y, prefix[y] ^ prefix[x - 1]);
            l[cnt] = x;
            r[cnt] = y;
            v[cnt] = prefix[y] ^ prefix[x - 1];
            cnt++;
        }
    }

    // chose random numbers until all tests done
    while (cnt < TESTS_SIZE) {
        int x = get_rand_int(fd, 1, SIZE);
        int y = get_rand_int(fd, 1, SIZE);

        if (y < x) {
            int tmp = y;
            y = x;
            x = tmp;
        }

        printf("%d %d %d\n", x, y, prefix[y] ^ prefix[x - 1]);
        l[cnt] = x;
        r[cnt] = y;
        v[cnt] = prefix[y] ^ prefix[x - 1];
        cnt++;
    }
}

int judge_response() {
    for (int i = 0; i < SIZE; i++) {
        scanf("%d", &user_arr[i]);
    }

    for (int i = 1; i <= SIZE; i++) {
        user_prefix[i] = user_prefix[i - 1] ^ user_arr[i - 1];
    }

    for (int i = 0; i < TESTS_SIZE; i++) {
        if ((user_prefix[r[i]] ^ user_prefix[l[i] - 1]) != v[i]) {
            return 0;
        }
    }

    return 1;
}

void print_flag() {
    FILE *flag_file = fopen(FLAG_FILE, "r");
    char *flag;
    size_t flag_size;

    if (flag_file == NULL) {
        fprintf(stderr, "something went wrong. please contact an organizer.\n");
        fprintf(stderr, "info: flag file is missing\n");
    } else {
        getline(&flag, &flag_size, flag_file);
        puts(flag);
    }
}

int main(int argc, char **argv) {
    setbuf(stdout, NULL);
    setbuf(stdin, NULL);
    setbuf(stderr, NULL);
    create_test_case();
    int res = judge_response();

    if (res) {
        print_flag();
    } else {
        puts("wrong answer...");
    }

    return 0;
}
