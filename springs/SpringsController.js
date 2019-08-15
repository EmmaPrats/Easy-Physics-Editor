"use strict";

////////////////////////////////////////////////////////////////////
//                                                                //
//   TABLE OF CONTENTS:                                           //
//                                                                //
//   Springs controller class                                     //
//   Relatively complex functions that get called from a listener //
//   Canvas resizing                                              //
//   Letter and text dragging                                     //
//   Code generator and downloader                                //
//   Start simulation                                             //
//                                                                //
////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////
//                                               //
//            SPRINGS CONTROLLER CLASS           //
//                                               //
///////////////////////////////////////////////////

/**
 * Creates a controller for the springs animation.
 * @class
 */
function SpringsController()
{
    this.canvas = document.getElementById ("eptfg-canvas");
    this.context = this.canvas.getContext ("2d");
    
    this.animation = new SpringsAnimation (this.canvas, true);
    
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
    
    this.mass = document.getElementById("input-mass");
    this.stiffness = document.getElementById("input-stiffness");
    this.damping = document.getElementById("input-damping");
    
    this.text = document.getElementById("input-text");
    this.showtext = document.getElementById("input-showtext");
    this.font = document.getElementById("input-font");
    this.fonts = document.getElementById("input-fonts");
    this.size = document.getElementById("input-size");
    this.color = document.getElementById("input-color");
    
    this.textlocationX = document.getElementById("input-textlocationX");
    this.textlocationY = document.getElementById("input-textlocationY");
    
    this.positioningmode = document.getElementById("input-positioningmode");
    
    this.restartsimulation = document.getElementById("restart-simulation-button");
    this.defaultvalues = document.getElementById("default-values-button");
    this.downloadbutton = document.getElementById("button-downloadfile");
    
    this.addEventListeners();
}

SpringsController.prototype.addEventListeners = function()
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
                                         springsController.setDefaultValues();
                                         springsController.animation.initSimulation();
                                         }
                                         });
    this.restartsimulation.addEventListener ("click", function(e){springsController.animation.initSimulation();});
    
    //Editor params
    this.grid.addEventListener ("change", function(e){springsController.animation.GRID = e.target.checked;});
    this.showtext.addEventListener ("change", function(e){springsController.animation.SHOWTEXT=e.target.checked;});
    this.textlocationX.addEventListener ("change", function(e){springsController.animation.textlocation.x=e.target.value;});
    this.textlocationY.addEventListener ("change", function(e){springsController.animation.textlocation.y=e.target.value;});
    
    //Position letters by dragging and dropping
    this.positioningmode.addEventListener ("change", function(e){
                                           springsController.animation.POSITIONINGMODE = e.target.checked;
                                           for (var i=0; i<springsController.animation.letters.length; i++)
                                           {
                                           springsController.animation.letters[i].location.x = springsController.animation.springs[i].origin.x;
                                           springsController.animation.letters[i].location.y = springsController.animation.springs[i].origin.y;
                                           }
                                           });
    this.canvas.addEventListener ("mousedown", canvasMouseDown);
    this.canvas.addEventListener ("mousemove", canvasMouseMove);
    this.canvas.addEventListener ("mouseup", canvasMouseUp);
    
    //Scene params
    this.scene_scale.addEventListener ("input", function(e){
                                       springsController.animation.scenewidth = e.target.value;
                                       springsController.zoomlabel.value = e.target.value;
                                       });
    this.zoomlabel.addEventListener ("change", function(e){
                                     springsController.scene_scale.value = e.target.value;
                                     springsController.animation.scenewidth = e.target.value;
                                     });
    
    //Simulation params
    this.size.addEventListener ("change", function(e){
                                springsController.animation.size = e.target.value;
                                springsController.animation.initSprings();
                                });
    this.mass.addEventListener ("change", function(e) {
                                springsController.animation.mass = e.target.value;
                                for (var i=0; i<springsController.animation.letters.length; i++)
                                {
                                springsController.animation.letters[i].mass = e.target.value;
                                }
                                });
    this.stiffness.addEventListener ("change", function(e) {
                                     springsController.animation.stiffness = e.target.value;
                                     for (var i=0; i<springsController.animation.springs.length; i++)
                                     {
                                     springsController.animation.springs[i].stiffness = e.target.value;
                                     }
                                     });
    this.damping.addEventListener ("change", function(e) {
                                   springsController.animation.damping = e.target.value;
                                   for (var i=0; i<springsController.animation.springs.length; i++)
                                   {
                                   springsController.animation.springs[i].damping = 1 - 0.1 * e.target.value;
                                   }
                                   });
    this.text.addEventListener ("change", function(e){
                                springsController.animation.text=e.target.value;
                                springsController.animation.letterlocations = [];
                                for (var i=0; i<e.target.value.length; i++)
                                {
                                springsController.animation.letterlocations.push (new Vector (i * 0.5, 0));
                                }
                                springsController.animation.initSimulation();
                                });
    
    //Aesthetic params
    this.font.addEventListener ("change", function(e){
                                if (e.target.value != "")
                                {
                                springsController.animation.font = e.target.value;
                                springsController.animation.initSimulation();
                                }
                                else
                                {
                                springsController.animation.font = springsController.fonts.value;
                                springsController.animation.initSimulation();
                                }
                                });
    this.fonts.addEventListener ("change", function(e){
                                 if (springsController.font.value == "")
                                 {
                                 springsController.animation.font = e.target.value;
                                 springsController.animation.initSimulation();
                                 }
                                 });
    this.color.addEventListener ("change", function(e){
                                 springsController.animation.color = e.target.value;
                                 for (var i=0; i<springsController.animation.letters.length; i++)
                                 {
                                 springsController.animation.letters[i].color = e.target.value;
                                 springsController.animation.letters[i].visualrepresentation.color = e.target.value;
                                 }
                                 });
    
    //Download button
    this.downloadbutton.addEventListener ("click", downloadCodeSprings);
}

/**
 * Sets default values on all input elements and animation parameters.
 */
SpringsController.prototype.setDefaultValues = function()
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
    
    this.scene_scale.value = 11;
    this.zoomlabel.value = 11;
    
    this.mass.value = 1;
    this.stiffness.value = 150;
    this.damping.value = 3;
    
    this.text.value = "Easy Physics";
    this.showtext.checked = true;
    this.textlocationX.value = 0;
    this.textlocationY.value = 0;
    this.positioningmode.checked = false;
    
    this.font.value = "";
    this.fonts.value = "Arial";
    this.size.value = 1;
    this.color.value = "#000000";
    
    var letterLocationsNode = document.getElementById ("letterlocations");
    while (letterLocationsNode.firstChild)
    {
        letterLocationsNode.removeChild (letterLocationsNode.firstChild);
    }
    
    var text = this.text.value;
    for (let i=0; i<text.length; i++)
    {
        var input = document.createElement("div");
        input.style.margin = 0;
        input.style.padding = 0;
        input.style.display = "flex";
        input.style.borderTop = "2px solid white";
        input.innerHTML = '<span class="left">' + text[i] + '</span><span class="right">x=<input type="number" id="letter-' + i + '-x" class="input-letterlocation" value="' + (i*0.5) + '" onchange="letterLocationChange(' + i + ', \'x\', this.value)"/><br/>y=<input type="number" id="letter-' + i + '-y" class="input-letterlocation" value="0" onchange="letterLocationChange(' + i + ', \'y\', this.value)"/></span>';
        letterLocationsNode.appendChild (input);
    }
    
    this.animation.GRID = this.grid.checked;
    this.animation.textlocation = new Vector (1.0*this.textlocationX.value, 1.0*this.textlocationY.value);
    this.animation.SHOWTEXT = this.showtext.checked;
    this.animation.POSITIONINGMODE = this.positioningmode.checked;
    
    this.animation.scenewidth = this.scene_scale.value * 1.0;
    
    this.animation.size = this.size.value * 1.0;
    this.animation.mass = this.mass.value * 1.0;
    this.animation.stiffness = this.stiffness.value * 1.0;
    this.animation.damping = this.damping.value * 1.0;
    this.animation.text = this.text.value;
    this.animation.letterlocations = [];
    for (var i=0; i<this.text.value.length; i++)
    {
        this.animation.letterlocations.push (new Vector (i * 0.5, 0));
    }
    
    this.animation.font = this.fonts.value;
    if (this.font.value != "")
    {
        this.animation.font = this.font.value;
    }
    this.animation.color = this.color.value;
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
        springsController.ratio_16_9.checked = false;
        springsController.ratio_16_9.nextSibling.innerHTML = "&#128275;16:9";
        springsController.ratio_4_3.checked = false;
        springsController.ratio_4_3.nextSibling.innerHTML = "&#128275;4:3";
        springsController.ratio_1_1.checked = false;
        springsController.ratio_1_1.nextSibling.innerHTML = "&#128275;1:1";
        springsController.ratio_3_4.checked = false;
        springsController.ratio_3_4.nextSibling.innerHTML = "&#128275;3:4";
        springsController.ratio_9_16.checked = false;
        springsController.ratio_9_16.nextSibling.innerHTML = "&#128275;9:16";
        
        switch (event.target.id)
        {
            case "ratio-16-9":
                springsController.canvas.width = springsController.canvas.height * 16 / 9;
                springsController.ratio_16_9.nextSibling.innerHTML = "&#128274;16:9";
                break;
            case "ratio-4-3":
                springsController.canvas.width = springsController.canvas.height * 4 / 3;
                springsController.ratio_4_3.nextSibling.innerHTML = "&#128274;4:3";
                break;
            case "ratio-1-1":
                springsController.canvas.width = springsController.canvas.height;
                springsController.ratio_1_1.nextSibling.innerHTML = "&#128274;1:1";
                break;
            case "ratio-3-4":
                springsController.canvas.width = springsController.canvas.height * 3 / 4;
                springsController.ratio_3_4.nextSibling.innerHTML = "&#128274;3:4";
                break;
            case "ratio-9-16":
                springsController.canvas.width = springsController.canvas.height * 9 / 16;
                springsController.ratio_9_16.nextSibling.innerHTML = "&#128274;9:16";
                break;
        }
        springsController.canvas_width.innerHTML = springsController.canvas.width;
        
        event.target.checked = true;
    }
    else
    {
        switch (event.target.id)
        {
            case "ratio-16-9":
                springsController.ratio_16_9.nextSibling.innerHTML = "&#128275;16:9";
                break;
            case "ratio-4-3":
                springsController.ratio_4_3.nextSibling.innerHTML = "&#128275;4:3";
                break;
            case "ratio-1-1":
                springsController.ratio_1_1.nextSibling.innerHTML = "&#128275;1:1";
                break;
            case "ratio-3-4":
                springsController.ratio_3_4.nextSibling.innerHTML = "&#128275;3:4";
                break;
            case "ratio-9-16":
                springsController.ratio_9_16.nextSibling.innerHTML = "&#128275;9:16";
                break;
        }
    }
}

/**
 * Changes the location of a letter.
 */
function letterLocationChange (index, axis, value)
{
    if (axis == "x")
    {
        springsController.animation.letterlocations[index].x = 1.0 * value;
        springsController.animation.letters[index].location.x = 1.0 * value;
        springsController.animation.springs[index].origin.x = 1.0 * value;
    }
    else if (axis == "y")
    {
        springsController.animation.letterlocations[index].y = 1.0 * value;
        springsController.animation.letters[index].location.y = 1.0 * value;
        springsController.animation.springs[index].origin.y = 1.0 * value;
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
        var x = event.clientX - offset(springsController.canvas).left;
        var y = event.clientY - offset(springsController.canvas).top;
        
        if (x > springsController.canvas.width - 15 && x < springsController.canvas.width && y > springsController.canvas.height - 15 && y < springsController.canvas.height)
        {
            FLAG_RESIZING = true;
            offsetRight = springsController.canvas.width - x;
            offsetBottom = springsController.canvas.height - y;
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
    var x = event.clientX - offset(springsController.canvas).left;
    var y = event.clientY - offset(springsController.canvas).top;
    
    if (FLAG_RESIZING)
    {
        if (springsController.lock_canvas_height.checked)
        {
            if (!(springsController.lock_canvas_width.checked || springsController.ratio_16_9.checked || springsController.ratio_4_3.checked || springsController.ratio_1_1.checked || springsController.ratio_3_4.checked || springsController.ratio_9_16.checked))
            {
                springsController.canvas.width = x + offsetRight;
            }
        }
        else if (springsController.lock_canvas_width.checked)
        {
            if (!(springsController.ratio_16_9.checked || springsController.ratio_4_3.checked || springsController.ratio_1_1.checked || springsController.ratio_3_4.checked || springsController.ratio_9_16.checked))
            {
                springsController.canvas.height = y + offsetBottom;
            }
        }
        else
        {
            springsController.canvas.height = y + offsetBottom;
            springsController.canvas.width = x + offsetRight;
            if (springsController.ratio_16_9.checked)
            {
                springsController.canvas.width = springsController.canvas.height * 16 / 9;
            }
            else if (springsController.ratio_4_3.checked)
            {
                springsController.canvas.width = springsController.canvas.height * 4 / 3;
            }
            else if (springsController.ratio_1_1.checked)
            {
                springsController.canvas.width = springsController.canvas.height;
            }
            else if (springsController.ratio_3_4.checked)
            {
                springsController.canvas.width = springsController.canvas.height * 3 / 4;
            }
            else if (springsController.ratio_9_16.checked)
            {
                springsController.canvas.width = springsController.canvas.height * 9 / 16;
            }
        }
        springsController.canvas_width.innerHTML = springsController.canvas.width;
        springsController.canvas_height.innerHTML = springsController.canvas.height;
        
        springsController.animation.draw();
    }
}

///////////////////////////////////////////////////
//                                               //
//           LETTER AND TEXT DRAGGING            //
//                                               //
///////////////////////////////////////////////////

var FLAG_DRAGGING = false;
var FLAG_DRAGGING_TEXT = false;
var letterBeingDragged;

/**
 * Mouse down event listener for letter and text dragging.
 */
function canvasMouseDown (event)
{
    //Calculate position of mouse in canvas coordinates. Doesn't work if scrolled, does work if zoomed.
    var x = event.clientX - offset(springsController.canvas).left;
    var y = event.clientY - offset(springsController.canvas).top;
    
    //Calculate position of mouse in world coordinates. Doesn't work if scrolled, does work if zoomed.
    var zoom = springsController.canvas.width / springsController.animation.scenewidth;
    var mousePos_world = new Vector ((x - springsController.canvas.width/2) / zoom, (y - springsController.canvas.height/2) / zoom);
    
    //Check if and which letter is being dragged
    for (var i=0; i<springsController.animation.letters.length; i++)
    {
        if (Vector.dist (mousePos_world, springsController.animation.letters[i].location) <= 0.2*springsController.animation.letters[i].visualrepresentation.size)
        {
            FLAG_DRAGGING = true;
            letterBeingDragged = i;
        }
    }
    
    //Check if we are dragging the text instead
    if (!FLAG_DRAGGING)
    {
        if (Vector.dist (mousePos_world, springsController.animation.textlocation) <= 0.2*springsController.animation.size)
        {
            FLAG_DRAGGING_TEXT = true;
        }
    }
}

/**
 * Mouse move listener for letter and text dragging.
 */
function canvasMouseMove (event)
{
    if (FLAG_DRAGGING)
    {
        var x = event.clientX - offset(springsController.animation.canvas).left;
        var y = event.clientY - offset(springsController.animation.canvas).top;
        
        var zoom = springsController.animation.canvas.width / springsController.animation.scenewidth;
        
        var newX = ((x - springsController.animation.canvas.width/2) / zoom).toFixed (3);
        var newY = ((y - springsController.animation.canvas.height/2) / zoom).toFixed (3);
        
        springsController.animation.letters[letterBeingDragged].location.x = 1.0 * newX;
        springsController.animation.letters[letterBeingDragged].location.y = 1.0 * newY;
        
        springsController.animation.letterlocations[letterBeingDragged].x = 1.0 * newX;
        springsController.animation.letterlocations[letterBeingDragged].y = 1.0 * newY;
        
        springsController.animation.springs[letterBeingDragged].origin.x = 1.0 * newX;
        springsController.animation.springs[letterBeingDragged].origin.y = 1.0 * newY;
        
        document.getElementById("letter-" + letterBeingDragged + "-x").value = 1.0 * newX;
        document.getElementById("letter-" + letterBeingDragged + "-y").value = 1.0 * newY;
        
        springsController.animation.draw();
    }
    else if (FLAG_DRAGGING_TEXT)
    {
        var x = event.clientX - offset(springsController.animation.canvas).left;
        var y = event.clientY - offset(springsController.animation.canvas).top;
        
        var zoom = springsController.animation.canvas.width / springsController.animation.scenewidth;
        
        var newX = ((x - springsController.animation.canvas.width/2) / zoom).toFixed (3);
        var newY = ((y - springsController.animation.canvas.height/2) / zoom).toFixed (3);
        
        springsController.animation.textlocation.x = 1.0 * newX;
        springsController.animation.textlocation.y = 1.0 * newY;
        
        springsController.textlocationX.value = 1.0 * newX;
        springsController.textlocationY.value = 1.0 * newY;
        
        springsController.animation.draw();
    }
}

/**
 * Mouse up event listener for letter and text dragging.
 */
function canvasMouseUp (event)
{
    FLAG_DRAGGING = false;
    FLAG_DRAGGING_TEXT = false;
}

///////////////////////////////////////////////////
//                                               //
//         CODE GENERATOR AND DOWNLOADER         //
//                                               //
///////////////////////////////////////////////////

/**
 * Creates a file that contains the entire library and the animation created, and starts the download.
 */
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

/**
 * Generates a script that runs an animation with the current parameters.
 * @returns {string} a script that runs a springs animation
 */
function generateCodeSprings()
{
    var randomNumber = Math.floor (getRandomBetween (1000, 9999));
    
    var generatedCode = '\n\n//Defining settings object:\n';
    generatedCode += 'var settings' + randomNumber + ' = [];\n';
    generatedCode += 'settings' + randomNumber + '.scenewidth = ' + springsController.animation.scenewidth + ';\n';
    generatedCode += 'settings' + randomNumber + '.size = ' + springsController.animation.size + ';\n';
    generatedCode += 'settings' + randomNumber + '.mass = ' + springsController.animation.mass + ';\n';
    generatedCode += 'settings' + randomNumber + '.stiffness = ' + springsController.animation.stiffness + ';\n';
    generatedCode += 'settings' + randomNumber + '.damping = ' + springsController.animation.damping + ';\n';
    generatedCode += 'settings' + randomNumber + '.text = "' + springsController.animation.text + '";\n';
    generatedCode += 'settings' + randomNumber + '.letterlocations = [];\n';
    for (let i=0; i<springsController.animation.letters.length; i++)
    {
        generatedCode += 'settings' + randomNumber + '.letterlocations[' + i + '] = new Vector (' + springsController.animation.letters[i].location.x
        + ', ' + springsController.animation.letters[i].location.y + ');\n';
    }
    generatedCode += 'settings' + randomNumber + '.font = "' + springsController.animation.font + '";\n';
    generatedCode += 'settings' + randomNumber + '.color = "' + springsController.animation.color + '";\n';
    generatedCode += '\n';
    generatedCode += '//Creating the animation\n';
    generatedCode += 'var animation' + randomNumber + ' = new SpringsAnimation (document.getElementById("EasyPhysics"), false);\n';
    generatedCode += 'animation' + randomNumber + '.canvas.width = ' + springsController.animation.canvas.width + ';\n';
    generatedCode += 'animation' + randomNumber + '.canvas.height = ' + springsController.animation.canvas.height + ';\n';
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

var springsController = new SpringsController();

(function animationLoop()
 {
 springsController.animation.draw();
 window.requestAnimationFrame (animationLoop);
 })();
