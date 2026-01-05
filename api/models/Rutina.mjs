export default class Rutina {
    constructor(id, nombre, descripcion, ejercicios = []) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.ejercicios = ejercicios; 
    }
}