import config from './../configs/config.js'
import pkg from 'pg'

const { Pool }  = pkg;
const pool = new Pool(config)

export default class AlumnosRepo{
    getAll = async () => {
        let alumnosArray = null

        try{
            const sql = 'SELECT * FROM alumnos'
            const result = await pool.query(sql)
            alumnosArray = result.rows
            console.log(alumnosArray)
        }
        
        catch(e){
            console.log(e)
        }
        return alumnosArray;
    }
    getDBPool = () => {
        if (this.DBPool == null){
            this.DBPool = new Pool(config);
        }
        return this.DBPool;
    }

    getByIdAsync = async (id) => {
        console.log(`AlumnosRepo.getByIdAsync(${id})`);
        let returnEntity = null;
        try {
            const sql = `SELECT * FROM alumnos WHERE id=$1`;
            const values = [id];
            const resultPg = await this.getDBPool().query(sql, values);
            console.log(resultPg.rows)
            if (resultPg.rows.length > 0){
                returnEntity = resultPg.rows[0];
            }
        } catch (error) {
            console.log('soy un nabo', error);
        } 
        return returnEntity;
    }
    updateAsync = async (entity) => {
        console.log(`AlumnosRepo.updateAsync(${JSON.stringify(entity)})`);
        let rowsAffected = 0;
        let id = entity.id;
        
        try {
            const previousEntity = await this.getByIdAsync(id);
            if (previousEntity== null) return 0;
            const sql = `UPDATE alumnos SET 
                            nombre              = $2, 
                            apellido            = $3, 
                            id_curso            = $4, 
                            fecha_nacimiento    = $5, 
                            hace_deportes       = $6,
                            image              = $7
                        WHERE id = $1`;
                            
            const values =  [   id,     // $1
                                entity?.nombre              ?? previousEntity?.nombre, 
                                entity?.apellido            ?? previousEntity?.apellido, 
                                entity?.id_curso            ?? previousEntity?.id_curso, 
                                entity?.fecha_nacimiento    ?? previousEntity?.fecha_nacimiento, 
                                entity?.hace_deportes       ?? previousEntity?.hace_deportes,
                                entity?.image              ?? previousEntity?.image,
                            ];
            const resultPg = await this.getDBPool().query(sql, values);

            rowsAffected = resultPg.rowCount;
        } catch (error) {
            console.log(error);
        }
        return rowsAffected;
    }


}