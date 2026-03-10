CC      = gcc
CFLAGS  = -std=c11 -Wall -Wextra -Wpedantic -g
TARGET  = dll_demo
SRCS    = main.c doubly_linked_list.c
OBJS    = $(SRCS:.c=.o)

.PHONY: all clean

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^

%.o: %.c
	$(CC) $(CFLAGS) -c -o $@ $<

main.o: main.c doubly_linked_list.h
doubly_linked_list.o: doubly_linked_list.c doubly_linked_list.h

clean:
	rm -f $(OBJS) $(TARGET)
