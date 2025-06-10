import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InsuranceForm from "./features/insurance/InsuranceForm";
import ApplicationsList from "./features/applications/ApplicationsList";
import Header from "./components/Header";

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="!min-h-screen w-full !bg-gray-100">
        <Header />
        <Content className="w-full max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<InsuranceForm />} />
            <Route path="/applications" element={<ApplicationsList />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
