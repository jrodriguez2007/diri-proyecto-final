
export interface Product {
    id:        number;
    codigo:            string;
    descripcion:       string;
    idMarca:           number;
    marca?:             string;
    idModelo:          number;
    modelo?:            string;
    idFamilia:         number;
    familia?:           string;
    idUnidad:          number;
    unidad?:            string;
    activo:            boolean;   
    idUsuarioRegistro?: string;
    idUsuarioEdicion?:  string;
}
