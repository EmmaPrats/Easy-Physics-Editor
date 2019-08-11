/**
 * In order to manipulate settings, define an object:
 * eptfgSettingsFloating
 * eptfgSettingsFloating.grid - bool
 * eptfgSettingsFloating.scenescale - float
 * eptfgSettingsFloating.radius - float
 * eptfgSettingsFloating.gravity - float
 * eptfgSettingsFloating.mass - float
 * eptfgSettingsFloating.liquiddensity - float
 * eptfgSettingsFloating.visualrepresentation - string: "triangle", "circle", "square", "image"
 * eptfgSettingsFloating.imagesrc - string
 * eptfgSettingsFloating.oriented - bool
 */

"use strict";

var eptfg_canvas = document.getElementById("eptfg-canvas");
var eptfg_context = eptfg_canvas.getContext("2d");

//VARIABLES NECESSARY FOR THE LOOP

var eptfg_GRID;
var eptfg_scenescale;
var eptfg_waterline;

var eptfg_dt; // = 0.01; //Not dependent on user input.

var eptfg_gravity;
var eptfg_mass;
var eptfg_liquidDensity;

var eptfg_letters;
var eptfg_images;

var eptfg_quantity;
var eptfg_visualrepresentation;
var eptfg_text;
var eptfg_font;
var eptfg_image;
var eptfg_size;
var eptfg_color;

var eptfg_color_water;
var eptfg_water_opacity;

var eptfg_MUSTUPLOADIMAGE;

function initParams()
{
    eptfg_GRID = true;
    eptfg_scenescale = 5;
    eptfg_waterline = 0;
    
    eptfg_gravity = new Vector (0, 9.81);
    eptfg_mass = 500;
    eptfg_liquidDensity = 1000;
    
    eptfg_quantity = 1;
    eptfg_visualrepresentation = "text";
    eptfg_text = "TFG";
    eptfg_font = "Arial";
    eptfg_image = new Image();
    eptfg_image.src = "logo.png";
    eptfg_size = 1;
    eptfg_color = "#000000";
    
    eptfg_color_water = "#0000FF";
    eptfg_water_opacity = 0.7;
    
    eptfg_MUSTUPLOADIMAGE = false;
    
    if (typeof eptfgSettingsFloating !== "undefined")
    {
        alert ("grid = " + eptfgSettingsFloating.grid + "\n" +
               "scenescale = " + eptfgSettingsFloating.scenescale + "\n" +
               "radius = " + eptfgSettingsFloating.radius + "\n" +
               "gravity = " + eptfgSettingsFloating.gravity + "\n" +
               "mass = " + eptfgSettingsFloating.mass + "\n" +
               "liquid density = " + eptfgSettingsFloating.liquiddensity + "\n" +
               "visual representation = " + eptfgSettingsFloating.visualrepresentation + "\n"
        );
        eptfg_GRID = (eptfgSettingsFloating.grid !== "undefined") ? eptfgSettingsFloating.grid : eptfg_GRID;
        eptfg_scenescale = (eptfgSettingsFloating.scenescale !== "undefined") ? eptfgSettingsFloating.scenescale : eptfg_scenescale;
        eptfg_radius = (eptfgSettingsFloating.radius !== "undefined") ? eptfgSettingsFloating.radius : eptfg_radius;
        eptfg_gravity = (eptfgSettingsFloating.gravity !== "undefined") ? (eptfgSettingsFloating.gravity * 1.0) : eptfg_gravity;
        eptfg_mass = (eptfgSettingsFloating.mass !== "undefined") ? eptfgSettingsFloating.mass : eptfg_mass;
        eptfg_liquidDensity = (eptfgSettingsFloating.liquiddensity !== "undefined") ? eptfgSettingsFloating.liquiddensity : eptfg_liquidDensity;
        if (eptfgSettingsFloating.visualrepresentation == "image")
        {
            eptfg_visualrepresentation = new Image();
            eptfg_visualrepresentation.src = (/*TODO is the undefined question necessary if I'm checking for empty?*/eptfgSettingsFloating.imagesrc !== "undefined" && eptfgSettingsFloating.imagesrc != "") ? eptfgSettingsFloating.imagesrc : "logo.png"; //TODO
        }
        else
        {
            eptfg_visualrepresentation = (eptfgSettingsFloating.visualrepresentation !== "undefined") ? eptfgSettingsFloating.visualrepresentation : eptfg_visualrepresentation;
        }
        eptfg_oriented = (eptfgSettingsFloating.oriented !== "undefined") ? eptfgSettingsFloating.oriented : eptfg_oriented;
    }
}

initParams();

function eptfg_initFlotacion()
{
    eptfg_dt = 0.01;
    
    eptfg_letters = [];
    eptfg_images = [];
    
    if (eptfg_visualrepresentation == "text")
    {
        for (var i=0; i<eptfg_text.length; i++)
        {
            eptfg_letters.push (new RigidLetter (eptfg_text[i],
                                                 eptfg_font,
                                                 eptfg_mass,
                                                 eptfg_size,
                                                 new Vector (getRandomBetween(-0.8*eptfg_scenescale/2, 0.8*eptfg_scenescale/2), getRandomBetween(-0.8* eptfg_scenescale*eptfg_canvas.height/eptfg_canvas.width/2, 0.8* eptfg_scenescale*eptfg_canvas.height/eptfg_canvas.width/2)),
                                                 new Vector (getRandomBetween(-2, 2), getRandomBetween(-1.5, 1.5)),
                                                 new Vector())
                                );
            eptfg_letters[i].color = eptfg_color;
            eptfg_letters[i].angularVelocity = getRandomBetween (-1, 1);
        }
    }
    else if (eptfg_visualrepresentation == "image")
    {
        for (var i=0; i<eptfg_quantity; i++)
        {
            //TODO eptfg_image.push (new RigidImage ());
            eptfg_images.push (new RigidImage (eptfg_image,
                                               eptfg_mass,
                                               new Vector (eptfg_size, eptfg_size),
                                               new Vector (getRandomBetween(-2, 2), getRandomBetween(-1.5, 1.5)),
                                               new Vector (getRandomBetween(-2, 2), getRandomBetween(-1.5, 1.5)),
                                               new Vector())
                               );
            eptfg_images[i].angularVelocity = getRandomBetween (-1, 1);
        }
    }
}

function eptfg_animationLoop()
{
    eptfg_draw();
    
    window.requestAnimationFrame (eptfg_animationLoop);
}

function eptfg_draw()
{
    eptfg_context.clearRect (0, 0, eptfg_canvas.width, eptfg_canvas.height);
    
    if (eptfg_MUSTUPLOADIMAGE)
    {
        eptfg_context.save();
        
        eptfg_context.font = "20px Arial";
        eptfg_context.fillText ("Please upload an image", 10, 20);
        
        eptfg_context.restore();
    }
    
    eptfg_context.save();
    
    var zoom = eptfg_canvas.width / eptfg_scenescale;
    eptfg_context.setTransform (zoom, 0, 0, zoom, eptfg_canvas.width/2, eptfg_canvas.height/2);
    eptfg_context.lineWidth = 0.025;
    
    if (eptfg_GRID)
    {
        drawGrid();
    }
    
    if (eptfg_visualrepresentation == "text")
    {
        for (var i=0; i<eptfg_letters.length; i++)
        {
            eptfg_letters[i].applyAcceleration (eptfg_gravity);
            eptfg_letters[i].applyFlotationForces (eptfg_gravity, eptfg_liquidDensity, eptfg_waterline);
            
            eptfg_letters[i].update(eptfg_dt);
            
            eptfg_letters[i].display(eptfg_context);
        }
    }
    else if (eptfg_visualrepresentation == "image")
    {
        for (var i=0; i<eptfg_images.length; i++)
        {
            eptfg_images[i].applyAcceleration (eptfg_gravity);
            eptfg_images[i].applyFlotationForces (eptfg_gravity, eptfg_liquidDensity, eptfg_waterline);
            
            eptfg_images[i].update(eptfg_dt);
            
            eptfg_images[i].display(eptfg_context);
        }
    }
    eptfg_context.save();
    eptfg_context.globalAlpha = eptfg_water_opacity;
    
    eptfg_context.lineWidth = 0.025;
    eptfg_context.fillStyle = eptfg_color_water;
    //eptfg_context.fillRect (zoom * (-eptfg_canvas.width/2), eptfg_waterline, zoom * eptfg_canvas.width, eptfg_floor-eptfg_waterline);
    eptfg_context.fillRect (zoom * (-eptfg_canvas.width/2), eptfg_waterline, zoom * eptfg_canvas.width, eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2 - eptfg_waterline);
    eptfg_context.restore();
    
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

eptfg_initFlotacion();

eptfg_animationLoop();


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
    
    eptfg_context.restore();
}
