"use strict";

////////////////////////////////////////////////////////////////////
//                                                                //
//   TABLE OF CONTENTS:                                           //
//                                                                //
//   Floating controller class                                    //
//   Relatively complex functions that get called from a listener //
//   Canvas resizing                                              //
//   Code generator and downloader                                //
//   Start simulation                                             //
//                                                                //
////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////
//                                               //
//           FLOATING CONTROLLER CLASS           //
//                                               //
///////////////////////////////////////////////////

/**
 * Creates a controller for the floating animation.
 * @class
 */
function FloatingController()
{
    this.canvas = document.getElementById ("eptfg-canvas");
    this.context = this.canvas.getContext ("2d");
    
    this.animation = new FloatingAnimation (this.canvas, true);
    
    //A reference to each item in the form
    
    this.grid = document.getElementById("grid");
    this.ratio_16_9 = document.getElementById("ratio-16-9");
    this.ratio_4_3 = document.getElementById("ratio-4-3");
    this.ratio_1_1 = document.getElementById("ratio-1-1");
    this.ratio_3_4 = document.getElementById("ratio-3-4");
    this.ratio_9_16 = document.getElementById("ratio-9-16");
    this.lock_canvas_width = document.getElementById("lock-canvas-width");
    this.canvas_width = document.getElementById("canvas-width");
    this.lock_canvas_height = document.getElementById("lock-canvas-height");
    this.canvas_height = document.getElementById("canvas-height");
    
    this.scene_scale = document.getElementById("scene-scale");
    this.zoomlabel = document.getElementById("zoomlabel");
    this.waterline = document.getElementById("waterline");
    
    this.size = document.getElementById("input-size");
    this.gravity = document.getElementById("input-gravity");
    this.mass = document.getElementById("input-mass");
    this.liquiddensity = document.getElementById("input-liquiddensity");
    this.text = document.getElementById("input-text");
    
    this.fonts = document.getElementById("input-fonts");
    this.font = document.getElementById("input-font");
    this.color = document.getElementById("input-color");
    this.color_water = document.getElementById("input-color-water");
    this.opacity = document.getElementById("input-opacity");
    
    this.restartsimulation = document.getElementById("restart-simulation-button");
    this.defaultvalues = document.getElementById("default-values-button");
    this.downloadbutton = document.getElementById("button-downloadfile");
    
    this.addEventListeners();
}

FloatingController.prototype.addEventListeners = function()
{
    //Canvas resizing
    window.addEventListener ("mousedown", resizingMouseDown);
    window.addEventListener ("mousemove", resizingMouseMove);
    window.addEventListener ("mouseup", resizingMouseUp);
    
    //Canvas ratios
    this.ratio_16_9.addEventListener ("change", ratiochange);
    this.ratio_4_3.addEventListener ("change", ratiochange);
    this.ratio_1_1.addEventListener ("change", ratiochange);
    this.ratio_3_4.addEventListener ("change", ratiochange);
    this.ratio_9_16.addEventListener ("change", ratiochange);
    
    //Canvas locking width and height
    this.lock_canvas_width.addEventListener ("change", function(e){
                                             if (e.target.checked) e.target.nextSibling.innerHTML = "&#128274;";
                                             else e.target.nextSibling.innerHTML = "&#128275;";
                                             });
    this.lock_canvas_height.addEventListener("change", function(e){
                                             if (e.target.checked) e.target.nextSibling.innerHTML = "&#128274;";
                                             else e.target.nextSibling.innerHTML = "&#128275;";
                                             });
    
    //Default values and restart buttons
    this.defaultvalues.addEventListener ("click", function(e){
                                         if (confirm ("You will lose all your progress. Are you sure?"))
                                         {
                                         floatingController.setDefaultValues();
                                         floatingController.animation.initSimulation();
                                         }
                                         });
    this.restartsimulation.addEventListener ("click", function(e){floatingController.animation.initSimulation();});
    
    //Editor params
    this.grid.addEventListener ("change", function(e){floatingController.animation.GRID = e.target.checked;});
    
    //Scene params
    this.scene_scale.addEventListener ("input", function(e){
                                       floatingController.animation.scenewidth = e.target.value;
                                       floatingController.zoomlabel.value = e.target.value;
                                       });
    this.zoomlabel.addEventListener ("change", function(e){
                                     floatingController.scene_scale.value = e.target.value;
                                     floatingController.animation.scenewidth = e.target.value;
                                     });
    this.waterline.addEventListener ("change", function(e){floatingController.animation.waterline = -1.0*e.target.value;});
    
    //Simulation params
    this.size.addEventListener ("change", function(e){
                                floatingController.animation.size = e.target.value;
                                floatingController.animation.initSimulation();
                                });
    this.gravity.addEventListener ("change", function(e){floatingController.animation.gravity.y = e.target.value;});
    this.mass.addEventListener ("change", function(e){
                                floatingController.animation.mass = 1.0 * e.target.value;
                                for (let i=0; i<floatingController.animation.letters.length; i++)
                                {
                                floatingController.animation.letters[i].mass = 1.0 * e.target.value;
                                floatingController.animation.letters[i].pointMass = 1.0 * e.target.value / floatingController.animation.letters[i].points.length;
                                }
                                });
    this.liquiddensity.addEventListener ("change", function(e){floatingController.animation.liquidDensity = 1.0*e.target.value;});
    this.text.addEventListener ("change", function(e){floatingController.animation.text=e.target.value;floatingController.animation.initSimulation();});
    
    //Aesthetic params
    this.font.addEventListener ("change", function(e){
                                if (e.target.value != "")
                                {
                                floatingController.animation.font = e.target.value;
                                floatingController.animation.initSimulation();
                                }
                                else
                                {
                                floatingController.animation.font = floatingController.fonts.value;
                                floatingController.animation.initSimulation();
                                }
                                });
    this.fonts.addEventListener ("change", function(e){
                                 if (floatingController.font.value == "")
                                 {
                                 floatingController.animation.font = e.target.value;
                                 floatingController.animation.initSimulation();
                                 }
                                 });
    this.color.addEventListener ("change", function(e){
                                 floatingController.animation.color = e.target.value;
                                 for (var i=0; i<floatingController.animation.letters.length; i++)
                                 {
                                 floatingController.animation.letters[i].color = e.target.value;
                                 }
                                 });
    this.color_water.addEventListener ("change", function(e){floatingController.animation.liquidColor = e.target.value;});
    this.opacity.addEventListener ("change", function(e){floatingController.animation.liquidOpacity = e.target.value;});
    
    //Download button
    this.downloadbutton.addEventListener ("click", downloadCodeFloating);
};

/**
 * Sets default values on all input elements and animation parameters.
 */
FloatingController.prototype.setDefaultValues = function()
{
    this.grid.checked = true;
    this.ratio_16_9.checked = false;
    this.ratio_16_9.nextSibling.innerHTML = "&#128275;16:9";
    this.ratio_4_3.checked = false;
    this.ratio_4_3.nextSibling.innerHTML = "&#128275;4:3";
    this.ratio_1_1.checked = false;
    this.ratio_1_1.nextSibling.innerHTML = "&#128275;1:1";
    this.ratio_3_4.checked = false;
    this.ratio_3_4.nextSibling.innerHTML = "&#128275;3:4";
    this.ratio_9_16.checked = false;
    this.ratio_9_16.nextSibling.innerHTML = "&#128275;9:16";
    this.lock_canvas_width.checked = false;
    this.lock_canvas_width.nextSibling.innerHTML = "&#128275";
    this.canvas_width.innerHTML = "480";
    this.lock_canvas_height.checked = false;
    this.lock_canvas_height.nextSibling.innerHTML = "&#128275";
    this.canvas_height.innerHTML = "360";
    this.canvas.width = 480;
    this.canvas.height = 360;
    
    this.scene_scale.value = 5;
    this.zoomlabel.value = 5;
    this.waterline.value = 0;
    
    this.mass.value = 1;
    this.gravity.value = 9.8;
    this.liquiddensity.value = 1000;
    
    this.text.value = "Easy Physics";
    
    this.font.value = "";
    this.fonts.value = "Arial";
    this.size.value = 1;
    this.color.value = "#000000";
    this.color_water.value = "#0000FF";
    this.opacity.value = 0.7;
    
    this.animation.GRID = this.grid.checked;
    
    this.animation.scenewidth = this.scene_scale.value * 1.0;
    this.animation.waterline = this.waterline.value * 1.0;
    
    this.animation.gravity.y = this.gravity.value * 1.0;
    this.animation.size = this.size.value * 1.0;
    this.animation.mass = this.mass.value * 1.0;
    this.animation.liquidDensity = this.liquiddensity.value * 1.0;
    this.animation.text = this.text.value;
    
    this.animation.font = this.fonts.value;
    if (this.font.value != "")
    {
        this.animation.font = this.font.value;
    }
    this.animation.color = this.color.value;
    this.animation.liquidColor = this.color_water.value;
    this.animation.liquidOpacity = this.opacity.value;
}


///////////////////////////////////////////////////
//                                               //
//          RELATIVELY COMPLEX FUNCTIONS         //
//        THAT GET CALLED FROM A LISTENER        //
//                                               //
///////////////////////////////////////////////////

/**
 * Ratio change event listener.
 */
function ratiochange (event)
{
    if (event.target.checked)
    {
        floatingController.ratio_16_9.checked = false;
        floatingController.ratio_16_9.nextSibling.innerHTML = "&#128275;16:9";
        floatingController.ratio_4_3.checked = false;
        floatingController.ratio_4_3.nextSibling.innerHTML = "&#128275;4:3";
        floatingController.ratio_1_1.checked = false;
        floatingController.ratio_1_1.nextSibling.innerHTML = "&#128275;1:1";
        floatingController.ratio_3_4.checked = false;
        floatingController.ratio_3_4.nextSibling.innerHTML = "&#128275;3:4";
        floatingController.ratio_9_16.checked = false;
        floatingController.ratio_9_16.nextSibling.innerHTML = "&#128275;9:16";
        
        switch (event.target.id)
        {
            case "ratio-16-9":
                floatingController.canvas.width = floatingController.canvas.height * 16 / 9;
                floatingController.ratio_16_9.nextSibling.innerHTML = "&#128274;16:9";
                break;
            case "ratio-4-3":
                floatingController.canvas.width = floatingController.canvas.height * 4 / 3;
                floatingController.ratio_4_3.nextSibling.innerHTML = "&#128274;4:3";
                break;
            case "ratio-1-1":
                floatingController.canvas.width = floatingController.canvas.height;
                floatingController.ratio_1_1.nextSibling.innerHTML = "&#128274;1:1";
                break;
            case "ratio-3-4":
                floatingController.canvas.width = floatingController.canvas.height * 3 / 4;
                floatingController.ratio_3_4.nextSibling.innerHTML = "&#128274;3:4";
                break;
            case "ratio-9-16":
                floatingController.canvas.width = floatingController.canvas.height * 9 / 16;
                floatingController.ratio_9_16.nextSibling.innerHTML = "&#128274;9:16";
                break;
        }
        floatingController.canvas_width.innerHTML = floatingController.canvas.width;
        
        event.target.checked = true;
    }
    else
    {
        switch (event.target.id)
        {
            case "ratio-16-9":
                floatingController.ratio_16_9.nextSibling.innerHTML = "&#128275;16:9";
                break;
            case "ratio-4-3":
                floatingController.ratio_4_3.nextSibling.innerHTML = "&#128275;4:3";
                break;
            case "ratio-1-1":
                floatingController.ratio_1_1.nextSibling.innerHTML = "&#128275;1:1";
                break;
            case "ratio-3-4":
                floatingController.ratio_3_4.nextSibling.innerHTML = "&#128275;3:4";
                break;
            case "ratio-9-16":
                floatingController.ratio_9_16.nextSibling.innerHTML = "&#128275;9:16";
                break;
        }
    }
}

///////////////////////////////////////////////////
//                                               //
//                CANVAS RESIZING                //
//                                               //
///////////////////////////////////////////////////

var FLAG_RESIZING = false;
var offsetRight, offsetBottom;

/**
 * Mouse down event for canvas resizing. Checks if the user clicked on the bottom right corner of the canvas.
 */
function resizingMouseDown (event)
{
    if (event.button == 0)
    {
        var x = event.clientX - offset(floatingController.canvas).left;
        var y = event.clientY - offset(floatingController.canvas).top;
        
        if (x > floatingController.canvas.width - 15 && x < floatingController.canvas.width && y > floatingController.canvas.height - 15 && y < floatingController.canvas.height)
        {
            FLAG_RESIZING = true;
            offsetRight = floatingController.canvas.width - x;
            offsetBottom = floatingController.canvas.height - y;
        }
    }
}

/**
 * Mouse up event for canvas resizing.
 */
function resizingMouseUp (event)
{
    FLAG_RESIZING = false;
}

/**
 * Mouse move event for canvas resizing.
 * If the user clicked on the bottom right corner of the canvas,
 * resizes the canvas as user drags the mouse.
 */
function resizingMouseMove (event)
{
    var x = event.clientX - offset(floatingController.canvas).left;
    var y = event.clientY - offset(floatingController.canvas).top;
    
    if (FLAG_RESIZING)
    {
        if (floatingController.lock_canvas_height.checked)
        {
            if (!(floatingController.lock_canvas_width.checked || floatingController.ratio_16_9.checked || floatingController.ratio_4_3.checked || floatingController.ratio_1_1.checked || floatingController.ratio_3_4.checked || floatingController.ratio_9_16.checked))
            {
                floatingController.canvas.width = x + offsetRight;
            }
        }
        else if (floatingController.lock_canvas_width.checked)
        {
            if (!(floatingController.ratio_16_9.checked || floatingController.ratio_4_3.checked || floatingController.ratio_1_1.checked || floatingController.ratio_3_4.checked || floatingController.ratio_9_16.checked))
            {
                floatingController.canvas.height = y + offsetBottom;
            }
        }
        else
        {
            floatingController.canvas.height = y + offsetBottom;
            floatingController.canvas.width = x + offsetRight;
            if (floatingController.ratio_16_9.checked)
            {
                floatingController.canvas.width = floatingController.canvas.height * 16 / 9;
            }
            else if (floatingController.ratio_4_3.checked)
            {
                floatingController.canvas.width = floatingController.canvas.height * 4 / 3;
            }
            else if (floatingController.ratio_1_1.checked)
            {
                floatingController.canvas.width = floatingController.canvas.height;
            }
            else if (floatingController.ratio_3_4.checked)
            {
                floatingController.canvas.width = floatingController.canvas.height * 3 / 4;
            }
            else if (floatingController.ratio_9_16.checked)
            {
                floatingController.canvas.width = floatingController.canvas.height * 9 / 16;
            }
        }
        floatingController.canvas_width.innerHTML = floatingController.canvas.width;
        floatingController.canvas_height.innerHTML = floatingController.canvas.height;
        
        floatingController.animation.draw();
    }
}

///////////////////////////////////////////////////
//                                               //
//         CODE GENERATOR AND DOWNLOADER         //
//                                               //
///////////////////////////////////////////////////

/**
 * Creates a file that contains the entire library and the animation created, and starts the download.
 */
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

/**
 * Generates a script that runs an animation with the current parameters.
 * @returns {string} a script that runs a floating animation
 */
function generateCodeFloating()
{
    var randomNumber = Math.floor (getRandomBetween (1000, 9999));
    
    var generatedCode = '\n\n//Defining settings object:\n';
    generatedCode += 'var settings' + randomNumber + ' = [];\n';
    generatedCode += 'settings' + randomNumber + '.scenewidth = ' + floatingController.animation.scenewidth + ';\n';
    generatedCode += 'settings' + randomNumber + '.waterline = ' + floatingController.animation.waterline + ';\n';
    generatedCode += 'settings' + randomNumber + '.gravity = new Vector (0, ' + floatingController.animation.gravity.y + ');\n';
    generatedCode += 'settings' + randomNumber + '.size = ' + floatingController.animation.size + ';\n';
    generatedCode += 'settings' + randomNumber + '.mass = ' + floatingController.animation.mass + ';\n';
    generatedCode += 'settings' + randomNumber + '.liquidDensity = ' + floatingController.animation.liquidDensity + ';\n';
    generatedCode += 'settings' + randomNumber + '.text = "' + floatingController.animation.text + '";\n';
    generatedCode += 'settings' + randomNumber + '.font = "' + floatingController.animation.font + '";\n';
    generatedCode += 'settings' + randomNumber + '.color = "' + floatingController.animation.color + '";\n';
    generatedCode += 'settings' + randomNumber + '.liquidColor = "' + floatingController.animation.liquidColor + '";\n';
    generatedCode += 'settings' + randomNumber + '.liquidOpacity = ' + floatingController.animation.liquidOpacity + ';\n';
    generatedCode += '//Creating the animation\n';
    generatedCode += 'var animation' + randomNumber + ' = new FloatingAnimation (document.getElementById("EasyPhysics"), false);\n';
    generatedCode += 'animation' + randomNumber + '.canvas.width = ' + floatingController.animation.canvas.width + ';\n';
    generatedCode += 'animation' + randomNumber + '.canvas.height = ' + floatingController.animation.canvas.height + ';\n';
    generatedCode += 'animation' + randomNumber + '.initParams (false, settings' + randomNumber + ');\n';
    generatedCode += 'animation' + randomNumber + '.initSimulation();\n';
    generatedCode += '(function animationLoop()\n';
    generatedCode += ' {\n';
    generatedCode += '    animation' + randomNumber + '.draw();\n';
    generatedCode += '    window.requestAnimationFrame (animationLoop);\n';
    generatedCode += ' })();\n';
    
    return generatedCode;
}

///////////////////////////////////////////////////
//                                               //
//               START SIMULATION                //
//                                               //
///////////////////////////////////////////////////

var floatingController = new FloatingController();

(function animationLoop()
 {
 floatingController.animation.draw();
 window.requestAnimationFrame (animationLoop);
 })();
