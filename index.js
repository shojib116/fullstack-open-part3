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

const generateID = () => {
  const max = 9999999999;
  const min = 1111111111;
  return Math.round(Math.random() * (max - min) + min);
};

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

app.delete("/api/persons/:id", (request, response) => {
  Persons.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      response.status(400).end({ error: "invalid id" });
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

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
