import React from 'react';
import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

{/* PROPS */ }
interface SwitchTemplateProps {
    checked?: boolean; // Estado inicial del switch
    disabled?: boolean; // Deshabilitar el switch
    label?: string; // Etiqueta opcional para el switch
    onChange?: (checked: boolean) => void; // Callback al cambiar el estado
}


{/* COMPONENTE */ }
export const SwitchTemplate: React.FC<SwitchTemplateProps> = ({ checked = false, disabled = false, label, onChange }) => {
    return (
        <div className="flex items-center space-x-2">
            {label && <span>{label}</span>}
            <Switch
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                checkedChildren={<CheckOutlined />} // Ícono cuando está activo
                unCheckedChildren={<CloseOutlined />} // Ícono cuando está inactivo
            />
        </div>
    );
};
