// import { useAuth } from "@/hooks/useAuth";
import React, { useEffect } from "react";
import { Card } from "antd";
import { useTransform } from "@/hooks/useTransform";

import '../styles/Home.scss';


export const HomePage: React.FC = () => {
//   const { authData } = useAuth();
  const { t } = useTransform();

//   useEffect(() => {
//     if (authData) {
//       const { token, username } = authData;
//       localStorage.setItem("token", token);
//       localStorage.setItem("idUsuario", username);
//     }
//   }, []);

  return (
    
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Card
          style={{ maxWidth: 800, width: "100%" }}
        >
          <h1>{t('app.home.main.title')}</h1>
          <p>{t('app.home.main.body')}</p>
        </Card>
      </div>
    
  );
};
