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
var eptfg_form_fonts = document.getElementById("input-fonts");
var eptfg_form_size = document.getElementById("input-size");
var eptfg_form_color = document.getElementById("input-color");

var eptfg_form_textlocationX = document.getElementById("input-textlocationX");
var eptfg_form_textlocationY = document.getElementById("input-textlocationY");

var eptfg_form_positioningmode = document.getElementById("input-positioningmode");

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
        //eptfg_canvas.parentElement.style.height = (offset(eptfg_canvas) + y + offsetBottom) + "px";
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
                                           setDefaultValuesSprings();
                                           restartSimulationSprings();
                                           }
                                           });
eptfg_form_restartsimulation.addEventListener ("click", restartSimulationSprings);

function restartSimulationSprings()
{
    eptfg_GRID = eptfg_form_grid.checked;
    eptfg_scenescale = eptfg_form_scene_scale.value * 1.0;
    eptfg_mass = eptfg_form_mass.value * 1.0;
    eptfg_stiffness = eptfg_form_stiffness.value * 1.0;
    eptfg_damping = eptfg_form_damping.value * 1.0;
    eptfg_SHOWTEXT = eptfg_form_showtext.checked;
    eptfg_text = eptfg_form_text.value;
    eptfg_textlocation = new Vector (eptfg_form_textlocationX.value*1.0, eptfg_form_textlocationY.value*1.0);
    eptfg_POSITIONINGMODE = eptfg_form_positioningmode.checked;
    eptfg_font = eptfg_form_fonts.value;
    if (eptfg_form_font.value != "")
    {
        eptfg_font = eptfg_form_font.value;
    }
    eptfg_size = eptfg_form_size.value * 1.0;
    eptfg_color = eptfg_form_color.value;
    
    eptfg_initSprings();
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
                                  for (var i=0; i<e.target.value.length; i++)
                                  {
                                  eptfg_letterlocations.push (new Vector (i * 0.5, 0));
                                  }
                                  eptfg_initSprings();
                                  });
eptfg_form_showtext.addEventListener ("change", function(e){eptfg_SHOWTEXT=e.target.checked;});
eptfg_form_font.addEventListener ("change", function(e){
                                  if (e.target.value != "")
                                  {
                                  eptfg_font=e.target.value;
                                  eptfg_initSprings();
                                  }
                                  else
                                  {
                                  eptfg_font=eptfg_form_fonts.value;
                                  eptfg_initSprings();
                                  }
                                  });
eptfg_form_fonts.addEventListener ("change", function(e){console.log (eptfg_form_font.value);
                                   if (eptfg_form_font.value == "")
                                   {
                                   eptfg_font=e.target.value;
                                   eptfg_initSprings();
                                   }
                                   }
                                   );
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
    console.log ("index = " + index + " \naxis = " + axis + "\nvalue = " + value);
    console.log ("Current eptfg_letters:");
    console.log (eptfg_letters);
    if (axis == "x")
    {
        eptfg_letterlocations[index].x = 1 * value;
        eptfg_letters[index].location.x = 1 * value;
        eptfg_springs[index].origin.x = 1 * value;
    }
    else if (axis == "y")
    {
        eptfg_letterlocations[index].y = 1 * value;
        eptfg_letters[index].location.y = 1 * value;
        eptfg_springs[index].origin.y = 1 * value;
    }
}

eptfg_form_positioningmode.addEventListener ("change", function(e){
                                             eptfg_POSITIONINGMODE = e.target.checked;
                                             for (var i=0; i<eptfg_letters.length; i++)
                                             {
                                             eptfg_letters[i].location.x = eptfg_springs[i].origin.x;
                                             eptfg_letters[i].location.y = eptfg_springs[i].origin.y;
                                             }
                                             }
                                            );

eptfg_canvas.addEventListener ("mousedown", canvasMouseDown);
eptfg_canvas.addEventListener ("mousemove", canvasMouseMove);
eptfg_canvas.addEventListener ("mouseup", canvasMouseUp);

var FLAG_DRAGGING = false;
var FLAG_DRAGGING_TEXT = false;
var letterBeingDragged;
function canvasMouseDown (event)
{
    console.log ("event.clientX = " + event.clientX + "\nevent.clientY = " + event.clientY);
    
    var x = event.clientX - offset(eptfg_canvas).left;
    var y = event.clientY - offset(eptfg_canvas).top;
    console.log ("event.clientX - offset(eptfg_canvas).left = " + (event.clientX - offset(eptfg_canvas).left) + "\nevent.clientY - offset(eptfg_canvas).top = " + (event.clientY - offset(eptfg_canvas).top));
    //Ara tenim la posició en el canvas. NO FUNCIONA AMB SCROLL, PERÒ SÍ AMB ZOOM
    
    var zoom = eptfg_canvas.width / eptfg_scenescale;
    var mousePos_world = new Vector ((x - eptfg_canvas.width/2) / zoom, (y - eptfg_canvas.height/2) / zoom);
    var x_world = (x - eptfg_canvas.width/2) / zoom;
    var y_world = (y - eptfg_canvas.height/2) / zoom;
    console.log ("x_world = " + x_world + "\ny_world = " + y_world);
    //Ara tenim la posició en coordenades del món. NO FUNCIONA AMB SCROLL, PERÒ SÍ AMB ZOOM
    
    for (var i=0; i<eptfg_letters.length; i++)
    {
        if (Vector.dist (mousePos_world, eptfg_letters[i].location) <= 0.2*eptfg_letters[i].visualrepresentation.size)
        {
            FLAG_DRAGGING = true;
            letterBeingDragged = i;
            console.log ("Letter being dragged: " + i);
        }
    }
    
    if (!FLAG_DRAGGING)
    {
        if (Vector.dist (mousePos_world, eptfg_textlocation) <= 0.2*eptfg_size)
        {
            FLAG_DRAGGING_TEXT = true;
        }
    }
}

function canvasMouseMove (event)
{
    if (FLAG_DRAGGING)
    {
        var x = event.clientX - offset(eptfg_canvas).left;
        var y = event.clientY - offset(eptfg_canvas).top;
        
        var zoom = eptfg_canvas.width / eptfg_scenescale;
        
        eptfg_letters[letterBeingDragged].location.x = (x - eptfg_canvas.width/2) / zoom;
        eptfg_letters[letterBeingDragged].location.y = (y - eptfg_canvas.height/2) / zoom;
        
        eptfg_letterlocations[letterBeingDragged].x = (x - eptfg_canvas.width/2) / zoom;
        eptfg_letterlocations[letterBeingDragged].y = (y - eptfg_canvas.height/2) / zoom;
        
        eptfg_springs[letterBeingDragged].origin.x = (x - eptfg_canvas.width/2) / zoom;
        eptfg_springs[letterBeingDragged].origin.y = (y - eptfg_canvas.height/2) / zoom;
        
        document.getElementById("letter-" + letterBeingDragged + "-x").value = (x - eptfg_canvas.width/2) / zoom;
        document.getElementById("letter-" + letterBeingDragged + "-y").value = (y - eptfg_canvas.height/2) / zoom;
        
        eptfg_draw();
    }
    else if (FLAG_DRAGGING_TEXT)
    {
        var x = event.clientX - offset(eptfg_canvas).left;
        var y = event.clientY - offset(eptfg_canvas).top;
        
        var zoom = eptfg_canvas.width / eptfg_scenescale;
        
        eptfg_textlocation.x = (x - eptfg_canvas.width/2) / zoom;
        eptfg_textlocation.y = (y - eptfg_canvas.height/2) / zoom;
        
        eptfg_form_textlocationX.value = (x - eptfg_canvas.width/2) / zoom;
        eptfg_form_textlocationY.value = (y - eptfg_canvas.height/2) / zoom;
        
        eptfg_draw();
    }
}

function canvasMouseUp (event)
{
    FLAG_DRAGGING = false;
    FLAG_DRAGGING_TEXT = false;
}


//TODO manual = bad
function setDefaultValuesSprings()
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
    
    eptfg_form_scene_scale.value = 11;
    eptfg_form_zoomlabel.value = 11;
    
    eptfg_form_mass.value = 1;
    eptfg_form_stiffness.value = 150;
    eptfg_form_damping.value = 3;
    
    eptfg_form_text.value = "TFG";
    eptfg_form_showtext.checked = true;
    eptfg_form_textlocationX.value = 0;
    eptfg_form_textlocationY.value = 0;
    eptfg_form_positioningmode.checked = false;
    
    eptfg_form_font.value = "";
    eptfg_form_fonts.value = "Arial";
    eptfg_form_size.value = 1;
    eptfg_form_color.value = "#000000";
    
    refreshLetterPositionInputs();
    
    eptfg_letterlocations = [];
    for (var i=0; i<eptfg_form_text.value.length; i++)
    {
        eptfg_letterlocations.push (new Vector (i * 0.5, 0));
    }
}

eptfg_form_downloadbutton.addEventListener ("click", downloadCodeSprings);

function downloadCodeSprings()
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
                element.setAttribute ("href", "data:text/plain;charset=utf-8," + encodeURIComponent (library) + encodeURIComponent (generateCodeSprings()));
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

function generateCodeSprings()
{
    var generatedCode = '\n\nvar eptfg_canvas = document.getElementById("EasyPhysics");\n';
    generatedCode += 'eptfg_canvas.width = ' + eptfg_canvas.width + ';\n';
    generatedCode += 'eptfg_canvas.height = ' + eptfg_canvas.height + ';\n';
    generatedCode += 'var eptfg_context = eptfg_canvas.getContext("2d");\n\n';
    generatedCode += 'var eptfg_scenescale = ' + eptfg_scenescale + ';\n';
    generatedCode += 'var eptfg_dt = 0.01;\n\n';
    generatedCode += 'var eptfg_mass = ' + eptfg_mass + ';\n';
    generatedCode += 'var eptfg_stiffness = ' + eptfg_stiffness + ';\n';
    generatedCode += 'var eptfg_damping = ' + eptfg_damping + ';\n\n';
    generatedCode += 'var eptfg_letters;\n';
    generatedCode += 'var eptfg_springs;\n\n';
    generatedCode += 'var eptfg_font = "' + eptfg_font + '";\n';
    generatedCode += 'var eptfg_size = ' + eptfg_size + ';\n';
    generatedCode += 'var eptfg_color = "' + eptfg_color + '";\n\n';
    generatedCode += 'var eptfg_mousePos;\n\n';
    generatedCode += 'function offset (el)\n';
    generatedCode += '{\n';
    generatedCode += '    var rect = el.getBoundingClientRect(),\n';
    generatedCode += '    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,\n';
    generatedCode += '    scrollTop = window.pageYOffset || document.documentElement.scrollTop;\n';
    generatedCode += '    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }\n';
    generatedCode += '}\n\n';
    generatedCode += 'eptfg_canvas.addEventListener ("mousemove", function(e){\n';
    generatedCode += '                               eptfg_mousePos.x = event.clientX - offset(eptfg_canvas).left;\n';
    generatedCode += '                               eptfg_mousePos.y = event.clientY - offset(eptfg_canvas).top;\n';
    generatedCode += '                               });\n\n';
    generatedCode += 'function eptfg_initSprings()\n';
    generatedCode += '{\n';
    generatedCode += '    eptfg_dt = 0.01;\n\n';
    generatedCode += '    eptfg_letters = [];\n';
    generatedCode += '    eptfg_springs = [];\n\n';
    for (var i=0; i<eptfg_letters.length; i++)
    {
        generatedCode += '    eptfg_letters.push (new Particle (new Character ("' + eptfg_letters[i].visualrepresentation.character + '", eptfg_font, eptfg_size, eptfg_color),\n';
        generatedCode += '                                      eptfg_mass,\n';
        generatedCode += '                                      eptfg_size,\n';
        generatedCode += '                                      new Vector (' + eptfg_letters[i].location.x + ', ' + eptfg_letters[i].location.y + '),\n';
        generatedCode += '                                      new Vector(),\n';
        generatedCode += '                                      new Vector(),\n';
        generatedCode += '                                      false)\n';
        generatedCode += '                       );\n';
        generatedCode += '    eptfg_letters[' + i + '].color = eptfg_color;\n';
        generatedCode += '    eptfg_letters[' + i + '].visualrepresentation.color = eptfg_color;\n\n';
        generatedCode += '    eptfg_springs.push (new SimpleSpring (new Vector (' + eptfg_letters[i].location.x + ', ' + eptfg_letters[i].location.y + '),\n';
        generatedCode += '                                          eptfg_letters[' + i + '],\n';
        generatedCode += '                                          0,\n';
        generatedCode += '                                          eptfg_stiffness,\n';
        generatedCode += '                                          eptfg_damping)\n';
        generatedCode += '                       );\n';
    }
    generatedCode += '\n    eptfg_mousePos = new Vector();\n';
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
    generatedCode += '    var mousePos = Vector.sub (eptfg_mousePos, new Vector (eptfg_canvas.width/2, eptfg_canvas.height/2));\n';
    generatedCode += '    mousePos.div (zoom);\n\n';
    generatedCode += '    for (var i=0; i<eptfg_springs.length; i++)\n';
    generatedCode += '    {\n';
    generatedCode += '        eptfg_springs[i].applySpringForcesToParticle2();\n';
    generatedCode += '    }\n\n';
    generatedCode += '    for (var i=0; i<eptfg_letters.length; i++)\n';
    generatedCode += '    {\n';
    generatedCode += '        if (Vector.dist (eptfg_letters[i].location, mousePos) < eptfg_size)\n';
    generatedCode += '        {\n';
    generatedCode += '            var direction = Vector.sub (eptfg_letters[i].location, mousePos);\n';
    generatedCode += '            direction.normalize();\n';
    generatedCode += '            direction.mult (100 * eptfg_letters[i].radius);\n';
    generatedCode += '            eptfg_letters[i].applyForce (direction);\n';
    generatedCode += '        }\n\n';
    generatedCode += '        eptfg_letters[i].update (eptfg_dt);\n';
    generatedCode += '        eptfg_letters[i].display (eptfg_context);\n';
    generatedCode += '    }\n\n';
    generatedCode += '    eptfg_context.restore();\n';
    generatedCode += '}\n\n';
    generatedCode += 'eptfg_initSprings();\n\n';
    generatedCode += 'eptfg_animationLoop();\n';
    
    return generatedCode;
}
