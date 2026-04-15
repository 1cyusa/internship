# SOS API Postman Testing Guide

## Prerequisites
- Run `node index.js` (port 5000)
- Use headers for auth: `x-user-id`, `x-user-role` (admin/doctor/patient)
- Swagger: http://localhost:5000/api-docs

## Requests

### 1. Health
`GET /`

### 2. Actor
`GET /api/auth/me`
Headers: x-user-id:1, x-user-role:admin

### 3. Users
`GET /api/users/`
`GET /api/users/1`

### 4. Doctor Availabilities
`GET /api/doctor-availabilities/`
`GET /api/doctor-availabilities/doctor/1`
`POST /api/doctor-availabilities/` (body: {\"doctorId\":1,\"startTime\":\"2024-12-01T10:00:00Z\",\"endTime\":\"2024-12-01T11:00:00Z\"})

### 5. Appointments
`GET /api/appointments/`
`POST /api/appointments/` (body: {\"doctorAvailabilityId\":1,\"patientNotes\":\"Test\"})

### 6. Notifications
`GET /api/notifications/`
`PATCH /api/notifications/1/read`

IDs from seeds. Test roles for 401/403.

