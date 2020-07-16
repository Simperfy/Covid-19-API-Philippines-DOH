require('dotenv').config();
const googleDriveApi = require('./googleDriveApiClient');
const GoogleDriveApi = googleDriveApi.GoogleDriveApi;
let GDriveApi = new GoogleDriveApi();

/**
 * verify token.json exists on application start
 * @param {import('express').RequestParamHandler} res 
 */

async function verifyGoogleToken(res) {
    let auth = await GDriveApi.getAuth();
    if (auth.err) {
        console.log("GETTING NEW TOKEN");
        const url = GDriveApi.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: auth.scopes,
        });
        console.log("Redirecting TO: " + url);

        res.redirect(url);
        return;
    }   
    return true;
}

// @TODO Move this function inside GoogleDriveAPI
async function downloadLatestFiles() {
    let latestFolderObject = await GDriveApi.getLatestFolderContentsObject();
    let latestFolderID = latestFolderObject.id;
    let latestFolderName = latestFolderObject.name;
    await GDriveApi.downloadFile(latestFolderID, 'Data.csv');
    return latestFolderName;
}

//SERVER VARS
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

app.get('/googleAuth', (req, res) => {
    try {
        GDriveApi.storeTokenCode(req.query.code)
        res.redirect('/verified');
    } catch (error) {
        res.send("ERROR SAVING TOKEN: " + error);
    }
});

app.get('/verified', (req, res) => res.send('Token Created! <html><a href="/">Go back to home</a><html>'))

app.get('/', async (req, res) => {
    try {
        if (await verifyGoogleToken(res) === true)
            res.send('Hello World!');  
    } catch (error) {
        res.send("ERROR Verifying Google Token");
    }
})

app.listen(port, () => console.log(`Started Server at http://localhost:${port}`))