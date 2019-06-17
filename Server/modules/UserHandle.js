const express = require("express");
const Usersrouter = express();
var DButilsAzure = require('../DButils');
var bodyParser = require('body-parser').json();
const jwt = require('jsonwebtoken');
var router = express.Router();


//login
Usersrouter.post("/login", bodyParser, (req, res) => {
    let username = req.body.Username;
    let user = { Username: username };
    let pw = req.body.Password;
    DButilsAzure.execQuery(`SELECT * FROM dbo.Users WHERE Username= '` + username + `'`)
        .then(function (result) {
            if (result != "") {
                if (result[0].Password == pw) {
                    var token = jwt.sign({ data: user }, 'secret',
                        { expiresIn: "1d" });
                    res.json({
                        success: true,
                        token: token
                    });
                }
                else {//incorrect password
                    res.status(400).json({ Error: 'Wrong password' });
                }
            }
            else {//if user dowsn't exist
                res.status(400).json({ Error: 'No such user' });
            }
        })
        .catch(function (err) {
            console.log(err)
            res.status(400).json(err);
        })
});

//register
Usersrouter.post('/register', bodyParser, function (req, res, next) {
    let username = req.body.Username;
    let password = req.body.Password;
    if (username.length < 3 || username.length > 8  || !(username.match(/^[a-zA-Z]*$/))) {
        res.status(400).json({ Error: 'Username is not valid' });
    }
    else if (password.length < 5 || password.length > 10 || !(password.match(/\d/) && (password.match(/[a-zA-Z]/)))) {
        res.status(400).json({ Error: 'Password is not valid' });
    }
    else {
        DButilsAzure.execQuery(`SELECT * FROM dbo.Users WHERE Username= '` + username + `'`)
            .then(function (result) {
                if (result != "") {
                    res.status(400).json({ Error: 'Username already taken' });
                } else
                    next();
            })
    }
})

Usersrouter.post('/register', bodyParser, function (req, res, next) {
    let fName = req.body.FirstName;
    let lName = req.body.LastName;
    let city = req.body.City;
    let country = req.body.Country;
    let email = req.body.Email;
    let interests = req.body.InterestSubjects;
    let verAns1 = req.body.VerificationAnswer1;
    let verAns2 = req.body.VerificationAnswer2;
    let Q1 = req.body.q1;
    let Q2 = req.body.q2;
    if (fName == "" || lName == "" || city == "" || country == "" || email == "" || interests.length == 0 || verAns1 == "" ||
        verAns2 == "" || Q1 == "" || Q2 == "") {
        res.status(400).json({ Error: 'One of the fields is not full' });
    }
    else if (interests.length > 2) {
        res.status(400).json({ Error: 'Max 2 interests' });
    }
    else {
        DButilsAzure.execQuery(`SELECT * FROM dbo.Countries 
        WHERE Country = '` + country + `'`)
            .then(function (result) {
                if (result == "")
                    res.status(400).json({ Error: 'Invalid country' });
                else
                    next();
            })
            .catch(function (err) {
                res.status(400).json(err);
            })

    }
})

Usersrouter.post('/register', bodyParser, function (req, res, next) {
    let Q1 = req.body.q1;
    let Q2 = req.body.q2;
    DButilsAzure.execQuery(`SELECT * FROM Questions WHERE Question = '` + Q1 + `' OR Question = '` + Q2 + `'`)
        .then(function (result) {
            if (result.length == 2) {
                next();
            }
            else {
                res.status(400).json({ Error: 'One of the questions is not in present in the DB' });
            }
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
})

//"InterestSubjects":["sport","food"],
Usersrouter.post('/register', bodyParser, function (req, res, next) {
    let username = req.body.Username;
    let interests = req.body.InterestSubjects;
        DButilsAzure.execQuery(`SELECT * FROM dbo.Categories
        WHERE Category ='` + interests[0] + `' OR Category ='` + interests[1] + `'`)
            .then(function (result) {
                if (result.length != 2) {
                    res.status(400).json({ Error: 'One of the interests is not present in the DB' });
                }
                else{
                    next();
                }
            })
            .catch(function (err) {
                res.status(400).json(err);
            })
})

Usersrouter.post('/register', bodyParser, function (req, res, next) {
    let username = req.body.Username;
    let interests = req.body.InterestSubjects;
    interests.forEach(interest => {
        DButilsAzure.execQuery(`INSERT INTO dbo.UserInterests ("Username","Interest")
                    VALUES ('`+ username + `','` + interest + `')`)
            .then(function (result) {
            })
            .catch(function (err) {
                res.status(400).json(err);
            })
    })
    next();
})

Usersrouter.post('/register', bodyParser, function (req, res, next) {
    let fName = req.body.FirstName;
    let lName = req.body.LastName;
    let city = req.body.City;
    let country = req.body.Country;
    let email = req.body.Email;
    let username = req.body.Username;
    let pw = req.body.Password;
    DButilsAzure.execQuery(`INSERT INTO dbo.Users ("Username","Password","FirstName","LastName","City","Country","Email")
        VALUES ('`+ username + `','` + pw + `','` + fName + `','` + lName + `','` + city + `','` + country + `','` + email + `')`)
        .then(function (result) {
            next();
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
})

Usersrouter.post('/register', bodyParser, function (req, res) {
    let username = req.body.Username;
    let Q1 = req.body.q1;
    let Q2 = req.body.q2;
    let verAns1 = req.body.VerificationAnswer1;
    let verAns2 = req.body.VerificationAnswer2;
    DButilsAzure.execQuery(`INSERT INTO dbo.UserQuestionAnswer ("Username","Question1","VerificationAnswer1","Question2","VerificationAnswer2")
                    VALUES ('`+ username + `','` + Q1 + `','` + verAns1 + `','` + Q2 + `','` + verAns2 + `')`)
        .then(function (result) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
})

//get all questions
Usersrouter.get('/GetQuestions', bodyParser, function (req, res, next) {
    DButilsAzure.execQuery(`SELECT * FROM dbo.Questions`)
        .then(function (result) {
            if (result != "") {
                res.json({ "Questions": result })
            }
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
});

//get user questions
Usersrouter.get('/GetUserQuestions', bodyParser, function (req, res, next) {
    let username = req.query.Username;
    DButilsAzure.execQuery(`SELECT Question1,Question2 FROM dbo.UserQuestionAnswer WHERE Username= '` + username + `'`)
        .then(function (result) {
            if (result != "") {
                res.json({ "Questions": result })
            }
            else {
                res.status(400).json({ Error: "User not found" })

            }
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
});

//RetrievePassword
Usersrouter.post('/RetrievePassword', bodyParser, function (req, res, next) {
    let username = req.body.Username;
    let verA1 = req.body.VerificationAnswer1;
    let verA2 = req.body.VerificationAnswer2;
    DButilsAzure.execQuery(`SELECT * FROM dbo.UserQuestionAnswer WHERE Username= '` + username + `'`)
        .then(function (result) {
            if (result != "") {
                if (result[0].VerificationAnswer1 == verA1 && result[0].VerificationAnswer2 == verA2) {
                    DButilsAzure.execQuery(`SELECT * FROM dbo.Users WHERE Username= '` + username + `'`)
                        .then(function (result) {
                            res.json({ "Password": result[0].Password })
                        })
                }
                else {//incorrect password
                    res.status(400).json({ Error: 'Wrong verification answers' });
                }
            }
            else {//if user dowsn't exist
                res.status(400).json({ Error: 'Error. try again' });
            }
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
});

//getTwoRecommendInterestPoints
Usersrouter.post('/getTwoRecommendInterestPoints', bodyParser, ensureToken, function (req, res, next) {
    jwt.verify(req.token, 'secret', function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            //if valid token
            var decoded = jwt.decode(req.token, { complete: true });
            //get username
            let username = decoded.payload.data.Username;
            let response = [];
            //run query to get interest points of username
            DButilsAzure.execQuery(`SELECT Interest FROM dbo.UserInterests WHERE Username= '` + username + `'`)
                .then(function (result) {
                    if (result != "") {
                        DButilsAzure.execQuery(`select top 1 PointName,ImageObj,PointCategory,PointRating,Description,Viewers
                            from PointOfInterest
                            where PointCategory ='`+ result[0]['Interest'] + `' 
                            ORDER BY PointRating DESC`)
                            .then(function (result2) {
                                if (result2.length != 0)
                                    response.push(result2[0]);
                                req.response = response;
                                next();
                            })
                            .catch(function (err) {
                                res.status(400).json(err);
                            })
                    } else {
                        res.status(400).json({ Error: 'Error. try again' });
                    }
                })
                .catch(function (err) {
                    res.status(400).json(err);
                })
        }
    });
});

//getTwoRecommendInterestPoints
Usersrouter.post('/getTwoRecommendInterestPoints', bodyParser, ensureToken, function (req, res) {
    //if valid token
    var decoded = jwt.decode(req.token, { complete: true });
    //get username
    let username = decoded.payload.data.Username;
    let response = req.response;
    //run query to get interest points of username
    DButilsAzure.execQuery(`SELECT Interest FROM dbo.UserInterests WHERE Username= '` + username + `'`)
        .then(function (result) {
            if (result != "") {
                DButilsAzure.execQuery(`select top 1 PointName,ImageObj,PointCategory,PointRating,Description,Viewers
                            from PointOfInterest
                            where PointCategory ='`+ result[1]['Interest'] + `' 
                            ORDER BY PointRating DESC`)
                    .then(function (result2) {
                        if (result2.length != 0) {
                            response.push(result2[0]);
                        }
                        res.send({ "PointsOfInterest": response });
                    })
                    .catch(function (err) {
                        res.status(400).json(err);
                    })
            } else {
                res.status(400).json({ Error: 'Error. try again' });
            }
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
});

//getTwoLastInterestPoints
Usersrouter.post('/getTwoLastInterestPoints', bodyParser, ensureToken, function (req, res, next) {
    jwt.verify(req.token, 'secret', function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            //if valid token
            var decoded = jwt.decode(req.token, { complete: true });
            //get username
            let username = decoded.payload.data.Username;
            //run query to get interest points of username
            DButilsAzure.execQuery(`SELECT top 2 PointName FROM UserFavorites WHERE Username = '` + username + `' ORDER BY SavingTime desc `)
                .then(function (result) {
                    if (result != "") {
                        var UserFavorites = result;
                        if(UserFavorites.length==1)
                            UserFavorites[1] = "";
                        DButilsAzure.execQuery(`select PointName,PointCategory,PointRating,Viewers,ImageObj,Description
                            from PointOfInterest
                            where PointName ='`+ UserFavorites[0]["PointName"] + `' or PointName ='` + UserFavorites[1]["PointName"] + `'
                            ORDER BY PointRating DESC`)
                            .then(function (result2) {
                                res.send({ "PointsOfInterest": result2 });
                            })
                    } else {
                        res.send({ "PointsOfInterest": result });
                    }
                })
                .catch(function (err) {
                    res.status(400).json(err);
                })
        }
    });
});

//AddPointOfInterestToFavorite
Usersrouter.post('/AddPointOfInterestToFavorite', bodyParser, ensureToken, function (req, res, next) {
    //check for valid token
    jwt.verify(req.token, 'secret', function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            //get username
            let PointName = req.body.PointName;
            DButilsAzure.execQuery(`SELECT * FROM dbo.PointOfInterest WHERE PointName= '` + PointName + `'`)
                .then(function (result) {
                    if (result.length > 0) {
                        next();
                    }
                    else {//if category not exist
                        res.status(400).json({ Error: 'Point name does not exist' });
                    }
                })
                .catch(function (err) {
                    res.status(400).json(err);
                })
        }
    });
});

Usersrouter.post('/AddPointOfInterestToFavorite', bodyParser, ensureToken, function (req, res, next) {
    //if valid token
    var decoded = jwt.decode(req.token, { complete: true });
    let Username = decoded.payload.data.Username;
    let PointName = req.body.PointName;
    let savingTime = (new Date().getTime()) / 1000;
    //run query to get interest points of username
    DButilsAzure.execQuery(`INSERT INTO dbo.UserFavorites ("PointName","Username","SavingTime") VALUES ('` + PointName + `','` + Username + `',` + savingTime + `)`)
        .then(function (result) {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
});

//removePointOfInterestFromFavorite
Usersrouter.delete('/removePointOfInterestFromFavorite', bodyParser, ensureToken, function (req, res) {
    //check for valid token
    var x = req.token;
    jwt.verify(req.token, 'secret', function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            //if valid token
            var decoded = jwt.decode(req.token, { complete: true });
            //get username
            let Username = decoded.payload.data.Username;
            let PointName = req.query.PointName;

            //run query to get interest points of username
            DButilsAzure.execQuery(`DELETE FROM UserFavorites WHERE Username = '` + Username + `' and PointName = '` + PointName + `'`)
                .then(function (result) {
                    res.sendStatus(200);
                })
                .catch(function (err) {
                    res.status(400).json(err);
                })
        }
    });
});

//getFavoirtes
Usersrouter.post('/getFavorites', bodyParser, ensureToken, function (req, res) {
    //check for valid token
    jwt.verify(req.token, 'secret', function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            //if valid token
            var decoded = jwt.decode(req.token, { complete: true });
            //get username
            let Username = decoded.payload.data.Username;

            //run query to get interest points of username
            DButilsAzure.execQuery(`SELECT poi.PointName,poi.ImageObj,poi.PointCategory,poi.PointRating,poi.Description
            FROM PointOfInterest poi JOIN UserFavorites uf ON poi.PointName = uf.PointName
            WHERE uf.UserName = '`+ Username + `'
            ORDER BY ID ASC`)
                .then(function (result) {
                    res.send({ "FavPointsOfInterest": result });
                })
                .catch(function (err) {
                    res.status(400).json(err);
                })
        }
    });
});

//addReview - check all
Usersrouter.post('/addReview', bodyParser, ensureToken, function (req, res, next) {
    jwt.verify(req.token, 'secret', function (err, data) {
        if (err) {
            res.sendStatus(403);
        } else {
            let PointName = req.body.PointName;
            let Review = req.body.TextReview;
            if (PointName == "" || Review == "") {
                res.status(400).json({ Error: 'Not all fields are full' });
            }

            if(req.body.Rank < 1 || req.body.Rank > 5){
                res.status(400).json({ Error: 'Rank is illegal' });
            }

            DButilsAzure.execQuery(`Select * FROM dbo.PointOfInterest
            WHERE PointName = '`+ PointName + `'`)
                .then(function (result) {
                    if (result.length != 0)
                        next();
                    else
                        res.status(400).json({ Error: 'Point does not exist' });
                })
                .catch(function (err) {
                    res.status(400).json(err);
                })
        }
    });
});

//addReview - add the review to the right table
Usersrouter.post('/addReview', bodyParser, ensureToken, function (req, res, next) {
    //if valid token
    var decoded = jwt.decode(req.token, { complete: true });
    //get username
    let Username = decoded.payload.data.Username;
    let PointName = req.body.PointName;
    let Review = req.body.TextReview;
    //run query to get interest points of username
    DButilsAzure.execQuery(`INSERT INTO dbo.PointOfInterestReviews ("PointName","Username","Review","Time")
            VALUES ('`+ PointName + `','` + Username + `','` + Review + `', CURRENT_TIMESTAMP)`)
        .then(function (result) {
            req.Username = Username;
            next();
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
});


//addReview - count the amount of reviews for that poi
Usersrouter.post('/addReview', bodyParser, ensureToken, function (req, res, next) {
    let PointName = req.body.PointName;
    DButilsAzure.execQuery(`SELECT COUNT(PointName) as Amount FROM PointOfInterestReviews
    WHERE PointName ='`+ PointName + `'`)
        .then(function (result) {
            //if(result != success)
            req.ratesAmount = result[0]["Amount"];
            next();
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
});

//addReview - get old rate
Usersrouter.post('/addReview', bodyParser, ensureToken, function (req, res, next) {
    let PointName = req.body.PointName;
    DButilsAzure.execQuery(`SELECT PointRating FROM PointOfInterest
    WHERE PointName ='`+ PointName + `'`)
        .then(function (result) {
            //if(result != success)
            req.oldRating = result[0]["PointRating"];
            next();
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
});

//addReview - culc new rating and insert
Usersrouter.post('/addReview', bodyParser, ensureToken, function (req, res) {
    let PointName = req.body.PointName;//name of the point
    let oldRating = req.oldRating;//old rating 
    let ratesAmount = req.ratesAmount;//amount of ratings
    let newRating = (((oldRating * (ratesAmount - 1)) + req.body.Rank) / (ratesAmount));//new rate
    DButilsAzure.execQuery(`UPDATE PointOfInterest
    SET PointRating = `+ newRating + `
    WHERE PointName = '`+ PointName + `'`)
        .then(function (result) {
            //if(result != success)
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).json(err);
        })
});

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["x-auth-token"];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader;
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = Usersrouter;
