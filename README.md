# Simple CRUD API with cluster and balancer (Node.js & TS) ![Node.js](https://img.shields.io/badge/-Node.js-green) ![TypeScript](https://img.shields.io/badge/-TypeScript-blue)

**You should be in [develop branch](https://github.com/wellder00/Simple_CRUD_API/tree/develop).**

## 📦 How to install Simple_CRUD_API

You can clone this repository:

```bash
$ git clone git@github.com:wellder00/Simple_CRUD_API.git
```

Or download it by clicking the green "Code" button and then "Download ZIP". Open it in your IDE.

After that, enter in your console:

```bash
npm install
```

## ▶️ How to run

**Server port for listening incoming requests can be configured as an environment variable (.env.example is provided)**

Run the Simple CRUD API in development mode:

```bash
npm run start:dev
```

Run the Simple CRUD API in production mode:

```bash
npm run start:prod
```

Run the Simple CRUD API in cluster mode with an in-memory database for all workers and a default loader balancer:

```bash
npm run start:multi
```

Run tests for Simple CRUD API with three scenarios:

```bash
npm run test
```

If you start in multi mode, the response to the request can be seen in the console. The data from the database should be consistent across all workers, and the workers should be load-balanced in a round-robin fashion.

## 🌐 Works with Rest API

`api/users` - it's the endpoint.

Method `GET` + `api/users` - Get all users.

Method `GET` + `api/users/${userId}` - Get a user by id (uuid).

Method `POST` + `api/users` - Create a new user (ID is auto-generated).

Method `PUT` + `api/users/${userId}` - Update an existing user.

Method `DELETE` + `api/users/${userId}` - Delete an existing user.

### 📝 User obligatory fields

`username` — user name (`string`);

`age` — user age (`number`);

`hobbies` — user hobbies (`array of string`).

#### ![Postman](https://img.shields.io/badge/-Postman-orange) `POST /api/users` 

- **Purpose**: Create a new user record in the database.
- **Response**:
  - **201**: Success. Returns the newly created record.
- **Error Response**:
  - **400**: Invalid user data. Message: "Invalid user data" if request body does not contain required fields.

#### `PUT /api/users/{userId}`

- **Purpose**: Update an existing user's information.
- **Response**:
  - **200**: Success. Returns the updated record.
- **Error Responses**:
  - **400**: Invalid user ID. Message: "Invalid user id" if provided ID is not a valid UUID.
  - **404**: User not found. Message: "User with id {provided_id} not found" if no user is found with the provided ID.

#### `DELETE /api/users/{userId}`

- **Purpose**: Remove an existing user from the database.
- **Response**:
  - **204**: Success. Indicates the record was found and deleted.
- **Error Responses**:
  - **400**: Invalid user ID. Message: "Invalid user id" if provided ID is not a valid UUID.
  - **404**: User not found. Message: "User with id {provided_id} not found" if no user is found with the provided ID.

#### Non-Existing Endpoints

- **Purpose**: Handle requests to endpoints that do not exist.
- **Response**:
  - **404**: Endpoint not available. Message: "Endpoint is not available" for requests to non-existing endpoints.

[Link to this task here](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md).