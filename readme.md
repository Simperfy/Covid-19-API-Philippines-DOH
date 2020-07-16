# Covid-19-API-Philippines-DOH (Pre-Alpha)

*Covid-19 Web API for Philippines from data collected by DOH using Node.js that updates itself regularly as soon as DOH posted new data.* (Half implemented atm.)

*This Web API is still on it's early age and is not suitable for production yet.*

Preview: [Actual Website](https://covid19-api-philippines.herokuapp.com/api/getall/100) - returns 100 covid cases from records of DOH 
<br>

## Getting Started

### Prerequisites

What things you need to install the software and how to install them

* [credentials.json](https://developers.google.com/drive/api/v3/quickstart/go) - Google Drive API
* [Node.js](https://nodejs.org/en/)

### Installing

Select [Enable Drive API](https://developers.google.com/drive/api/v3/quickstart/go) and download the credentials.json and place the credentials.json at the root folder of the project.

Make sure you have [Node.js](https://nodejs.org) & run the command

```
npm install
```

Run the project

```
node index.js
```

Then open your web browser and go to the following link

```
http://localhost:3000/api/downloadLatestFiles
```

The output should be:

```
Downloaded Latest Files - [file name.csv]
```

Congrats now you have successfully installed the Web API
<br>

## Docs

Sample json return by the API:
```
    {
        "caseCode": "C480562",
        "age": "18.0",
        "ageGroup": "15 to 19",
        "sex": "MALE",
        "dateSpecimen": "2020-06-16",
        "dateResultRelease": "",
        "dateRepConf": "2020-06-21",
        "dateDied": "",
        "dateRecover": "",
        "removalType": "",
        "admitted": "YES",
        "regionRes": "Region XI: Davao Region",
        "provRes": "DAVAO DEL SUR",
        "cityMunRes": "DAVAO CITY",
        "cityMuniPSGC": "PH112402000",
        "healthStatus": "MILD",
        "quarantined": "",
        "dateOnset": "2020-06-16",
        "pregnanttab": "",
        "validationStatus": "Case has Lab Result, but Result Date is blank"
    }
```
These are the currently available API endpoints:
* http://localhost:3000/api/getAll/ - returns all records
* http://localhost:3000/api/getAll/100 - returns 100 records
* http://localhost:3000/api/filter/{field}/{value} - returns records that matches the filter
* http://localhost:3000/api/downloadLatestFiles - downloads latest files from DOH - Philippines

These are all the valid value for field in "http://localhost:3000/api/filter/{field}/{value}":
```
caseCode, age, ageGroup, sex, dateSpecimen, dateResultRelease, dateRepConf, dateDied, dateRecover, removalType, admitted, regionRes, provRes, cityMunRes, cityMuniPSGC, healthStatus, quarantined, dateOnset, pregnanttab, validationStatus
```

For valid value for each field in "http://localhost:3000/api/filter/{field}/{value}" please refer to the sample json above.

Example:
* API that returns all covid cases with age of 30
```
http://localhost:3000/api/filter/age/30
``` 
<br>

## About the Data
### Where does the data come from?
* The data comes from [DOH DATA DROP](https://drive.google.com/drive/folders/1UelgRGmUGNMKH1Q3nzqTj57V41bjmnxg)
* The data was not tampered and was directly converted to json from csv without heavy modification.

### How often does the data get updated?
* As of the current version, the data needs to be manually updated using the endpoint "/api/downloadLatestFiles"

<br>

## Built With
* [Node.js](https://nodejs.org) - open source server environment.
* [ExpressJS](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Google Drive API v3](https://developers.google.com/drive/api/v3/about-sdk) - Used to download files from DOH

<br>

## Authors

* **Simperfy(The Doggo)** - [Github](https://github.com/Simperfy)

<br>

## Acknowledgments

* [DOH - Philippines](https://www.doh.gov.ph/) - Data Source