import { Form, Select, Card } from "antd";

const FormSelector = ({ forms, selectedForm, onFormChange }) => {
  return (
    <Card className="form-card">
      <Form.Item label="Select Insurance Type" required>
        <Select
          value={selectedForm?.formId}
          onChange={onFormChange}
          options={forms.map((form) => ({
            label: form.title,
            value: form.formId,
          }))}
        />
      </Form.Item>
    </Card>
  );
};

export default FormSelector;
