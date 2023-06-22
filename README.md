# backend-assignment

There are some prerequisites to running, building or deploying this AWS Lambda.

## Prerequisites

1. Install and configure credentials using AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
2. Install AWS SAM CLI: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-configure.html
3. Install Node 18: https://nodejs.org/en/download
4. Install dependencies with `npm install` inside the `backend-assignment` folder

## Usual scripts

Inside the `backend-assignment` folder:

- `npm run test` to run tests
- `npm run lint` to check the code against the linting rules

In the root folder:

- `sam build` to build the serverless application
- `sam deploy` to deploy the serverless application once it's built
- `sam local start-api` to start the application locally and access it on `http://127.0.0.1:3000/`

The deploy process should take care of all the requirements, including the API Gateway Endpoint.

## How to use the application

Once the application is running either locally or in production, you can use the following route: `/arithmetic-operation/{operation}/{operand1}/{operand2}`

For example:

- `/arithmetic-operation/add/1/2`
- `/arithmetic-operation/subtract/1/2`
- `/arithmetic-operation/multiply/1/2`
- `/arithmetic-operation/divide/1/2`

## Some things left to do

- replace `hello world` information in `events/event.json`
- replace the last `hello world` reference in `template.yaml`
- authentication
- investigate using `BigInt` for some operations
