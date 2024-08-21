April 6, 2024
# Hello World
A deep dive into the world of abstraction behind a modern Hello World program.

## Before we start
This article is written about a Hello World program written in C. This is about as high as you can go as a high-level language without having to worry about what your specific language is doing in the interpreter/compiler/JIT before your Hello World proper actually runs.

I originally started writing this with the intent of making it understandable to anyone with some coding background, but I now think it would be helpful to have at least some knowledge of C or assembly.
## The start
Everyone should be familiar with a Hello World program. In python, the very first program you wrote may have been:
```python
print('Hello World!')
```
It simply prints the text "Hello World!" onto the screen.

In this article, we're going to look at a Hello World in the C programming language. If you're unfamiliar, it's:
```c
#include <stdio.h>

int main() {
    printf("Hello World!\n");
    return 0;
}
```
This program does the exact same thing as the python one. Unlike python, however, you can't just call an interpreter to run this program. You have to run the compiler first to convert this code into machine code that the computer's processor can run directly. All modern big and important programs that make a computer work are written this way.

So to do this, we run the following command:
```bash
gcc hello.c -o hello
```
This take our C code from the file `hello.c` and generates a machine code program in the file called `hello`. We can then run it by running the following command:
```bash
./hello
```
which gives:
```
Hello World!
```
Neat.

## Our program
OK, so how did it do that? Well, the first place to look is our program. What exactly is it?
```bash
$ file hello
hello: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=b74da2c9c77d221eeaa98f87f4a7a529782db280, for GNU/Linux 3.2.0, not stripped
```
This is mostly stuff we won't worry about, or don't need to worry about until later. The important part is just the
> ELF executable, x86-64

This tells us that the program is an ELF executable file for the x86_64 instruction set architecture. What does that mean?

An ELF executable is the Linux equivalent to a windows `.exe` file. It's just a program that your computer can run. But we already knew that. The other part tells us that it's a machine code program meant to run on a 64-bit x86 processor, which is the CPU architecture that has been used in PCs since the introduction of the IBM PC in 1981. That wasn't 64-bit, mind you, but our modern processors can still run code written for the IBM PC (kind of). I digress.

So this file contains machine code, a sort of language, and the only language that the CPU can understand. So where does the CPU start running it's code?
```bash
$ readelf -h hello
ELF Header:
  Magic:   7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00 
  Class:                             ELF64
  Data:                              2's complement, little endian
  Version:                           1 (current)
  OS/ABI:                            UNIX - System V
  ABI Version:                       0
  Type:                              DYN (Position-Independent Executable file)
  Machine:                           Advanced Micro Devices X86-64
  Version:                           0x1
  Entry point address:               0x1060
  Start of program headers:          64 (bytes into file)
  Start of section headers:          13976 (bytes into file)
  Flags:                             0x0
  Size of this header:               64 (bytes)
  Size of program headers:           56 (bytes)
  Number of program headers:         13
  Size of section headers:           64 (bytes)
  Number of section headers:         31
  Section header string table index: 30
```
The important part here is `Entry point address:`, which is set to `0x1060`. This is a hexadecimal number which represents a location in our program, or, once it gets loaded, in our computer's memory. So what exactly is there?

## The code
```bash
$ objdump -D hello
```
I'm not going to put the entire output of this command in here, because it would be too long. But if we scroll through it, we eventually find some lines of text, where the first line starts with `1060:`
```
Disassembly of section .text:

0000000000001060 <_start>:
    1060:	f3 0f 1e fa          	endbr64 
    1064:	31 ed                	xor    %ebp,%ebp
    1066:	49 89 d1             	mov    %rdx,%r9
    1069:	5e                   	pop    %rsi
    106a:	48 89 e2             	mov    %rsp,%rdx
    106d:	48 83 e4 f0          	and    $0xfffffffffffffff0,%rsp
    1071:	50                   	push   %rax
    1072:	54                   	push   %rsp
    1073:	45 31 c0             	xor    %r8d,%r8d
    1076:	31 c9                	xor    %ecx,%ecx
    1078:	48 8d 3d ca 00 00 00 	lea    0xca(%rip),%rdi        # 1149 <main>
    107f:	ff 15 53 2f 00 00    	call   *0x2f53(%rip)        # 3fd8 <__libc_start_main@GLIBC_2.34>
    1085:	f4                   	hlt    
    1086:	66 2e 0f 1f 84 00 00 	cs nopw 0x0(%rax,%rax,1)
    108d:	00 00 00
```
What does this mean? The first numbers before the colons are the addresses of the following bytes, essentially their position in the file. The next numbers are bytes of data in our program file, which in this case represent machine code. The following text is the dissassembly of that code. Assembly language is a human-readable representation of machine code. Note that even if the bytes on the left don't represent code, the disassembler will still try to dissassemble them. This leads to garbage and nonsensical assembly code.

So we've found some code! But not code that we wrote. It was added to our program automatically by the compiler (technically the linker). Basically, this code does some initialization, and then runs an important instruction:
```
call *0x2f53(%rip)        # 3fd8 <__libc_start_main@GLIBC_2.34>
```
This instruction tells the computer to go execute some code somewhere else, in this case at address `0x2f53`, which is changed to address `0x3fd8` when our program is loaded by the dynamic linker. I won't get into that.

But no matter how hard you look, you won't be able to find either of these addresses in our file. The `0x3fd8` is technically there in the global offset table, again, beyond the scope of this article, but it's empty right now. That's because this code isn't defined in our program, it's somewhere else.
## The C library
So where is it?
```bash
$ readelf -d hello

Dynamic section at offset 0x2dc8 contains 27 entries:
  Tag        Type                         Name/Value
 0x0000000000000001 (NEEDED)             Shared library: [libc.so.6]
 0x000000000000000c (INIT)               0x1000
 0x000000000000000d (FINI)               0x1168
 0x0000000000000019 (INIT_ARRAY)         0x3db8
 0x000000000000001b (INIT_ARRAYSZ)       8 (bytes)
 0x000000000000001a (FINI_ARRAY)         0x3dc0
 0x000000000000001c (FINI_ARRAYSZ)       8 (bytes)
 0x000000006ffffef5 (GNU_HASH)           0x3b0
 0x0000000000000005 (STRTAB)             0x480
 0x0000000000000006 (SYMTAB)             0x3d8
 0x000000000000000a (STRSZ)              141 (bytes)
 0x000000000000000b (SYMENT)             24 (bytes)
 0x0000000000000015 (DEBUG)              0x0
 0x0000000000000003 (PLTGOT)             0x3fb8
 0x0000000000000002 (PLTRELSZ)           24 (bytes)
 0x0000000000000014 (PLTREL)             RELA
 0x0000000000000017 (JMPREL)             0x610
 0x0000000000000007 (RELA)               0x550
 0x0000000000000008 (RELASZ)             192 (bytes)
 0x0000000000000009 (RELAENT)            24 (bytes)
 0x000000000000001e (FLAGS)              BIND_NOW
 0x000000006ffffffb (FLAGS_1)            Flags: NOW PIE
 0x000000006ffffffe (VERNEED)            0x520
 0x000000006fffffff (VERNEEDNUM)         1
 0x000000006ffffff0 (VERSYM)             0x50e
 0x000000006ffffff9 (RELACOUNT)          3
 0x0000000000000000 (NULL)               0x0
```
This is a list of, among other things, the libraries that our code depends on. In this case, we see the line
```
0x0000000000000001 (NEEDED)             Shared library: [libc.so.6]
```
The is our system's standard C library, a collection of routines and functions used by nearly all of the programs on our computer. In Windows-land, this is equivalent to the C runtime, either `msvcrt.dll` or `ucrt<something>.dll`. One thing to note is that files in Linux with the extension `.so`, called Shared Objects, are equivalent to files in Windows with the extension `.dll`, called Dynamically Linked Libraries. They both contain code that can be shared between multiple programs.

So we could repeat the process of using `objdump` to find where this code is in our C library, and what it does, but the C library is huge and complex, and we haven't even got to the code we wrote yet. So I'll save you the trouble: it does some initialisation, like getting our program's command-line parameters and environment variables, and calls our `main()` function. Then when we return from `main()`, it exits our program with the status code we provide.

So where is our main function?
## main()
It's in our program, of course. Returning to our disassembly, we see:
```
0000000000001149 <main>:
    1149:	f3 0f 1e fa          	endbr64 
    114d:	55                   	push   %rbp
    114e:	48 89 e5             	mov    %rsp,%rbp
    1151:	48 8d 05 ac 0e 00 00 	lea    0xeac(%rip),%rax        # 2004 <_IO_stdin_used+0x4>
    1158:	48 89 c7             	mov    %rax,%rdi
    115b:	e8 f0 fe ff ff       	call   1050 <puts@plt>
    1160:	b8 00 00 00 00       	mov    $0x0,%eax
    1165:	5d                   	pop    %rbp
    1166:	c3                   	ret    
```
Finally, our code! So what does it do? It:
1. Sets up a stack frame
2. Sets up the arguments to our function call
3. Calls our Hello World
4. Cleans up the stack frame
5. Returns from the function with exit code 0

This is what we see in our source code. But what is a stack frame? It's a part of the computer's memory that our program uses to store local variables, i.e. variables declared inside our main function. Luckily, we don't declare any variables, so we don't really have to worry about that. The important parts here are:
```
lea    0xeac(%rip),%rax

call   1050 <puts@plt>
```
These instructions:
1. Set the memory address of our Hello World string as the first argument to our function call (indirectly)
2. Call the `puts()` function

Wait, `puts()`? Didn't we call `printf()`?

Yes. However, the compiler performed an optimisation. The printf function is complex, because it's able to print "formatted output", which means that we can embed variables in our output. The function will handle converting them to strings and printing them for us, but we aren't using any of that. So that compiler replaces `printf()` with the much simpler `puts()`, which just prints a string of unformatted text. So where is our text?

## The string
According to the disassembler, it's in address `0x0eac`, which gets converted to address `0x2004` upon loading. So what does that look like?

```
Disassembly of section .rodata:

0000000000002000 <_IO_stdin_used>:
    2000:	01 00                	add    %eax,(%rax)
    2002:	02 00                	add    (%rax),%al
    2004:	48                   	rex.W
    2005:	65 6c                	gs insb (%dx),%es:(%rdi)
    2007:	6c                   	insb   (%dx),%es:(%rdi)
    2008:	6f                   	outsl  %ds:(%rsi),(%dx)
    2009:	20 57 6f             	and    %dl,0x6f(%rdi)
    200c:	72 6c                	jb     207a <__GNU_EH_FRAME_HDR+0x66>
    200e:	64 21 00             	and    %eax,%fs:(%rax)
```
Remember earlier how I said that the disassembler tries to disassemble code even if it isn't code? This is a good example. Ignore the assembly language, it's complete gibberish. But if we look at address `0x2004`, we see the hex bytes `48 65 6c 6c 6f 20 57 6f 72 6c 64 21 00`, which translates to the string "Hello World!", followed by a NULL terminator.

But didn't our string also include a newline, `\n`, which should be translated to ASCII `0x0a`? Yes, but this is another artifact of the compiler's optimisation. The `puts()` function prints out the string with a trailing newline, while `printf()` doesn't. So it removes our newline so we only end up with one in the output.

Then we see a `0x00` NULL byte. This is called a NULL terminator, and it appears at the end of all C strings. in C, our string isn't associated with any length information. So a function that takes a string of any length as an argument will act on it one byte a time, until it sees a NULL terminator. If we had multiple string in memory and no NULL terminators between them, then C functions would operate on all of the strings together. Eventually the functions would get to the end and start reading memory that they aren't allowed to read, and your program would crash with the dreaded "Segmentation Fault".

## following the puts()
So puts() is located at `0x1050`.
```
Disassembly of section .plt.sec:

0000000000001050 <puts@plt>:
    1050:	f3 0f 1e fa          	endbr64 
    1054:	f2 ff 25 75 2f 00 00 	bnd jmp *0x2f75(%rip)        # 3fd0 <puts@GLIBC_2.2.5>
    105b:	0f 1f 44 00 00       	nopl   0x0(%rax,%rax,1)
```

Okay, so it's now calling back into the standard library. (technically the global offset table, but eventually the standard library)

Again, we don't want to read the disassembly of the standard library, but luckily Glibc (our C standard library) is open source. So where does that take us?

Well, puts() is aliased to the function _IO_puts in the standard library.
```c
int
_IO_puts (const char *str)
{
  int result = EOF;
  size_t len = strlen (str);
  _IO_acquire_lock (stdout);

  if ((_IO_vtable_offset (stdout) != 0
       || _IO_fwide (stdout, -1) == -1)
      && _IO_sputn (stdout, str, len) == len
      && _IO_putc_unlocked ('\n', stdout) != EOF)
    result = MIN (INT_MAX, len + 1);

  _IO_release_lock (stdout);
  return result;
}
```
So it gets the length of our string, obtains a lock on the output stream, does some checks, and calls _IO_sputn. It then releases the lock and returns the number of printed characters.

I searched for this function, but couldn't find it. Apparently it does something through a function called _IO_file_jumps, and calls _IO_new_file_xsputn.
```c
size_t
_IO_new_file_xsputn (FILE *f, const void *data, size_t n)
{
  const char *s = (const char *) data;
  size_t to_do = n;
  int must_flush = 0;
  size_t count = 0;

  if (n <= 0)
    return 0;
  /* This is an optimized implementation.
     If the amount to be written straddles a block boundary
     (or the filebuf is unbuffered), use sys_write directly. */

  /* First figure out how much space is available in the buffer. */
  if ((f->_flags & _IO_LINE_BUF) && (f->_flags & _IO_CURRENTLY_PUTTING))
    {
      count = f->_IO_buf_end - f->_IO_write_ptr;
      if (count >= n)
	{
	  const char *p;
	  for (p = s + n; p > s; )
	    {
	      if (*--p == '\n')
		{
		  count = p - s + 1;
		  must_flush = 1;
		  break;
		}
	    }
	}
    }
  else if (f->_IO_write_end > f->_IO_write_ptr)
    count = f->_IO_write_end - f->_IO_write_ptr; /* Space available. */

  /* Then fill the buffer. */
  if (count > 0)
    {
      if (count > to_do)
	count = to_do;
      f->_IO_write_ptr = __mempcpy (f->_IO_write_ptr, s, count);
      s += count;
      to_do -= count;
    }
  if (to_do + must_flush > 0)
    {
      size_t block_size, do_write;
      /* Next flush the (full) buffer. */
      if (_IO_OVERFLOW (f, EOF) == EOF)
	/* If nothing else has to be written we must not signal the
	   caller that everything has been written.  */
	return to_do == 0 ? EOF : n - to_do;

      /* Try to maintain alignment: write a whole number of blocks.  */
      block_size = f->_IO_buf_end - f->_IO_buf_base;
      do_write = to_do - (block_size >= 128 ? to_do % block_size : 0);

      if (do_write)
	{
	  count = new_do_write (f, s, do_write);
	  to_do -= count;
	  if (count < do_write)
	    return n - to_do;
	}

      /* Now write out the remainder.  Normally, this will fit in the
	 buffer, but it's somewhat messier for line-buffered files,
	 so we let _IO_default_xsputn handle the general case. */
      if (to_do)
	to_do -= _IO_default_xsputn (f, s+do_write, to_do);
    }
  return n - to_do;
}
```
Wow. All of this for a Hello World. I am not going to try and understand how this code works, even with comments. So at this point I realised that using Glibc to explain this is going to be a pain. So here, I decided to look at musl libc, which I know is supposed to be smaller.
## musl
So in musl, puts() is defined as follows:
```c
int puts(const char *s)
{
	int r;
	FLOCK(stdout);
	r = -(fputs(s, stdout) < 0 || putc_unlocked('\n', stdout) < 0);
	FUNLOCK(stdout);
	return r;
}
```
Okay, so it obtains a lock on the output stream, calls fputs, and unlocks the output stream.

How is fputs() defined?
```c
#include "stdio_impl.h"
#include <string.h>

int fputs(const char *restrict s, FILE *restrict f)
{
	size_t l = strlen(s);
	return (fwrite(s, 1, l, f)==l) - 1;
}
```
It gets the length of our string, and calls fwrite() with the output stream, our string, and its length.

How is fwrite() defined?
```c
size_t fwrite(const void *restrict src, size_t size, size_t nmemb, FILE *restrict f)
{
	size_t k, l = size*nmemb;
	if (!size) nmemb = 0;
	FLOCK(f);
	k = __fwritex(src, l, f);
	FUNLOCK(f);
	return k==l ? nmemb : k/size;
}
```
It gets another lock on the output stream, calls __fwritex(), and unlocks the output stream.

How is __fwritex() defined?
```c
size_t __fwritex(const unsigned char *restrict s, size_t l, FILE *restrict f)
{
	size_t i=0;

	if (!f->wend && __towrite(f)) return 0;

	if (l > f->wend - f->wpos) return f->write(f, s, l);

	if (f->lbf >= 0) {
		/* Match /^(.*\n|)/ */
		for (i=l; i && s[i-1] != '\n'; i--);
		if (i) {
			size_t n = f->write(f, s, i);
			if (n < i) return n;
			s += i;
			l -= i;
		}
	}

	memcpy(f->wpos, s, l);
	f->wpos += l;
	return l+i;
}
```
This is a fair bit of code, but the main thing it's doing it calling write() on the output stream's FILE object. Our stream is defined as stdout, so where is that defined?
```c
hidden FILE __stdout_FILE = {
	.buf = buf+UNGET,
	.buf_size = sizeof buf-UNGET,
	.fd = 1,
	.flags = F_PERM | F_NORD,
	.lbf = '\n',
	.write = __stdout_write,
	.seek = __stdio_seek,
	.close = __stdio_close,
	.lock = -1,
};
```
So the write function is defined as __stdout_write(). How is that defined?
```c
size_t __stdout_write(FILE *f, const unsigned char *buf, size_t len)
{
	struct winsize wsz;
	f->write = __stdio_write;
	if (!(f->flags & F_SVB) && __syscall(SYS_ioctl, f->fd, TIOCGWINSZ, &wsz))
		f->lbf = -1;
	return __stdio_write(f, buf, len);
}
```
It makes a TIOCGWINSZ ioctl on the output stream, and calls __stdio_write(). How is that defined?
```c
size_t __stdio_write(FILE *f, const unsigned char *buf, size_t len)
{
	struct iovec iovs[2] = {
		{ .iov_base = f->wbase, .iov_len = f->wpos-f->wbase },
		{ .iov_base = (void *)buf, .iov_len = len }
	};
	struct iovec *iov = iovs;
	size_t rem = iov[0].iov_len + iov[1].iov_len;
	int iovcnt = 2;
	ssize_t cnt;
	for (;;) {
		cnt = syscall(SYS_writev, f->fd, iov, iovcnt);
		if (cnt == rem) {
			f->wend = f->buf + f->buf_size;
			f->wpos = f->wbase = f->buf;
			return len;
		}
		if (cnt < 0) {
			f->wpos = f->wbase = f->wend = 0;
			f->flags |= F_ERR;
			return iovcnt == 2 ? 0 : len-iov[0].iov_len;
		}
		rem -= cnt;
		if (cnt > iov[0].iov_len) {
			cnt -= iov[0].iov_len;
			iov++; iovcnt--;
		}
		iov[0].iov_base = (char *)iov[0].iov_base + cnt;
		iov[0].iov_len -= cnt;
	}
}
```
We're on the home stretch now. This is doing a lot, but it's calling syscall() with SYS_writev as its first parameter. So how is syscall() defined?
```c
long syscall(long n, ...)
{
	va_list ap;
	syscall_arg_t a,b,c,d,e,f;
	va_start(ap, n);
	a=va_arg(ap, syscall_arg_t);
	b=va_arg(ap, syscall_arg_t);
	c=va_arg(ap, syscall_arg_t);
	d=va_arg(ap, syscall_arg_t);
	e=va_arg(ap, syscall_arg_t);
	f=va_arg(ap, syscall_arg_t);
	va_end(ap);
	return __syscall_ret(__syscall(n,a,b,c,d,e,f));
}
```
syscall() takes a system call number as its first argument, and a variable number of additional arguments. The va_arg() calls are reading those arguments into the variables a, b, c, d, e, and f.
we then call __syscall() with those arguments, and the result goes into __syscall_ret().

Unfortunately, I couldn't find the definition for __syscall(), But I feel that this is because we're getting into platform-specific territory. Musl is a multi-architecture C library, so from this point the code that runs depends on what architecture we're using. Before I dove into that, I looked at __syscall_ret():
```c
long __syscall_ret(unsigned long r)
{
	if (r > -4096UL) {
		errno = -r;
		return -1;
	}
	return r;
}
```
It just checks to see if the return value from __syscall() is valid, and if not, the system call failed, so it returns -1.
## System Calls
So, the last few stages of our Hello World call have been involving systems calls. What is a system call? Well, no matter how big our C library is, there are some things it will never be able to do for us. One of those things is talking to the hardware. The ability to do that is reserved for the kernel, the part of the operating system that controls and shares access to IO devices, memory, and CPU time. In our case, this is the Linux kernel. In Windows world, this is `ntoskrnl.exe`, which shows up as System in Task Manager.

This means that our puts() call has to end with us telling the OS to do something for us. In this case, we're asking the OS to write some text to the output stream. Writing to a stream is done with the `write` system call. Musl is using a similar system call called `writev`, which can write multiple buffers in an array. So lets look at how musl makes system calls.
```c
static __inline long __syscall0(long n)
{
	unsigned long ret;
	__asm__ __volatile__ ("syscall" : "=a"(ret) : "a"(n) : "rcx", "r11", "memory");
	return ret;
}

static __inline long __syscall1(long n, long a1)
{
	unsigned long ret;
	__asm__ __volatile__ ("syscall" : "=a"(ret) : "a"(n), "D"(a1) : "rcx", "r11", "memory");
	return ret;
}

static __inline long __syscall2(long n, long a1, long a2)
{
	unsigned long ret;
	__asm__ __volatile__ ("syscall" : "=a"(ret) : "a"(n), "D"(a1), "S"(a2)
						  : "rcx", "r11", "memory");
	return ret;
}

static __inline long __syscall3(long n, long a1, long a2, long a3)
{
	unsigned long ret;
	__asm__ __volatile__ ("syscall" : "=a"(ret) : "a"(n), "D"(a1), "S"(a2),
						  "d"(a3) : "rcx", "r11", "memory");
	return ret;
}

static __inline long __syscall4(long n, long a1, long a2, long a3, long a4)
{
	unsigned long ret;
	register long r10 __asm__("r10") = a4;
	__asm__ __volatile__ ("syscall" : "=a"(ret) : "a"(n), "D"(a1), "S"(a2),
						  "d"(a3), "r"(r10): "rcx", "r11", "memory");
	return ret;
}

static __inline long __syscall5(long n, long a1, long a2, long a3, long a4, long a5)
{
	unsigned long ret;
	register long r10 __asm__("r10") = a4;
	register long r8 __asm__("r8") = a5;
	__asm__ __volatile__ ("syscall" : "=a"(ret) : "a"(n), "D"(a1), "S"(a2),
						  "d"(a3), "r"(r10), "r"(r8) : "rcx", "r11", "memory");
	return ret;
}

static __inline long __syscall6(long n, long a1, long a2, long a3, long a4, long a5, long a6)
{
	unsigned long ret;
	register long r10 __asm__("r10") = a4;
	register long r8 __asm__("r8") = a5;
	register long r9 __asm__("r9") = a6;
	__asm__ __volatile__ ("syscall" : "=a"(ret) : "a"(n), "D"(a1), "S"(a2),
						  "d"(a3), "r"(r10), "r"(r8), "r"(r9) : "rcx", "r11", "memory");
	return ret;
}
```
We have reached the bottom. These are 7 different functions that musl uses for making system calls on the x86_64 platform. Each of them takes a different number of arguments for the system call.

Each function has an \_\_asm__ directive. This embeds inline assembly code into the machine language output of the compiler. We make system calls to the operating system by setting some CPU registers with our parameters, and executing the `syscall` instruction. Control then gets passed to the kernel, which reads our parameters and executes our system call.

## The kernel
The Linux kernel now has to perform the action requested by the system call. The `write` system call tells the kernel to write to an opened file on the filesystem, or write to a stream, which is what we are doing in this case.

The `write` system call takes 3 parameters: the file descriptor to write to, the buffer to write, and the number of bytes to write. The `writev` system call used by musl is different, but lets focus on `write` for now.

So where exactly are we writing to?
```bash
$ ps
    PID TTY          TIME CMD
  15705 pts/0    00:00:00 bash
  23332 pts/0    00:00:00 ps
$ cd /proc/15705/fd
$ readlink 1
/dev/pts/0
```
That depends.

In my case, I'm running the `hello` program in the GNOME terminal emulator, a graphical application. It appears to the kernel as a pseudo-terminal (pty). So the kernel saves our Hello World message in a buffer, and when the terminal emulator program runs, it reads it and displays it. Voila.

Of course, we aren't done. The terminal emulator then has to render the text into a frame (potentially using the GPU to do it), send this frame to X server/compositor, which combines it with the other apps I have running (also using the GPU), like the text editor I'm using to write this, and sends it back to the kernel, which then displays it.

Sheesh. I glossed over a lot there, because it doesn't matter and it may be completely different for you. Maybe you're logged in remotely, in which case, the kernel sends your text to `sshd`, which then sends it (encrypted) back to the kernel in a packet to be sent over the internet. Maybe you're using a physical terminal, connected to a serial-to-USB adapter. The kernel then has to put your text in a USB packet and send it down the line. Maybe you're using the framebuffer console, which is the default way to interact with the OS if you don't have a GUI installed. In that case, the kernel has to render to text into a frame and output that to the display.

The point is that it could be anything that happens next, and it really doesn't matter what it is. Because your Hello World message being sent is only one system call, from one program, out of millions of system calls and thousands of programs running on your computer right now.

## Conclusion
So, modern software systems on today's hardware are so complex and intricate that it really makes no sense to try and fully understand one little thing that your computer did. It's clear that I glossed over a lot in order to explain everything that I did. I didn't go over all the edge cases, additional information, and other things that the computer does. I didn't explain how the kernel works. This is all stuff for other people to explain, or for you to learn about on your own time.

If you actually read this all the way through, congratulations. I'm sorry the ending maybe wasn't as satisfying as you hoped. I'm happy someone found this interesting. I'm not quite sure why I wrote this, but it's now after midnight so I should get some sleep.

Thank you for reading.

> Hey, So how does a Hello World program actually work?

> Don't ask.
