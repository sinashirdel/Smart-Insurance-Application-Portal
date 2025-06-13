import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InsuranceForm from "./features/insurance/InsuranceForm";
import ApplicationsList from "./features/applications/ApplicationsList";
import DraftsList from "./features/drafts/DraftsList";
import Home from "./features/home/Home";
import { DraftsProvider } from "./context/DraftsContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";
import Header from "./components/layout/Header";

const { Content } = Layout;

function App() {
  return (
    <Router>
      <ThemeProvider>
        <DraftsProvider>
          <Layout className="app-layout">
            <Header />
            <Content className="app-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new-application" element={<InsuranceForm />} />
                <Route path="/applications" element={<ApplicationsList />} />
                <Route path="/drafts" element={<DraftsList />} />
              </Routes>
            </Content>
          </Layout>
        </DraftsProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
