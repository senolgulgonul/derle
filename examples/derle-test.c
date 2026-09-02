#include <stdio.h>

int main(void) {
    int v = 12, r = 3;
    printf("Derle test: V=%d, R=%d, I=%d A\n", v, r, v / r);
    printf("int is %d bytes here\n", (int)sizeof(int));
    return 0;
}
