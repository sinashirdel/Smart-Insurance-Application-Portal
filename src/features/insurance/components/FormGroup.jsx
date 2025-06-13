import { Card } from "antd";
import FormField from "./FormField";

const FormGroup = ({ field, control, formValues, getDynamicOptions }) => {
  return (
    <Card title={field.label} className="mb-4">
      {field.fields?.map((subField) => (
        <div key={subField.id}>
          <FormField
            field={subField}
            control={control}
            formValues={formValues}
            getDynamicOptions={getDynamicOptions}
          />
        </div>
      ))}
    </Card>
  );
};

export default FormGroup;
