import config from '../configs/config.js'
import { ReasonPhrases, StatusCodes} from 'http-status-codes';
import { Router } from 'express';
import AlumnosService from '../services/alumnos-service.js'
import pkg from 'pg'
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = Router()

const { Pool }  = pkg;
const pool = new Pool(config)

let alumnosArray = []
const currentService = new AlumnosService();


router.get('/', async (req, res) => {
    let respuesta;
    const returnArray = await currentService.getAll()
    try{
        respuesta = res.status(StatusCodes.OK).json(returnArray);
    }

    catch(error){
        respuesta = res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
        console.log(error)
    }

    return respuesta
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const id  = req.params.id;
      const dir = path.join(process.cwd(), 'uploads', 'alumnos', id);
      // Crear carpeta si no existe
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      // conservar extensión original si viene (jpg, png, etc)
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, 'photo' + ext);
    }
  });
  
  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Solo se permiten archivos de imagen'), false);
      }
      cb(null, true);
    }
  });
  // END ---------- multer config ----------
  
  // ---------- NUEVA RUTA: subir foto ----------
  router.post('/:id/photo', upload.single('image'), async (req, res) => {
    try {
      const id = req.params.id;
  
      // (opcional) verificar que el alumno exista antes de guardar
      const alumno = await currentService.getByIdAsync(id);
      console.log('alumno',alumno)
      if (!alumno) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send(`No se encontró el alumno (id:${id}).`);
      }
  
      if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST)
          .send('No se recibió el archivo. Usa el campo "image".');
      }
  
      // Ruta relativa y URL pública (ver sección 3)
      const relativePath = path.join('uploads', 'alumnos', id, req.file.filename);
      const publicUrl = `/static/alumnos/${id}/${req.file.filename}`;
  
      // Actualizo el Registro
      alumno.image = publicUrl;
      const rowsAffected = await currentService.updateAsync(alumno);
      if (rowsAffected != 0){
          res.status(StatusCodes.CREATED).json(alumno);
      } else {
          res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${req.body.id}).`);
      }
      
      /*
      return res.status(StatusCodes.CREATED).json({
        id,
        filename: req.file.filename,
        path: relativePath,
        url: publicUrl
      });
      */
    } catch (err) {
      console.error(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error al subir la imagen.');
    }
  });

export default router;