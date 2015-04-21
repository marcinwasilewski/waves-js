# waves-js
Colorful waves effect in canvas

This is the animation I created for my portfolio at https://marcinwasilewski.net

Being very keen on music, I wanted to make something eye-candy that would resemble sound waves.

Here's a rough idea of how it works:
- There's an array with several waves (their maximum amplitude, phase, frequency etc).
- Each wave is assigned an X-coordinate where its ampltiude would have a maximum and range over which it's attenuated.
- An amplitude of a wave is calculated as a function of a distance from the mouse on the X-axis.
- Each wave with amplitude>0 is drawn on the left and right hand sides of the canvas.
- A superposition of all waves with amplitude>0 is drawn in the center of the canvas.
