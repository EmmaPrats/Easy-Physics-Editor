"use strict";

if (typeof eptfg_canvas === "undefined")
{
    window.eptfg_canvas = document.getElementById("eptfg-canvas");
}
if (typeof eptfg_context === "undefined")
{
    window.eptfg_context = eptfg_canvas.getContext("2d");
}

//a reference to each item in the form //TODO borrar els que no utilitze
var eptfg_flex_container = document.getElementById("eptfg-flex-container");

var eptfg_form_grid = document.getElementById("grid");
var eptfg_form_ratio_16_9 = document.getElementById("ratio-16-9");
var eptfg_form_ratio_4_3 = document.getElementById("ratio-4-3");
var eptfg_form_ratio_1_1 = document.getElementById("ratio-1-1");
var eptfg_form_ratio_3_4 = document.getElementById("ratio-3-4");
var eptfg_form_ratio_9_16 = document.getElementById("ratio-9-16");
var eptfg_form_lock_canvas_width = document.getElementById("lock-canvas-width");
var eptfg_canvas_width = document.getElementById("canvas-width");
var eptfg_form_lock_canvas_height = document.getElementById("lock-canvas-height");
var eptfg_canvas_height = document.getElementById("canvas-height");

var eptfg_form_scene_scale = document.getElementById("scene-scale");
var eptfg_form_zoomlabel = document.getElementById("zoomlabel");

var eptfg_form_quantity = document.getElementById("input-quantity");
var eptfg_form_addboidbyclicking = document.getElementById("input-addboidbyclicking");
var eptfg_form_radius = document.getElementById("input-radius");
var eptfg_form_separationweight = document.getElementById("input-separationweight");
var eptfg_form_alignmentweight = document.getElementById("input-alignmentweight");
var eptfg_form_cohesionweight = document.getElementById("input-cohesionweight");

var eptfg_form_oriented = document.getElementById("input-oriented");
var eptfg_form_visualrepresentation_shape = document.getElementById("input-visualrepresentation-shape");
var eptfg_form_shape_circle = document.getElementById("input-shape-circle");
var eptfg_form_shape_triangle = document.getElementById("input-shape-triangle");
var eptfg_form_shape_square = document.getElementById("input-shape-square");
var eptfg_form_color = document.getElementById("input-color");
var eptfg_form_visualrepresentation_image = document.getElementById("input-visualrepresentation-image");
var eptfg_form_image = document.getElementById("input-image");

var eptfg_formhandler_image;


//WEBSITE FUNCTIONALITY

//TODO posar que no es puga fer el canvas + offset més gran que el window height.
//TODO Estem canviant width i height. potser convindria fer zoom? hauré de mirar el viewbox

window.addEventListener ("mousedown", myMouseDown);
window.addEventListener ("mousemove", myMouseMove);
window.addEventListener ("mouseup", myMouseUp);

var FLAG_RESIZING = false;
var offsetRight, offsetBottom;

function myMouseDown (event)
{
    if (event.button == 0)
    {
        var x = event.clientX - offset(eptfg_canvas).left;
        var y = event.clientY - offset(eptfg_canvas).top;
        
        if (x > eptfg_canvas.width - 10 && x < eptfg_canvas.width && y > eptfg_canvas.height - 10 && y < eptfg_canvas.height)
        {
            FLAG_RESIZING = true;
            offsetRight = eptfg_canvas.width - x;
            offsetBottom = eptfg_canvas.height - y;
        }
    }
}

function myMouseUp (event)
{
    FLAG_RESIZING = false;
}

function myMouseMove (event)
{
    var x = event.clientX - offset(eptfg_canvas).left;
    var y = event.clientY - offset(eptfg_canvas).top;
    
    if (FLAG_RESIZING)
    {
        if (eptfg_form_lock_canvas_height.checked)
        {
            if (!(eptfg_form_lock_canvas_width.checked || eptfg_form_ratio_16_9.checked || eptfg_form_ratio_4_3.checked || eptfg_form_ratio_1_1.checked || eptfg_form_ratio_3_4.checked || eptfg_form_ratio_9_16.checked))
            {
                eptfg_canvas.width = x + offsetRight;
            }
        }
        else if (eptfg_form_lock_canvas_width.checked)
        {
            if (!(eptfg_form_ratio_16_9.checked || eptfg_form_ratio_4_3.checked || eptfg_form_ratio_1_1.checked || eptfg_form_ratio_3_4.checked || eptfg_form_ratio_9_16.checked))
            {
                eptfg_canvas.height = y + offsetBottom;
            }
        }
        else
        {
            eptfg_canvas.height = y + offsetBottom;
            eptfg_canvas.width = x + offsetRight;
            if (eptfg_form_ratio_16_9.checked)
            {
                eptfg_canvas.width = eptfg_canvas.height * 16 / 9;
            }
            else if (eptfg_form_ratio_4_3.checked)
            {
                eptfg_canvas.width = eptfg_canvas.height * 4 / 3;
            }
            else if (eptfg_form_ratio_1_1.checked)
            {
                eptfg_canvas.width = eptfg_canvas.height;
            }
            else if (eptfg_form_ratio_3_4.checked)
            {
                eptfg_canvas.width = eptfg_canvas.height * 3 / 4;
            }
            else if (eptfg_form_ratio_9_16.checked)
            {
                eptfg_canvas.width = eptfg_canvas.height * 9 / 16;
            }
        }
        //TODO I could call the canvas' parent instead of ID
        //TODO add a flex container parent for the canvas
        eptfg_flex_container.style.height = (offset(eptfg_canvas) + y + offsetBottom) + "px";
        eptfg_canvas_width.value = eptfg_canvas.width;
        eptfg_canvas_height.value = eptfg_canvas.height;
        
        eptfg_draw();
    }
}

//Returns the absolute XY position of the object.
//Only works if no scroll. Does work if zoomed in.
function offset (el)
{
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

eptfg_form_grid.addEventListener ("change", function(e){eptfg_GRID = eptfg_form_grid.checked;});

eptfg_form_ratio_16_9.addEventListener ("change", ratiochange);
eptfg_form_ratio_4_3.addEventListener ("change", ratiochange);
eptfg_form_ratio_1_1.addEventListener ("change", ratiochange);
eptfg_form_ratio_3_4.addEventListener ("change", ratiochange);
eptfg_form_ratio_9_16.addEventListener ("change", ratiochange);

function ratiochange (event)
{
    if (event.target.checked)
    {
        switch (event.target.id)
        {
            case "ratio-16-9":
                eptfg_canvas.width = eptfg_canvas.height * 16 / 9;
                break;
            case "ratio-4-3":
                eptfg_canvas.width = eptfg_canvas.height * 4 / 3;
                break;
            case "ratio-1-1":
                eptfg_canvas.width = eptfg_canvas.height;
                break;
            case "ratio-3-4":
                eptfg_canvas.width = eptfg_canvas.height * 3 / 4;
                break;
            case "ratio-9-16":
                eptfg_canvas.width = eptfg_canvas.height * 9 / 16;
                break;
        }
        eptfg_canvas_width.value = eptfg_canvas.width;
        
        eptfg_form_ratio_16_9.checked = false;
        eptfg_form_ratio_4_3.checked = false;
        eptfg_form_ratio_1_1.checked = false;
        eptfg_form_ratio_3_4.checked = false;
        eptfg_form_ratio_9_16.checked = false;
        event.target.checked = true;
    }
}

eptfg_form_scene_scale.addEventListener ("input", function(e){
                                    eptfg_scenescale = e.target.value;
                                    eptfg_form_zoomlabel.value = e.target.value;
                                    });
eptfg_form_zoomlabel.addEventListener ("change", function(e){
                                  eptfg_form_scene_scale.value = e.target.value;
                                  eptfg_scenescale = e.target.value;
                                  });

eptfg_form_quantity.addEventListener ("change", quantityChange);

function quantityChange (event)
{
    var quantity = event.target.value;
    if (eptfg_flock.boids.length >= quantity)
    {
        eptfg_flock.boids.length = quantity;
    }
    else
    {
        var amountToAdd = quantity - eptfg_flock.boids.length;
        for (var i=0; i<amountToAdd; i++)
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
}

eptfg_canvas.addEventListener ("click", addBoidOnClick);

function addBoidOnClick (event)
{
    if (eptfg_form_addboidbyclicking.checked)
    {
        var location = new Vector (event.clientX - offset(eptfg_canvas).left - eptfg_canvas.width/2,
                                   event.clientY - offset(eptfg_canvas).top - eptfg_canvas.height/2);
        location.mult (eptfg_scenescale / 100);
        var angle = getRandomBetween (0, 2 * Math.PI);
        eptfg_flock.addBoid (new Boid (eptfg_visualrepresentation,
                                       eptfg_radius,
                                       location,
                                       new Vector (Math.cos(angle), Math.sin(angle)),
                                       new Vector(),
                                       2,
                                       0.03,
                                       eptfg_oriented));
        eptfg_form_quantity.value ++;
    }
}


eptfg_form_radius.addEventListener ("change", radiusChange);

function radiusChange (event)
{
    eptfg_flock.boidSizeChange (event.target.value);
}

eptfg_form_separationweight.addEventListener ("change", function(e){eptfg_flock.separationWeight = e.target.value;});
eptfg_form_alignmentweight.addEventListener ("change", function(e){eptfg_flock.alignmentWeight = e.target.value;});
eptfg_form_cohesionweight.addEventListener ("change", function(e){eptfg_flock.cohesionWeight = e.target.value;});

//TODO canviar min max step value en input-radius quan initFlotacion.
//De fet, canviar-ho tot quan cada initModel.

eptfg_form_oriented.addEventListener ("change", orientedChange);

function orientedChange (event)
{
    for (var i=0; i<eptfg_flock.boids.length; i++)
    {
        eptfg_flock.boids[i].orientedTowardsMovement = event.target.checked;
    }
}

eptfg_form_color.addEventListener ("change", function(e){
                                   eptfg_color = e.target.value;
                                   for (var i=0; i<eptfg_flock.boids.length; i++)
                                   {
                                   eptfg_flock.boids[i].color = e.target.value;
                                   }
                                   });

var inputvisualrepresentation = document.getElementsByName("input-visualrepresentation");
for (var i=0; i<inputvisualrepresentation.length; i++)
{
    inputvisualrepresentation[i].addEventListener ("change", visualrepresentationChange);
}
var inputshape = document.getElementsByName("input-shape");
for (var i=0; i<inputshape.length; i++)
{
    inputshape[i].addEventListener ("change", visualrepresentationChange);
}

function visualrepresentationChange (event)
{
    var visualrepresentation = eptfg_visualrepresentation;
    
    if (eptfg_form_visualrepresentation_shape.checked)
    {
        if (eptfg_form_shape_triangle.checked)
        {
            visualrepresentation = "triangle";
        }
        else if (eptfg_form_shape_circle.checked)
        {
            visualrepresentation = "circle";
        }
        else if (eptfg_form_shape_square.checked)
        {
            visualrepresentation = "square";
        }
    }
    else if (eptfg_form_visualrepresentation_image.checked)
    {
        if (!(typeof(eptfg_formhandler_image) === "undefined" || eptfg_formhandler_image === null))
        {
            visualrepresentation = new Image();
            visualrepresentation.src = eptfg_formhandler_image.src;
        }
    }
    
    eptfg_visualrepresentation = visualrepresentation;
    for (var i=0; i<eptfg_flock.boids.length; i++)
    {
        eptfg_flock.boids[i].visualrepresentation = visualrepresentation;
    }
}

eptfg_form_image.addEventListener ("change", imageChange);

function imageChange (event)
{
    var file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.onload = function()
    {
        eptfg_form_visualrepresentation_shape.checked = false;
        eptfg_form_visualrepresentation_image.checked = true;
        eptfg_visualrepresentation = new Image();
        eptfg_visualrepresentation.src = reader.result;
        eptfg_formhandler_image = new Image();
        eptfg_formhandler_image.src = reader.result;
        for (var i=0; i<eptfg_flock.boids.length; i++)
        {
            eptfg_flock.boids[i].visualrepresentation = eptfg_visualrepresentation;
        }
    }
    if (file)
    {
        reader.readAsDataURL (file);
    }
}

//TODO manual = bad
function setDefaultValues()
{
    eptfg_form_grid.checked = false;
    eptfg_form_ratio_16_9.checked = false;
    eptfg_form_ratio_4_3.checked = false;
    eptfg_form_ratio_1_1.checked = false;
    eptfg_form_ratio_3_4.checked = false;
    eptfg_form_ratio_9_16.checked = false;
    eptfg_form_lock_canvas_width.checked = false;
    eptfg_canvas_width.value = 480;
    eptfg_form_lock_canvas_height.checked = false;
    eptfg_canvas_height.value = 360;
    
    eptfg_form_scene_scale.value = 100;
    eptfg_form_zoomlabel.value = 100;
    
    eptfg_form_quantity.value = 200;
    eptfg_form_addboidbyclicking.checked = false;
    eptfg_form_radius.value = 5;
    eptfg_form_separationweight.value = 1.5;
    eptfg_form_alignmentweight.value = 1.0;
    eptfg_form_cohesionweight.value = 1.0;
    
    eptfg_form_oriented.checked = false;
    eptfg_form_visualrepresentation_shape.checked = true;
    eptfg_form_shape_circle.checked = true;
    eptfg_form_shape_triangle.checked = false;
    eptfg_form_shape_square.checked = false;
    eptfg_form_color.value = "#000000";
    eptfg_form_visualrepresentation_image.checked = false;
}
































function generateCode()
{
    var generatedCode = "//TODO";
    
    var visualrepresentation = new Image();
    visualrepresentation.src = "logo.png";
    if (document.getElementById("input-visualrepresentation-shape").checked) //AQUI
    {
        visualrepresentation = "triangle";
        if (document.getElementById("input-shape-circle").checked)//AQUI
        {
            visualrepresentation = "circle";
        }
        else if (document.getElementById("input-shape-square").checked)//AQUI
        {
            visualrepresentation = "square";
        }
    }
    
    if (FLAG_CURRENT_MODEL == "FLOCKING")
    {
        generatedCode = "'use strict';\n\nvar MyLibrary_canvas = document.getElementById('MyLibraryCanvas');\nvar MyLibrary_context = MyLibrary_canvas.getContext('2d');\n\nvar MyLibrary_drawing = new Image();\nMyLibrary_drawing.src = 'logo.png';\n\nvar MyLibrary_dt = 1;\n\nvar MyLibrary_flock = new Flock (" + document.getElementById("input-radius").value + " * Flock.desiredseparationtoradiusratio,\n                                 " + document.getElementById("input-radius").value + " * Flock.neighbourdistancetoradiusratio,\n                                 " + document.getElementById("input-separationweight").value + ",\n                                 " + document.getElementById("input-alignmentweight").value + ",\n                                 " + document.getElementById("input-cohesionweight").value + ");\n\nfunction MyLibrary_initFlocking()\n{\n    var quantity = " + document.getElementById("input-quantity").value + ";\n    MyLibrary_flock.boids.length = 0;\n    for (var i=0; i<quantity; i++)\n    {\n        var angle = getRandomBetween (0, 2 * Math.PI);\n        MyLibrary_flock.addBoid (new Boid ('" + visualrepresentation + "',\n                                           " + document.getElementById("input-radius").value + ",\n                                           new Vector (MyLibrary_canvas.width/2.0, MyLibrary_canvas.height/2.0),\n                                           new Vector (Math.cos(angle), Math.sin(angle)),\n                                           new Vector(),\n                                           2,\n                                           0.03,\n                                           " + document.getElementById("input-oriented").checked + "));\n    }\n}\n\nfunction animationLoop()\n{\n    MyLibrary_context.clearRect (0, 0, MyLibrary_canvas.width, MyLibrary_canvas.height);\n    \n    MyLibrary_flock.run (MyLibrary_dt, MyLibrary_canvas);\n    \n    window.requestAnimationFrame (animationLoop);\n}\n\nMyLibrary_initFlocking();\n\nanimationLoop();\n"
    }
    else if (FLAG_CURRENT_MODEL == "FLOTACION")
    {
        generatedCode = "'use strict';\n\nvar MyLibrary_canvas = document.getElementById('MyLibraryCanvas');\nvar MyLibrary_context = MyLibrary_canvas.getContext('2d');\n\nvar MyLibrary_drawing = new Image();\nMyLibrary_drawing.src = 'logo.png';\nvar MyLibrary_dt = 0.01;\nvar MyLibrary_gravity = 9.81;\nvar MyLibrary_liquidDensity = 1000;\nvar MyLibrary_part = new Particle (MyLibrary_drawing,\n                         " + document.getElementById("input-mass").value + " * 1.0,\n                         " + document.getElementById("input-radius").value + " * 1.0,\n                         new Vector(0.5,-0.9),\n                         new Vector (1.0, 0.0), new Vector());\nvar MyLibrary_tank = new Tank();\n\nfunction MyLibrary_initFlotacion()\n{\n    MyLibrary_context.font='0.5px Georgia';\n    MyLibrary_part = new Particle (MyLibrary_drawing,\n                         " + document.getElementById("input-mass").value + " * 1.0,\n                         " + document.getElementById("input-radius").value + " * 1.0,\n                         new Vector(0.1,-0.9),\n                         new Vector (0.7, 0.0),\n                         new Vector());\n}\n\nfunction MyLibrary_animationLoop()\n{\n    MyLibrary_context.clearRect(-10, -10, MyLibrary_canvas.width, MyLibrary_canvas.height);\n    \n    MyLibrary_part.applyAcceleration (new Vector(0, MyLibrary_gravity));\n    MyLibrary_part.computeForces (MyLibrary_gravity, MyLibrary_liquidDensity);\n    MyLibrary_part.update (MyLibrary_dt);\n    MyLibrary_tank.collisionHandling (MyLibrary_part);\n    \n    MyLibrary_context.save();\n    MyLibrary_context.setTransform (100, 0, 0, 100, 320, 180);\n    MyLibrary_context.lineWidth = 0.025;\n    MyLibrary_part.display (MyLibrary_context);\n    MyLibrary_context.restore();\n    \n     window.requestAnimationFrame (MyLibrary_animationLoop);\n}\n\nMyLibrary_initFlotacion();\n\nMyLibrary_animationLoop();\n";
    }
    
    return generatedCode;
}

function generateCodeOn (htmlElement)
{
    htmlElement.innerHTML = generateCode().replace ("<", "&lt;");
}

//TODO download current code generated as is?
//Or generate new code (onto the textarea) and download that?
//Or generate new code (leaving the textarea the same) and download that?
function downloadCodeAsFile()
{
    var element = document.createElement ("a");
    element.setAttribute ("href", "data:text/plain;charset=utf-8," + encodeURIComponent (generateCode()));
    element.setAttribute ("download", "MyLibrary.js"); //TODO canviar nom
    element.style.display = "none";
    document.body.appendChild (element);
    element.click();
    document.body.removeChild (element);
}

