import { useState, useMemo, useEffect } from "react";
import {
  Form,
  Select,
  Input,
  Button,
  Card,
  message,
  Spin,
  Radio,
  Checkbox,
  DatePicker,
  InputNumber,
  Slider,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import { useForms, useDynamicOptions, submitForm } from "../../services/api";
import { useMutation } from "@tanstack/react-query";
import { useDrafts } from "../../context/DraftsContext";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

const InsuranceForm = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const { control, handleSubmit, watch, setValue, reset } = useForm();
  const formValues = watch();
  const { saveDraft, getDraft } = useDrafts();
  const location = useLocation();

  const {
    data: forms = [],
    isLoading: isLoadingForms,
    error: formsError,
  } = useForms();

  const { mutate: submitFormMutation, isLoading: isSubmitting } = useMutation({
    mutationFn: submitForm,
    onSuccess: (response) => {
      message.success("Application submitted successfully");
    },
    onError: () => {
      message.error("Failed to submit application");
    },
  });

  // Load draft if coming from drafts list
  useEffect(() => {
    if (location.state?.formId) {
      const draft = getDraft(location.state.formId);
      if (draft) {
        const form = forms.find((f) => f.formId === location.state.formId);
        if (form) {
          setSelectedForm(form);
          // Convert date strings to dayjs objects
          const processedDraft = Object.entries(draft).reduce(
            (acc, [key, value]) => {
              // Check if the field is a date field
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

  // Autosave draft
  useEffect(() => {
    if (selectedForm && Object.keys(formValues).length > 0) {
      // Check if any field other than formId has a value
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
          // Convert dayjs objects to ISO strings before saving
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

  // Get all fields that need dynamic options
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
    reset({ formId }); // Reset form with only the new formId
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
    const {
      id,
      label,
      type,
      required,
      options,
      validation,
      visibility,
      dynamicOptions: dynamicOpts,
    } = field;

    // Check visibility conditions
    if (visibility) {
      const { dependsOn, condition, value } = visibility;
      if (condition === "equals" && formValues[dependsOn] !== value) {
        return null;
      }
    }

    const commonProps = {
      name: id,
      control,
      rules: {
        required: required && `${label} is required`,
        ...(validation?.pattern && {
          pattern: {
            value: new RegExp(validation.pattern),
            message: "Invalid format",
          },
        }),
        ...(validation?.min && {
          min: {
            value: validation.min,
            message: `Minimum value is ${validation.min}`,
          },
        }),
        ...(validation?.max && {
          max: {
            value: validation.max,
            message: `Maximum value is ${validation.max}`,
          },
        }),
      },
    };

    switch (type) {
      case "text":
        return (
          <Controller
            {...commonProps}
            render={({ field }) => (
              <Form.Item label={label} required={required}>
                <Input {...field} />
              </Form.Item>
            )}
          />
        );
      case "number":
        if (id === "car_year") {
          // Generate year options
          const yearOptions = [];
          for (
            let year = validation?.max || 2025;
            year >= (validation?.min || 1990);
            year--
          ) {
            yearOptions.push({
              label: year.toString(),
              value: year,
            });
          }

          return (
            <Controller
              {...commonProps}
              render={({ field }) => (
                <Form.Item label={label} required={required}>
                  <Select
                    {...field}
                    options={yearOptions}
                    style={{ width: "100%" }}
                    placeholder="Select year"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              )}
            />
          );
        }
        if (id === "home_value") {
          // Generate value options with appropriate steps
          const valueOptions = [];
          const step = 50000; // $50,000 steps
          for (
            let value = validation?.min || 50000;
            value <= (validation?.max || 5000000);
            value += step
          ) {
            valueOptions.push({
              label: `$${value.toLocaleString()}`,
              value: value,
            });
          }

          return (
            <Controller
              {...commonProps}
              render={({ field }) => (
                <Form.Item label={label} required={required}>
                  <Select
                    {...field}
                    options={valueOptions}
                    style={{ width: "100%" }}
                    placeholder="Select home value"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              )}
            />
          );
        }
        return (
          <Controller
            {...commonProps}
            render={({ field }) => (
              <Form.Item label={label} required={required}>
                <InputNumber {...field} style={{ width: "100%" }} />
              </Form.Item>
            )}
          />
        );
      case "date":
        return (
          <Controller
            {...commonProps}
            render={({ field: { value, onChange, ...field } }) => (
              <Form.Item label={label} required={required}>
                <DatePicker
                  {...field}
                  value={value ? dayjs(value) : null}
                  onChange={(date) => onChange(date)}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}
          />
        );
      case "select":
        const dynamicQuery = getDynamicOptions(id);
        const selectOptions = dynamicOpts
          ? dynamicQuery?.data?.[id + "s"]?.map((opt) => ({
              label: opt,
              value: opt,
            }))
          : options?.map((opt) => ({ label: opt, value: opt }));

        return (
          <Controller
            {...commonProps}
            render={({ field }) => (
              <Form.Item label={label} required={required}>
                <Select
                  {...field}
                  options={selectOptions}
                  loading={dynamicQuery?.isLoading}
                />
              </Form.Item>
            )}
          />
        );
      case "radio":
        return (
          <Controller
            {...commonProps}
            render={({ field }) => (
              <Form.Item label={label} required={required}>
                <Radio.Group {...field}>
                  {options?.map((opt) => (
                    <Radio key={opt} value={opt}>
                      {opt}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            )}
          />
        );
      case "checkbox":
        return (
          <Controller
            {...commonProps}
            render={({ field }) => (
              <Form.Item label={label} required={required}>
                <Checkbox.Group
                  {...field}
                  options={options?.map((opt) => ({ label: opt, value: opt }))}
                />
              </Form.Item>
            )}
          />
        );
      case "group":
        return (
          <Card title={label} className="mb-4">
            {field.fields?.map((subField) => (
              <div key={subField.id}>{renderField(subField)}</div>
            ))}
          </Card>
        );
      default:
        return null;
    }
  };

  if (isLoadingForms) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (formsError) {
    return (
      <Card>
        <div className="text-red-500 text-center">Failed to load forms</div>
      </Card>
    );
  }

  if (!forms?.length) {
    return (
      <Card>
        <div className="text-center">No forms available</div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto !space-y-4">
      <Card className="mb-4">
        <Form.Item label="Select Insurance Type" required>
          <Select
            value={selectedForm?.formId}
            onChange={handleFormChange}
            options={forms.map((form) => ({
              label: form.title,
              value: form.formId,
            }))}
          />
        </Form.Item>
      </Card>

      {selectedForm && (
        <Card title={selectedForm.title}>
          <Form
            className="!space-y-4"
            layout="vertical"
            onFinish={handleSubmit(onSubmit)}
          >
            <Controller
              name="formId"
              control={control}
              defaultValue={selectedForm.formId}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            {selectedForm.fields?.map((field) => (
              <div key={field.id}>{renderField(field)}</div>
            ))}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
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
