import React, { useEffect } from 'react';
import { Modal, Button, Form, Input, Switch, Row, Col, Select } from 'antd';
import { FormattedMessage } from "react-intl";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useTransform } from '@/hooks/useTransform';
import { useItemMessage } from '@/hooks/useItemMessage';
import { useGetAllBrandsQuery } from '@/modules/brands/store';
import { useGetModelsByIdBrandQuery } from '@/modules/modelos/store';
import { useGetAllFamiliesQuery } from '@/modules/families/store';
import { useGetAllUnitsQuery } from '@/modules/units/store';
import { Brand } from '@/models/Brand';
import { Product } from '@/models/Product';
import { Modelo } from '@/models/Modelo';
import { Family } from '@/models/Family';
import { Unit } from '@/models/Unit';


const { TextArea } = Input;
const { Option } = Select;

interface FormComponentProps {
  visible: boolean;
  title: string;
  buttonText?: string;
  initialValues?: Product; 
  onSubmit: (values: any) => void;
  onCancel?: () => void   // onCancel
}

export const FormComponent: React.FC<FormComponentProps> = ({ visible, title, initialValues, onSubmit, onCancel }) => {

  const [form] = Form.useForm();
  const { t } = useTransform();
  const getItemMessage = useItemMessage();

  // const selectedBrandId = Form.useWatch('idMarca', form);
  const selectedBrandId = Form.useWatch('idMarca', form) as number | undefined;

  // Si hay valores iniciales (modo edición) se los carga, de lo contrario se reinicia el formulario
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [initialValues, visible, form]);

  const onHandleOk = () => {
    form.validateFields()
      .then(values => {
        onSubmit(values);
      });
  };

  // Carga de marcas
  const { data: brandsData, isLoading: isBrandsLoading } =
    useGetAllBrandsQuery({ page: 0, limit: 50 });
  const brands = brandsData as Brand[];    

  // Carga de modelos por marca
  const skipModels = selectedBrandId == null; // true si undefined o null

  // const { data: modelsByBrandData, error: modelsByBrandError, isLoading: modelsByBrandIsLoading } =
  //   useGetModelsByIdBrandQuery(selectedBrandId as number, { skip: selectedBrandId === null });
  const { data: modelsByBrandData, error: modelsByBrandError, isLoading: modelsByBrandIsLoading } = 
    useGetModelsByIdBrandQuery( selectedBrandId ?? 0, { skip: skipModels });
  const modelos = modelsByBrandData as Modelo[];  

  // Limpieza del campo de modelo cuando cambia la marca
  // useEffect(() => {
  //   form.setFieldsValue({ idModelo: undefined });
  // }, [selectedBrandId, form]);  

  // Carga de families
  const { data: familiesData, isLoading: isFamiliesLoading } =
    useGetAllFamiliesQuery({ page: 0, limit: 50 });
  const families = familiesData as Family[];  
  

  // Carga de units
  const { data: unitsData, isLoading: isUnitsLoading } =
    useGetAllUnitsQuery({ page: 0, limit: 50 });
  const units = unitsData as Unit[];    


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
    >
      <Form form={form} layout="vertical">
        <Form.Item 
          label={t('app.products.form.code')} 
          name="codigo" 
          rules={[{ required: true, message: getItemMessage("app.products.item.code", true) }]}
        >
          <Input placeholder={getItemMessage("app.products.item.code")} />
        </Form.Item>

        <Form.Item 
          label={t('app.products.form.description')}  
          name="descripcion" 
          rules={[{ required: true, message: getItemMessage("app.products.item.description", true) }]}
        >
          <Input placeholder={getItemMessage("app.products.item.description")} />
        </Form.Item>

        <Row gutter={16}>
            <Col span={12}>

                <Form.Item
                    label={t('app.products.header.brand')}
                    name="idMarca"
                    rules={[{ 
                        required: true, 
                        message: t(
                        'modules.form.required.select',{
                            item: t('app.products.item.brand')
                        }) 
                    }]}              
                >

                    <Select 
                        placeholder={t('modules.form.required.select', {
                            item: t('app.products.item.brand').toLocaleLowerCase()
                        })} 
                        loading={isBrandsLoading}
                        onChange={(value: number) => {
                          form.setFieldsValue({
                            idMarca: value,
                            idModelo: undefined
                          });
                        }}
                        value={selectedBrandId}
                    >
                        {brands?.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.nombre}
                        </Option>
                        ))}
                    </Select>

                </Form.Item>  

            </Col>

            <Col span={12}>

                <Form.Item
                    label={t('app.products.form.model')}
                    name="idModelo"
                    rules={[{ 
                        required: true, 
                        message: t(
                        'modules.form.required.select',{
                            item: t('app.products.item.model')
                        }
                        ) 
                    }]}              
                    >

                    <Select 
                        placeholder={t(
                        'modules.form.required.select',{
                            item: t('app.products.item.model').toLocaleLowerCase()
                        })} 
                        loading={modelsByBrandIsLoading}
                        disabled={!selectedBrandId} 
                    >
                        {modelos?.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.nombre}
                        </Option>
                        ))}
                    </Select>

                </Form.Item>

            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>

                <Form.Item
                    label={t('app.products.header.family')}
                    name="idFamilia"
                    rules={[{ 
                        required: true, 
                        message: t(
                        'modules.form.required.select',{
                            item: t('app.products.item.family')
                        }
                        ) 
                    }]}              
                >

                    <Select 
                        placeholder={t(
                        'modules.form.required.select',{
                            item: t('app.products.item.family').toLocaleLowerCase()
                        })} 
                        loading={isFamiliesLoading}>
                        {families?.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.nombre}
                        </Option>
                        ))}
                    </Select>

                </Form.Item>  

            </Col>
            <Col span={12}>

                <Form.Item
                    label={t('app.products.header.unit')}
                    name="idUnidad"
                    rules={[{ 
                        required: true, 
                        message: t(
                        'modules.form.required.select',{
                            item: t('app.products.item.unit')
                        }
                        ) 
                    }]}              
                >

                    <Select 
                        placeholder={t(
                        'modules.form.required.select',{
                            item: t('app.products.item.unit').toLocaleLowerCase()
                        })} 
                        loading={isUnitsLoading}>
                        {units?.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.nombre}
                        </Option>
                        ))}
                    </Select>

                </Form.Item>  

            </Col>            
        </Row>

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
      </Form>
    </Modal>
  );
};

export default FormComponent;
