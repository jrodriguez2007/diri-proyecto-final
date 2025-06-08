import React from "react";
import { useTransform } from "@/hooks/useTransform";


export const ErrorPage: React.FC = () => {
  const { t } = useTransform();

  return (
    <>
      <h1>Error Page</h1>
    </>
  );
};
