// tests/products/ProductLoad.test.tsx

import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import esMessages from '../../src/lang/es.json' 
import { afterEach, describe, expect, it, vi } from 'vitest'

import { mockProducts } from '../../src/mocks/products';

// vi.mock('react-intl', async (importOriginal) => {
//   const actual = await importOriginal<typeof import('react-intl')>()

//   return {
//     ...actual,
//     useIntl: () => ({
//       formatMessage: ({ id }) => id,
//     }),
//     FormattedMessage: ({ id }: { id: string }) => <>{id}</>,
//   }
// })

vi.mock('../../src/hooks/useTransform', () => ({
  useTransform: () => ({ t: (id: string) => id })
}))

// 1) Mocks de los subcomponentes lazy:
vi.mock(
  '../../../src/modules/products/components/FormComponent',
  () => ({ default: () => <div data-testid="form-component-mock" /> })
)
vi.mock(
  '../../../src/modules/products/components/ConfirmDeleteComponent',
  () => ({ default: () => <div data-testid="confirm-delete-mock" /> })
)

// 2) Mock del store y hooks (igual que antes):
vi.mock('../../src/modules/products/store', () => ({
  useGetAllProductsQuery: vi.fn(() => ({
    data: mockProducts,
    isLoading: false,
    error: undefined,
  })),
}))
vi.mock('../../src/modules/products/hooks', () => ({
  useProductSearch: vi.fn(() => ({ data: [], isLoading: false, error: undefined })),
  productHandlers: vi.fn(() => ({
    handleCreate: vi.fn(),
    handleEdit: vi.fn(),
    handleFormSubmit: vi.fn(),
    handleDelete: vi.fn(),
    confirmDelete: vi.fn(),
    handleUpdateState: vi.fn(),
  })),
  useProductColumns: vi.fn(() => [
    { title: 'Código', dataIndex: 'codigo', key: 'codigo' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
  ]),
}))

// 3) Importa el componente **ya** con los lazy components mockeados
import { ProductPage } from '../../src/modules/products/pages/ProductPage'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('ProductPage — Renderizado inicial', () => {


  it('Debe de mostrarse correctamente con valores por defecto', () => {
    const { container } = render(
      <IntlProvider locale="es" messages={esMessages}>
        <ProductPage />
      </IntlProvider>
    )   
    expect( container ).toMatchSnapshot();
  });    

  it('muestra el título y la tabla con contenido', () => {

    const { container } = render(
      <IntlProvider locale="es" messages={esMessages}>
        <ProductPage />
      </IntlProvider>
    )    

    // A) El título internacionalizado "Productos"
    expect(screen.getByText(esMessages['app.products.title'])).toBeInTheDocument()
    expect(screen.getByText(esMessages['buttons.new'])).toBeInTheDocument()

    // B) La tabla aparece
    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    // C) Las cabeceras moquedas
    expect(screen.getByText(esMessages['app.products.header.code'])).toBeInTheDocument()
    expect(screen.getByText(esMessages['app.products.header.description'])).toBeInTheDocument()    

    // D) Sin filas
    const tbody = table.querySelector('tbody')
    expect(tbody!.children.length).toBe(mockProducts.length)
  })
})