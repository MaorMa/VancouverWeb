const express = require("express");
const POIrouter = express();
var DButilsAzure = require('../DButils');
var bodyParser = require('body-parser').json();


//getExplorePoints - TODO
POIrouter.get('/getExplorePoints', bodyParser, function (req, res, next) {
    DButilsAzure.execQuery(`SELECT * FROM dbo.PointOfInterest WHERE PointRating >= 3`)
        .then(function (result) {
            if (result != "") {
                let numOfRows = result.length;
                var toReturn = [];
                let i = 0;
                while (toReturn.length != Math.min(numOfRows, 3)) {
                    let number = Math.floor(Math.random() * numOfRows);
                    let current = result[number];
                    if (!(toReturn.indexOf(current) > -1)) {
                        toReturn[i] = current;
                        i++;
                    }
                }
                res.status(200).json({ 'PointsOfInterest': toReturn });
            }
            else {
                res.status(400).json({ Error: 'There are no results' });
            }
        })
        .catch(function (err) {
            console.log(err)
            res.status(400).json(err);
        })
});

//getCategories
POIrouter.get('/getCategories', function (req, res) {
    DButilsAzure.execQuery('SELECT * FROM dbo.Categories')
        .then(function (result) {
            categoryList = [];
            result.forEach(category => {
                categoryList.push(category['Category']);
            })
            res.send({ "Category": categoryList });
        })
        .catch(function (err) {
            console.log(err)
            res.send(err)
        })
});

//getPointsByName
POIrouter.get('/getPointsByName', bodyParser, function (req, res, next) {
    let PointName = req.query.PointName;
    DButilsAzure.execQuery(`SELECT * FROM dbo.PointOfInterest WHERE PointName= '` + PointName + `'`)
        .then(function (result) {
            if (result != "") {
                res.status(200).json({ 'PointsOfInterest': result });
            }
            else {//if category not exist
                res.status(400).json({ Error: 'Point Name not found.please try again' });
            }
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
});

//getPointDetails
POIrouter.get('/getPointDetails', bodyParser, function (req, res, next) {
    let PointName = req.query.PointName;
    DButilsAzure.execQuery(`SELECT poi.PointName,poi.ImageObj,poi.PointCategory,poi.PointRating,poi.Description,poi.Viewers
    FROM PointOfInterest poi
    WHERE poi.PointName = '`+ PointName + `'`)
        .then(function (result) {
            if (result != "") {
                req.response = result[0];
                next();
            }
            else {//if category not exist
                res.status(400).json({ Error: 'Point Name not found.please try again' });
            }
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
});

//getPointDetails
POIrouter.get('/getPointDetails', bodyParser, function (req, res) {
    let PointName = req.query.PointName;
    DButilsAzure.execQuery(`SELECT top 2 Review,time
    FROM PointOfInterestReviews
    WHERE PointName = '`+ PointName + `'
    ORDER BY time DESC`)
        .then(function (result) {
            if (result != "") {
                let response = req.response;
                response.Reviews = [];
                result.forEach(review => {
                    response.Reviews.push({ Review: review["Review"], Time: review["time"] });///do this 
                })
                //response.Reviews=result;
                res.status(200).json({ PointDetails: response });
            }
            else {//if category not exist
                //res.status(400).json({ Error: 'Point Name not found.please try again' });
                let response = req.response;
                response.Reviews = [];
                res.status(200).json({ PointDetails: response });
            }
        })
        .catch(function (err) {
            res.status(400).json({ Error: 'Point Name not found.please try again' });
        })
});

//getPointsByCategory
POIrouter.get('/getPointsByCategory', bodyParser, function (req, res, next) {
    let Category = req.query.Category;
    DButilsAzure.execQuery(`SELECT * FROM dbo.PointOfInterest WHERE PointCategory= '` + Category + `'`)
        .then(function (result) {
            if (result != "") {
                res.status(200).json({ 'PointsOfInterest': result });
            }
            else {//if category not exist
                res.status(400).json({ Error: 'Category not found.please try again' });
            }
        })
        .catch(function (err) {
            res.status(400).json({ Error: 'Category not found.please try again' });
        })
});

POIrouter.get('/getAllPois', bodyParser, function (req, res, next) {
    DButilsAzure.execQuery(`SELECT * FROM dbo.PointOfInterest`)
        .then(function (result) {
            if (result != "") {
                res.status(200).json({ 'PointsOfInterest': result });
            }
            else {//if category not exist
                res.status(400).json({ Error: 'Error' });
            }
        })
        .catch(function (err) {
            res.status(400).json({ Error: 'Error' });
        })
});

//addViewer
POIrouter.get('/addViewer', bodyParser, function (req, res, next) {
    let PointName = req.query.PointName;
    DButilsAzure.execQuery(`SELECT * FROM dbo.PointOfInterest WHERE PointName= '` + PointName + `'`)
        .then(function (result) {
            if (result != "") {
                let newViewers = result[0]["Viewers"] + 1;
                DButilsAzure.execQuery(`UPDATE PointOfInterest
                SET Viewers = '` +newViewers+ `'
                WHERE PointName= '` + PointName + `'`)
                    .then(function (result) {
                        res.sendStatus(200);
                    })
                    .catch(function (err) {
                        res.status(400).json(err);
                    })
            }
            else {//if category not exist
                res.status(400).json({ Error: 'Point does not exist' });
            }
        })
        .catch(function (err) {
            res.status(400).json({ Error: 'Category not found.please try again' });
        })
});

module.exports = POIrouter;
