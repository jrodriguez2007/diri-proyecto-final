import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import esMessages from '../../src/lang/es.json'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mocInputs as mockInputs} from '../../src/mocks/inputs'  // ← tu array de registros de movimiento


vi.mock('../../src/modules/movements/store', async (importOriginal) => {
  const actual = await importOriginal<any>()
  return {
    ...actual,
    useGetAllMovementInputsQuery: () => ({
      data: mockInputs,
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
  '../../../src/modules/movements/components/InputFormComponent',
  () => ({ __esModule: true, default: () => <div data-testid="input-form-mock" /> })
)
vi.mock(
  '../../../src/modules/movements/components/ConfirmDeleteComponent',
  () => ({ __esModule: true, default: () => <div data-testid="confirm-delete-mock" /> })
)

// 4) Aquí preparamos nuestro handleDeleteMock y mockeamos los hooks de handlers
const handleDeleteMock = vi.fn()
vi.mock('../../src/modules/movements/hooks', () => ({
  useInputSearch: () => ({ data: [], isLoading: false, error: undefined }),
  useInputColumns: () => [
    { title: 'Serie', dataIndex: 'idSerie', key: 'idSerie' },
    { title: 'Número', dataIndex: 'numero', key: 'numero' },
    // ... las demás columnas que uses
  ],
  useInputHandlers: () => ({
    handleCreate: vi.fn(),
    handleEdit: vi.fn(),
    handleFormSubmit: vi.fn(),
    handleDelete: handleDeleteMock,    // ← nuestro spy
    confirmDelete: vi.fn(),
    handleUpdateState: vi.fn(),
  }),
}))

// 5) Importa **después** de los mocks
import { InputPage } from '../../src/modules/movements/pages/InputPage'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('InputPage — handleDelete', () => {
  it('al hacer click en Delete invoca handleDelete una vez con (record, setSel, setVisible)', () => {
    render(
      <IntlProvider locale="es" messages={esMessages}>
        <InputPage />
      </IntlProvider>
    )

    // Localiza todos los iconos de delete
    const deleteButtons = screen.getAllByLabelText('delete')
    expect(deleteButtons).toHaveLength(mockInputs.length)

    // Haz click en el segundo registro (index 1)
    fireEvent.click(deleteButtons[1])

    // handleDeleteMock debe haberse llamado exactamente 1 vez
    expect(handleDeleteMock).toHaveBeenCalledTimes(1)

    // Y con los tres argumentos:
    const [callRecord, callSetSelected, callSetVisible] = handleDeleteMock.mock.calls[0]
    expect(callRecord).toEqual(mockInputs[1])
    expect(typeof callSetSelected).toBe('function')
    expect(typeof callSetVisible).toBe('function')
  })
})