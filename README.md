# Task manager

Simple task manager with NodeJS

## How to use

Install dependencies : `npm install`

### API

> `npm run api` and open your browser at "http://localhost:4000/api-docs" to see Swagger doc

### Front

> `npm run front` and open your browser at "http://localhost:8080"

### Doc

*Doc auto generated with JSdoc*

Create api documentation : `npm run api-doc` (*result on : ./doc/api*) (For API, I prefer swagger documentation : http://localhost:4000/api-docs)

Create front documentation : `npm run front-doc` (*result on : ./doc/front*)

## Dependencies

* __express__ \
    Standard NodeJS framework for web application \
    *[click here to access the documentation](https://www.npmjs.com/package/express)*

* __express-swagger-generator__ \
    NodeJS framework to auto generate Swagger doc \
    *[click here to access the documentation](https://www.npmjs.com/package/express-swagger-generator)*

* __redis__ \
    Redis client (to access to your redis server) \
    *[click here to access the documentation](https://www.npmjs.com/package/redis)*

* __uuidv4__ \
    Package to create v4 UUIDs \
    *[click here to access the documentation](https://www.npmjs.com/package/uuidv4)*

* __nodemon__ [*dev dependence*] \
    Tool that helps develop node.js based app by automaticcaly restarting the node application when file changes \
    *[click here to access the documentation](https://www.npmjs.com/package/nodemon)*

* __jsdoc__ [*dev dependence*] \
    An API documentation generator for JavaScript \
    *[click here to access the documentation](https://www.npmjs.com/package/jsdoc)*