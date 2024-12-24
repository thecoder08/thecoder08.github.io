# Computers Work in Bytes, Not Bits
December 18, 2024

At first glance, this may seem like an arbitrary distinction. After all, a byte is just a group of 8 bits, just like how a kilobyte is 1000 bytes, and a megabyte is 1000 kilobytes, right?

Well, not really.
## Computer Architecture
A Computer has many components, but two of the most important ones are the CPU and RAM.

CPUs have registers, which are the smallest unit of memory available on a computer. They are used to store pieces of data between nearby/subsequent instructions. For example, an (x86) assembly language program to add two numbers from RAM together and store the result back in RAM might look like this:
```
mov eax, [a]
add eax, [b]
mov [c], eax
```
In this example, the `eax` register is used to hold the value of the first value, a, before it is added to b. It then holds the value of a + b before it is written back to memory, in c. In many CPU architectures, it's only possible to perform one memory access per instruction*, So you have to use registers to hold data between instructions.

This is the list of registers available in the x86 architecture:

- 8-bit registers: ah, al, bh, bl, ch, cl, dh, dl, sil, dil, spl, bpl, r8b-r16b
- 16-bit registers: ax, bx, cx, dx, si, di, sp, bp, ip, flags, r8w-r15w
- 32-bit registers: eax, ebx, ecx, edx, esi, edi, esp, ebp, eip, eflags, r8d-r15d
- 64-bit registers: rax, rbx, rcx, rdx, rsi, rdi, rsp, rbp, rip, rflags, r8-r15

(not including segment registers)

Notice how all of the registers widths are a power of two number of bits, with a size of at least 8 bits. This means that they can store 1, 2, 4, or 8 bytes.

So all memory accesses are done using data sizes that are a whole number multiple of bytes.

In addition, memory is addressed **By the Byte**. This means that when you increase the value of a memory address by one, it points to the next **byte** in memory. Not the next bit, not the next 16 bits. This is the case even though the bus, which connects the CPU and RAM together, is generally wider than 8 bits. But it is still a whole number of bytes wide.
## ASCII
ASCII, or the American Standard Code for Information Interchange, is an encoding standard that associates numbers with text characters (letters, digits and symbols.) For example, the capital letter A has a value of 65. ASCII is designed to assign a character to each number which can be stored in 7 bits (0-127).

Wait, 7 bits? Based on what we know, shouldn't it be 8?

Yes. The reason ASCII is a 7-bit encoding is because 1. 128 characters are enough to store all of the text characters used in American English, and 2. 1 bit was saved for use as a parity (error-checking) bit. Nowadays, computers generally use this bit to extend the ASCII encoding scheme with more characters, or in the case of UTF-8, they use it to signal the inclusion of a multi-byte character.

All of this means that, generally, when it comes to storing text on a computer, one character is one byte.
## Computer Networks
In computer networks, data is sent serially, which means we can only send 1 bit at a time.** This is part of the reason why internet speed is measured in MegaBITS per second, as opposed to MegaBYTES. But don't let this fool you. One of the most important responsibilities of the lowest layer network protocols is to group bits into bytes. This is because all higher level networking protocols are built on the assumption that the network will transmit bytes, not bits. this process is called frame alignment.
## Conclusion
There is much more I could have written about in this article, but I wanted to keep it shorter. My main reason for writing this is to disprove, or rather give more context, on the claim that computers work with bits. It is true that the bit is the fundamental unit of information. But a bit on its own is useless if you don't group it with others. 8 bits is a convenient size because it's small, but can still represent a fairly great amount of information (enough for a text character.) It's also a power of two, which makes it easy to work with.

These reasons explain why file size and storage capacity are measured in Bytes, Megabytes, and Gigabytes, rather than bits. There is a whole other misunderstanding about Mega- vs Mebi- and Giga- vs Gibi- bytes, but I'll have to talk about that another time. Thanks for reading.
### Footnotes
*x86 is not included in this category, it is possible to write the above example in 2 instructions, but it won't be as optimized.

**Modern networking protocols generally have the ability to encode multiple bits into a symbol. Examples include 256-QAM used in wireless communication, which encodes an entire byte into a symbol. Modern ethernet also uses multiple data lines, which means multiple bits can be sent simultaneously.