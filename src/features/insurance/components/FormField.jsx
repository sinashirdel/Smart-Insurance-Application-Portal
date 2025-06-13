import {
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  DatePicker,
  InputNumber,
} from "antd";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

const FormField = ({ field, control, formValues, getDynamicOptions }) => {
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

  const renderFieldByType = () => {
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
          const valueOptions = [];
          const step = 50000;
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
      default:
        return null;
    }
  };

  return renderFieldByType();
};

export default FormField;
