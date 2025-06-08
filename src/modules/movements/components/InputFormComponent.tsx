import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Switch, Row, Col, Select, DatePicker } from 'antd';
import { FormattedMessage } from "react-intl";
import { CheckOutlined, CloseOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useTransform } from '@/hooks/useTransform';
import { useItemMessage } from '@/hooks/useItemMessage';
import { useGetSeriesByIdDocumentQuery } from '@/modules/series/store';
import { useGetAllWarehousesQuery } from '@/modules/warehouses/store';
import { useLazyGetPersonByDocumentQuery  } from '@/modules/suppliers/store';
import { useLazyGetProductByCodeQuery } from '@/modules/products/store';
import { Logistic } from '@/models/Logistic';
import { Serie } from '@/models/Serie';
import { Warehouse } from '@/models/Warehouse';
import { inputTypeMovementSelectOptions, TypeMovement } from '../constants/TypeMovementConstants';
import { Person } from '@/models/Person';
import { LogisticDetail } from '@/models/LogisticDetail';
import { DetailComponent } from './DetailComponent';
import { Product } from '@/models/Product';
import LoggerService from '@/providers/LoggerService';


const { Option } = Select;

interface InputFormComponentProps {
  visible: boolean;
  title: string;
  buttonText?: string;
  initialValues?: Logistic; 
  onSubmit: (values: any) => void;
  onCancel?: () => void   // onCancel
}

export const InputFormComponent: React.FC<InputFormComponentProps> = ({ visible, title, initialValues, onSubmit, onCancel }) => {

  const [form] = Form.useForm();
  const { t } = useTransform();
  const getItemMessage = useItemMessage();

  const [triggerGetPerson] = useLazyGetPersonByDocumentQuery();
  const [triggerGetProduct] = useLazyGetProductByCodeQuery();

  // States para detalle
  const [foundProduct, setFoundProduct] = useState<Product | null>(null);
  const [searchProductCode, setSearchProductCode] = useState('');
  const [searchQuantity, setSearchQuantity] = useState(1);
  const [detailError, setDetailError] = useState('');

  // Si hay valores iniciales (modo edición) se los carga, de lo contrario se reinicia el formulario
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
            ...initialValues,
            fechaDocumento: initialValues.fechaDocumento
                ? dayjs(initialValues.fechaDocumento, 'YYYY-MM-DD')
                : undefined,
        });
      } else {
        // reset + valores por defecto en creación
        form.resetFields();
        form.setFieldsValue({
            numero: '',
            idOperador: '+',
            idDocumento: 'PE',
            detalle: [],
            fechaDocumento: dayjs(),  
            activo: true,
        });
      }
    }
  }, [initialValues, visible, form]);

  const onHandleOk = () => {
    form.validateFields()
      .then(values => {
        const payload = {
          ...values,
          fechaDocumento: values.fechaDocumento.format('YYYY-MM-DD'),
        };        
        onSubmit(payload);
      });
  };

  const onSearchSupplier = async () => {
    const numero = form.getFieldValue('ruc');
    console.log({numero});
    if (!numero) return;
    try {
        // name-match: personType y documentNumber, tal como definiste en SuppliersApi.ts
        const person = (await triggerGetPerson({
            personType: 'J',
            documentNumber: numero,
        }).unwrap()) as Person;      // <-- aquí el `as Person`

        form.setFieldsValue({ razonSocial: person.razonSocial });
        form.setFieldsValue({ idResponsable: person.id });
    } catch (err) {
        console.error('No se encontró proveedor', err);
    }
  };  

  // Carga de series
  const { data: seriesData, isLoading: isSeriesLoading } =
    useGetSeriesByIdDocumentQuery("PE");
  const series = seriesData as Serie[];    

  // Carga de proveedores
  const { data: warehousesData, isLoading: isWarehousesLoading } =
    useGetAllWarehousesQuery({ page: 0, limit: 50 });
  const warehouses = warehousesData as Warehouse[];   
  
  // --- Funciones de búsqueda y añadido de detalle ---
  const searchProduct = async () => {
    setDetailError("");
    const code = searchProductCode.trim();
    if (!code) {
      setDetailError(
        t("modules.form.required.input", {
          item: t("app.movements.inputs.label.code"),
        })
      );
      return;
    }
    try {
      const product = (await triggerGetProduct(code).unwrap()) as Product;
      setFoundProduct(product);
    } catch {
      setFoundProduct(null);
      setDetailError(t("error.data"));
    }
  };  

  // Añadir detalle
  const addDetail = () => {

    LoggerService.warn("Adición de detalle");
    LoggerService.debug(foundProduct.descripcion);
    LoggerService.debug("searchQuantity: " + searchQuantity);
    
    if (!foundProduct) {
      setDetailError(
        t("modules.form.required.input", {
          item: t("app.movements.inputs.detail.code"),
        })
      );
      return;
    }
    if (searchQuantity < 1) {
      setDetailError(
        t("modules.form.required.message", {
          item: t("app.movements.inputs.detail.quantity"),
        })
      );
      return;
    }
    const current: LogisticDetail[] = form.getFieldValue("detalle") || [];

    // Comprobamos si ya existe el producto en la lista —
    const exists = current.some((d) => d.idProducto === foundProduct.id);
    if (exists) {
      setDetailError(
        t("modules.form.duplicate", {
          item: t("app.products.title.full"),
        })
      );
      setFoundProduct(null);
      return;
    }


    const nextId = current.length + 1;
    const newItem: LogisticDetail = {
      idLinea: nextId,
      idProducto: foundProduct.id,
      codigo: foundProduct.codigo,
      descripcionExtendida: foundProduct.descripcion,
      marca: foundProduct.marca,
      modelo: foundProduct.modelo,
      unidad: foundProduct.unidad,
      cantidad: searchQuantity,
    };
    form.setFieldsValue({ detalle: [...current, newItem] });
    // limpia sólo la fila de búsqueda
    setSearchProductCode("");
    setFoundProduct(null);
    setSearchQuantity(1);
  };  

  return (
    <Modal
      title={title}
      open={visible}
      destroyOnClose={true}
      onOk={onHandleOk}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          <FormattedMessage id="buttons.cancel" />
        </Button>,
        <Button key="ok" type="primary" onClick={onHandleOk}>
          <FormattedMessage id="buttons.save" />
        </Button>,
      ]}
      width={900}
    >
      <Form form={form} layout="vertical">

        <Form.Item name="numero" hidden>
            <Input />
        </Form.Item>
        <Form.Item name="idOperador" hidden>
            <Input />
        </Form.Item>
        <Form.Item name="idDocumento" hidden>
            <Input />
        </Form.Item>
        <Form.Item name="idResponsable" style={{ display: 'none' }}>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="detalle" style={{ display: 'none' }}>
            <Input type="hidden" />
        </Form.Item>

        <Row gutter={16}>
            <Col span={12}>

                <Form.Item
                    label={t('app.movements.inputs.form.series')}
                    name="idSerie"
                    rules={[{ 
                        required: true, 
                        message: t(
                        'modules.form.required.select',{
                            item: t('app.movements.inputs.item.series')
                        }) 
                    }]}              
                >

                    <Select 
                        placeholder={t('modules.form.required.select', {
                            item: t('app.movements.inputs.item.series').toLocaleLowerCase()
                        })} 
                        loading={isSeriesLoading}
                    >
                        {series?.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.idSerie}
                        </Option>
                        ))}
                    </Select>

                </Form.Item>  

            </Col>
            <Col span={12}>

                <Form.Item 
                    label={t('app.movements.inputs.form.documentDate')} 
                    name="fechaDocumento" 
                    rules={[{ required: true, message: getItemMessage("app.movements.inputs.item.documentDate", true) }]}
                >
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      placeholder={t('modules.form.required.select', {
                            item: t('app.movements.inputs.item.documentDate').toLocaleLowerCase()
                        })} 
                    />
                </Form.Item>

            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>

                <Form.Item
                    label={t('app.movements.inputs.form.type')}
                    name="idTipoMovimiento"
                    rules={[{ 
                        required: true, 
                        message: t(
                        'modules.form.required.select',{
                            item: t('app.movements.inputs.item.type')
                        }) 
                    }]}              
                >

                    <Select 
                        placeholder={t('modules.form.required.select', {
                            item: t('app.movements.inputs.item.type').toLocaleLowerCase()
                        })} 
                    >
                        {inputTypeMovementSelectOptions.map(({ value, label }) => (
                        <Option key={value} value={value}>
                            {label}
                        </Option>
                        ))}                        
                    </Select>

                </Form.Item>                          

            </Col>
            <Col span={12}>

                <Form.Item
                    label={t('app.movements.inputs.form.warehouse')}
                    name="idAlmacen"
                    rules={[{ 
                        required: true, 
                        message: t(
                        'modules.form.required.select',{
                            item: t('app.movements.inputs.item.warehouse')
                        }) 
                    }]}              
                >

                    <Select 
                        placeholder={t('modules.form.required.select', {
                            item: t('app.movements.inputs.item.warehouse').toLocaleLowerCase()
                        })} 
                        loading={isWarehousesLoading}
                    >
                        {warehouses?.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.nombre}
                        </Option>
                        ))}
                    </Select>

                </Form.Item>  

            </Col>
        </Row>

        <Form.Item
            className='div-fixed'
            label={t('app.movements.inputs.form.supplier')}
            required
        >
            <Row gutter={16}>
                <Col span={5}>
                    <Form.Item
                            name="ruc"
                            noStyle
                            rules={[{ required: true, message: getItemMessage("app.movements.inputs.header.ruc", true) }]}            
                    >
                        {/* <Input placeholder={t("app.movements.inputs.header.ruc")} /> */}
                        <Input.Search
                          placeholder={t('app.movements.inputs.header.ruc')}
                          enterButton={<SearchOutlined />}
                          onSearch={async (value) => {
                            setDetailError('');
                            form.setFieldsValue({ ruc: value });
                            await onSearchSupplier();
                          }}            
                        />                        
                    </Form.Item>
                </Col> 
                {/* <Col span={2}>
                    <Button 
                        block 
                        icon={<SearchOutlined />} 
                        onClick={onSearchSupplier} />
                </Col>                   */}
                <Col span={19}>
                    <Form.Item>
                        <Input 
                          className="disabled-input"
                          value={form.getFieldValue('razonSocial')}
                          readOnly />
                    </Form.Item>
                </Col>                   
            </Row>
        </Form.Item>

        <Form.Item 
          label={t('app.movements.inputs.form.gloss')}  
          name="glosa" 
          rules={[{ required: true, message: getItemMessage("app.movements.inputs.item.gloss", true) }]}
        >
          <Input placeholder={getItemMessage("app.movements.inputs.item.gloss")} />
        </Form.Item>

        <Form.Item 
          label={t('app.products.form.active')} 
          name="activo" 
          valuePropName="checked"
        >
          <Switch
            defaultChecked
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
          />
        </Form.Item>

        {/* —— AQUÍ va la fila de búsqueda de producto —— */}
        <div style={{ marginBottom: 16 }}>
          {/* 1) Row alineado en medio */}
          <Row gutter={16} align="middle">
            {/* 2) Código con Input.Search */}
            <Col span={6}>
              <Form.Item
                label={t('app.movements.inputs.detail.product') + ':'}
                required
                // noStyle si no quieres margen extra
              >
                <Input.Search
                  value={searchProductCode}
                  onChange={e => {
                    setDetailError('');        
                    setSearchProductCode(e.target.value)
                  }}
                  placeholder={t('app.movements.inputs.label.code')}
                  enterButton={<SearchOutlined />}
                  onSearch={searchProduct}
                />
              </Form.Item>
            </Col>

            {/* 3) Descripción */}
            <Col span={8}>
              <Form.Item label={t('app.movements.inputs.detail.description')}>
                <Input
                  className='disabled-input'
                  value={foundProduct?.descripcion || ''}
                  readOnly
                />
              </Form.Item>
            </Col>

            {/* 4) Cantidad */}
            <Col span={4}>
              <Form.Item label={t('app.movements.inputs.detail.quantity')}>
                <Input
                  type="number"
                  min={1}
                  value={searchQuantity}
                  onChange={e => setSearchQuantity(Number(e.target.value))}
                />
              </Form.Item>
            </Col>

            {/* 5) Botón Agregar */}
            <Col span={4}>
              <Form.Item>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addDetail}
                >
                  {t('app.buttons.add')}
                </Button>
              </Form.Item>
            </Col>
          </Row>

          {/* Mensaje de error de detalle */}
          {detailError && (
            <div style={{ color: 'red', marginTop: 4 }}>
              {detailError}
            </div>
          )}
        </div>

        {/* —— Tabla de detalle —— */}
        <Form.Item noStyle shouldUpdate>
            {() => {
                const detalle = form.getFieldValue('detalle') as LogisticDetail[];

                const removeLinea = (idLinea: number) => {
                    const current: LogisticDetail[] = form.getFieldValue("detalle") || [];
                    // Filtramos la línea eliminada
                    const filtered = current.filter((d) => d.idLinea !== idLinea);
                    // Reindexamos para que vuelvan a ser 1,2,3...
                    const reindexed = filtered.map((d, i) => ({
                        ...d,
                        idLinea: i + 1,
                    }));
                    form.setFieldsValue({ detalle: reindexed });
                    setDetailError('');   
                };

                return <DetailComponent  data-testid="detail-container" detalle={detalle} onRemove={removeLinea} />;
            }}
        </Form.Item>
                
      </Form>
    </Modal>
  );
};

export default InputFormComponent;
