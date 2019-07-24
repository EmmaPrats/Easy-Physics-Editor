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
