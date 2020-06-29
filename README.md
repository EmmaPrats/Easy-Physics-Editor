# Easy-Physics-Editor

Graphical editor for making animations using the [Easy Physics library](https://github.com/EmmaPrats/Easy-Physics).

![alt text](https://github.com/Onpu93/Easy-Physics-Editor/blob/master/images/sample-editor.png)

## How to use

1. Edit the animation in the editor.
2. Download the animation file.
3. Place the file in your website directory.
4. Add `<canvas id="EasyPhysics"></canvas>` to your webpage.
5. Add `<script src="EasyPhysicsAnimation.js"></script>` to your webpage, right before the </body> tag.

## Available effects

### Springs

![alt text](https://github.com/Onpu93/Easy-Physics/blob/master/images/sample-springs.png)

Each letter will be propelled away from the mouse when it gets close to them, and they will spring back into place when the mouse leaves. You can choose the text, font, color, spring strength, and more!

### Floating

![alt text](https://github.com/Onpu93/Easy-Physics/blob/master/images/sample-floating.png)

Each letter is a solid object that floats in water. You can choose the letters, font, color, mass, liquid density, and more!

### Flocking

![alt text](https://github.com/Onpu93/Easy-Physics/blob/master/images/sample-flocking.png)

It's a simple implementation of Reynolds' 1987 paper ["Flocks, Herds, and Shcools: A Distributed Behavioral Model"](https://www.red3d.com/cwr/boids/). It creates a flock of objects that move around. Those objects can be images, and you can tweak their behaviour.

### Steering

![alt text](https://github.com/Onpu93/Easy-Physics/blob/master/images/sample-steering.png)

Another implementation of a Reynold's paper: ["Steering Behaviours for Autonomous Characters"](https://www.red3d.com/cwr/steer/). There are 2 agents and a prize. Agent A tries to reach the prize while avoiding Agent B, whose goal is to reach Agent A. You can tweak their behaviour and decide which elements you want in the scene.
