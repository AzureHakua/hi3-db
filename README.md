# Honkai Impact 3rd Database (WIP)

## Getting Started
This Honkai Impact 3rd Database is a work in progress using a Bun Elysia Turso tech stack as both an experimental and learning project.

## Running the Database
- In order to run this database, you will need to have Bun installed as well as a Turso database.
- After cloning the repository, you will need to run `bun install` to install the dependencies.
- After that, you will need to create a `.env` file in the root directory of the project.
- In the `.env` file, you will need to add the following:
```
TURSO_CONNECTION_URL=''
TURSO_AUTH_TOKEN=''
API_KEY=''
```
- The `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` can be found by running `turso db list hi3` and `turso db tokens create hi3` respectively. (Note: The `hi3` is the name of the database, which you will need to create)
- The `API_KEY` can be any string of your choosing.
- After that, you can run `bun dev` to start the database.