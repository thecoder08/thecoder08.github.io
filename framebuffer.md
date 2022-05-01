# The Linux Framebuffer
The Linux framebuffer is a beautiful thing. Why? Because of its simplicity. Linux (and other *nix operating systems) abstact hardware devices away by creating files in the `/dev` directory. These aren't real files, but when they are written to or read from, they communicate with some device attached to your system.

There are some files in this `/dev` directory that have a name that looks like `fbN`, where N is a number, starting from 0. These files are so-called "framebuffer devices"; provided by the framebuffer driver for your video card. For example, if you had an Intel chipset video card, the framebuffer device would be provided by the `intelfb` kernel module. Every video card manufacturer had its own framebuffer driver. There was also a driver called `vesafb` for VESA/VGA-compatible video cards.

Technically, the framebuffer API is obsolete with the advent of DRM (Direct Rendering Manager) which adds features like hardware acceleration on GPUs that support it.

This is a good thing, but the framebuffer API (in my opinion) is really great because no matter what kind of video card you have, no matter the make or model, you can always just write to `/dev/fbN` and some graphics show up on the screen.

The data that gets written to `/dev/fbN` is in a 32-bit non-interlaced RGBA format. That means that each pixel on the screen has 4 bytes to represent the red, green, blue, and alpha channels of the color of the pixel. Non-interlaced means that when a full line of pixels has been written, just start writing the next line. This is opposed to interlaced where when a full line of pixels has been written, skip a line and start writing the next; when the full screen has been filled go back and fill all of the lines you skipped.

This format is extremely simple, and all a program has to do to start drawing is open up `/dev/fbN` and write some bytes. In fact, I wrote a simple library in JavaScript using node.js that is able to draw simple shapes like rectangles and lines. This is the script (`node-framebuffer` on NPM):

```javascript
module.exports.Framebuffer = function(dev) {

var fs = require('fs');

this.framebuffer = fs.openSync(dev, 'w');

this.getPixel = function(x, y) {
  return ((y * 1920) + x) * 4;
}

this.setPixel = function(x, y, color) {
  colorToDraw = [...color];
  colorToDraw.push(0);
  fs.writeSync(this.framebuffer, new Uint8Array(colorToDraw), 0, 4, this.getPixel(x, y));
}

this.clear = function() {
  fs.writeSync(this.framebuffer, new Uint8Array(8294400), 0, 8294400, 0);
}

this.drawRectangle = function(x, y, width, height, color) {
  for (var i = y; i < (y + height); i++) {
    for (var j = x; j < (x + width); j++) {
      this.setPixel(j, i, color);
    }
  }
}

this.drawLine = function(x0, y0, x1, y1, color) {
   var dx = Math.abs(x1 - x0);
   var dy = Math.abs(y1 - y0);
   var sx = (x0 < x1) ? 1 : -1;
   var sy = (y0 < y1) ? 1 : -1;
   var err = dx - dy;

   while(true) {
      this.setPixel(x0, y0, color);

      if ((x0 === x1) && (y0 === y1)) break;
      var e2 = 2*err;
      if (e2 > -dy) { err -= dy; x0  += sx; }
      if (e2 < dx) { err += dx; y0  += sy; }
   }
}

}

module.exports.colors = {
  red: [0, 0, 255],
  blue: [255, 0, 0],
  green: [0, 255, 0],
  white: [255, 255, 255],
  black: [0, 0, 0],
  cyan: [255, 255, 0],
  magenta: [255, 0, 255],
  yellow: [0, 255, 255]
}
```
It defines a class called `Framebuffer` that has a function `setPixel` to draw a single pixel at a specific (x, y) position. You can also specify a 3-byte RGB color. Note that I made the assumption that the screen is 1920 pixels wide, as this was just for myself. This `setPixel` function is used to make rectangle and line drawing functions. There is also a set of color constants so that you don't have to specify the exact color yourself.

You can use the library as below:
```javascript
// import Framebuffer and colors from node-framebuffer
var { Framebuffer, colors } = require('node-framebuffer');

// create a new Framebuffer instance
var fb = new Framebuffer('/dev/fb0');

// draw a blue 50x50 rectangle to (100, 100) on the framebuffer
fb.drawRectangle(100, 100, 50, 50, colors.blue);
```
Alright, that's it. It's just something cool that I learned how to do and I thought that I'd share it! 'Till next time!

Click [here](/) to return to the home page.
<title>The Linux Framebuffer</title>
