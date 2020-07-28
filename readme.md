# Covid-19-API-Philippines-DOH (Alpha)

![License](https://img.shields.io/github/license/simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Last Commit](https://img.shields.io/github/last-commit/simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Stars](https://img.shields.io/github/stars/simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Forks](https://img.shields.io/github/forks/Simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Tweet](https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2FSimperfy%2FCovid-19-API-Philippines-DOH)

#### Covid-19 Web API for Philippines from data collected by DOH using Node.js that updates itself every 24 hours.
> Unlike any other API, this Web API doesn't use web scraping to fetch data from DOH website instead it collects the data from the csv file from DOH Google Drive.
> This means that even if DOH website changes this API will be able to maintain itself.

### Example:
[Summary of covid cases](https://covid19-api-philippines.herokuapp.com/api/summary)

[Return 100 covid cases from records of DOH](https://covid19-api-philippines.herokuapp.com/api/get/100)

[Return all covid cases in NCR](https://covid19-api-philippines.herokuapp.com/api/filter/region_res/NCR)

[Return all covid cases with age of 18 yrs. old](https://covid19-api-philippines.herokuapp.com/api/filter/age/18)

<br>

## Getting Started

### Prerequisites
* [configured service account](https://developers.google.com/identity/protocols/oauth2/service-account)
* [Node.js](https://nodejs.org/en/)
* MySQL

### 🔨 Installation

1. Make sure you have [Node.js](https://nodejs.org) & run the command

```
$ npm install
```

2. Create a [Service Account](https://developers.google.com/identity/protocols/oauth2/service-account) and download the key.

3. copy .env.example to .env and paste the service key and database credentials respectively

- (Optional import .sql files inside the folder `./src/Database/sql`)

4. Run the project in development.

```
$ npm run dev
```

<br>

## 📌 Endpoints
These are the currently available API endpoints:

return all records
```http
GET api/get/
```
return 100 records
```http
GET api/get/100
```
return records that matches the filter
```http
GET api/filter/{field}/{value}
```

<br>

These are all the valid value for field in "api/filter/{field}/{value}":
```
case_code, age, age_group, sex, date_specimen, date_result_release, date_rep_conf, date_died, date_recover, removal_type, admitted, region_res, prov_res, city_mun_res, city_muni_psgc, health_status, quarantined, date_onset, pregnant_tab, validation_status
```

For valid value for each field in "api/filter/{field}/{value}" please refer to the sample json above.

Example:
* returns summary covid-19 cases
```http
GET api/summary
```
* returns all covid-19 cases with age of 30
```http
GET api/filter/age/30
``` 
* returns all covid-19 cases in NCR
```http
GET api/filter/regionRes/NCR
```
* returns all covid-19 cases between 15 to 19 years old
```http
GET api/filter/ageGroup/15-19
```

<br>

*If you get the error: `"The API returned an error: Error: Daily Limit for Unauthenticated Use Exceeded. Continued use requires signup."` just visit the base url to get a new one.* 

<br>

Sample json return by the API:
```JSON
{
    "data": [
        {
            "case_code": "C101356",
            "age": 55,
            "age_group": "55-59",
            "sex": "female",
            "date_specimen": "2020-07-13",
            "date_result_release": "2020-07-15",
            "date_rep_conf": "2020-07-19",
            "date_died": "",
            "date_recover": "",
            "removal_type": "",
            "admitted": "no",
            "region_res": "NCR",
            "prov_res": "ncr",
            "city_mun_res": "city of malabon",
            "city_muni_psgc": "PH137502000",
            "health_status": "mild",
            "quarantined": "no",
            "date_onset": "",
            "pregnant_tab": "no",
            "validation_status": ""
        },
        {...}
    ]
}
```

<br>

## 📄 About the Data
### Where does the data come from?
* The data comes from [DOH DATA DROP](https://drive.google.com/drive/folders/1UelgRGmUGNMKH1Q3nzqTj57V41bjmnxg)
* The data wasn't tampered and was directly converted to json from csv without heavy modification.

<br>

## 🔧 Built With
* [Node.js](https://nodejs.org) - open source server environment.
* [ExpressJS](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Google Drive API v3](https://developers.google.com/drive/api/v3/about-sdk) - Used to download files from DOH
* [Amazon Web Services](https://aws.amazon.com/) - Provides MySQL in Deployment

<br>

## Authors

* 🐶 **Simperfy(The Doggo)** - [Github](https://github.com/Simperfy)

<br>

## Acknowledgments

* 💗 [DOH - Philippines](https://www.doh.gov.ph/) - Data Source
