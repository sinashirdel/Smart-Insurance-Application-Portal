import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InsuranceForm from "./features/insurance/InsuranceForm";
import ApplicationsList from "./features/applications/ApplicationsList";
import DraftsList from "./features/drafts/DraftsList";
import Home from "./features/home/Home";
import Header from "./components/Header";
import { DraftsProvider } from "./context/DraftsContext";

const { Content } = Layout;

function App() {
  return (
    <Router>
      <DraftsProvider>
        <Layout className="!min-h-screen w-full !bg-white">
          <Header />
          <Content className="w-full max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new-application" element={<InsuranceForm />} />
              <Route path="/applications" element={<ApplicationsList />} />
              <Route path="/drafts" element={<DraftsList />} />
            </Routes>
          </Content>
        </Layout>
      </DraftsProvider>
    </Router>
  );
}

export default App;
