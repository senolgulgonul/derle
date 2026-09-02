#include <stdio.h>

int main(void) {
    int a, b;
    if (scanf("%d %d", &a, &b) != 2) {
        printf("input error: expected two integers\n");
        return 1;
    }
    printf("%d + %d = %d\n", a, b, a + b);
    return 0;
}
