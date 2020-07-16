require('dotenv').config();
const googleDriveApi = require('./googleDriveApiClient');
const GoogleDriveApi = googleDriveApi.GoogleDriveApi;

let GDriveApi = new GoogleDriveApi();

GDriveApi.getAuth();
// @TODO Move this function inside GoogleDriveAPI
async function downloadLatestFiles() {
    await GDriveApi.getAuth();
    // GDriveApi.listFiles();
    // let data = await GDriveApi.searchFiles('name contains \'DOH COVID Data Drop_ 2020\' and name contains \'Case Information\'');
    let latestFolderObject = await GDriveApi.getLatestFolderContentsObject();
    let latestFolderID = latestFolderObject.id;
    let latestFolderName = latestFolderObject.name;
    await GDriveApi.downloadFile(latestFolderID, 'Data.csv');
    return latestFolderName;
}

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const csvDatabase = require('./csvDatabase')
const CSVDatabase = csvDatabase.CSVDatabase

let csvD = new CSVDatabase()

let router = express.Router()

router.get('/downloadLatestFiles', async (req, res) => {
    downloadLatestFiles().then((data) => {
        res.send("Downloaded Latest Files - " + data);   
    }).catch((err) => {
        res.send("Error Downloading Latest Files");
    })
})

router.get('/filter/:field/:value', async (req, res) => {
    let field = req.params.field.trim()
    let value = req.params.value.trim()

    if (field == 'age')
        value = parseInt(value);
        
    res.json(await csvD.filter(field, value))
})

router.get('/getAll/:count?', async (req, res) => {
    res.json(await csvD.all(req.params.count))
})

app.use('/api', router); // Add prefix "/api" to routes above

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Started Server at http://localhost:${port}`))