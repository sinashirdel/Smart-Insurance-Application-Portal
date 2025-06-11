import { createContext, useContext, useState, useEffect } from "react";

const DraftsContext = createContext();

export const useDrafts = () => {
  const context = useContext(DraftsContext);
  if (!context) {
    throw new Error("useDrafts must be used within a DraftsProvider");
  }
  return context;
};

export const DraftsProvider = ({ children }) => {
  const [drafts, setDrafts] = useState(() => {
    const savedDrafts = localStorage.getItem("formDrafts");
    return savedDrafts ? JSON.parse(savedDrafts) : {};
  });

  useEffect(() => {
    localStorage.setItem("formDrafts", JSON.stringify(drafts));
  }, [drafts]);

  const saveDraft = (formId, formData) => {
    setDrafts((prev) => ({
      ...prev,
      [formId]: {
        ...formData,
        lastSaved: new Date().toISOString(),
      },
    }));
  };

  const getDraft = (formId) => {
    return drafts[formId];
  };

  const deleteDraft = (formId) => {
    setDrafts((prev) => {
      const newDrafts = { ...prev };
      delete newDrafts[formId];
      return newDrafts;
    });
  };

  const getAllDrafts = () => {
    return Object.entries(drafts).map(([formId, data]) => ({
      formId,
      ...data,
    }));
  };

  return (
    <DraftsContext.Provider
      value={{ saveDraft, getDraft, deleteDraft, getAllDrafts }}
    >
      {children}
    </DraftsContext.Provider>
  );
};
