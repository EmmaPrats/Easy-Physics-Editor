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
        eptfg_canvas.parentElement.style.height = (offset(eptfg_canvas) + y + offsetBottom) + "px";
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
                                           setDefaultValuesSteering();
                                           restartSimulationSteering();
                                           }
                                           });
eptfg_form_restartsimulation.addEventListener ("click", restartSimulationSteering);

function restartSimulationSteering()
{
    eptfg_GRID = eptfg_form_grid.checked;
    eptfg_scenescale = eptfg_form_scene_scale.value;
    eptfg_radius = eptfg_form_radius.value;
    eptfg_gatherdistance = eptfg_form_gatherdistance.value;
    eptfg_evadedistance = eptfg_form_evadedistance.value;
    eptfg_huntdistance = eptfg_form_huntdistance.value;
    eptfg_seekweight = eptfg_form_seekweight.value;
    eptfg_evadeweight = eptfg_form_evadeweight.value;
    eptfg_pursueweight = eptfg_form_pursueweight.value;
    
    eptfg_visualrepresentation_hunter = "triangle";
    if (eptfg_form_visualrepresentation_shape_hunter.checked)
    {
        if (eptfg_form_shape_triangle_hunter.checked)
        {
            eptfg_visualrepresentation_hunter = "triangle";
        }
        else if (eptfg_form_shape_circle_hunter.checked)
        {
            eptfg_visualrepresentation_hunter = "circle";
        }
        else if (eptfg_form_shape_square_hunter.checked)
        {
            eptfg_visualrepresentation_hunter = "square";
        }
    }
    else if (eptfg_form_visualrepresentation_image_hunter.checked)
    {
        if (!(typeof(eptfg_formhandler_image_hunter) === "undefined" || eptfg_formhandler_image_hunter === null))
        {
            eptfg_visualrepresentation_hunter = new Image();
            eptfg_visualrepresentation_hunter.src = eptfg_formhandler_image_hunter.src;
        }
    }
    
    eptfg_visualrepresentation_gatherer = "circle";
    if (eptfg_form_visualrepresentation_shape_gatherer.checked)
    {
        if (eptfg_form_shape_triangle_gatherer.checked)
        {
            eptfg_visualrepresentation_gatherer = "triangle";
        }
        else if (eptfg_form_shape_circle_gatherer.checked)
        {
            eptfg_visualrepresentation_gatherer = "circle";
        }
        else if (eptfg_form_shape_square_gatherer.checked)
        {
            eptfg_visualrepresentation_gatherer = "square";
        }
    }
    else if (eptfg_form_visualrepresentation_image_gatherer.checked)
    {
        if (!(typeof(eptfg_formhandler_image_gatherer) === "undefined" || eptfg_formhandler_image_gatherer === null))
        {
            eptfg_visualrepresentation_gatherer = new Image();
            eptfg_visualrepresentation_gatherer.src = eptfg_formhandler_image_gatherer.src;
        }
    }
    
    eptfg_visualrepresentation_target = "square";
    if (eptfg_form_visualrepresentation_shape_target.checked)
    {
        if (eptfg_form_shape_circle_target.checked)
        {
            eptfg_visualrepresentation_target = "circle";
        }
        else if (eptfg_form_shape_square_target.checked)
        {
            eptfg_visualrepresentation_target = "square";
        }
        else if (eptfg_form_shape_triangle_target.checked)
        {
            eptfg_visualrepresentation_target = "triangle";
        }
    }
    else if (eptfg_form_visualrepresentation_image_target.checked)
    {
        if (!(typeof(eptfg_formhandler_image_target) === "undefined" || eptfg_formhandler_image_target === null))
        {
            eptfg_visualrepresentation_target = new Image();
            eptfg_visualrepresentation_target.src = eptfg_formhandler_image_target.src;
        }
    }
    
    eptfg_oriented_hunter = eptfg_form_oriented_hunter.value;
    eptfg_oriented_gatherer = eptfg_form_oriented_gatherer.value;
    eptfg_color_hunter = eptfg_form_color_hunter.value;
    eptfg_color_gatherer = eptfg_form_color_gatherer.value;
    eptfg_color_target = eptfg_form_color_target.value;
    
    eptfg_EXISTS_hunter = eptfg_form_active_hunter.checked;
    eptfg_EXISTS_gatherer = eptfg_form_active_gatherer.checked;
    eptfg_EXISTS_target = eptfg_form_active_target.checked;
    
    eptfg_initHunterAndGatherer();
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

eptfg_form_huntdistance.addEventListener ("change", function(e){eptfg_huntdistance=e.target.value;});
eptfg_form_pursueweight.addEventListener ("change", function(e){eptfg_pursueweight=e.target.value;});

eptfg_form_gatherdistance.addEventListener ("change", function(e){eptfg_gatherdistance=e.target.value;});
eptfg_form_seekweight.addEventListener ("change", function(e){eptfg_seekweight=e.target.value;});
eptfg_form_evadedistance.addEventListener ("change", function(e){eptfg_evadedistance=e.target.value;});
eptfg_form_evadeweight.addEventListener ("change", function(e){eptfg_evadeweight=e.target.value;});






//TODO canviar min max step value en input-radius quan initFlotacion.
//De fet, canviar-ho tot quan cada initModel.

eptfg_form_oriented_hunter.addEventListener ("change", function(e){
                                             eptfg_oriented_hunter = e.target.checked;
                                             if (eptfg_hunter !== null) eptfg_hunter.orientedTowardsMovement=e.target.checked;
                                             });
eptfg_form_oriented_gatherer.addEventListener ("change", function(e){
                                               eptfg_oriented_gatherer = e.target.checked;
                                               if (eptfg_gatherer !== null) eptfg_gatherer.orientedTowardsMovement=e.target.checked;
                                               });


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
    var visualrepresentation_hunter = eptfg_visualrepresentation_hunter;
    var visualrepresentation_gatherer = eptfg_visualrepresentation_gatherer;
    var visualrepresentation_target = eptfg_visualrepresentation_target;
    
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
    
    if (eptfg_hunter !== null) eptfg_hunter.visualrepresentation = visualrepresentation_hunter;
    eptfg_visualrepresentation_hunter = visualrepresentation_hunter;
    if (eptfg_gatherer !== null) eptfg_gatherer.visualrepresentation = visualrepresentation_gatherer;
    eptfg_visualrepresentation_gatherer = visualrepresentation_gatherer;
    eptfg_visualrepresentation_target = visualrepresentation_target;
}

eptfg_form_color_hunter.addEventListener ("change", function(e){
                                          eptfg_color_hunter = e.target.value;
                                          if (eptfg_hunter !== null) eptfg_hunter.color = e.target.value;
                                          });
eptfg_form_color_gatherer.addEventListener ("change", function(e){
                                            eptfg_color_gatherer = e.target.value;
                                            if (eptfg_gatherer !== null) eptfg_gatherer.color = e.target.value;
                                            });
eptfg_form_color_target.addEventListener ("change", function(e){
                                          eptfg_color_target = e.target.value;
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
        if (eptfg_hunter !== null) eptfg_hunter.visualrepresentation = new Image();
        if (eptfg_hunter !== null) eptfg_hunter.visualrepresentation.src = reader.result;
        eptfg_visualrepresentation_hunter = new Image();
        eptfg_visualrepresentation_hunter.src = reader.result;
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
        if (eptfg_gatherer !== null) eptfg_gatherer.visualrepresentation = new Image();
        if (eptfg_gatherer !== null) eptfg_gatherer.visualrepresentation.src = reader.result;
        eptfg_visualrepresentation_gatherer = new Image();
        eptfg_visualrepresentation_gatherer.src = reader.result;
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
        eptfg_visualrepresentation_target = new Image();
        eptfg_visualrepresentation_target.src = reader.result;
        eptfg_formhandler_image_target = new Image();
        eptfg_formhandler_image_target.src = reader.result;
    }
    if (file)
    {
        reader.readAsDataURL (file);
    }
}

eptfg_form_active_hunter.addEventListener ("change", function(e){
                                           eptfg_EXISTS_hunter = e.target.checked;
                                           if (e.target.checked)
                                           {
                                           var worldHeight = eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width;
                                           
                                           eptfg_hunter   = new Boid (eptfg_visualrepresentation_hunter,
                                                                      eptfg_radius,
                                                                      new Vector (getRandomBetween(-eptfg_scenescale/2, eptfg_scenescale/2), getRandomBetween(-worldHeight/2, worldHeight/2)),
                                                                      new Vector(),
                                                                      new Vector(),
                                                                      2,
                                                                      0.03,
                                                                      eptfg_oriented_hunter);
                                           eptfg_hunter.color = eptfg_form_color_hunter.value;
                                           }
                                           else
                                           {
                                           eptfg_hunter = null;
                                           }
                                           });

eptfg_form_active_gatherer.addEventListener ("change", function(e){
                                             eptfg_EXISTS_gatherer = e.target.checked;
                                             if (e.target.checked)
                                             {
                                             var worldHeight = eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width;
                                             
                                             eptfg_gatherer = new Boid (eptfg_visualrepresentation_gatherer,
                                                                        eptfg_radius,
                                                                        new Vector (getRandomBetween(-eptfg_scenescale/2, eptfg_scenescale/2), getRandomBetween(-worldHeight/2, worldHeight/2)),
                                                                        new Vector(),
                                                                        new Vector(),
                                                                        2,
                                                                        0.03,
                                                                        eptfg_oriented_gatherer);
                                             eptfg_gatherer.color = eptfg_form_color_gatherer.value;
                                             }
                                             else
                                             {
                                             eptfg_gatherer = null;
                                             }
                                             });

eptfg_form_active_target.addEventListener ("change", function(e){
                                           eptfg_EXISTS_target = e.target.checked;
                                           if (e.target.checked)
                                           {
                                           var worldHeight = eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width;
                                           
                                           eptfg_target = new Vector (getRandomBetween (-eptfg_scenescale/2, eptfg_scenescale/2),
                                                                      getRandomBetween(-worldHeight/2, worldHeight/2));
                                           }
                                           else
                                           {
                                           eptfg_target = null;
                                           }
                                           });

function setDefaultValuesSteering()
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
    
    eptfg_form_radius.value = 5;
    
    eptfg_form_huntdistance.value = 200;
    eptfg_form_pursueweight.value = 1.0;
    
    eptfg_form_gatherdistance.value = 200;
    eptfg_form_seekweight.value = 1.0;
    eptfg_form_evadedistance.value = 200;
    eptfg_form_evadeweight.value = 1.0;
    
    eptfg_form_oriented_hunter.value = true;
    eptfg_form_visualrepresentation_image_hunter.checked = false;
    eptfg_form_visualrepresentation_shape_hunter.checked = true;
    eptfg_form_shape_circle_hunter.checked = false;
    eptfg_form_shape_square_hunter.checked = false;
    eptfg_form_shape_triangle_hunter.checked = true;
    eptfg_form_color_hunter.value = "#000000";
    
    eptfg_form_oriented_gatherer.value = true;
    eptfg_form_visualrepresentation_image_gatherer.checked = false;
    eptfg_form_visualrepresentation_shape_gatherer.checked = true;
    eptfg_form_shape_triangle_gatherer.checked = false;
    eptfg_form_shape_square_gatherer.checked = false;
    eptfg_form_shape_circle_gatherer.checked = true;
    eptfg_form_color_gatherer.value = "#000000";
    
    eptfg_form_visualrepresentation_image_target.checked = false;
    eptfg_form_visualrepresentation_shape_target.checked = true;
    eptfg_form_shape_triangle_target.checked = false;
    eptfg_form_shape_circle_target.checked = false;
    eptfg_form_shape_square_target.checked = true;
    eptfg_form_color_target.value = "#000000";
    
    eptfg_form_active_hunter.checked = true;
    eptfg_form_active_gatherer.checked = true;
    eptfg_form_active_target.checked = true;
}

eptfg_form_downloadbutton.addEventListener ("click", downloadCodeSteering);

function downloadCodeSteering()
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
                element.setAttribute ("href", "data:text/plain;charset=utf-8," + encodeURIComponent (library) + encodeURIComponent (generateCodeSteering()));
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

function generateCodeSteering()
{
    var generatedCode = '\n\nvar eptfg_canvas = document.getElementById("EasyPhysics");\n';
    generatedCode += 'eptfg_canvas.width = ' + eptfg_canvas.width + ';\n';
    generatedCode += 'eptfg_canvas.height = ' + eptfg_canvas.height + ';\n';
    generatedCode += 'var eptfg_context = eptfg_canvas.getContext("2d");\n\n';
    generatedCode += 'var eptfg_scenescale = ' + eptfg_scenescale + ';\n\n';
    generatedCode += 'var eptfg_dt = 1.0\n\n';
    generatedCode += 'var eptfg_radius = ' + eptfg_radius + ';\n\n';
    generatedCode += 'var eptfg_hunter;\n';
    generatedCode += 'var eptfg_gatherer;\n';
    generatedCode += 'var eptfg_target;\n\n';
    generatedCode += 'var eptfg_gatherdistance = ' + eptfg_gatherdistance + ';\n';
    generatedCode += 'var eptfg_evadedistance = ' + eptfg_evadedistance + ';\n';
    generatedCode += 'var eptfg_huntdistance = ' + eptfg_huntdistance + ';\n';
    generatedCode += 'var eptfg_seekweight = ' + eptfg_seekweight + ';\n';
    generatedCode += 'var eptfg_evadeweight = ' + eptfg_evadeweight + ';\n';
    generatedCode += 'var eptfg_pursueweight = ' + eptfg_pursueweight + ';\n\n';
    if (typeof (eptfg_visualrepresentation_hunter) == "string")
    {
        generatedCode += 'var eptfg_visualrepresentation_hunter = "' + eptfg_visualrepresentation_hunter + '";\n';
    }
    else if (eptfg_visualrepresentation_hunter instanceof Image)
    {
        generatedCode += 'var eptfg_visualrepresentation_hunter = new Image();\n';
        generatedCode += 'eptfg_visualrepresentation_hunter.src = "' + eptfg_visualrepresentation_hunter.src + '";\n';
    }
    else
    {
        generatedCode += 'var eptfg_visualrepresentation_hunter = "triangle";\n';
    }
    if (typeof (eptfg_visualrepresentation_gatherer) == "string")
    {
        generatedCode += 'var eptfg_visualrepresentation_gatherer = "' + eptfg_visualrepresentation_gatherer + '";\n';
    }
    else if (eptfg_visualrepresentation_gatherer instanceof Image)
    {
        generatedCode += 'var eptfg_visualrepresentation_gatherer = new Image();\n';
        generatedCode += 'eptfg_visualrepresentation_gatherer.src = "' + eptfg_visualrepresentation_gatherer.src + '";\n';
    }
    else
    {
        generatedCode += 'var eptfg_visualrepresentation_gatherer = "triangle";\n';
    }
    if (typeof (eptfg_visualrepresentation_target) == "string")
    {
        generatedCode += 'var eptfg_visualrepresentation_target = "' + eptfg_visualrepresentation_target + '";\n';
    }
    else if (eptfg_visualrepresentation_target instanceof Image)
    {
        generatedCode += 'var eptfg_visualrepresentation_target = new Image();\n';
        generatedCode += 'eptfg_visualrepresentation_target.src = "' + eptfg_visualrepresentation_target.src + '";\n';
    }
    else
    {
        generatedCode += 'var eptfg_visualrepresentation_target = "triangle";\n';
    }
    generatedCode += 'var eptfg_oriented_hunter = ' + eptfg_oriented_hunter + ';\n';
    generatedCode += 'var eptfg_oriented_gatherer = ' + eptfg_oriented_gatherer + ';\n';
    generatedCode += 'var eptfg_color_hunter = "' + eptfg_color_hunter + '";\n';
    generatedCode += 'var eptfg_color_gatherer = "' + eptfg_color_gatherer + '";\n';
    generatedCode += 'var eptfg_color_target = "' + eptfg_color_target + '";\n';
    generatedCode += 'var eptfg_EXISTS_hunter = ' + eptfg_EXISTS_hunter + ';\n';
    generatedCode += 'var eptfg_EXISTS_gatherer = ' + eptfg_EXISTS_gatherer + ';\n';
    generatedCode += 'var eptfg_EXISTS_target = ' + eptfg_EXISTS_target + ';\n\n';
    generatedCode += 'function eptfg_initSteering()\n';
    generatedCode += '{\n';
    generatedCode += '    eptfg_dt = 1.0;\n\n';
    generatedCode += '    var worldHeight = eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width;\n\n';
    generatedCode += '    if (eptfg_EXISTS_hunter)\n';
    generatedCode += '    {\n';
    generatedCode += '        eptfg_hunter = new Boid (eptfg_visualrepresentation_hunter,\n';
    generatedCode += '                                 eptfg_radius,\n';
    generatedCode += '                                 new Vector (getRandomBetween(-eptfg_scenescale/2, eptfg_scenescale/2), getRandomBetween(-worldHeight/2, worldHeight/2)),\n';
    generatedCode += '                                 new Vector(),\n';
    generatedCode += '                                 new Vector(),\n';
    generatedCode += '                                 2,\n';
    generatedCode += '                                 0.3,\n';
    generatedCode += '                                 eptfg_oriented_hunter);\n';
    generatedCode += '        eptfg_hunter.color = eptfg_color_hunter;\n';
    generatedCode += '    }\n';
    generatedCode += '    else\n';
    generatedCode += '    {\n';
    generatedCode += '        eptfg_hunter = null;\n';
    generatedCode += '    }\n\n';
    generatedCode += '    if (eptfg_EXISTS_gatherer)\n';
    generatedCode += '    {\n';
    generatedCode += '        eptfg_gatherer = new Boid (eptfg_visualrepresentation_gatherer,\n';
    generatedCode += '                                  eptfg_radius,\n';
    generatedCode += '                                  new Vector (getRandomBetween(-eptfg_scenescale/2, eptfg_scenescale/2), getRandomBetween(-worldHeight/2, worldHeight/2)),\n';
    generatedCode += '                                  new Vector(),\n';
    generatedCode += '                                  new Vector(),\n';
    generatedCode += '                                  2,\n';
    generatedCode += '                                  0.3,\n';
    generatedCode += '                                  eptfg_oriented_gatherer);\n';
    generatedCode += '        eptfg_gatherer.color = eptfg_color_gatherer;\n';
    generatedCode += '    }\n';
    generatedCode += '    else\n';
    generatedCode += '    {\n';
    generatedCode += '        eptfg_gatherer = null;\n';
    generatedCode += '    }\n\n';
    generatedCode += '    if (eptfg_EXISTS_target)\n';
    generatedCode += '    {\n';
    generatedCode += '        eptfg_target = new Vector (getRandomBetween(-eptfg_scenescale/2, eptfg_scenescale/2), getRandomBetween(-worldHeight/2, worldHeight/2));\n';
    generatedCode += '    }\n';
    generatedCode += '    else\n';
    generatedCode += '    {\n';
    generatedCode += '        eptfg_target = null;\n';
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
    generatedCode += '    if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null))\n';
    generatedCode += '    {\n';
    generatedCode += '        var targetDoesntExistOrIsFar = true;\n';
    generatedCode += '        var hunterDoesntExistOrIsFar = true;\n\n';
    generatedCode += '        if (!(typeof (eptfg_target) === "undefined" || eptfg_target === null))\n';
    generatedCode += '        {\n';
    generatedCode += '            if (Vector.dist (eptfg_gatherer.location, eptfg_target) <= eptfg_gatherdistance)\n';
    generatedCode += '            {\n';
    generatedCode += '                targetDoesntExistOrIsFar = false;\n\n';
    generatedCode += '                var seek = eptfg_gatherer.seekIfNear (eptfg_target, eptfg_gatherdistance);\n';
    generatedCode += '                seek.mult (eptfg_seekweight);\n';
    generatedCode += '                eptfg_gatherer.applyForce (seek);\n';
    generatedCode += '            }\n';
    generatedCode += '        }\n';
    generatedCode += '        if (!(typeof (eptfg_hunter) === "undefined" || eptfg_hunter === null))\n';
    generatedCode += '        {\n';
    generatedCode += '            if (Vector.dist (eptfg_gatherer.location, eptfg_hunter.location) <= eptfg_evadedistance)\n';
    generatedCode += '            {\n';
    generatedCode += '                hunterDoesntExistOrIsFar = false;\n\n';
    generatedCode += '                var evade = eptfg_gatherer.evadeIfNear (eptfg_hunter, eptfg_evadedistance, eptfg_dt);\n';
    generatedCode += '                evade.mult (eptfg_evadeweight);\n';
    generatedCode += '                eptfg_gatherer.applyForce (evade);\n';
    generatedCode += '            }\n';
    generatedCode += '        }\n';
    generatedCode += '        if (targetDoesntExistOrIsFar && hunterDoesntExistOrIsFar)\n';
    generatedCode += '        {\n';
    generatedCode += '            var wander = eptfg_gatherer.wander();\n';
    generatedCode += '            eptfg_gatherer.applyForce (wander);\n';
    generatedCode += '        }\n';
    generatedCode += '    }\n\n';
    generatedCode += '    if (!(typeof (eptfg_hunter) === "undefined" || eptfg_hunter === null))\n';
    generatedCode += '    {\n';
    generatedCode += '        var gathererDoesntExistOrIsFar = true;\n\n';
    generatedCode += '        if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null))\n';
    generatedCode += '        {\n';
    generatedCode += '            if (Vector.dist (eptfg_hunter.location, eptfg_gatherer.location) <= eptfg_huntdistance)\n';
    generatedCode += '            {\n';
    generatedCode += '                gathererDoesntExistOrIsFar = false;\n\n';
    generatedCode += '                var pursue = eptfg_hunter.pursueIfNear (eptfg_gatherer, eptfg_huntdistance, eptfg_dt);\n';
    generatedCode += '                pursue.mult (eptfg_pursueweight);\n';
    generatedCode += '                eptfg_hunter.applyForce (pursue);\n';
    generatedCode += '            }\n';
    generatedCode += '        }\n';
    generatedCode += '        if (gathererDoesntExistOrIsFar)\n';
    generatedCode += '        {\n';
    generatedCode += '            var wander = eptfg_hunter.wander();\n';
    generatedCode += '            eptfg_hunter.applyForce (wander);\n';
    generatedCode += '        }\n';
    generatedCode += '    }\n\n';
    generatedCode += '    if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null)) eptfg_gatherer.update (eptfg_dt);\n';
    generatedCode += '    if (!(typeof (eptfg_hunter) === "undefined" || eptfg_hunter === null)) eptfg_hunter.update (eptfg_dt);\n\n';
    generatedCode += '    if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null) &&\n';
    generatedCode += '        !(typeof (eptfg_target) === "undefined" || eptfg_target === null) &&\n';
    generatedCode += '        Vector.dist (eptfg_gatherer.location, eptfg_target) < eptfg_gatherer.radius * 2)\n';
    generatedCode += '    {\n';
    generatedCode += '        eptfg_target.x = getRandomBetween (-eptfg_scenescale/2, eptfg_scenescale/2);\n';
    generatedCode += '        eptfg_target.y = getRandomBetween (-eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2, eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2);\n';
    generatedCode += '    }\n';
    generatedCode += '    if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null))\n';
    generatedCode += '    {\n';
    generatedCode += '        eptfg_gatherer.borders (-eptfg_scenescale/2,\n';
    generatedCode += '                                eptfg_scenescale/2,\n';
    generatedCode += '                                -eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2,\n';
    generatedCode += '                                eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2);\n';
    generatedCode += '    }\n';
    generatedCode += '    if (!(typeof (eptfg_hunter) === "undefined" || eptfg_hunter === null))\n';
    generatedCode += '    {\n';
    generatedCode += '        eptfg_hunter.borders (-eptfg_scenescale/2,\n';
    generatedCode += '                              eptfg_scenescale/2,\n';
    generatedCode += '                              -eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2,\n';
    generatedCode += '                              eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2);\n';
    generatedCode += '    }\n';
    generatedCode += '    if (!(typeof (eptfg_target) === "undefined" || eptfg_target === null)) drawTarget (eptfg_target, eptfg_radius, eptfg_visualrepresentation_target, eptfg_color_target, eptfg_context);\n';
    generatedCode += '    if (!(typeof (eptfg_gatherer) === "undefined" || eptfg_gatherer === null)) eptfg_gatherer.display (eptfg_context);\n';
    generatedCode += '    if (!(typeof (eptfg_hunter) === "undefined" || eptfg_hunter === null)) eptfg_hunter.display (eptfg_context);\n\n';
    generatedCode += '    eptfg_context.restore();\n';
    generatedCode += '}\n\n';
    generatedCode += 'eptfg_initSteering();\n\n';
    generatedCode += 'eptfg_animationLoop();\n\n';
    generatedCode += 'function drawTarget (location, radius, visualrepresentation, color, context)\n';
    generatedCode += '{\n';
    generatedCode += '    context.save();\n';
    generatedCode += '    context.fillStyle = color;\n\n';
    generatedCode += '    if (typeof (visualrepresentation) == "string")\n';
    generatedCode += '    {\n';
    generatedCode += '        switch (visualrepresentation)\n';
    generatedCode += '        {\n';
    generatedCode += '            case "square":\n';
    generatedCode += '                context.fillRect (location.x-radius, location.y-radius, 2*radius, 2*radius);\n';
    generatedCode += '                break;\n';
    generatedCode += '            case "circle":\n';
    generatedCode += '                context.beginPath();\n';
    generatedCode += '                context.arc (location.x, location.y, radius, 0, 2*Math.PI);\n';
    generatedCode += '                context.closePath();\n';
    generatedCode += '                context.fill();\n';
    generatedCode += '                break;\n';
    generatedCode += '            case "triangle":\n';
    generatedCode += '                context.save();\n';
    generatedCode += '                context.transform (1, 0, 0, 1, location.x, location.y);\n';
    generatedCode += '                context.beginPath();\n';
    generatedCode += '                context.moveTo (radius, 0);\n';
    generatedCode += '                context.lineTo (-radius, -3*radius/5);\n';
    generatedCode += '                context.lineTo (-radius, 3*radius/5);\n';
    generatedCode += '                context.closePath();\n';
    generatedCode += '                context.fill();\n';
    generatedCode += '                context.restore();\n';
    generatedCode += '                break;\n';
    generatedCode += '            default:\n';
    generatedCode += '                context.beginPath();\n';
    generatedCode += '                context.arc (location.x, location.y, radius, 0, 2*Math.PI, false);\n';
    generatedCode += '                context.closePath();\n';
    generatedCode += '                context.fill();\n';
    generatedCode += '        }\n';
    generatedCode += '    }\n';
    generatedCode += '    else if (visualrepresentation instanceof Image)\n';
    generatedCode += '    {\n';
    generatedCode += '        context.save();\n';
    generatedCode += '        context.transform (1, 0, 0, 1, location.x, location.y);\n';
    generatedCode += '        context.drawImage (visualrepresentation, -radius, -radius, 2*radius, 2*radius);\n';
    generatedCode += '        context.restore();\n';
    generatedCode += '    }\n';
    generatedCode += '    else\n';
    generatedCode += '    {\n';
    generatedCode += '        context.fillRect (location.x-radius, location.y-radius, 2*radius, 2*radius);\n';
    generatedCode += '    }\n\n';
    generatedCode += '    context.restore();\n';
    generatedCode += '}\n';
 
    return generatedCode;
}
