/**
 * In order to manipulate settings, define an object:
 * eptfgSettingsFlocking
 * eptfgSettingsFlocking.grid - bool
 * eptfgSettingsFlocking.scenescale - float
 * eptfgSettingsFlocking.radius - float
 * eptfgSettingsFlocking.quantity - int
 * eptfgSettingsFlocking.separationweight - float
 * eptfgSettingsFlocking.alignmentweight - float
 * eptfgSettingsFlocking.cohesionweight - float
 * eptfgSettingsFlocking.visualrepresentation - string: "triangle", "circle", "square", "image"
 * eptfgSettingsFlocking.imagesrc - string
 * eptfgSettingsFlocking.oriented - bool
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

var eptfg_flock;
var eptfg_quantity;
var eptfg_separationweight;
var eptfg_alignmentweight;
var eptfg_cohesionweight;

var eptfg_visualrepresentation;
var eptfg_oriented;
var eptfg_color;

/**
 * Sets values to parameters that control the simulation.
 * If object eptfgSettingsFlocking hasn't been defined, defaut values are set.
 * Must be called before initializing simulation.
 */
function initParams()
{
    eptfg_GRID = true;
    eptfg_scenescale = 100;
    
    eptfg_radius = 5.0;
    
    eptfg_quantity = 200;
    
    eptfg_separationweight = 1.5;
    eptfg_alignmentweight = 1.0;
    eptfg_cohesionweight = 1.0;
    
    eptfg_visualrepresentation = "triangle";/*new Image(); //TODO no funciona la imatge
eptfg_visualrepresentation.src = "logo.png";*/
    eptfg_oriented = true;
    
    eptfg_color = "#000000";
    
    if (typeof eptfgSettingsFlocking !== "undefined")
    {
        eptfg_GRID = (eptfgSettingsFlocking.grid !== "undefined") ? eptfgSettingsFlocking.grid : eptfg_GRID;
        eptfg_scenescale = (eptfgSettingsFlocking.scenescale !== undefined) ? eptfgSettingsFlocking.scenescale : eptfg_scenescale;
        eptfg_radius = (eptfgSettingsFlocking.radius !== "undefined") ? eptfgSettingsFlocking.radius : eptfg_radius;
        eptfg_quantity = (eptfgSettingsFlocking.quantity !== "undefined") ? eptfgSettingsFlocking.quantity : eptfg_quantity;
        eptfg_separationweight = (eptfgSettingsFlocking.separationweight !== "undefined") ? eptfgSettingsFlocking.separationweight : eptfg_separationweight;
        eptfg_alignmentweight = (eptfgSettingsFlocking.alignmentweight !== "undefined") ? eptfgSettingsFlocking.alignmentweight : eptfg_alignmentweight;
        eptfg_cohesionweight = (eptfgSettingsFlocking.cohesionweight !== "undefined") ? eptfgSettingsFlocking.cohesionweight : eptfg_cohesionweight;
        if (eptfgSettingsFlocking.visualrepresentation == "image")
        {
            eptfg_visualrepresentation = new Image();
            eptfg_visualrepresentation.src = (/*TODO is the undefined question necessary if I'm checking for empty?*/eptfgSettingsFlocking.imagesrc !== undefined && eptfgSettingsFlocking.imagesrc != "") ? eptfgSettingsFlocking.imagesrc : "logo.png"; //TODO
        }
        else
        {
            eptfg_visualrepresentation = (eptfgSettingsFlocking.visualrepresentation !== undefined) ? eptfgSettingsFlocking.visualrepresentation : eptfg_visualrepresentation;
        }
        eptfg_oriented = (eptfgSettingsFlocking.oriented !== undefined) ? eptfgSettingsFlocking.oriented : eptfg_oriented;
    }
    
}

initParams();

/**
 * Sets dt.
 * Creates flock and fills it with boids.
 * Must be called before starting the loop.
 */
function eptfg_initFlocking()
{
    eptfg_dt = 1.0;
    eptfg_flock = new Flock (eptfg_radius * Flock.desiredseparationtoradiusratio,
                         eptfg_radius * Flock.neighbourdistancetoradiusratio,
                         eptfg_separationweight,
                         eptfg_alignmentweight,
                         eptfg_cohesionweight);
    for (var i=0; i<eptfg_quantity; i++)
    {
        var angle = getRandomBetween (0, 2 * Math.PI);
        eptfg_flock.addBoid (new Boid (eptfg_visualrepresentation,
                                       eptfg_radius,
                                       new Vector (0, 0),
                                       new Vector (Math.cos(angle), Math.sin(angle)),
                                       new Vector(),
                                       2,
                                       0.03,
                                       eptfg_oriented));
        eptfg_flock.boids[i].color = eptfg_color;
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
    if (eptfg_GRID)
    {
        drawGrid();
    }
    
    var scenescale = eptfg_scenescale / 100;
    var moveX = (eptfg_canvas.width * scenescale - eptfg_canvas.width) / 2;
    eptfg_context.save();
    eptfg_context.setTransform (1/scenescale, 0, 0, 1/scenescale, eptfg_canvas.width/2, eptfg_canvas.height/2);
    eptfg_flock.run (
        eptfg_dt,
        scenescale * (-eptfg_canvas.width/2),
        scenescale * (eptfg_canvas.width/2),
        scenescale * (-eptfg_canvas.height/2),
        scenescale * (eptfg_canvas.height/2)
    );
    eptfg_flock.display (eptfg_context);
    eptfg_context.restore();
}

eptfg_initFlocking();

eptfg_animationLoop();

/**
 * Draws a grid on the canvas.
 */
function drawGrid()
{
    eptfg_context.lineWidth = 0.5;
            eptfg_context.save();
            eptfg_context.setTransform (1, 0, 0, 1, eptfg_canvas.width/2, eptfg_canvas.height/2);
            
            eptfg_context.beginPath();
            eptfg_context.moveTo (-10, 0);
            eptfg_context.lineTo (10, 0);
            eptfg_context.stroke();
            eptfg_context.moveTo (0, -10);
            eptfg_context.lineTo (0, 10);
            eptfg_context.stroke();
            
            for (var i=-eptfg_canvas.width/2; i<eptfg_canvas.width/2; i+=10)
            {
                eptfg_context.beginPath();
                eptfg_context.moveTo(i, -eptfg_canvas.height/2);
                eptfg_context.lineTo(i, eptfg_canvas.height/2);
                eptfg_context.stroke();
            }
            
            eptfg_context.lineWidth = 1;
            for (var i=-eptfg_canvas.width/2; i<eptfg_canvas.width/2; i+=100)
            {
                eptfg_context.beginPath();
                eptfg_context.moveTo(i, -eptfg_canvas.height/2);
                eptfg_context.lineTo(i, eptfg_canvas.height/2);
                eptfg_context.stroke();
            }
            
            eptfg_context.lineWidth = 0.5;
            
            for (var i=-eptfg_canvas.height/2; i<eptfg_canvas.height/2; i+=10)
            {
                eptfg_context.beginPath();
                eptfg_context.moveTo(-eptfg_canvas.width/2, i);
                eptfg_context.lineTo(eptfg_canvas.width/2, i);
                eptfg_context.stroke();
            }
            
            eptfg_context.lineWidth = 1;
            for (var i=-eptfg_canvas.height/2; i<eptfg_canvas.height/2; i+=100)
            {
                eptfg_context.beginPath();
                eptfg_context.moveTo(-eptfg_canvas.width/2, i);
                eptfg_context.lineTo(eptfg_canvas.width/2, i);
                eptfg_context.stroke();
            }
    
    eptfg_context.restore();
}
