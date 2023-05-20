# EcoFlipr

## Table of content

- [EcoFlipr](#EcoFlipr)
  - [Table of content](#table-of-content)
  - [About](#about)
  - [Technologies](#Technologies)
  - [Schedule and logbook](#Schedule-and-logbook)
  - [Setup project instructions](#setup-project-instructions)

## About

Semester project, 4th semester, Full Stack application using TypeScript, React.js, GraphQL, Mongoose, MongoDB, Express, Node.js.
<br>

## Technologies

Technologies used:

- Backend:
  - GraphQL (Apollo GraphQL) as middleware with Express for API, MongoDB as document DB using Mongoose for Object Document Mapping, written in TypeScript.
  - JWT token auth, with bcrypt checked on specific requests.
  - Integration testing done with JEST
- Frontend:
  - User interface made with React (built using Vite) and styled with Tailwind CSS (also used for DARK-mode).
  - Implements react-routing with protected routes.
  - [React-hot-toast](https://react-hot-toast.com/) for notifications.
  - Downscale images for fast load: [here](https://www.iloveimg.com/resize-image#resize-options,percentage)
- Both:
  - Using Prettier for formatting and Husky for auto formatting using pre-commit hook

[Check out documentation](https://docs.google.com/document/d/10sMMaLOVtc_BvnQ9Vex5iBIQ9JwFXJkzIGE3BPa0lm0/edit#heading=h.3s0pjx1iz31z)

# Schedule and logbook

[Check here](https://docs.google.com/document/d/1K37tl6oRl87TXao0XZYDJWe2MWxayhGbHhlyad1OgWg/edit?usp=sharing)

# Setup project instructions

Start by running the backend:

1. Right click server folder
2. Click: _Open in integrated terminal_
   In the terminal write:
3. Install dependencies: `npm i`
4. Create a ".env" file in the folder and add the following key and values:

```
MONGO_PRODUCTION_URI=YOUR_MONGO_PRODUCTION_DB_URL
MONGO_DEVELOPMENT_URI=YOUR_MONGO_DEVELOPMENT_DB_URL
MONGO_TEST_URI=YOUR_MONGO_TEST_DB_URL
JWT_SECRET=ThisCouldBeYourJWT_SECRET
JWT_EXPIRES_IN=1h
PORT=5000
```

5. ONLY WHEN RUNNING FIRST TIME: In app.ts, uncomment line 63 and 64 to seed/populate the db with categories and cities. Remember to shutdown the server and comment out the lines after first execution.
6. Now fire up the server: `npm run dev`

Your backend should now be running on `http://localhost:5000` and that should be it. <br> <br>
Now for the fronend:

1. Right click client folder
2. Click: _Open in integrated terminal_
   In the terminal write:
3. Install dependencies: `npm i`
4. Create a ".env" file in the folder and add the following key and values:

You would have to create 2 api keys:

- Google Maps Api
- Upload JS Api

```
VITE_GOOGLE_MAPS_API=GOOGLE_MAPS_API
VITE_IMAGE_UPLOADER_API=UPLOADER_JS_API
```

5. Finally run: `npm run dev`

That should be it for the frontend. Enjoy.

# Hand-ins

- Check part 1 for first hand-in [here](PART1.MD)
