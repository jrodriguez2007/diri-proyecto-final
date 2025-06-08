export interface Inventory {
    id:             number,
    idAlmacen:      number;
    almacen:        string;
    fechaActual:    Date;
    idProducto:     number;
    codigoProducto: string;
    descripcion:    string;
    unidad:         string;
    marca:          string;
    modelo:         string;
    stock:          number;
}
