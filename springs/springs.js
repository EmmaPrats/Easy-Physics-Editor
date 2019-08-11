/**
 * In order to manipulate settings, define an object:
 * eptfgSettingsSprings
 * eptfgSettingsSprings.grid - bool
 * eptfgSettingsSprings.scenescale - float
 * eptfgSettingsSprings.mass - float
 * eptfgSettingsSprings.stiffness - float
 * eptfgSettingsSprings.damping - float
 * eptfgSettingsSprings.SHOWTEXT - bool
 * eptfgSettingsSprings.text - string
 * eptfgSettingsSprings.textlocationX - float
 * eptfgSettingsSprings.textlocationY - float
 * eptfgSettingsSprings.font - string
 * eptfgSettingsSprings.size - int
 * eptfgSettingsSprings.color - string
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

var eptfg_dt;// = 0.01; //Not dependent on user input.

var eptfg_mass;
var eptfg_stiffness;
var eptfg_damping;

var eptfg_SHOWTEXT;
var eptfg_text;
var eptfg_textlocation;

var eptfg_font;
var eptfg_size;
var eptfg_color;

var eptfg_springs;
var eptfg_letters;

var eptfg_POSITIONINGMODE;

var eptfg_mousePos;

var eptfg_letterlocations;

//Returns the absolute XY position of the object.
//Only works if no scroll. Does work if zoomed in.
function offset (el)
{
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

eptfg_canvas.addEventListener ("mousemove", function(e){
                               //eptfg_mousePos.x = event.offsetX;
                               //eptfg_mousePos.y = event.offsetY;
                               eptfg_mousePos.x = event.clientX - offset(eptfg_canvas).left;
                               eptfg_mousePos.y = event.clientY - offset(eptfg_canvas).top;
                               }
                              );

/**
 * Sets values to parameters that control the simulation.
 * If object eptfgSettingsSprings hasn't been defined, defaut values are set.
 * Must be called before initializing simulation.
 */
function initParams()
{
    eptfg_GRID = true;
    eptfg_scenescale = 11;
    
    eptfg_mass = 1;
    eptfg_stiffness = 150;
    eptfg_damping = 3;
    
    eptfg_SHOWTEXT = true;
    eptfg_text = "TFG";
    eptfg_textlocation = new Vector();
    
    eptfg_letterlocations = [];
    for (var i=0; i<eptfg_text.length; i++)
    {
        eptfg_letterlocations.push (new Vector (i * 0.5, 0));
    }
    
    eptfg_font = "Arial";
    eptfg_size = 1;
    eptfg_color = "#000000";
    
    eptfg_POSITIONINGMODE = false;
    
    if (typeof eptfgSettingsSprings !== "undefined")
    {
        eptfg_GRID = (eptfgSettingsSprings.grid !== "undefined") ? eptfgSettingsSprings.grid : eptfg_GRID;
        eptfg_scenescale = (eptfgSettingsSprings.scenescale !== undefined) ? eptfgSettingsSprings.scenescale : eptfg_scenescale;
        
        eptfg_mass = (eptfgSettingsSprings.mass !== "undefined") ? eptfgSettingsSprings.mass : eptfg_mass;
        eptfg_stiffness = (eptfgSettingsSprings.stiffness !== "undefined") ? eptfgSettingsSprings.stiffness : eptfg_stiffness;
        eptfg_damping = (eptfgSettingsSprings.damping !== "undefined") ? eptfgSettingsSprings.damping : eptfg_damping;
        eptfg_SHOWTEXT = (eptfgSettingsSprings.SHOWTEXT !== "undefined") ? eptfgSettingsSprings.SHOWTEXT : eptfg_SHOWTEXT;
        eptfg_text = (eptfgSettingsSprings.text !== "undefined") ? eptfgSettingsSprings.text : eptfg_text;
        eptfg_textlocation.x = (eptfgSettingsSprings.textlocationX !== "undefined") ? eptfgSettingsSprings.textlocationX : eptfg_textlocation.x;
        eptfg_textlocation.y = (eptfgSettingsSprings.textlocationY !== "undefined") ? eptfgSettingsSprings.textlocationY : eptfg_textlocation.y;
        eptfg_font = (eptfgSettingsSprings.font !== "undefined") ? eptfgSettingsSprings.font : eptfg_font;
        eptfg_size = (eptfgSettingsSprings.size !== "undefined") ? eptfgSettingsSprings.size : eptfg_size;
        eptfg_color = (eptfgSettingsSprings.color !== "undefined") ? eptfgSettingsSprings.color : eptfg_color;
    }
    
}

initParams();

/**
 * Sets dt.
 * Creates flock and fills it with boids.
 * Must be called before starting the loop.
 */
function eptfg_initSprings()
{
    eptfg_dt = 0.01;
    
    eptfg_springs = [];
    eptfg_letters = [];
    
    for (var i=0; i<eptfg_text.length; i++)
    {
        eptfg_letters.push (new Particle (new Character (eptfg_text[i], eptfg_font, eptfg_size, eptfg_color),
                                          eptfg_mass,
                                          eptfg_size,
                                          new Vector (eptfg_letterlocations[i].x, eptfg_letterlocations[i].y),
                                          new Vector(),
                                          new Vector(),
                                          false)
                            );
        eptfg_letters[i].color = eptfg_color;
        eptfg_letters[i].visualrepresentation.color = eptfg_color;
        
        eptfg_springs.push (new SimpleSpring (new Vector (eptfg_letterlocations[i].x, eptfg_letterlocations[i].y),
                                              eptfg_letters[i],
                                              0,
                                              eptfg_stiffness,
                                              eptfg_damping)
                            );
    }
    
    eptfg_mousePos = new Vector();
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
    
    var zoom = eptfg_canvas.width / eptfg_scenescale;
    eptfg_context.setTransform (zoom, 0, 0, zoom, eptfg_canvas.width/2, eptfg_canvas.height/2);
    
    if (eptfg_GRID)
    {
        drawGrid();
    }
    
    if (eptfg_SHOWTEXT)
    {
        eptfg_context.save();
        eptfg_context.font = eptfg_size + "px " + eptfg_font;
        eptfg_context.fillText (eptfg_text, eptfg_textlocation.x, eptfg_textlocation.y);
        eptfg_context.restore();
    }
    
    if (eptfg_POSITIONINGMODE)
    {
        for (var i=0; i<eptfg_letters.length; i++)
        {
            eptfg_letters[i].display (eptfg_context);
            eptfg_context.save();
            eptfg_context.fillStyle = "#000000";
            eptfg_context.globalAlpha = 0.7;
            eptfg_context.beginPath();
            eptfg_context.arc (eptfg_letters[i].location.x, eptfg_letters[i].location.y, 0.2*eptfg_letters[i].visualrepresentation.size, 0, 2*Math.PI);
            eptfg_context.closePath();
            eptfg_context.fill();
            eptfg_context.restore();
        }
        
        if (eptfg_SHOWTEXT)
        {
            eptfg_context.save();
            eptfg_context.fillStyle = "#000000";
            eptfg_context.globalAlpha = 0.7;
            eptfg_context.beginPath();
            eptfg_context.arc (eptfg_textlocation.x, eptfg_textlocation.y, 0.2*eptfg_size, 0, 2*Math.PI);
            eptfg_context.closePath();
            eptfg_context.fill();
            eptfg_context.restore();
        }
    }
    else
    {
        var mousePos = Vector.sub (eptfg_mousePos, new Vector (eptfg_canvas.width/2, eptfg_canvas.height/2));
        mousePos.div (zoom);
        
        for (var i=0; i<eptfg_springs.length; i++)
        {
            eptfg_springs[i].applySpringForcesToParticle2();
        }
        
        for (var i=0; i<eptfg_letters.length; i++)
        {
            if (Vector.dist (eptfg_letters[i].location, mousePos) < eptfg_size)
            {
                var direction = Vector.sub (eptfg_letters[i].location, mousePos);
                direction.normalize();
                direction.mult (100 * eptfg_letters[i].radius);
                eptfg_letters[i].applyForce (direction);
            }
            
            eptfg_letters[i].update (eptfg_dt);
            eptfg_letters[i].display (eptfg_context);
        }
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

eptfg_initSprings();

eptfg_animationLoop();

/**
 * Draws a grid on the canvas.
 */
function drawGrid()
{
    eptfg_context.save();
    
    eptfg_context.lineWidth = 0.025;
    
    eptfg_context.beginPath();
    eptfg_context.moveTo(-10, 0);
    eptfg_context.lineTo(10, 0);
    eptfg_context.stroke();
    
    eptfg_context.beginPath();
    eptfg_context.moveTo(0, -10);
    eptfg_context.lineTo(0, 10);
    eptfg_context.stroke();
    
    
    
    eptfg_context.beginPath();
    eptfg_context.moveTo(-0.25, -10);
    eptfg_context.lineTo(0.25, -10);
    eptfg_context.moveTo(-0.25, -9);
    eptfg_context.lineTo(0.25, -9);
    eptfg_context.moveTo(-0.25, -8);
    eptfg_context.lineTo(0.25, -8);
    eptfg_context.moveTo(-0.25, -7);
    eptfg_context.lineTo(0.25, -7);
    eptfg_context.moveTo(-0.25, -6);
    eptfg_context.lineTo(0.25, -6);
    eptfg_context.moveTo(-0.25, -5);
    eptfg_context.lineTo(0.25, -5);
    eptfg_context.moveTo(-0.25, -4);
    eptfg_context.lineTo(0.25, -4);
    eptfg_context.moveTo(-0.25, -3);
    eptfg_context.lineTo(0.25, -3);
    eptfg_context.moveTo(-0.25, -2);
    eptfg_context.lineTo(0.25, -2);
    eptfg_context.moveTo(-0.25, -1);
    eptfg_context.lineTo(0.25, -1);
    eptfg_context.moveTo(-0.25, 1);
    eptfg_context.lineTo(0.25, 1);
    eptfg_context.moveTo(-0.25, 2);
    eptfg_context.lineTo(0.25, 2);
    eptfg_context.moveTo(-0.25, 3);
    eptfg_context.lineTo(0.25, 3);
    eptfg_context.moveTo(-0.25, 4);
    eptfg_context.lineTo(0.25, 4);
    eptfg_context.moveTo(-0.25, 5);
    eptfg_context.lineTo(0.25, 5);
    eptfg_context.moveTo(-0.25, 6);
    eptfg_context.lineTo(0.25, 6);
    eptfg_context.moveTo(-0.25, 7);
    eptfg_context.lineTo(0.25, 7);
    eptfg_context.moveTo(-0.25, 8);
    eptfg_context.lineTo(0.25, 8);
    eptfg_context.moveTo(-0.25, 9);
    eptfg_context.lineTo(0.25, 9);
    eptfg_context.moveTo(-0.25, 10);
    eptfg_context.lineTo(0.25, 10);
    eptfg_context.stroke();
    
    eptfg_context.beginPath();
    eptfg_context.moveTo(-10, -0.25);
    eptfg_context.lineTo(-10, 0.25);
    eptfg_context.moveTo(-9, -0.25);
    eptfg_context.lineTo(-9, 0.25);
    eptfg_context.moveTo(-8, -0.25);
    eptfg_context.lineTo(-8, 0.25);
    eptfg_context.moveTo(-7, -0.25);
    eptfg_context.lineTo(-7, 0.25);
    eptfg_context.moveTo(-6, -0.25);
    eptfg_context.lineTo(-6, 0.25);
    eptfg_context.moveTo(-5, -0.25);
    eptfg_context.lineTo(-5, 0.25);
    eptfg_context.moveTo(-4, -0.25);
    eptfg_context.lineTo(-4, 0.25);
    eptfg_context.moveTo(-3, -0.25);
    eptfg_context.lineTo(-3, 0.25);
    eptfg_context.moveTo(-2, -0.25);
    eptfg_context.lineTo(-2, 0.25);
    eptfg_context.moveTo(-1, -0.25);
    eptfg_context.lineTo(-1, 0.25);
    eptfg_context.moveTo(1, -0.25);
    eptfg_context.lineTo(1, 0.25);
    eptfg_context.moveTo(2, -0.25);
    eptfg_context.lineTo(2, 0.25);
    eptfg_context.moveTo(3, -0.25);
    eptfg_context.lineTo(3, 0.25);
    eptfg_context.moveTo(4, -0.25);
    eptfg_context.lineTo(4, 0.25);
    eptfg_context.moveTo(5, -0.25);
    eptfg_context.lineTo(5, 0.25);
    eptfg_context.moveTo(6, -0.25);
    eptfg_context.lineTo(6, 0.25);
    eptfg_context.moveTo(7, -0.25);
    eptfg_context.lineTo(7, 0.25);
    eptfg_context.moveTo(8, -0.25);
    eptfg_context.lineTo(8, 0.25);
    eptfg_context.moveTo(9, -0.25);
    eptfg_context.lineTo(9, 0.25);
    eptfg_context.moveTo(10, -0.25);
    eptfg_context.lineTo(10, 0.25);
    eptfg_context.stroke();
    
    eptfg_context.beginPath();
    eptfg_context.moveTo(-0.9, -0.1);
    eptfg_context.lineTo(-0.9, 0.1);
    eptfg_context.moveTo(-0.8, -0.1);
    eptfg_context.lineTo(-0.8, 0.1);
    eptfg_context.moveTo(-0.7, -0.1);
    eptfg_context.lineTo(-0.7, 0.1);
    eptfg_context.moveTo(-0.6, -0.1);
    eptfg_context.lineTo(-0.6, 0.1);
    eptfg_context.moveTo(-0.5, -0.1);
    eptfg_context.lineTo(-0.5, 0.1);
    eptfg_context.moveTo(-0.4, -0.1);
    eptfg_context.lineTo(-0.4, 0.1);
    eptfg_context.moveTo(-0.3, -0.1);
    eptfg_context.lineTo(-0.3, 0.1);
    eptfg_context.moveTo(-0.2, -0.1);
    eptfg_context.lineTo(-0.2, 0.1);
    eptfg_context.moveTo(-0.1, -0.1);
    eptfg_context.lineTo(-0.1, 0.1);
    eptfg_context.moveTo(0.1, -0.1);
    eptfg_context.lineTo(0.1, 0.1);
    eptfg_context.moveTo(0.2, -0.1);
    eptfg_context.lineTo(0.2, 0.1);
    eptfg_context.moveTo(0.3, -0.1);
    eptfg_context.lineTo(0.3, 0.1);
    eptfg_context.moveTo(0.4, -0.1);
    eptfg_context.lineTo(0.4, 0.1);
    eptfg_context.moveTo(0.5, -0.1);
    eptfg_context.lineTo(0.5, 0.1);
    eptfg_context.moveTo(0.6, -0.1);
    eptfg_context.lineTo(0.6, 0.1);
    eptfg_context.moveTo(0.7, -0.1);
    eptfg_context.lineTo(0.7, 0.1);
    eptfg_context.moveTo(0.8, -0.1);
    eptfg_context.lineTo(0.8, 0.1);
    eptfg_context.moveTo(0.9, -0.1);
    eptfg_context.lineTo(0.9, 0.1);
    eptfg_context.lineWidth = 0.01;
    eptfg_context.stroke();
    
    eptfg_context.lineWidth = 0.025;
    eptfg_context.beginPath();
    eptfg_context.moveTo(0, 5);
    eptfg_context.lineTo(10, 5);
    eptfg_context.stroke();
    
    eptfg_context.restore();
}
