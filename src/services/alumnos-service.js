import AlumnosRepo from '../repos/alumnos-repo.js'

export default class AlumnosService{


    getAll = async () => {
        const repo = new AlumnosRepo();
        const returnArray = await repo.getAll()
        console.log(returnArray)
        return returnArray
    }

    getByIdAsync = async (id) => {
        console.log(`AlumnosService.getByIdAsync(${id})`);
        const repo = new AlumnosRepo();
        const returnEntity = await repo.getByIdAsync(id);
        return returnEntity;
    }

    updateAsync = async (entity) => {
        console.log(`AlumnosService.updateAsync(${JSON.stringify(entity)})`);
        const repo = new AlumnosRepo();
        const rowsAffected = await repo.updateAsync(entity);
        return rowsAffected;
    }
    

}