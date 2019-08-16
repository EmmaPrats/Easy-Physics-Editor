/**
 * Creates a flocking animation.
 * @class
 * @param {Object} canvas a canvas element
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @classdesc Creates and runs an animation based on Reynolds' flocking model. How to use: create an instance of this class and call its method draw() on each frame.
 */
function FlockingAnimation (canvas, EDITMODE = false)
{
    //EasyPhysicsAnimation.call (canvas);
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    
    //Simulation objects
    this.flock;
    
    //Editor params
    this.EDITMODE; //EasyPhysicsAnimation
    this.GRID; //EasyPhysicsAnimation
    
    //Scene params
    this.scenewidth; //EasyPhysicsAnimation
    
    //Simulation params
    this.dt = 1.0; //EasyPhysicsAnimation
    this.size; //EasyPhysicsAnimation
    this.quantity;
    this.separationweight;
    this.alignmentweight;
    this.cohesionweight;
    
    //Aesthetic params
    this.visualrepresentation;
    this.ORIENTEDTOWARDSMOVEMENT;
    this.color;
    
    this.initParams (EDITMODE);
    this.initSimulation();
}

/**
 * Initializes all parameters with given settings or default values.
 * If global object eptfgSettingsFlocking exists, initializes with its parameters:
 * eptfgSettingsFlocking.EDITMODE
 * eptfgSettingsFlocking.GRID
 * eptfgSettingsFlocking.scenewidth
 * eptfgSettingsFlocking.size
 * eptfgSettingsFlocking.quantity
 * eptfgSettingsFlocking.separationweight
 * eptfgSettingsFlocking.alignmentweight
 * eptfgSettingsFlocking.cohesionweight
 * eptfgSettingsFlocking.visualrepresentation
 * eptfgSettingsFlocking.shape
 * eptfgSettingsFlocking.ORIENTED
 * eptfgSettingsFlocking.color
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @param {Object} settings object that contains settings
 */
FlockingAnimation.prototype.initParams = function (EDITMODE = false, settings)
{
    this.EDITMODE = EDITMODE;
    this.GRID = EDITMODE;
    
    this.scenewidth = 400;
    
    this.size = 5;
    this.quantity = 200;
    this.separationweight = 1.5;
    this.alignmentweight = 1.0;
    this.cohesionweight = 1.0;
    
    this.visualrepresentation = "triangle";
    this.ORIENTEDTOWARDSMOVEMENT = true;
    this.color = "#000000";
    
    if (typeof eptfgSettingsFlocking !== "undefined")
    {
        if (typeof eptfgSettingsFlocking.EDITMODE !== "undefined")
        {
            if (eptfgSettingsFlocking.EDITMODE == "true")
            {
                this.EDITMODE = true;
            }
            else if (eptfgSettingsFlocking.EDITMODE == "false")
            {
                this.EDITMODE = false;
            }
        }
        if (typeof eptfgSettingsFlocking.GRID !== "undefined")
        {
            if (eptfgSettingsFlocking.GRID == "true")
            {
                this.GRID = true;
            }
            else if (eptfgSettingsFlocking.GRID == "false")
            {
                this.GRID = false;
            }
        }
        
        this.scenewidth = (typeof eptfgSettingsFlocking.scenewidth !== "undefined") ? (1.0 * eptfgSettingsFlocking.scenewidth) : this.scenewidth;
        
        this.size = (typeof eptfgSettingsFlocking.size !== "undefined") ? (1.0 * eptfgSettingsFlocking.size) : this.size;
        this.quantity = (typeof eptfgSettingsFlocking.quantity !== "undefined") ? (1 * eptfgSettingsFlocking.quantity) : this.quantity;
        this.separationweight = (typeof eptfgSettingsFlocking.separationweight !== "undefined") ? (1.0 * eptfgSettingsFlocking.separationweight) : this.separationweight;
        this.alignmentweight = (typeof eptfgSettingsFlocking.alignmentweight !== "undefined") ? (1.0 * eptfgSettingsFlocking.alignmentweight) : this.alignmentweight;
        this.cohesionweight = (typeof eptfgSettingsFlocking.cohesionweight !== "undefined") ? (1.0 * eptfgSettingsFlocking.cohesionweight) : this.cohesionweight;
        
        var visualrepresentation = (typeof eptfgSettingsFlocking.visualrepresentation !== "undefined") ? eptfgSettingsFlocking.visualrepresentation : this.visualrepresentation;
        if (visualrepresentation == "image")
        {
            //TODO image
        }
        else
        {
            this.visualrepresentation = (typeof eptfgSettingsFlocking.shape !== "undefined") ? eptfgSettingsFlocking.shape : this.visualrepresentation;
        }
        if (typeof eptfgSettingsFlocking.ORIENTED !== "undefined")
        {
            if (eptfgSettingsFlocking.ORIENTED == "true")
            {
                this.oriented = true;
            }
            else if (eptfgSettingsFlocking.ORIENTED == "false")
            {
                this.oriented = false;
            }
        }
        this.color = (typeof eptfgSettingsFlocking.color !== "undefined") ? eptfgSettingsFlocking.color : this.color;
    }
    
    if (typeof settings !== "undefined")
    {
        this.scenewidth = (typeof settings.scenewidth !== "undefined") ? settings.scenewidth : this.scenewidth;
        this.size = (typeof settings.size !== "undefined") ? settings.size : this.size;
        this.quantity = (typeof settings.quantity !== "undefined") ? settings.quantity : this.quantity;
        this.separationweight = (typeof settings.separationweight !== "undefined") ? settings.separationweight : this.separationweight;
        this.alignmentweight = (typeof settings.alignmentweight !== "undefined") ? settings.alignmentweight : this.alignmentweight;
        this.cohesionweight = (typeof settings.cohesionweight !== "undefined") ? settings.cohesionweight : this.cohesionweight;
        this.visualrepresentation = (typeof settings.visualrepresentation !== "undefined") ? settings.visualrepresentation : this.visualrepresentation;
        this.ORIENTEDTOWARDSMOVEMENT = (typeof settings.ORIENTEDTOWARDSMOVEMENT !== "undefined") ? settings.ORIENTEDTOWARDSMOVEMENT : this.ORIENTEDTOWARDSMOVEMENT;
        this.color = (typeof settings.color !== "undefined") ? settings.color : this.color;
    }
};

/**
 * Initializes all simulation objects.
 */
FlockingAnimation.prototype.initSimulation = function()
{
    this.flock = new Flock (this.size * Flock.desiredseparationtoradiusratio,
                            this.size * Flock.neighbourdistancetoradiusratio,
                            this.separationweight,
                            this.alignmentweight,
                            this.cohesionweight);
    for (var i=0; i<this.quantity; i++)
    {
        var angle = getRandomBetween (0, 2 * Math.PI);
        this.flock.addBoid (new Boid (this.visualrepresentation,
                                      this.size,
                                      new Vector (0, 0),
                                      new Vector (Math.cos(angle), Math.sin(angle)),
                                      new Vector(),
                                      2,
                                      0.03,
                                      this.ORIENTEDTOWARDSMOVEMENT)
                            );
        this.flock.boids[i].color = this.color;
    }
    
    this.currentTime = Date.now();
};

/**
 * Runs the simulation and renders it.
 */
FlockingAnimation.prototype.draw = function()
{
    var previousTime = this.currentTime;
    this.currentTime = Date.now();
    
    this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
    
    this.context.save();
    
    var zoom = this.canvas.width / this.scenewidth;
    this.context.setTransform (zoom, 0, 0, zoom, this.canvas.width/2, this.canvas.height/2);
    
    if (this.GRID) FlockingAnimation.drawGrid (this.context, this.scenewidth);
    
    this.flock.run (this.dt,
                    -this.scenewidth/2,
                    this.scenewidth/2,
                    -this.scenewidth * this.canvas.height / this.canvas.width / 2,
                    this.scenewidth * this.canvas.height / this.canvas.width / 2);
    
    this.flock.display (this.context);
    
    this.context.restore();
    
    if (this.EDITMODE)
    {
        //canvas corner
        this.context.save();
        this.context.globalAlpha = 1;
        this.context.strokeStyle = "#000000";
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.moveTo (this.canvas.width-15, this.canvas.height-3);
        this.context.lineTo (this.canvas.width-3, this.canvas.height-3);
        this.context.lineTo (this.canvas.width-3, this.canvas.height-15);
        this.context.moveTo (this.canvas.width-15, this.canvas.height-8);
        this.context.lineTo (this.canvas.width-8, this.canvas.height-8);
        this.context.lineTo (this.canvas.width-8, this.canvas.height-15);
        this.context.stroke();
        this.context.restore();
    }
};

/**
 * Draws a grid on the context.
 * @param {Object} context HTML5 Canvas's context to draw on
 */
FlockingAnimation.drawGrid = function (context, scenewidth)
{
    context.save();
    
    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    context.beginPath();
    context.moveTo (-scenewidth/2, 0);
    context.lineTo (scenewidth/2, 0);
    context.stroke();
    context.beginPath();
    context.moveTo (0, -scenewidth/2);
    context.lineTo (0, scenewidth/2);
    context.stroke();
    
    context.strokeStyle = "#444444";
    context.lineWidth = 0.6;
    for (var i=100; i<scenewidth/2; i+=100)
    {
        context.beginPath();
        context.moveTo (i, -scenewidth/2);
        context.lineTo (i, scenewidth/2);
        context.stroke();
    }
    for (var i=-100; i>-scenewidth/2; i-=100)
    {
        context.beginPath();
        context.moveTo (i, -scenewidth/2);
        context.lineTo (i, scenewidth/2);
        context.stroke();
    }
    for (var i=100; i<scenewidth/2; i+=100)
    {
        context.beginPath();
        context.moveTo (-scenewidth/2, i);
        context.lineTo (scenewidth/2, i);
        context.stroke();
    }
    for (var i=-100; i>-scenewidth/2; i-=100)
    {
        context.beginPath();
        context.moveTo (-scenewidth/2, i);
        context.lineTo (scenewidth/2, i);
        context.stroke();
    }
    
    context.strokeStyle = "#AAAAAA";
    context.lineWidth = 0.05;
    for (var i=10; i<scenewidth/2; i+=10)
    {
        context.beginPath();
        context.moveTo (i, -scenewidth/2);
        context.lineTo (i, scenewidth/2);
        context.stroke();
    }
    for (var i=-10; i>-scenewidth/2; i-=10)
    {
        context.beginPath();
        context.moveTo (i, -scenewidth/2);
        context.lineTo (i, scenewidth/2);
        context.stroke();
    }
    for (var i=10; i<scenewidth/2; i+=10)
    {
        context.beginPath();
        context.moveTo (-scenewidth/2, i);
        context.lineTo (scenewidth/2, i);
        context.stroke();
    }
    for (var i=-10; i>-scenewidth/2; i-=10)
    {
        context.beginPath();
        context.moveTo (-scenewidth/2, i);
        context.lineTo (scenewidth/2, i);
        context.stroke();
    }
    
    context.restore();
};
