import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'antd';
import { useTransform } from '@/hooks/useTransform';
import { Logistic } from '@/models/Logistic';

interface ConfirmDeleteComponentProps {
  visible: boolean;
  record: Logistic;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteComponent: React.FC<ConfirmDeleteComponentProps> = ({
  visible,
  record,
  onConfirm,
  onCancel,
}) => {

  const { t } = useTransform();
  const entity = t('app.movements.inputs.title.full');
  const name = `${record.idSerie} - ${record.numero}`;    

  return (
    <Modal
      title={<FormattedMessage id="modals.delete.title" />}
      open={visible}
      destroyOnClose
      onOk={onConfirm}
      onCancel={onCancel}
      okText={<FormattedMessage id="buttons.delete" />}
      okButtonProps={{ type: 'primary', danger: true }}
      cancelText={<FormattedMessage id="buttons.cancel" />}
    >
      <p>
        <FormattedMessage
          id="modules.modal.delete.content"
          values={{
            entity: entity,
            name: name,
            b: (chunk: React.ReactNode) => <b key="bold-name">{chunk}</b>,
          }}
        />
      </p>
    </Modal>
  );
};

export default ConfirmDeleteComponent;