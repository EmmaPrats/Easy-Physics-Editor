/**
 * Creates a new floating animation.
 * @class
 * @param {Object} canvas a canvas element
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @classdesc Creates and runs an animation based on the floating model. How to use: create an instance of this class and call its method draw() on each frame.
 */
function FloatingAnimation (canvas, EDITMODE = false)
{
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    
    //Simulation objects
    this.letters;
    
    //Editor params
    this.EDITMODE; //EasyPhysicsAnimation
    this.GRID; //EasyPhysicsAnimation
    
    //Scene params
    this.scenewidth; //EasyPhysicsAnimation
    this.waterline;
    
    //Simulation params
    this.dt = 0.01; //EasyPhysicsAnimation
    this.size; //EasyPhysicsAnimation
    this.gravity;
    this.mass;
    this.liquidDensity;
    this.text;
    
    //Aesthetic params
    this.font;
    this.color;
    this.liquidColor;
    this.liquidOpacity;
    
    this.initParams (EDITMODE);
    this.initSimulation();
}

/**
 * Initializes all parameters with given settings or default values.
 * If global object eptfgSettingsFloating exists, initializes with its parameters:
 * eptfgSettingsFloating.EDITMODE
 * eptfgSettingsFloating.GRID
 * eptfgSettingsFloating.scenewidth
 * eptfgSettingsFloating.gravity
 * eptfgSettingsFloating.size
 * eptfgSettingsFloating.mass
 * eptfgSettingsFloating.liquiddensity
 * eptfgSettingsFloating.text
 * eptfgSettingsFloating.font
 * eptfgSettingsFloating.color
 * eptfgSettingsFloating.liquidcolor
 * eptfgSettingsFloating.liquidopacity
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 */
FloatingAnimation.prototype.initParams = function (EDITMODE = false, settings)
{
    this.EDITMODE = EDITMODE;
    this.GRID = EDITMODE;
    
    this.scenewidth = 5;
    this.waterline = 0;
    
    this.gravity = new Vector (0, 9.8);
    this.size = 1;
    this.mass = 500;
    this.liquidDensity = 1000;
    this.text = "Easy Physics";
    
    this.font = "Arial";
    this.color = "#000000";
    this.liquidColor = "#0000FF";
    this.liquidOpacity = 0.7;
    
    if (typeof eptfgSettingsFloating !== "undefined")
    {
        if (typeof eptfgSettingsFloating.EDITMODE !== "undefined")
        {
            if (eptfgSettingsFloating.EDITMODE == "true")
            {
                this.EDITMODE = true;
            }
            else if (eptfgSettingsFloating.EDITMODE == "false")
            {
                this.EDITMODE = false;
            }
        }
        if (typeof eptfgSettingsFloating.GRID !== "undefined")
        {
            if (eptfgSettingsFloating.GRID == "true")
            {
                this.GRID = true;
            }
            else if (eptfgSettingsFloating.GRID == "false")
            {
                this.GRID = false;
            }
        }
        
        this.scenewidth = (typeof eptfgSettingsFloating.scenewidth !== "undefined") ? (1.0 * eptfgSettingsFloating.scenewidth) : this.scenewidth;
        this.waterline = (typeof eptfgSettingsFloating.waterline !== "undefined") ? (-1.0 * eptfgSettingsFloating.waterline) : this.waterline;
        
        this.gravity.y = (typeof eptfgSettingsFloating.gravity !== "undefined") ? (1.0 * eptfgSettingsFloating.gravity) : this.gravity.y;
        this.size = (typeof eptfgSettingsFloating.size !== "undefined") ? (1 * eptfgSettingsFloating.size) : this.size;
        this.mass = (typeof eptfgSettingsFloating.mass !== "undefined") ? (1.0 * eptfgSettingsFloating.mass) : this.mass;
        this.liquidDensity = (typeof eptfgSettingsFloating.liquiddensity !== "undefined") ? (1.0 * eptfgSettingsFloating.liquiddensity) : this.liquidDensity;
        this.text = (typeof eptfgSettingsFloating.text !== "undefined") ? eptfgSettingsFloating.text : this.text;
        
        this.font = (typeof eptfgSettingsFloating.font !== "undefined") ? eptfgSettingsFloating.font : this.font;
        this.color = (typeof eptfgSettingsFloating.color !== "undefined") ? eptfgSettingsFloating.color : this.color;
        this.liquidColor = (typeof eptfgSettingsFloating.liquidcolor !== "undefined") ? eptfgSettingsFloating.liquidcolor : this.liquidColor;
        this.liquidOpacity = (typeof eptfgSettingsFloating.liquidopacity !== "undefined") ? (1.0 *eptfgSettingsFloating.liquidopacity) : this.liquidOpacity;
    }
    
    if (typeof settings !== "undefined")
    {
        this.scenewidth = (typeof settings.scenewidth !== "undefined") ? settings.scenewidth : this.scenewidth;
        this.waterline = (typeof settings.waterline !== "undefined") ? settings.waterline : this.waterline;
        this.gravity = (typeof settings.gravity !== "undefined") ? settings.gravity : this.gravity;
        this.size = (typeof settings.size !== "undefined") ? settings.size : this.size;
        this.mass = (typeof settings.mass !== "undefined") ? settings.mass : this.mass;
        this.liquidDensity = (typeof settings.liquidDensity !== "undefined") ? settings.liquidDensity : this.liquidDensity;
        this.text = (typeof settings.text !== "undefined") ? settings.text : this.text;
        this.font = (typeof settings.font !== "undefined") ? settings.font : this.font;
        this.color = (typeof settings.color !== "undefined") ? settings.color : this.color;
        this.liquidColor = (typeof settings.liquidColor !== "undefined") ? settings.liquidColor : this.liquidColor;
        this.liquidOpacity = (typeof settings.liquidOpacity !== "undefined") ? settings.liquidOpacity : this.liquidOpacity;
    }
};

/**
 * Initializes all simulation objects.
 */
FloatingAnimation.prototype.initSimulation = function()
{
    this.letters = [];
    
    for (let i=0; i<this.text.length; i++)
    {
        this.letters.push (new RigidLetter (this.text[i],
                                            this.font,
                                            this.mass,
                                            this.size,
                                            new Vector (getRandomBetween(-0.8*this.scenewidth/2, 0.8*this.scenewidth/2),
                                                        getRandomBetween(-0.8*this.scenewidth*this.canvas.height/this.canvas.width/2, 0.8* this.scenewidth*this.canvas.height/this.canvas.width/2)),
                                            new Vector (getRandomBetween(-2, 2), getRandomBetween(-1.5, 1.5)),
                                            new Vector())
                           );
        this.letters[i].color = this.color;
        this.letters[i].angularVelocity = getRandomBetween (-1, 1);
    }
};

/**
 * Runs the simulation and renders it.
 */
FloatingAnimation.prototype.draw = function()
{
    this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
    
    this.context.save();
    
    var zoom = this.canvas.width / this.scenewidth;
    this.context.setTransform (zoom, 0, 0, zoom, this.canvas.width/2, this.canvas.height/2);
    
    if (this.GRID) FloatingAnimation.drawGrid (this.context);
    
    for (let i=0; i<this.letters.length; i++)
    {
        this.letters[i].applyAcceleration (this.gravity);
        this.letters[i].applyFlotationForces (this.gravity, this.liquidDensity, this.waterline);
        
        this.letters[i].update (this.dt);
        
        this.letters[i].display (this.context);
    }
    
    //Draw the water
    this.context.save();
    this.context.globalAlpha = this.liquidOpacity;
    this.context.fillStyle = this.liquidColor;
    this.context.fillRect (zoom * (-this.canvas.width/2), this.waterline, zoom * this.canvas.width, this.scenewidth * this.canvas.height / this.canvas.width / 2 - this.waterline);
    this.context.restore();
    
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
FloatingAnimation.drawGrid = function (context)
{
    context.save();
    
    context.lineWidth = 0.025;
    
    context.beginPath();
    context.moveTo(-10, 0);
    context.lineTo(10, 0);
    context.stroke();
    
    context.beginPath();
    context.moveTo(0, -10);
    context.lineTo(0, 10);
    context.stroke();
    
    context.beginPath();
    context.moveTo(-0.25, -10);
    context.lineTo(0.25, -10);
    context.moveTo(-0.25, -9);
    context.lineTo(0.25, -9);
    context.moveTo(-0.25, -8);
    context.lineTo(0.25, -8);
    context.moveTo(-0.25, -7);
    context.lineTo(0.25, -7);
    context.moveTo(-0.25, -6);
    context.lineTo(0.25, -6);
    context.moveTo(-0.25, -5);
    context.lineTo(0.25, -5);
    context.moveTo(-0.25, -4);
    context.lineTo(0.25, -4);
    context.moveTo(-0.25, -3);
    context.lineTo(0.25, -3);
    context.moveTo(-0.25, -2);
    context.lineTo(0.25, -2);
    context.moveTo(-0.25, -1);
    context.lineTo(0.25, -1);
    context.moveTo(-0.25, 1);
    context.lineTo(0.25, 1);
    context.moveTo(-0.25, 2);
    context.lineTo(0.25, 2);
    context.moveTo(-0.25, 3);
    context.lineTo(0.25, 3);
    context.moveTo(-0.25, 4);
    context.lineTo(0.25, 4);
    context.moveTo(-0.25, 5);
    context.lineTo(0.25, 5);
    context.moveTo(-0.25, 6);
    context.lineTo(0.25, 6);
    context.moveTo(-0.25, 7);
    context.lineTo(0.25, 7);
    context.moveTo(-0.25, 8);
    context.lineTo(0.25, 8);
    context.moveTo(-0.25, 9);
    context.lineTo(0.25, 9);
    context.moveTo(-0.25, 10);
    context.lineTo(0.25, 10);
    context.stroke();
    
    context.beginPath();
    context.moveTo(-10, -0.25);
    context.lineTo(-10, 0.25);
    context.moveTo(-9, -0.25);
    context.lineTo(-9, 0.25);
    context.moveTo(-8, -0.25);
    context.lineTo(-8, 0.25);
    context.moveTo(-7, -0.25);
    context.lineTo(-7, 0.25);
    context.moveTo(-6, -0.25);
    context.lineTo(-6, 0.25);
    context.moveTo(-5, -0.25);
    context.lineTo(-5, 0.25);
    context.moveTo(-4, -0.25);
    context.lineTo(-4, 0.25);
    context.moveTo(-3, -0.25);
    context.lineTo(-3, 0.25);
    context.moveTo(-2, -0.25);
    context.lineTo(-2, 0.25);
    context.moveTo(-1, -0.25);
    context.lineTo(-1, 0.25);
    context.moveTo(1, -0.25);
    context.lineTo(1, 0.25);
    context.moveTo(2, -0.25);
    context.lineTo(2, 0.25);
    context.moveTo(3, -0.25);
    context.lineTo(3, 0.25);
    context.moveTo(4, -0.25);
    context.lineTo(4, 0.25);
    context.moveTo(5, -0.25);
    context.lineTo(5, 0.25);
    context.moveTo(6, -0.25);
    context.lineTo(6, 0.25);
    context.moveTo(7, -0.25);
    context.lineTo(7, 0.25);
    context.moveTo(8, -0.25);
    context.lineTo(8, 0.25);
    context.moveTo(9, -0.25);
    context.lineTo(9, 0.25);
    context.moveTo(10, -0.25);
    context.lineTo(10, 0.25);
    context.stroke();
    
    context.beginPath();
    context.moveTo(-0.9, -0.1);
    context.lineTo(-0.9, 0.1);
    context.moveTo(-0.8, -0.1);
    context.lineTo(-0.8, 0.1);
    context.moveTo(-0.7, -0.1);
    context.lineTo(-0.7, 0.1);
    context.moveTo(-0.6, -0.1);
    context.lineTo(-0.6, 0.1);
    context.moveTo(-0.5, -0.1);
    context.lineTo(-0.5, 0.1);
    context.moveTo(-0.4, -0.1);
    context.lineTo(-0.4, 0.1);
    context.moveTo(-0.3, -0.1);
    context.lineTo(-0.3, 0.1);
    context.moveTo(-0.2, -0.1);
    context.lineTo(-0.2, 0.1);
    context.moveTo(-0.1, -0.1);
    context.lineTo(-0.1, 0.1);
    context.moveTo(0.1, -0.1);
    context.lineTo(0.1, 0.1);
    context.moveTo(0.2, -0.1);
    context.lineTo(0.2, 0.1);
    context.moveTo(0.3, -0.1);
    context.lineTo(0.3, 0.1);
    context.moveTo(0.4, -0.1);
    context.lineTo(0.4, 0.1);
    context.moveTo(0.5, -0.1);
    context.lineTo(0.5, 0.1);
    context.moveTo(0.6, -0.1);
    context.lineTo(0.6, 0.1);
    context.moveTo(0.7, -0.1);
    context.lineTo(0.7, 0.1);
    context.moveTo(0.8, -0.1);
    context.lineTo(0.8, 0.1);
    context.moveTo(0.9, -0.1);
    context.lineTo(0.9, 0.1);
    context.lineWidth = 0.01;
    context.stroke();
    
    context.restore();
};
