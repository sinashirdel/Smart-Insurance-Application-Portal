import { Card, Table, Button, Space, message } from "antd";
import { useDrafts } from "../../context/DraftsContext";
import { useNavigate } from "react-router-dom";
import { useForms } from "../../services/api";

const DraftsList = () => {
  const { getAllDrafts, deleteDraft } = useDrafts();
  const navigate = useNavigate();
  const { data: forms = [] } = useForms();
  const drafts = getAllDrafts();

  const handleDelete = (formId) => {
    deleteDraft(formId);
    message.success("Draft deleted successfully");
  };

  const handleContinue = (formId) => {
    navigate("/new-application", { state: { formId } });
  };

  const columns = [
    {
      title: "Form Type",
      dataIndex: "formId",
      key: "formId",
      render: (formId) => {
        const form = forms.find((f) => f.formId === formId);
        return form?.title || formId;
      },
    },
    {
      title: "Last Saved",
      dataIndex: "lastSaved",
      key: "lastSaved",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleContinue(record.formId)}>
            Continue Editing
          </Button>
          <Button danger onClick={() => handleDelete(record.formId)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Saved Drafts" className="w-full">
      {drafts.length === 0 ? (
        <div className="text-center text-gray-500">No saved drafts found</div>
      ) : (
        <Table
          columns={columns}
          dataSource={drafts}
          rowKey="formId"
          pagination={false}
          scroll={{ x: "max-content" }}
          className="responsive-table"
        />
      )}
    </Card>
  );
};

export default DraftsList;
