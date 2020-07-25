# Covid-19-API-Philippines-DOH (Alpha)

![License](https://img.shields.io/github/license/simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Last Commit](https://img.shields.io/github/last-commit/simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Stars](https://img.shields.io/github/stars/simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Forks](https://img.shields.io/github/forks/Simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Tweet](https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2FSimperfy%2FCovid-19-API-Philippines-DOH)

#### Covid-19 Web API for Philippines from data collected by DOH using Node.js that updates itself every 24 hours.
> The Data is fetched from DOH DATA DROP by web scraping, in case of failure due to changes, the data will be fetched from 
> [DATA DROP](https://drive.google.com/drive/folders/1UelgRGmUGNMKH1Q3nzqTj57V41bjmnxg) archives instead

## Example:
[return 100 covid cases from records of DOH](https://covid19-api-philippines.herokuapp.com/api/get/100)

[return all covid cases in NCR](https://covid19-api-philippines.herokuapp.com/api/filter/regionRes/NCR)

<br>

## Getting Started

### Prerequisites
* [credentials.json](https://developers.google.com/drive/api/v3/quickstart/go) - Google Drive API
* [Node.js](https://nodejs.org/en/)
* MySQL

### Installing

Select [Enable Drive API](https://developers.google.com/drive/api/v3/quickstart/go) and download the `credentials.json` and place the json file at the root folder of the project.

1. Make sure you have [Node.js](https://nodejs.org) & run the command

```
npm install
```

2. Run the project

```
node .
```

3. Get token.json (must have `credentials.json`)

4. create and configure ".env" file (see `env.example`)

5. visit `http://localhost:3000/` to initialize token.json (must have a properly configured google account)

<br>

## DOCS

Sample json return by the API:
```JSON
[
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
]
```
These are the currently available API endpoints:
* api/get/ - returns all records
* api/get/100 - returns 100 records
* api/filter/{field}/{value} - returns records that matches the filter
* api/updateDatabase - downloads latest files from DOH - Philippines

These are all the valid value for field in "api/filter/{field}/{value}":
```
caseCode, age, ageGroup, sex, dateSpecimen, dateResultRelease, dateRepConf, dateDied, dateRecover, removalType, admitted, regionRes, provRes, cityMunRes, cityMuniPSGC, healthStatus, quarantined, dateOnset, pregnanttab, validationStatus
```

For valid value for each field in "api/filter/{field}/{value}" please refer to the sample json above.

Example:
* returns all covid cases with age of 30
```http
GET api/filter/age/30
``` 
* returns all covid cases in NCR
```http
GET api/filter/regionRes/NCR
```
* returns all covid cases between 15 to 19 years old
```http
GET api/filter/ageGroup/15 to 19
```

<br>

*If you get the error: `"The API returned an error: Error: Daily Limit for Unauthenticated Use Exceeded. Continued use requires signup."` just visit the base url to get a new one.* 

<br>

## About the Data
### Where does the data come from?
* The data comes from [DOH DATA DROP](https://drive.google.com/drive/folders/1UelgRGmUGNMKH1Q3nzqTj57V41bjmnxg)
* The data wasn't tampered and was directly converted to json from csv without heavy modification.

<br>

## Built With
* [Node.js](https://nodejs.org) - open source server environment.
* [ExpressJS](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Google Drive API v3](https://developers.google.com/drive/api/v3/about-sdk) - Used to download files from DOH
* [Amazon Web Services](https://aws.amazon.com/) - Provides MySQL in Deployment

<br>

## Authors

* **Simperfy(The Doggo)** - [Github](https://github.com/Simperfy)

<br>

## Acknowledgments

* [DOH - Philippines](https://www.doh.gov.ph/) - Data Source
