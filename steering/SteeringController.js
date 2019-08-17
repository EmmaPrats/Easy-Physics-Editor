"use strict";

////////////////////////////////////////////////////////////////////
//                                                                //
//   TABLE OF CONTENTS:                                           //
//                                                                //
//   Steering controller class                                    //
//   Relatively complex functions that get called from a listener //
//   Canvas resizing                                              //
//   Code generator and downloader                                //
//   Start simulation                                             //
//                                                                //
////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////
//                                               //
//           STEERING CONTROLLER CLASS           //
//                                               //
///////////////////////////////////////////////////

/**
 * Creates a controller for the steering animation.
 * @class
 */
function SteeringController()
{
    this.canvas = document.getElementById ("eptfg-canvas");
    this.context = this.canvas.getContext ("2d");
    
    this.animation = new SteeringAnimation (this.canvas, true);
    
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
    
    this.size = document.getElementById("input-radius");
    
    this.huntdistance = document.getElementById("input-huntdistance");
    this.pursueweight = document.getElementById("input-pursueweight");
    this.show_huntdistance = document.getElementById("input-show-huntdistance");
    
    this.gatherdistance = document.getElementById("input-gatherdistance");
    this.seekweight = document.getElementById("input-seekweight");
    this.show_gatherdistance = document.getElementById("input-show-gatherdistance");
    this.evadedistance = document.getElementById("input-evadedistance");
    this.evadeweight = document.getElementById("input-evadeweight");
    this.show_evadedistance = document.getElementById("input-show-evadedistance");
    
    this.oriented_hunter = document.getElementById("input-oriented-hunter");
    this.visualrepresentation_shape_hunter = document.getElementById("input-visualrepresentation-shape-hunter");
    this.shape_circle_hunter = document.getElementById("input-shape-circle-hunter");
    this.shape_triangle_hunter = document.getElementById("input-shape-triangle-hunter");
    this.shape_square_hunter = document.getElementById("input-shape-square-hunter");
    this.color_hunter = document.getElementById("input-color-hunter");
    this.visualrepresentation_image_hunter = document.getElementById("input-visualrepresentation-image-hunter");
    this.image_hunter = document.getElementById("input-image-hunter");
    this.imagesrc_hunter = document.getElementById("image-src-hunter");
    this.imagepreview_hunter = document.getElementById("image-preview-hunter");
    
    this.oriented_gatherer = document.getElementById("input-oriented-gatherer");
    this.visualrepresentation_shape_gatherer = document.getElementById("input-visualrepresentation-shape-gatherer");
    this.shape_circle_gatherer = document.getElementById("input-shape-circle-gatherer");
    this.shape_triangle_gatherer = document.getElementById("input-shape-triangle-gatherer");
    this.shape_square_gatherer = document.getElementById("input-shape-square-gatherer");
    this.color_gatherer = document.getElementById("input-color-gatherer");
    this.visualrepresentation_image_gatherer = document.getElementById("input-visualrepresentation-image-gatherer");
    this.image_gatherer = document.getElementById("input-image-gatherer");
    this.imagesrc_gatherer = document.getElementById("image-src-gatherer");
    this.imagepreview_gatherer = document.getElementById("image-preview-gatherer");
    
    this.visualrepresentation_shape_target = document.getElementById("input-visualrepresentation-shape-target");
    this.shape_circle_target = document.getElementById("input-shape-circle-target");
    this.shape_triangle_target = document.getElementById("input-shape-triangle-target");
    this.shape_square_target = document.getElementById("input-shape-square-target");
    this.color_target = document.getElementById("input-color-target");
    this.visualrepresentation_image_target = document.getElementById("input-visualrepresentation-image-target");
    this.image_target = document.getElementById("input-image-target");
    this.imagesrc_target = document.getElementById("image-src-target");
    this.imagepreview_target = document.getElementById("image-preview-target");
    
    this.active_hunter = document.getElementById("input-active-hunter");
    this.active_gatherer = document.getElementById("input-active-gatherer");
    this.active_target = document.getElementById("input-active-target");
    
    this.imageObject_hunter;
    this.imageObject_gatherer;
    this.imageObject_target;
    
    if (typeof this.imagesrc_hunter.value !== "undefined" && this.imagesrc_hunter.value != "" && this.imagesrc_hunter.value != null)
    {
        this.imageObject_hunter = new Image();
        this.imageObject_hunter.src = this.imagesrc_hunter.value;
    }
    if (typeof this.imagesrc_gatherer.value !== "undefined" && this.imagesrc_gatherer.value != "" && this.imagesrc_gatherer.value != null)
    {
        this.imageObject_gatherer = new Image();
        this.imageObject_gatherer.src = this.imagesrc_gatherer.value;
    }
    if (typeof this.imagesrc_target.value !== "undefined" && this.imagesrc_target.value != "" && this.imagesrc_target.value != null)
    {
        this.imageObject_target = new Image();
        this.imageObject_target.src = this.imagesrc_target.value;
    }
    
    this.restartsimulation = document.getElementById("restart-simulation-button");
    this.defaultvalues = document.getElementById("default-values-button");
    this.downloadbutton = document.getElementById("button-downloadfile");
    
    this.addEventListeners();
}

/**
 * Adds event listeners to all input elements.
 */
SteeringController.prototype.addEventListeners = function()
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
                                         steeringController.setDefaultValues();
                                         steeringController.animation.initSimulation();
                                         }
                                         });
    this.restartsimulation.addEventListener ("click", function(e){steeringController.animation.initSimulation();});
    
    //Editor params
    this.grid.addEventListener ("change", function(e){steeringController.animation.GRID = e.target.checked;});
    this.show_huntdistance.addEventListener ("change", function(e){steeringController.animation.SHOWPURSUEDISTANCE=e.target.checked;});
    this.show_gatherdistance.addEventListener ("change", function(e){steeringController.animation.SHOWSEEKDISTANCE=e.target.checked;});
    this.show_evadedistance.addEventListener ("change", function(e){steeringController.animation.SHOWEVADEDISTANCE=e.target.checked;});
    
    //Scene params
    this.scene_scale.addEventListener ("input", function(e){
                                       steeringController.animation.scenewidth = 1.0 * e.target.value;
                                       steeringController.zoomlabel.value = 1.0 * e.target.value;
                                       });
    this.zoomlabel.addEventListener ("change", function(e){
                                     steeringController.scene_scale.value = 1.0 * e.target.value;
                                     steeringController.animation.scenewidth = 1.0 * e.target.value;
                                     });
    this.active_hunter.addEventListener ("change", function(e){
                                         steeringController.animation.EXISTS_hunter = e.target.checked;
                                         if (e.target.checked)
                                         {
                                         var worldHeight = steeringController.animation.scenewidth * steeringController.animation.canvas.height / steeringController.animation.canvas.width;
                                         steeringController.animation.hunter = new Boid (steeringController.animation.visualrepresentation_hunter,
                                                                                         steeringController.animation.size,
                                                                                         new Vector (getRandomBetween(-steeringController.animation.scenewidth/2, steeringController.animation.scenewidth/2),
                                                                                                     getRandomBetween(-worldHeight/2, worldHeight/2)),
                                                                                         new Vector(),
                                                                                         new Vector(),
                                                                                         2,
                                                                                         0.03,
                                                                                         steeringController.animation.ORIENTEDTOWARDSMOVEMENT_hunter);
                                         steeringController.animation.hunter.color = steeringController.animation.color_hunter;
                                         }
                                         else
                                         {
                                         steeringController.animation.hunter = null;
                                         }
                                         });
    this.active_gatherer.addEventListener ("change", function(e){
                                           steeringController.animation.EXISTS_gatherer = e.target.checked;
                                           if (e.target.checked)
                                           {
                                           var worldHeight = steeringController.animation.scenewidth * steeringController.animation.canvas.height / steeringController.animation.canvas.width;
                                           steeringController.animation.gatherer = new Boid (steeringController.animation.visualrepresentation_gatherer,
                                                                                             steeringController.animation.size,
                                                                                             new Vector (getRandomBetween(-steeringController.animation.scenewidth/2, steeringController.animation.scenewidth/2),
                                                                                                         getRandomBetween(-worldHeight/2, worldHeight/2)),
                                                                                             new Vector(),
                                                                                             new Vector(),
                                                                                             2,
                                                                                             0.03,
                                                                                             steeringController.animation.ORIENTEDTOWARDSMOVEMENT_gatherer);
                                           steeringController.animation.gatherer.color = steeringController.animation.color_gatherer;
                                           }
                                           else
                                           {
                                           steeringController.animation.gatherer = null;
                                           }
                                           });
    this.active_target.addEventListener ("change", function(e){
                                         steeringController.animation.EXISTS_target = e.target.checked;
                                         if (e.target.checked)
                                         {
                                         var worldHeight = steeringController.animation.scenewidth * steeringController.animation.canvas.height / steeringController.animation.canvas.width;
                                         steeringController.animation.target = new Vector (getRandomBetween (-steeringController.animation.scenewidth/2, steeringController.animation.scenewidth/2),
                                                                                           getRandomBetween(-worldHeight/2, worldHeight/2));
                                         }
                                         else
                                         {
                                         steeringController.animation.target = null;
                                         }
                                         });
    
    //Simulation params
    this.size.addEventListener ("change", function(e){
                                steeringController.animation.size = 1.0 * e.target.value;
                                if (steeringController.animation.hunter !== null) steeringController.animation.hunter.radius = 1.0 * e.target.value;
                                if (steeringController.animation.gatherer !== null) steeringController.animation.gatherer.radius = 1.0 * e.target.value;
                                });
    this.huntdistance.addEventListener ("change", function(e){steeringController.animation.pursuedistance = 1.0*e.target.value;});
    this.gatherdistance.addEventListener ("change", function(e){steeringController.animation.seekdistance = 1.0*e.target.value;});
    this.evadedistance.addEventListener ("change", function(e){steeringController.animation.evadedistance = 1.0*e.target.value;});
    this.pursueweight.addEventListener ("change", function(e){steeringController.animation.pursueweight = 1.0*e.target.value;});
    this.seekweight.addEventListener ("change", function(e){steeringController.animation.seekweight = 1.0*e.target.value;});
    this.evadeweight.addEventListener ("change", function(e){steeringController.animation.evadeweight = 1.0*e.target.value;});
    
    //Aesthetic params
    this.visualrepresentation_shape_hunter.addEventListener ("change", visualrepresentationChange);
    this.shape_circle_hunter.addEventListener ("change", visualrepresentationChange);
    this.shape_triangle_hunter.addEventListener ("change", visualrepresentationChange);
    this.shape_square_hunter.addEventListener ("change", visualrepresentationChange);
    this.visualrepresentation_image_hunter.addEventListener ("change", visualrepresentationChange);
    this.image_hunter.addEventListener ("change", imageChangeHunter);
    this.oriented_hunter.addEventListener ("change", function(e){
                                           steeringController.animation.ORIENTEDTOWARDSMOVEMENT_hunter = e.target.checked;
                                           if (steeringController.animation.hunter !== null) steeringController.animation.hunter.orientedTowardsMovement = e.target.checked;
                                           });
    this.color_hunter.addEventListener ("change", function(e){
                                        steeringController.animation.color_hunter = e.target.value;
                                        if (steeringController.animation.hunter !== null) steeringController.animation.hunter.color = e.target.value;
                                        });
    
    this.visualrepresentation_shape_gatherer.addEventListener ("change", visualrepresentationChange);
    this.shape_circle_gatherer.addEventListener ("change", visualrepresentationChange);
    this.shape_triangle_gatherer.addEventListener ("change", visualrepresentationChange);
    this.shape_square_gatherer.addEventListener ("change", visualrepresentationChange);
    this.visualrepresentation_image_gatherer.addEventListener ("change", visualrepresentationChange);
    this.image_gatherer.addEventListener ("change", imageChangeGatherer);
    this.oriented_gatherer.addEventListener ("change", function(e){
                                             steeringController.animation.ORIENTEDTOWARDSMOVEMENT_gatherer = e.target.checked;
                                             if (steeringController.animation.gatherer !== null) steeringController.animation.gatherer.orientedTowardsMovement = e.target.checked;
                                             });
    this.color_gatherer.addEventListener ("change", function(e){
                                          steeringController.animation.color_gatherer = e.target.value;
                                          if (steeringController.animation.gatherer !== null) steeringController.animation.gatherer.color = e.target.value;
                                          });
    
    this.visualrepresentation_shape_target.addEventListener ("change", visualrepresentationChange);
    this.shape_circle_target.addEventListener ("change", visualrepresentationChange);
    this.shape_triangle_target.addEventListener ("change", visualrepresentationChange);
    this.shape_square_target.addEventListener ("change", visualrepresentationChange);
    this.visualrepresentation_image_target.addEventListener ("change", visualrepresentationChange);
    this.image_target.addEventListener ("change", imageChangeTarget);
    this.color_target.addEventListener ("change", function(e){steeringController.animation.color_target = e.target.value;});
    
    if (typeof (this.downloadbutton) !== "undefined" && this.downloadbutton != null)
        this.downloadbutton.addEventListener ("click", downloadCodeSteering);
}

/**
 * Sets default values on all input elements and animation parameters.
 */
SteeringController.prototype.setDefaultValues = function()
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
    
    this.size.value = 5;
    
    this.huntdistance.value = 50;
    this.pursueweight.value = 1.0;
    this.show_huntdistance.checked = false;
    
    this.gatherdistance.value = 50;
    this.seekweight.value = 1.0;
    this.show_gatherdistance.checked = false;
    this.evadedistance.value = 50;
    this.evadeweight.value = 1.0;
    this.show_evadedistance.checked = false;
    
    this.oriented_hunter.value = true;
    this.visualrepresentation_image_hunter.checked = false;
    this.visualrepresentation_shape_hunter.checked = true;
    this.shape_circle_hunter.checked = false;
    this.shape_square_hunter.checked = false;
    this.shape_triangle_hunter.checked = true;
    this.color_hunter.value = "#000000";
    
    this.oriented_gatherer.value = true;
    this.visualrepresentation_image_gatherer.checked = false;
    this.visualrepresentation_shape_gatherer.checked = true;
    this.shape_triangle_gatherer.checked = false;
    this.shape_square_gatherer.checked = false;
    this.shape_circle_gatherer.checked = true;
    this.color_gatherer.value = "#000000";
    
    this.visualrepresentation_image_target.checked = false;
    this.visualrepresentation_shape_target.checked = true;
    this.shape_triangle_target.checked = false;
    this.shape_circle_target.checked = false;
    this.shape_square_target.checked = true;
    this.color_target.value = "#000000";
    
    this.active_hunter.checked = true;
    this.active_gatherer.checked = true;
    this.active_target.checked = true;
    
    
    this.animation.GRID = this.grid.checked;
    this.animation.SHOWPURSUEDISTANCE = this.show_huntdistance.checked;
    this.animation.SHOWSEEKDISTANCE = this.show_gatherdistance.checked;
    this.animation.SHOWEVADEDISTANCE = this.show_evadedistance.checked;
    
    this.animation.scenewidth = this.scene_scale.value * 1.0;
    this.animation.EXISTS_hunter = this.active_hunter.checked;
    this.animation.EXISTS_gatherer = this.active_gatherer.checked;
    this.animation.EXISTS_target = this.active_target.checked;
    
    this.animation.size = this.size.value * 1.0;
    this.animation.pursuedistance = this.huntdistance.value * 1.0;
    this.animation.seekdistance = this.gatherdistance.value * 1.0;
    this.animation.evadedistance = this.evadedistance.value * 1.0;
    this.animation.pursueweight = this.pursueweight.value * 1.0;
    this.animation.seekweight = this.seekweight.value * 1.0;
    this.animation.evadeweight = this.evadeweight.value * 1.0;
    
    if (this.visualrepresentation_shape_hunter.checked)
    {
        if (this.shape_triangle_hunter.checked)
        {
            this.animation.visualrepresentation_hunter = "triangle";
        }
        else if (this.shape_circle_hunter.checked)
        {
            this.animation.visualrepresentation_hunter = "circle";
        }
        else if (this.shape_square_hunter.checked)
        {
            this.animation.visualrepresentation_hunter = "square";
        }
    }
    else if (this.visualrepresentation_image_hunter.checked)
    {
        this.animation.visualrepresentation_hunter = this.imageObject_hunter;
    }
    this.animation.ORIENTEDTOWARDSMOVEMENT_hunter = this.oriented_hunter.value;
    this.animation.color_hunter = this.color_hunter.value;
    
    if (this.visualrepresentation_shape_gatherer.checked)
    {
        if (this.shape_triangle_gatherer.checked)
        {
            this.animation.visualrepresentation_gatherer = "triangle";
        }
        else if (this.shape_circle_gatherer.checked)
        {
            this.animation.visualrepresentation_gatherer = "circle";
        }
        else if (this.shape_square_gatherer.checked)
        {
            this.animation.visualrepresentation_gatherer = "square";
        }
    }
    else if (this.visualrepresentation_image_target.checked)
    {
        this.animation.visualrepresentation_target = this.imageObject_target;
    }
    this.animation.ORIENTEDTOWARDSMOVEMENT_gatherer = this.oriented_gatherer.value;
    this.animation.color_gatherer = this.color_gatherer.value;
    
    if (this.visualrepresentation_shape_target.checked)
    {
        if (this.shape_triangle_target.checked)
        {
            this.animation.visualrepresentation_target = "triangle";
        }
        else if (this.shape_circle_target.checked)
        {
            this.animation.visualrepresentation_target = "circle";
        }
        else if (this.shape_square_target.checked)
        {
            this.animation.visualrepresentation_target = "square";
        }
    }
    else if (this.visualrepresentation_image_target.checked)
    {
        this.animation.visualrepresentation_target = this.imageObject_target;
    }
    this.animation.ORIENTEDTOWARDSMOVEMENT_target = this.oriented_target.value;
    this.animation.color_target = this.color_target.value;
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
        steeringController.ratio_16_9.checked = false;
        steeringController.ratio_16_9.nextSibling.innerHTML = "&#128275;16:9";
        steeringController.ratio_4_3.checked = false;
        steeringController.ratio_4_3.nextSibling.innerHTML = "&#128275;4:3";
        steeringController.ratio_1_1.checked = false;
        steeringController.ratio_1_1.nextSibling.innerHTML = "&#128275;1:1";
        steeringController.ratio_3_4.checked = false;
        steeringController.ratio_3_4.nextSibling.innerHTML = "&#128275;3:4";
        steeringController.ratio_9_16.checked = false;
        steeringController.ratio_9_16.nextSibling.innerHTML = "&#128275;9:16";
        
        switch (event.target.id)
        {
            case "ratio-16-9":
                steeringController.canvas.width = steeringController.canvas.height * 16 / 9;
                steeringController.ratio_16_9.nextSibling.innerHTML = "&#128274;16:9";
                break;
            case "ratio-4-3":
                steeringController.canvas.width = steeringController.canvas.height * 4 / 3;
                steeringController.ratio_4_3.nextSibling.innerHTML = "&#128274;4:3";
                break;
            case "ratio-1-1":
                steeringController.canvas.width = steeringController.canvas.height;
                steeringController.ratio_1_1.nextSibling.innerHTML = "&#128274;1:1";
                break;
            case "ratio-3-4":
                steeringController.canvas.width = steeringController.canvas.height * 3 / 4;
                steeringController.ratio_3_4.nextSibling.innerHTML = "&#128274;3:4";
                break;
            case "ratio-9-16":
                steeringController.canvas.width = steeringController.canvas.height * 9 / 16;
                steeringController.ratio_9_16.nextSibling.innerHTML = "&#128274;9:16";
                break;
        }
        steeringController.canvas_width.innerHTML = steeringController.canvas.width;
        
        event.target.checked = true;
    }
    else
    {
        switch (event.target.id)
        {
            case "ratio-16-9":
                steeringController.ratio_16_9.nextSibling.innerHTML = "&#128275;16:9";
                break;
            case "ratio-4-3":
                steeringController.ratio_4_3.nextSibling.innerHTML = "&#128275;4:3";
                break;
            case "ratio-1-1":
                steeringController.ratio_1_1.nextSibling.innerHTML = "&#128275;1:1";
                break;
            case "ratio-3-4":
                steeringController.ratio_3_4.nextSibling.innerHTML = "&#128275;3:4";
                break;
            case "ratio-9-16":
                steeringController.ratio_9_16.nextSibling.innerHTML = "&#128275;9:16";
                break;
        }
    }
}

/**
 * Visual representation change event listener.
 */
function visualrepresentationChange (event)
{
    var visualrepresentation_hunter = steeringController.animation.visualrepresentation_hunter;
    var visualrepresentation_gatherer = steeringController.animation.visualrepresentation_gatherer;
    var visualrepresentation_target = steeringController.animation.visualrepresentation_target;
    
    if (steeringController.visualrepresentation_shape_hunter.checked)
    {
        if (steeringController.shape_triangle_hunter.checked)
        {
            visualrepresentation_hunter = "triangle";
        }
        else if (steeringController.shape_circle_hunter.checked)
        {
            visualrepresentation_hunter = "circle";
        }
        else if (steeringController.shape_square_hunter.checked)
        {
            visualrepresentation_hunter = "square";
        }
    }
    else if (steeringController.visualrepresentation_image_hunter.checked)
    {
        if (typeof(steeringController.imageObject_hunter) !== "undefined" && steeringController.imageObject_hunter !== null)
        {
            visualrepresentation_hunter = new Image();
            visualrepresentation_hunter.src = steeringController.imageObject_hunter.src;
        }
    }
    if (steeringController.visualrepresentation_shape_gatherer.checked)
    {
        if (steeringController.shape_triangle_gatherer.checked)
        {
            visualrepresentation_gatherer = "triangle";
        }
        else if (steeringController.shape_circle_gatherer.checked)
        {
            visualrepresentation_gatherer = "circle";
        }
        else if (steeringController.shape_square_gatherer.checked)
        {
            visualrepresentation_gatherer = "square";
        }
    }
    else if (steeringController.visualrepresentation_image_gatherer.checked)
    {
        if (!(typeof(steeringController.imageObject_gatherer) === "undefined" || steeringController.imageObject_gatherer === null))
        {
            visualrepresentation_gatherer = new Image();
            visualrepresentation_gatherer.src = steeringController.imageObject_gatherer.src;
        }
    }
    if (steeringController.visualrepresentation_shape_target.checked)
    {
        if (steeringController.shape_circle_target.checked)
        {
            visualrepresentation_target = "circle";
        }
        else if (steeringController.shape_square_target.checked)
        {
            visualrepresentation_target = "square";
        }
        else if (steeringController.shape_triangle_target.checked)
        {
            visualrepresentation_target = "triangle";
        }
    }
    else if (steeringController.visualrepresentation_image_target.checked)
    {
        if (!(typeof(steeringController.imageObject_target) === "undefined" || steeringController.imageObject_target === null))
        {
            visualrepresentation_target = new Image();
            visualrepresentation_target.src = steeringController.imageObject_target.src;
        }
    }
    
    steeringController.animation.visualrepresentation_hunter = visualrepresentation_hunter;
    if (steeringController.animation.hunter !== null) steeringController.animation.hunter.visualrepresentation = visualrepresentation_hunter;
    steeringController.animation.visualrepresentation_gatherer = visualrepresentation_gatherer;
    if (steeringController.animation.gatherer !== null) steeringController.animation.gatherer.visualrepresentation = visualrepresentation_gatherer;
    steeringController.animation.visualrepresentation_target = visualrepresentation_target;
}
/**
 * Image change event listener.
 */
function imageChangeHunter (event)
{
    var file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.onload = function()
    {
        steeringController.visualrepresentation_shape_hunter.checked = false;
        steeringController.visualrepresentation_image_hunter.checked = true;
        if (steeringController.animation.hunter !== null) steeringController.animation.hunter.visualrepresentation = new Image();
        if (steeringController.animation.hunter !== null) steeringController.animation.hunter.visualrepresentation.src = reader.result;
        steeringController.animation.visualrepresentation_hunter = new Image();
        steeringController.animation.visualrepresentation_hunter.src = reader.result;
        steeringController.imageObject_hunter = new Image();
        steeringController.imageObject_hunter.src = reader.result;
        steeringController.imagepreview_hunter.src = reader.result;
        steeringController.imagesrc_hunter.value = reader.result;
    }
    if (file)
    {
        reader.readAsDataURL (file);
    }
}

/**
 * Image change event listener.
 */
function imageChangeGatherer (event)
{
    var file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.onload = function()
    {
        steeringController.visualrepresentation_shape_gatherer.checked = false;
        steeringController.visualrepresentation_image_gatherer.checked = true;
        if (steeringController.animation.gatherer !== null) steeringController.animation.gatherer.visualrepresentation = new Image();
        if (steeringController.animation.gatherer !== null) steeringController.animation.gatherer.visualrepresentation.src = reader.result;
        steeringController.animation.visualrepresentation_gatherer = new Image();
        steeringController.animation.visualrepresentation_gatherer.src = reader.result;
        steeringController.imageObject_gatherer = new Image();
        steeringController.imageObject_gatherer.src = reader.result;
        steeringController.imagepreview_gatherer.src = reader.result;
        steeringController.imagesrc_gatherer.value = reader.result;
    }
    if (file)
    {
        reader.readAsDataURL (file);
    }
}

/**
 * Image change event listener.
 */
function imageChangeTarget (event)
{
    var file = event.target.files && event.target.files[0];
    var reader = new FileReader();
    reader.onload = function()
    {
        steeringController.visualrepresentation_shape_target.checked = false;
        steeringController.visualrepresentation_image_target.checked = true;
        steeringController.animation.visualrepresentation_target = new Image();
        steeringController.animation.visualrepresentation_target.src = reader.result;
        steeringController.imageObject_target = new Image();
        steeringController.imageObject_target.src = reader.result;
        steeringController.imagepreview_target.src = reader.result;
        steeringController.imagesrc_target.value = reader.result;
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
        var x = event.clientX - offset(steeringController.canvas).left;
        var y = event.clientY - offset(steeringController.canvas).top;
        
        if (x > steeringController.canvas.width - 15 && x < steeringController.canvas.width && y > steeringController.canvas.height - 15 && y < steeringController.canvas.height)
        {
            FLAG_RESIZING = true;
            offsetRight = steeringController.canvas.width - x;
            offsetBottom = steeringController.canvas.height - y;
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
    var x = event.clientX - offset(steeringController.canvas).left;
    var y = event.clientY - offset(steeringController.canvas).top;
    
    if (FLAG_RESIZING)
    {
        if (steeringController.lock_canvas_height.checked)
        {
            if (!(steeringController.lock_canvas_width.checked || steeringController.ratio_16_9.checked || steeringController.ratio_4_3.checked || steeringController.ratio_1_1.checked || steeringController.ratio_3_4.checked || steeringController.ratio_9_16.checked))
            {
                steeringController.canvas.width = x + offsetRight;
            }
        }
        else if (steeringController.lock_canvas_width.checked)
        {
            if (!(steeringController.ratio_16_9.checked || steeringController.ratio_4_3.checked || steeringController.ratio_1_1.checked || steeringController.ratio_3_4.checked || steeringController.ratio_9_16.checked))
            {
                steeringController.canvas.height = y + offsetBottom;
            }
        }
        else
        {
            steeringController.canvas.height = y + offsetBottom;
            steeringController.canvas.width = x + offsetRight;
            if (steeringController.ratio_16_9.checked)
            {
                steeringController.canvas.width = steeringController.canvas.height * 16 / 9;
            }
            else if (steeringController.ratio_4_3.checked)
            {
                steeringController.canvas.width = steeringController.canvas.height * 4 / 3;
            }
            else if (steeringController.ratio_1_1.checked)
            {
                steeringController.canvas.width = steeringController.canvas.height;
            }
            else if (steeringController.ratio_3_4.checked)
            {
                steeringController.canvas.width = steeringController.canvas.height * 3 / 4;
            }
            else if (steeringController.ratio_9_16.checked)
            {
                steeringController.canvas.width = steeringController.canvas.height * 9 / 16;
            }
        }
        steeringController.canvas_width.innerHTML = steeringController.canvas.width;
        steeringController.canvas_height.innerHTML = steeringController.canvas.height;
        
        steeringController.animation.draw();
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

/**
 * Generates a script that runs an animation with the current parameters.
 * @returns {string} a script that runs a steering animation
 */
function generateCodeSteering()
{
    var randomNumber = Math.floor (getRandomBetween (1000, 9999));
    
    var generatedCode = '\n\n//Defining settings object:\n';
    generatedCode += 'var settings' + randomNumber + ' = [];\n';
    generatedCode += 'settings' + randomNumber + '.scenewidth = ' + steeringController.animation.scenewidth + ';\n';
    generatedCode += 'settings' + randomNumber + '.EXISTS_hunter = ' + steeringController.animation.EXISTS_hunter + ';\n';
    generatedCode += 'settings' + randomNumber + '.EXISTS_gatherer = ' + steeringController.animation.EXISTS_gatherer + ';\n';
    generatedCode += 'settings' + randomNumber + '.EXISTS_target = ' + steeringController.animation.EXISTS_target + ';\n';
    generatedCode += 'settings' + randomNumber + '.size = ' + steeringController.animation.size + ';\n';
    generatedCode += 'settings' + randomNumber + '.pursuedistance = ' + steeringController.animation.pursuedistance + ';\n';
    generatedCode += 'settings' + randomNumber + '.seekdistance = ' + steeringController.animation.seekdistance + ';\n';
    generatedCode += 'settings' + randomNumber + '.evadedistance = ' + steeringController.animation.evadedistance + ';\n';
    generatedCode += 'settings' + randomNumber + '.pursueweight = ' + steeringController.animation.pursueweight + ';\n';
    generatedCode += 'settings' + randomNumber + '.seekweight = ' + steeringController.animation.seekweight + ';\n';
    generatedCode += 'settings' + randomNumber + '.evadeweight = ' + steeringController.animation.evadeweight + ';\n';
    if (steeringController.animation.visualrepresentation_hunter instanceof Image)
    {
        generatedCode += 'settings' + randomNumber + '.visualrepresentation_hunter = new Image();\n';
        generatedCode += 'settings' + randomNumber + '.visualrepresentation_hunter.src = "' + steeringController.animation.visualrepresentation_hunter.src + '";\n';
    }
    else
    {
        generatedCode += 'settings' + randomNumber + '.visualrepresentation_hunter = "' + steeringController.animation.visualrepresentation_hunter + '";\n';
    }
    generatedCode += 'settings' + randomNumber + '.ORIENTEDTOWARDSMOVEMENT_hunter = ' + steeringController.animation.ORIENTEDTOWARDSMOVEMENT_hunter + ';\n';
    generatedCode += 'settings' + randomNumber + '.color_hunter = "' + steeringController.animation.color_hunter + '";\n';
    if (steeringController.animation.visualrepresentation_gatherer instanceof Image)
    {
        generatedCode += 'settings' + randomNumber + '.visualrepresentation_gatherer = new Image();\n';
        generatedCode += 'settings' + randomNumber + '.visualrepresentation_gatherer.src = "' + steeringController.animation.visualrepresentation_gatherer.src + '";\n';
    }
    else
    {
        generatedCode += 'settings' + randomNumber + '.visualrepresentation_gatherer = "' + steeringController.animation.visualrepresentation_gatherer + '";\n';
    }
    generatedCode += 'settings' + randomNumber + '.ORIENTEDTOWARDSMOVEMENT_gatherer = ' + steeringController.animation.ORIENTEDTOWARDSMOVEMENT_gatherer + ';\n';
    generatedCode += 'settings' + randomNumber + '.color_gatherer = "' + steeringController.animation.color_gatherer + '";\n';
    if (steeringController.animation.visualrepresentation_target instanceof Image)
    {
        generatedCode += 'settings' + randomNumber + '.visualrepresentation_target = new Image();\n';
        generatedCode += 'settings' + randomNumber + '.visualrepresentation_target.src = "' + steeringController.animation.visualrepresentation_target.src + '";\n';
    }
    else
    {
        generatedCode += 'settings' + randomNumber + '.visualrepresentation_target = "' + steeringController.animation.visualrepresentation_target + '";\n';
    }
    generatedCode += 'settings' + randomNumber + '.color_target = "' + steeringController.animation.color_target + '";\n';
    generatedCode += '\n';
    generatedCode += '//Creating the animation\n';
    generatedCode += 'var animation' + randomNumber + ' = new SteeringAnimation (document.getElementById("EasyPhysics"), false);\n';
    generatedCode += 'animation' + randomNumber + '.canvas.width = ' + steeringController.animation.canvas.width + ';\n';
    generatedCode += 'animation' + randomNumber + '.canvas.height = ' + steeringController.animation.canvas.height + ';\n';
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

var steeringController = new SteeringController();

(function animationLoop()
 {
 steeringController.animation.draw();
 window.requestAnimationFrame (animationLoop);
 })();
