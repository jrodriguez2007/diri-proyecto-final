import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import esMessages from '../../src/lang/es.json'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockProducts } from '../../src/mocks/products'

// 1) Mockeamos la RTK Query completamente, incluyendo useLazyGetProductByIdQuery:
//const triggerGetByIdMock = vi.fn()
const triggerGetByIdMock = vi.fn().mockReturnValue({
  unwrap: () => Promise.resolve(mockProducts[0]), // o lo que necesites
});

vi.mock('../../src/modules/products/store', () => ({
  useGetAllProductsQuery: vi.fn(() => ({
    data: mockProducts,
    isLoading: false,
    error: undefined,
  })),
  // aquí devolvemos nuestro mock:
  useLazyGetProductByIdQuery: vi.fn(() => [ triggerGetByIdMock, { isLoading: false, isError: false } ]),
  // no nos importa el resto:
  useSearchProductsQuery: vi.fn(() => ({ data: [], isLoading: false, error: undefined })),
  useCreateProductMutation: () => [vi.fn()],
  useUpdateProductMutation: () => [vi.fn()],
  useDeleteProductMutation: () => [vi.fn()],
  useUpdateStateProductMutation: () => [vi.fn()],
}))

// 2) Mockeamos el resto de hooks/componentes lazy como antes
vi.mock('../../src/hooks/useTransform', () => ({
  useTransform: () => ({ t: (id: string) => esMessages[id] ?? id })
}))
vi.mock(
  '../../../src/modules/products/components/FormComponent',
  () => ({ default: () => <div data-testid="form-component-mock" /> })
)
vi.mock(
  '../../../src/modules/products/components/ConfirmDeleteComponent',
  () => ({ default: () => <div data-testid="confirm-delete-mock" /> })
)

import { ProductPage } from '../../src/modules/products/pages/ProductPage'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('ProductPage — Editar producto', () => {
  it('al hacer click en Edit, dispara triggerGetProductById con el id correcto', () => {
    render(
      <IntlProvider locale="es" messages={esMessages}>
        <ProductPage />
      </IntlProvider>
    )
    // Esperamos una fila por cada producto
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBeGreaterThan(1) // al menos cabecera+filas

    // Encontramos el primer botón de editar por aria-label="edit"
    const editButtons = screen.getAllByLabelText('edit')
    expect(editButtons.length).toBe(mockProducts.length)

    // Hacemos click en el primer edit
    fireEvent.click(editButtons[0])

    // Y comprobamos que nuestro mock se llamó con el id del primer producto:
    expect(triggerGetByIdMock).toHaveBeenCalledWith(mockProducts[0].id)
  })
})
