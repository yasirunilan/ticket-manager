# Ticket Manager

Ticket Manager is a web application for managing event bookings. Users can book tickets for events, and if tickets are sold out, they will be added to a waiting list. Users can also cancel their bookings, and the system will reassign the ticket to the next user in the waiting list.

## Features

- User authentication and authorization
- Event booking
- Waiting list management
- Booking cancellation

## Prerequisites

- Node.js
- npm

## Setup and Running

#### 1. Clone the repository

```sh
git clone https://github.com/yasirunilan/ticket-manager.git
cd ticket-manager
```

#### 2. Install dependencies

```sh
npm install
```

#### 3. Setup Environment Variable in a .env file if needs to be different from configuration mentioned in src/config/config.js. By default it will use the configuration specified in the src/config/config.js file

#### 4. Run Migrations

```sh
 npm run db:migrate
```

#### 5. Run Seeders to add 10 default users to the database

```sh
 npm run db:seed
```

#### 6. Start the application

```sh
 npm start
```

#### 7. Run Unit Tests

```sh
 npm test
```

## Design Choices

- I have used Sequelize ORM to perform and work with database in this project because using a ORM helps us to work with the databases very easily compared to not using a ORM and using raw queries. Specific reason for using Sequelize over other ORMs is I have prior experience with it.
- I have added a health check endpoint to check the application status.
- I have changed the API routes given in the Requirement document as I think the implemented routes best match the scenario and follow the standards.
    1. /initialize => /event/add
    2. /book => /booking/add
    3. /cancel => /booking/cancel
    4. /status/:eventId => /event/:eventId
- When a booking gets cancelled it isn't removed from the database but stays in db with status as "Cancelled". I did't remove it from the database because that data would be needed in the future for statistics purposes.
- I have added 10 users to the database to ease the testing. Their credentials are email: `user<id>@test.com` and their password is "Test@123".
- I have added /auth/login endpoint as well to authenticate the users for the protected endpoints. When testing you can first call the login endpoint and get a token to authenticate the other endpoints.
- The endpoint to get event details is kept public so no authentication is required. All the other endpoints are protected.
- When a user successfully login, user get a JWT token that can be used in other endpoints.
- To handle the race conditions and concurrency in booking and cancellation endpoints, I have used Sequelize transactions. The behavior is not specific to Sequelize. Even if we use raw sql queries we can use transactions to make sure we handle the race conditions and concurrency.
- I have implemented the APIs in a versioned way and it currently have v1.
- For the authentication I have used PassportJS.
- Rate limiting is achieved with express-rate-limit package and I have setup it to allow 100 requests per 15 minute time period before blocking the requests.
- I have used Joi package for validations


## API Documentation

The API documentation is available at http://localhost:3000/api/v1/docs when the application is running. The documentation is generated using Swagger.