"use strict";

/**
 * Returns a random number between the arguments.
 * @param {number} min
 * @param {number} max
 * @returns {number} random number between min and max
 */
function getRandomBetween (min, max)
{
    return Math.random() * (max - min) + min;
}

/**
 * Converts from degrees to radians.
 * @param {number} degrees
 * @returns {number} angle in radians
 */
Math.radians = function (degrees)
{
    return degrees * Math.PI / 180;
};

/**
 * Converts from radians to degrees.
 * @param {number} radians
 * @returns {number} angle in degrees
 */
Math.degrees = function (radians)
{
    return radians * 180 / Math.PI;
};

/**
 * Creates a 2D Vector.
 * @class
 * @param {number} [x=0] position in x axis
 * @param {number} [y=0] position in y axis
 * @classdesc A 2D Vector with multiple operations.
 */
function Vector (x, y)
{
    this.x = x || 0;
    this.y = y || 0;
}

/**
 * Adds another vector to this.
 * @param {Vector} vector vector to add to this
 */
Vector.prototype.add = function (vector)
{
    this.x += vector.x;
    this.y += vector.y;
};

/**
 * Returns a new vector that is the sum of the two passed as arguments.
 * @param {Vector} vector1 vector to add
 * @param {Vector} vector2 vector to add
 * @returns {Vector} new Vector object that is the sum of the two
 */
Vector.add = function (vector1, vector2)
{
    return new Vector (vector1.x + vector2.x, vector1.y + vector2.y);
};

/**
 * Substracts another vector to this.
 * @param {Vector} vector vector to substract to this
 */
Vector.prototype.sub = function (vector)
{
    this.x -= vector.x;
    this.y -= vector.y;
};

/**
 * Returns a new vector that is the substraction of the two passed as arguments.
 * @param {Vector} vector1 vector to substract to
 * @param {Vector} vector2 vector to substract
 * @returns {Vector} new Vector object that is the result of vector1 - vector2
 */
Vector.sub = function (vector1, vector2)
{
    return new Vector (vector1.x - vector2.x, vector1.y - vector2.y);
};

/**
 * Returns the distance between two points.
 * @param {Vector} pointA pointA
 * @param {Vector} pointB pointB
 * @returns {number} distance between the two points
 */
Vector.dist = function (pointA, pointB)
{
    return Math.sqrt ((pointB.x - pointA.x) * (pointB.x - pointA.x) + (pointB.y - pointA.y) * (pointB.y - pointA.y));
};

/**
 * Returns the length of this vector.
 * @return {number} length of this vector
 */
Vector.prototype.getMagnitude = function()
{
    return Math.sqrt (this.x * this.x + this.y * this.y);
};

/**
 * Returns the length of the vector.
 * @param {Vector} vector vector to calculate the length of
 * @return {number} length of the vector
 */
Vector.getMagnitude = function (vector)
{
    return Math.sqrt (vector.x * vector.x + vector.y * vector.y);
};

/**
 * Normalizes this vector (makes its length = 1).
 */
Vector.prototype.normalize = function()
{
    var mag = this.getMagnitude();
    this.x /= mag;
    this.y /= mag;
};

/**
 * Returns a new vector that is a normalized version of the one passed as argument.
 * @param {Vector} vector vector to get a normalized from
 * @return {Vector} normalized vector that has the same direction as the argument
 */
Vector.getNormalizedFrom = function (vector)
{
    return new Vector (vector.x / vector.getMagnitude(), vector.y / vector.getMagnitude());
};

/**
 * Gets the angle between a line A=(0,0) B=(this.x,this.y) and the X axis.
 * @return {number} angle between line A=(0,0) B=(this.x,this.y) and the X axis
 */
Vector.prototype.getAngle = function()
{
    return Math.atan2 (this.y, this.x);
};

/**
 * Returns a new Vector with the given length and angle from the X axis.
 * @param {number} angle angle from the X axis
 * @param {number} magnitude length of the desired vector
 * @returns {Vector} new Vector with the given length and angle
 */
Vector.fromAngle = function (angle, magnitude)
{
    return new Vector (magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

/**
 * Multiplies this vector by a number.
 * @param {number} scalar number to multiply this vector by
 */
Vector.prototype.mult = function (scalar)
{
    this.x *= scalar;
    this.y *= scalar;
};

/**
 * Returns a new Vector that is the result of multiplying the vector and number passed.
 * @param {Vector} vector vector to copy
 * @param {number} scalar number to multiply the vector by
 * @returns {Vector} vector that is a copy of the one passed, scaled by the number passed
 */
Vector.mult = function (vector, scalar)
{
    return new Vector (vector.x * scalar, vector.y * scalar);
};

/**
 * Divides this vector by a number.
 * @param {number} scalar number to divide this vector by
 */
Vector.prototype.div = function (scalar)
{
    this.x /= scalar;
    this.y /= scalar;
};

/**
 * Returns a new Vector that is the result of dividing the vector by the number passed.
 * @param {Vector} vector vector to copy
 * @param {number} scalar number to divide the vector by
 * @returns {Vector} vector that is a copy of the one passed, divided by the number passed
 */
Vector.div = function (vector, scalar)
{
    return new Vector (vector.x / scalar, vector.y / scalar);
};

/**
 * Limits the length of this vector by the length passed.
 * @param {number} magnitude maximum length of the vector
 */
Vector.prototype.limit = function (magnitude)
{
    if (this.getMagnitude() > magnitude)
    {
        this.normalize();
        this.x *= magnitude;
        this.y *= magnitude;
    }
};

/**
 * Returns the dot product between 2 vectors
 * @param {Vector} vector1 vector1
 * @param {Vector} vector2 vector2
 */
Vector.dot = function (vector1, vector2)
{
    return vector1.x * vector2.x + vector1.y * vector2.y;
}


/**
 * Creates a SimulationObject.
 * @class
 * @param {string,Image} visualrepresentation visual representation of the object
 * @param {number} radius radius of the object
 * @param {Vector} location location of the object, is updated each step
 * @param {Vector} velocity velocity of the object, is updated each step
 * @param {Vector} acceleration acceleration of the object, is updated each step
 * @param {bool} orientedTowardsMovement wether it's oriented towards its velocity vector
 */
function SimulationObject (visualrepresentation, radius, location, velocity, acceleration, orientedTowardsMovement = false)
{
    this.visualrepresentation = visualrepresentation;
    this.radius = radius * 1.0;
    this.location = location;
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.orientedTowardsMovement = orientedTowardsMovement;
    this.color = "#000000";
}

/**
 * Updates object's location and velocity. Sets acceleration = 0.
 * Should be called once per simulation step, after all forces have been computed and before rendering the object.
 * @param {number} dt simulation time step (time passed since last update)
 */
SimulationObject.prototype.update = function (dt)
{
    this.velocity.add (Vector.mult (this.acceleration, dt));
    this.location.add (Vector.mult (this.velocity, dt));
    this.acceleration.x = 0;
    this.acceleration.y = 0;
};

/**
 * Adds acceleration to the object's acceleration.
 * @param {Vector} acceleration acceleration to add
 */
SimulationObject.prototype.applyAcceleration = function (acceleration)
{
    this.acceleration.add (acceleration);
};

/**
 * Calculates the acceleration that the given force generates on this object and adds it to it.
 * @param {Vector} force force applied
 */
SimulationObject.prototype.applyForce = function (force)
{
    this.acceleration.add (force);
};

/**
 * Renders this object on the context passed.
 * @param {Object} context HTML Canvas's Context to draw on
 */
SimulationObject.prototype.display = function (context)
{
    context.save();
    context.fillStyle = this.color;
    
    if (typeof (this.visualrepresentation) == "string")
    {
        switch (this.visualrepresentation)
        {
            case "square":
                context.fillRect (this.location.x-this.radius, this.location.y-this.radius, 2*this.radius, 2*this.radius);
                break;
            case "circle":
                context.beginPath();
                context.arc (this.location.x, this.location.y, this.radius, 0, 2*Math.PI);
                context.closePath();
                context.fill();
                break;
            case "triangle":
                context.save();
                context.transform (1, 0, 0, 1, this.location.x, this.location.y);
                if (this.orientedTowardsMovement)
                {
                    var theta = Math.atan2 (this.velocity.y, this.velocity.x) - Math.atan2 (0, 1);
                    context.rotate (theta);
                }
                context.beginPath();
                context.moveTo (this.radius, 0);
                context.lineTo (-this.radius, -3*this.radius/5);
                context.lineTo (-this.radius, 3*this.radius/5);
                context.closePath();
                context.fill();
                context.restore();
                break;
            default:
                context.beginPath();
                context.arc (this.location.x, this.location.y, this.radius, 0, 2*Math.PI, false);
                context.closePath();
                context.fill();
        }
    }
    else if (this.visualrepresentation instanceof Image)
    {
        context.save();
        context.transform (1, 0, 0, 1, this.location.x, this.location.y);
        if (this.orientedTowardsMovement)
        {
            var theta = Math.atan2 (this.velocity.y, this.velocity.x) - Math.atan2 (0, 1);
            context.rotate (theta);
        }
        context.drawImage (this.visualrepresentation, -this.radius, -this.radius, 2*this.radius, 2*this.radius);
        context.restore();
    }
    else if (this.visualrepresentation instanceof Character)
    {
        this.visualrepresentation.displayAt (context, this.location);
    }
    else
    {
        context.beginPath();
        context.arc (this.location.x, this.location.y, this.radius, 0, 2*Math.PI);
        context.closePath();
        context.fill();
    }
    
    context.restore();
};

/**
 * Creates a Boid.
 * This is a simple implementation of Reynolds' Boids as explained in https://www.red3d.com/cwr/boids/
 * @class
 * @extends SimulationObject
 * @param {string,Image} visualrepresentation visual representation of the boid
 * @param {number} radius radius of the boid
 * @param {Vector} location location of the object, is updated each step
 * @param {Vector} velocity velocity of the object, is updated each step
 * @param {Vector} acceleration acceleration of the object, is updated each step
 * @param {number} maxspeed maximum speed the boid can move at
 * @param {number} maxforce maximum force the boid can produce
 * @param {bool} orientedTowardsMovement wether it's oriented towards its velocity vector
 */
function Boid (visualrepresentation, radius, location, velocity, acceleration, maxspeed, maxforce, orientedTowardsMovement = true)
{
    SimulationObject.call (this, visualrepresentation, radius, location, velocity, acceleration, orientedTowardsMovement);
    
    this.maxspeed = maxspeed;
    this.maxforce = maxforce;
    
    this.circleDistance = 3 * this.radius;
    this.circleRadius = 1.5 * this.radius;
    this.wanderAngle = 0;

}

Boid.prototype = Object.create (SimulationObject.prototype);
Boid.prototype.constructor = Boid;

/**
 * Updates boid's location and velocity. Sets acceleration = 0.
 * Should be called once per simulation step, after all forces have been computed and before rendering the object.
 * @override
 * @param {number} dt simulation time step (time passed since last update)
 */
Boid.prototype.update = function (dt)
{
    this.velocity.add (Vector.mult (this.acceleration, dt));
    this.velocity.limit (this.maxspeed);
    this.location.add (Vector.mult (this.velocity, dt));
    this.acceleration.x = 0;
    this.acceleration.y = 0;
};

/**
 * Calculates and applies flocking forces: separation, alignment and cohesion.
 * More information: https://www.red3d.com/cwr/boids/
 * @param {Arary<Boid>} boids all the boids in the flock
 * @param {number} desiredseparation desired separation between all boids
 * @param {number} neighbourdist neighbourhood radius
 * @param {number} separationWeight weight of separation behaviour
 * @param {number} alignmentWeight weight of alignment behaviour
 * @param {number} cohesionWeight weight of cohesion behaviour
 */
Boid.prototype.flock = function (boids, desiredseparation, neighbourdist, separationWeight, alignmentWeight, cohesionWeight)
{
    var separation = this.separate (boids, desiredseparation);
    var alignment = this.align (boids, neighbourdist);
    var cohesion = this.cohesionate (boids, neighbourdist);
    
    separation.mult (separationWeight);
    alignment.mult (alignmentWeight);
    cohesion.mult (cohesionWeight);
    
    this.applyForce (separation);
    this.applyForce (alignment);
    this.applyForce (cohesion);
};

/**
 * Updates the boid's position so that it stays inside the given bounds.
 */
Boid.prototype.borders = function (minX, maxX, minY, maxY)
{
    if (this.location.x - this.radius < minX)
    {
        this.location.x = maxX + this.radius;
    }
    if (this.location.y -this.radius < minY)
    {
        this.location.y = maxY + this.radius;
    }
    if (this.location.x > maxX + this.radius)
    {
        this.location.x = minX + this.radius;
    }
    if (this.location.y > maxY + this.radius)
    {
        this.location.y = minY + this.radius;
    }
};

/**
 * Returns the steering force that will produce separation behaviour.
 * For each boid that is closer than desiredseparation, it calculates a direction away from it.
 * All repelling directions are added, normalized and scaled to match maxspeed.
 * A steering force is calculated that will move the boid towards the repelling direction.
 * @param {Array<Boid>} boids all the boids in the flock
 * @param {number} desiredseparation desired separation between all boids
 * @returns {Vector} steering force to move the boid away from other boids that are too close
 */
Boid.prototype.separate = function (boids, desiredseparation)
{
    var steer = new Vector (0, 0);
    var count = 0;
    for (var i=0; i<boids.length; i++)
    {
        var d = Vector.dist (this.location, boids[i].location);
        if (d > 0 && d < desiredseparation)
        {
            var diff = Vector.sub (this.location, boids[i].location);
            diff.normalize();
            diff.div (d);
            steer.add (diff);
            count ++;
        }
    }
    if (count > 0)
    {
        steer.div (count);
    }
    
    if (steer.getMagnitude() > 0)
    {
        steer.normalize();
        steer.mult (this.maxspeed);
        steer.sub (this.velocity);
        steer.limit (this.maxforce);
    }
    
    return steer;
};

/**
 * Returns the steering force that will produce alignment behaviour.
 * It calculates the average velocity of all neighbours, and it is normalized and scaled to match maxspeed.
 * A steering force is calculated that will move the boid to match the average velocity.
 * @param {Array<Boid>} boids all the boids in the flock
 * @param {number} neighbourdist neighbourhood radius
 * @returns {Vector} steering force to align the boid with its neighbours
 */
Boid.prototype.align = function (boids, neighbourdist)
{
    var sum = new Vector (0, 0);
    var count = 0;
    for (var i=0; i<boids.length; i++)
    {
        var d = Vector.dist (this.location, boids[i].location);
        if (d > 0 && d < neighbourdist)
        {
            sum.add (boids[i].velocity);
            count ++;
        }
    }
    if (count > 0)
    {
        //Reynolds: Steering = Desired - Velocity
        sum.div (count);
        sum.normalize();
        sum.mult (this.maxspeed);
        var steer = Vector.sub (sum, this.velocity);
        steer.limit (this.maxforce);
        return steer;
    }
    else
    {
        return new Vector (0, 0);
    }
};

/**
 * Returns the steering force that will produce cohesion behaviour.
 * It calculates the center of mass of all the neighbouring boids, and calculates a steering force towards it.
 * @param {Array<Boid>} boids all the boids in the flock
 * @param {number} neighbourdist neighbourhood radius
 * @returns {Vector} steering force towards the neighbourhood's center of mass
 */
Boid.prototype.cohesionate = function (boids, neighbourdist)
{
    var sum = new Vector (0, 0);
    var count = 0;
    for (var i=0; i<boids.length; i++)
    {
        var d = Vector.dist (this.location, boids[i].location);
        if (d > 0 && d < neighbourdist)
        {
            sum.add (boids[i].location);
            count ++;
        }
    }
    if (count > 0)
    {
        sum.div (count);
        
        return this.seek (sum);
    }
    else
    {
        return new Vector (0, 0);
    }
};

/**
 * Returns the steering force that will move the boid towards a target.
 * @param {Vector} target target location
 * @returns {Vector} steering force that will move the boid towards the target
 */
Boid.prototype.seek = function (target)
{
    var desired = Vector.sub (target, this.location);
    desired.normalize();
    desired.mult (this.maxspeed);
    
    var steer = Vector.sub (desired, this.velocity);
    steer.limit (this.maxforce);
    return steer;
};

/**
 * Returns the steering force that will move the boid towards a target, only if the target is within the given radius.
 * @param {Vector} target target location
 * @param {number} distance radius
 * @returns {Vector} steering force that will move the boid towards the target if it's within the radius
 */
Boid.prototype.seekIfNear = function (target, distance)
{
    if (Vector.dist (this.location, target) <= distance)
    {
        return this.seek (target);
    }
    else
    {
        return new Vector();
    }
};

/**
 * Returns the steering force that will move a boid towards a target.
 * @param {Boid} boid boid to calculate a steering force for
 * @param {Vector} target target location
 * @returns {Vector} steering force that will move the boid towards the target
 */
Boid.seek = function (boid, target)
{
    var desired = Vector.sub (target, boid.location);
    desired.normalize();
    desired.mult (boid.maxspeed);
    
    var steer = Vector.sub (desired, boid.velocity);
    steer.limit (boid.maxforce);
    return steer;
};

/**
 * Returns the steering force that will move the boid towards a moving target (another boid).
 * @param {Boid} target target boid
 * @returns {Vector} steering force that will move the boid towards the target
 */
Boid.prototype.pursue = function (target, dt)
{
    var predictedLocation = Vector.add (target.location, Vector.mult (target.velocity, dt));
    return this.seek (predictedLocation);
};

/**
 * Returns the steering force that will move the boid towards a moving target (another boid), only if the target is within the given radius.
 * @param {Boid} target target boid
 * @param {number} distance radius
 * @returns {Vector} steering force that will move the boid towards the target if it's within the radius
 */
Boid.prototype.pursueIfNear = function (target, distance, dt)
{
    var predictedLocation = Vector.add (target.location, Vector.mult (target.velocity, dt));
    if (Vector.dist (this.location, target.location) <= distance)
    {
        return this.seek (predictedLocation);
    }
    else
    {
        return new Vector();
    }
}

/**
 * Returns the steering force that will move the boid away from a target.
 * @param {Vector} target target location
 * @returns {Vector} steering force that will move the boid away from the target
 */
Boid.prototype.flee = function (target)
{
    var steer = this.seek (target);
    steer.mult (-1);
    return steer;
};

/**
 * Returns the steering force that will move the boid away from a target, only if the target is within the given radius.
 * @param {Vector} target target location
 * @param {number} distance radius
 * @returns {Vector} steering force that will move the boid away from the target if it's within the radius
 */
Boid.prototype.fleeIfNear = function (target, distance)
{
    if (Vector.dist (this.location, target) <= distance)
    {
        return this.flee (target);
    }
    else
    {
        return new Vector();
    }
};

/**
 * Returns the steering force that will move the boid away from a moving target (another boid).
 * @param {Boid} target target boid
 * @returns {Vector} steering force that will move the boid away from the target
 */
Boid.prototype.evade = function (target, dt)
{
    var predictedLocation = Vector.add (target.location, Vector.mult (target.velocity, dt));
    return this.flee (predictedLocation);
};

/**
 * Returns the steering force that will move the boid away from a moving target (another boid), only if the target is within the given radius.
 * @param {Boid} target target boid
 * @param {number} distance radius
 * @returns {Vector} steering force that will move the boid away from the target if it's within the radius
 */
Boid.prototype.evadeIfNear = function (target, distance, dt)
{
    var predictedLocation = Vector.add (target.location, Vector.mult (target.velocity, dt));
    if (Vector.dist (this.location, predictedLocation) <= distance)
    {
        return this.flee (predictedLocation);
    }
    else
    {
        return new Vector();
    }
};

/**
 * Returns the steering force that will move the boid randomly.
 * @returns {Vector} steering force that will move the boid randomly.
 */
Boid.prototype.wander = function()
{
    var circlePosition = new Vector (this.velocity.x, this.velocity.y);
    if (circlePosition.getMagnitude() == 0)
    {
        circlePosition.x = 1;
        circlePosition.y = 0;
    }
    else
    {
        circlePosition.normalize();
    }
    circlePosition.mult (this.circleDistance);
    
    this.wanderAngle += getRandomBetween (-0.3, 0.3);
    var displacement = new Vector (this.circleRadius * Math.cos(this.wanderAngle), this.circleRadius * Math.sin(this.wanderAngle));
    
    var desired = Vector.add (circlePosition, displacement);
    desired.normalize();
    desired.mult (this.maxspeed);
    
    var steer = Vector.sub (desired, this.velocity);
    steer.limit (this.maxforce);
    return steer;
}

/**
 * Creates a Flock. Contains an empty array of boids that you have to fill.
 * @class
 * @param {number} [desiredseparation=25.0] desired separation between the boids in the flock
 * @param {number} [neighbourdist=50.0] neighbourhood radius for each boid
 * @param {number} [separationWeight=1.5] weight of separation behaviour
 * @param {number} [alignmentWeight=1.0] weight of alignment behaviour
 * @param {number} [cohesionWeight=1.0] weight of cohesion behaviour
 */
function Flock (desiredseparation = 25.0, neighbourdist = 50.0, separationWeight = 1.5, alignmentWeight = 1.0, cohesionWeight = 1.0)
{
    this.boids = [];
    
    this.desiredseparation = desiredseparation;
    this.neighbourdist = neighbourdist;
    
    this.separationWeight = separationWeight;
    this.alignmentWeight = alignmentWeight;
    this.cohesionWeight = cohesionWeight;
    
    this.obstacles = [];
    this.predators = [];
    this.safeDistance = 200;
    
    this.fleeingWeight = 1;
    this.evasionWeight = 1;
}

Flock.desiredseparationtoradiusratio = 5.0;
Flock.neighbourdistancetoradiusratio = 10.0;

/**
 * Runs the flock: For each boid, calls flock(), calls update(), calls borders().
 * @param {number} dt simulation time step (time passed since last update)
 * @param {number} minX left bound
 * @param {number} minY upper bound
 * @param {number} maxX right bound
 * @param {number} maxY lower bound
 */
Flock.prototype.run = function (dt, minX, maxX, minY, maxY)
{
    for (var i=0; i<this.boids.length; i++)
    {
        this.boids[i].flock (this.boids, this.desiredseparation, this.neighbourdist, this.separationWeight, this.alignmentWeight, this.cohesionWeight);
        for (var j=0; j<this.predators.length; j++)
        {
            var evade = this.boids[i].evadeIfNear (this.predators[j], this.safeDistance);
            evade.mult (this.evasionWeight);
            this.boids[i].applyForce (evade);
        }
        for (var j=0; j<this.obstacles.length; j++)
        {
            var flee = this.boids[i].fleeIfNear (this.predators[j], this.safeDistance);
            flee.mult (this.fleeingWeight);
            this.boids[i].applyForce (flee);
        }
        this.boids[i].update (dt);
        this.boids[i].borders (minX, maxX, minY, maxY);
    }
};

/**
 * Renders each boid in the flock.
 * @param {Object} context HTML Canvas's Context to draw on
 */
Flock.prototype.display = function (context)
{
    for (var i=0; i<this.boids.length; i++)
    {
        this.boids[i].display (context);
    }
};

/**
 * Adds a boid to the flock.
 * @param {Boid} b boid to add
 */
Flock.prototype.addBoid = function (b)
{
    this.boids.push (b);
};

/**
 * Changes the radius of the boids.
 * @param {number} size new radius
 */
Flock.prototype.boidSizeChange = function (size)
{
    for (var i=0; i<this.boids.length; i++)
    {
        this.boids[i].radius = 1.0 * size;
        this.boids[i].circleDistance = 3.0 * size;
        this.boids[i].circleRadius = 1.5 * size;
    }
    this.desiredseparation = size * Flock.desiredseparationtoradiusratio;
    this.neighbourdist = size * Flock.neighbourdistancetoradiusratio;
};

//TODO FloatingObject. No m'agrada cap nom
//TODO posar el mass ací o al final? Crec que millor ací
//TODO necessita un mètode run? per a posar l'acceleració ahí, per exemple, i cridar a compute forces.

/**
 * Creates a Particle.
 * @class
 * @extends SimulationObject
 * @param {string,Image} visualrepresentation visual representation of the particle
 * @param {number} mass mas of the particle
 * @param {number} radius radius of the particle
 * @param {Vector} location location of the particle, is updated each step
 * @param {Vector} velocity velocity of the particle, is updated each step
 * @param {Vector} acceleration acceleration of the particle, is updated each step
 * @param {bool} [orientedTowardsMovement=false] wether it's oriented towards its velocity vector
 * @classdesc A Particle is a SimulationObject that has mass.
 */
function Particle (visualrepresentation, mass, radius, location, velocity, acceleration, orientedTowardsMovement = false)
{
    SimulationObject.call (this, visualrepresentation, radius, location, velocity, acceleration, orientedTowardsMovement);
    
    this.mass = mass;
}

Particle.prototype = Object.create (SimulationObject.prototype);
Particle.prototype.constructor = Particle;

/**
 * Calculates the acceleration that the given force generates on this object and adds it to it.
 * @override
 * @param {Vector} force force applied
 */
Particle.prototype.applyForce = function (force)
{
    this.acceleration.add (Vector.div (force, this.mass));
};

/**
 * Calculates flotation force and applies it to this particle. It considers this particle is a sphere.
 * @param {Vector} gravity gravity acceleration
 * @param {number} liquidDensity density of liquid
 * @param {number} sealevel level of water
 * @param {number} floor level of floor
 */
Particle.prototype.applyFlotationForces = function (gravity, liquidDensity, sealevel, floor)
{
    if (this.location.y + this.radius >= sealevel)
    {
        var Vs = 0;
        
        if (this.location.y - this.radius >= sealevel) //Totalmente submergido
        {
            Vs = 4 * Math.PI * this.radius * this.radius * this.radius / 3;
            
            if (this.location.y + this.radius >= floor) //Centro por debajo del suelo
            {
                //alert (this.location.y);
            }
        }
        else //Sección submergida
        {
            var h = this.location.y + this.radius - sealevel;
            var a = Math.sqrt (2 * h * this.radius - h * h);
            Vs = (3 * a * a + h * h) * Math.PI * h / 6;
        }
        var Fb = liquidDensity * gravity * Vs;
        var flotacion = new Vector (0, -Fb);
        this.applyForce (flotacion);
        
        //Friction in water
        var friction = Vector.mult (this.velocity, -0.8);
        this.applyForce (friction);
    }
};

/**
 * Creates a RigidBox.
 * @class
 * @extends SimulationObject
 * @param {number} mass mass of the box
 * @param {Vector} size width and height of the box
 * @param {Vector} location location of the box, is updated each step
 * @param {Vector} velocity velocity of the box, is updated each step
 * @param {Vector} acceleration acceleration of the box, is updated each step
 * @clasdesc A RigidBox is a 2D rigid body (a rectangle).
 */
function RigidBox (mass, size, location, velocity, acceleration)
{
    SimulationObject.call (this, "circle", (size.x+size.y)/2, location, velocity, acceleration, false);
    this.mass = mass;
    this.size = size;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;
    this.angle = 0;
    this.momentOfInertia = mass * (size.x * size.x + size.y * size.y) / 12; //formula for rectangle
    
    //points location are in local coordinates to the Box.
    this.points = [];
    this.points.push (new Vector (-size.x/2, size.y/2)); //left down
    this.points.push (new Vector (size.x/2, size.y/2)); //right down
    this.points.push (new Vector (size.x/2, -size.y/2)); //right up
    this.points.push (new Vector (-size.x/2, -size.y/2)); //left up
    
    this.rotatedPoints = [];
    this.rotatedPoints.push (new Vector (this.points[0].x * Math.cos(this.angle) - this.points[0].y * Math.sin(this.angle), this.points[0].x * Math.sin(this.angle) + this.points[0].y * Math.cos(this.angle))); //left down
    this.rotatedPoints.push (new Vector (this.points[1].x * Math.cos(this.angle) - this.points[1].y * Math.sin(this.angle), this.points[1].x * Math.sin(this.angle) + this.points[1].y * Math.cos(this.angle))); //right down
    this.rotatedPoints.push (new Vector (this.points[2].x * Math.cos(this.angle) - this.points[2].y * Math.sin(this.angle), this.points[2].x * Math.sin(this.angle) + this.points[2].y * Math.cos(this.angle))); //right up
    this.rotatedPoints.push (new Vector (this.points[3].x * Math.cos(this.angle) - this.points[3].y * Math.sin(this.angle), this.points[3].x * Math.sin(this.angle) + this.points[3].y * Math.cos(this.angle))); //left up
    
    //We will assume each point has   mass = box_mass   / number_of_points
    //We will assume each point has volume = box_volume / number_of_points
    //We will assume that the rectangle is a box with depth = avg(width, height)
    //So box_volume = width * height * depth = width * height * (width + height)/2
    //The volume thing is so I can use "real world" values.
    this.pointVolume = this.size.x * this.size.y * (this.size.x + this.size.y)/2 / this.points.length;
    this.pointMass = this.mass / this.points.length;
}

RigidBox.prototype = Object.create (SimulationObject.prototype);
RigidBox.prototype.constructor = RigidBox;

/**
 * Calculates the acceleration that the given force generates on this object and adds it to it.
 * @override
 * @param {Vector} force force applied
 */
RigidBox.prototype.applyForce = function (force)
{
    this.acceleration.add (Vector.div (force, this.mass));
};

/**
 * Calculates the acceleration and torque that the given force generates on this object and adds them to it.
 * @param {Vector} force force applied
 * @param {number,Vector} point vertex list index or position on the object (in object coordinates) upon which the force is applied
 */
RigidBox.prototype.applyForceTo = function (force, point)
{
    this.acceleration.add (Vector.div (force, this.mass));
    var torque = 0;
    if (typeof(point) === "number")
    {
        torque = this.rotatedPoints[point].x * force.y - this.rotatedPoints[point].y * force.x;
    }
    else if (typeof(point) === "object" && !(typeof(point) === "undefined"))
    {
        if (point != null)
        {
            torque = point.x * force.y - point.y * force.x;
        }
    }
    this.angularAcceleration += torque / this.momentOfInertia;
};

/**
 * Calculates flotation force and torque and applies it to this particle.
 * @param {Vector} gravity gravity acceleration
 * @param {number} liquidDensity density of liquid
 * @param {number} sealevel level of water
 */
RigidBox.prototype.applyFlotationForces = function (gravity, liquidDensity, sealevel)
{
    var flotationForce = Vector.mult (gravity, -liquidDensity * this.pointVolume);
    for (var i=0; i<this.points.length; i++)
    {
        if (this.location.y + this.rotatedPoints[i].y > sealevel)
        {
            this.applyForce (flotationForce);
            
            var torque = this.rotatedPoints[i].x * flotationForce.y - this.rotatedPoints[i].y * flotationForce.x;
            this.angularAcceleration += torque / this.momentOfInertia;
            
            //Friction in water
            var friction = Vector.mult (this.velocity, -0.5);
            this.applyAcceleration (friction);//this.applyForce (friction);
            var angularFriction = Vector.mult (this.angularVelocity, -0.8);
            torque = this.rotatedPoints[i].x * angularFriction.y - this.rotatedPoints[i].y * angularFriction.x;
            this.angularAcceleration += torque;//this.angularAcceleration += torque / this.momentOfInertia;
        }
    }
};

/**
 * Updates object's location, angle, velocity and angular velocity. Sets acceleration = 0 and angularAcceleration = 0.
 * Should be called once per simulation step, after all forces have been computed and before rendering the object.
 * @override
 * @param {number} dt simulation time step (time passed since last update)
 */
RigidBox.prototype.update = function (dt)
{
    this.velocity.add (Vector.mult (this.acceleration, dt));
    this.location.add (Vector.mult (this.velocity, dt));
    this.acceleration.x = 0;
    this.acceleration.y = 0;
    this.angularVelocity += this.angularAcceleration * dt;
    this.angle += this.angularVelocity * dt;
    for (var i=0; i<this.points.length; i++)
    {
        this.rotatedPoints[i].x = this.points[i].x * Math.cos(this.angle) - this.points[i].y * Math.sin(this.angle);
        this.rotatedPoints[i].y = this.points[i].x * Math.sin(this.angle) + this.points[i].y * Math.cos(this.angle);
    }
    this.angularAcceleration = 0;
};

/**
 * Renders this object on the context passed.
 * @override
 * @param {Object} context HTML Canvas's Context to draw on
 */
RigidBox.prototype.display = function (context)
{
    context.save();
    
    context.strokeStyle = "#000000";
    context.fillStyle = this.color;
    
    context.translate (this.location.x, this.location.y);
    
    context.save();
    context.rotate (this.angle);
    context.fillRect (-this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
    context.restore();
    
    context.beginPath();
    context.moveTo (this.rotatedPoints[0].x, this.rotatedPoints[0].y);
    context.lineTo (this.rotatedPoints[1].x, this.rotatedPoints[1].y);
    context.lineTo (this.rotatedPoints[2].x, this.rotatedPoints[2].y);
    context.lineTo (this.rotatedPoints[3].x, this.rotatedPoints[3].y);
    context.closePath();
    context.stroke();
    
    context.restore();
};

/**
 * Creates a RigidLetter.
 * @class
 * @extends RigidBox
 * @param {string} letter character
 * @param {string} font font of the character (in px)
 * @param {number} mass mass of the letter
 * @param {number} size font size of the character
 * @param {Vector} location location of the letter, is updated each step
 * @param {Vector} velocity velocity of the letter, is updated each step
 * @param {Vector} acceleration acceleration of the letter, is updated each step
 * @classdesc A RigidLetter is a rigid body in the shape of a character.
 */
function RigidLetter (letter, font, mass, size, location, velocity, acceleration)
{
    //1. Find points
    var canvas = document.createElement ("canvas");
    canvas.width = 100;
    canvas.height = 150;
    var context = canvas.getContext("2d");
    
    //1.1. Draw letter
    context.font = "100px " + font;
    context.fillStyle = "#000000";
    context.fillText (letter, 20, 100);
    
    //1.2. Find points
    var gridSize = 10;
    var realPoints = [];
    var centerOfMass = new Vector();
    var minX = 0, maxX = 0, minY = 0, maxY = 0;
    for (var i=gridSize/2; i<100; i+=gridSize)
    {
        for (var j=gridSize/2; j<150; j+=gridSize)
        {
            if (context.getImageData(i,j,1,1).data[3] > 0)
            {
                realPoints.push (new Vector (i, j));
                centerOfMass.add (new Vector (i, j));
                
                //For calculating bounding box size
                if (i < minX) minX = i;
                else if (i > maxX) maxX = i;
                if (j < minY) minY = j;
                else if (j > maxY) maxY = j;
            }
        }
    }
    centerOfMass.div (realPoints.length);
    var boundingBoxSize = new Vector (maxX - minX + gridSize, maxY - minY + gridSize); //super
    boundingBoxSize.mult (size/100);
    
    RigidBox.call (this, mass, boundingBoxSize, location, velocity, acceleration);
    
    this.letterLocation = new Vector (20-centerOfMass.x, 100-centerOfMass.y); //in local coordinates
    this.letterLocation.mult (size/100);
    this.points = realPoints; //Constructor calculated the 4 points for the bounding box.
    for (var i=0; i<this.points.length; i++)
    {
        this.points[i].sub (centerOfMass);
        this.points[i].mult (size/100);
    }
    //now all points are in local coordinates
    
    this.rotatedPoints = []; //Constructor calculated the 4 points for the bounding box.
    for (var i=0; i<this.points.length; i++)
    {
        this.rotatedPoints.push (new Vector (
                                             this.points[i].x * Math.cos(this.angle) - this.points[i].y * Math.sin(this.angle),
                                             this.points[i].x * Math.sin(this.angle) + this.points[i].y * Math.cos(this.angle)
                                             ));
    }
    
    //We will assume each point has   mass = box_mass   / number_of_points
    //We will assume each point has volume = box_volume / number_of_points
    //We will assume that the rectangle is a box with depth = avg(width, height)
    //So box_volume = width * height * depth = width * height * (width + height)/2
    //The volume thing is so I can use "real world" values.
    this.pointVolume = this.size.x * this.size.y * (this.size.x + this.size.y)/2 / this.points.length;
    this.pointMass = this.mass / this.points.length;
    
    this.letter = letter;
    this.font = size + "px " + font;
}

RigidLetter.prototype = Object.create (RigidBox.prototype);
RigidLetter.prototype.constructor = RigidLetter;

/**
 * Renders this object on the context passed.
 * @override
 * @param {Object} context HTML Canvas's Context to draw on
 */
RigidLetter.prototype.display = function (context)
{
    context.save();
    context.translate (this.location.x, this.location.y);
    context.rotate (this.angle);
    context.fillStyle = this.color;
    context.font = this.font;
    context.fillText (this.letter, this.letterLocation.x, this.letterLocation.y);
    context.restore();
    /*
     //TODO delete, this is for debug only
     context.fillStyle = "#0000FF";
     for (var i=0; i<this.points.length; i++)
     {
     context.beginPath();
     context.arc (this.location.x + this.rotatedPoints[i].x, this.location.y + this.rotatedPoints[i].y, 0.05*(this.size.x+this.size.y)/2, 0, 2*Math.PI);
     context.fill();
     }
     context.fillStyle ="#00FF00";
     context.beginPath();
     context.arc (this.location.x, this.location.y, 0.05*(this.size.x+this.size.y)/2, 0, 2*Math.PI);
     context.fill();*/
};

/**
 * Creates a Spring that has a particle on each end, or is fixed on one end and has a particle on the other.
 * @class
 * @param {Vector,Particle} origin fixed position or particle attatched to one end of the spring
 * @param {Particle} particle particle attatched to the other end of the spring
 * @param {number} length rest length of the spring
 * @param {number} stiffness stiffness constant of the spring (the k in F = kx)
 * @param {number} damping damping of the spring, must be between 0 and 1
 * @classdesc This spring has 2 end points: origin can be a fixed position or a moving particle, and particle is a moving particle.
 */
function Spring (origin, particle, length, stiffness, damping)
{
    this.origin = origin;
    this.particle = particle;
    this.length = length;
    this.stiffness = stiffness;
    this.damping = 1 - 0.1 * damping;
    this.color = "#000000";
}

/**
 * Calculates restitution force of the spring according to Hooke's Law (F = kx) and applies it to the particle.
 */
Spring.prototype.applySpringForcesToParticle = function()
{
    var dist = (this.origin instanceof Vector) ? Vector.sub (this.origin, this.particle.location) : Vector.sub (this.origin.location, this.particle.location);
    var normDist = Vector.getNormalizedFrom (dist);
    normDist.mult (this.length);
    
    dist.sub (normDist);
    var springForce = Vector.mult (dist, this.stiffness);
    
    this.particle.applyForce (springForce);
    this.particle.velocity.mult (this.damping);
};

/**
 * Calculates restitution force of the spring according to Hooke's Law (F = kx) and applies half to each particle.
 */
Spring.prototype.applySpringForcesToBothParticles = function()
{
    var dist = Vector.sub (this.origin.location, this.particle.location);
    var normDist = Vector.getNormalizedFrom (dist);
    normDist.mult (this.length);
    dist.sub (normDist);
    
    var springForce = Vector.mult (dist, this.stiffness);
    
    this.particle.applyForce (Vector.mult (springForce, 0.5));
    this.particle.velocity.mult (this.damping);
    
    this.origin.applyForce (Vector.mult (springForce, -0.5));
    this.origin.velocity.mult (this.damping);
    
    
};

/**
 * Renders this spring on the context passed.
 * @param {Object} context HTML Canvas's Context to draw on
 */
Spring.prototype.display = function (context)
{
    context.save();
    context.strokeStyle = this.color;
    context.beginPath();
    context.moveTo (this.particle1.location.x, this.particle1.location.y);
    context.lineTo (this.particle2.location.x, this.particle2.location.y);
    context.closePath();
    context.stroke();
    context.restore();
};

/**
 * Creates a Character.
 * @class
 * @param {string} character character
 * @param {string} font font of the character
 * @param {number} size font size of the character (in px)
 * @param {string} color color of the character
 * @classdesc A character is an object that contains a character. Its position is its center of mass.
 */
function Character (character, font, size, color)
{
    this.character = character;
    this.font = font;
    this.size = size;
    this.color = color;
    
    //Find bounding box
    
    //1. Find points
    var canvas = document.createElement ("canvas");
    canvas.width = 100;
    canvas.height = 150;
    var context = canvas.getContext("2d");
    
    //1.1. Draw letter
    context.font = "100px " + font;
    context.fillStyle = "#000000";
    context.fillText (character, 20, 100);
    
    //1.2. Find points
    var gridSize = 10;
    var numberOfPoints = 0;
    var centerOfMass = new Vector();
    for (var i=gridSize/2; i<100; i+=gridSize)
    {
        for (var j=gridSize/2; j<150; j+=gridSize)
        {
            if (context.getImageData(i,j,1,1).data[3] > 0)
            {
                centerOfMass.add (new Vector (i, j));
                numberOfPoints ++;
            }
        }
    }
    centerOfMass.div (numberOfPoints);
    this.offsetForDrawing = new Vector (20-centerOfMass.x, 100-centerOfMass.y); //in local coordinates
    this.offsetForDrawing.mult (size/100);
}

/**
 * Renders this character so that its center of mass is in its position.
 * @param {Object} context HTML Canvas's Context to draw on
 */
Character.prototype.display = function (context)
{
    context.save();
    
    context.font = this.size + "px " + this.font;
    context.fillStyle = this.color;
    
    context.fillText (this.character, this.offsetForDrawing.x, this.offsetForDrawing.y);
    
    context.restore();
};

/**
 * Renders this character so that its center of mass is in the given position.
 * @param {Object} context HTML Canvas's Context to draw on
 * @param {Vector} location position to draw the character at
 */
Character.prototype.displayAt = function (context, location)
{
    context.save();
    
    context.font = this.size + "px " + this.font;
    context.fillStyle = this.color;
    
    context.fillText (this.character, location.x + this.offsetForDrawing.x, location.y + this.offsetForDrawing.y);
    
    context.restore();
};

/**
 * Returns the absolute XY position of the object.
 * Only works if no scroll. Does work if zoomed in.
 * @param {Object} el object whose position we calculate
 */
function offset (el)
{
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

/**
 * Creates a springs animation.
 * @class
 * @param {Object} canvas a canvas element
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @classdesc Creates and runs an animation based on the mass-spring-damper model. How to use: create an instance of this class and call its method draw() on each frame.
 */
function SpringsAnimation (canvas, EDITMODE = false)
{
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    
    //Simulation objects
    this.springs;
    this.letters;
    
    //Editor params
    this.EDITMODE; //EasyPhysicsAnimation
    this.GRID; //EasyPhysicsAnimation
    this.textlocation;
    this.SHOWTEXT;
    this.POSITIONINGMODE;
    
    //Scene params
    this.scenewidth; //EasyPhysicsAnimation
    
    //Simulation params
    this.dt = 0.02; //EasyPhysicsAnimation
    this.size; //EasyPhysicsAnimation
    this.mass;
    this.stiffness;
    this.damping;
    this.text;
    this.mousePos = new Vector();
    this.letterlocations;
    
    //Aesthetic params
    this.font;
    this.color;
    
    this.canvas.easyPhysicsMousePos = this.mousePos;
    this.canvas.addEventListener ("mousemove", function(e){
                                  e.target.MOUSEOVERCANVAS = true;
                                  e.target.easyPhysicsMousePos.x = e.clientX - offset(e.target).left;
                                  e.target.easyPhysicsMousePos.y = e.clientY - offset(e.target).top;
                                  });
    this.canvas.addEventListener ("mouseout", function(e){e.target.MOUSEOVERCANVAS = false;});
    
    this.initParams (EDITMODE);
    this.initSimulation();
}

/**
 * Initializes all parameters with given settings or default values.
 * If global object eptfgSettingsSprings exists, initializes with its parameters:
 * eptfgSettingsSprings.EDITMODE
 * eptfgSettingsSprings.GRID
 * eptfgSettingsSprings.textlocationX
 * eptfgSettingsSprings.textlocationY
 * eptfgSettingsSprings.SHOWTEXT
 * eptfgSettingsSprings.POSITIONINGMODE
 * eptfgSettingsSprings.scenewidth
 * eptfgSettingsSprings.size
 * eptfgSettingsSprings.mass
 * eptfgSettingsSprings.stiffness
 * eptfgSettingsSprings.damping
 * eptfgSettingsSprings.text
 * eptfgSettingsSprings.letterlocation~x (one for each letter of text. "~" is the index)
 * eptfgSettingsSprings.letterlocation~y (one for each letter of text. "~" is the index)
 * eptfgSettingsSprings.font
 * eptfgSettingsSprings.color
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @param {Object} settings object that contains settings
 */
SpringsAnimation.prototype.initParams = function (EDITMODE = false, settings)
{
    this.EDITMODE = EDITMODE;
    this.GRID = EDITMODE;
    this.textlocation = new Vector();
    this.SHOWTEXT = EDITMODE;
    this.POSITIONINGMODE = false;
    
    this.scenewidth = 11;
    
    this.size = 1;
    this.mass = 1;
    this.stiffness = 150;
    this.damping = 3;
    this.text = "Easy Physics";
    this.letterlocations = [];
    for (let i=0; i<this.text.length; i++)
    {
        this.letterlocations.push (new Vector (i * 0.5, 0));
    }
    
    this.font = "Arial";
    this.color = "#000000";
    
    if (typeof eptfgSettingsSprings !== "undefined")
    {
        if (typeof eptfgSettingsSprings.EDITMODE !== "undefined")
        {
            if (eptfgSettingsSprings.EDITMODE == "true")
            {
                this.EDITMODE = true;
            }
            else if (eptfgSettingsSprings.EDITMODE == "false")
            {
                this.EDITMODE = false;
            }
        }
        if (typeof eptfgSettingsSprings.GRID !== "undefined")
        {
            if (eptfgSettingsSprings.GRID == "true")
            {
                this.GRID = true;
            }
            else if (eptfgSettingsSprings.GRID == "false")
            {
                this.GRID = false;
            }
        }
        this.textlocation.x = (typeof eptfgSettingsSprings.textlocationX !== "undefined") ? (1.0 * eptfgSettingsSprings.textlocationX) : this.textlocation.x;
        this.textlocation.y = (typeof eptfgSettingsSprings.textlocationY !== "undefined") ? (1.0 * eptfgSettingsSprings.textlocationY) : this.textlocation.y;
        if (typeof eptfgSettingsSprings.SHOWTEXT !== "undefined")
        {
            if (eptfgSettingsSprings.SHOWTEXT == "true")
            {
                this.SHOWTEXT = true;
            }
            else if (eptfgSettingsSprings.SHOWTEXT == "false")
            {
                this.SHOWTEXT = false;
            }
        }
        if (typeof eptfgSettingsSprings.POSITIONINGMODE !== "undefined")
        {
            if (eptfgSettingsSprings.POSITIONINGMODE == "true")
            {
                this.POSITIONINGMODE = true;
            }
            else if (eptfgSettingsSprings.POSITIONINGMODE == "false")
            {
                this.POSITIONINGMODE = false;
            }
        }
        
        this.scenewidth = (typeof eptfgSettingsSprings.scenewidth !== "undefined") ? (1.0 * eptfgSettingsSprings.scenewidth) : this.scenewidth;
        
        this.size = (typeof eptfgSettingsSprings.size !== "undefined") ? (1 * eptfgSettingsSprings.size) : this.size;
        this.mass = (typeof eptfgSettingsSprings.mass !== "undefined") ? (1.0 * eptfgSettingsSprings.mass) : this.mass;
        this.stiffness = (typeof eptfgSettingsSprings.stiffness !== "undefined") ? (1.0 * eptfgSettingsSprings.stiffness) : this.stiffness;
        this.damping = (typeof eptfgSettingsSprings.damping !== "undefined") ? (1.0 * eptfgSettingsSprings.damping) : this.damping;
        this.text = (typeof eptfgSettingsSprings.text !== "undefined") ? eptfgSettingsSprings.text : this.text;
        for (var i=0; i<this.text.length; i++)
        {
            this.letterlocations[i] = new Vector ((typeof eptfgSettingsSprings["letterlocation" + i + "x"] !== "undefined") ? (1.0 * eptfgSettingsSprings["letterlocation" + i + "x"]) : this.letterlocations[i].x,
                                                  (typeof eptfgSettingsSprings["letterlocation" + i + "y"] !== "undefined") ? (1.0 * eptfgSettingsSprings["letterlocation" + i + "y"]) : this.letterlocations[i].y);
        }
        
        this.font = (typeof eptfgSettingsSprings.font !== "undefined") ? eptfgSettingsSprings.font : this.font;
        this.color = (typeof eptfgSettingsSprings.color !== "undefined") ? eptfgSettingsSprings.color : this.color;
    }
    
    if (typeof settings !== "undefined")
    {
        this.scenewidth = (typeof settings.scenewidth !== "undefined") ? settings.scenewidth : this.scenewidth;
        this.size = (typeof settings.size !== "undefined") ? settings.size : this.size;
        this.mass = (typeof settings.mass !== "undefined") ? settings.mass : this.mass;
        this.stiffness = (typeof settings.stiffness !== "undefined") ? settings.stiffness : this.stiffness;
        this.damping = (typeof settings.damping !== "undefined") ? settings.damping : this.damping;
        this.text = (typeof settings.text !== "undefined") ? settings.text : this.text;
        this.letterlocations = (typeof settings.letterlocations !== "undefined") ? settings.letterlocations : this.letterlocations;
        this.font = (typeof settings.font !== "undefined") ? settings.font : this.font;
        this.color = (typeof settings.color !== "undefined") ? settings.color : this.color;
    }
};

/**
 * Initializes all simulation objects.
 */
SpringsAnimation.prototype.initSimulation = function()
{
    this.letters = [];
    this.springs = [];
    
    for (let i=0; i<this.text.length; i++)
    {
        this.letters.push (new Particle (new Character (this.text[i], this.font, this.size, this.color),
                                         this.mass,
                                         this.size,
                                         new Vector (this.letterlocations[i].x, this.letterlocations[i].y),
                                         new Vector(),
                                         new Vector(),
                                         false)
                           );
        this.letters[i].color = this.color;
        this.letters[i].visualrepresentation.color = this.color;
        
        this.springs.push (new Spring (new Vector (this.letterlocations[i].x, this.letterlocations[i].y),
                                       this.letters[i],
                                       0,
                                       this.stiffness,
                                       this.damping)
                           );
    }
};

/**
 * Runs the simulation and renders it.
 */
SpringsAnimation.prototype.draw = function()
{
    this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
    
    this.context.save();
    
    var zoom = this.canvas.width / this.scenewidth;
    this.context.setTransform (zoom, 0, 0, zoom, this.canvas.width/2, this.canvas.height/2);
    
    if (this.GRID) SpringsAnimation.drawGrid (this.context);
    
    if (this.SHOWTEXT)
    {
        this.context.save();
        this.context.fillStyle = "#000000";
        this.context.font = this.size + "px " + this.font;
        this.context.fillText (this.text, this.textlocation.x, this.textlocation.y);
        this.context.restore();
    }
    
    if (this.POSITIONINGMODE)
    {
        for (var i=0; i<this.letters.length; i++)
        {
            this.letters[i].display (this.context);
            this.context.save();
            this.context.fillStyle = "#000000";
            this.context.globalAlpha = 0.7;
            this.context.beginPath();
            this.context.arc (this.letters[i].location.x, this.letters[i].location.y, 0.2*this.letters[i].visualrepresentation.size, 0, 2*Math.PI);
            this.context.closePath();
            this.context.fill();
            this.context.restore();
        }
        
        if (this.SHOWTEXT)
        {
            this.context.save();
            this.context.fillStyle = "#000000";
            this.context.globalAlpha = 0.7;
            this.context.beginPath();
            this.context.arc (this.textlocation.x, this.textlocation.y, 0.2*this.size, 0, 2*Math.PI);
            this.context.closePath();
            this.context.fill();
            this.context.restore();
        }
    }
    else
    {
        var mousePos = Vector.sub (this.mousePos, new Vector (this.canvas.width/2, this.canvas.height/2));
        mousePos.div (zoom);
        
        for (var i=0; i<this.springs.length; i++)
        {
            this.springs[i].applySpringForcesToParticle();
        }
        
        for (var i=0; i<this.letters.length; i++)
        {
            if (this.canvas.MOUSEOVERCANVAS && Vector.dist (this.letters[i].location, mousePos) < this.size)
            {
                var direction = Vector.sub (this.letters[i].location, mousePos);
                direction.normalize();
                direction.mult (100 * this.letters[i].radius);
                this.letters[i].applyForce (direction);
            }
            
            this.letters[i].update (this.dt);
            this.letters[i].display (this.context);
        }
    }
    
    this.context.restore();
    
    if (this.EDITMODE)
    {
        //canvas corner
        this.context.save();
        this.context.globalAlpha = 1;
        this.context.strokeStyle = "#000000";
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.moveTo (this.canvas.width-15, this.canvas.height-3);
        this.context.lineTo (this.canvas.width-3, this.canvas.height-3);
        this.context.lineTo (this.canvas.width-3, this.canvas.height-15);
        this.context.moveTo (this.canvas.width-15, this.canvas.height-8);
        this.context.lineTo (this.canvas.width-8, this.canvas.height-8);
        this.context.lineTo (this.canvas.width-8, this.canvas.height-15);
        this.context.stroke();
        this.context.restore();
    }
};

/**
 * Draws a grid on the context.
 * @param {Object} context HTML5 Canvas's context to draw on
 */
SpringsAnimation.drawGrid = function (context)
{
    context.save();
    
    context.lineWidth = 0.025;
    
    context.beginPath();
    context.moveTo(-10, 0);
    context.lineTo(10, 0);
    context.stroke();
    
    context.beginPath();
    context.moveTo(0, -10);
    context.lineTo(0, 10);
    context.stroke();
    
    context.beginPath();
    context.moveTo(-0.25, -10);
    context.lineTo(0.25, -10);
    context.moveTo(-0.25, -9);
    context.lineTo(0.25, -9);
    context.moveTo(-0.25, -8);
    context.lineTo(0.25, -8);
    context.moveTo(-0.25, -7);
    context.lineTo(0.25, -7);
    context.moveTo(-0.25, -6);
    context.lineTo(0.25, -6);
    context.moveTo(-0.25, -5);
    context.lineTo(0.25, -5);
    context.moveTo(-0.25, -4);
    context.lineTo(0.25, -4);
    context.moveTo(-0.25, -3);
    context.lineTo(0.25, -3);
    context.moveTo(-0.25, -2);
    context.lineTo(0.25, -2);
    context.moveTo(-0.25, -1);
    context.lineTo(0.25, -1);
    context.moveTo(-0.25, 1);
    context.lineTo(0.25, 1);
    context.moveTo(-0.25, 2);
    context.lineTo(0.25, 2);
    context.moveTo(-0.25, 3);
    context.lineTo(0.25, 3);
    context.moveTo(-0.25, 4);
    context.lineTo(0.25, 4);
    context.moveTo(-0.25, 5);
    context.lineTo(0.25, 5);
    context.moveTo(-0.25, 6);
    context.lineTo(0.25, 6);
    context.moveTo(-0.25, 7);
    context.lineTo(0.25, 7);
    context.moveTo(-0.25, 8);
    context.lineTo(0.25, 8);
    context.moveTo(-0.25, 9);
    context.lineTo(0.25, 9);
    context.moveTo(-0.25, 10);
    context.lineTo(0.25, 10);
    context.stroke();
    
    context.beginPath();
    context.moveTo(-10, -0.25);
    context.lineTo(-10, 0.25);
    context.moveTo(-9, -0.25);
    context.lineTo(-9, 0.25);
    context.moveTo(-8, -0.25);
    context.lineTo(-8, 0.25);
    context.moveTo(-7, -0.25);
    context.lineTo(-7, 0.25);
    context.moveTo(-6, -0.25);
    context.lineTo(-6, 0.25);
    context.moveTo(-5, -0.25);
    context.lineTo(-5, 0.25);
    context.moveTo(-4, -0.25);
    context.lineTo(-4, 0.25);
    context.moveTo(-3, -0.25);
    context.lineTo(-3, 0.25);
    context.moveTo(-2, -0.25);
    context.lineTo(-2, 0.25);
    context.moveTo(-1, -0.25);
    context.lineTo(-1, 0.25);
    context.moveTo(1, -0.25);
    context.lineTo(1, 0.25);
    context.moveTo(2, -0.25);
    context.lineTo(2, 0.25);
    context.moveTo(3, -0.25);
    context.lineTo(3, 0.25);
    context.moveTo(4, -0.25);
    context.lineTo(4, 0.25);
    context.moveTo(5, -0.25);
    context.lineTo(5, 0.25);
    context.moveTo(6, -0.25);
    context.lineTo(6, 0.25);
    context.moveTo(7, -0.25);
    context.lineTo(7, 0.25);
    context.moveTo(8, -0.25);
    context.lineTo(8, 0.25);
    context.moveTo(9, -0.25);
    context.lineTo(9, 0.25);
    context.moveTo(10, -0.25);
    context.lineTo(10, 0.25);
    context.stroke();
    
    context.beginPath();
    context.moveTo(-0.9, -0.1);
    context.lineTo(-0.9, 0.1);
    context.moveTo(-0.8, -0.1);
    context.lineTo(-0.8, 0.1);
    context.moveTo(-0.7, -0.1);
    context.lineTo(-0.7, 0.1);
    context.moveTo(-0.6, -0.1);
    context.lineTo(-0.6, 0.1);
    context.moveTo(-0.5, -0.1);
    context.lineTo(-0.5, 0.1);
    context.moveTo(-0.4, -0.1);
    context.lineTo(-0.4, 0.1);
    context.moveTo(-0.3, -0.1);
    context.lineTo(-0.3, 0.1);
    context.moveTo(-0.2, -0.1);
    context.lineTo(-0.2, 0.1);
    context.moveTo(-0.1, -0.1);
    context.lineTo(-0.1, 0.1);
    context.moveTo(0.1, -0.1);
    context.lineTo(0.1, 0.1);
    context.moveTo(0.2, -0.1);
    context.lineTo(0.2, 0.1);
    context.moveTo(0.3, -0.1);
    context.lineTo(0.3, 0.1);
    context.moveTo(0.4, -0.1);
    context.lineTo(0.4, 0.1);
    context.moveTo(0.5, -0.1);
    context.lineTo(0.5, 0.1);
    context.moveTo(0.6, -0.1);
    context.lineTo(0.6, 0.1);
    context.moveTo(0.7, -0.1);
    context.lineTo(0.7, 0.1);
    context.moveTo(0.8, -0.1);
    context.lineTo(0.8, 0.1);
    context.moveTo(0.9, -0.1);
    context.lineTo(0.9, 0.1);
    context.lineWidth = 0.01;
    context.stroke();
    
    context.restore();
};

/**
 * Creates a new floating animation.
 * @class
 * @param {Object} canvas a canvas element
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @classdesc Creates and runs an animation based on the floating model. How to use: create an instance of this class and call its method draw() on each frame.
 */
function FloatingAnimation (canvas, EDITMODE = false)
{
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    
    //Simulation objects
    this.letters;
    
    //Editor params
    this.EDITMODE; //EasyPhysicsAnimation
    this.GRID; //EasyPhysicsAnimation
    
    //Scene params
    this.scenewidth; //EasyPhysicsAnimation
    this.waterline;
    
    //Simulation params
    this.dt = 0.01; //EasyPhysicsAnimation
    this.size; //EasyPhysicsAnimation
    this.gravity;
    this.mass;
    this.liquidDensity;
    this.text;
    
    //Aesthetic params
    this.font;
    this.color;
    this.liquidColor;
    this.liquidOpacity;
    
    this.initParams (EDITMODE);
    this.initSimulation();
}

/**
 * Initializes all parameters with given settings or default values.
 * If global object eptfgSettingsFloating exists, initializes with its parameters:
 * eptfgSettingsFloating.EDITMODE
 * eptfgSettingsFloating.GRID
 * eptfgSettingsFloating.scenewidth
 * eptfgSettingsFloating.gravity
 * eptfgSettingsFloating.size
 * eptfgSettingsFloating.mass
 * eptfgSettingsFloating.liquiddensity
 * eptfgSettingsFloating.text
 * eptfgSettingsFloating.font
 * eptfgSettingsFloating.color
 * eptfgSettingsFloating.liquidcolor
 * eptfgSettingsFloating.liquidopacity
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @param {Object} settings object that contains settings
 */
FloatingAnimation.prototype.initParams = function (EDITMODE = false, settings)
{
    this.EDITMODE = EDITMODE;
    this.GRID = EDITMODE;
    
    this.scenewidth = 5;
    this.waterline = 0;
    
    this.gravity = new Vector (0, 9.8);
    this.size = 1;
    this.mass = 500;
    this.liquidDensity = 1000;
    this.text = "Easy Physics";
    
    this.font = "Arial";
    this.color = "#000000";
    this.liquidColor = "#0000FF";
    this.liquidOpacity = 0.7;
    
    if (typeof eptfgSettingsFloating !== "undefined")
    {
        if (typeof eptfgSettingsFloating.EDITMODE !== "undefined")
        {
            if (eptfgSettingsFloating.EDITMODE == "true")
            {
                this.EDITMODE = true;
            }
            else if (eptfgSettingsFloating.EDITMODE == "false")
            {
                this.EDITMODE = false;
            }
        }
        if (typeof eptfgSettingsFloating.GRID !== "undefined")
        {
            if (eptfgSettingsFloating.GRID == "true")
            {
                this.GRID = true;
            }
            else if (eptfgSettingsFloating.GRID == "false")
            {
                this.GRID = false;
            }
        }
        
        this.scenewidth = (typeof eptfgSettingsFloating.scenewidth !== "undefined") ? (1.0 * eptfgSettingsFloating.scenewidth) : this.scenewidth;
        this.waterline = (typeof eptfgSettingsFloating.waterline !== "undefined") ? (-1.0 * eptfgSettingsFloating.waterline) : this.waterline;
        
        this.gravity.y = (typeof eptfgSettingsFloating.gravity !== "undefined") ? (1.0 * eptfgSettingsFloating.gravity) : this.gravity.y;
        this.size = (typeof eptfgSettingsFloating.size !== "undefined") ? (1 * eptfgSettingsFloating.size) : this.size;
        this.mass = (typeof eptfgSettingsFloating.mass !== "undefined") ? (1.0 * eptfgSettingsFloating.mass) : this.mass;
        this.liquidDensity = (typeof eptfgSettingsFloating.liquiddensity !== "undefined") ? (1.0 * eptfgSettingsFloating.liquiddensity) : this.liquidDensity;
        this.text = (typeof eptfgSettingsFloating.text !== "undefined") ? eptfgSettingsFloating.text : this.text;
        
        this.font = (typeof eptfgSettingsFloating.font !== "undefined") ? eptfgSettingsFloating.font : this.font;
        this.color = (typeof eptfgSettingsFloating.color !== "undefined") ? eptfgSettingsFloating.color : this.color;
        this.liquidColor = (typeof eptfgSettingsFloating.liquidcolor !== "undefined") ? eptfgSettingsFloating.liquidcolor : this.liquidColor;
        this.liquidOpacity = (typeof eptfgSettingsFloating.liquidopacity !== "undefined") ? (1.0 *eptfgSettingsFloating.liquidopacity) : this.liquidOpacity;
    }
    
    if (typeof settings !== "undefined")
    {
        this.scenewidth = (typeof settings.scenewidth !== "undefined") ? settings.scenewidth : this.scenewidth;
        this.waterline = (typeof settings.waterline !== "undefined") ? settings.waterline : this.waterline;
        this.gravity = (typeof settings.gravity !== "undefined") ? settings.gravity : this.gravity;
        this.size = (typeof settings.size !== "undefined") ? settings.size : this.size;
        this.mass = (typeof settings.mass !== "undefined") ? settings.mass : this.mass;
        this.liquidDensity = (typeof settings.liquidDensity !== "undefined") ? settings.liquidDensity : this.liquidDensity;
        this.text = (typeof settings.text !== "undefined") ? settings.text : this.text;
        this.font = (typeof settings.font !== "undefined") ? settings.font : this.font;
        this.color = (typeof settings.color !== "undefined") ? settings.color : this.color;
        this.liquidColor = (typeof settings.liquidColor !== "undefined") ? settings.liquidColor : this.liquidColor;
        this.liquidOpacity = (typeof settings.liquidOpacity !== "undefined") ? settings.liquidOpacity : this.liquidOpacity;
    }
};

/**
 * Initializes all simulation objects.
 */
FloatingAnimation.prototype.initSimulation = function()
{
    this.letters = [];
    
    for (let i=0; i<this.text.length; i++)
    {
        this.letters.push (new RigidLetter (this.text[i],
                                            this.font,
                                            this.mass,
                                            this.size,
                                            new Vector (getRandomBetween(-0.8*this.scenewidth/2, 0.8*this.scenewidth/2),
                                                        getRandomBetween(-0.8*this.scenewidth*this.canvas.height/this.canvas.width/2, 0.8* this.scenewidth*this.canvas.height/this.canvas.width/2)),
                                            new Vector (getRandomBetween(-2, 2), getRandomBetween(-1.5, 1.5)),
                                            new Vector())
                           );
        this.letters[i].color = this.color;
        this.letters[i].angularVelocity = getRandomBetween (-1, 1);
    }
};

/**
 * Runs the simulation and renders it.
 */
FloatingAnimation.prototype.draw = function()
{
    this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
    
    this.context.save();
    
    var zoom = this.canvas.width / this.scenewidth;
    this.context.setTransform (zoom, 0, 0, zoom, this.canvas.width/2, this.canvas.height/2);
    
    if (this.GRID) FloatingAnimation.drawGrid (this.context);
    
    for (let i=0; i<this.letters.length; i++)
    {
        this.letters[i].applyAcceleration (this.gravity);
        this.letters[i].applyFlotationForces (this.gravity, this.liquidDensity, this.waterline);
        
        this.letters[i].update (this.dt);
        
        this.letters[i].display (this.context);
    }
    
    //Draw the water
    this.context.save();
    this.context.globalAlpha = this.liquidOpacity;
    this.context.fillStyle = this.liquidColor;
    this.context.fillRect (zoom * (-this.canvas.width/2), this.waterline, zoom * this.canvas.width, this.scenewidth * this.canvas.height / this.canvas.width / 2 - this.waterline);
    this.context.restore();
    
    this.context.restore();
    
    if (this.EDITMODE)
    {
        //canvas corner
        this.context.save();
        this.context.globalAlpha = 1;
        this.context.strokeStyle = "#000000";
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.moveTo (this.canvas.width-15, this.canvas.height-3);
        this.context.lineTo (this.canvas.width-3, this.canvas.height-3);
        this.context.lineTo (this.canvas.width-3, this.canvas.height-15);
        this.context.moveTo (this.canvas.width-15, this.canvas.height-8);
        this.context.lineTo (this.canvas.width-8, this.canvas.height-8);
        this.context.lineTo (this.canvas.width-8, this.canvas.height-15);
        this.context.stroke();
        this.context.restore();
    }
};

/**
 * Draws a grid on the context.
 * @param {Object} context HTML5 Canvas's context to draw on
 */
FloatingAnimation.drawGrid = function (context)
{
    context.save();
    
    context.lineWidth = 0.025;
    
    context.beginPath();
    context.moveTo(-10, 0);
    context.lineTo(10, 0);
    context.stroke();
    
    context.beginPath();
    context.moveTo(0, -10);
    context.lineTo(0, 10);
    context.stroke();
    
    context.beginPath();
    context.moveTo(-0.25, -10);
    context.lineTo(0.25, -10);
    context.moveTo(-0.25, -9);
    context.lineTo(0.25, -9);
    context.moveTo(-0.25, -8);
    context.lineTo(0.25, -8);
    context.moveTo(-0.25, -7);
    context.lineTo(0.25, -7);
    context.moveTo(-0.25, -6);
    context.lineTo(0.25, -6);
    context.moveTo(-0.25, -5);
    context.lineTo(0.25, -5);
    context.moveTo(-0.25, -4);
    context.lineTo(0.25, -4);
    context.moveTo(-0.25, -3);
    context.lineTo(0.25, -3);
    context.moveTo(-0.25, -2);
    context.lineTo(0.25, -2);
    context.moveTo(-0.25, -1);
    context.lineTo(0.25, -1);
    context.moveTo(-0.25, 1);
    context.lineTo(0.25, 1);
    context.moveTo(-0.25, 2);
    context.lineTo(0.25, 2);
    context.moveTo(-0.25, 3);
    context.lineTo(0.25, 3);
    context.moveTo(-0.25, 4);
    context.lineTo(0.25, 4);
    context.moveTo(-0.25, 5);
    context.lineTo(0.25, 5);
    context.moveTo(-0.25, 6);
    context.lineTo(0.25, 6);
    context.moveTo(-0.25, 7);
    context.lineTo(0.25, 7);
    context.moveTo(-0.25, 8);
    context.lineTo(0.25, 8);
    context.moveTo(-0.25, 9);
    context.lineTo(0.25, 9);
    context.moveTo(-0.25, 10);
    context.lineTo(0.25, 10);
    context.stroke();
    
    context.beginPath();
    context.moveTo(-10, -0.25);
    context.lineTo(-10, 0.25);
    context.moveTo(-9, -0.25);
    context.lineTo(-9, 0.25);
    context.moveTo(-8, -0.25);
    context.lineTo(-8, 0.25);
    context.moveTo(-7, -0.25);
    context.lineTo(-7, 0.25);
    context.moveTo(-6, -0.25);
    context.lineTo(-6, 0.25);
    context.moveTo(-5, -0.25);
    context.lineTo(-5, 0.25);
    context.moveTo(-4, -0.25);
    context.lineTo(-4, 0.25);
    context.moveTo(-3, -0.25);
    context.lineTo(-3, 0.25);
    context.moveTo(-2, -0.25);
    context.lineTo(-2, 0.25);
    context.moveTo(-1, -0.25);
    context.lineTo(-1, 0.25);
    context.moveTo(1, -0.25);
    context.lineTo(1, 0.25);
    context.moveTo(2, -0.25);
    context.lineTo(2, 0.25);
    context.moveTo(3, -0.25);
    context.lineTo(3, 0.25);
    context.moveTo(4, -0.25);
    context.lineTo(4, 0.25);
    context.moveTo(5, -0.25);
    context.lineTo(5, 0.25);
    context.moveTo(6, -0.25);
    context.lineTo(6, 0.25);
    context.moveTo(7, -0.25);
    context.lineTo(7, 0.25);
    context.moveTo(8, -0.25);
    context.lineTo(8, 0.25);
    context.moveTo(9, -0.25);
    context.lineTo(9, 0.25);
    context.moveTo(10, -0.25);
    context.lineTo(10, 0.25);
    context.stroke();
    
    context.beginPath();
    context.moveTo(-0.9, -0.1);
    context.lineTo(-0.9, 0.1);
    context.moveTo(-0.8, -0.1);
    context.lineTo(-0.8, 0.1);
    context.moveTo(-0.7, -0.1);
    context.lineTo(-0.7, 0.1);
    context.moveTo(-0.6, -0.1);
    context.lineTo(-0.6, 0.1);
    context.moveTo(-0.5, -0.1);
    context.lineTo(-0.5, 0.1);
    context.moveTo(-0.4, -0.1);
    context.lineTo(-0.4, 0.1);
    context.moveTo(-0.3, -0.1);
    context.lineTo(-0.3, 0.1);
    context.moveTo(-0.2, -0.1);
    context.lineTo(-0.2, 0.1);
    context.moveTo(-0.1, -0.1);
    context.lineTo(-0.1, 0.1);
    context.moveTo(0.1, -0.1);
    context.lineTo(0.1, 0.1);
    context.moveTo(0.2, -0.1);
    context.lineTo(0.2, 0.1);
    context.moveTo(0.3, -0.1);
    context.lineTo(0.3, 0.1);
    context.moveTo(0.4, -0.1);
    context.lineTo(0.4, 0.1);
    context.moveTo(0.5, -0.1);
    context.lineTo(0.5, 0.1);
    context.moveTo(0.6, -0.1);
    context.lineTo(0.6, 0.1);
    context.moveTo(0.7, -0.1);
    context.lineTo(0.7, 0.1);
    context.moveTo(0.8, -0.1);
    context.lineTo(0.8, 0.1);
    context.moveTo(0.9, -0.1);
    context.lineTo(0.9, 0.1);
    context.lineWidth = 0.01;
    context.stroke();
    
    context.restore();
};

/**
 * Creates a flocking animation.
 * @class
 * @param {Object} canvas a canvas element
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @classdesc Creates and runs an animation based on Reynolds' flocking model. How to use: create an instance of this class and call its method draw() on each frame.
 */
function FlockingAnimation (canvas, EDITMODE = false)
{
    //EasyPhysicsAnimation.call (canvas);
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    
    //Simulation objects
    this.flock;
    
    //Editor params
    this.EDITMODE; //EasyPhysicsAnimation
    this.GRID; //EasyPhysicsAnimation
    
    //Scene params
    this.scenewidth; //EasyPhysicsAnimation
    
    //Simulation params
    this.dt = 1.0; //EasyPhysicsAnimation
    this.size; //EasyPhysicsAnimation
    this.quantity;
    this.separationweight;
    this.alignmentweight;
    this.cohesionweight;
    
    //Aesthetic params
    this.visualrepresentation;
    this.ORIENTEDTOWARDSMOVEMENT;
    this.color;
    
    this.initParams (EDITMODE);
    this.initSimulation();
}

/**
 * Initializes all parameters with given settings or default values.
 * If global object eptfgSettingsFlocking exists, initializes with its parameters:
 * eptfgSettingsFlocking.EDITMODE
 * eptfgSettingsFlocking.GRID
 * eptfgSettingsFlocking.scenewidth
 * eptfgSettingsFlocking.size
 * eptfgSettingsFlocking.quantity
 * eptfgSettingsFlocking.separationweight
 * eptfgSettingsFlocking.alignmentweight
 * eptfgSettingsFlocking.cohesionweight
 * eptfgSettingsFlocking.visualrepresentation
 * eptfgSettingsFlocking.shape
 * eptfgSettingsFlocking.ORIENTED
 * eptfgSettingsFlocking.color
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @param {Object} settings object that contains settings
 */
FlockingAnimation.prototype.initParams = function (EDITMODE = false, settings)
{
    this.EDITMODE = EDITMODE;
    this.GRID = EDITMODE;
    
    this.scenewidth = 400;
    
    this.size = 5;
    this.quantity = 200;
    this.separationweight = 1.5;
    this.alignmentweight = 1.0;
    this.cohesionweight = 1.0;
    
    this.visualrepresentation = "triangle";
    this.ORIENTEDTOWARDSMOVEMENT = true;
    this.color = "#000000";
    
    if (typeof eptfgSettingsFlocking !== "undefined")
    {
        if (typeof eptfgSettingsFlocking.EDITMODE !== "undefined")
        {
            if (eptfgSettingsFlocking.EDITMODE == "true")
            {
                this.EDITMODE = true;
            }
            else if (eptfgSettingsFlocking.EDITMODE == "false")
            {
                this.EDITMODE = false;
            }
        }
        if (typeof eptfgSettingsFlocking.GRID !== "undefined")
        {
            if (eptfgSettingsFlocking.GRID == "true")
            {
                this.GRID = true;
            }
            else if (eptfgSettingsFlocking.GRID == "false")
            {
                this.GRID = false;
            }
        }
        
        this.scenewidth = (typeof eptfgSettingsFlocking.scenewidth !== "undefined") ? (1.0 * eptfgSettingsFlocking.scenewidth) : this.scenewidth;
        
        this.size = (typeof eptfgSettingsFlocking.size !== "undefined") ? (1.0 * eptfgSettingsFlocking.size) : this.size;
        this.quantity = (typeof eptfgSettingsFlocking.quantity !== "undefined") ? (1 * eptfgSettingsFlocking.quantity) : this.quantity;
        this.separationweight = (typeof eptfgSettingsFlocking.separationweight !== "undefined") ? (1.0 * eptfgSettingsFlocking.separationweight) : this.separationweight;
        this.alignmentweight = (typeof eptfgSettingsFlocking.alignmentweight !== "undefined") ? (1.0 * eptfgSettingsFlocking.alignmentweight) : this.alignmentweight;
        this.cohesionweight = (typeof eptfgSettingsFlocking.cohesionweight !== "undefined") ? (1.0 * eptfgSettingsFlocking.cohesionweight) : this.cohesionweight;
        
        var visualrepresentation = (typeof eptfgSettingsFlocking.visualrepresentation !== "undefined") ? eptfgSettingsFlocking.visualrepresentation : this.visualrepresentation;
        if (visualrepresentation == "image")
        {
            //TODO image
        }
        else
        {
            this.visualrepresentation = (typeof eptfgSettingsFlocking.shape !== "undefined") ? eptfgSettingsFlocking.shape : this.visualrepresentation;
        }
        if (typeof eptfgSettingsFlocking.ORIENTED !== "undefined")
        {
            if (eptfgSettingsFlocking.ORIENTED == "true")
            {
                this.oriented = true;
            }
            else if (eptfgSettingsFlocking.ORIENTED == "false")
            {
                this.oriented = false;
            }
        }
        this.color = (typeof eptfgSettingsFlocking.color !== "undefined") ? eptfgSettingsFlocking.color : this.color;
    }
    
    if (typeof settings !== "undefined")
    {
        this.scenewidth = (typeof settings.scenewidth !== "undefined") ? settings.scenewidth : this.scenewidth;
        this.size = (typeof settings.size !== "undefined") ? settings.size : this.size;
        this.quantity = (typeof settings.quantity !== "undefined") ? settings.quantity : this.quantity;
        this.separationweight = (typeof settings.separationweight !== "undefined") ? settings.separationweight : this.separationweight;
        this.alignmentweight = (typeof settings.alignmentweight !== "undefined") ? settings.alignmentweight : this.alignmentweight;
        this.cohesionweight = (typeof settings.cohesionweight !== "undefined") ? settings.cohesionweight : this.cohesionweight;
        this.visualrepresentation = (typeof settings.visualrepresentation !== "undefined") ? settings.visualrepresentation : this.visualrepresentation;
        this.ORIENTEDTOWARDSMOVEMENT = (typeof settings.ORIENTEDTOWARDSMOVEMENT !== "undefined") ? settings.ORIENTEDTOWARDSMOVEMENT : this.ORIENTEDTOWARDSMOVEMENT;
        this.color = (typeof settings.color !== "undefined") ? settings.color : this.color;
    }
};

/**
 * Initializes all simulation objects.
 */
FlockingAnimation.prototype.initSimulation = function()
{
    this.flock = new Flock (this.size * Flock.desiredseparationtoradiusratio,
                            this.size * Flock.neighbourdistancetoradiusratio,
                            this.separationweight,
                            this.alignmentweight,
                            this.cohesionweight);
    for (var i=0; i<this.quantity; i++)
    {
        var angle = getRandomBetween (0, 2 * Math.PI);
        this.flock.addBoid (new Boid (this.visualrepresentation,
                                      this.size,
                                      new Vector (0, 0),
                                      new Vector (Math.cos(angle), Math.sin(angle)),
                                      new Vector(),
                                      2,
                                      0.03,
                                      this.ORIENTEDTOWARDSMOVEMENT)
                            );
        this.flock.boids[i].color = this.color;
    }
    
    this.currentTime = Date.now();
};

/**
 * Runs the simulation and renders it.
 */
FlockingAnimation.prototype.draw = function()
{
    var previousTime = this.currentTime;
    this.currentTime = Date.now();
    
    this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
    
    this.context.save();
    
    var zoom = this.canvas.width / this.scenewidth;
    this.context.setTransform (zoom, 0, 0, zoom, this.canvas.width/2, this.canvas.height/2);
    
    if (this.GRID) FlockingAnimation.drawGrid (this.context, this.scenewidth);
    
    this.flock.run (this.dt,
                    -this.scenewidth/2,
                    this.scenewidth/2,
                    -this.scenewidth * this.canvas.height / this.canvas.width / 2,
                    this.scenewidth * this.canvas.height / this.canvas.width / 2);
    
    this.flock.display (this.context);
    
    this.context.restore();
    
    if (this.EDITMODE)
    {
        //canvas corner
        this.context.save();
        this.context.globalAlpha = 1;
        this.context.strokeStyle = "#000000";
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.moveTo (this.canvas.width-15, this.canvas.height-3);
        this.context.lineTo (this.canvas.width-3, this.canvas.height-3);
        this.context.lineTo (this.canvas.width-3, this.canvas.height-15);
        this.context.moveTo (this.canvas.width-15, this.canvas.height-8);
        this.context.lineTo (this.canvas.width-8, this.canvas.height-8);
        this.context.lineTo (this.canvas.width-8, this.canvas.height-15);
        this.context.stroke();
        this.context.restore();
    }
};

/**
 * Draws a grid on the context.
 * @param {Object} context HTML5 Canvas's context to draw on
 */
FlockingAnimation.drawGrid = function (context, scenewidth)
{
    context.save();
    
    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    context.beginPath();
    context.moveTo (-scenewidth/2, 0);
    context.lineTo (scenewidth/2, 0);
    context.stroke();
    context.beginPath();
    context.moveTo (0, -scenewidth/2);
    context.lineTo (0, scenewidth/2);
    context.stroke();
    
    context.strokeStyle = "#444444";
    context.lineWidth = 0.6;
    for (var i=100; i<scenewidth/2; i+=100)
    {
        context.beginPath();
        context.moveTo (i, -scenewidth/2);
        context.lineTo (i, scenewidth/2);
        context.stroke();
    }
    for (var i=-100; i>-scenewidth/2; i-=100)
    {
        context.beginPath();
        context.moveTo (i, -scenewidth/2);
        context.lineTo (i, scenewidth/2);
        context.stroke();
    }
    for (var i=100; i<scenewidth/2; i+=100)
    {
        context.beginPath();
        context.moveTo (-scenewidth/2, i);
        context.lineTo (scenewidth/2, i);
        context.stroke();
    }
    for (var i=-100; i>-scenewidth/2; i-=100)
    {
        context.beginPath();
        context.moveTo (-scenewidth/2, i);
        context.lineTo (scenewidth/2, i);
        context.stroke();
    }
    
    context.strokeStyle = "#AAAAAA";
    context.lineWidth = 0.05;
    for (var i=10; i<scenewidth/2; i+=10)
    {
        context.beginPath();
        context.moveTo (i, -scenewidth/2);
        context.lineTo (i, scenewidth/2);
        context.stroke();
    }
    for (var i=-10; i>-scenewidth/2; i-=10)
    {
        context.beginPath();
        context.moveTo (i, -scenewidth/2);
        context.lineTo (i, scenewidth/2);
        context.stroke();
    }
    for (var i=10; i<scenewidth/2; i+=10)
    {
        context.beginPath();
        context.moveTo (-scenewidth/2, i);
        context.lineTo (scenewidth/2, i);
        context.stroke();
    }
    for (var i=-10; i>-scenewidth/2; i-=10)
    {
        context.beginPath();
        context.moveTo (-scenewidth/2, i);
        context.lineTo (scenewidth/2, i);
        context.stroke();
    }
    
    context.restore();
};

/**
 * Creates a steering animation.
 * @class
 * @param {Object} canvas a canvas element
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @classdesc Creates and runs an animation based on Reynolds' Steering Behaviours. How to use: create an instance of this class and call its method draw() on each frame.
 */
function SteeringAnimation (canvas, EDITMODE = false)
{
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    
    //Simulation objects
    this.hunter;
    this.gatherer;
    this.target;
    
    //Editor params
    this.EDITMODE; //EasyPhysicsAnimation
    this.GRID; //EasyPhysicsAnimation
    this.SHOWPURSUEDISTANCE;
    this.SHOWSEEKDISTANCE;
    this.SHOWEVADEDISTANCE;
    
    //Scene params
    this.scenewidth; //EasyPhysicsAnimation
    this.EXISTS_hunter;
    this.EXISTS_gatherer;
    this.EXISTS_target;
    
    //Simulation params
    this.dt = 1.0; //EasyPhysicsAnimation
    this.size; //EasyPhysicsAnimation
    this.pursuedistance;
    this.seekdistance;
    this.evadedistance;
    this.pursueweight;
    this.seekweight;
    this.evadeweight;
    
    //Aesthetic params
    this.visualrepresentation_hunter;
    this.ORIENTEDTOWARDSMOVEMENT_hunter;
    this.color_hunter;
    this.visualrepresentation_gatherer;
    this.ORIENTEDTOWARDSMOVEMENT_gatherer;
    this.color_gatherer;
    this.visualrepresentation_target;
    this.color_target;
    
    this.initParams (EDITMODE);
    this.initSimulation();
}

//SteeringAnimation.prototype = Object.create (EasyPhysicsAnimation.prototype);
//SteeringAnimation.prototype.constructor = SteeringAnimation;

/**
 * Initializes all parameters with given settings or default values.
 * If global object eptfgSettingsSteering exists, initializes with its parameters:
 * eptfgSettingsSteering.EDITMODE
 * eptfgSettingsSteering.GRID
 * eptfgSettingsSteering.SHOWPURSUEDISTANCE
 * eptfgSettingsSteering.SHOWSEEKDISTANCE
 * eptfgSettingsSteering.SHOWEVADEDISTANCE
 * eptfgSettingsSteering.EXISTS_hunter
 * eptfgSettingsSteering.EXISTS_gatherer
 * eptfgSettingsSteering.EXISTS_target
 * eptfgSettingsSteering.size
 * eptfgSettingsSteering.pursuedistance
 * eptfgSettingsSteering.seekdistance
 * eptfgSettingsSteering.evadedistance
 * eptfgSettingsSteering.pursueweight
 * eptfgSettingsSteering.seekweight
 * eptfgSettingsSteering.evadeweight
 * eptfgSettingsSteering.visualrepresentation_hunter
 * eptfgSettingsSteering.ORIENTEDTOWARDSMOVEMENT_hunter
 * eptfgSettingsSteering.color_hunter
 * eptfgSettingsSteering.visualrepresentation_gatherer
 * eptfgSettingsSteering.ORIENTEDTOWARDSMOVEMENT_gatherer
 * eptfgSettingsSteering.color_gatherer
 * eptfgSettingsSteering.visualrepresentation_target
 * eptfgSettingsSteering.color_target
 * @param {bool} [EDITMODE=false] wether the animation is being edited
 * @param {Object} settings object that contains settings
 */
SteeringAnimation.prototype.initParams = function (EDITMODE = false, settings)
{
    this.EDITMODE = EDITMODE;
    this.GRID = EDITMODE;
    this.SHOWPURSUEDISTANCE = false;
    this.SHOWSEEKDISTANCE = false;
    this.SHOWEVADEDISTANCE = false;
    
    this.scenewidth = 400;
    this.EXISTS_hunter = true;
    this.EXISTS_gatherer = true;
    this.EXISTS_target = true;
    
    this.size = 5;
    this.pursuedistance = 50;
    this.seekdistance = 50;
    this.evadedistance = 50;
    this.pursueweight = 1.0;
    this.seekweight = 1.0;
    this.evadeweight = 1.0;
    
    this.visualrepresentation_hunter = "triangle";
    this.ORIENTEDTOWARDSMOVEMENT_hunter = true;
    this.color_hunter = "#000000";
    this.visualrepresentation_gatherer = "circle";
    this.ORIENTEDTOWARDSMOVEMENT_gatherer = true;
    this.color_gatherer = "#000000";
    this.visualrepresentation_target = "square";
    this.color_target = "#000000";
    
    if (typeof eptfgSettingsSteering !== "undefined")
    {
        if (typeof eptfgSettingsSteering.EDITMODE !== "undefined")
        {
            if (eptfgSettingsSteering.EDITMODE == "true")
            {
                this.EDITMODE = true;
            }
            else if (eptfgSettingsSteering.EDITMODE == "false")
            {
                this.EDITMODE = false;
            }
        }
        if (typeof eptfgSettingsSteering.GRID !== "undefined")
        {
            if (eptfgSettingsSteering.GRID == "true")
            {
                this.GRID = true;
            }
            else if (eptfgSettingsSteering.GRID == "false")
            {
                this.GRID = false;
            }
        }
        if (typeof eptfgSettingsSteering.SHOWPURSUEDISTANCE !== "undefined")
        {
            if (eptfgSettingsSteering.SHOWPURSUEDISTANCE == "true")
            {
                this.SHOWPURSUEDISTANCE = true;
            }
            else if (eptfgSettingsSteering.SHOWPURSUEDISTANCE == "false")
            {
                this.SHOWPURSUEDISTANCE = false;
            }
        }
        if (typeof eptfgSettingsSteering.SHOWSEEKDISTANCE !== "undefined")
        {
            if (eptfgSettingsSteering.SHOWSEEKDISTANCE == "true")
            {
                this.SHOWSEEKDISTANCE = true;
            }
            else if (eptfgSettingsSteering.SHOWSEEKDISTANCE == "false")
            {
                this.SHOWSEEKDISTANCE = false;
            }
        }
        if (typeof eptfgSettingsSteering.SHOW_EVADEDISTANCE !== "undefined")
        {
            if (eptfgSettingsSteering.SHOW_EVADEDISTANCE == "true")
            {
                this.SHOW_EVADEDISTANCE = true;
            }
            else if (eptfgSettingsSteering.SHOW_EVADEDISTANCE == "false")
            {
                this.SHOW_EVADEDISTANCE = false;
            }
        }
        
        this.scenewidth = (typeof eptfgSettingsSteering.scenewidth !== "undefined") ? (1.0 * eptfgSettingsSteering.scenewidth) : this.scenewidth;
        if (typeof eptfgSettingsSteering.EXISTS_hunter !== "undefined")
        {
            if (eptfgSettingsSteering.EXISTS_hunter == "true")
            {
                this.EXISTS_hunter = true;
            }
            else if (eptfgSettingsSteering.EXISTS_hunter == "false")
            {
                this.EXISTS_hunter = false;
            }
        }
        if (typeof eptfgSettingsSteering.EXISTS_gatherer !== "undefined")
        {
            if (eptfgSettingsSteering.EXISTS_gatherer == "true")
            {
                this.EXISTS_gatherer = true;
            }
            else if (eptfgSettingsSteering.EXISTS_gatherer == "false")
            {
                this.EXISTS_gatherer = false;
            }
        }
        if (typeof eptfgSettingsSteering.EXISTS_target !== "undefined")
        {
            if (eptfgSettingsSteering.EXISTS_target == "true")
            {
                this.EXISTS_target = true;
            }
            else if (eptfgSettingsSteering.EXISTS_target == "false")
            {
                this.EXISTS_target = false;
            }
        }
        
        this.size = (typeof eptfgSettingsSteering.size !== "undefined") ? (1.0 * eptfgSettingsSteering.size) : this.size;
        this.pursuedistance = (typeof eptfgSettingsSteering.pursuedistance !== "undefined") ? (1.0 * eptfgSettingsSteering.pursuedistance) : this.pursuedistance;
        this.seekdistance = (typeof eptfgSettingsSteering.seekdistance !== "undefined") ? (1.0 * eptfgSettingsSteering.seekdistance) : this.size;
        this.evadedistance = (typeof eptfgSettingsSteering.evadedistance !== "undefined") ? (1 * eptfgSettingsSteering.evadedistance) : this.evadedistance;
        this.pursueweight = (typeof eptfgSettingsSteering.pursueweight !== "undefined") ? (1.0 * eptfgSettingsSteering.pursueweight) : this.pursueweight;
        this.seekweight = (typeof eptfgSettingsSteering.seekweight !== "undefined") ? (1.0 * eptfgSettingsSteering.seekweight) : this.size;
        this.evadeweight = (typeof eptfgSettingsSteering.evadeweight !== "undefined") ? (1 * eptfgSettingsSteering.evadeweight) : this.evadeweight;
        
        var visualrepresentation_hunter = (typeof eptfgSettingsSteering.visualrepresentation_hunter !== "undefined") ? eptfgSettingsSteering.visualrepresentation_hunter : this.visualrepresentation_hunter;
        if (visualrepresentation_hunter == "image")
        {
            //TODO image
        }
        else
        {
            this.visualrepresentation_hunter = (typeof eptfgSettingsSteering.shape_hunter !== "undefined") ? eptfgSettingsSteering.shape_hunter : this.visualrepresentation_hunter;
        }
        var visualrepresentation_gatherer = (typeof eptfgSettingsSteering.visualrepresentation_gatherer !== "undefined") ? eptfgSettingsSteering.visualrepresentation_gatherer : this.visualrepresentation_gatherer;
        if (visualrepresentation_gatherer == "image")
        {
            //TODO image
        }
        else
        {
            this.visualrepresentation_gatherer = (typeof eptfgSettingsSteering.shape_gatherer !== "undefined") ? eptfgSettingsSteering.shape_gatherer : this.visualrepresentation_gatherer;
        }
        var visualrepresentation_target = (typeof eptfgSettingsSteering.visualrepresentation_target !== "undefined") ? eptfgSettingsSteering.visualrepresentation_target : this.visualrepresentation_target;
        if (visualrepresentation_target == "image")
        {
            //TODO image
        }
        else
        {
            this.visualrepresentation_target = (typeof eptfgSettingsSteering.shape_target !== "undefined") ? eptfgSettingsSteering.shape_target : this.visualrepresentation_target;
        }
        if (typeof eptfgSettingsSteering.ORIENTED_hunter !== "undefined")
        {
            if (eptfgSettingsSteering.ORIENTED_hunter == "true")
            {
                this.oriented_hunter = true;
            }
            else if (eptfgSettingsSteering.ORIENTED_hunter == "false")
            {
                this.oriented_hunter = false;
            }
        }
        if (typeof eptfgSettingsSteering.ORIENTED_gatherer !== "undefined")
        {
            if (eptfgSettingsSteering.ORIENTED_gatherer == "true")
            {
                this.oriented_gatherer = true;
            }
            else if (eptfgSettingsSteering.ORIENTED_gatherer == "false")
            {
                this.oriented_gatherer = false;
            }
        }
        this.color_hunter = (typeof eptfgSettingsSteering.color_hunter !== "undefined") ? eptfgSettingsSteering.color_hunter : this.color_hunter;
        this.color_gatherer = (typeof eptfgSettingsSteering.color_gatherer !== "undefined") ? eptfgSettingsSteering.color_gatherer : this.color_gatherer;
        this.color_target = (typeof eptfgSettingsSteering.color_target !== "undefined") ? eptfgSettingsSteering.color_target : this.color_target;
    }
    
    if (typeof settings !== "undefined")
    {
        this.scenewidth = (typeof settings.scenewidth !== "undefined") ? settings.scenewidth : this.scenewidth;
        this.EXISTS_hunter = (typeof settings.EXISTS_hunter !== "undefined") ? settings.EXISTS_hunter : this.EXISTS_hunter;
        this.EXISTS_gatherer = (typeof settings.EXISTS_gatherer !== "undefined") ? settings.EXISTS_gatherer : this.EXISTS_gatherer;
        this.EXISTS_target = (typeof settings.EXISTS_target !== "undefined") ? settings.EXISTS_target : this.EXISTS_target;
        this.size = (typeof settings.size !== "undefined") ? settings.size : this.size;
        this.pursuedistance = (typeof settings.pursuedistance !== "undefined") ? settings.pursuedistance : this.pursuedistance;
        this.seekdistance = (typeof settings.seekdistance !== "undefined") ? settings.seekdistance : this.seekdistance;
        this.evadedistance = (typeof settings.evadedistance !== "undefined") ? settings.evadedistance : this.evadedistance;
        this.pursueweight = (typeof settings.pursueweight !== "undefined") ? settings.pursueweight : this.pursueweight;
        this.seekweight = (typeof settings.seekweight !== "undefined") ? settings.seekweight : this.seekweight;
        this.evadeweight = (typeof settings.evadeweight !== "undefined") ? settings.evadeweight : this.evadeweight;
        this.visualrepresentation_hunter = (typeof settings.visualrepresentation_hunter !== "undefined") ? settings.visualrepresentation_hunter : this.visualrepresentation_hunter;
        this.ORIENTEDTOWARDSMOVEMENT_hunter = (typeof settings.ORIENTEDTOWARDSMOVEMENT_hunter !== "undefined") ? settings.ORIENTEDTOWARDSMOVEMENT_hunter : this.ORIENTEDTOWARDSMOVEMENT_hunter;
        this.color_hunter = (typeof settings.color_hunter !== "undefined") ? settings.color_hunter : this.color_hunter;
        this.visualrepresentation_gatherer = (typeof settings.visualrepresentation_gatherer !== "undefined") ? settings.visualrepresentation_gatherer : this.visualrepresentation_gatherer;
        this.ORIENTEDTOWARDSMOVEMENT_gatherer = (typeof settings.ORIENTEDTOWARDSMOVEMENT_gatherer !== "undefined") ? settings.ORIENTEDTOWARDSMOVEMENT_gatherer : this.ORIENTEDTOWARDSMOVEMENT_gatherer;
        this.color_gatherer = (typeof settings.color_gatherer !== "undefined") ? settings.color_gatherer : this.color_gatherer;
        this.visualrepresentation_target = (typeof settings.visualrepresentation_target !== "undefined") ? settings.visualrepresentation_target : this.visualrepresentation_target;
        this.ORIENTEDTOWARDSMOVEMENT_target = (typeof settings.ORIENTEDTOWARDSMOVEMENT_target !== "undefined") ? settings.ORIENTEDTOWARDSMOVEMENT_target : this.ORIENTEDTOWARDSMOVEMENT_target;
        this.color_target = (typeof settings.color_target !== "undefined") ? settings.color_target : this.color_target;
    }
};

/**
 * Initializes all simulation objects.
 */
SteeringAnimation.prototype.initSimulation = function()
{
    var worldHeight = this.scenewidth * this.canvas.height / this.canvas.width;
    
    if (this.EXISTS_hunter)
    {
        this.hunter = new Boid (this.visualrepresentation_hunter,
                                this.size,
                                new Vector (getRandomBetween(-this.scenewidth/2, this.scenewidth/2), getRandomBetween(-worldHeight/2, worldHeight/2)),
                                new Vector(),
                                new Vector(),
                                2,
                                0.03,
                                this.ORIENTEDTOWARDSMOVEMENT_hunter);
        this.hunter.color = this.color_hunter;
    }
    else
    {
        this.hunter = null;
    }
    
    if (this.EXISTS_gatherer)
    {
        this.gatherer = new Boid (this.visualrepresentation_gatherer,
                                  this.size,
                                  new Vector (getRandomBetween(-this.scenewidth/2, this.scenewidth/2), getRandomBetween(-worldHeight/2, worldHeight/2)),
                                  new Vector(),
                                  new Vector(),
                                  2,
                                  0.03,
                                  this.ORIENTEDTOWARDSMOVEMENT_gatherer);
        this.gatherer.color = this.color_gatherer;
    }
    else
    {
        this.gatherer = null;
    }
    
    if (this.EXISTS_target)
    {
        this.target = new Vector (getRandomBetween(-this.scenewidth/2, this.scenewidth/2), getRandomBetween(-worldHeight/2, worldHeight/2));
    }
    else
    {
        this.target = null;
    }
    
    this.currentTime = Date.now();
};

/**
 * Runs the simulation and renders it.
 */
SteeringAnimation.prototype.draw = function()
{
    var previousTime = this.currentTime;
    this.currentTime = Date.now();
    
    this.context.clearRect (0, 0, this.canvas.width, this.canvas.height);
    
    this.context.save();
    
    var zoom = this.canvas.width / this.scenewidth;
    this.context.setTransform (zoom, 0, 0, zoom, this.canvas.width/2, this.canvas.height/2);
    
    if (this.GRID) SteeringAnimation.drawGrid (this.context, this.scenewidth);
    
    //GATHERER logic and forces
    if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null))
    {
        var targetDoesntExistOrIsFar = true;
        var hunterDoesntExistOrIsFar = true;
        
        if (!(typeof (this.target) === "undefined" || this.target === null))
        {
            if (Vector.dist (this.gatherer.location, this.target) <= this.seekdistance)
            {
                targetDoesntExistOrIsFar = false;
                
                var seek = this.gatherer.seekIfNear (this.target, this.seekdistance); //Seek
                seek.mult (this.seekweight);
                this.gatherer.applyForce (seek);
            }
        }
        if (!(typeof (this.hunter) === "undefined" || this.hunter === null))
        {
            if (Vector.dist (this.gatherer.location, this.hunter.location) <= this.evadedistance)
            {
                hunterDoesntExistOrIsFar = false;
                
                var evade = this.gatherer.evadeIfNear (this.hunter, this.evadedistance, this.dt); //Evade
                evade.mult (this.evadeweight);
                this.gatherer.applyForce (evade);
            }
        }
        if (targetDoesntExistOrIsFar && hunterDoesntExistOrIsFar)
        {
            var wander = this.gatherer.wander();
            this.gatherer.applyForce (wander);
        }
    }
    
    //HUNTER logic and forces
    if (!(typeof (this.hunter) === "undefined" || this.hunter === null))
    {
        var gathererDoesntExistOrIsFar = true;
        
        if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null))
        {
            if (Vector.dist (this.hunter.location, this.gatherer.location) <= this.pursuedistance)
            {
                gathererDoesntExistOrIsFar = false;
                
                var pursue = this.hunter.pursueIfNear (this.gatherer, this.pursuedistance, this.dt); //Pursue
                pursue.mult (this.pursueweight);
                this.hunter.applyForce (pursue);
            }
        }
        if (gathererDoesntExistOrIsFar)
        {
            var wander = this.hunter.wander();
            this.hunter.applyForce (wander);
        }
    }
    
    //UPDATE gatherer and hunter positions
    if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null)) this.gatherer.update (this.dt);
    if (!(typeof (this.hunter) === "undefined" || this.hunter === null)) this.hunter.update (this.dt);
    
    //If gatherer reached the target, new target
    if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null) &&
        !(typeof (this.target) === "undefined" || this.target === null) &&
        Vector.dist (this.gatherer.location, this.target) < this.gatherer.radius * 2)
    {
        this.target.x = getRandomBetween (-this.scenewidth/2, this.scenewidth/2);
        this.target.y = getRandomBetween (-this.scenewidth * this.canvas.height / this.canvas.width / 2, this.scenewidth * this.canvas.height / this.canvas.width / 2);
    }
    
    //BORDERS gatherer and hunter
    if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null))
    {
        this.gatherer.borders (-this.scenewidth/2,
                               this.scenewidth/2,
                               -this.scenewidth * this.canvas.height / this.canvas.width / 2,
                               this.scenewidth * this.canvas.height / this.canvas.width / 2);
    }
    if (!(typeof (this.hunter) === "undefined" || this.hunter === null))
    {
        this.hunter.borders (-this.scenewidth/2,
                             this.scenewidth/2,
                             -this.scenewidth * this.canvas.height / this.canvas.width / 2,
                             this.scenewidth * this.canvas.height / this.canvas.width / 2);
    }
    
    //DRAW TARGET and GATHERER'S TARGET DETECTION DISTANCE
    if (!(typeof (this.target) === "undefined" || this.target === null))
    {
        if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null) && this.SHOWSEEKDISTANCE)
        {
            this.context.save();
            this.context.fillStyle = this.color_target;
            this.context.globalAlpha = 0.25;
            this.context.beginPath();
            this.context.arc (this.target.x, this.target.y, this.seekdistance, 0, 2*Math.PI)
            this.context.fill();
            this.context.restore();
        }
        
        SteeringAnimation.drawTarget (this.target, this.size, this.visualrepresentation_target, this.color_target, this.context);
    }
    
    //DRAW GATHERER and GATHERER'S HUNTER DETECTION DISTANCE
    if (!(typeof (this.gatherer) === "undefined" || this.gatherer === null))
    {
        if (this.SHOWEVADEDISTANCE)
        {
            this.context.save();
            this.context.fillStyle = this.gatherer.color;
            this.context.globalAlpha = 0.25;
            this.context.beginPath();
            this.context.arc (this.gatherer.location.x, this.gatherer.location.y, this.evadedistance, 0, 2*Math.PI)
            this.context.fill();
            this.context.restore();
        }
        this.gatherer.display (this.context);
    }
    
    //DRAW HUNTER and HUNTER'S PREY DETECTION DISTANCE
    if (!(typeof (this.hunter) === "undefined" || this.hunter === null))
    {
        if (this.SHOWPURSUEDISTANCE)
        {
            this.context.save();
            this.context.fillStyle = this.hunter.color;
            this.context.globalAlpha = 0.25;
            this.context.beginPath();
            this.context.arc (this.hunter.location.x, this.hunter.location.y, this.pursuedistance, 0, 2*Math.PI)
            this.context.fill();
            this.context.restore();
        }
        this.hunter.display (this.context);
    }
    
    this.context.restore();
    
    if (this.EDITMODE)
    {
        //canvas corner
        this.context.save();
        this.context.globalAlpha = 1;
        this.context.strokeStyle = "#000000";
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.moveTo (this.canvas.width-15, this.canvas.height-3);
        this.context.lineTo (this.canvas.width-3, this.canvas.height-3);
        this.context.lineTo (this.canvas.width-3, this.canvas.height-15);
        this.context.moveTo (this.canvas.width-15, this.canvas.height-8);
        this.context.lineTo (this.canvas.width-8, this.canvas.height-8);
        this.context.lineTo (this.canvas.width-8, this.canvas.height-15);
        this.context.stroke();
        this.context.restore();
    }
};

/**
 * Draws a target.
 * @param {Vector} location location of the target
 * @param {number} radius radius of the target
 * @param {string,Image} visualrepresentation visual representation of the target
 * @param {string} color color of the target
 * @param {Object} context HTML5 Canvas's context to draw on
 */
SteeringAnimation.drawTarget = function (location, radius, visualrepresentation, color, context)
{
    context.save();
    context.fillStyle = color;
    
    if (typeof (visualrepresentation) == "string")
    {
        switch (visualrepresentation)
        {
            case "square":
                context.fillRect (location.x-radius, location.y-radius, 2*radius, 2*radius);
                break;
            case "circle":
                context.beginPath();
                context.arc (location.x, location.y, radius, 0, 2*Math.PI);
                context.closePath();
                context.fill();
                break;
            case "triangle":
                context.save();
                context.transform (1, 0, 0, 1, location.x, location.y);
                context.beginPath();
                context.moveTo (radius, 0);
                context.lineTo (-radius, -3*radius/5);
                context.lineTo (-radius, 3*radius/5);
                context.closePath();
                context.fill();
                context.restore();
                break;
            default:
                context.beginPath();
                context.arc (location.x, location.y, radius, 0, 2*Math.PI, false);
                context.closePath();
                context.fill();
        }
    }
    else if (visualrepresentation instanceof Image)
    {
        context.save();
        context.transform (1, 0, 0, 1, location.x, location.y);
        context.drawImage (visualrepresentation, -radius, -radius, 2*radius, 2*radius);
        context.restore();
    }
    else
    {
        context.beginPath();
        context.arc (location.x, location.y, radius, 0, 2*Math.PI);
        context.closePath();
        context.fill();
    }
    
    context.restore();
}

/**
 * Draws a grid on the context.
 * @param {Object} context HTML5 Canvas's context to draw on
 */
SteeringAnimation.drawGrid = function (context, scenewidth)
{
    context.save();
    
    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    context.beginPath();
    context.moveTo (-scenewidth/2, 0);
    context.lineTo (scenewidth/2, 0);
    context.stroke();
    context.beginPath();
    context.moveTo (0, -scenewidth/2);
    context.lineTo (0, scenewidth/2);
    context.stroke();
    
    context.strokeStyle = "#444444";
    context.lineWidth = 0.6;
    for (var i=100; i<scenewidth/2; i+=100)
    {
        context.beginPath();
        context.moveTo (i, -scenewidth/2);
        context.lineTo (i, scenewidth/2);
        context.stroke();
    }
    for (var i=-100; i>-scenewidth/2; i-=100)
    {
        context.beginPath();
        context.moveTo (i, -scenewidth/2);
        context.lineTo (i, scenewidth/2);
        context.stroke();
    }
    for (var i=100; i<scenewidth/2; i+=100)
    {
        context.beginPath();
        context.moveTo (-scenewidth/2, i);
        context.lineTo (scenewidth/2, i);
        context.stroke();
    }
    for (var i=-100; i>-scenewidth/2; i-=100)
    {
        context.beginPath();
        context.moveTo (-scenewidth/2, i);
        context.lineTo (scenewidth/2, i);
        context.stroke();
    }
    
    context.strokeStyle = "#AAAAAA";
    context.lineWidth = 0.05;
    for (var i=10; i<scenewidth/2; i+=10)
    {
        context.beginPath();
        context.moveTo (i, -scenewidth/2);
        context.lineTo (i, scenewidth/2);
        context.stroke();
    }
    for (var i=-10; i>-scenewidth/2; i-=10)
    {
        context.beginPath();
        context.moveTo (i, -scenewidth/2);
        context.lineTo (i, scenewidth/2);
        context.stroke();
    }
    for (var i=10; i<scenewidth/2; i+=10)
    {
        context.beginPath();
        context.moveTo (-scenewidth/2, i);
        context.lineTo (scenewidth/2, i);
        context.stroke();
    }
    for (var i=-10; i>-scenewidth/2; i-=10)
    {
        context.beginPath();
        context.moveTo (-scenewidth/2, i);
        context.lineTo (scenewidth/2, i);
        context.stroke();
    }
    
    context.restore();
};
