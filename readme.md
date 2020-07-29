# Covid-19-API-Philippines-DOH (Alpha)

![License](https://img.shields.io/github/license/simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Last Commit](https://img.shields.io/github/last-commit/simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Stars](https://img.shields.io/github/stars/simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Forks](https://img.shields.io/github/forks/Simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Tweet](https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2FSimperfy%2FCovid-19-API-Philippines-DOH)

#### Covid-19 Web API for Philippines from data collected by DOH using Node.js that updates itself every 24 hours.
> A Web API doesn't use web scraping to fetch data from DOH website instead it collects the data from the csv file from DOH Google Drive.
> This means that even if DOH website changes this API will be able to maintain itself.

## 📌 Endpoints
These are the currently available API endpoints:

Fetching summary
```http
GET api/summary
```
Fetching all records
```http
GET api/get
```
Fetching {n} records
```http
GET api/get/{n}
```
Fetching records that matches the filter
```http
GET api/filter/{field}/{value}
```

<br>

These are all the valid value for `field` in "api/filter/{field}/{value}":
```
case_code, age, age_group, sex, date_specimen, date_result_release, date_rep_conf, date_died, date_recover, removal_type, admitted, region_res, prov_res, city_mun_res, city_muni_psgc, health_status, quarantined, date_onset, pregnant_tab, validation_status
```

<br>

Example:
* Fetching 100 covid-19 cases
```http
GET api/get/100
```
* Fetching all covid-19 cases with age of 30
```http
GET api/filter/age/30
``` 
* Fetching all covid-19 cases in NCR
```http
GET api/filter/regionRes/NCR
```
* Fetching all covid-19 cases between 15 to 19 years old
```http
GET api/filter/ageGroup/15-19
```
<br>

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
            "removal_type": "", // recovered|died
            "admitted": "no",
            "region_res": "NCR",
            "prov_res": "ncr",
            "city_mun_res": "city of malabon",
            "city_muni_psgc": "PH137502000",
            "health_status": "mild", // asymptomatic|critical|died|mild|recovered|severe
            "quarantined": "no",
            "date_onset": "",
            "pregnant_tab": "no",
            "validation_status": ""
        }
    ]
}
```

<br>

## 🔨 Installation

### Prerequisites
* [configured service account](https://developers.google.com/identity/protocols/oauth2/service-account)
* [Node.js](https://nodejs.org/en/)
* MySQL

### Steps

1. Make sure you have [Node.js](https://nodejs.org) & run the command:

```
$ npm install
```

2. Create a [Service Account](https://developers.google.com/identity/protocols/oauth2/service-account) and download the key.

3. copy .env.example to .env and paste the service key and database credentials respectively

- (Optional import .sql files inside the folder `./src/Database/sql`)

4. Run the project in development:

```
$ npm run dev
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
