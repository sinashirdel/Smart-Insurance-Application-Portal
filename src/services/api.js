import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Forms API
export const useForms = () => {
  return useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const { data } = await api.get("/api/insurance/forms");
      return data;
    },
  });
};

export const useDynamicOptions = (endpoint, params) => {
  return useQuery({
    queryKey: ["dynamicOptions", endpoint, params],
    queryFn: async () => {
      const { data } = await api.get(endpoint, { params });
      return data;
    },
    enabled: !!params?.country,
  });
};

export const submitForm = async (formData) => {
  const { data } = await api.post("/api/insurance/forms/submit", formData);
  return data;
};

// Applications API
export const useApplications = () => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data } = await api.get("/api/insurance/forms/submissions");
      return data;
    },
  });
}; 