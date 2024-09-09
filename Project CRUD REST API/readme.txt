Project set up CLI commands

```
npx tsc --init
npm init
npm add ts-node-dev typescript -D
```

then, add dev script in package.json,  like this

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "ts-node-dev --respawn --transpile-only src/app.ts"
  },


then add express
``` npm add express ```


then add types for node and express under devDependencies
``` npm add @types/node @types/express -D ```

then install zod as a dependency
``` npm add zod -D```

to run everything
``` npm run dev ```


notes for myself:

Models : represent the table columns, schema of the object perhaps
Routes : Telling the application, if user wants GET/POST, then do what action
Controllers : Contains the Implementation of Logic and sending back out the response.
Services : Database Queries and returning objects or throwing errors.

reference links:
https://devtut.github.io/nodejs/route-controller-service-structure-for-expressjs.html#model-routes-controllers-services-code-structure  this is the main MVC reference
https://zod.dev/
https://jeffsegovia.dev/blogs/rest-api-validation-using-zod
https://amirmustafaofficial.medium.com/node-js-and-express-js-with-typescript-d4ea7e61096
https://www.youtube.com/watch?v=BWUi6BS9T5Y TomDoesTech REST API w/ CRUD

API REQUESTS

GET "/employee" get all the employees

POST "/employee" add in employees
    req.body: Captures data from the body of the POST request (useful for form submissions, JSON payloads, etc.). (especially for using ways i.e. x-www-form-urlencoded)
    req.params: Captures URL route parameters specified as part of the path (often used for resource identification like /user/:id).






