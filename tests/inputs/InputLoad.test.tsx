// tests/movements/InputLoad.test.tsx

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import esMessages from '../../src/lang/es.json'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { mocInputs as mockInputs } from '../../src/mocks/inputs'

// 1) Mockeo de nuestro hook de traducción
vi.mock('../../src/hooks/useTransform', () => ({
  useTransform: () => ({ t: (id: string) => id })
}))

// 2) Mockeo de RTK-Query hooks de store de inputs (para evitar el “no redux context”)
vi.mock('../../src/modules/movements/store', () => ({
  useGetAllMovementInputsQuery: vi.fn(() => ({
    data: mockInputs,
    isLoading: false,
    error: undefined,
  })),
  useSearchInputsQuery: vi.fn(() => ({
    data: mockInputs,
    isLoading: false,
    error: undefined,
  })),
  // Además stubeamos estos para que useInputHandlers no falle
  useLazyGetInputByIdQuery: vi.fn(() => [() => ({ unwrap: async () => mockInputs[0] })]),
  useCreateInputMutation:        vi.fn(() => [() => ({ unwrap: async () => mockInputs[0] })]),
  useUpdateInputMutation:        vi.fn(() => [() => ({ unwrap: async () => mockInputs[0] })]),
  useDeleteInputMutation:        vi.fn(() => [() => ({ unwrap: async () => {}            })]),
  useUpdateStateInputMutation:   vi.fn(() => [() => ({ unwrap: async () => mockInputs[0] })]),
  useDeleteMovementInputMutation:vi.fn(() => [() => ({ unwrap: async () => {}            })]),
}))

// 3) Mockeo de hooks de negocio (useInputHandlers, columnas y búsqueda) para no invocar lógica pesada
vi.mock('../../src/modules/movements/hooks', () => ({
  useInputHandlers: () => ({
    handleCreate:      vi.fn(),
    handleEdit:        vi.fn(),
    handleFormSubmit:  vi.fn(),
    handleDelete:      vi.fn(),
    confirmDelete:     vi.fn(),
    handleUpdateState: vi.fn(),
    handleDeleteInput: vi.fn(),
  }),
  useInputColumns: () => [
    { title: 'Nº',         dataIndex: 'numero', key: 'numero' },
    { title: 'Fecha',      dataIndex: 'fechaDocumento', key: 'fechaDocumento' },
    { title: 'Movimiento', dataIndex: 'tipoMovimiento',  key: 'tipoMovimiento' },
    { title: 'Responsable',dataIndex: 'responsable',     key: 'responsable' },
  ],
  useInputSearch: vi.fn(() => ({
    data: mockInputs,
    isLoading: false,
    error: undefined,
  })),
}))

// 4) Mockeo de endpoints auxiliares (series, almacenes, proveedores, productos)
vi.mock('../../src/modules/series/store', () => ({
  useGetSeriesByIdDocumentQuery: () => ({ data: [], isLoading: false }),
}))
vi.mock('../../src/modules/warehouses/store', () => ({
  useGetAllWarehousesQuery: () => ({ data: [], isLoading: false }),
}))
vi.mock('../../src/modules/suppliers/store', () => ({
  useLazyGetPersonByDocumentQuery: vi.fn(() => [() => ({ unwrap: async () => ({ documentoResponsable: 'X' }) })]),
}))
vi.mock('../../src/modules/products/store', () => ({
  useLazyGetProductByCodeQuery: vi.fn(() => [() => ({ unwrap: async () => ({ codigo: 'P', cantidad: 1 }) })]),
}))

// 5) Importa **después** de todos los mocks
import { InputPage } from '../../src/modules/movements/pages/InputPage'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('InputPage — Renderizado inicial', () => {


  it('Debe de mostrarse correctamente con valores por defecto', () => {
    const { container } = render(
      <IntlProvider locale="es" messages={esMessages}>
        <InputPage />
      </IntlProvider>
    )   
    expect( container ).toMatchSnapshot();
  }); 

  it('muestra el título y la tabla con los movimientos de ingreso', () => {
    render(
      <IntlProvider locale="es" messages={esMessages}>
        <InputPage />
      </IntlProvider>
    )

    // A) Título
    expect(screen.getByText(esMessages['app.movements.inputs.title'])).toBeInTheDocument()
    expect(screen.getByText(esMessages['buttons.new'])).toBeInTheDocument()
    // C) La tabla aparece y tiene tantas filas de cuerpo como movimientos
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    const bodyRows = table.querySelectorAll('tbody tr')
    expect(bodyRows).toHaveLength(mockInputs.length)

    expect(screen.getByText('Nº')).toBeInTheDocument()
    expect(screen.getByText('Fecha')).toBeInTheDocument()
    expect(screen.getByText('Movimiento')).toBeInTheDocument()
    expect(screen.getByText('Responsable')).toBeInTheDocument()  

  })


})
