# Projects

Most of my projects are written in either JavaScript or C, where my earlier ones are more likely JavaScript. In some cases, the language I chose to write a given project in may not be the most appropriate choice. This is due to the "If your only tool is a hammer, every problem looks like a nail" effect.

Install [node.js](https://nodejs.org) to run most of my JS projects. These were written a while ago, so they probably need an old version of node.

As for C projects, good luck getting them to compile. Most don't have makefiles, documentation, or even a shell script. If you're desperate, try posting an Issue. I might get back to you in the next century.

## [libxgfx](https://github.com/thecoder08/xgfx) (C)
This is a cross-platform graphics library that I wrote. It comes in two components: A windowing library and a graphics/drawing library. The windowing library supports Win32, Wayland, Xcb and Xlib backends. It works kind of like SDL, giving you basic windowing and software drawing primitives.

## [3d-engine](https://github.com/thecoder08/3d-engine) (C)
A software rasterizer/3D engine written in C using libxgfx. You can display any .obj mesh. Supports .mtl's with various materials/colors. Doesn't perform perspective transformation (orthographic). You can rotate the mesh with arrow keys.

## [emulator](https://github.com/thecoder08/emulator) (C)
A processor/system emulator and assembler for my custom 8/16-bit CPU architecture. I built the 8-bit version in Minecraft Redstone and am trying to do it in logisim. (Real hardware coming eventually!)

## [my-os](https://github.com/thecoder08/my-os) (C)
An "Operating system" with basic drivers for keyboard, VGA, disk, ... It doesn't have functional scheduling, user space, memory allocation/virtual memory, ...

## [curling](httpz://github.com/thecoder08/curling.git) (C#)
A curling simulation video game with a custom 3D engine made with OpenGL (via the OpenTK library) and a custom physics engine (which is a bit finicky). See if you can figure out the controls. Inspired by BillardGL.

## Honorable mentions
- [Throbots](https://github.com/2squaredstudios/throbots) (JS) - A multiplayer 2D platformer I made with a friend. (uses NW.js)
- [raytracer](https://github.com/thecoder08/raytracer) (C) - A very slow path-tracing raytracer that can render spheres and triangles. Inspired by [this video](TODO: find this link).
- [coyote](https://github.com/thecoder08/coyote) (JS) - A compiled programming language that compiles to NASM assembly code. Expect segfaults and don't expect to do anything fancy with it.
- [lenux](https://github.com/thecoder08/lenux) (JS) - A linux distribution where I rewrote all of the userspace programs in node.js. Great example of the tool/hammer/problem/nail situation.
