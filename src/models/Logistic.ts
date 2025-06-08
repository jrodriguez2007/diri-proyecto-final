import { LogisticDetail } from "./LogisticDetail";

export interface Logistic {
    id:            string;
    idDocumento:       string;
    idSerie:           string;
    numero?:            string;
    fechaDocumento:    string;
    idTipoMovimiento:  string;
    tipoMovimiento?:    string;
    idOperador:        string;
    idAlmacen:         number;
    almacen?:           string;
    idResponsable:     number;
    documentoResponsable?:     string;
    responsable?:       string;
    glosa?:             string;
    activo:            boolean;
    idUsuarioRegistro: string;
    idUsuarioEdicion:  string;
    detalle:           LogisticDetail[];
}