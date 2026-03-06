# Consular Passport Appointment & Case Management System

![Node](https://img.shields.io/badge/backend-Node.js-green)
![React](https://img.shields.io/badge/frontend-React-blue)
![MongoDB](https://img.shields.io/badge/database-MongoDB-brightgreen)
![Redux Toolkit](https://img.shields.io/badge/state-Redux%20Toolkit-purple)
![Testing](https://img.shields.io/badge/testing-Selenium%20%7C%20ReqNRoll%20%7C%20NUnit-orange)
![Coverage](https://img.shields.io/badge/test%20coverage-94%25-brightgreen)

## Overview

The **Consular Passport Appointment & Case Management System** is a full-stack MERN application designed to simulate a real-world government passport appointment platform.

The system allows citizens to schedule passport-related appointments while enabling consulate staff to manage appointment capacity, track cases, and monitor operational analytics.

---

## Features

### Citizen Appointment Scheduling

Citizens can schedule passport service appointments including:

- Passport Renewal
- First-Time Passport
- Emergency Travel Document
- Lost or Stolen Passport

Capabilities include:

- Viewing appointment availability
- Selecting appointment type and time
- Submitting appointment requests
- Generating unique reference numbers
- Modifying or cancelling appointments
- Preventing overbooking

### Case Management

Each appointment generates a case record containing:

- Applicant information
- Appointment details
- Case status history

Case statuses include:

- Scheduled
- In Review
- Approved
- Rejected
- Completed

### Staff Operations Dashboard

Staff members can:

- View daily appointment schedules
- Search by applicant or reference number
- Filter appointments by status or type
- Update case statuses
- Add internal notes
- Flag cases for follow-up

---

## Screenshots

<img width="1843" height="845" alt="image" src="https://github.com/user-attachments/assets/72c2621d-8ad8-4597-ada6-28eed98b1356" />
<img width="1861" height="831" alt="image" src="https://github.com/user-attachments/assets/e66ecfc1-fb4a-40dc-8e39-580e75b9c22f" />
<img width="1344" height="829" alt="image" src="https://github.com/user-attachments/assets/c9680910-db4a-4096-9ea7-6797626e697c" />


<img width="1136" height="888" alt="image" src="https://github.com/user-attachments/assets/29b04bb7-1f99-43a1-8a35-0404940e7c2b" />



### Staff Dashboard

Displays:

- Appointment metrics
- Today's appointment schedule
- Case status indicators
- Staff action controls

### Availability Management

Staff can:

- Set working hours
- Define appointment capacity
- Block unavailable dates

### Case Management

Allows staff to:

- Add internal notes
- Track missing documents
- Flag cases for review

### Automated Testing Report

Automated test report generated using Allure.

---

## Analytics Dashboard

The analytics dashboard provides staff with insight into system activity.

Metrics include:

**Appointment Volume by Date**
Displays a bar chart of appointment demand across a selected date range.

**Case Status Breakdown**
Shows the distribution of cases by status.

**Appointment Type Distribution**
Displays service demand by appointment type.

**No-Show & Cancellation Metrics**
Tracks appointment cancellations and no-shows.

---

## API Documentation

### Appointment Endpoints

#### Create Appointment
`POST /appointments`

Creates a new appointment and generates a case record.

#### Get Appointment
`GET /appointments/{reference}`

Returns appointment details using the reference number.

#### Update Appointment
`PUT /appointments/{reference}`

Updates appointment details.

#### Cancel Appointment
`DELETE /appointments/{reference}`

Cancels an appointment.

### Case Endpoints

#### Get Case
`GET /cases/{id}`

Returns case information.

#### Update Case Status
`PATCH /cases/{id}/status`

Updates workflow status for the case.

### Analytics Endpoints

| Endpoint | Description |
|---|---|
| `GET /analytics/appointments` | Appointment Volume |
| `GET /analytics/case-status` | Case Status Breakdown |
| `GET /analytics/appointment-types` | Appointment Type Distribution |
| `GET /analytics/no-shows` | No-Show Metrics |

---

## Testing Strategy

The project includes multiple testing layers.

### End-to-End Testing

**Tools:**
- Selenium
- ReqNRoll (Cucumber for .NET)
- NUnit

**Example scenario:**
1. Login as staff
2. Navigate to analytics dashboard
3. Apply date filters
4. Confirm charts update
5. Export CSV report

### API Testing

**Tool:** Rest Assured (.NET)

Each aggregation endpoint includes tests for:

- Valid input
- Empty result sets
- Invalid parameters

### Unit Testing

**Tools:**
- Moq
- Coverlet

Tests focus on:

- Service layer logic
- Filter parameter construction
- Aggregation query generation

### Load Testing

**Tool:** NBomber

Used to simulate concurrent requests against analytics endpoints.

---

## Project Structure

```
project-root
│
├── backend
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── models
│   └── routes
│
├── frontend
│   ├── components
│   ├── pages
│   ├── api
│   ├── store
│   └── theme
│
├── tests
│   ├── e2e
│   ├── api
│   └── unit
│
└── README.md
```

---

## Running the Project

### Backend

```bash
cd backend
npm install
npm start
```

Server runs on: `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Code Quality

The project follows modern software engineering practices:

- SOLID principles
- DRY architecture
- Modular component structure
- JSDoc documentation
- Clean separation of concerns

---

## Future Improvements

Potential enhancements include:

- Email notifications for appointments
- Role-based authentication
- Appointment reminders
- Advanced analytics visualizations
- Cloud deployment

---

## Contributors

**StormSurge+ Development Team**
Enterprise Full Stack Developer Program

| Name | GitHub |
|---|---|
| Wilson Kong | [@wkongss](https://github.com/wkongss) |
| Nicholas Eason | [@NicholasEason](https://github.com/NicholasEason) |
| Justin Theyskens | [@JustinTheyskens](https://github.com/JustinTheyskens) |
| Gavin Scheidler | [@GavinScheidler](https://github.com/GavinScheidler) |
| Jason Seguin | [@jasonseguin-dev](https://github.com/jasonseguin-dev) |

# System Architecture

```mermaid
flowchart TD

Citizen[Citizen User]
Staff[Consular Staff]

Frontend[React + Redux Toolkit]
Backend[Node.js + Express API]
Database[(MongoDB)]

Citizen --> Frontend
Staff --> Frontend

Frontend --> Backend
Backend --> Database

Backend --> Analytics[Analytics Aggregation]
Analytics --> Frontend
