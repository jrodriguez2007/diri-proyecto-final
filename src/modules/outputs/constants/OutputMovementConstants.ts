export const typeMovementOptions = {
  SV: 'SALIDA POR VENTA',
  SM: 'SALIDA POR MANTENIMIENTO'
} as const;

// Extraemos la unión de claves ('IC' | 'RT')
export type TypeMovement = keyof typeof typeMovementOptions;

// Creamos un arreglo tipado para iterar en el Select
export const outputTypeMovementSelectOptions: {
  value: TypeMovement;
  label: string;
}[] = Object.entries(typeMovementOptions).map(
  ([value, label]) =>
    ({ value: value as TypeMovement, label })
);
