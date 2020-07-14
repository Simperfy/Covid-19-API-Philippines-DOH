let googleDriveApi = require('./googleDriveApi');
let GoogleDriveApi = googleDriveApi.GoogleDriveApi;

async function run() {
    let GDriveApi = new GoogleDriveApi();
    let auth = await GDriveApi.getAuth();
    GDriveApi.listFiles();
    let data = await GDriveApi.searchFiles('name contains \'DOH COVID Data Drop_ 2020\' and name contains \'Case Information\'');
    let csvData = await GDriveApi.downloadFile(data[0].id);

    
}

run();