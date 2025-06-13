import { useState, useMemo, useEffect } from "react";
import { Form, Button, Card, message, Spin } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useForms, useDynamicOptions, submitForm } from "../../services/api";
import { useMutation } from "@tanstack/react-query";
import { useDrafts } from "../../context/DraftsContext";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import "./InsuranceForm.css";
import FormField from "./components/FormField";
import FormGroup from "./components/FormGroup";
import FormSelector from "./components/FormSelector";

const InsuranceForm = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const { control, handleSubmit, watch, setValue, reset } = useForm();
  const formValues = watch();
  const { saveDraft, getDraft } = useDrafts();
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();

  // Watch country value for state reset
  const countryValue = watch("country");

  // Reset state when country changes
  useEffect(() => {
    if (countryValue) {
      setValue("state", null);
    }
  }, [countryValue, setValue]);

  const {
    data: forms = [],
    isLoading: isLoadingForms,
    error: formsError,
  } = useForms();

  const { mutate: submitFormMutation, isPending } = useMutation({
    mutationFn: submitForm,
    onSuccess: (response) => {
      messageApi.open({
        type: "success",
        content: response.message,
      });
    },
    onError: (error) => {
      messageApi.open({
        type: "success",
        content: error.message,
      });
    },
  });

  useEffect(() => {
    if (location.state?.formId) {
      const draft = getDraft(location.state.formId);
      if (draft) {
        const form = forms.find((f) => f.formId === location.state.formId);
        if (form) {
          setSelectedForm(form);
          const processedDraft = Object.entries(draft).reduce(
            (acc, [key, value]) => {
              const isDateField = form.fields.some(
                (field) => field.id === key && field.type === "date"
              );
              acc[key] = isDateField && value ? dayjs(value) : value;
              return acc;
            },
            {}
          );
          reset(processedDraft);
        }
      }
    }
  }, [location.state, forms, getDraft, reset]);

  useEffect(() => {
    if (selectedForm && Object.keys(formValues).length > 0) {
      const hasFilledFields = Object.entries(formValues).some(
        ([key, value]) => {
          if (key === "formId") return false;
          if (value === null || value === undefined || value === "")
            return false;
          if (Array.isArray(value) && value.length === 0) return false;
          return true;
        }
      );

      if (hasFilledFields) {
        const autosaveTimeout = setTimeout(() => {
          const processedFormValues = Object.entries(formValues).reduce(
            (acc, [key, value]) => {
              const isDateField = selectedForm.fields.some(
                (field) => field.id === key && field.type === "date"
              );
              acc[key] = isDateField && value ? value.toISOString() : value;
              return acc;
            },
            {}
          );
          saveDraft(selectedForm.formId, processedFormValues);
        }, 1000);

        return () => clearTimeout(autosaveTimeout);
      }
    }
  }, [formValues, selectedForm, saveDraft]);

  const fieldsWithDynamicOptions = useMemo(() => {
    if (!selectedForm?.fields) return [];

    return selectedForm.fields.reduce((acc, field) => {
      if (field.type === "group") {
        field.fields?.forEach((subField) => {
          if (subField.dynamicOptions) {
            acc.push(subField);
          }
        });
      } else if (field.dynamicOptions) {
        acc.push(field);
      }
      return acc;
    }, []);
  }, [selectedForm]);

  const stateField = fieldsWithDynamicOptions.find(
    (field) => field.id === "state"
  );
  const stateValue = formValues.country;
  const stateOptions = useDynamicOptions(
    stateField?.dynamicOptions?.endpoint || "/api/getStates",
    {
      country: stateValue,
    }
  );

  const handleFormChange = (formId) => {
    const form = forms.find((f) => f.formId === formId);
    setSelectedForm(form);
    setValue("formId", formId);
    reset({ formId });
  };

  const onSubmit = (data) => {
    submitFormMutation(data);
  };

  const getDynamicOptions = (fieldId) => {
    const field = fieldsWithDynamicOptions.find((f) => f.id === fieldId);
    if (!field?.dynamicOptions) return null;

    switch (fieldId) {
      case "state":
        return stateOptions;
      default:
        return null;
    }
  };

  const renderField = (field) => {
    if (field.type === "group") {
      return (
        <FormGroup
          key={field.id}
          field={field}
          control={control}
          formValues={formValues}
          getDynamicOptions={getDynamicOptions}
        />
      );
    }
    return (
      <FormField
        key={field.id}
        field={field}
        control={control}
        formValues={formValues}
        getDynamicOptions={getDynamicOptions}
      />
    );
  };

  if (isLoadingForms) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (formsError) {
    return (
      <Card>
        <div className="error-message">Failed to load forms</div>
      </Card>
    );
  }

  if (!forms?.length) {
    return (
      <Card>
        <div className="empty-message">No forms available</div>
      </Card>
    );
  }

  return (
    <div className="form-container">
      {contextHolder}
      <FormSelector
        forms={forms}
        selectedForm={selectedForm}
        onFormChange={handleFormChange}
      />

      {selectedForm && (
        <Card title={selectedForm.title}>
          <Form
            className="insurance-form"
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
          >
            <Controller
              name="formId"
              control={control}
              defaultValue={selectedForm.formId}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            {selectedForm.fields?.map(renderField)}
            <Form.Item>
              <Button loading={isPending} type="primary" htmlType="submit">
                Submit Application
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default InsuranceForm;
