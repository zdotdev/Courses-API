const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express();

const uri = 'mongodb://localhost:27017';
const port = 3000;
const dbName = 'courses';

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

function sortData (){
MongoClient.connect(uri)
    .then((client) => {
        const db = client.db(dbName);
        const collection = db.collection('courses');
        
        collection.aggregate([
            { $unwind: "$1st Year" },
            { $sort: { "1st Year.description": 1 } },
            { $group: {
                _id: "$_id",
                "1st Year": { $push: "$1st Year" },
                "2nd Year": { $first: "$2nd Year" },
                "3rd Year": { $first: "$3rd Year" },
                "4th Year": { $first: "$4th Year" }
            }},
            { $unwind: "$2nd Year" },
            { $sort: { "2nd Year.description": 1 } },
            { $group: {
                _id: "$_id",
                "1st Year": { $first: "$1st Year" },
                "2nd Year": { $push: "$2nd Year" },
                "3rd Year": { $first: "$3rd Year" },
                "4th Year": { $first: "$4th Year" }
            }},
            { $unwind: "$3rd Year" },
            { $sort: { "3rd Year.description": 1 } },
            { $group: {
                _id: "$_id",
                "1st Year": { $first: "$1st Year" },
                "2nd Year": { $first: "$2nd Year" },
                "3rd Year": { $push: "$3rd Year" },
                "4th Year": { $first: "$4th Year" }
            }},
            { $unwind: "$4th Year" },
            { $sort: { "4th Year.description": 1 } },
            { $group: {
                _id: "$_id",
                "1st Year": { $first: "$1st Year" },
                "2nd Year": { $first: "$2nd Year" },
                "3rd Year": { $first: "$3rd Year" },
                "4th Year": { $push: "$4th Year" }
            }}
        ]).toArray()
            .then((result) => {
                app.get("/api/courses", (req, res) => {
                    res.json(result);
                });
            })
            .catch((err) => {
                console.error('Error occurred while fetching and sorting data:', err);
            });
    })
    .catch((err) => {
        console.error('Error occurred while connecting to the database:', err);
    });
}
sortData()

function getSpecializations (){
    MongoClient.connect(uri)
        .then((client) => {
            const db = client.db(dbName);
            const collection = db.collection('courses');

            const myProjection = {
                "_id": 0, 
                "1st Year.description": 1,
                "1st Year.tags": 1,
                "2nd Year.description": 1,
                "2nd Year.tags": 1,
                "3rd Year.description": 1,
                "3rd Year.tags": 1,
                "4th Year.description": 1,
                "4th Year.tags": 1
            };

            collection.find({}).project(myProjection).toArray()
                .then((result) => {
                    app.get("/api/specializations", (req, res) => {
                        res.json(result);
                    });
                })
                .catch((err) => {
                    console.error('Error occurred while fetching and sorting data:', err);
                });
        })
        .catch((err) => {
            console.error('Error occurred while connecting to the database:', err);
        });
}
getSpecializations();

function getCurriculums (){
    MongoClient.connect(uri)
        .then((client) => {
            const db = client.db(dbName);
            const collection = db.collection('courses');

            // Define your projection object
            const myProjection = {
                "_id": 0, // Exclude the _id field
                "1st Year.description": 1,
                "2nd Year.description": 1,
                "3rd Year.description": 1,
                "4th Year.description": 1,
            };

            collection.find({}).project(myProjection).toArray()
                .then((result) => {
                    app.get("/api/curriculums", (req, res) => {
                        res.json(result);
                    });
                })
                .catch((err) => {
                    console.error('Error occurred while fetching and sorting data:', err);
                });
        })
        .catch((err) => {
            console.error('Error occurred while connecting to the database:', err);
        });
}
getCurriculums();