import React from 'react';
import { Button } from 'antd';

interface ButtonTemplateProps {
    text: string; // Texto del botón
    icon?: React.ReactNode; // Ícono opcional (de Ant Design)
    onClick: () => void; // Función que se ejecuta al hacer clic
}

export const ButtonTemplate: React.FC<ButtonTemplateProps> = ({ text, icon, onClick }) => {
    return (
        <>
            <Button
                onClick={onClick}
                icon={icon}
            >
                {text}
            </Button>

        </>
    );
};