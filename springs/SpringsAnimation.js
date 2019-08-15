/**
 * Creates a springs animation.
 * @class
 * @param {Object} canvas a canvas element
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @classdesc Creates and runs an animation based on the mass-spring-damper model. How to use: create an instance of this class and call its method draw() on each frame.
 */
function SpringsAnimation (canvas, EDITMODE = false)
{
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    
    //Simulation objects
    this.springs;
    this.letters;
    
    //Editor params
    this.EDITMODE; //EasyPhysicsAnimation
    this.GRID; //EasyPhysicsAnimation
    this.textlocation;
    this.SHOWTEXT;
    this.POSITIONINGMODE;
    
    //Scene params
    this.scenewidth; //EasyPhysicsAnimation
    
    //Simulation params
    this.dt = 0.02; //EasyPhysicsAnimation
    this.size; //EasyPhysicsAnimation
    this.mass;
    this.stiffness;
    this.damping;
    this.text;
    this.mousePos = new Vector();
    this.letterlocations;
    
    //Aesthetic params
    this.font;
    this.color;
    
    this.canvas.easyPhysicsMousePos = this.mousePos;
    this.canvas.addEventListener ("mousemove", function(e){
                                  e.target.MOUSEOVERCANVAS = true;
                                  e.target.easyPhysicsMousePos.x = e.clientX - offset(e.target).left;
                                  e.target.easyPhysicsMousePos.y = e.clientY - offset(e.target).top;
                                  });
    this.canvas.addEventListener ("mouseout", function(e){e.target.MOUSEOVERCANVAS = false;});
    
    this.initParams (EDITMODE);
    this.initSimulation();
}

/**
 * Initializes all parameters with given settings or default values.
 * If global object eptfgSettingsSprings exists, initializes with its parameters:
 * eptfgSettingsSprings.EDITMODE
 * eptfgSettingsSprings.GRID
 * eptfgSettingsSprings.textlocationX
 * eptfgSettingsSprings.textlocationY
 * eptfgSettingsSprings.SHOWTEXT
 * eptfgSettingsSprings.POSITIONINGMODE
 * eptfgSettingsSprings.scenewidth
 * eptfgSettingsSprings.size
 * eptfgSettingsSprings.mass
 * eptfgSettingsSprings.stiffness
 * eptfgSettingsSprings.damping
 * eptfgSettingsSprings.text
 * eptfgSettingsSprings.letterlocation~x (one for each letter of text. "~" is the index)
 * eptfgSettingsSprings.letterlocation~y (one for each letter of text. "~" is the index)
 * eptfgSettingsSprings.font
 * eptfgSettingsSprings.color
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @param {Object} settings object that contains settings
 */
SpringsAnimation.prototype.initParams = function (EDITMODE = false, settings)
{
    this.EDITMODE = EDITMODE;
    this.GRID = EDITMODE;
    this.textlocation = new Vector();
    this.SHOWTEXT = EDITMODE;
    this.POSITIONINGMODE = false;
    
    this.scenewidth = 11;
    
    this.size = 1;
    this.mass = 1;
    this.stiffness = 150;
    this.damping = 3;
    this.text = "Easy Physics";
    this.letterlocations = [];
    for (let i=0; i<this.text.length; i++)
    {
        this.letterlocations.push (new Vector (i * 0.5, 0));
    }
    
    this.font = "Arial";
    this.color = "#000000";
    
    if (typeof eptfgSettingsSprings !== "undefined")
    {
        if (typeof eptfgSettingsSprings.EDITMODE !== "undefined")
        {
            if (eptfgSettingsSprings.EDITMODE == "true")
            {
                this.EDITMODE = true;
            }
            else if (eptfgSettingsSprings.EDITMODE == "false")
            {
                this.EDITMODE = false;
            }
        }
        if (typeof eptfgSettingsSprings.GRID !== "undefined")
        {
            if (eptfgSettingsSprings.GRID == "true")
            {
                this.GRID = true;
            }
            else if (eptfgSettingsSprings.GRID == "false")
            {
                this.GRID = false;
            }
        }
        this.textlocation.x = (typeof eptfgSettingsSprings.textlocationX !== "undefined") ? (1.0 * eptfgSettingsSprings.textlocationX) : this.textlocation.x;
        this.textlocation.y = (typeof eptfgSettingsSprings.textlocationY !== "undefined") ? (1.0 * eptfgSettingsSprings.textlocationY) : this.textlocation.y;
        if (typeof eptfgSettingsSprings.SHOWTEXT !== "undefined")
        {
            if (eptfgSettingsSprings.SHOWTEXT == "true")
            {
                this.SHOWTEXT = true;
            }
            else if (eptfgSettingsSprings.SHOWTEXT == "false")
            {
                this.SHOWTEXT = false;
            }
        }
        if (typeof eptfgSettingsSprings.POSITIONINGMODE !== "undefined")
        {
            if (eptfgSettingsSprings.POSITIONINGMODE == "true")
            {
                this.POSITIONINGMODE = true;
            }
            else if (eptfgSettingsSprings.POSITIONINGMODE == "false")
            {
                this.POSITIONINGMODE = false;
            }
        }
        
        this.scenewidth = (typeof eptfgSettingsSprings.scenewidth !== "undefined") ? (1.0 * eptfgSettingsSprings.scenewidth) : this.scenewidth;
        
        this.size = (typeof eptfgSettingsSprings.size !== "undefined") ? (1 * eptfgSettingsSprings.size) : this.size;
        this.mass = (typeof eptfgSettingsSprings.mass !== "undefined") ? (1.0 * eptfgSettingsSprings.mass) : this.mass;
        this.stiffness = (typeof eptfgSettingsSprings.stiffness !== "undefined") ? (1.0 * eptfgSettingsSprings.stiffness) : this.stiffness;
        this.damping = (typeof eptfgSettingsSprings.damping !== "undefined") ? (1.0 * eptfgSettingsSprings.damping) : this.damping;
        this.text = (typeof eptfgSettingsSprings.text !== "undefined") ? eptfgSettingsSprings.text : this.text;
        for (var i=0; i<this.text.length; i++)
        {
            this.letterlocations[i] = new Vector ((typeof eptfgSettingsSprings["letterlocation" + i + "x"] !== "undefined") ? (1.0 * eptfgSettingsSprings["letterlocation" + i + "x"]) : this.letterlocations[i].x,
                                                  (typeof eptfgSettingsSprings["letterlocation" + i + "y"] !== "undefined") ? (1.0 * eptfgSettingsSprings["letterlocation" + i + "y"]) : this.letterlocations[i].y);
        }
        
        this.font = (typeof eptfgSettingsSprings.font !== "undefined") ? eptfgSettingsSprings.font : this.font;
        this.color = (typeof eptfgSettingsSprings.color !== "undefined") ? eptfgSettingsSprings.color : this.color;
    }
    
    if (typeof settings !== "undefined")
    {
        this.scenewidth = (typeof settings.scenewidth !== "undefined") ? settings.scenewidth : this.scenewidth;
        this.size = (typeof settings.size !== "undefined") ? settings.size : this.size;
        this.mass = (typeof settings.mass !== "undefined") ? settings.mass : this.mass;
        this.stiffness = (typeof settings.stiffness !== "undefined") ? settings.stiffness : this.stiffness;
        this.damping = (typeof settings.damping !== "undefined") ? settings.damping : this.damping;
        this.text = (typeof settings.text !== "undefined") ? settings.text : this.text;
        this.letterlocations = (typeof settings.letterlocations !== "undefined") ? settings.letterlocations : this.letterlocations;
        this.font = (typeof settings.font !== "undefined") ? settings.font : this.font;
        this.color = (typeof settings.color !== "undefined") ? settings.color : this.color;
    }
};

/**
 * Initializes all simulation objects.
 */
SpringsAnimation.prototype.initSimulation = function()
{
    this.letters = [];
    this.springs = [];
    
    for (let i=0; i<this.text.length; i++)
    {
        this.letters.push (new Particle (new Character (this.text[i], this.font, this.size, this.color),
                                         this.mass,
                                         this.size,
                                         new Vector (this.letterlocations[i].x, this.letterlocations[i].y),
                                         new Vector(),
                                         new Vector(),
                                         false)
                           );
        this.letters[i].color = this.color;
        this.letters[i].visualrepresentation.color = this.color;
        
        this.springs.push (new Spring (new Vector (this.letterlocations[i].x, this.letterlocations[i].y),
                                       this.letters[i],
                                       0,
                                       this.stiffness,
                                       this.damping)
                           );
    }
};

/**
 * Runs the simulation and renders it.
 */
SpringsAnimation.prototype.draw = function()
{
    this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
    
    this.context.save();
    
    var zoom = this.canvas.width / this.scenewidth;
    this.context.setTransform (zoom, 0, 0, zoom, this.canvas.width/2, this.canvas.height/2);
    
    if (this.GRID) SpringsAnimation.drawGrid (this.context);
    
    if (this.SHOWTEXT)
    {
        this.context.save();
        this.context.fillStyle = "#000000";
        this.context.font = this.size + "px " + this.font;
        this.context.fillText (this.text, this.textlocation.x, this.textlocation.y);
        this.context.restore();
    }
    
    if (this.POSITIONINGMODE)
    {
        for (var i=0; i<this.letters.length; i++)
        {
            this.letters[i].display (this.context);
            this.context.save();
            this.context.fillStyle = "#000000";
            this.context.globalAlpha = 0.7;
            this.context.beginPath();
            this.context.arc (this.letters[i].location.x, this.letters[i].location.y, 0.2*this.letters[i].visualrepresentation.size, 0, 2*Math.PI);
            this.context.closePath();
            this.context.fill();
            this.context.restore();
        }
        
        if (this.SHOWTEXT)
        {
            this.context.save();
            this.context.fillStyle = "#000000";
            this.context.globalAlpha = 0.7;
            this.context.beginPath();
            this.context.arc (this.textlocation.x, this.textlocation.y, 0.2*this.size, 0, 2*Math.PI);
            this.context.closePath();
            this.context.fill();
            this.context.restore();
        }
    }
    else
    {
        var mousePos = Vector.sub (this.mousePos, new Vector (this.canvas.width/2, this.canvas.height/2));
        mousePos.div (zoom);
        
        for (var i=0; i<this.springs.length; i++)
        {
            this.springs[i].applySpringForcesToParticle();
        }
        
        for (var i=0; i<this.letters.length; i++)
        {
            if (this.canvas.MOUSEOVERCANVAS && Vector.dist (this.letters[i].location, mousePos) < this.size)
            {
                var direction = Vector.sub (this.letters[i].location, mousePos);
                direction.normalize();
                direction.mult (100 * this.letters[i].radius);
                this.letters[i].applyForce (direction);
            }
            
            this.letters[i].update (this.dt);
            this.letters[i].display (this.context);
        }
    }
    
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
SpringsAnimation.drawGrid = function (context)
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
