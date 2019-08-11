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
        //repositionWaterLevel();
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
                                           setDefaultValuesFloating();
                                           restartSimulationFloating();
                                           }
                                           });
eptfg_form_restartsimulation.addEventListener ("click", restartSimulationFloating);

function restartSimulationFloating()
{
    eptfg_GRID = eptfg_form_grid.checked;
    eptfg_scenescale = eptfg_form_scene_scale.value * 1.0;
    eptfg_waterline = eptfg_form_waterline.value * (-1.0);
    eptfg_gravity = new Vector (0, eptfg_form_gravity.value * 1.0);
    eptfg_mass = eptfg_form_mass.value * 1.0;
    eptfg_liquidDensity = eptfg_form_liquiddensity.value * 1.0;
    eptfg_quantity = eptfg_form_quantity.value * 1.0;
    
    eptfg_MUSTUPLOADIMAGE = false;
    eptfg_visualrepresentation = "text";
    if (eptfg_form_visualrepresentation_image.checked)
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
    
    eptfg_text = eptfg_form_text.value;
    eptfg_font = eptfg_form_fonts.value;
    if (eptfg_form_font.value != "")
    {
        eptfg_font = eptfg_form_font.value;
    }
    eptfg_size = eptfg_form_size.value * 1.0;
    eptfg_color = eptfg_form_color.value;
    eptfg_color_water = eptfg_form_color_water.value;
    eptfg_water_opacity = eptfg_form_opacity.value * 1.0;
    
    eptfg_initFlotacion();
}

eptfg_form_scene_scale.addEventListener ("input", function(e){
                                         eptfg_scenescale = 1.0*e.target.value;
                                         eptfg_form_zoomlabel.value = e.target.value;
                                         });
eptfg_form_zoomlabel.addEventListener ("change", function(e){
                                       eptfg_form_scene_scale.value = e.target.value;
                                       eptfg_scenescale = 1.0*e.target.value;
                                       });

eptfg_form_waterline.addEventListener ("change", function(e){
                                       eptfg_waterline = -1.0*e.target.value;
                                       });

eptfg_form_gravity.addEventListener ("change", function(e){eptfg_gravity.y = e.target.value;});
eptfg_form_mass.addEventListener ("change", function(e) {
                                  eptfg_mass = 1.0*e.target.value;
                                  for (var i=0; i<eptfg_letters.length; i++)
                                  {
                                  eptfg_letters[i].mass = 1.0*e.target.value;
                                  eptfg_letters[i].pointMass = 1.0*e.target.value / eptfg_letters[i].points.length;
                                  }
                                  for (var i=0; i<eptfg_images.length; i++)
                                  {
                                  eptfg_images[i].mass = 1.0*e.target.value;
                                  eptfg_images[i].pointMass = 1.0*e.target.value / eptfg_images[i].points.length;
                                  }
                                  });
eptfg_form_liquiddensity.addEventListener ("change", function(e){eptfg_liquidDensity = 1.0*e.target.value;});

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
eptfg_form_opacity.addEventListener ("change", function(e){eptfg_water_opacity = e.target.value;});

//TODO manual = bad
function setDefaultValuesFloating()
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
    
    eptfg_form_scene_scale.value = 5;
    eptfg_form_zoomlabel.value = 5;
    
    eptfg_form_waterline.value = 0;
    
    eptfg_form_gravity.value = 9.81;
    eptfg_form_mass.value = 500;
    eptfg_form_liquiddensity.value = 1000;
    
    eptfg_form_visualrepresentation_image.checked = false;
    eptfg_form_visualrepresentation_text.checked = true;
    
    eptfg_form_text.value = "TFG";
    eptfg_form_font.value = "";
    eptfg_form_fonts.value = "Arial";
    eptfg_form_quantity.value = 1;
    eptfg_form_size.value = 1;
    eptfg_form_color.value = "#000000";
    
    eptfg_form_color_water.value = "#0000FF";
    eptfg_form_opacity.value = 0.7;
    
    eptfg_form_text.parentElement.parentElement.style.display = "flex";
    eptfg_form_font.parentElement.parentElement.style.display = "flex";
    eptfg_form_fonts.parentElement.parentElement.style.display = "flex";
    eptfg_form_image.parentElement.parentElement.style.display = "none";
    eptfg_form_quantity.parentElement.parentElement.style.display = "none";
    eptfg_form_color.parentElement.parentElement.style.display = "flex";
}

eptfg_form_downloadbutton.addEventListener ("click", downloadCodeFloating);

function downloadCodeFloating()
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
                element.setAttribute ("href", "data:text/plain;charset=utf-8," + encodeURIComponent (library) + encodeURIComponent (generateCodeFloating()));
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

function generateCodeFloating()
{
    var generatedCode = '\n\nvar eptfg_canvas = document.getElementById("EasyPhysics");\n';
    generatedCode += 'eptfg_canvas.width = ' + eptfg_canvas.width + ';\n';
    generatedCode += 'eptfg_canvas.height = ' + eptfg_canvas.height + ';\n';
    generatedCode += 'var eptfg_context = eptfg_canvas.getContext("2d");\n\n';
    generatedCode += 'var eptfg_scenescale = ' + eptfg_scenescale + ';\n';
    generatedCode += 'var eptfg_waterline = ' + eptfg_waterline + ';\n\n';
    generatedCode += 'var eptfg_dt = 0.01;\n\n';
    generatedCode += 'var eptfg_gravity = new Vector (' + eptfg_gravity.x + ', ' + eptfg_gravity.y + ');\n';
    generatedCode += 'var eptfg_mass = ' + eptfg_mass + ';\n';
    generatedCode += 'var eptfg_liquidDensity = ' + eptfg_liquidDensity + ';\n\n';
    generatedCode += 'var eptfg_letters;\n';
    generatedCode += 'var eptfg_images;\n\n';
    generatedCode += 'var eptfg_quantity = ' + eptfg_quantity + ';\n';
    generatedCode += 'var eptfg_visualrepresentation = "' + eptfg_visualrepresentation + '";\n';
    generatedCode += 'var eptfg_text = "' + eptfg_text + '";\n';
    generatedCode += 'var eptfg_font = "' + eptfg_font + '";\n';
    generatedCode += 'var eptfg_image;\n';
    generatedCode += 'var eptfg_size = ' + eptfg_size + ';\n';
    generatedCode += 'var eptfg_color = "' + eptfg_color + '";\n';
    generatedCode += 'var eptfg_color_water = "' + eptfg_color_water + '";\n';
    generatedCode += 'var eptfg_water_opacity = ' + eptfg_water_opacity + ';\n\n';
    generatedCode += 'function eptfg_initFlotacion()\n';
    generatedCode += '{\n';
    generatedCode += '    eptfg_dt = 0.01;\n\n';
    generatedCode += '    eptfg_letters = [];\n';
    generatedCode += '    eptfg_images = [];\n\n';
    generatedCode += '    if (eptfg_visualrepresentation == "text")\n';
    generatedCode += '    {\n';
    generatedCode += '        for (var i=0; i<eptfg_text.length; i++)\n';
    generatedCode += '        {\n';
    generatedCode += '            eptfg_letters.push (new RigidLetter (eptfg_text[i],\n';
    generatedCode += '                                                 eptfg_font,\n';
    generatedCode += '                                                 eptfg_mass,\n';
    generatedCode += '                                                 eptfg_size,\n';
    generatedCode += '                                                 new Vector (getRandomBetween(-0.8*eptfg_scenescale/2, 0.8*eptfg_scenescale/2), getRandomBetween(-0.8* eptfg_scenescale*eptfg_canvas.height/eptfg_canvas.width/2, 0.8* eptfg_scenescale*eptfg_canvas.height/eptfg_canvas.width/2)),\n';
    generatedCode += '                                                 new Vector (getRandomBetween(-2, 2), getRandomBetween(-1.5, 1.5)),\n';
    generatedCode += '                                                 new Vector())\n';
    generatedCode += '                                );\n';
    generatedCode += '            eptfg_letters[i].color = eptfg_color;\n';
    generatedCode += '            eptfg_letters[i].angularVelocity = getRandomBetween (-1, 1);\n';
    generatedCode += '        }\n';
    generatedCode += '    }\n';
    generatedCode += '    else if (eptfg_visualrepresentation == "image")\n';
    generatedCode += '    {\n';
    generatedCode += '        eptfg_image = new Image();\n';
    generatedCode += '        eptfg_image.src = "' + eptfg_image.src + '";\n';
    generatedCode += '        for (var i=0; i<eptfg_quantity; i++)\n';
    generatedCode += '        {\n';
    generatedCode += '            eptfg_images.push (new RigidImage (eptfg_image,\n';
    generatedCode += '                                               eptfg_mass,\n';
    generatedCode += '                                               new Vector (eptfg_size, eptfg_size),\n';
    generatedCode += '                                               new Vector (getRandomBetween(-2, 2), getRandomBetween(-1.5, 1.5)),\n';
    generatedCode += '                                               new Vector (getRandomBetween(-2, 2), getRandomBetween(-1.5, 1.5)),\n';
    generatedCode += '                                               new Vector())\n';
    generatedCode += '                               );\n';
    generatedCode += '            eptfg_images[i].angularVelocity = getRandomBetween (-1, 1);\n';
    generatedCode += '        }\n';
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
    generatedCode += '    if (eptfg_visualrepresentation == "text")\n';
    generatedCode += '    {\n';
    generatedCode += '        for (var i=0; i<eptfg_letters.length; i++)\n';
    generatedCode += '        {\n';
    generatedCode += '            eptfg_letters[i].applyAcceleration (eptfg_gravity);\n';
    generatedCode += '            eptfg_letters[i].applyFlotationForces (eptfg_gravity, eptfg_liquidDensity, eptfg_waterline);\n';
    generatedCode += '            eptfg_letters[i].update(eptfg_dt);\n';
    generatedCode += '            eptfg_letters[i].display(eptfg_context);\n';
    generatedCode += '        }\n';
    generatedCode += '    }\n';
    generatedCode += '    else if (eptfg_visualrepresentation == "image")\n';
    generatedCode += '    {\n';
    generatedCode += '        for (var i=0; i<eptfg_images.length; i++)\n';
    generatedCode += '        {\n';
    generatedCode += '            eptfg_images[i].applyAcceleration (eptfg_gravity);\n';
    generatedCode += '            eptfg_images[i].applyFlotationForces (eptfg_gravity, eptfg_liquidDensity, eptfg_waterline);\n';
    generatedCode += '            eptfg_images[i].update(eptfg_dt);\n';
    generatedCode += '            eptfg_images[i].display(eptfg_context);\n';
    generatedCode += '        }\n';
    generatedCode += '    }\n\n';
    generatedCode += '    eptfg_context.save();\n';
    generatedCode += '    eptfg_context.globalAlpha = eptfg_water_opacity;\n';
    generatedCode += '    eptfg_context.lineWidth = 0.025;\n';
    generatedCode += '    eptfg_context.fillStyle = eptfg_color_water;\n';
    generatedCode += '    eptfg_context.fillRect (zoom * (-eptfg_canvas.width/2), eptfg_waterline, zoom * eptfg_canvas.width, eptfg_scenescale * eptfg_canvas.height / eptfg_canvas.width / 2 - eptfg_waterline);\n';
    generatedCode += '    eptfg_context.restore();\n\n';
    generatedCode += '    eptfg_context.restore();\n';
    generatedCode += '}\n\n';
    generatedCode += 'eptfg_initFlotacion();\n\n';
    generatedCode += 'eptfg_animationLoop();\n';
    
    return generatedCode;
}
