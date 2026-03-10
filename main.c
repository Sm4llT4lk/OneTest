#include <stdio.h>
#include "doubly_linked_list.h"

/* Helper: print a section title */
static void section(const char *title)
{
    printf("\n=== %s ===\n", title);
}

int main(void)
{
    DoublyLinkedList list;
    dll_init(&list);

    /* -------------------------------------------------------------- */
    section("Push back: 10, 20, 30, 40, 50");
    dll_push_back(&list, 10);
    dll_push_back(&list, 20);
    dll_push_back(&list, 30);
    dll_push_back(&list, 40);
    dll_push_back(&list, 50);
    dll_print_forward(&list);

    /* -------------------------------------------------------------- */
    section("Push front: 5");
    dll_push_front(&list, 5);
    dll_print_forward(&list);

    /* -------------------------------------------------------------- */
    section("Insert 25 at index 3");
    dll_insert_at(&list, 3, 25);
    dll_print_forward(&list);

    /* -------------------------------------------------------------- */
    section("Insert 99 after node containing 40");
    Node *ref = dll_find(&list, 40);
    if (ref) dll_insert_after(&list, ref, 99);
    dll_print_forward(&list);

    /* -------------------------------------------------------------- */
    section("Insert 1 before node containing 5 (head)");
    ref = dll_find(&list, 5);
    if (ref) dll_insert_before(&list, ref, 1);
    dll_print_forward(&list);

    /* -------------------------------------------------------------- */
    section("Traverse backward");
    dll_print_backward(&list);

    /* -------------------------------------------------------------- */
    section("Pop front");
    dll_pop_front(&list);
    dll_print_forward(&list);

    /* -------------------------------------------------------------- */
    section("Pop back");
    dll_pop_back(&list);
    dll_print_forward(&list);

    /* -------------------------------------------------------------- */
    section("Remove value 25");
    dll_remove_value(&list, 25);
    dll_print_forward(&list);

    /* -------------------------------------------------------------- */
    section("Remove at index 2");
    dll_remove_at(&list, 2);
    dll_print_forward(&list);

    /* -------------------------------------------------------------- */
    section("Get node at index 0, 1, 2");
    for (size_t i = 0; i <= 2; i++) {
        Node *n = dll_get(&list, i);
        if (n) printf("  index %zu -> %d\n", i, n->data);
    }

    /* -------------------------------------------------------------- */
    section("Reverse");
    dll_reverse(&list);
    dll_print_forward(&list);
    printf("Backward check: ");
    dll_print_backward(&list);

    /* -------------------------------------------------------------- */
    section("Is empty? (expected: 0)");
    printf("  dll_is_empty = %d\n", dll_is_empty(&list));

    /* -------------------------------------------------------------- */
    section("Clear list");
    dll_clear(&list);
    dll_print_forward(&list);
    printf("  dll_is_empty = %d\n", dll_is_empty(&list));

    return 0;
}
