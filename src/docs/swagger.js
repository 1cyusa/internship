const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "SOS API",
    version: "1.0.0",
    description: "Interactive API docs for testing routes from Swagger UI.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      xUserRole: {
        type: "apiKey",
        in: "header",
        name: "x-user-role",
        description: "Use one of: admin, doctor, patient",
      },
      xUserId: {
        type: "apiKey",
        in: "header",
        name: "x-user-id",
        description: "Existing user ID from database",
      },
    },
  },
  paths: {
    "/": {
      get: {
        summary: "Health check",
        responses: {
          200: { description: "API is running" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        summary: "Get current actor",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        responses: {
          200: { description: "Current actor details" },
          401: { description: "Missing actor headers" },
        },
      },
    },
    "/api/users": {
      post: {
        summary: "Create user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
        responses: {
          201: { description: "User created" },
        },
      },
      get: {
        summary: "Get all users (admin)",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [
          {
            name: "x-user-role",
            in: "header",
            required: false,
            schema: { type: "string", enum: ["admin", "doctor", "patient"] },
            description: "Use admin for this endpoint",
          },
          {
            name: "x-user-id",
            in: "header",
            required: false,
            schema: { type: "string" },
            description: "Alternative to x-user-role if user exists in DB",
          },
        ],
        responses: {
          200: { description: "Users list" },
          401: {
            description: "Provide x-user-id or x-user-role headers to access this route",
          },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/users/{id}": {
      get: {
        summary: "Get user by ID",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User details" },
        },
      },
      put: {
        summary: "Update user",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
        responses: {
          200: { description: "User updated" },
        },
      },
      delete: {
        summary: "Delete user (admin)",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User deleted" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/appointments": {
      get: {
        summary: "Get appointments",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        responses: {
          200: { description: "Appointments list" },
        },
      },
      post: {
        summary: "Create appointment (admin, patient)",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
        responses: {
          201: { description: "Appointment created" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/appointments/doctor/{doctorId}": {
      get: {
        summary: "Get appointments by doctor",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [
          { name: "doctorId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Doctor appointments" },
        },
      },
    },
    "/api/appointments/{id}": {
      get: {
        summary: "Get appointment by ID",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Appointment details" },
        },
      },
      put: {
        summary: "Update appointment",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
        responses: {
          200: { description: "Appointment updated" },
        },
      },
      delete: {
        summary: "Delete appointment (admin)",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Appointment deleted" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/appointments/{id}/cancel": {
      patch: {
        summary: "Cancel appointment (admin, doctor)",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Appointment canceled" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/notifications": {
      get: {
        summary: "Get notifications",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        responses: {
          200: { description: "Notifications list" },
        },
      },
      post: {
        summary: "Create notification (admin)",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
        responses: {
          201: { description: "Notification created" },
        },
      },
    },
    "/api/notifications/user/{userId}": {
      get: {
        summary: "Get notifications by user",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User notifications" },
        },
      },
    },
    "/api/notifications/{id}": {
      get: {
        summary: "Get notification by ID",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Notification details" },
        },
      },
      put: {
        summary: "Update notification",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
        responses: {
          200: { description: "Notification updated" },
        },
      },
      delete: {
        summary: "Delete notification",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Notification deleted" },
        },
      },
    },
    "/api/notifications/{id}/read": {
      patch: {
        summary: "Mark notification as read",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Notification marked as read" },
        },
      },
    },
    "/api/doctor-availabilities": {
      get: {
        summary: "Get all doctor availabilities",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        responses: {
          200: { description: "Availabilities list" },
        },
      },
      post: {
        summary: "Create doctor availability",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
        responses: {
          201: { description: "Availability created" },
        },
      },
    },
    "/api/doctor-availabilities/doctor/{doctorId}": {
      get: {
        summary: "Get availabilities by doctor",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [
          { name: "doctorId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Doctor availability entries" },
        },
      },
    },
    "/api/doctor-availabilities/{id}": {
      get: {
        summary: "Get availability by ID",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Availability details" },
        },
      },
      put: {
        summary: "Update availability",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
        responses: {
          200: { description: "Availability updated" },
        },
      },
      delete: {
        summary: "Delete availability",
        security: [{ xUserRole: [] }, { xUserId: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Availability deleted" },
        },
      },
    },
  },
};

export default swaggerDocument;
