# Blitz

An HTTP Web Framework built with typescript.

## Usage

Simple `Hello World` App

```js
const app = blitz(); // Create the blitz object

app.get("/hello", (req, res) => {
  return res.json({
    message: "hello world!",
  });
});

app.listen(3000); // Server will be listening on port 3000
```

Blitz supports static files

```js
app.get("/", (req, res) => {
  return res.view("index", {
    bestFramework: "blitz",
  });
});
```

Blitz will automatically map filename to /views directory, for example.
`index` will be mapped to `/views/index.dhtml`.
Blitz supports dynamic templates with the extension `dhtml`.

```html
--- index.dhtml ---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Favorite Website!</title>
  </head>
  <body>
    <h1>The best framework is: ::bestFramework</h1>
  </body>
</html>
```

where `::bestFramework` will be changed to "blitz".

Blitz now supports dynamic path parameters!
The following path will be mapped to `/firstparam/secondparam/abc`
you can access those paramaters through `req.params`
NOTE: The params aren't sanitised, so use them wisely ( will change soon )

```js
app.get("/*/*/abc", (req, res) => {
  // You can access the params with `req.params` array.
  // And even render a view with them!
  return res.view("params", {
    first: req.params[0],
    second: req.params[1],
  });
});
```

## Upcoming Features

- ~~Usage Section~~

- POST Requests

- ~~Static File Serving~~
