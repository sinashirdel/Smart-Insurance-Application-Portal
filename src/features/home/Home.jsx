import { Card, Row, Col, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { FileText, List, Save } from "lucide-react";
import "./Home.css";

const { Title } = Typography;

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
    <div className="home-container">
      <Title level={1} className="home-title">
        Insurance Portal
      </Title>
      <Row gutter={[24, 24]}>
        {cards.map((card, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card className="home-card" onClick={card.onClick}>
              <div className="card-content">
                <div className="card-icon">{card.icon}</div>
                <Title level={2} className="card-title">
                  {card.title}
                </Title>
                <p className="card-description">{card.description}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
