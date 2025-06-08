import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useLoginMutation } from '@/modules/auth/store'; 
import { LoginResponse } from '@/modules/auth/store';  // importa la interfaz
import LoggerService from '@/providers/LoggerService';

import bgImage from '@/assets/bg-01.jpg';  
import '@/modules/auth/styles/auth.css'
import '@/modules/auth/styles/util.css'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const [userForm, setUserForm] = useState<{ usuario: string; contrasena: string }>({
    usuario: '',
    contrasena: '',
  });

  useEffect(() => {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('cliente');
  }, []);  

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { usuario, contrasena } = userForm;

    try {
      const raw = await login({ usuario, contrasena }).unwrap();
      // raw es LoginResponse
      const result = raw as LoginResponse;

      if (result.code === 'OK' && result.response) {
        // Login exitoso: guardamos usuario en localStorage y redirigimos
        const userData = result.response;
        
        localStorage.setItem('idUsuario', userData.idUsuario);
        localStorage.setItem('cliente', `${userData.nombres} ${userData.apellidos}`);
        LoggerService.info('Autenticación exitosa');
        navigate('/logistic');
      } else {
        // Code distinto de "OK": mostramos mensaje y nos quedamos en login
        await Swal.fire('Error', result.message, 'error');
        // Vaciamos contraseña, opcionalmente dejamos usuario
        setUserForm({ usuario, contrasena: '' });
        // Aunque ya estamos en /auth/login, volvemos a Forzar navegación
        LoggerService.warn('Autenticación Fallida');
        navigate('/auth/login');
      }
    } catch (err: any) {
      // Si la mutación retorna un error HTTP (por ejemplo 401), lo atrapamos aquí
      const errData = (err?.data as { message?: string }) || {};
      const msg = errData.message || 'Error de red al intentar autenticar.';
      await Swal.fire('Error', msg, 'error');
      LoggerService.error('Error al autenticar');
      navigate('/auth/login');
    }
  };


  return (
    <div className="limiter">
      <div
        className="container-login100"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="wrap-login100 p-t-30 p-b-50">
          <span className="login100-form-title p-b-41">Iniciar Sesión</span>
          <form
            className="login100-form validate-form p-b-33 p-t-5"
            onSubmit={onSubmit}
          >
            <div
              className="wrap-input100 validate-input"
              data-validate="Enter username"
            >
              <input
                name="usuario"
                value={userForm.usuario}
                onChange={onChange}
                className="input100"
                type="text"
                placeholder="Usuario"
                required
              />
              <span className="focus-input100" data-placeholder="&#xe82a;" />
            </div>

            <div
              className="wrap-input100 validate-input"
              data-validate="Enter password"
            >
              <input
                name="contrasena"
                value={userForm.contrasena}
                onChange={onChange}
                className="input100"
                type="password"
                placeholder="Contraseña"
                required
              />
              <span className="focus-input100" data-placeholder="&#xe80f;" />
            </div>

            <div className="container-login100-form-btn m-t-32">
              <button type="submit" className="login100-form-btn">
                Ingresar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


