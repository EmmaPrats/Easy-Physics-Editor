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

var eptfg_form_radius = document.getElementById("input-radius");
var eptfg_form_fleeweight = document.getElementById("input-fleeweight");

var eptfg_form_huntdistance = document.getElementById("input-huntdistance");
var eptfg_form_pursueweight = document.getElementById("input-pursueweight");

var eptfg_form_gatherdistance = document.getElementById("input-gatherdistance");
var eptfg_form_seekweight = document.getElementById("input-seekweight");
var eptfg_form_evadedistance = document.getElementById("input-evadedistance");
var eptfg_form_evadeweight = document.getElementById("input-evadeweight");

var eptfg_form_oriented_hunter = document.getElementById("input-oriented-hunter");
var eptfg_form_visualrepresentation_shape_hunter = document.getElementById("input-visualrepresentation-shape-hunter");
var eptfg_form_shape_circle_hunter = document.getElementById("input-shape-circle-hunter");
var eptfg_form_shape_triangle_hunter = document.getElementById("input-shape-triangle-hunter");
var eptfg_form_shape_square_hunter = document.getElementById("input-shape-square-hunter");
var eptfg_form_color_hunter = document.getElementById("input-color-hunter");
var eptfg_form_visualrepresentation_image_hunter = document.getElementById("input-visualrepresentation-image-hunter");
var eptfg_form_image_hunter = document.getElementById("input-image-hunter");

var eptfg_form_oriented_gatherer = document.getElementById("input-oriented-gatherer");
var eptfg_form_visualrepresentation_shape_gatherer = document.getElementById("input-visualrepresentation-shape-gatherer");
var eptfg_form_shape_circle_gatherer = document.getElementById("input-shape-circle-gatherer");
var eptfg_form_shape_triangle_gatherer = document.getElementById("input-shape-triangle-gatherer");
var eptfg_form_shape_square_gatherer = document.getElementById("input-shape-square-gatherer");
var eptfg_form_color_gatherer = document.getElementById("input-color-gatherer");
var eptfg_form_visualrepresentation_image_gatherer = document.getElementById("input-visualrepresentation-image-gatherer");
var eptfg_form_image_gatherer = document.getElementById("input-image-gatherer");

var eptfg_form_visualrepresentation_shape_target = document.getElementById("input-visualrepresentation-shape-target");
var eptfg_form_shape_circle_target = document.getElementById("input-shape-circle-target");
var eptfg_form_shape_triangle_target = document.getElementById("input-shape-triangle-target");
var eptfg_form_shape_square_target = document.getElementById("input-shape-square-target");
var eptfg_form_color_target = document.getElementById("input-color-target");
var eptfg_form_visualrepresentation_image_target = document.getElementById("input-visualrepresentation-image-target");
var eptfg_form_image_target = document.getElementById("input-image-target");

var eptfg_form_active_hunter = document.getElementById("input-active-hunter");
var eptfg_form_active_gatherer = document.getElementById("input-active-gatherer");
var eptfg_form_active_target = document.getElementById("input-active-target");

var eptfg_formhandler_image_hunter;
var eptfg_formhandler_image_gatherer;
var eptfg_formhandler_image_target;


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

eptfg_form_radius.addEventListener ("change", function(e){
                                    eptfg_radius = 1 * e.target.value;
                                    eptfg_hunter.radius = 1 * e.target.value;
                                    eptfg_gatherer.radius = 1 * e.target.value;
                                    });

eptfg_form_fleeweight.addEventListener ("change", function(e){eptfg_fleeweight=e.target.value;});

eptfg_form_huntdistance.addEventListener ("change", function(e){eptfg_huntdistance=e.target.value;});
eptfg_form_pursueweight.addEventListener ("change", function(e){eptfg_pursueweight=e.target.value;});

eptfg_form_gatherdistance.addEventListener ("change", function(e){eptfg_gatherdistance=e.target.value;});
eptfg_form_seekweight.addEventListener ("change", function(e){eptfg_seekweight=e.target.value;});
eptfg_form_evadedistance.addEventListener ("change", function(e){eptfg_evadedistance=e.target.value;});
eptfg_form_evadeweight.addEventListener ("change", function(e){eptfg_evadeweight=e.target.value;});






//TODO canviar min max step value en input-radius quan initFlotacion.
//De fet, canviar-ho tot quan cada initModel.

eptfg_form_oriented_hunter.addEventListener ("change", function(e){eptfg_hunter.orientedTowardsMovement=e.target.checked;});
eptfg_form_oriented_gatherer.addEventListener ("change", function(e){eptfg_gatherer.orientedTowardsMovement=e.target.checked;});


var inputvisualrepresentation_hunter = document.getElementsByName("input-visualrepresentation-hunter");
for (var i=0; i<inputvisualrepresentation_hunter.length; i++)
{
    inputvisualrepresentation_hunter[i].addEventListener ("change", visualrepresentationChange);
}
var inputshape_hunter = document.getElementsByName("input-shape-hunter");
for (var i=0; i<inputshape_hunter.length; i++)
{
    inputshape_hunter[i].addEventListener ("change", visualrepresentationChange);
}

var inputvisualrepresentation_gatherer = document.getElementsByName("input-visualrepresentation-gatherer");
for (var i=0; i<inputvisualrepresentation_gatherer.length; i++)
{
    inputvisualrepresentation_gatherer[i].addEventListener ("change", visualrepresentationChange);
}
var inputshape_gatherer = document.getElementsByName("input-shape-gatherer");
for (var i=0; i<inputshape_gatherer.length; i++)
{
    inputshape_gatherer[i].addEventListener ("change", visualrepresentationChange);
}

var inputvisualrepresentation_target = document.getElementsByName("input-visualrepresentation-target");
for (var i=0; i<inputvisualrepresentation_target.length; i++)
{
    inputvisualrepresentation_target[i].addEventListener ("change", visualrepresentationChange);
}
var inputshape_target = document.getElementsByName("input-shape-target");
for (var i=0; i<inputshape_target.length; i++)
{
    inputshape_target[i].addEventListener ("change", visualrepresentationChange);
}

function visualrepresentationChange (event)
{
    var visualrepresentation_hunter = eptfg_hunter.visualrepresentation;
    var visualrepresentation_gatherer = eptfg_gatherer.visualrepresentation;
    var visualrepresentation_target = eptfg_visualrepresentation;
    
    if (eptfg_form_visualrepresentation_shape_hunter.checked)
    {
        if (eptfg_form_shape_triangle_hunter.checked)
        {
            visualrepresentation_hunter = "triangle";
        }
        else if (eptfg_form_shape_circle_hunter.checked)
        {
            visualrepresentation_hunter = "circle";
        }
        else if (eptfg_form_shape_square_hunter.checked)
        {
            visualrepresentation_hunter = "square";
        }
    }
    else if (eptfg_form_visualrepresentation_image_hunter.checked)
    {
        if (!(typeof(eptfg_formhandler_image_hunter) === "undefined" || eptfg_formhandler_image_hunter === null))
        {
            visualrepresentation_hunter = new Image();
            visualrepresentation_hunter.src = eptfg_formhandler_image_hunter.src;
        }
    }
    if (eptfg_form_visualrepresentation_shape_gatherer.checked)
    {
        if (eptfg_form_shape_triangle_gatherer.checked)
        {
            visualrepresentation_gatherer = "triangle";
        }
        else if (eptfg_form_shape_circle_gatherer.checked)
        {
            visualrepresentation_gatherer = "circle";
        }
        else if (eptfg_form_shape_square_gatherer.checked)
        {
            visualrepresentation_gatherer = "square";
        }
    }
    else if (eptfg_form_visualrepresentation_image_gatherer.checked)
    {
        if (!(typeof(eptfg_formhandler_image_gatherer) === "undefined" || eptfg_formhandler_image_gatherer === null))
        {
            visualrepresentation_gatherer = new Image();
            visualrepresentation_gatherer.src = eptfg_formhandler_image_gatherer.src;
        }
    }
    if (eptfg_form_visualrepresentation_shape_target.checked)
    {
        if (eptfg_form_shape_circle_target.checked)
        {
            visualrepresentation_target = "circle";
        }
        else if (eptfg_form_shape_square_target.checked)
        {
            visualrepresentation_target = "square";
        }
        else if (eptfg_form_shape_triangle_target.checked)
        {
            visualrepresentation_target = "triangle";
        }
    }
    else if (eptfg_form_visualrepresentation_image_target.checked)
    {
        if (!(typeof(eptfg_formhandler_image_target) === "undefined" || eptfg_formhandler_image_target === null))
        {
            visualrepresentation_target = new Image();
            visualrepresentation_target.src = eptfg_formhandler_image_target.src;
        }
    }
    
    eptfg_hunter.visualrepresentation = visualrepresentation_hunter;
    eptfg_gatherer.visualrepresentation = visualrepresentation_gatherer;
    eptfg_visualrepresentation = visualrepresentation_target;
}

eptfg_form_color_hunter.addEventListener ("change", function(e){
                                          eptfg_hunter.color = e.target.value;
                                          });
eptfg_form_color_gatherer.addEventListener ("change", function(e){
                                            eptfg_gatherer.color = e.target.value;
                                            });
eptfg_form_color_target.addEventListener ("change", function(e){
                                          eptfg_color = e.target.value;
                                          });

eptfg_form_image_hunter.addEventListener ("change", imageChangeHunter);

function imageChangeHunter (event)
{
    var file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.onload = function()
    {
        eptfg_form_visualrepresentation_shape_hunter.checked = false;
        eptfg_form_visualrepresentation_image_hunter.checked = true;
        eptfg_hunter.visualrepresentation = new Image();
        eptfg_hunter.visualrepresentation.src = reader.result;
        eptfg_formhandler_image_hunter = new Image();
        eptfg_formhandler_image_hunter.src = reader.result;
    }
    if (file)
    {
        reader.readAsDataURL (file);
    }
}

eptfg_form_image_gatherer.addEventListener ("change", imageChangeGatherer);

function imageChangeGatherer (event)
{
    var file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.onload = function()
    {
        eptfg_form_visualrepresentation_shape_gatherer.checked = false;
        eptfg_form_visualrepresentation_image_gatherer.checked = true;
        eptfg_gatherer.visualrepresentation = new Image();
        eptfg_gatherer.visualrepresentation.src = reader.result;
        eptfg_formhandler_image_gatherer = new Image();
        eptfg_formhandler_image_gatherer.src = reader.result;
    }
    if (file)
    {
        reader.readAsDataURL (file);
    }
}

eptfg_form_image_target.addEventListener ("change", imageChangeTarget);

function imageChangeTarget (event)
{
    var file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.onload = function()
    {
        eptfg_form_visualrepresentation_shape_target.checked = false;
        eptfg_form_visualrepresentation_image_target.checked = true;
        eptfg_visualrepresentation = new Image();
        eptfg_visualrepresentation.src = reader.result;
        eptfg_formhandler_image_target = new Image();
        eptfg_formhandler_image_target.src = reader.result;
    }
    if (file)
    {
        reader.readAsDataURL (file);
    }
}

eptfg_form_active_hunter.addEventListener ("change", function(e){
                                           if (e.target.checked)
                                           {
                                           var scenescale = eptfg_scenescale / 100;
                                           var worldWidth = scenescale * eptfg_canvas.width;
                                           var worldHeight = scenescale * eptfg_canvas.height;
                                           
                                           eptfg_hunter   = new Boid (eptfg_visualrepresentation,
                                                                      eptfg_radius,
                                                                      new Vector (getRandomBetween(-worldWidth/2, worldWidth/2), getRandomBetween(-worldHeight/2, worldHeight/2)),
                                                                      new Vector(),
                                                                      new Vector(),
                                                                      2,
                                                                      0.03,
                                                                      eptfg_oriented);
                                           eptfg_hunter.color = eptfg_color;
                                           }
                                           else
                                           {
                                           eptfg_hunter = null;
                                           }
                                           });

eptfg_form_active_gatherer.addEventListener ("change", function(e){
                                             if (e.target.checked)
                                             {
                                             var scenescale = eptfg_scenescale / 100;
                                             var worldWidth = scenescale * eptfg_canvas.width;
                                             var worldHeight = scenescale * eptfg_canvas.height;
                                             
                                             eptfg_gatherer = new Boid (eptfg_visualrepresentation,
                                                                        eptfg_radius,
                                                                        new Vector (getRandomBetween(-worldWidth/2, worldWidth/2), getRandomBetween(-worldHeight/2, worldHeight/2)),
                                                                        new Vector(),
                                                                        new Vector(),
                                                                        2,
                                                                        0.03,
                                                                        eptfg_oriented);
                                             eptfg_gatherer.color = eptfg_color;
                                             }
                                             else
                                             {
                                             eptfg_gatherer = null;
                                             }
                                             });

eptfg_form_active_target.addEventListener ("change", function(e){
                                           if (e.target.checked)
                                           {
                                           var scenescale = eptfg_scenescale / 100;
                                           var worldWidth = scenescale * eptfg_canvas.width;
                                           var worldHeight = scenescale * eptfg_canvas.height;
                                           
                                           eptfg_target = new Vector (getRandomBetween (-worldWidth/2, worldWidth/2), getRandomBetween(-worldHeight/2, worldHeight/2));
                                           }
                                           else
                                           {
                                           eptfg_target = null;
                                           }
                                           });

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
    
    eptfg_form_radius.value = 5;
    eptfg_form_fleeweight.value = 1.5;
    
    eptfg_form_huntdistance.value = 200;
    eptfg_form_pursueweight.value = 1.0;
    
    eptfg_form_gatherdistance.value = 200;
    eptfg_form_seekweight.value = 1.0;
    eptfg_form_evadedistance.value = 200;
    eptfg_form_evadeweight.value = 1.0;
    
    eptfg_form_oriented_hunter.value = true;
    eptfg_form_visualrepresentation_shape_hunter.checked = true;
    eptfg_form_shape_triangle_hunter.checked = true;
    eptfg_form_shape_circle_hunter.value = false;
    eptfg_form_shape_square_hunter.value = false;
    eptfg_form_color_hunter.value = "#000000";
    eptfg_form_visualrepresentation_image_hunter.checked = false;
    
    eptfg_form_oriented_gatherer.value = true;
    eptfg_form_visualrepresentation_shape_gatherer.checked = true;
    eptfg_form_shape_triangle_gatherer.checked = true;
    eptfg_form_shape_circle_gatherer.value = false;
    eptfg_form_shape_square_gatherer.value = false;
    eptfg_form_color_gatherer.value = "#000000";
    eptfg_form_visualrepresentation_image_gatherer.checked = false;
    
    eptfg_form_visualrepresentation_shape_target.checked = true;
    eptfg_form_shape_triangle_target.checked = true;
    eptfg_form_shape_circle_target.value = false;
    eptfg_form_shape_square_target.value = false;
    eptfg_form_color_target.value = "#000000";
    eptfg_form_visualrepresentation_image_target.checked = false;
    
    eptfg_form_active_hunter.checked = true;
    eptfg_form_active_gatherer.checked = true;
    eptfg_form_active_target.checked = true;
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

