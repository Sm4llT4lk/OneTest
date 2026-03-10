#include <stdio.h>
#include <stdlib.h>
#include "doubly_linked_list.h"

/* ------------------------------------------------------------------ */
/*  Internal helper                                                     */
/* ------------------------------------------------------------------ */

static Node *node_new(int value)
{
    Node *n = (Node *)malloc(sizeof(Node));
    if (n) {
        n->data = value;
        n->prev = NULL;
        n->next = NULL;
    }
    return n;
}

/* ------------------------------------------------------------------ */
/*  List lifecycle                                                      */
/* ------------------------------------------------------------------ */

void dll_init(DoublyLinkedList *list)
{
    if (!list) return;
    list->head = NULL;
    list->tail = NULL;
    list->size = 0;
}

void dll_clear(DoublyLinkedList *list)
{
    if (!list) return;
    Node *current = list->head;
    while (current) {
        Node *next = current->next;
        free(current);
        current = next;
    }
    list->head = NULL;
    list->tail = NULL;
    list->size = 0;
}

/* ------------------------------------------------------------------ */
/*  Insertions                                                          */
/* ------------------------------------------------------------------ */

int dll_push_front(DoublyLinkedList *list, int value)
{
    if (!list) return -1;
    Node *n = node_new(value);
    if (!n) return -1;

    if (list->head == NULL) {
        list->head = n;
        list->tail = n;
    } else {
        n->next        = list->head;
        list->head->prev = n;
        list->head       = n;
    }
    list->size++;
    return 0;
}

int dll_push_back(DoublyLinkedList *list, int value)
{
    if (!list) return -1;
    Node *n = node_new(value);
    if (!n) return -1;

    if (list->tail == NULL) {
        list->head = n;
        list->tail = n;
    } else {
        n->prev        = list->tail;
        list->tail->next = n;
        list->tail       = n;
    }
    list->size++;
    return 0;
}

int dll_insert_at(DoublyLinkedList *list, size_t index, int value)
{
    if (!list) return -1;

    if (index == 0)
        return dll_push_front(list, value);

    if (index >= list->size)
        return dll_push_back(list, value);

    /* Walk to node at `index` */
    Node *current = list->head;
    for (size_t i = 0; i < index; i++)
        current = current->next;

    return dll_insert_before(list, current, value);
}

int dll_insert_after(DoublyLinkedList *list, Node *ref, int value)
{
    if (!list || !ref) return -1;

    if (ref == list->tail)
        return dll_push_back(list, value);

    Node *n = node_new(value);
    if (!n) return -1;

    n->prev       = ref;
    n->next       = ref->next;
    ref->next->prev = n;
    ref->next       = n;
    list->size++;
    return 0;
}

int dll_insert_before(DoublyLinkedList *list, Node *ref, int value)
{
    if (!list || !ref) return -1;

    if (ref == list->head)
        return dll_push_front(list, value);

    Node *n = node_new(value);
    if (!n) return -1;

    n->next       = ref;
    n->prev       = ref->prev;
    ref->prev->next = n;
    ref->prev       = n;
    list->size++;
    return 0;
}

/* ------------------------------------------------------------------ */
/*  Deletions                                                           */
/* ------------------------------------------------------------------ */

int dll_pop_front(DoublyLinkedList *list)
{
    if (!list || list->head == NULL) return -1;
    return dll_remove_node(list, list->head);
}

int dll_pop_back(DoublyLinkedList *list)
{
    if (!list || list->tail == NULL) return -1;
    return dll_remove_node(list, list->tail);
}

int dll_remove_at(DoublyLinkedList *list, size_t index)
{
    Node *n = dll_get(list, index);
    if (!n) return -1;
    return dll_remove_node(list, n);
}

int dll_remove_node(DoublyLinkedList *list, Node *node)
{
    if (!list || !node) return -1;

    if (node->prev)
        node->prev->next = node->next;
    else
        list->head = node->next;   /* node was head */

    if (node->next)
        node->next->prev = node->prev;
    else
        list->tail = node->prev;   /* node was tail */

    free(node);
    list->size--;
    return 0;
}

int dll_remove_value(DoublyLinkedList *list, int value)
{
    Node *n = dll_find(list, value);
    if (!n) return -1;
    return dll_remove_node(list, n);
}

/* ------------------------------------------------------------------ */
/*  Search / access                                                     */
/* ------------------------------------------------------------------ */

Node *dll_get(const DoublyLinkedList *list, size_t index)
{
    if (!list || index >= list->size) return NULL;

    Node *current;
    if (index <= list->size / 2) {
        /* Traverse from head */
        current = list->head;
        for (size_t i = 0; i < index; i++)
            current = current->next;
    } else {
        /* Traverse from tail */
        current = list->tail;
        for (size_t i = list->size - 1; i > index; i--)
            current = current->prev;
    }
    return current;
}

Node *dll_find(const DoublyLinkedList *list, int value)
{
    if (!list) return NULL;
    for (Node *n = list->head; n != NULL; n = n->next)
        if (n->data == value)
            return n;
    return NULL;
}

/* ------------------------------------------------------------------ */
/*  Utilities                                                           */
/* ------------------------------------------------------------------ */

int dll_is_empty(const DoublyLinkedList *list)
{
    return (!list || list->size == 0);
}

void dll_reverse(DoublyLinkedList *list)
{
    if (!list || list->size <= 1) return;

    Node *current = list->head;
    while (current) {
        /* Swap prev and next pointers */
        Node *tmp    = current->prev;
        current->prev = current->next;
        current->next = tmp;
        current       = current->prev;   /* advance (was next before swap) */
    }
    /* Swap head and tail */
    Node *tmp   = list->head;
    list->head  = list->tail;
    list->tail  = tmp;
}

void dll_print_forward(const DoublyLinkedList *list)
{
    if (!list) return;
    printf("head");
    for (Node *n = list->head; n != NULL; n = n->next)
        printf(" <-> %d", n->data);
    printf(" <-> tail  (size=%zu)\n", list->size);
}

void dll_print_backward(const DoublyLinkedList *list)
{
    if (!list) return;
    printf("tail");
    for (Node *n = list->tail; n != NULL; n = n->prev)
        printf(" <-> %d", n->data);
    printf(" <-> head  (size=%zu)\n", list->size);
}
