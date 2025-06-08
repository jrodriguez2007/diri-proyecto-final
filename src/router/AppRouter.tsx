import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
// import { AuthRoutes } from '../auth/routes/AuthRoutes';
import { AuthRoutes } from '../modules/auth/routes/AuthRoutes';
import { HomeRoutes } from '../modules/home/routes/HomeRoutes';


export const AppRouter: React.FC = () => {

const isAuthenticated = !!localStorage.getItem('idUsuario');

    return (

      <Routes>
        {isAuthenticated ? (
          // Si está autenticado, permitimos el acceso a /logistic/*
          <Route path="/logistic/*" element={<HomeRoutes />} />
        ) : (
          // Si NO está autenticado, forzamos a rutas /auth/*
          <Route path="/auth/*" element={<AuthRoutes />} />
        )}
        {/* Rutas comodín: redirige según esté autenticado o no */}
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/logistic" /> : <Navigate to="/auth/login" />
          }
        />
      </Routes>

    )
}
