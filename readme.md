# Covid-19-API-Philippines-DOH (Beta)

![License](https://img.shields.io/github/license/simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Last Commit](https://img.shields.io/github/last-commit/simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Stars](https://img.shields.io/github/stars/simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Forks](https://img.shields.io/github/forks/Simperfy/Covid-19-API-Philippines-DOH?style=plastic&logo=github)
![Tweet](https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2FSimperfy%2FCovid-19-API-Philippines-DOH)

#### Covid-19 Web API for Philippines from data collected by DOH using Node.js that automatically updates itself.
> A Web API doesn't use web scraping to fetch data from DOH website instead it collects the data from the csv file from DOH Google Drive.
> This means that even if DOH website changes this API will be able to maintain itself.

<br>

---

<br>

## 📌 Endpoints
Base URL: https://covid19-api-philippines.herokuapp.com/

Currently available API endpoints:

<details style="margin-bottom: 2em">
  <summary><h2 style="display: inline-block; color: orange">Case Informations</h2></summary>

**Fetching summary**
```http
GET api/summary
GET api/summary?region={region}
```
<details style="margin-bottom: 2em">
  <summary><i>Example Response</i></summary>

```JSON
{
  "data": {
    "total": 89374,
    "recoveries": 65064,
    "deaths": 1983,
    "active_cases": 22327,
    "fatality_rate": "2.22",
    "recovery_rate": "72.80"
  }
}
```

</details>

**Fetching Top Regions**
```http
GET api/top-regions
```

<details style="margin-bottom: 2em">
  <summary><i>Example Response</i></summary>

```JSON
{
    "data": [
        {
            "region": "NCR",
            "cases": 71145
        },
        {
            "region": "Region VII: Central Visayas",
            "cases": 17524
        },
        {...},
        {
            "region": "CARAGA",
            "cases": 306
        }
    ]
}
```

</details>

**Fetching No. of Cases Timeline**
```http
GET api/timeline
GET api/timeline?region={region_name}
```

<details style="margin-bottom: 2em">
  <summary><i>Example Response</i></summary>

```JSON
{
  "data": [
    {
      "cases": 1,
      "date": "2020-01-16"
    },
    {
      "cases": 1,
      "date": "2020-01-17"
    },
    {...},
    {
      "cases": 2398,
      "date": "2020-07-17"
    }
  ]
}
```

</details>

**Fetching raw data** (Ordered by case_code)
*`limit` cannot exceed `10000`*
```http
GET api/get?page=1&limit=10000
```

**Fetching records by month**
```http
GET api/get?month=03
```

**Fetching all by specific date**
```http
GET api/get?month=03&date=01
```

**Fetching raw data with filters 🆕**

```http
GET api/get?region_res=ncr&age_group=20-24
```
<details style="margin-bottom: 2em">
  <summary><i>Example Response</i></summary>

  ```JSON
  {
      "data": [
          {
              "case_code": "C100018",
              "age": 53,
              "age_group": "50-54",
              "sex": "female",
              "date_specimen": "2020-04-30",
              "date_result_release": "2020-05-09",
              "date_rep_conf": "2020-05-11",
              "date_died": "",
              "date_recover": "",
              "removal_type": "recovered",
              "admitted": "no",
              "region_res": "Region IV-A: CALABARZON",
              "prov_res": "laguna",
              "city_mun_res": "city of san pedro",
              "city_muni_psgc": "PH043425000",
              "health_status": "recovered",
              "quarantined": "no",
              "date_onset": "",
              "pregnant_tab": "no"
          },
          {...}
      ],
      "pagination": {
          "next_page": 2,
          "limit": 10000,
          "max_page": 10
      },
      "result_count": 10000
  }
  ```

</details>
</details>

<details style="margin-bottom: 2em">
  <summary><h2 style="display: inline-block; color: orange">Facilities Informations</h2></summary>

**Fetching facilities summary 🆕**
```http
GET api/facilities/summary
```

<details style="margin-bottom: 2em">
  <summary><i>Example Response</i></summary>

```JSON
{
    "data": [
        {
            "total_facilities": 1925,
            "occupancy_rate": 0.49,
            "beds": {
                "total_vacant": 9947,
                "total_occupied": 9489,
                "icu_v": 829,
                "icu_o": 851,
                "isolbed_v": 6678,
                "isolbed_o": 6102,
                "beds_ward_v": 2440,
                "beds_ward_o": 2536
            },
            "equipments": {
                "mechvent_v": 1521,
                "mechvent_o": 645
            }
        }
    ]
}
```

</details>

**Fetching raw facility/hospital records**

```http
GET api/facilities

GET api/facilities?{field1}={value1}&{field2}={value2}
```

<details style="margin-bottom: 2em">
  <summary><i>Example Response</i></summary>

```JSON
{
    "data": [
        {
            "hfhudcode": "DOH000000000000410",
            "cf_name": "asian hospital inc.",
            "updated_date": "2020-08-13T16:05:30.000Z",
            "added_date": "2020-08-13T16:05:30.000Z",
            "report_date": "2020-08-13T00:00:00.000Z",
            "icu_v": 0,
            "icu_o": 16,
            "isolbed_v": 0,
            "isolbed_o": 69,
            "beds_ward_v": 0,
            "beds_ward_o": 0,
            "mechvent_v": 18,
            "mechvent_o": 28,
            "icu_v_nc": 10,
            "icu_o_nc": 14,
            "nonicu_v_nc": 72,
            "nonicu_o_nc": 55,
            "mechvent_v_nc": 18,
            "mechvent_o_nc": 28,
            "q_nurse": 37,
            "q_doctor": 7,
            "q_other": 68,
            "nurse_adm": 0,
            "doctor_adm": 1,
            "other_adm": 2,
            "susp_asym": 0,
            "susp_mild": 18,
            "susp_severe": 1,
            "susp_crit": 1,
            "susp_died": 0,
            "prob_asym": 0,
            "prob_mild": 1,
            "prob_severe": 0,
            "prob_crit": 0,
            "prob_died": 0,
            "conf_asym": 0,
            "conf_mild": 50,
            "conf_severe": 0,
            "conf_crit": 15,
            "conf_died": 1,
            "t_patient_adm": 2,
            "t_patient_er": 2,
            "t_patient_icu": 2,
            "trans_ttmf": 2,
            "discharged": 2,
            "region": "national capital region (ncr)",
            "region_psgc": "PH130000000",
            "province": "ncr, fourth district (not a province)",
            "province_psgc": "PH137600000",
            "city_mun": "city of muntinlupa",
            "city_mun_psgc": "PH137603000",
            "north_coord": "0.0",
            "east_coord": "0.0"
        },
        {...}
    ]
}
```

</details>

</details>

---

<br>

## Field and Values Reference

| Field               | Type             | Values                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Can be empty? |
|---------------------|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| case_code           | String(7)        | UNIQUE ID String with length of 7                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | NO            |
| age                 | Integer(3)       | 1 - 3 digits                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | NO            |
| age_group           | String           | 0-4, 5-9, 10-14, 15-19, 20-24, 25-29, 30-34, 35-39, 40-44, 45-49, 50-54, 55-59, 60-64, 65-69, 70-74, 75-79, 80+                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | YES           |
| sex                 | String           | male, female                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | NO            |
| date_specimen       | Date(YYYY-MM-DD) | Date(YYYY-MM-DD)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | YES           |
| date_result_release | Date(YYYY-MM-DD) | Date(YYYY-MM-DD)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | YES           |
| date_rep_conf       | Date(YYYY-MM-DD) | Date(YYYY-MM-DD)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | NO            |
| date_died           | Date(YYYY-MM-DD) | Date(YYYY-MM-DD)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | YES           |
| date_recover        | Date(YYYY-MM-DD) | Date(YYYY-MM-DD)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | YES           |
| removal_type        | String           | recovered, died                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | YES           |
| admitted            | String           | yes, no                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | YES           |
| region_res          | String           | BARMM, CAR, CARAGA, NCR, Region I: Ilocos Region, Region II: Cagayan Valley, Region III: Central Luzon, Region IV-A: CALABARZON, Region IV-B: MIMAROPA, Region IX: Zamboanga Peninsula, Region V: Bicol Region, Region VI: Western Visayas, Region VII: Central Visayas, Region VIII: Eastern Visayas, Region X: Northern Mindanao, Region XI: Davao Region, Region XII: SOCCSKSARGEN, REPATRIATE                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | YES           |
| prov_res            | String           | abra,  agusan del norte,  agusan del sur,  aklan,  albay,  antique,  apayao,  aurora,  basilan,  bataan,  batangas,  benguet,  biliran,  bohol,  bukidnon,  bulacan,  cagayan,  camarines norte,  camarines sur,  camiguin,  capiz,  catanduanes,  cavite,  cebu,  city of isabela (not a province), cotabato (north cotabato) cotabato city (not a province),  davao de oro,  davao del norte,  davao del sur,  davao occidental,  davao oriental,  eastern samar,  guimaras,  ifugao,  ilocos norte,  ilocos sur,  iloilo,  isabela,  kalinga,  la union,  laguna,  lanao del norte,  lanao del sur,  leyte,  maguindanao,  marinduque,  masbate,  misamis occidental,  misamis oriental,  mountain province,  ncr,  negros occidental,  negros oriental,  northern samar,  nueva ecija,  nueva vizcaya,  occidental mindoro,  oriental mindoro,  palawan,  pampanga,  pangasinan,  quezon,  rizal,  romblon,  samar (western samar),  sarangani,  siquijor,  sorsogon,  south cotabato,  southern leyte,  sultan kudarat,  sulu,  surigao del norte,  surigao del sur,  tarlac,  tawi-tawi,  zambales,  zamboanga del norte,  zamboanga del sur,  zamboanga sibugay, | YES           |
| city_mun_res        | String           | https://pastebin.com/EmP2MQDH                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | YES           |
| city_muni_psgc      | String           | Unique ID (eg: PH012802000)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | YES           |
| health_status       | String           | asymptomatic, critical, died, mild, recovered, severe                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | NO            |
| quarantined         | String           | yes, no                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | YES           |
| date_onset          | Date(YYYY-MM-DD) | Date(YYYY-MM-DD)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | YES           |
| pregnant_tab        | String           | yes, no                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | YES           |
<br>


---

<br>

## 🔨 Installation

### Prerequisites
* [configured service account](https://developers.google.com/identity/protocols/oauth2/service-account)
* [Node.js](https://nodejs.org/en/)
* MySQL

### Steps

1. run the command:

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

5. Done

<br>

API documentation uses:

[Swagger express ui](https://www.npmjs.com/package/swagger-ui-express) - renders openapi.json

[Optic](https://useoptic.com/) - generates openapi.json

<br>

---

<br>

## 📄 About the Data
### Where does the data come from?

* The data comes from [DOH DATA DROP](http://bit.ly/DataDropPH) and [DOH DATA DROP Archives](https://drive.google.com/drive/folders/1UelgRGmUGNMKH1Q3nzqTj57V41bjmnxg)
* The data wasn't tampered and was directly converted to json from csv without heavy modification.

<br>

---

<br>

## 🔧 Built With
* [Node.js](https://nodejs.org) - open source server environment.
* [ExpressJS](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Google Drive API v3](https://developers.google.com/drive/api/v3/about-sdk) - Used to download files from DOH
* [Amazon Web Services](https://aws.amazon.com/) - Provides MySQL in Deployment

<br>

---

<br>

## Authors

* 🐶 **Simperfy(The Doggo)** - [Github](https://github.com/Simperfy)

<br>

---

<br>

## Acknowledgments

* 💗 [DOH - Philippines](https://www.doh.gov.ph/) - Data Source
