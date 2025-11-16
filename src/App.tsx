import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/main-layout";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:category" element={<Gallery />} />
          <Route path="/work" element={<Gallery />} />
          <Route path="/gallery/:category" element={<Gallery />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
