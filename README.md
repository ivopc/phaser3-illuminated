# phaser3-illuminated
Phaser 3 plugin using Illuminated.js lib to real-time light effects on WebGL web games.

# Usage
Don't forget to include the Illuminated.js lib in your HTML document.

```html
<script type="text/javascript" src="Illuminated.js"></script>
```

In the game instance (preload) add a load plugin like this:
```javascript
    this.load.scenePlugin({
        key: "IlluminatedJS",
        url: "path/to/illuminated.p3.js",
        sceneKey: "illuminated"
    });
};
```
In create add this:
```javascript

    this.lamps = [];

    const lamp = this.illuminated.createLamp(
    150, 
    170, {
        distance: 200,
        diffuse: 0.8,
        color: "rgba(255, 255, 255, 0.9)", // 0.2
        radius: 0,
        samples: 1,
        angle: 0,
        roughness: 0
    });


    this.lamps.push(lamp);

    const mask = this.illuminated.createDarkMask(this.lamps, {
        width: 800,
        height: 600,
    }, "rgba(0, 0, 0, 0.2)");


    const recObject = this.illuminated.createRectangleObject(0, 0, 16, 24);

    for (let i = 0; i < this.lamps.length; i ++)
        this.lamps[i].createLighting([recObject]);
```

# Configuration

# scene.illuminated.createLamp(x, y, config)
The config object details, you can read about [here](http://greweb.me/2012/05/illuminated-js-2d-lights-and-shadows-rendering-engine-for-html5-applications/)

# scene.illuminated.createDarkMask(lampsArray, dimensions, color)
In color use only rgba color.

# scene.illuminated.createRectangleObject(x, y, width, height);

# scene.illuminated.createDiscObject(centerX, centerY, radius)

# lamp.createLighting(opaqueObjects)
In opaqueObjects just add a array of rectangle objects or disc objects or both.

For more detail check the examples/script.js on repository.
