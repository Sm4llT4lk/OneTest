#ifndef DOUBLY_LINKED_LIST_H
#define DOUBLY_LINKED_LIST_H

#include <stddef.h>

/* ------------------------------------------------------------------ */
/*  Structures                                                          */
/* ------------------------------------------------------------------ */

typedef struct Node {
    int           data;
    struct Node  *prev;
    struct Node  *next;
} Node;

typedef struct {
    Node  *head;
    Node  *tail;
    size_t size;
} DoublyLinkedList;

/* ------------------------------------------------------------------ */
/*  List lifecycle                                                      */
/* ------------------------------------------------------------------ */

/** Initialise an already-allocated list to an empty state. */
void dll_init(DoublyLinkedList *list);

/** Remove every node and reset the list to an empty state. */
void dll_clear(DoublyLinkedList *list);

/* ------------------------------------------------------------------ */
/*  Insertions                                                          */
/* ------------------------------------------------------------------ */

/** Prepend a new node with the given value at the front of the list.
 *  Returns 0 on success, -1 on allocation failure. */
int dll_push_front(DoublyLinkedList *list, int value);

/** Append a new node with the given value at the back of the list.
 *  Returns 0 on success, -1 on allocation failure. */
int dll_push_back(DoublyLinkedList *list, int value);

/** Insert a new node with the given value at position `index` (0-based).
 *  If index >= size the node is appended at the end.
 *  Returns 0 on success, -1 on allocation failure. */
int dll_insert_at(DoublyLinkedList *list, size_t index, int value);

/** Insert a new node AFTER the node pointed to by `ref`.
 *  Returns 0 on success, -1 on allocation failure. */
int dll_insert_after(DoublyLinkedList *list, Node *ref, int value);

/** Insert a new node BEFORE the node pointed to by `ref`.
 *  Returns 0 on success, -1 on allocation failure. */
int dll_insert_before(DoublyLinkedList *list, Node *ref, int value);

/* ------------------------------------------------------------------ */
/*  Deletions                                                           */
/* ------------------------------------------------------------------ */

/** Remove and free the first node.
 *  Returns 0 on success, -1 if the list is empty. */
int dll_pop_front(DoublyLinkedList *list);

/** Remove and free the last node.
 *  Returns 0 on success, -1 if the list is empty. */
int dll_pop_back(DoublyLinkedList *list);

/** Remove and free the node at position `index` (0-based).
 *  Returns 0 on success, -1 if index is out of range. */
int dll_remove_at(DoublyLinkedList *list, size_t index);

/** Remove and free a specific node.
 *  Returns 0 on success, -1 if `node` is NULL. */
int dll_remove_node(DoublyLinkedList *list, Node *node);

/** Remove the first node whose data equals `value`.
 *  Returns 0 on success, -1 if not found. */
int dll_remove_value(DoublyLinkedList *list, int value);

/* ------------------------------------------------------------------ */
/*  Search / access                                                     */
/* ------------------------------------------------------------------ */

/** Return a pointer to the node at position `index`, or NULL. */
Node *dll_get(const DoublyLinkedList *list, size_t index);

/** Return a pointer to the first node whose data equals `value`, or NULL. */
Node *dll_find(const DoublyLinkedList *list, int value);

/* ------------------------------------------------------------------ */
/*  Utilities                                                           */
/* ------------------------------------------------------------------ */

/** Return 1 if the list is empty, 0 otherwise. */
int dll_is_empty(const DoublyLinkedList *list);

/** Reverse the list in-place. */
void dll_reverse(DoublyLinkedList *list);

/** Print the list from head to tail:  head <-> v1 <-> v2 <-> ... <-> tail */
void dll_print_forward(const DoublyLinkedList *list);

/** Print the list from tail to head:  tail <-> vN <-> ... <-> v1 <-> head */
void dll_print_backward(const DoublyLinkedList *list);

#endif /* DOUBLY_LINKED_LIST_H */
