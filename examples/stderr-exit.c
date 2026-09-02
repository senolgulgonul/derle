#include <stdio.h>

int main(void) {
    fprintf(stderr, "warning: this goes to stderr\n");
    printf("this goes to stdout\n");
    return 42;
}
