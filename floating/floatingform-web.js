"use strict";

//TODO crec que borders no funciona bé

if (typeof eptfg_canvas === "undefined")
{
    window.eptfg_canvas = document.getElementById("eptfg-canvas");
}
if (typeof eptfg_context === "undefined")
{
    window.eptfg_context = eptfg_canvas.getContext("2d");
}

//a reference to each item in the form //TODO borrar els que no utilitze
//var eptfg_flex_container = document.getElementById("eptfg-canvas-container");

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
var eptfg_form_waterline = document.getElementById("waterline");
var eptfg_form_waterlinelabel = document.getElementById("waterlinelabel");
var eptfg_form_floor = document.getElementById("floor");
var eptfg_form_floorlabel = document.getElementById("floorlabel");

var eptfg_form_gravity = document.getElementById("input-gravity");
var eptfg_form_mass = document.getElementById("input-mass");
var eptfg_form_liquiddensity = document.getElementById("input-liquiddensity");

var eptfg_form_visualrepresentation_text = document.getElementById("input-visualrepresentation-text");
var eptfg_form_visualrepresentation_image = document.getElementById("input-visualrepresentation-image");

var eptfg_form_text = document.getElementById("input-text");
var eptfg_form_fonts = document.getElementById("input-fonts");
var eptfg_form_font = document.getElementById("input-font");
var eptfg_form_image = document.getElementById("input-image");
var eptfg_form_quantity = document.getElementById("input-quantity");
var eptfg_form_size = document.getElementById("input-size");
var eptfg_form_color = document.getElementById("input-color");

var eptfg_form_color_water = document.getElementById("input-color-water");
var eptfg_form_opacity = document.getElementById("input-opacity");

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
        eptfg_canvas.parentElement.style.height = (offset(eptfg_canvas) + y + offsetBottom) + "px";
        eptfg_canvas_width.innerHTML = eptfg_canvas.width;
        eptfg_canvas_height.innerHTML = eptfg_canvas.height;
        
        eptfg_draw();
        repositionWaterLevelAndFloor();
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

eptfg_form_scene_scale.addEventListener ("input", function(e){
                                         eptfg_scenescale = e.target.value;
                                         eptfg_form_zoomlabel.value = e.target.value;
                                         });
eptfg_form_zoomlabel.addEventListener ("change", function(e){
                                       eptfg_form_scene_scale.value = e.target.value;
                                       eptfg_scenescale = e.target.value;
                                       });

eptfg_form_waterline.addEventListener ("change", function(e){
                                       eptfg_form_waterlinelabel.value = e.target.value;
                                       eptfg_waterline = e.target.value;
                                       });

eptfg_form_waterlinelabel.addEventListener ("change", function(e){
                                            eptfg_form_waterline.value = e.target.value;
                                            eptfg_waterline = e.target.value;
                                            });

eptfg_form_floor.addEventListener ("change", function(e){
                                   eptfg_floor = e.target.value;
                                   eptfg_form_floorlabel.value = e.target.value;
                                   });

eptfg_form_floorlabel.addEventListener ("change", function(e){
                                   eptfg_floor = e.target.value;
                                   eptfg_form_floor.value = e.target.value;
                                   });

function repositionWaterLevelAndFloor()
{
    var old_waterlevel = eptfg_form_waterline.value;
    
    var old_waterlevel_min = eptfg_form_waterline.min;
    var old_waterlevel_max = eptfg_form_waterline.max;
    var old_waterlevel_step = eptfg_form_waterline.step;
    
    var old_world_height = old_waterlevel_max * 2;
    
    var new_world_height = eptfg_form_scene_scale.value * eptfg_canvas.height / eptfg_canvas.width;
    
    var new_waterlevel = old_waterlevel * new_world_height / old_world_height;
    eptfg_waterline = new_waterlevel;
    
    eptfg_form_waterline.min = -new_world_height / 2;
    eptfg_form_waterline.max = new_world_height / 2;
    eptfg_form_waterline.step = new_world_height / 20;
    eptfg_form_waterline.value = new_waterlevel;
    
    eptfg_form_waterlinelabel.min = -new_world_height / 2;
    eptfg_form_waterlinelabel.max = new_world_height / 2;
    eptfg_form_waterlinelabel.step = new_world_height / 20;
    eptfg_form_waterlinelabel.value = new_waterlevel;
    
    var old_floor = eptfg_form_floor.value;
    
    var old_floor_min = eptfg_form_floor.min;
    var old_floor_max = eptfg_form_floor.max;
    var old_floor_step = eptfg_form_floor.step;
    
    var new_floor = old_floor * new_world_height / old_world_height;
    eptfg_floor = new_floor;
    
    var step = (new_world_height / 2 - new_waterlevel ) / 4;
    eptfg_form_floor.min = new_waterlevel + step;
    eptfg_form_floor.max = new_waterlevel + 6 * step;
    eptfg_form_floor.step = step;
    eptfg_form_floor.value = 1 * new_floor;
    
    eptfg_form_floorlabel.min = new_waterlevel + step;
    eptfg_form_floorlabel.max = new_waterlevel + 6 * step;
    eptfg_form_floorlabel.step = step;
    eptfg_form_floorlabel.value = 1 * new_floor;
}

eptfg_form_gravity.addEventListener ("change", function(e){eptfg_gravity.y = e.target.value;});
eptfg_form_mass.addEventListener ("change", function(e) {
                                  eptfg_mass = e.target.value;
                                  for (var i=0; i<eptfg_letters.length; i++)
                                  {
                                  eptfg_letters[i].mass = e.target.value;
                                  eptfg_letters[i].pointMass = e.target.value / eptfg_letters[i].points.length;
                                  }
                                  for (var i=0; i<eptfg_images.length; i++)
                                  {
                                  eptfg_images[i].mass = e.target.value;
                                  eptfg_images[i].pointMass = e.target.value / eptfg_images[i].points.length;
                                  }
                                  });
eptfg_form_liquiddensity.addEventListener ("change", function(e){eptfg_liquidDensity = e.target.value;});

var inputvisualrepresentation = document.getElementsByName("input-visualrepresentation");
for (var i=0; i<inputvisualrepresentation.length; i++)
{
    inputvisualrepresentation[i].addEventListener ("change", visualrepresentationChange);
}

function visualrepresentationChange (event)
{
    eptfg_MUSTUPLOADIMAGE = false;
    if (eptfg_form_visualrepresentation_text.checked && eptfg_visualrepresentation != "text")
    {
        eptfg_visualrepresentation = "text";
    }
    else if (eptfg_form_visualrepresentation_image.checked && eptfg_visualrepresentation != "image")
    {
        eptfg_visualrepresentation = "image";
        if (!(typeof(eptfg_formhandler_image) === "undefined" || eptfg_formhandler_image === null))
        {
            eptfg_image = new Image();
            eptfg_image.src = eptfg_formhandler_image.src;
        }
        else
        {
            eptfg_MUSTUPLOADIMAGE = true;
        }
    }
    
    eptfg_initFlotacion();
}

eptfg_form_text.addEventListener ("change", function(e){eptfg_text=e.target.value;eptfg_initFlotacion();});
eptfg_form_font.addEventListener ("change", function(e){
                                  if (e.target.value != "")
                                  {
                                  eptfg_font=e.target.value;
                                  eptfg_initFlotacion();
                                  }
                                  else
                                  {
                                  eptfg_font=eptfg_form_fonts.value;
                                  eptfg_initFlotacion();
                                  }
                                  });
eptfg_form_fonts.addEventListener ("change", function(e){console.log (eptfg_form_font.value);
                                   if (eptfg_form_font.value == "")
                                   {
                                   eptfg_font=e.target.value;
                                   eptfg_initFlotacion();
                                   }
                                   }
                                  );

eptfg_form_image.addEventListener ("change", function(event){
                                   var file = event.target.files && event.target.files[0];
                                   //TODO drawing.src = window.URL.createObjectURL(file);
                                   });

eptfg_form_image.addEventListener ("change", imageChange);

function imageChange (event)
{
    var file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.onload = function()
    {
        eptfg_form_visualrepresentation_text.checked = false;
        eptfg_form_visualrepresentation_image.checked = true;
        eptfg_visualrepresentation = "image";
        eptfg_formhandler_image = new Image();
        eptfg_formhandler_image.src = reader.result;
        eptfg_image = new Image();
        eptfg_image.src = eptfg_formhandler_image.src;
        eptfg_MUSTUPLOADIMAGE = false;
        eptfg_initFlotacion();
    }
    if (file)
    {
        reader.readAsDataURL (file);
    }
}

eptfg_form_quantity.addEventListener ("change", function(e){eptfg_quantity=e.target.value;eptfg_initFlotacion();});

eptfg_form_size.addEventListener ("change", function(e){eptfg_size=1*e.target.value;eptfg_initFlotacion();});

eptfg_form_color.addEventListener ("change", function(e){
                                   eptfg_color = e.target.value;
                                   for (var i=0; i<eptfg_letters.length; i++)
                                   {
                                   eptfg_letters[i].color = e.target.value;
                                   }
                                   });

eptfg_form_color_water.addEventListener ("change", function(e){eptfg_color_water = e.target.value;});
eptfg_form_opacity.addEventListener ("change", function(e){eptfg_color_opacity = e.target.value;});

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
    
    eptfg_form_scene_scale.value = 5;
    eptfg_form_zoomlabel.value = 5;
    eptfg_form_waterline.value = 0;
    eptfg_form_waterlinelabel.value = 0;
    eptfg_form_floor.value = 1.875;
    eptfg_form_floorlabel.value = 1.875;
    
    eptfg_form_gravity.value = 9.81;
    eptfg_form_mass.value = 500;
    eptfg_form_liquiddensity.value = 1000;
    
    eptfg_form_visualrepresentation_text.checked = true;
    eptfg_form_visualrepresentation_image.checked = false;
    
    eptfg_form_text.value = "TFG";
    eptfg_form_font.value = "Arial";
    eptfg_form_quantity.value = 1;
    eptfg_form_size.value = 1;
    
    eptfg_form_color_water.value = "#0000FF";
    eptfg_form_opacity.value = 0.7;
    
    document.getElementById("input-text").parentElement.style.display = "block";
    document.getElementById("input-font").parentElement.style.display = "block";
    document.getElementById("input-image").parentElement.style.display = "none";
    document.getElementById("input-quantity").parentElement.style.display = "none";
    
    //initParams();
    //eptfg_initFlotacion();
}
