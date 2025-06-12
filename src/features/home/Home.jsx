import { Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { FileText, List, Save } from "lucide-react";
const Home = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "New Application",
      description: "Start a new insurance application",
      icon: <FileText style={{ fontSize: "32px" }} />,
      onClick: () => navigate("/new-application"),
    },
    {
      title: "My Drafts",
      description: "View and continue your draft applications",
      icon: <Save style={{ fontSize: "32px" }} />,
      onClick: () => navigate("/drafts"),
    },
    {
      title: "Applications",
      description: "View your submitted applications",
      icon: <List style={{ fontSize: "32px" }} />,
      onClick: () => navigate("/applications"),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Insurance Portal</h1>
      <Row gutter={[24, 24]}>
        {cards.map((card, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              className="h-full cursor-pointer transition-all border-1 hover:!border-primary"
              onClick={card.onClick}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-primary-500 mb-4">{card.icon}</div>
                <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                <p className="text-gray-600">{card.description}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
