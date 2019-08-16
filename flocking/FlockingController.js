"use strict";

////////////////////////////////////////////////////////////////////
//                                                                //
//   TABLE OF CONTENTS:                                           //
//                                                                //
//   Flocking controller class                                    //
//   Relatively complex functions that get called from a listener //
//   Canvas resizing                                              //
//   Code generator and downloader                                //
//   Start simulation                                             //
//                                                                //
////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////
//                                               //
//           FLOCKING CONTROLLER CLASS           //
//                                               //
///////////////////////////////////////////////////

/**
 * Creates a controller for the flocking animation.
 * @class
 */
function FlockingController()
{
    this.canvas = document.getElementById ("eptfg-canvas");
    this.context = this.canvas.getContext ("2d");
    
    this.animation = new FlockingAnimation (this.canvas, true);
    
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
    
    this.quantity = document.getElementById("input-quantity");
    this.size = document.getElementById("input-radius");
    this.separationweight = document.getElementById("input-separationweight");
    this.alignmentweight = document.getElementById("input-alignmentweight");
    this.cohesionweight = document.getElementById("input-cohesionweight");
    
    this.visualrepresentation_shape = document.getElementById("input-visualrepresentation-shape");
    this.shape_circle = document.getElementById("input-shape-circle");
    this.shape_triangle = document.getElementById("input-shape-triangle");
    this.shape_square = document.getElementById("input-shape-square");
    
    this.visualrepresentation_image = document.getElementById("input-visualrepresentation-image");
    this.image = document.getElementById("input-image");
    this.imageObject;
    
    this.oriented = document.getElementById("input-oriented");
    this.color = document.getElementById("input-color");
    
    this.restartsimulation = document.getElementById("restart-simulation-button");
    this.defaultvalues = document.getElementById("default-values-button");
    this.downloadbutton = document.getElementById("button-downloadfile");
    
    this.addEventListeners();
}

/**
 * Adds event listeners to all input elements.
 */
FlockingController.prototype.addEventListeners = function()
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
                                         flockingController.setDefaultValues();
                                         flockingController.animation.initSimulation();
                                         }
                                         });
    this.restartsimulation.addEventListener ("click", function(e){flockingController.animation.initSimulation();});
    
    //Editor params
    this.grid.addEventListener ("change", function(e){flockingController.animation.GRID = e.target.checked;});
    
    //Scene params
    this.scene_scale.addEventListener ("input", function(e){
                                       flockingController.animation.scenewidth = 1.0 * e.target.value;
                                       flockingController.zoomlabel.value = 1.0 * e.target.value;
                                       });
    this.zoomlabel.addEventListener ("change", function(e){
                                     flockingController.scene_scale.value = 1.0 * e.target.value;
                                     flockingController.animation.scenewidth = 1.0 * e.target.value;
                                     });
    
    //Simulation params
    this.size.addEventListener ("change", function(e){
                                flockingController.animation.size = 1.0 * e.target.value;
                                flockingController.animation.flock.boidSizeChange (1.0 * e.target.value);
                                });
    
    this.quantity.addEventListener ("change", quantityChange);
    
    this.separationweight.addEventListener ("change", function(e){
                                            flockingController.animation.separationweight = 1.0 * e.target.value;
                                            flockingController.animation.flock.separationWeight = 1.0 * e.target.value;
                                            });
    this.alignmentweight.addEventListener ("change", function(e){
                                           flockingController.animation.alignmentweight = 1.0 * e.target.value;
                                           flockingController.animation.flock.alignmentWeight = 1.0 * e.target.value;
                                           });
    this.cohesionweight.addEventListener ("change", function(e){
                                          flockingController.animation.cohesionweight = 1.0 * e.target.value;
                                          flockingController.animation.flock.cohesionWeight = 1.0 * e.target.value;
                                          });
    
    //Aesthetic params
    this.visualrepresentation_shape.addEventListener ("change", visualrepresentationChange);
    this.shape_circle.addEventListener ("change", visualrepresentationChange);
    this.shape_triangle.addEventListener ("change", visualrepresentationChange);
    this.shape_square.addEventListener ("change", visualrepresentationChange);
    
    this.visualrepresentation_image.addEventListener ("change", visualrepresentationChange);
    this.image.addEventListener ("change", imageChange);
    
    this.oriented.addEventListener ("change", function(e){
                                    flockingController.animation.ORIENTEDTOWARDSMOVEMENT = e.target.checked;
                                    for (let i=0; i<flockingController.animation.flock.boids.length; i++)
                                    {
                                    flockingController.animation.flock.boids[i].orientedTowardsMovement = e.target.checked;
                                    }
                                    });
    this.color.addEventListener ("change", function(e){
                                 flockingController.animation.color = e.target.value;
                                 for (let i=0; i<flockingController.animation.flock.boids.length; i++)
                                 {
                                 flockingController.animation.flock.boids[i].color = e.target.value;
                                 }
                                 });
    
    //Download button
    this.downloadbutton.addEventListener ("click", downloadCodeFlocking);
}

/**
 * Sets default values on all input elements and animation parameters.
 */
FlockingController.prototype.setDefaultValues = function()
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
    
    this.scene_scale.value = 400;
    this.zoomlabel.value = 400;
    
    this.quantity.value = 200;
    this.size.value = 5;
    this.separationweight.value = 1.5;
    this.alignmentweight.value = 1.0;
    this.cohesionweight.value = 1.0;
    
    this.oriented.checked = true;
    this.visualrepresentation_image.checked = false;
    this.visualrepresentation_shape.checked = true;
    this.shape_circle.checked = false;
    this.shape_triangle.checked = true;
    this.shape_square.checked = false;
    this.color.value = "#000000";
    
    this.animation.GRID = this.grid.checked;
    
    this.animation.scenewidth = this.scene_scale.value * 1.0;
    
    this.animation.size = this.size.value * 1.0;
    this.animation.quantity = this.quantity.value * 1.0;
    this.animation.separationweight = this.separationweight.value * 1.0;
    this.animation.alignmentweight = this.alignmentweight.value * 1.0;
    this.animation.cohesionweight = this.cohesionweight.value * 1.0;
    
    if (this.visualrepresentation_shape.checked)
    {
        if (this.shape_triangle.checked)
        {
            this.animation.visualrepresentation = "triangle";
        }
        else if (this.shape_circle.checked)
        {
            this.animation.visualrepresentation = "circle";
        }
        else if (this.shape_square.checked)
        {
            this.animation.visualrepresentation = "square";
        }
    }
    else if (this.visualrepresentation_image.checked)
    {
        this.animation.visualrepresentation = this.imageObject;
    }
    this.animation.ORIENTEDTOWARDSMOVEMENT = this.oriented.checked;
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
        flockingController.ratio_16_9.checked = false;
        flockingController.ratio_16_9.nextSibling.innerHTML = "&#128275;16:9";
        flockingController.ratio_4_3.checked = false;
        flockingController.ratio_4_3.nextSibling.innerHTML = "&#128275;4:3";
        flockingController.ratio_1_1.checked = false;
        flockingController.ratio_1_1.nextSibling.innerHTML = "&#128275;1:1";
        flockingController.ratio_3_4.checked = false;
        flockingController.ratio_3_4.nextSibling.innerHTML = "&#128275;3:4";
        flockingController.ratio_9_16.checked = false;
        flockingController.ratio_9_16.nextSibling.innerHTML = "&#128275;9:16";
        
        switch (event.target.id)
        {
            case "ratio-16-9":
                flockingController.canvas.width = flockingController.canvas.height * 16 / 9;
                flockingController.ratio_16_9.nextSibling.innerHTML = "&#128274;16:9";
                break;
            case "ratio-4-3":
                flockingController.canvas.width = flockingController.canvas.height * 4 / 3;
                flockingController.ratio_4_3.nextSibling.innerHTML = "&#128274;4:3";
                break;
            case "ratio-1-1":
                flockingController.canvas.width = flockingController.canvas.height;
                flockingController.ratio_1_1.nextSibling.innerHTML = "&#128274;1:1";
                break;
            case "ratio-3-4":
                flockingController.canvas.width = flockingController.canvas.height * 3 / 4;
                flockingController.ratio_3_4.nextSibling.innerHTML = "&#128274;3:4";
                break;
            case "ratio-9-16":
                flockingController.canvas.width = flockingController.canvas.height * 9 / 16;
                flockingController.ratio_9_16.nextSibling.innerHTML = "&#128274;9:16";
                break;
        }
        flockingController.canvas_width.innerHTML = flockingController.canvas.width;
        
        event.target.checked = true;
    }
    else
    {
        switch (event.target.id)
        {
            case "ratio-16-9":
                flockingController.ratio_16_9.nextSibling.innerHTML = "&#128275;16:9";
                break;
            case "ratio-4-3":
                flockingController.ratio_4_3.nextSibling.innerHTML = "&#128275;4:3";
                break;
            case "ratio-1-1":
                flockingController.ratio_1_1.nextSibling.innerHTML = "&#128275;1:1";
                break;
            case "ratio-3-4":
                flockingController.ratio_3_4.nextSibling.innerHTML = "&#128275;3:4";
                break;
            case "ratio-9-16":
                flockingController.ratio_9_16.nextSibling.innerHTML = "&#128275;9:16";
                break;
        }
    }
}

/**
 * Quantity change event listener.
 */
function quantityChange (event)
{
    var quantity = event.target.value;
    if (flockingController.animation.flock.boids.length >= quantity)
    {
        flockingController.animation.flock.boids.length = quantity;
        flockingController.animation.quantity = quantity;
    }
    else
    {
        var amountToAdd = quantity - flockingController.animation.flock.boids.length;
        for (var i=0; i<amountToAdd; i++)
        {
            var angle = getRandomBetween (0, 2 * Math.PI);
            flockingController.animation.flock.addBoid (new Boid (flockingController.animation.visualrepresentation,
                                                                  flockingController.animation.size,
                                                                  new Vector (0, 0),
                                                                  new Vector (Math.cos(angle), Math.sin(angle)),
                                                                  new Vector(),
                                                                  2,
                                                                  0.03,
                                                                  flockingController.animation.ORIENTEDTOWARDSMOVEMENT));
            flockingController.animation.flock.boids[i].color = flockingController.animation.color;
        }
        flockingController.animation.quantity = quantity;
    }
}

/**
 * Visual representation change event listener.
 */
function visualrepresentationChange (event)
{
    var visualrepresentation = flockingController.animation.visualrepresentation;
    
    if (flockingController.visualrepresentation_shape.checked)
    {
        if (flockingController.shape_triangle.checked)
        {
            visualrepresentation = "triangle";
        }
        else if (flockingController.shape_circle.checked)
        {
            visualrepresentation = "circle";
        }
        else if (flockingController.shape_square.checked)
        {
            visualrepresentation = "square";
        }
    }
    else if (flockingController.visualrepresentation_image.checked)
    {
        if (typeof(flockingController.imageObject) !== "undefined" && flockingController.imageObject !== null)
        {
            visualrepresentation = new Image();
            visualrepresentation.src = flockingController.imageObject.src;
            //visualrepresentation = this.imageObject;
        }
    }
    
    flockingController.animation.visualrepresentation = visualrepresentation;
    for (let i=0; i<flockingController.animation.flock.boids.length; i++)
    {
        flockingController.animation.flock.boids[i].visualrepresentation = visualrepresentation;
    }
}

/**
 * Image change event listener.
 */
function imageChange (event)
{
    var file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.onload = function()
    {
        flockingController.visualrepresentation_shape.checked = false;
        flockingController.visualrepresentation_image.checked = true;
        flockingController.animation.visualrepresentation = new Image();
        flockingController.animation.visualrepresentation.src = reader.result;
        flockingController.imageObject = new Image();
        flockingController.imageObject.src = reader.result;
        for (let i=0; i<flockingController.animation.flock.boids.length; i++)
        {
            flockingController.animation.flock.boids[i].visualrepresentation = flockingController.animation.visualrepresentation;
        }
    }
    if (file)
    {
        reader.readAsDataURL (file);
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
        var x = event.clientX - offset(flockingController.canvas).left;
        var y = event.clientY - offset(flockingController.canvas).top;
        
        if (x > flockingController.canvas.width - 15 && x < flockingController.canvas.width && y > flockingController.canvas.height - 15 && y < flockingController.canvas.height)
        {
            FLAG_RESIZING = true;
            offsetRight = flockingController.canvas.width - x;
            offsetBottom = flockingController.canvas.height - y;
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
    var x = event.clientX - offset(flockingController.canvas).left;
    var y = event.clientY - offset(flockingController.canvas).top;
    
    if (FLAG_RESIZING)
    {
        if (flockingController.lock_canvas_height.checked)
        {
            if (!(flockingController.lock_canvas_width.checked || flockingController.ratio_16_9.checked || flockingController.ratio_4_3.checked || flockingController.ratio_1_1.checked || flockingController.ratio_3_4.checked || flockingController.ratio_9_16.checked))
            {
                flockingController.canvas.width = x + offsetRight;
            }
        }
        else if (flockingController.lock_canvas_width.checked)
        {
            if (!(flockingController.ratio_16_9.checked || flockingController.ratio_4_3.checked || flockingController.ratio_1_1.checked || flockingController.ratio_3_4.checked || flockingController.ratio_9_16.checked))
            {
                flockingController.canvas.height = y + offsetBottom;
            }
        }
        else
        {
            flockingController.canvas.height = y + offsetBottom;
            flockingController.canvas.width = x + offsetRight;
            if (flockingController.ratio_16_9.checked)
            {
                flockingController.canvas.width = flockingController.canvas.height * 16 / 9;
            }
            else if (flockingController.ratio_4_3.checked)
            {
                flockingController.canvas.width = flockingController.canvas.height * 4 / 3;
            }
            else if (flockingController.ratio_1_1.checked)
            {
                flockingController.canvas.width = flockingController.canvas.height;
            }
            else if (flockingController.ratio_3_4.checked)
            {
                flockingController.canvas.width = flockingController.canvas.height * 3 / 4;
            }
            else if (flockingController.ratio_9_16.checked)
            {
                flockingController.canvas.width = flockingController.canvas.height * 9 / 16;
            }
        }
        flockingController.canvas_width.innerHTML = flockingController.canvas.width;
        flockingController.canvas_height.innerHTML = flockingController.canvas.height;
        
        flockingController.animation.draw();
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

/**
 * Generates a script that runs an animation with the current parameters.
 * @returns {string} a script that runs a flocking animation
 */
function generateCodeFlocking()
{
    var randomNumber = Math.floor (getRandomBetween (1000, 9999));
    
    var generatedCode = '\n\n//Defining settings object:\n';
    generatedCode += 'var settings' + randomNumber + ' = [];\n';
    generatedCode += 'settings' + randomNumber + '.scenewidth = ' + flockingController.animation.scenewidth + ';\n';
    generatedCode += 'settings' + randomNumber + '.size = ' + flockingController.animation.size + ';\n';
    generatedCode += 'settings' + randomNumber + '.quantity = ' + flockingController.animation.quantity + ';\n';
    generatedCode += 'settings' + randomNumber + '.separationweight = ' + flockingController.animation.separationweight + ';\n';
    generatedCode += 'settings' + randomNumber + '.alignmentweight = ' + flockingController.animation.alignmentweight + ';\n';
    generatedCode += 'settings' + randomNumber + '.cohesionweight = ' + flockingController.animation.cohesionweight + ';\n';
    if (flockingController.animation.visualrepresentation instanceof Image)
    {
        generatedCode += 'settings' + randomNumber + '.visualrepresentation = new Image();\n';
        generatedCode += 'settings' + randomNumber + '.visualrepresentation.src = "' + flockingController.animation.visualrepresentation.src + '";\n';
    }
    else
    {
        generatedCode += 'settings' + randomNumber + '.visualrepresentation = "' + flockingController.animation.visualrepresentation + '";\n';
    }
    generatedCode += 'settings' + randomNumber + '.ORIENTEDTOWARDSMOVEMENT = ' + flockingController.animation.ORIENTEDTOWARDSMOVEMENT + ';\n';
    generatedCode += 'settings' + randomNumber + '.color = "' + flockingController.animation.color + '";\n';
    generatedCode += '\n';
    generatedCode += '//Creating the animation\n';
    generatedCode += 'var animation' + randomNumber + ' = new FlockingAnimation (document.getElementById("EasyPhysics"), false);\n';
    generatedCode += 'animation' + randomNumber + '.canvas.width = ' + flockingController.animation.canvas.width + ';\n';
    generatedCode += 'animation' + randomNumber + '.canvas.height = ' + flockingController.animation.canvas.height + ';\n';
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

var flockingController = new FlockingController();

(function animationLoop()
 {
 flockingController.animation.draw();
 window.requestAnimationFrame (animationLoop);
 })();
