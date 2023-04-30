# EcoFlipr

4th semester fullstack exam project.
Technologies used:

- Backend:
  - GraphQL (Apollo GraphQL) as middleware with Express for API, MongoDB as document DB using Mongoose for Object Document Mapping, written in TypeScript.
  - JWT token auth
- Frontend:
  - User interface built with React.
  - [React-hot-toast](https://react-hot-toast.com/) for notifications.
- Both:
  - Using Prettier for formatting and Husky for auto formatting using pre-commit hook

[Check out documentation](https://docs.google.com/document/d/10sMMaLOVtc_BvnQ9Vex5iBIQ9JwFXJkzIGE3BPa0lm0/edit#heading=h.3s0pjx1iz31z)

# Schedule and logbook

[Check here](https://docs.google.com/document/d/1K37tl6oRl87TXao0XZYDJWe2MWxayhGbHhlyad1OgWg/edit?usp=sharing)

# How to run the project

Start by running the backend:

1. Right click server folder
2. Click: _Open in integrated terminal_
   In the terminal write:
3. `npm i`
4. Create a ".env" file in the folder and add the following key and values:

```
MONGODB_URI=YOUR_MONGO_DB_URI
SECRET=ThisCouldBeYourSecret
PORT=5000
```

5. `npm run dev`

Your backend should now be running on `http://localhost:5000` and that should be it for the backend. Before continuing to the frontend you might want to run the backend once with line 39 uncommented in the app.ts to seed/populate the db with categories. <br> <br>
Now for the fronend:

1. Right click client folder
2. Click: _Open in integrated terminal_
   In the terminal write:
3. `npm i`
4. `npm run dev`

That should be it for the frontend. Enjoy.

# Hand-ins

- Check part 1 for first hand-in [here](PART1.MD)