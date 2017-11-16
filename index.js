var Recommender = require('likely');

var inputMatrix = [ [ 1, 2, 3, 0, 8, 2 ],
                    [ 4, 0, 5, 6, 4, 6 ],
                    [ 7, 8, 0, 9, 7, 0 ],
                    [ 7, 8, 0, 9, 9, 7 ],
                    [ 2, 1, 3, 9, 0, 0 ]
                  ];

var rowLabels = ['fdp1', 'fdp2', 'fdp3', 'fdp4', 'fdp5'];
var colLabels = ['Red', 'Blue', 'Green', 'Purple', 'Black', 'White'];

var model = Recommender.buildModel(inputMatrix, rowLabels, colLabels);

var recommendations = model.recommendations('fdp5');

console.log(recommendations);
