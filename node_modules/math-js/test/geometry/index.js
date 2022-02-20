var grape = require('grape'),
    math = require('../../');

/**
    ## Pythagorean Equation ##

    http://en.wikipedia.org/wiki/Pythagorean_theorem

        pythagoreanEquation(length of side A, length of side B)

    returns length of side C

    Real world example:

    - How far away is one point to another?

        var distanceBetween = pythagoreanEquation(point1.x - point2.x, point1.y - point2.y);

*/

grape('pythagoreanEquation', function(t){
    t.plan(2);

    t.equal(math.geometry.pythagoreanEquation(3, 4), 5);
    t.equal(math.geometry.pythagoreanEquation(-3, -4), 5);
});