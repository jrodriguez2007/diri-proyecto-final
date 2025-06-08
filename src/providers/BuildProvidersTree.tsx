import React from "react";

interface Params {
  children: React.ReactNode;
}

type ProviderWithProps = [React.FC<any>, Record<string, unknown>?];

export const BuildProvidersTree = (componentsWithProps: ProviderWithProps[]) => {
  const initialComponent: React.FC<Params> = ({ children }: Params) => <>{children}</>;
  return componentsWithProps.reduce(
    (AccumulatedComponents, [Provider, props = {}]) => {
      return ({ children }: Params) => {
        return (
          <AccumulatedComponents>
            <Provider {...props}>{children}</Provider>
          </AccumulatedComponents>
        );
      };
    },
    initialComponent
  );
};