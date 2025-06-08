export const typeMovementOptions = {
  IC: 'INGRESO POR COMPRA',
  RT: 'DEVOLUCIÓN POR MANTENIMIENTO',
} as const;

// Extraemos la unión de claves ('IC' | 'RT')
export type TypeMovement = keyof typeof typeMovementOptions;

// Creamos un arreglo tipado para iterar en el Select
export const inputTypeMovementSelectOptions: {
  value: TypeMovement;
  label: string;
}[] = Object.entries(typeMovementOptions).map(
  ([value, label]) =>
    ({ value: value as TypeMovement, label })
);
