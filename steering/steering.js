/**
 * In order to manipulate settings, define an object:
 * eptfgSettingsHunterGather
 * eptfgSettingsHunterGather.grid - bool
 * eptfgSettingsHunterGather.scenescale - float
 * eptfgSettingsHunterGather.radius - float
 * eptfgSettingsHunterGather.gatherdistance - float
 * eptfgSettingsHunterGather.evadedistance - float
 * eptfgSettingsHunterGather.huntdistance - float
 * eptfgSettingsHunterGather.seekweight - float
 * eptfgSettingsHunterGather.evadeweight - float
 * eptfgSettingsHunterGather.pursueweight - float
 * eptfgSettingsHunterGather.visualrepresentation - string: "triangle", "circle", "square", "image"
 * eptfgSettingsHunterGather.imagesrc - string
 * eptfgSettingsHunterGather.oriented - bool
 */

"use strict";

if (typeof eptfg_canvas === "undefined")
{
    window.eptfg_canvas = document.getElementById("eptfg-canvas");
}
if (typeof eptfg_context === "undefined")
{
    window.eptfg_context = eptfg_canvas.getContext("2d");
}

//VARIABLES NECESSARY FOR THE LOOP
//Set in initParams() by user or default values.

var eptfg_GRID;
var eptfg_scenescale;

var eptfg_dt;// = 1.0; //Not dependent on user input.
var eptfg_radius;

var eptfg_hunter;
var eptfg_gatherer;
var eptfg_target;

var eptfg_fleeweight;

var eptfg_gatherdistance;
var eptfg_evadedistance;
var eptfg_huntdistance;

var eptfg_seekweight;
var eptfg_evadeweight;
var eptfg_pursueweight;

var eptfg_SHOW_GATHERDISTANCE;
var eptfg_SHOW_EVADEDISTANCE;
var eptfg_SHOW_HUNTDISTANCE;

var eptfg_visualrepresentation_hunter;
var eptfg_visualrepresentation_gatherer;
var eptfg_visualrepresentation_target;
var eptfg_oriented_hunter;
var eptfg_oriented_gatherer;
var eptfg_color_hunter;
var eptfg_color_gatherer;
var eptfg_color_target;

var eptfg_EXISTS_hunter;
var eptfg_EXISTS_gatherer;
var eptfg_EXISTS_target;

/**
 * Sets values to parameters that control the simulation.
 * If object eptfgSettingsHunterGather hasn't been defined, defaut values are set.
 * Must be called before initializing simulation.
 */
function initParams()
{
    eptfg_GRID = true;
    eptfg_scenescale = 400;
    
    eptfg_radius = 5.0;
    
    eptfg_fleeweight = 1.0;
    
    eptfg_gatherdistance = 50;
    eptfg_evadedistance = 50;
    eptfg_huntdistance = 50;
    
    eptfg_seekweight = 1.0;
    eptfg_evadeweight = 1.0;
    eptfg_pursueweight = 1.0;
    
    eptfg_SHOW_GATHERDISTANCE = false;
    eptfg_SHOW_EVADEDISTANCE = false;
    eptfg_SHOW_HUNTDISTANCE = false;
    
    eptfg_visualrepresentation_hunter = "triangle";
    eptfg_visualrepresentation_gatherer = "circle";
    eptfg_visualrepresentation_target = "square";
    eptfg_oriented_hunter = true;
    eptfg_oriented_gatherer = true;
    
    eptfg_color_hunter = "#000000";
    eptfg_color_gatherer = "#000000";
    eptfg_color_target = "#000000";
    
    eptfg_EXISTS_hunter = true;
    eptfg_EXISTS_gatherer = true;
    eptfg_EXISTS_target = true;
    
    if (typeof eptfgSettingsHunterGather !== "undefined")
    {
        eptfg_GRID = (eptfgSettingsHunterGather.grid !== "undefined") ? eptfgSettingsHunterGather.grid : eptfg_GRID;
        eptfg_scenescale = (eptfgSettingsHunterGather.scenescale !== undefined) ? eptfgSettingsHunterGather.scenescale : eptfg_scenescale;
        eptfg_radius = (eptfgSettingsHunterGather.radius !== "undefined") ? eptfgSettingsHunterGather.radius : eptfg_radius;
        eptfg_gatherdistance = (eptfgSettingsHunterGather.gatherdistance !== "undefined") ? eptfgSettingsHunterGather.gatherdistance : eptfg_gatherdistance;
        eptfg_evadedistance = (eptfgSettingsHunterGather.evadedistance !== "undefined") ? eptfgSettingsHunterGather.evadedistance : eptfg_evadedistance;
        eptfg_huntdistance = (eptfgSettingsHunterGather.huntdistance !== "undefined") ? eptfgSettingsHunterGather.huntdistance : eptfg_huntdistance;
        eptfg_seekweight = (eptfgSettingsHunterGather.seekweight !== "undefined") ? eptfgSettingsHunterGather.seekweight : eptfg_seekweight;
        eptfg_evadeweight = (eptfgSettingsHunterGather.evadeweight !== "undefined") ? eptfgSettingsHunterGather.evadeweight : eptfg_evadeweight;
        eptfg_pursueweight = (eptfgSettingsHunterGather.pursueweight !== "undefined") ? eptfgSettingsHunterGather.pursueweight : eptfg_pursueweight;
        /*TODOif (eptfgSettingsHunterGather.visualrepresentation == "image")
        {
            eptfg_visualrepresentation = new Image();
            eptfg_visualrepresentation.src = (/*TODO is the undefined question necessary if I'm checking for empty?*//*eptfgSettingsHunterGather.imagesrc !== undefined && eptfgSettingsHunterGather.imagesrc != "") ? eptfgSettingsHunterGather.imagesrc : "logo.png"; //TODO
        }
        else
        {
            eptfg_visualrepresentation = (eptfgSettingsHunterGather.visualrepresentation !== undefined) ? eptfgSettingsHunterGather.visualrepresentation : eptfg_visualrepresentation;
        }
        eptfg_oriented = (eptfgSettingsHunterGather.oriented !== undefined) ? eptfgSettingsHunterGather.oriented : eptfg_oriented;*/
    }
    
}

initParams();

/**
 * Sets dt.
 * Creates flock and fills it with boids.
 * Must be called before starting the loop.
 */
function eptfg_initHunterAndGatherer()
{
    eptfg_dt = 1.0;
    
    var worldHeight = eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width;
    
    if (eptfg_EXISTS_hunter)
    {
        eptfg_hunter   = new Boid (eptfg_visualrepresentation_hunter,
                                   eptfg_radius,
                                   new Vector (getRandomBetween(-eptfg_scenescale/2, eptfg_scenescale/2), getRandomBetween(-worldHeight/2, worldHeight/2)),
                                   new Vector(),
                                   new Vector(),
                                   2,
                                   0.03,
                                   eptfg_oriented_hunter);
        eptfg_hunter.color = eptfg_color_hunter;
    }
    else
    {
        eptfg_hunter = null;
    }
    
    if (eptfg_EXISTS_gatherer)
    {
        eptfg_gatherer = new Boid (eptfg_visualrepresentation_gatherer,
                                   eptfg_radius,
                                   new Vector (getRandomBetween(-eptfg_scenescale/2, eptfg_scenescale/2), getRandomBetween(-worldHeight/2, worldHeight/2)),
                                   new Vector(),
                                   new Vector(),
                                   2,
                                   0.03,
                                   eptfg_oriented_gatherer);
        eptfg_gatherer.color = eptfg_color_gatherer;
    }
    else
    {
        eptfg_gatherer = null;
    }
    
    if (eptfg_EXISTS_target)
    {
        eptfg_target = new Vector (getRandomBetween(-eptfg_scenescale/2, eptfg_scenescale/2), getRandomBetween(-worldHeight/2, worldHeight/2));
    }
    else
    {
        eptfg_target = null;
    }
}

/**
 * Animation loop.
 */
function eptfg_animationLoop()
{
    eptfg_draw();
    
    window.requestAnimationFrame (eptfg_animationLoop);
}

/**
 * Gets called in each frame.
 * 1. Clears the canvas.
 * 2. Draws grid.
 * 3. Asks flock to run simulation (compute forces, update positions, etc.).
 * 4. Asks flock to draw its boids.
 */
function eptfg_draw()
{
    eptfg_context.clearRect (0, 0, eptfg_canvas.width, eptfg_canvas.height);
    
    eptfg_context.save();
    
    /*
    var scenescale = eptfg_scenescale / 100;
    eptfg_context.setTransform (1/scenescale, 0, 0, 1/scenescale, eptfg_canvas.width/2, eptfg_canvas.height/2);
    */
    
    var scenescale = eptfg_scenescale / 100;
    var zoom = eptfg_canvas.width / eptfg_scenescale;
    eptfg_context.setTransform (zoom, 0, 0, zoom, eptfg_canvas.width/2, eptfg_canvas.height/2);
    
    if (eptfg_GRID)
    {
        drawGrid();
    }
    
    //GATHERER
    if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null))
    {
        var targetDoesntExistOrIsFar = true;
        var hunterDoesntExistOrIsFar = true;
        
        if (!(typeof (eptfg_target) === "undefined" || eptfg_target === null))
        {
            if (Vector.dist (eptfg_gatherer.location, eptfg_target) <= eptfg_gatherdistance)
            {
                targetDoesntExistOrIsFar = false;
                
                var seek = eptfg_gatherer.seekIfNear (eptfg_target, eptfg_gatherdistance); //Seek
                seek.mult (eptfg_seekweight);
                eptfg_gatherer.applyForce (seek);
            }
        }
        if (!(typeof (eptfg_hunter) === "undefined" || eptfg_hunter === null))
        {
            if (Vector.dist (eptfg_gatherer.location, eptfg_hunter.location) <= eptfg_evadedistance)
            {
                hunterDoesntExistOrIsFar = false;
                
                var evade = eptfg_gatherer.evadeIfNear (eptfg_hunter, eptfg_evadedistance, eptfg_dt); //Evade
                evade.mult (eptfg_evadeweight);
                eptfg_gatherer.applyForce (evade);
            }
        }
        if (targetDoesntExistOrIsFar && hunterDoesntExistOrIsFar)
        {
            var wander = eptfg_gatherer.wander();
            eptfg_gatherer.applyForce (wander);
        }
    }
    
    //HUNTER
    if (!(typeof (eptfg_hunter) === "undefined" || eptfg_hunter === null))
    {
        var gathererDoesntExistOrIsFar = true;
        
        if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null))
        {
            if (Vector.dist (eptfg_hunter.location, eptfg_gatherer.location) <= eptfg_huntdistance)
            {
                gathererDoesntExistOrIsFar = false;
                
                var pursue = eptfg_hunter.pursueIfNear (eptfg_gatherer, eptfg_huntdistance, eptfg_dt); //Pursue
                pursue.mult (eptfg_pursueweight);
                eptfg_hunter.applyForce (pursue);
            }
        }
        if (gathererDoesntExistOrIsFar)
        {
            var wander = eptfg_hunter.wander();
            eptfg_hunter.applyForce (wander);
        }
    }
    
    if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null)) eptfg_gatherer.update (eptfg_dt);
    if (!(typeof (eptfg_hunter) === "undefined" || eptfg_hunter === null)) eptfg_hunter.update (eptfg_dt);
    
    if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null) &&
        !(typeof (eptfg_target) === "undefined" || eptfg_target === null) &&
        Vector.dist (eptfg_gatherer.location, eptfg_target) < eptfg_gatherer.radius * 2)
    {
        eptfg_target.x = getRandomBetween (-eptfg_scenescale/2, eptfg_scenescale/2);
        eptfg_target.y = getRandomBetween (-eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2, eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2);
    }
    
    if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null))
    {
        eptfg_gatherer.borders (-eptfg_scenescale/2,
                                eptfg_scenescale/2,
                                -eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2,
                                eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2);
    }
    if (!(typeof (eptfg_hunter) === "undefined" || eptfg_hunter === null))
    {
        eptfg_hunter.borders (-eptfg_scenescale/2,
                              eptfg_scenescale/2,
                              -eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2,
                              eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2);
    }
    /*
    eptfg_context.beginPath();
    eptfg_context.arc (eptfg_target.x, eptfg_target.y, eptfg_radius, 0, 2*Math.PI);
    eptfg_context.fill();
     */
    
    
    if (!(typeof (eptfg_target) === "undefined" || eptfg_target === null))
    {
        if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null) && eptfg_SHOW_GATHERDISTANCE)
        {
            eptfg_context.save();
            eptfg_context.fillStyle = eptfg_color_target;
            eptfg_context.globalAlpha = 0.25;
            eptfg_context.beginPath();
            eptfg_context.arc (eptfg_target.x, eptfg_target.y, eptfg_gatherdistance, 0, 2*Math.PI)
            eptfg_context.fill();
            eptfg_context.restore();
        }
        
        drawTarget (eptfg_target, eptfg_radius, eptfg_visualrepresentation_target, eptfg_color_target, eptfg_context);
    }
    
    if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null))
    {
        if (eptfg_SHOW_EVADEDISTANCE)
        {
            eptfg_context.save();
            eptfg_context.fillStyle = eptfg_gatherer.color;
            eptfg_context.globalAlpha = 0.25;
            eptfg_context.beginPath();
            eptfg_context.arc (eptfg_gatherer.location.x, eptfg_gatherer.location.y, eptfg_evadedistance, 0, 2*Math.PI)
            eptfg_context.fill();
            eptfg_context.restore();
        }
        eptfg_gatherer.display (eptfg_context);
    }
    if (!(typeof (eptfg_hunter) === "undefined" || eptfg_hunter === null))
    {
        if (eptfg_SHOW_HUNTDISTANCE)
        {
            eptfg_context.save();
            eptfg_context.fillStyle = eptfg_hunter.color;
            eptfg_context.globalAlpha = 0.25;
            eptfg_context.beginPath();
            eptfg_context.arc (eptfg_hunter.location.x, eptfg_hunter.location.y, eptfg_huntdistance, 0, 2*Math.PI)
            eptfg_context.fill();
            eptfg_context.restore();
        }
        eptfg_hunter.display (eptfg_context);
    }
    
    eptfg_context.restore();
    
    
    //canvas corner
    eptfg_context.save();
    eptfg_context.globalAlpha = 1;
    eptfg_context.strokeStyle = "#000000";
    eptfg_context.lineWidth = 2;
    eptfg_context.beginPath();
    eptfg_context.moveTo (eptfg_canvas.width-15, eptfg_canvas.height-3);
    eptfg_context.lineTo (eptfg_canvas.width-3, eptfg_canvas.height-3);
    eptfg_context.lineTo (eptfg_canvas.width-3, eptfg_canvas.height-15);
    eptfg_context.moveTo (eptfg_canvas.width-15, eptfg_canvas.height-8);
    eptfg_context.lineTo (eptfg_canvas.width-8, eptfg_canvas.height-8);
    eptfg_context.lineTo (eptfg_canvas.width-8, eptfg_canvas.height-15);
    eptfg_context.stroke();
    eptfg_context.restore();
}

eptfg_initHunterAndGatherer();

eptfg_animationLoop();

function drawTarget (location, radius, visualrepresentation, color, context)
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
    //else if (typeof (visualrepresentation) == Image.typeof) //TODO no sé si açò funciona
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
 * Draws a grid on the canvas.
 */
function drawGrid()
{
    eptfg_context.save();
    
    eptfg_context.lineWidth = 1;
    eptfg_context.strokeStyle = "#000000";
    eptfg_context.beginPath();
    eptfg_context.moveTo (-eptfg_scenescale/2, 0);
    eptfg_context.lineTo (eptfg_scenescale/2, 0);
    eptfg_context.stroke();
    eptfg_context.beginPath();
    eptfg_context.moveTo (0, -eptfg_scenescale/2);
    eptfg_context.lineTo (0, eptfg_scenescale/2);
    eptfg_context.stroke();
    
    eptfg_context.strokeStyle = "#444444";
    eptfg_context.lineWidth = 0.6;
    for (var i=100; i<eptfg_scenescale/2; i+=100)
    {
        eptfg_context.beginPath();
        eptfg_context.moveTo (i, -eptfg_scenescale/2);
        eptfg_context.lineTo (i, eptfg_scenescale/2);
        eptfg_context.stroke();
    }
    for (var i=-100; i>-eptfg_scenescale/2; i-=100)
    {
        eptfg_context.beginPath();
        eptfg_context.moveTo (i, -eptfg_scenescale/2);
        eptfg_context.lineTo (i, eptfg_scenescale/2);
        eptfg_context.stroke();
    }
    for (var i=100; i<eptfg_scenescale/2; i+=100)
    {
        eptfg_context.beginPath();
        eptfg_context.moveTo (-eptfg_scenescale/2, i);
        eptfg_context.lineTo (eptfg_scenescale/2, i);
        eptfg_context.stroke();
    }
    for (var i=-100; i>-eptfg_scenescale/2; i-=100)
    {
        eptfg_context.beginPath();
        eptfg_context.moveTo (-eptfg_scenescale/2, i);
        eptfg_context.lineTo (eptfg_scenescale/2, i);
        eptfg_context.stroke();
    }
    
    eptfg_context.strokeStyle = "#AAAAAA";
    eptfg_context.lineWidth = 0.05;
    for (var i=10; i<eptfg_scenescale/2; i+=10)
    {
        eptfg_context.beginPath();
        eptfg_context.moveTo (i, -eptfg_scenescale/2);
        eptfg_context.lineTo (i, eptfg_scenescale/2);
        eptfg_context.stroke();
    }
    for (var i=-10; i>-eptfg_scenescale/2; i-=10)
    {
        eptfg_context.beginPath();
        eptfg_context.moveTo (i, -eptfg_scenescale/2);
        eptfg_context.lineTo (i, eptfg_scenescale/2);
        eptfg_context.stroke();
    }
    for (var i=10; i<eptfg_scenescale/2; i+=10)
    {
        eptfg_context.beginPath();
        eptfg_context.moveTo (-eptfg_scenescale/2, i);
        eptfg_context.lineTo (eptfg_scenescale/2, i);
        eptfg_context.stroke();
    }
    for (var i=-10; i>-eptfg_scenescale/2; i-=10)
    {
        eptfg_context.beginPath();
        eptfg_context.moveTo (-eptfg_scenescale/2, i);
        eptfg_context.lineTo (eptfg_scenescale/2, i);
        eptfg_context.stroke();
    }
    
    eptfg_context.restore();
}
