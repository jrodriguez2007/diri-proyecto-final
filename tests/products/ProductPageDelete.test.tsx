// tests/products/ProductPageHandleDelete.test.tsx
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import esMessages from '../../src/lang/es.json'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockProducts } from '../../src/mocks/products'

// 1) Mock parcial del store para no necesitar Provider
vi.mock('../../src/modules/products/store', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return {
    ...actual,
    useGetAllProductsQuery: () => ({
      data: mockProducts,
      isLoading: false,
      error: undefined,
    }),
  }
})

// 2) Mock de useTransform para las traducciones
vi.mock('../../src/hooks/useTransform', () => ({
  useTransform: () => ({ t: (id: string) => esMessages[id] ?? id })
}))

// 3) Mock de los componentes lazy
vi.mock(
  '../../../src/modules/products/components/FormComponent',
  () => ({ __esModule: true, default: () => <div data-testid="form-component-mock" /> })
)
vi.mock(
  '../../../src/modules/products/components/ConfirmDeleteComponent',
  () => ({ __esModule: true, default: () => <div data-testid="confirm-delete-mock" /> })
)

// 4) Aquí preparamos nuestro handleDeleteMock y mockeamos productHandlers
const handleDeleteMock = vi.fn()
vi.mock('../../src/modules/products/hooks', () => ({
  useProductSearch: () => ({ data: [], isLoading: false, error: undefined }),
  useProductColumns: () => [
    { title: 'Código', dataIndex: 'codigo', key: 'codigo' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
  ],
  productHandlers: () => ({
    handleCreate: vi.fn(),
    handleEdit: vi.fn(),
    handleFormSubmit: vi.fn(),
    handleDelete: handleDeleteMock,        // ← nuestro spy
    confirmDelete: vi.fn(),
    handleUpdateState: vi.fn(),
  }),
}))

// 5) Importa **después** de los mocks
import { ProductPage } from '../../src/modules/products/pages/ProductPage'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('ProductPage — handleDelete', () => {
  it('al hacer click en Delete invoca handleDelete una vez con (record, setSel, setVisible)', () => {
    render(
      <IntlProvider locale="es" messages={esMessages}>
        <ProductPage />
      </IntlProvider>
    )

    // Localiza todos los iconos de delete
    const deleteButtons = screen.getAllByLabelText('delete')
    expect(deleteButtons).toHaveLength(mockProducts.length)

    // Haz click en el segundo producto (index 1)
    fireEvent.click(deleteButtons[1])

    // handleDeleteMock debe haberse llamado exactamente 1 vez
    expect(handleDeleteMock).toHaveBeenCalledTimes(1)

    // Y con los tres argumentos: 
    //   * el objeto Product, 
    //   * una función para setSelectedRecord, 
    //   * y otra para toggle de modal
    const [callRecord, callSetSelected, callSetVisible] = handleDeleteMock.mock.calls[0]
    expect(callRecord).toEqual(mockProducts[1])
    expect(typeof callSetSelected).toBe('function')
    expect(typeof callSetVisible).toBe('function')
  })
})
