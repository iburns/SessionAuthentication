# Session-based Authentication with NodeJS/Express/MySQL/Passport

## Frameworks
- Node JS
- Express
- MySQL
- Passport
- KnockoutJS
- EJS
- Mocha/Chai (Unit Tests)
- superagent/supertest (HTTP Tests)

## Features
- Registrations
- Logins
- Logouts
- Encrytped Passwords (SHA256)
- Environment-based Configs
- Session-based Logins
- View Templating through EJS
- Message Flashes on Redirects or for Errors
- Basic Unit Tests (Including HTTP request testing)

## Database Requirements
In order to run, you must point the project at a MySQL database that includes a table as follows. Please specify the db credentials under `./config/dev.json` as well as the other configs in the same folder, if you want to eventually point the project at different databases.

### dbo.Users
>create table Users\
>(\
>  ID       int auto_increment primary key,\
>  Username varchar(20) charset utf8 null,\
>  Email    varchar(50) charset utf8 null,\
>  Hash     varchar(64) charset utf8 null,\
>  Salt     varchar(16) charset utf8 null\
>);

## Commands
You can config this project to point at different databases depending on the start up command you run (PROD, DEV, TEST)
### DEV (default)
`npm run start`
or for Macs:
`npm run start-mac`

### PROD
`npm run prod`

### TEST (Mocha)
`npm run test`
or for Macs:
`npm run test-mac`
