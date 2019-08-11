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

var eptfg_form_restartsimulation = document.getElementById("restart-simulation-button");
var eptfg_form_defaultvalues = document.getElementById("default-values-button");
var eptfg_form_downloadbutton = document.getElementById("button-downloadfile");


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
        
        if (x > eptfg_canvas.width - 15 && x < eptfg_canvas.width && y > eptfg_canvas.height - 15 && y < eptfg_canvas.height)
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
        //eptfg_canvas_width.value = eptfg_canvas.width;
        //eptfg_canvas_height.value = eptfg_canvas.height;
        eptfg_canvas_width.innerHTML = eptfg_canvas.width;
        eptfg_canvas_height.innerHTML = eptfg_canvas.height;
        
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
        eptfg_form_ratio_16_9.checked = false;
        eptfg_form_ratio_16_9.nextSibling.innerHTML = "&#128275;16:9";
        eptfg_form_ratio_4_3.checked = false;
        eptfg_form_ratio_4_3.nextSibling.innerHTML = "&#128275;4:3";
        eptfg_form_ratio_1_1.checked = false;
        eptfg_form_ratio_1_1.nextSibling.innerHTML = "&#128275;1:1";
        eptfg_form_ratio_3_4.checked = false;
        eptfg_form_ratio_3_4.nextSibling.innerHTML = "&#128275;3:4";
        eptfg_form_ratio_9_16.checked = false;
        eptfg_form_ratio_9_16.nextSibling.innerHTML = "&#128275;9:16";
        
        switch (event.target.id)
        {
            case "ratio-16-9":
                eptfg_canvas.width = eptfg_canvas.height * 16 / 9;
                eptfg_form_ratio_16_9.nextSibling.innerHTML = "&#128274;16:9";
                break;
            case "ratio-4-3":
                eptfg_canvas.width = eptfg_canvas.height * 4 / 3;
                eptfg_form_ratio_4_3.nextSibling.innerHTML = "&#128274;4:3";
                break;
            case "ratio-1-1":
                eptfg_canvas.width = eptfg_canvas.height;
                eptfg_form_ratio_1_1.nextSibling.innerHTML = "&#128274;1:1";
                break;
            case "ratio-3-4":
                eptfg_canvas.width = eptfg_canvas.height * 3 / 4;
                eptfg_form_ratio_3_4.nextSibling.innerHTML = "&#128274;3:4";
                break;
            case "ratio-9-16":
                eptfg_canvas.width = eptfg_canvas.height * 9 / 16;
                eptfg_form_ratio_9_16.nextSibling.innerHTML = "&#128274;9:16";
                break;
        }
        eptfg_canvas_width.innerHTML = eptfg_canvas.width;
        
        event.target.checked = true;
    }
    else
    {
        switch (event.target.id)
        {
            case "ratio-16-9":
                eptfg_form_ratio_16_9.nextSibling.innerHTML = "&#128275;16:9";
                break;
            case "ratio-4-3":
                eptfg_form_ratio_4_3.nextSibling.innerHTML = "&#128275;4:3";
                break;
            case "ratio-1-1":
                eptfg_form_ratio_1_1.nextSibling.innerHTML = "&#128275;1:1";
                break;
            case "ratio-3-4":
                eptfg_form_ratio_3_4.nextSibling.innerHTML = "&#128275;3:4";
                break;
            case "ratio-9-16":
                eptfg_form_ratio_9_16.nextSibling.innerHTML = "&#128275;9:16";
                break;
        }
    }
}

eptfg_form_lock_canvas_width.addEventListener ("change", function(e){
                                               if (e.target.checked)
                                               {
                                               e.target.nextSibling.innerHTML = "&#128274;";
                                               }
                                               else
                                               {
                                               e.target.nextSibling.innerHTML = "&#128275;";
                                               }
                                               });
eptfg_form_lock_canvas_height.addEventListener ("change", function(e){
                                               if (e.target.checked)
                                               {
                                               e.target.nextSibling.innerHTML = "&#128274;";
                                               }
                                               else
                                               {
                                               e.target.nextSibling.innerHTML = "&#128275;";
                                               }
                                               });

eptfg_form_defaultvalues.addEventListener ("click", function(e){
                                           if (confirm ("You will lose all your progress. Are you sure?"))
                                           {
                                           setDefaultValuesFlocking();
                                           restartSimulationFlocking();
                                           }
                                           });
eptfg_form_restartsimulation.addEventListener ("click", restartSimulationFlocking);

function restartSimulationFlocking()
{
    eptfg_GRID = eptfg_form_grid.checked;
    eptfg_scenescale = eptfg_form_scene_scale.value * 1.0;
    eptfg_quantity = eptfg_form_quantity.value * 1.0;
    eptfg_radius = eptfg_form_radius.value * 1.0;
    eptfg_separationweight = eptfg_form_separationweight.value * 1.0;
    eptfg_alignmentweight = eptfg_form_alignmentweight.value * 1.0;
    eptfg_cohesionweight = eptfg_form_cohesionweight.value * 1.0;
    
    eptfg_visualrepresentation = "triangle";
    if (eptfg_form_visualrepresentation_shape.checked)
    {
        if (eptfg_form_shape_circle.checked)
        {
            eptfg_visualrepresentation = "circle";
        }
        else if (eptfg_form_shape_square.checked)
        {
            eptfg_visualrepresentation = "square";
        }
    }
    else if (eptfg_form_visualrepresentation_image_hunter.checked)
    {
        if (!(typeof(eptfg_formhandler_image) === "undefined" || eptfg_formhandler_image === null))
        {
            eptfg_visualrepresentation = new Image();
            eptfg_visualrepresentation.src = eptfg_formhandler_image.src;
        }
    }
    
    eptfg_oriented = eptfg_form_oriented.checked;
    eptfg_color = eptfg_form_color.value;
    
    eptfg_initFlocking();
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


eptfg_form_radius.addEventListener ("change", radiusChange);

function radiusChange (event)
{
    eptfg_radius = event.target.value;
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
function setDefaultValuesFlocking()
{
    eptfg_form_grid.checked = true;
    eptfg_form_ratio_16_9.checked = false;
    eptfg_form_ratio_16_9.nextSibling.innerHTML = "&#128275;16:9";
    eptfg_form_ratio_4_3.checked = false;
    eptfg_form_ratio_4_3.nextSibling.innerHTML = "&#128275;4:3";
    eptfg_form_ratio_1_1.checked = false;
    eptfg_form_ratio_1_1.nextSibling.innerHTML = "&#128275;1:1";
    eptfg_form_ratio_3_4.checked = false;
    eptfg_form_ratio_3_4.nextSibling.innerHTML = "&#128275;3:4";
    eptfg_form_ratio_9_16.checked = false;
    eptfg_form_ratio_9_16.nextSibling.innerHTML = "&#128275;9:16";
    eptfg_form_lock_canvas_width.checked = false;
    eptfg_form_lock_canvas_width.nextSibling.innerHTML = "&#128275";
    eptfg_canvas_width.innerHTML = "480";
    eptfg_form_lock_canvas_height.checked = false;
    eptfg_form_lock_canvas_height.nextSibling.innerHTML = "&#128275";
    eptfg_canvas_height.innerHTML = "360";
    eptfg_canvas.width = 480;
    eptfg_canvas.height = 360;
    
    eptfg_form_scene_scale.value = 400;
    eptfg_form_zoomlabel.value = 400;
    
    eptfg_form_quantity.value = 200;
    eptfg_form_radius.value = 5;
    eptfg_form_separationweight.value = 1.5;
    eptfg_form_alignmentweight.value = 1.0;
    eptfg_form_cohesionweight.value = 1.0;
    
    eptfg_form_oriented.checked = true;
    eptfg_form_visualrepresentation_image.checked = false;
    eptfg_form_visualrepresentation_shape.checked = true;
    eptfg_form_shape_circle.checked = false;
    eptfg_form_shape_triangle.checked = true;
    eptfg_form_shape_square.checked = false;
    eptfg_form_color.value = "#000000";
}

eptfg_form_downloadbutton.addEventListener ("click", downloadCodeFlocking);

function downloadCodeFlocking()
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "../EasyPhysics.js", false);
    rawFile.onreadystatechange = function ()
    {
        if(this.readyState === 4)
        {
            if(this.status === 200 || this.status == 0)
            {
                var library = this.responseText;
                console.log (library);
                
                var element = document.createElement ("a");
                element.setAttribute ("href", "data:text/plain;charset=utf-8," + encodeURIComponent (library) + encodeURIComponent (generateCodeFlocking()));
                element.setAttribute ("download", "EasyPhysicsAnimation.js");
                element.style.display = "none";
                document.body.appendChild (element);
                element.click();
                document.body.removeChild (element);
            }
        }
    }
    rawFile.send();
}

function generateCodeFlocking()
{
    var generatedCode = '\n\nvar eptfg_canvas = document.getElementById("EasyPhysics");\n';
    generatedCode += 'eptfg_canvas.width = ' + eptfg_canvas.width + ';\n';
    generatedCode += 'eptfg_canvas.height = ' + eptfg_canvas.height + ';\n';
    generatedCode += 'var eptfg_context = eptfg_canvas.getContext("2d");\n\n';
    generatedCode += 'var eptfg_scenescale = ' + eptfg_scenescale + ';\n\n';
    generatedCode += 'var eptfg_dt = 1.0\n\n';
    generatedCode += 'var eptfg_flock;\n';
    generatedCode += 'var eptfg_quantity = ' + eptfg_quantity + ';\n';
    generatedCode += 'var eptfg_radius = ' + eptfg_radius + ';\n';
    generatedCode += 'var eptfg_separationweight = ' + eptfg_separationweight + ';\n';
    generatedCode += 'var eptfg_alignmentweight = ' + eptfg_alignmentweight + ';\n';
    generatedCode += 'var eptfg_cohesionweight = ' + eptfg_cohesionweight + ';\n\n';
    if (typeof (eptfg_visualrepresentation) == "string")
    {
        generatedCode += 'var eptfg_visualrepresentation = "' + eptfg_visualrepresentation + '";\n';
    }
    else if (eptfg_visualrepresentation instanceof Image)
    {
        generatedCode += 'var eptfg_visualrepresentation = new Image();\n';
        generatedCode += 'eptfg_visualrepresentation.src = "' + eptfg_visualrepresentation.src + '";\n';
    }
    else
    {
        generatedCode += 'var eptfg_visualrepresentation = "triangle";\n';
    }
    generatedCode += 'var eptfg_image;\n';
    generatedCode += 'var eptfg_color = "' + eptfg_color + '";\n';
    generatedCode += 'var eptfg_oriented = ' + eptfg_oriented + ';\n\n';
    generatedCode += 'function eptfg_initFlocking()\n';
    generatedCode += '{\n';
    generatedCode += '    eptfg_dt = 1.0;\n\n';
    generatedCode += '    eptfg_flock = new Flock (eptfg_radius * Flock.desiredseparationtoradiusratio,\n';
    generatedCode += '                             eptfg_radius * Flock.neighbourdistancetoradiusratio,\n';
    generatedCode += '                             eptfg_separationweight,\n';
    generatedCode += '                             eptfg_alignmentweight,\n';
    generatedCode += '                             eptfg_cohesionweight);\n';
    generatedCode += '    for (var i=0; i<eptfg_quantity; i++)\n';
    generatedCode += '    {\n';
    generatedCode += '        var angle = getRandomBetween (0, 2 * Math.PI);\n';
    generatedCode += '        eptfg_flock.addBoid (new Boid (eptfg_visualrepresentation,\n';
    generatedCode += '                                       eptfg_radius,\n';
    generatedCode += '                                       new Vector (0, 0),\n';
    generatedCode += '                                       new Vector (Math.cos(angle), Math.sin(angle)),\n';
    generatedCode += '                                       new Vector(),\n';
    generatedCode += '                                       2,\n';
    generatedCode += '                                       0.03,\n';
    generatedCode += '                                       eptfg_oriented));\n';
    generatedCode += '        eptfg_flock.boids[i].color = eptfg_color;\n';
    generatedCode += '    }\n';
    generatedCode += '}\n\n';
    generatedCode += 'function eptfg_animationLoop()\n';
    generatedCode += '{\n';
    generatedCode += '    eptfg_draw();\n\n';
    generatedCode += '    window.requestAnimationFrame (eptfg_animationLoop);\n';
    generatedCode += '}\n\n';
    generatedCode += 'function eptfg_draw()\n';
    generatedCode += '{\n';
    generatedCode += '    eptfg_context.clearRect (0, 0, eptfg_canvas.width, eptfg_canvas.height);\n\n';
    generatedCode += '    eptfg_context.save();\n\n';
    generatedCode += '    var zoom = eptfg_canvas.width / eptfg_scenescale;\n';
    generatedCode += '    eptfg_context.setTransform (zoom, 0, 0, zoom, eptfg_canvas.width/2, eptfg_canvas.height/2);\n\n';
    generatedCode += '    eptfg_flock.run (eptfg_dt,\n';
    generatedCode += '                     -eptfg_scenescale/2,\n';
    generatedCode += '                     eptfg_scenescale/2,\n';
    generatedCode += '                     -eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2,\n';
    generatedCode += '                     eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2);\n';
    generatedCode += '    eptfg_flock.display (eptfg_context);\n\n';
    generatedCode += '    eptfg_context.restore();\n';
    generatedCode += '}\n\n';
    generatedCode += 'eptfg_initFlocking();\n\n';
    generatedCode += 'eptfg_animationLoop();\n';
    
    return generatedCode;
}
