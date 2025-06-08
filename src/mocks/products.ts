import { Product } from '../models/Product';

export const mockProducts: Product[] = [
  {
    id: 1,
    codigo: 'PROD001',
    descripcion: 'SAMSUNG ODYSSEY LS27CG552EUXEN 27" LED QHD 165HZ FREESYNC CURVO',
    idMarca: 1,
    marca: 'SAMSUNG',
    idModelo: 1,
    modelo: 'ODYSSEY',
    idFamilia: 3,
    familia: 'MONITORES LED',
    idUnidad: 8,
    unidad: 'UNIDAD ',
    activo: true,
    idUsuarioRegistro: "admin"
  },
  {
    id: 2,
    codigo: 'PROD002',
    descripcion: 'SAMSUNG 49" OLED - ODYSSEY OLED G9 G91SD S49DG910SU',
    idMarca: 1,
    marca: 'SAMSUNG',
    idModelo: 2,
    modelo: 'FREESYNC CURVO',
    idFamilia: 3,
    familia: 'MONITORES LED',
    idUnidad: 8,
    unidad: 'UNIDAD ',
    activo: true,
    idUsuarioRegistro: "admin"
  },
  {
    id: 3,
    codigo: 'PROD003',
    descripcion: "MONITOR LG ULTRAWIDE 34' CURVO, VA, WQHD, 100 HZ, 21:9",
    idMarca: 1,
    marca: 'SAMSUNG',
    idModelo: 2,
    modelo: 'FREESYNC CURVO',
    idFamilia: 4,
    familia: 'MONITORES LCD',
    idUnidad: 3,
    unidad: 'DOCENA',
    activo: true,
    idUsuarioRegistro: "admin"
  }
];
