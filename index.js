const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Persons = require("./models/phonebook");

const app = express();

app.use(cors());
app.use(express.json());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.use(express.static("dist"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const personCount = persons.length;
  const now = new Date();
  response.send(
    `<p>Phonebook has info for ${personCount} people </p><p>${now}</p>`
  );
});

app.get("/api/persons/", (request, response) => {
  Persons.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons/", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const person = new Persons({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => response.json(savedPerson));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    response.status(400).json({ error: "name or number missing" });
  }

  const person = {
    name: body.name,
    number: body.number,
  };
  Persons.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((result) => response.json(result))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Persons.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

if (process.env.PORT) {
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
} else {
  const HOST = "172.25.20.171";
  app.listen(PORT, HOST, () => {
    console.log(`Listening to port ${PORT}`);
  });
}
