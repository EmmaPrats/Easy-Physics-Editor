/**
 * Creates a steering animation.
 * @class
 * @param {Object} canvas a canvas element
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @classdesc Creates and runs an animation based on Reynolds' Steering Behaviours. How to use: create an instance of this class and call its method draw() on each frame.
 */
function SteeringAnimation (canvas, EDITMODE = false)
{
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    
    //Simulation objects
    this.hunter;
    this.gatherer;
    this.target;
    
    //Editor params
    this.EDITMODE; //EasyPhysicsAnimation
    this.GRID; //EasyPhysicsAnimation
    this.SHOWPURSUEDISTANCE;
    this.SHOWSEEKDISTANCE;
    this.SHOWEVADEDISTANCE;
    
    //Scene params
    this.scenewidth; //EasyPhysicsAnimation
    this.EXISTS_hunter;
    this.EXISTS_gatherer;
    this.EXISTS_target;
    
    //Simulation params
    this.dt = 1.0; //EasyPhysicsAnimation
    this.size; //EasyPhysicsAnimation
    this.pursuedistance;
    this.seekdistance;
    this.evadedistance;
    this.pursueweight;
    this.seekweight;
    this.evadeweight;
    
    //Aesthetic params
    this.visualrepresentation_hunter;
    this.ORIENTEDTOWARDSMOVEMENT_hunter;
    this.color_hunter;
    this.visualrepresentation_gatherer;
    this.ORIENTEDTOWARDSMOVEMENT_gatherer;
    this.color_gatherer;
    this.visualrepresentation_target;
    this.color_target;
    
    this.initParams (EDITMODE);
    this.initSimulation();
}

//SteeringAnimation.prototype = Object.create (EasyPhysicsAnimation.prototype);
//SteeringAnimation.prototype.constructor = SteeringAnimation;

/**
 * Initializes all parameters with given settings or default values.
 * If global object eptfgSettingsSteering exists, initializes with its parameters:
 * eptfgSettingsSteering.EDITMODE
 * eptfgSettingsSteering.GRID
 * eptfgSettingsSteering.SHOWPURSUEDISTANCE
 * eptfgSettingsSteering.SHOWSEEKDISTANCE
 * eptfgSettingsSteering.SHOWEVADEDISTANCE
 * eptfgSettingsSteering.EXISTS_hunter
 * eptfgSettingsSteering.EXISTS_gatherer
 * eptfgSettingsSteering.EXISTS_target
 * eptfgSettingsSteering.size
 * eptfgSettingsSteering.pursuedistance
 * eptfgSettingsSteering.seekdistance
 * eptfgSettingsSteering.evadedistance
 * eptfgSettingsSteering.pursueweight
 * eptfgSettingsSteering.seekweight
 * eptfgSettingsSteering.evadeweight
 * eptfgSettingsSteering.visualrepresentation_hunter
 * eptfgSettingsSteering.ORIENTEDTOWARDSMOVEMENT_hunter
 * eptfgSettingsSteering.color_hunter
 * eptfgSettingsSteering.visualrepresentation_gatherer
 * eptfgSettingsSteering.ORIENTEDTOWARDSMOVEMENT_gatherer
 * eptfgSettingsSteering.color_gatherer
 * eptfgSettingsSteering.visualrepresentation_target
 * eptfgSettingsSteering.color_target
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @param {Object} settings object that contains settings
 */
SteeringAnimation.prototype.initParams = function (EDITMODE = false, settings)
{
    this.EDITMODE = EDITMODE;
    this.GRID = EDITMODE;
    this.SHOWPURSUEDISTANCE = false;
    this.SHOWSEEKDISTANCE = false;
    this.SHOWEVADEDISTANCE = false;
    
    this.scenewidth = 400;
    this.EXISTS_hunter = true;
    this.EXISTS_gatherer = true;
    this.EXISTS_target = true;
    
    this.size = 5;
    this.pursuedistance = 50;
    this.seekdistance = 50;
    this.evadedistance = 50;
    this.pursueweight = 1.0;
    this.seekweight = 1.0;
    this.evadeweight = 1.0;
    
    this.visualrepresentation_hunter = "triangle";
    this.ORIENTEDTOWARDSMOVEMENT_hunter = true;
    this.color_hunter = "#000000";
    this.visualrepresentation_gatherer = "circle";
    this.ORIENTEDTOWARDSMOVEMENT_gatherer = true;
    this.color_gatherer = "#000000";
    this.visualrepresentation_target = "square";
    this.color_target = "#000000";
    
    if (typeof eptfgSettingsSteering !== "undefined")
    {
        if (typeof eptfgSettingsSteering.EDITMODE !== "undefined")
        {
            if (eptfgSettingsSteering.EDITMODE == "true")
            {
                this.EDITMODE = true;
            }
            else if (eptfgSettingsSteering.EDITMODE == "false")
            {
                this.EDITMODE = false;
            }
        }
        if (typeof eptfgSettingsSteering.GRID !== "undefined")
        {
            if (eptfgSettingsSteering.GRID == "true")
            {
                this.GRID = true;
            }
            else if (eptfgSettingsSteering.GRID == "false")
            {
                this.GRID = false;
            }
        }
        if (typeof eptfgSettingsSteering.SHOWPURSUEDISTANCE !== "undefined")
        {
            if (eptfgSettingsSteering.SHOWPURSUEDISTANCE == "true")
            {
                this.SHOWPURSUEDISTANCE = true;
            }
            else if (eptfgSettingsSteering.SHOWPURSUEDISTANCE == "false")
            {
                this.SHOWPURSUEDISTANCE = false;
            }
        }
        if (typeof eptfgSettingsSteering.SHOWSEEKDISTANCE !== "undefined")
        {
            if (eptfgSettingsSteering.SHOWSEEKDISTANCE == "true")
            {
                this.SHOWSEEKDISTANCE = true;
            }
            else if (eptfgSettingsSteering.SHOWSEEKDISTANCE == "false")
            {
                this.SHOWSEEKDISTANCE = false;
            }
        }
        if (typeof eptfgSettingsSteering.SHOW_EVADEDISTANCE !== "undefined")
        {
            if (eptfgSettingsSteering.SHOW_EVADEDISTANCE == "true")
            {
                this.SHOW_EVADEDISTANCE = true;
            }
            else if (eptfgSettingsSteering.SHOW_EVADEDISTANCE == "false")
            {
                this.SHOW_EVADEDISTANCE = false;
            }
        }
        
        this.scenewidth = (typeof eptfgSettingsSteering.scenewidth !== "undefined") ? (1.0 * eptfgSettingsSteering.scenewidth) : this.scenewidth;
        if (typeof eptfgSettingsSteering.EXISTS_hunter !== "undefined")
        {
            if (eptfgSettingsSteering.EXISTS_hunter == "true")
            {
                this.EXISTS_hunter = true;
            }
            else if (eptfgSettingsSteering.EXISTS_hunter == "false")
            {
                this.EXISTS_hunter = false;
            }
        }
        if (typeof eptfgSettingsSteering.EXISTS_gatherer !== "undefined")
        {
            if (eptfgSettingsSteering.EXISTS_gatherer == "true")
            {
                this.EXISTS_gatherer = true;
            }
            else if (eptfgSettingsSteering.EXISTS_gatherer == "false")
            {
                this.EXISTS_gatherer = false;
            }
        }
        if (typeof eptfgSettingsSteering.EXISTS_target !== "undefined")
        {
            if (eptfgSettingsSteering.EXISTS_target == "true")
            {
                this.EXISTS_target = true;
            }
            else if (eptfgSettingsSteering.EXISTS_target == "false")
            {
                this.EXISTS_target = false;
            }
        }
        
        this.size = (typeof eptfgSettingsSteering.size !== "undefined") ? (1.0 * eptfgSettingsSteering.size) : this.size;
        this.pursuedistance = (typeof eptfgSettingsSteering.pursuedistance !== "undefined") ? (1.0 * eptfgSettingsSteering.pursuedistance) : this.pursuedistance;
        this.seekdistance = (typeof eptfgSettingsSteering.seekdistance !== "undefined") ? (1.0 * eptfgSettingsSteering.seekdistance) : this.size;
        this.evadedistance = (typeof eptfgSettingsSteering.evadedistance !== "undefined") ? (1 * eptfgSettingsSteering.evadedistance) : this.evadedistance;
        this.pursueweight = (typeof eptfgSettingsSteering.pursueweight !== "undefined") ? (1.0 * eptfgSettingsSteering.pursueweight) : this.pursueweight;
        this.seekweight = (typeof eptfgSettingsSteering.seekweight !== "undefined") ? (1.0 * eptfgSettingsSteering.seekweight) : this.size;
        this.evadeweight = (typeof eptfgSettingsSteering.evadeweight !== "undefined") ? (1 * eptfgSettingsSteering.evadeweight) : this.evadeweight;
        
        var visualrepresentation_hunter = (typeof eptfgSettingsSteering.visualrepresentation_hunter !== "undefined") ? eptfgSettingsSteering.visualrepresentation_hunter : this.visualrepresentation_hunter;
        if (visualrepresentation_hunter == "image")
        {
            //TODO image
        }
        else
        {
            this.visualrepresentation_hunter = (typeof eptfgSettingsSteering.shape_hunter !== "undefined") ? eptfgSettingsSteering.shape_hunter : this.visualrepresentation_hunter;
        }
        var visualrepresentation_gatherer = (typeof eptfgSettingsSteering.visualrepresentation_gatherer !== "undefined") ? eptfgSettingsSteering.visualrepresentation_gatherer : this.visualrepresentation_gatherer;
        if (visualrepresentation_gatherer == "image")
        {
            //TODO image
        }
        else
        {
            this.visualrepresentation_gatherer = (typeof eptfgSettingsSteering.shape_gatherer !== "undefined") ? eptfgSettingsSteering.shape_gatherer : this.visualrepresentation_gatherer;
        }
        var visualrepresentation_target = (typeof eptfgSettingsSteering.visualrepresentation_target !== "undefined") ? eptfgSettingsSteering.visualrepresentation_target : this.visualrepresentation_target;
        if (visualrepresentation_target == "image")
        {
            //TODO image
        }
        else
        {
            this.visualrepresentation_target = (typeof eptfgSettingsSteering.shape_target !== "undefined") ? eptfgSettingsSteering.shape_target : this.visualrepresentation_target;
        }
        if (typeof eptfgSettingsSteering.ORIENTED_hunter !== "undefined")
        {
            if (eptfgSettingsSteering.ORIENTED_hunter == "true")
            {
                this.oriented_hunter = true;
            }
            else if (eptfgSettingsSteering.ORIENTED_hunter == "false")
            {
                this.oriented_hunter = false;
            }
        }
        if (typeof eptfgSettingsSteering.ORIENTED_gatherer !== "undefined")
        {
            if (eptfgSettingsSteering.ORIENTED_gatherer == "true")
            {
                this.oriented_gatherer = true;
            }
            else if (eptfgSettingsSteering.ORIENTED_gatherer == "false")
            {
                this.oriented_gatherer = false;
            }
        }
        this.color_hunter = (typeof eptfgSettingsSteering.color_hunter !== "undefined") ? eptfgSettingsSteering.color_hunter : this.color_hunter;
        this.color_gatherer = (typeof eptfgSettingsSteering.color_gatherer !== "undefined") ? eptfgSettingsSteering.color_gatherer : this.color_gatherer;
        this.color_target = (typeof eptfgSettingsSteering.color_target !== "undefined") ? eptfgSettingsSteering.color_target : this.color_target;
    }
    
    if (typeof settings !== "undefined")
    {
        this.scenewidth = (typeof settings.scenewidth !== "undefined") ? settings.scenewidth : this.scenewidth;
        this.EXISTS_hunter = (typeof settings.EXISTS_hunter !== "undefined") ? settings.EXISTS_hunter : this.EXISTS_hunter;
        this.EXISTS_gatherer = (typeof settings.EXISTS_gatherer !== "undefined") ? settings.EXISTS_gatherer : this.EXISTS_gatherer;
        this.EXISTS_target = (typeof settings.EXISTS_target !== "undefined") ? settings.EXISTS_target : this.EXISTS_target;
        this.size = (typeof settings.size !== "undefined") ? settings.size : this.size;
        this.pursuedistance = (typeof settings.pursuedistance !== "undefined") ? settings.pursuedistance : this.pursuedistance;
        this.seekdistance = (typeof settings.seekdistance !== "undefined") ? settings.seekdistance : this.seekdistance;
        this.evadedistance = (typeof settings.evadedistance !== "undefined") ? settings.evadedistance : this.evadedistance;
        this.pursueweight = (typeof settings.pursueweight !== "undefined") ? settings.pursueweight : this.pursueweight;
        this.seekweight = (typeof settings.seekweight !== "undefined") ? settings.seekweight : this.seekweight;
        this.evadeweight = (typeof settings.evadeweight !== "undefined") ? settings.evadeweight : this.evadeweight;
        this.visualrepresentation_hunter = (typeof settings.visualrepresentation_hunter !== "undefined") ? settings.visualrepresentation_hunter : this.visualrepresentation_hunter;
        this.ORIENTEDTOWARDSMOVEMENT_hunter = (typeof settings.ORIENTEDTOWARDSMOVEMENT_hunter !== "undefined") ? settings.ORIENTEDTOWARDSMOVEMENT_hunter : this.ORIENTEDTOWARDSMOVEMENT_hunter;
        this.color_hunter = (typeof settings.color_hunter !== "undefined") ? settings.color_hunter : this.color_hunter;
        this.visualrepresentation_gatherer = (typeof settings.visualrepresentation_gatherer !== "undefined") ? settings.visualrepresentation_gatherer : this.visualrepresentation_gatherer;
        this.ORIENTEDTOWARDSMOVEMENT_gatherer = (typeof settings.ORIENTEDTOWARDSMOVEMENT_gatherer !== "undefined") ? settings.ORIENTEDTOWARDSMOVEMENT_gatherer : this.ORIENTEDTOWARDSMOVEMENT_gatherer;
        this.color_gatherer = (typeof settings.color_gatherer !== "undefined") ? settings.color_gatherer : this.color_gatherer;
        this.visualrepresentation_target = (typeof settings.visualrepresentation_target !== "undefined") ? settings.visualrepresentation_target : this.visualrepresentation_target;
        this.ORIENTEDTOWARDSMOVEMENT_target = (typeof settings.ORIENTEDTOWARDSMOVEMENT_target !== "undefined") ? settings.ORIENTEDTOWARDSMOVEMENT_target : this.ORIENTEDTOWARDSMOVEMENT_target;
        this.color_target = (typeof settings.color_target !== "undefined") ? settings.color_target : this.color_target;
    }
};

/**
 * Initializes all simulation objects.
 */
SteeringAnimation.prototype.initSimulation = function()
{
    var worldHeight = this.scenewidth * this.canvas.height / this.canvas.width;
    
    if (this.EXISTS_hunter)
    {
        this.hunter = new Boid (this.visualrepresentation_hunter,
                                this.size,
                                new Vector (getRandomBetween(-this.scenewidth/2, this.scenewidth/2), getRandomBetween(-worldHeight/2, worldHeight/2)),
                                new Vector(),
                                new Vector(),
                                2,
                                0.03,
                                this.ORIENTEDTOWARDSMOVEMENT_hunter);
        this.hunter.color = this.color_hunter;
    }
    else
    {
        this.hunter = null;
    }
    
    if (this.EXISTS_gatherer)
    {
        this.gatherer = new Boid (this.visualrepresentation_gatherer,
                                  this.size,
                                  new Vector (getRandomBetween(-this.scenewidth/2, this.scenewidth/2), getRandomBetween(-worldHeight/2, worldHeight/2)),
                                  new Vector(),
                                  new Vector(),
                                  2,
                                  0.03,
                                  this.ORIENTEDTOWARDSMOVEMENT_gatherer);
        this.gatherer.color = this.color_gatherer;
    }
    else
    {
        this.gatherer = null;
    }
    
    if (this.EXISTS_target)
    {
        this.target = new Vector (getRandomBetween(-this.scenewidth/2, this.scenewidth/2), getRandomBetween(-worldHeight/2, worldHeight/2));
    }
    else
    {
        this.target = null;
    }
    
    this.currentTime = Date.now();
};

/**
 * Runs the simulation and renders it.
 */
SteeringAnimation.prototype.draw = function()
{
    var previousTime = this.currentTime;
    this.currentTime = Date.now();
    
    this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
    
    this.context.save();
    
    var zoom = this.canvas.width / this.scenewidth;
    this.context.setTransform (zoom, 0, 0, zoom, this.canvas.width/2, this.canvas.height/2);
    
    if (this.GRID) SteeringAnimation.drawGrid (this.context, this.scenewidth);
    
    //GATHERER logic and forces
    if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null))
    {
        var targetDoesntExistOrIsFar = true;
        var hunterDoesntExistOrIsFar = true;
        
        if (!(typeof (this.target) === "undefined" || this.target === null))
        {
            if (Vector.dist (this.gatherer.location, this.target) <= this.seekdistance)
            {
                targetDoesntExistOrIsFar = false;
                
                var seek = this.gatherer.seekIfNear (this.target, this.seekdistance); //Seek
                seek.mult (this.seekweight);
                this.gatherer.applyForce (seek);
            }
        }
        if (!(typeof (this.hunter) === "undefined" || this.hunter === null))
        {
            if (Vector.dist (this.gatherer.location, this.hunter.location) <= this.evadedistance)
            {
                hunterDoesntExistOrIsFar = false;
                
                var evade = this.gatherer.evadeIfNear (this.hunter, this.evadedistance, this.dt); //Evade
                evade.mult (this.evadeweight);
                this.gatherer.applyForce (evade);
            }
        }
        if (targetDoesntExistOrIsFar && hunterDoesntExistOrIsFar)
        {
            var wander = this.gatherer.wander();
            this.gatherer.applyForce (wander);
        }
    }
    
    //HUNTER logic and forces
    if (!(typeof (this.hunter) === "undefined" || this.hunter === null))
    {
        var gathererDoesntExistOrIsFar = true;
        
        if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null))
        {
            if (Vector.dist (this.hunter.location, this.gatherer.location) <= this.pursuedistance)
            {
                gathererDoesntExistOrIsFar = false;
                
                var pursue = this.hunter.pursueIfNear (this.gatherer, this.pursuedistance, this.dt); //Pursue
                pursue.mult (this.pursueweight);
                this.hunter.applyForce (pursue);
            }
        }
        if (gathererDoesntExistOrIsFar)
        {
            var wander = this.hunter.wander();
            this.hunter.applyForce (wander);
        }
    }
    
    //UPDATE gatherer and hunter positions
    if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null)) this.gatherer.update (this.dt);
    if (!(typeof (this.hunter) === "undefined" || this.hunter === null)) this.hunter.update (this.dt);
    
    //If gatherer reached the target, new target
    if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null) &&
        !(typeof (this.target) === "undefined" || this.target === null) &&
        Vector.dist (this.gatherer.location, this.target) < this.gatherer.radius * 2)
    {
        this.target.x = getRandomBetween (-this.scenewidth/2, this.scenewidth/2);
        this.target.y = getRandomBetween (-this.scenewidth * this.canvas.height / this.canvas.width / 2, this.scenewidth * this.canvas.height / this.canvas.width / 2);
    }
    
    //BORDERS gatherer and hunter
    if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null))
    {
        this.gatherer.borders (-this.scenewidth/2,
                                this.scenewidth/2,
                                -this.scenewidth * this.canvas.height / this.canvas.width / 2,
                                this.scenewidth * this.canvas.height / this.canvas.width / 2);
    }
    if (!(typeof (this.hunter) === "undefined" || this.hunter === null))
    {
        this.hunter.borders (-this.scenewidth/2,
                              this.scenewidth/2,
                              -this.scenewidth * this.canvas.height / this.canvas.width / 2,
                              this.scenewidth * this.canvas.height / this.canvas.width / 2);
    }
    
    //DRAW TARGET and GATHERER'S TARGET DETECTION DISTANCE
    if (!(typeof (this.target) === "undefined" || this.target === null))
    {
        if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null) && this.SHOWSEEKDISTANCE)
        {
            this.context.save();
            this.context.fillStyle = this.color_target;
            this.context.globalAlpha = 0.25;
            this.context.beginPath();
            this.context.arc (this.target.x, this.target.y, this.seekdistance, 0, 2*Math.PI)
            this.context.fill();
            this.context.restore();
        }
        
        SteeringAnimation.drawTarget (this.target, this.size, this.visualrepresentation_target, this.color_target, this.context);
    }
    
    //DRAW GATHERER and GATHERER'S HUNTER DETECTION DISTANCE
    if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null))
    {
        if (this.SHOWEVADEDISTANCE)
        {
            this.context.save();
            this.context.fillStyle = this.gatherer.color;
            this.context.globalAlpha = 0.25;
            this.context.beginPath();
            this.context.arc (this.gatherer.location.x, this.gatherer.location.y, this.evadedistance, 0, 2*Math.PI)
            this.context.fill();
            this.context.restore();
        }
        this.gatherer.display (this.context);
    }
    
    //DRAW HUNTER and HUNTER'S PREY DETECTION DISTANCE
    if (!(typeof (this.hunter) === "undefined" || this.hunter === null))
    {
        if (this.SHOWPURSUEDISTANCE)
        {
            this.context.save();
            this.context.fillStyle = this.hunter.color;
            this.context.globalAlpha = 0.25;
            this.context.beginPath();
            this.context.arc (this.hunter.location.x, this.hunter.location.y, this.pursuedistance, 0, 2*Math.PI)
            this.context.fill();
            this.context.restore();
        }
        this.hunter.display (this.context);
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
 * Draws a target.
 * @param {Vector} location location of the target
 * @param {number} radius radius of the target
 * @param {string,Image} visualrepresentation visual representation of the target
 * @param {string} color color of the target
 * @param {Object} context HTML5 Canvas's context to draw on
 */
SteeringAnimation.drawTarget = function (location, radius, visualrepresentation, color, context)
{
    context.save();
    context.fillStyle = color;
    
    if (typeof (visualrepresentation) == "string")
    {
        switch (visualrepresentation)
        {
            case "square":
                context.fillRect (location.x-radius, location.y-radius, 2*radius, 2*radius);
                break;
            case "circle":
                context.beginPath();
                context.arc (location.x, location.y, radius, 0, 2*Math.PI);
                context.closePath();
                context.fill();
                break;
            case "triangle":
                context.save();
                context.transform (1, 0, 0, 1, location.x, location.y);
                context.beginPath();
                context.moveTo (radius, 0);
                context.lineTo (-radius, -3*radius/5);
                context.lineTo (-radius, 3*radius/5);
                context.closePath();
                context.fill();
                context.restore();
                break;
            default:
                context.beginPath();
                context.arc (location.x, location.y, radius, 0, 2*Math.PI, false);
                context.closePath();
                context.fill();
        }
    }
    else if (visualrepresentation instanceof Image)
    {
        context.save();
        context.transform (1, 0, 0, 1, location.x, location.y);
        context.drawImage (visualrepresentation, -radius, -radius, 2*radius, 2*radius);
        context.restore();
    }
    else
    {
        context.beginPath();
        context.arc (location.x, location.y, radius, 0, 2*Math.PI);
        context.closePath();
        context.fill();
    }
    
    context.restore();
}

/**
 * Draws a grid on the context.
 * @param {Object} context HTML5 Canvas's context to draw on
 */
SteeringAnimation.drawGrid = function (context, scenewidth)
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
