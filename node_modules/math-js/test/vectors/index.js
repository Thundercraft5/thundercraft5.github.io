/**
    Vector tests
*/

var grape = require('grape'),
    math = require('../../'),
    closeTo = require('../closeTo');

grape('Vector component deconstruction', function(t){
    t.plan(2);

    var thirtyDegrees = math.constants.pi / 6;
    var actual = math.vectors.toComponents(2,  thirtyDegrees);

    closeTo(t, actual.x, Math.sqrt(3));
    closeTo(t, actual.y, 1.0);
});

grape('Vector construction from components', function(t){
    t.plan(2);

    var thirtyDegrees = math.constants.pi / 6;

    var actual = math.vectors.fromComponents(Math.sqrt(3), 1.0);

    closeTo(t, actual.magnitude, 2);
    closeTo(t, actual.direction, thirtyDegrees);
});


grape('Vector addition', function(t){
    t.plan(2);

    var degrees45 = math.constants.pi / 4,
        vectorA = math.vectors.fromComponents(10, 20),
        vectorB = math.vectors.fromComponents(20,10);

    var actual = math.vectors.add(vectorA, vectorB);

    closeTo(t, actual.magnitude, 42.426);
    closeTo(t, actual.direction, degrees45);
});


grape('Vector scaling', function(t){
    t.plan(2);

    var degrees30= math.constants.pi / 6,
        vectorA = math.vectors.fromComponents(Math.sqrt(3), 1);

    var actual = math.vectors.scale(vectorA, 15);

    closeTo(t, actual.magnitude, 2 * 15);
    closeTo(t, actual.direction, degrees30);
});