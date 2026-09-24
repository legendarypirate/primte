"use client";

import { createContext, useCallback, useContext, useMemo } from "react";

export type PageContent = Record<string, string>;

type PageContentContextValue = {
  content: PageContent;
  editing: boolean;
  setField: (field: string, value: string) => void;
  getField: (field: string, fallback: string) => string;
};

const PageContentContext = createContext<PageContentContextValue | null>(null);

export function PageContentProvider({
  content,
  editing = false,
  onChange,
  children,
}: {
  content: PageContent;
  editing?: boolean;
  onChange?: (content: PageContent) => void;
  children: React.ReactNode;
}) {
  const setField = useCallback(
    (field: string, value: string) => {
      if (!onChange) return;
      onChange({ ...content, [field]: value });
    },
    [content, onChange]
  );

  const getField = useCallback(
    (field: string, fallback: string) => {
      const v = content[field];
      return v !== undefined && v !== "" ? v : fallback;
    },
    [content]
  );

  const value = useMemo(
    () => ({ content, editing, setField, getField }),
    [content, editing, setField, getField]
  );

  return <PageContentContext.Provider value={value}>{children}</PageContentContext.Provider>;
}

export function usePageContent() {
  return useContext(PageContentContext);
}
