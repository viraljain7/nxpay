import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PaymentPage
  from "./pages/PaymentPage";

import PaymentSuccess
  from "./pages/PaymentSuccess";

import PaymentFailed
  from "./pages/PaymentFailed";

import PaymentPending
  from "./pages/PaymentPending";

import "./styles/themes/cred-light.css";
import "./styles/payment.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Navigate to="/pay/demo" />
          }
        />

        <Route
          path="/pay/:token"
          element={<PaymentPage />}
        />

        <Route
          path="/payment/success"
          element={<PaymentSuccess />}
        />

        <Route
          path="/payment/failed"
          element={<PaymentFailed />}
        />

        <Route
          path="/payment/pending"
          element={<PaymentPending />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;