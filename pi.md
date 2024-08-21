# A formula for Pi
August 17th, 2024

In this article, I'm going to discuss how I derived a formula to approximate Pi using calculus. The formula is well-known, but I'm writing this article mostly just to show off my knowledge and prove to myself that I somewhat understand calculus, at least at a high-school level.

We'll start with by finding the equation for the unit circle on a cartesian plane. We know that the equation for a circle centred at the origin with a given radius $r$ is given by $x^2+y^2=r^2$. The unit circle has a radius of 1. So the equation for the unit circle is $x^2+y^2=1^2$, or $x^2+y^2=1$.

Next, we'll show that the area of the unit circle should be equal to pi. The formula for the area of a circle with radius $r$ is $A=\pi r^2$. For $r=1$: $A=\pi 1^2$, $A=1\pi$, $A=\pi$.

So if we can find an equation that gives the area of the unit circle without using $\pi$ in the formula, we will end up with an equation that can be used to approximate pi.

Fortunately, calculus gives us a tool to find the area under any curve (function). So if we convert the equation for a circle to a function, we can simply integrate and find pi. To do this, we'll rearrange for y.

```math
x^2+y^2=1
```

Subtract $x^2$ from both sides.

```math
y^2=1-x^2
```

Take the square root of both sides.

```math
y=\sqrt{1-x^2}
```

If we try plotting this function on a graphing calculator, we end up with a semicircle, not the circle we expected. This is because the circle cannot be expressed as a function. (A function can only have one output value for each input value, a circle has 2.) If we added a $\pm$ before the square root, we would end up with two functions, $\sqrt{1-x^2}$ and $-\sqrt{1-x^2}$. These represent the positive and negative semicircle, which together create the circle we want.

We can put this expression into a definite integral, integrating from -1 to 1.

```math
\int_{-1}^{1}\sqrt{1-x^2}\,dx=\frac{\pi}{2}
```

This gives the area under the semicircle, between the curve and the x-axis. It has an area of $\pi/2$. If we then subtract the integral over the area of the negative semicircle (subtracting because the area is below the x-axis, resulting in a negative value), we end with up the area of the circle, or $\pi$.

```math
\int_{-1}^{1}\sqrt{1-x^2}\,dx - \int_{-1}^{1}-\sqrt{1-x^2}\,dx=\pi
```

Of course, since the first formula is already giving $\pi/2$, we can just multiply by two to end up with $\pi$. This has the added benefit of not making the computer have to essentially evaluate the same integral twice.

```math
2\int_{-1}^{1}\sqrt{1-x^2}\,dx=\pi
```

There are formulas for pi that don't involve calculus, instead using infinite sums to get approximations of pi. But I like this formula because it has geometric meaning. You can clearly see how it was derived. With the knowledge that an integral can be thought of as taking the sum of the areas of infinitely many rectangles, each with an infinitesimally thin width of $dx$, you can visually imagine the integration process. You can also concieve how a computer might perform the approximation, by choosing a small, but not infinitely so, value for $dx$ (or $\Delta x$), the computer just has to add up a bunch of rectangles to find the value of $\pi$. Thank you for reading.
