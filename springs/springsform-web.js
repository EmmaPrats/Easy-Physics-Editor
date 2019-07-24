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

var eptfg_form_mass = document.getElementById("input-mass");
var eptfg_form_stiffness = document.getElementById("input-stiffness");
var eptfg_form_damping = document.getElementById("input-damping");

var eptfg_form_text = document.getElementById("input-text");
var eptfg_form_showtext = document.getElementById("input-showtext");
var eptfg_form_font = document.getElementById("input-font");
var eptfg_form_size = document.getElementById("input-size");
var eptfg_form_color = document.getElementById("input-color");

var eptfg_form_textlocationX = document.getElementById("input-textlocationX");
var eptfg_form_textlocationY = document.getElementById("input-textlocationY");


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


eptfg_form_mass.addEventListener ("change", function(e) {
                                  eptfg_mass = e.target.value;
                                  for (var i=0; i<eptfg_letters.length; i++)
                                  {
                                  eptfg_letters[i].mass = e.target.value;
                                  }
                                  });
eptfg_form_stiffness.addEventListener ("change", function(e) {
                                       eptfg_stiffness = e.target.value;
                                       for (var i=0; i<eptfg_springs.length; i++)
                                       {
                                       eptfg_springs[i].stiffness = e.target.value;
                                       }
                                       });
eptfg_form_damping.addEventListener ("change", function(e) {
                                       eptfg_damping = e.target.value;
                                       for (var i=0; i<eptfg_springs.length; i++)
                                       {
                                       eptfg_springs[i].damping = 1 - 0.1 * e.target.value;
                                       }
                                       });

eptfg_form_text.addEventListener ("change", function(e){
                                  eptfg_text=e.target.value;
                                  eptfg_letterlocations = [];
                                  for (var i=0; i<eptfg_text.length; i++)
                                  {
                                  eptfg_letterlocations.push (new Vector (i-1, 0));
                                  }
                                  eptfg_initSprings();
                                  });
eptfg_form_showtext.addEventListener ("change", function(e){eptfg_SHOWTEXT=e.target.checked;});
eptfg_form_font.addEventListener ("change", function(e){eptfg_font=e.target.value;eptfg_initSprings();});
eptfg_form_size.addEventListener ("change", function(e){eptfg_size=e.target.value;eptfg_initSprings();});
eptfg_form_color.addEventListener ("change", function(e){
                                   eptfg_color = e.target.value;
                                   for (var i=0; i<eptfg_letters.length; i++)
                                   {
                                   eptfg_letters[i].color = e.target.value;
                                   eptfg_letters[i].visualrepresentation.color = e.target.value;
                                   }
                                   });

eptfg_form_textlocationX.addEventListener ("change", function(e){eptfg_textlocation.x=e.target.value;});
eptfg_form_textlocationY.addEventListener ("change", function(e){eptfg_textlocation.y=e.target.value;});

function letterLocationChange (index, axis, value)
{
    console.log ("Current eptfg_letterlocations:");
    console.log (eptfg_letterlocations);
    if (axis == "x")
    {
        eptfg_letterlocations[index].x = 1 * value;
    }
    else if (axis == "y")
    {
        eptfg_letterlocations[index].y = 1 * value;
    }
    eptfg_initSprings();
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
    
    eptfg_form_scene_scale.value = 11;
    eptfg_form_zoomlabel.value = 11;
    
    eptfg_form_mass.value = 1;
    eptfg_form_stiffness.value = 150;
    eptfg_form_damping.value = 3;
    
    eptfg_form_text.value = "TFG";
    eptfg_form_showtext.checked = true;
    eptfg_form_font.value = "Arial";
    eptfg_form_size.value = 1;
    eptfg_form_color.value = "#000000";
    
    eptfg_form_textlocationX.value = -1;
    eptfg_form_textlocationY.value = 0;
    
    //initParams();
    //eptfg_initSprings();
}
