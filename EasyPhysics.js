"use strict";


function getRandomBetween (min, max)
{
    return Math.random() * (max - min) + min;
}

// Converts from degrees to radians.
Math.radians = function (degrees)
{
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function (radians)
{
    return radians * 180 / Math.PI;
};

function Vector (x, y)
{
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype.add = function (vector)
{
    this.x += vector.x;
    this.y += vector.y;
};

Vector.add = function (vector1, vector2)
{
    return new Vector (vector1.x + vector2.x, vector1.y + vector2.y);
};

Vector.prototype.sub = function (vector)
{
    this.x -= vector.x;
    this.y -= vector.y;
};

Vector.sub = function (vector1, vector2)
{
    return new Vector (vector1.x - vector2.x, vector1.y - vector2.y);
};

Vector.dist = function (pointA, pointB)
{
    return Math.sqrt ((pointB.x - pointA.x) * (pointB.x - pointA.x) + (pointB.y - pointA.y) * (pointB.y - pointA.y));
};

Vector.prototype.getMagnitude = function()
{
    return Math.sqrt (this.x * this.x + this.y * this.y);
};

Vector.getMagnitude = function (vector)
{
    return Math.sqrt (vector.x * vector.x + vector.y * vector.y);
};

Vector.prototype.normalize = function()
{
    var mag = this.getMagnitude();
    this.x /= mag;
    this.y /= mag;
};

Vector.getNormalizedFrom = function (vector)
{
    return new Vector (vector.x / vector.getMagnitude(), vector.y / vector.getMagnitude());
};

Vector.prototype.getAngle = function()
{
    return Math.atan2 (this.y, this.x);
};

Vector.fromAngle = function (angle, magnitude)
{
    return new Vector (magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

Vector.prototype.mult = function (scalar)
{
    this.x *= scalar;
    this.y *= scalar;
};

Vector.mult = function (vector, scalar)
{
    return new Vector (vector.x * scalar, vector.y * scalar);
};

Vector.prototype.div = function (scalar)
{
    this.x /= scalar;
    this.y /= scalar;
};

Vector.div = function (vector, scalar)
{
    return new Vector (vector.x / scalar, vector.y / scalar);
};

Vector.prototype.limit = function (magnitude)
{
    if (this.getMagnitude() > magnitude)
    {
        this.normalize();
        this.x *= magnitude;
        this.y *= magnitude;
    }
};

Vector.dot = function (vector1, vector2)
{
    return vector1.x * vector2.x + vector1.y * vector2.y;
}


//TODO acceleration serà null (0) normalment
//li hauré de passar undefined si vull que agafe el valor per defecte
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

SimulationObject.prototype.update = function (dt)
{
    this.velocity.add (Vector.mult (this.acceleration, dt));
    this.location.add (Vector.mult (this.velocity, dt));
    this.acceleration.x = 0;
    this.acceleration.y = 0;
};

SimulationObject.prototype.applyAcceleration = function (acceleration)
{
    this.acceleration.add (acceleration);
};

SimulationObject.prototype.applyForce = function (force)
{
    this.acceleration.add (force);
};

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
    //else if (typeof (this.visualrepresentation) == Image.typeof) //TODO no sé si açò funciona
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

Boid.prototype.update = function (dt)
{
    this.velocity.add (Vector.mult (this.acceleration, dt));
    this.velocity.limit (this.maxspeed);
    this.location.add (Vector.mult (this.velocity, dt));
    this.acceleration.x = 0;
    this.acceleration.y = 0;
};
/*TODO delete
Boid.prototype.run = function (boids, dt, desiredseparation, neighbourdist, separationWeight, alignmentWeight, cohesionWeight, minX, maxX, minY, maxY)
{
    this.flock (boids, desiredseparation, neighbourdist, separationWeight, alignmentWeight, cohesionWeight);
    this.update (dt);
    this.borders (minX, maxX, minY, maxY);//this.borders (canvas);
};
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

Boid.prototype.seek = function (target)
{
    var desired = Vector.sub (target, this.location);
    desired.normalize();
    desired.mult (this.maxspeed);
    
    var steer = Vector.sub (desired, this.velocity);
    steer.limit (this.maxforce);
    return steer;
};

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

//Reynolds: Steering = Desired - Velocity
Boid.seek = function (location, velocity, target, maxspeed, maxforce)
{
    var desired = Vector.sub (target, location);
    desired.normalize();
    desired.mult (maxspeed);
    
    var steer = Vector.sub (desired, velocity);
    steer.limit (maxforce);
    return steer;
};

Boid.prototype.pursue = function (target, dt)
{
    var predictedLocation = Vector.add (target.location, Vector.mult (target.velocity, dt));
    return this.seek (predictedLocation);
};

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

Boid.prototype.flee = function (target)
{
    var steer = this.seek (target);
    steer.mult (-1);
    return steer;
};

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

Boid.prototype.evade = function (target, dt)
{
    var predictedLocation = Vector.add (target.location, Vector.mult (target.velocity, dt));
    return this.flee (predictedLocation);
};

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

//TODO Aquests defaults són EcmaScript 2015
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


Flock.prototype.display = function (context)
{
    for (var i=0; i<this.boids.length; i++)
    {
        this.boids[i].display (context);
    }
};

Flock.prototype.addBoid = function (b)
{
    this.boids.push (b);
};

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
function Particle (visualrepresentation, mass, radius, location, velocity, acceleration, orientedTowardsMovement = false)
{
    SimulationObject.call (this, visualrepresentation, radius, location, velocity, acceleration, orientedTowardsMovement);
    
    this.mass = mass;
}

Particle.prototype = Object.create (SimulationObject.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.applyForce = function (force)
{
    this.acceleration.add (Vector.div (force, this.mass));
};

Particle.prototype.computeForces = function (gravity, liquidDensity, sealevel, floor)
{
    if (this.location.y + this.radius >= sealevel)
    {
        var Vs = 0;
        //myRectangle.fillStyle = '#FF0000';
        if (this.location.y - this.radius >= /*180*/0) //Totalmente submergido
        {
            Vs = 4 * Math.PI * this.radius * this.radius * this.radius / 3;
            
            //myRectangle.fillStyle = '#0000FF';
            
            //FONDO MARINO TODO tots estos números arbitraris
            if (this.location.y + this.radius >= floor/2/*1.7*/) //Centro por debajo del suelo
            {
                alert (this.location.y);
            }
        }
        else //Sección submergida
        {
            var h = this.location.y + this.radius - /*180*/0;
            var a = Math.sqrt (2 * h * this.radius - h * h);
            Vs = (3 * a * a + h * h) * Math.PI * h / 6;
            
            //myRectangle.fillStyle = '#00FF00';
        }
        var Fb = liquidDensity * gravity * Vs;
        var flotacion = new Vector (0, -Fb);
        this.applyForce (flotacion);
        
        //Friction in water
        var friction = Vector.mult (this.velocity, -0.8);
        this.applyForce (friction);
    }
};

//Box-shaped tank
//TODO arguments
function Tank (center = new Vector(0,0), size = new Vector (3.4, 3.4))
{
    this.center = center;//new Vector (0, 0);
    this.size = size;//new Vector (3.4, 3.4);
}

Tank.prototype.collisionHandling = function (particle)
{
    //this.size = new Vector (3.4, 3.4);
    var wall = this.center.y + this.size.y / 2.0;
    var distanceParticlePlane = wall - particle.location.y;
    
    if (particle.location.y + particle.radius > wall)
    {
        if (distanceParticlePlane < 0) //center above border
        {
            distanceParticlePlane += particle.radius + Number.EPSILON;
        }
        else //center below border
        {
            distanceParticlePlane -= particle.radius + Number.EPSILON;
        }
        Tank.restitucion (particle, new Vector (0, -1), distanceParticlePlane, 1);
        Tank.respuesta (particle, new Vector (0, -1), 1);
    }
};

//TODO no m'agrada que modifique la variable que se li passa. Millor amb return, no? O fer que siguen funcions de Particle.
Tank.restitucion = function (particle, normal, distance, Kr)
{
    var deltaS = Vector.mult (normal, distance * (1.0 + Kr));
    particle.location.sub (deltaS);
};

//TODO no m'agrada que modifique la variable que se li passa. Millor amb return, no? O fer que siguen funcions de Particle.
Tank.respuesta = function (particle, normal, Kr)
{
    var nv = Vector.dot (normal, particle.velocity);
    var Vn = Vector.mult (normal, nv);
    var Vt = Vector.sub (particle.velocity, Vn);
    particle.velocity = Vector.sub (Vt, Vector.mult (Vn, Kr));
};


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
    /*
    console.log ("Rigid Box size =");
    console.log (this.size);
    console.log ("Rigid Box volume = " + this.size.x * this.size.y * (this.size.x + this.size.y)/2);
    console.log ("Rigid Box density = " + this.mass / (this.size.x * this.size.y * (this.size.x + this.size.y)/2));
    console.log ("Rigid Box pointVolume = " + this.pointVolume);
    console.log ("Rigid Box pointMass = " + this.pointMass);
    console.log ("Rigid Box point density = " + this.pointMass / this.pointVolume);*/
}

RigidBox.prototype = Object.create (SimulationObject.prototype);
RigidBox.prototype.constructor = RigidBox;

RigidBox.prototype.applyForce = function (force)
{
    this.acceleration.add (Vector.div (force, this.mass));
};

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

RigidBox.prototype.applyFlotationForces = function (gravity, liquidDensity, sealevel)
{
    var flotationForce = Vector.mult (gravity, -liquidDensity * this.pointVolume);
    for (var i=0; i<this.points.length; i++)
    {
        if (this.location.y + this.rotatedPoints[i].y > sealevel)
        {
            //this.acceleration.add (Vector.div (flotationForce, this.pointMass));
            this.applyForce (flotationForce);
            
            var torque = this.rotatedPoints[i].x * flotationForce.y - this.rotatedPoints[i].y * flotationForce.x;
            this.angularAcceleration += torque / this.momentOfInertia;
            
            //Friction in water
            //var friction = Vector.mult (this.velocity, -(this.size.x+this.size.y)/2*10);
            var friction = Vector.mult (this.velocity, -0.5);
            this.applyAcceleration (friction);//this.applyForce (friction);
            var angularFriction = Vector.mult (this.angularVelocity, -0.8);
            torque = this.rotatedPoints[i].x * angularFriction.y - this.rotatedPoints[i].y * angularFriction.x;
            this.angularAcceleration += torque;//this.angularAcceleration += torque / this.momentOfInertia;
        }
    }
};

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

RigidBox.prototype.display = function (context)
{
    context.save();
    
    context.strokeStyle = this.color;
    
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

function RigidLetter (letter, font, mass, size, location, velocity, acceleration) //size in px of the font
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
    
    /*
    console.log ("Rigid Letter size =");
    console.log (boundingBoxSize);
    console.log ("Rigid Letter volume = " + this.size.x * this.size.y * (this.size.x + this.size.y)/2);
    console.log ("Rigid Letter density = " + this.mass / (this.size.x * this.size.y * (this.size.x + this.size.y)/2));
    console.log ("Rigid Letter pointVolume = " + this.pointVolume);
    console.log ("Rigid Letter pointMass = " + this.pointMass);
    console.log ("Rigid Letter point density = " + this.pointMass / this.pointVolume);
    console.log ("Letter end.\n\nend");*/
}


RigidLetter.prototype = Object.create (RigidBox.prototype);
RigidLetter.prototype.constructor = RigidLetter;

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

//function RigidBox (mass, size, location, velocity, acceleration);
//function RigidLetter (letter, font, mass, size, location, velocity, acceleration);
function RigidImage (image, mass, size, location, velocity, acceleration)
{
    this.image = image;
    //RigidBox.call (this, mass, size, location, velocity, acceleration);
    
    //this.points = [];
    //this.rotatedPoints = [];
    
    //1. Find points
    var canvas = document.createElement ("canvas");
    canvas.width = 100;
    canvas.height = 100;
    var context = canvas.getContext("2d");
    
    //1.1. Draw image
    if (size.x > size.y)
    {
        context.drawImage (image, 0, 0, 100, size.y * 100 / size.x);
    }
    else if (size.x > size.y)
    {
        context.drawImage (image, 0, 0, size.x * 100 / size.y, 100);
    }
    else
    {
        context.drawImage (image, 0, 0, 100, 100);
    }
    
    //1.2. Find points
    var gridSize = 20;
    var realPoints = [];
    var centerOfMass = new Vector();
    var minX = 0, maxX = 0, minY = 0, maxY = 0;
    for (var i=gridSize/2; i<100; i+=gridSize)
    {
        for (var j=gridSize/2; j<100; j+=gridSize)
        {
            if (context.getImageData(i,j,1,1).data[3] > 0)
            {
                //var v = new Vector (i, j);
                //console.log (v);
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
    
    if (realPoints.length > 0)
    {
        centerOfMass.div (realPoints.length);
        var boundingBoxSize = new Vector (maxX - minX + gridSize/2, maxY - minY + gridSize/2); //super
        boundingBoxSize.mult ((size.x+size.y)/2 / 100);
        
        RigidBox.call (this, mass, boundingBoxSize, location, velocity, acceleration);
        
        this.points = realPoints; //Constructor calculated the 4 points for the bounding box.
        for (var i=0; i<this.points.length; i++)
        {
            this.points[i].sub (centerOfMass);
            this.points[i].mult ((size.x+size.y)/2 / 100);//Vector.div (size, 100));
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
    }
    else //This will happen if I don't have permission to get image data from the image (cross-domain access denied)
    {
        RigidBox.call (this, mass, size, location, velocity, acceleration);
        /*this.points = [];
        this.rotatedPoints = [];
        for (var i=-size.x/2; i<=size.x/2; i+=size.x/3)
        {
            for (var j=-size.y/2; j<=size.y/2; j+=size.y/3)
            {
                this.points.push (new Vector (i, j));
                this.rotatedPoints.push (new Vector (i, j));
            }
        }*/
    }
}

RigidImage.prototype = Object.create (RigidBox.prototype);
RigidImage.prototype.constructor = RigidImage;

RigidImage.prototype.display = function (context)
{
    context.save();
    context.translate (this.location.x, this.location.y);
    context.rotate (this.angle);
    
    context.drawImage (this.image, -this.size.x/2, -this.size.y/2, this.size.x, this.size.y);
    
    
    context.restore();
    
    //TODO delete, this is for debug only
    
    context.save();
    
    context.fillStyle = "#FFFF00";
    for (var i=0; i<this.points.length; i++)
    {
        context.beginPath();
        context.arc (this.location.x + this.rotatedPoints[i].x, this.location.y + this.rotatedPoints[i].y, 0.05*(this.size.x+this.size.y)/2, 0, 2*Math.PI);
        context.fill();
    }
    context.fillStyle ="#00FF00";
    context.beginPath();
    context.arc (this.location.x, this.location.y, 0.05*(this.size.x+this.size.y)/2, 0, 2*Math.PI);
    context.fill();
    
    context.restore();
}


//TODO comprovar que el valor del damping està entre 0 i 1
function Spring (particle1, particle2, length, stiffness, damping)
{
    this.particle1 = particle1;
    this.particle2 = particle2;
    this.length = length;
    this.stiffness = stiffness;
    this.damping = 1 - 0.1 * damping;
    this.color = "#000000";
}

Spring.prototype.applySpringForcesToParticle2 = function()
{
    var dist = Vector.sub (this.particle1.location, this.particle2.location);
    var normDist = Vector.getNormalizedFrom (dist);
    normDist.mult (this.length);
    
    dist.sub (normDist);
    var springForce = Vector.mult (dist, this.stiffness);
    
    this.particle2.applyForce (springForce);
    this.particle2.velocity.mult (this.damping);
};

Spring.prototype.applySpringForcesToBothParticles = function()
{
    var dist = Vector.sub (this.particle1.location, this.particle2.location);
    var normDist = Vector.getNormalizedFrom (dist);
    normDist.mult (this.length);
    dist.sub (normDist);
    
    var springForce = Vector.mult (dist, this.stiffness);
    
    this.particle2.applyForce (Vector.mult (springForce, 0.5));
    this.particle2.velocity.mult (this.damping);
    
    this.particle1.applyForce (Vector.mult (springForce, -0.5));
    this.particle1.velocity.mult (this.damping);
    
    
};

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

//TODO comprovar que el valor del damping està entre 0 i 1
function SimpleSpring (origin, particle, length, stiffness, damping)
{
    this.origin = origin;
    this.particle = particle;
    this.length = length;
    this.stiffness = stiffness;
    this.damping = 1 - 0.1 * damping;
    this.color = "#000000";
}

SimpleSpring.prototype.applySpringForcesToParticle2 = function()
{
    var dist = Vector.sub (this.origin, this.particle.location);
    var normDist = Vector.getNormalizedFrom (dist);
    normDist.mult (this.length);
    
    dist.sub (normDist);
    var springForce = Vector.mult (dist, this.stiffness);
    
    this.particle.applyForce (springForce);
    this.particle.velocity.mult (this.damping);
};

SimpleSpring.prototype.display = function (context)
{
    context.save();
    context.strokeStyle = this.color;
    context.beginPath();
    context.moveTo (this.origin.x, this.origin.y);
    context.lineTo (this.particle.location.x, this.particle.location.y);
    context.closePath();
    context.stroke();
    context.restore();
};

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

Character.prototype.display = function (context)
{
    context.save();
    
    context.font = this.size + "px " + this.font;
    context.fillStyle = this.color;
    
    context.fillText (this.character, this.offsetForDrawing.x, this.offsetForDrawing.y);
    
    context.restore();
};

Character.prototype.displayAt = function (context, location)
{
    context.save();
    
    context.font = this.size + "px " + this.font;
    context.fillStyle = this.color;
    
    context.fillText (this.character, location.x + this.offsetForDrawing.x, location.y + this.offsetForDrawing.y);
    /*
    //DELETE, this is for debug
    context.fillStyle ="#00FF00";
    context.beginPath();
    context.arc (location.x, location.y, 0.05*this.size, 0, 2*Math.PI);
    context.closePath();
    context.fill();*/
    
    context.restore();
};
