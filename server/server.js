/*
https://www.youtube.com/watch?v=DX15WbKidXY
https://www.youtube.com/watch?v=MIByvzueqHQ&t=615s
============================
export PATH=$PATH:/usr/local/mongodb/bin
mongo
============================
Open terminal
run => mongod
run => npm run dev
open => http://localhost:3002/category

open one more new terminal
run => mongo
-------------come like below-----------
---
>
-------------come like above-----------
run => show dbs
run => use <db name> => use ExpenseDb //if new then it will automatically created
run => show collections
run => db.<collection name>.find() => db.expense.find()
*/


const express = require('express');
const app = express();
const dbConst = require('./const/const');

const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient ;

const validation = require('./exp_util/validation');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-Type, Accept");
    //res.headers("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const categories = [
    'Medical', 'Transport', 'Travel', 'Gift', 'Salary',
    'Food'
];

const users = {
    "1001": {name: 'Jay', contact: '+919838984938', location: 'Pune'},
    "1002": {name: 'Ajay', contact: '+919638984938', location: 'Mumbai'},
}

app.get('/', (req, res) => {
    res.send("<h1>Home Page</h1>");
});

app.use('/aboutus', express.static('aboutus'));

// app.get('/aboutus', (req, res) => {
//     res.send("<h1>About Us</h1>");
// });

// app.get('/contactus', (req, res) => {
//     res.send("<h1>Contact Us</h1>");
// });

app.use('/contactus', express.static('contactus'));

app.get('/category', (req, res) => {
    mongoClient.connect(dbConst.mongoUrl, { useUnifiedTopology: true }, (err, client) => {
        if(err) {
            // console.log("Db conn err: " + err.message);
            res.json({status: false, msg: 'DB cnn err'});
        } else {
            // console.log("Db connected ");
            const db = client.db(dbConst.dbName);
            db.collection("category").find({}, {projection: { _id: 0}}).toArray(
                (err, result) => {
                    if(err) {
                        res.json({status: false, msg: 'Data Err'});
                    } else {
                        const len = result.length;
                        const data = [];
                        for(let i=0; i<len; i++) {
                            data.push(result[i].category)
                        }
                        res.json({status: true, msg: 'Success', 
                         data: data});
                    }
                }
            )
        }
    });

    // if(req.query.offset && req.query.limit 
    //     && req.query.offset >=0 && req.query.limit >0 ) {
    //         let offset = parseInt(req.query.offset);
    //         let limit = parseInt(req.query.limit);
    //         res.status(200).json(categories.slice(offset, limit + offset) );
    //     } else {
    //         res.status(200).json(categories);
    //     }
});

app.post('/category', (req, res) => {

    // req. body , undefined
    console.log(JSON.stringify(req.body));
    let response = {
        status: false,
        msg: 'Not posted'
    }
    if( req.body && req.body.category){
        categories.push(req.body.category);
        response.status = true;
        response.msg = req.body.category + " posted successfully";
        res.status(201);
    }
    res.json(response);
});

function getNextId() {
    return id =1;
    // logic to to get the latest id from expense collection
    // id = latestId;
    id += 1;
    return id;
}
/* app.post('/expense/:{}', (req, res) => {
    const doc = {};
    doc.category = req.body.category;
    // doc.id = getNextId();
    doc.title = req.body.title;
    doc.amount = req.body.amount;
    doc.exp_date = req.body.exp_date;
    mongoClient.connect(dbConst.mongoUrl, { useUnifiedTopology: true }, (err, client) => {
        if(err) {
            res.json({status: false, msg: 'DB cnn err'});
        } else {
            const db = client.db(dbConst.dbName);
            db.collection("expense").remove(doc, 
                (err, result) => {
                    if(err) {
                        res.json({status: false, msg: 'Remove Err'});
                    } else {
                        res.status(201).json({status: true, msg: 'Remove Success'});
                    }
                }
            )
        });
}) */

app.post('/expense', (req, res) => {
    const doc = {};
    doc.category = req.body.category;
    // doc.id = getNextId();
    doc.title = req.body.title;
    doc.amount = req.body.amount;
    doc.exp_date = req.body.exp_date;
    doc.id = req.body.id;
    const isValid = validation.validateExpense(doc);
    if(isValid.status === false) {
        res.json({status: false, msg: isValid.msg})
    } else {
        mongoClient.connect(dbConst.mongoUrl, { useUnifiedTopology: true }, (err, client) => {
            if(err) {
                res.json({status: false, msg: 'DB cnn err'});
            } else {
                const db = client.db(dbConst.dbName);
                
                db.collection("expense").insertOne(doc, 
                    (err, result) => {
                        if(err) {
                            res.json({status: false, msg: 'Insert Err'});
                        } else {
                            res.status(201).json({status: true, msg: 'Posted Success'});
                        }
                    }
                )
            }
        });
    }
});

app.get('/expense', (req, res) => {
    mongoClient.connect(dbConst.mongoUrl, { useUnifiedTopology: true }, (err, client) => {
        if(err) {
            res.json({status: false, msg: 'DB cnn err'});
        } else {
            const db = client.db(dbConst.dbName);
            db.collection("expense").find({}).toArray(
                (err, result) => {
                    if(err) {
                        res.json({status: false, msg: 'Data Err'});
                    } else {
                        res.json({status: true, msg: 'Success', 
                         data: result});
                    }
                }
            )
        }
    });
}); 
app.delete('/expense', (req, res) => {
    const doc = {};
    doc.id = parseInt(req.body.id);
    console.log(doc.id);
    const isValid = validation.validateExpense(doc);
    /* if(isValid.status === false) {
        res.json({status: false, msg: isValid.msg})
    } else { */
        mongoClient.connect(dbConst.mongoUrl, { useUnifiedTopology: true }, (err, client) => {
            if(err) {
                res.json({status: false, msg: 'DB cnn err'});
            } else {
                const db = client.db(dbConst.dbName);
                
                console.log(typeof doc.id);
                db.collection("expense").deleteOne(doc,
                    (err, result) => {
                        if(err) {
                            res.json({status: false, msg: 'Insert Err'});
                        } else {
                            res.status(201).json({status: true, msg: 'Posted Success'});
                        }
                    }
                )
            }
        });
    //}
});
app.get('/users/:userid', (req, res) => {
    if( req.params.userid && users[req.params.userid]) {
        let response = {
            status: true,
            data: users[req.params.userid]
        }
        res.status(200).json(response);
    } else {
        res.status(404).json({status: false, msg: 'User not available'});
    }
});


app.listen(3002, () => {
    console.log("Expense APIs on 3002");
});