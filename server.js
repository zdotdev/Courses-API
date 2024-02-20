const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express();

const uri = 'mongodb://localhost:27017';
const port = 3000;
const dbName = 'courses';

app.use(cors());
app.use(express.json());

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
                app.get("/", (req, res) => {
                    res.json(result);
                });

                app.listen(port, () => {
                    console.log(`Server is listening on port ${port}`);
                });
            })
            .catch((err) => {
                console.error('Error occurred while fetching and sorting data:', err);
            });
    })
    .catch((err) => {
        console.error('Error occurred while connecting to the database:', err);
    });
