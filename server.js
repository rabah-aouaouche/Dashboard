let express = require("express");
const bodyParser = require("body-parser");
let path = require("path");
const db = require("./db");
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "Views/pages/index"));

//connecetion pool

app.get("/", async (request, response) => {
  const [result, _] = await db.execute("select * from patient");
  const [resultRdv, _rdv] = await db.execute(
    "select count(*) as countRdv from RENDEZ_VOUS"
  );

  response.render("pages/index", { result, resultRdv });
});

app.get("/home", async (request, response) => {
  const [rows, _] = await db.execute("select * from patient");

  response.render("home", { rows });
});

//find users by search

app.post("/", async (request, response) => {
  console.log(request.body);
  const [rows, _] = await db.execute(
    `select * from patient where NOMP like '%${request.body.search}%'`
  );

  response.render("home", { rows });
});

//ADD NEW PATIENT
app.get("/addpatient", async (request, response) => {
  response.render("add-patient");
});

app.post("/addpatient", async (request, response) => {
  const {
    NOMP,
    PRENOMP,
    DATE_DE_NAISSANCE,
    AGEP,
    SEXEP,
    ADRESSE,
    VILLE,
    NUM_TEL,
  } = request.body;
  console.log(request.body);
  const [rows, _] = await db.execute(
    `INSERT INTO patient(NOMP,PRENOMP,DATE_DE_NAISSANCE,AGEP,SEXEP,ADRESSE,VILLE,NUM_TEL) VALUES('${NOMP}','${PRENOMP}','${DATE_DE_NAISSANCE}','${AGEP}','${SEXEP}','${ADRESSE}','${VILLE}','${NUM_TEL}')`
  );

  response.redirect("/home");
});

// edit patient information

app.get("/editpatient/:id", async (request, response) => {
  const [rows, _] = await db.execute("select * from patient where id = ?", [
    request.params.id,
  ]);
  response.render("edit-patient", { rows });
});

app.post("/editpatient/:id", async (request, response) => {
  const {
    NOMP,
    PRENOMP,
    DATE_DE_NAISSANCE,
    AGEP,
    SEXEP,
    ADRESSE,
    VILLE,
    NUM_TEL,
  } = request.body;
  console.log(request.body);
  const [rows, _] = await db.execute(
    "UPDATE patient SET NOMP = ?, PRENOMP = ?, DATE_DE_NAISSANCE = ?, AGEP = ?, SEXEP = ?, ADRESSE = ?, VILLE = ?, NUM_TEL =? WHERE id = ?",
    [
      NOMP,
      PRENOMP,
      new Date(DATE_DE_NAISSANCE),
      AGEP,
      SEXEP,
      ADRESSE,
      VILLE,
      NUM_TEL,
      request.params.id,
    ]
  );
  response.status(202).redirect("/home");
});

// delete patient
app.delete("/home/:id", async (request, response) => {
  await db.execute("DELETE FROM patient WHERE id = ?", [request.params.id]);
  response.status(202).redirect("/home");
});

// view patient

app.get("/viewpatient/:id", async (request, response) => {
  const [rows, _] = await db.execute("SELECT * FROM patient WHERE id = ?", [
    request.params.id,
  ]);
  response.render("view-patient", { rows });
});

app.get("/RDV", async (request, response) => {
  const [rows, _] = await db.execute("select * from RENDEZ_VOUS");

  response.render("RDV", { rows });
});

//ADD RENDEZ_VOUS
app.get("/addrendezvous", async (request, response) => {
  response.render("addrdv");
});

app.post("/addrdv", async (request, response) => {
  const { ID_PATIENT, DATE_RDV, HEURE_RDV, PRIS_EN_CHARGE, DESCR } =
    request.body;
  console.log(request.body);
  const [rows, _] = await db.execute(
    `INSERT INTO RENDEZ_VOUS(ID_PATIENT,DATE_RDV,HEURE_RDV,PRIS_EN_CHARGE,DESCR) VALUES('${ID_PATIENT}','${DATE_RDV}','${HEURE_RDV}','${PRIS_EN_CHARGE}','${DESCR}')`
  );

  response.redirect("/RDV");
});

// delete rendez-vous

app.delete("/RDV/:id", async (request, response) => {
  await db.execute("DELETE FROM RENDEZ_VOUS WHERE id =?", [request.params.id]);
  response.status(202).redirect("/RDV");
});

app.listen(5000);
