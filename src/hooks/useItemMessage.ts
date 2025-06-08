import { useCallback } from "react";
import { useTransform } from "@/hooks/useTransform";

export function useItemMessage() {
  const { t } = useTransform();

  return useCallback(
    (id: string, error: boolean = false) => {
      return t(
        error
          ? "modules.form.required.message"
          : "modules.form.placeholder.message",
        { item: t(id).toLowerCase() }
      );
    },
    [t]
  );
}