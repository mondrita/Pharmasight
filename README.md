# Pharmasight
**Pharmasight**, a comprehensive sales data visualization platform designed to revolutionize pharmaceutical sales analysis in Bangladesh.
Pharmasight is designed to provide users with an interactive platform to explore and analyze pharmaceutical sales data effectively. It’s tailored to the needs of pharmaceutical companies, sales teams, market analysts, and policymakers to ensure better decision-making through data-driven insights.

---

[![IMAGE ALT TEXT HERE](https://github.com/user-attachments/assets/d45ed5aa-f749-4e6d-9c67-809f5047c38e)](https://www.youtube.com/watch?v=n3A1WkvVrKs)


## Key Features

### Comprehensive Search
- Users can effortlessly locate sales data by applying four mandatory filters: **Generic**, **Vendor**, **Start Date**, and **End Date**.
- The search results dynamically populate in both a **table** and a **map** format, ensuring clarity and convenience for users with varied preferences.

### Interactive Visualization
- Sales data is visually represented on an interactive **map of Bangladesh**, where each location is marked with sales performance metrics for quick identification.
- Users can drill down into specific divisions by clicking on them. The selected division zooms in for a closer view, and its border is highlighted for clarity.
- At the division level, district-wise sales data is displayed on the map, with each district marked distinctly to provide granular insights into sales distribution.

### Actionable Insights
- Dedicated insights on **top-performing drug brands** and their sales data are provided through separate tabs.
- **Market share analysis** for each brand and drug is presented, allowing users to identify leading players and assess competitive performance.
- Specific drug performance, including highest and lowest sales months and regions, is also highlighted to support strategic decision-making.

### Data Export
- Sales data can be seamlessly downloaded in **Excel format**.
- This feature supports offline reporting and further detailed analysis, ensuring flexibility for users.

---

## Tech Stack Summary

- **Backend:** Spring Boot
- **Frontend:** Angular
- **Database:** MySQL
- **Mapping:** OpenStreetMap
- **Security:** Spring Security
- **Languages:** Java, TypeScript, HTML, CSS

---

![Image](https://github.com/user-attachments/assets/432689c8-f1c5-4cf0-96c4-72c6035ba060)
![Image](https://github.com/user-attachments/assets/8709f116-0275-4b3a-90c4-9786f438fae8)
![Image](https://github.com/user-attachments/assets/c9aa89ae-bd3a-41d2-9843-3c1d37f3b010)
![Image](https://github.com/user-attachments/assets/8158a271-63ac-4f63-a5f8-199120b2ca88)
![Image](https://github.com/user-attachments/assets/5942d306-31d2-4914-8aeb-511d5052f9e1)
![Image](https://github.com/user-attachments/assets/70952654-f2d7-4714-96d7-7f2d169fe137)
![Image](https://github.com/user-attachments/assets/0bd4440b-f138-4a1f-88dc-57600c984d51)
![Image](https://github.com/user-attachments/assets/3996285b-ac55-4153-b186-a295d6c16791)
![Image](https://github.com/user-attachments/assets/f088d601-f048-4e05-b6ae-b5ec8efc58d5)
![Image](https://github.com/user-attachments/assets/162cf82b-956d-41a2-bc83-a379440b16b9)
![Image](https://github.com/user-attachments/assets/c8a19308-66c3-4086-9950-80a6b749566c)
![Image](https://github.com/user-attachments/assets/8ceb6ede-fdcf-49e2-baad-b9513b7ea5c3)

# API Documentation

## API Endpoints

| Endpoint                                   | Method | Description                                   | Parameters/Request Body                                   | Response                                                                                          |
|-------------------------------------------|--------|-----------------------------------------------|----------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| `/division/boundary`                      | GET    | Get GeoJSON data by division name            | `name` (String, query parameter)                         | `200 OK`: Returns `DivisionDto` containing division details.                                      |
| `/division/district-coordinates`          | GET    | Get district coordinates                     | `divisionId` (Long, query parameter)                     | `200 OK`: Returns a list of `DistrictDTO` containing district coordinates.                        |
| `/export-excel`                           | GET    | Export Excel report                          | Accepts `SearchCriteriaDTO` as query parameters           | `200 OK`: Returns an Excel file (`application/octet-stream`).                                     |
| `/upload/geojson/{id}`                    | POST   | Upload GeoJSON file                          | `id` (Long, path), `file` (MultipartFile)                | `200 OK`: Success message or `500 Internal Server Error`: Error message.                         |
| `/generic/search`                         | GET    | Get generic suggestions                      | `prefix` (String, query), `limit` (Integer, optional)    | `200 OK`: Returns a list of `Generic` suggestions.                                               |
| `/sales-info/demographic`                 | GET    | Get demographic sales data                   | Accepts `SearchCriteriaDTO` as query parameters           | `200 OK`: Returns `DemographicDTO`.                                                              |
| `/sales-info/top-brands`                  | GET    | Get top brands                               | Accepts `SearchCriteriaDTO` as query parameters           | `200 OK`: Returns a list of `TopDrugDTO`.                                                        |
| `/sales-info/demographic-districts`       | GET    | Get district sales data                      | Accepts `SearchCriteriaDTO` as query parameters           | `200 OK`: Returns a list of `DistrictSalesDTO`.                                                  |
| `/sales-info/district-market-share`       | GET    | Get district market share                    | Accepts `SearchCriteriaDTO` as query parameters           | `200 OK`: Returns a list of `DistrictMarketShareDTO`.                                            |
| `/sales-info/Drug-report`                 | GET    | Get drug report                              | Accepts `SearchCriteriaDTO` as query parameters           | `200 OK`: Returns `DrugReportDTO`.                                                               |
| `/`                                       | GET    | Server status check                          | None                                                     | `200 OK`: "Server is On" or `500 Internal Server Error`: "Internal Server Error".               |
| `/register`                               | POST   | Register user                                | `User` (Request Body)                                    | `200 OK`: Returns the registered `User`.                                                         |
| `/login`                                  | POST   | User login                                   | `UserLoginDTO` (Request Body)                            | `200 OK`: Returns a token or `401 Unauthorized`: Authentication failed.                          |
| `/vendor/search`                          | GET    | Get vendor suggestions                       | `prefix` (String, query), `limit` (Integer, optional)    | `200 OK`: Returns a list of `VendorDTO` suggestions.                                             |
