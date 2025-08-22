import 'dotenv/config'
import express  from "express"; // hacer npm i express
import cors     from "cors";    // hacer npm i cors
import config from './configs/config.js'
import AlumnosRouter from './routers/alumnos-router.js'
import path     from 'path';


const app  = express();
const port = 3000;

let cwd = process.cwd();    // Current Working Directory
app.use('/static', express.static(path.join(cwd, 'uploads')));

app.use(cors());         // Middleware de CORS
app.use(express.json()); // Middleware para parsear y comprender JSON
app.use("/api/alumnos", AlumnosRouter)

// Inicio el Server y lo pongo a escuchar.

app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`)
})