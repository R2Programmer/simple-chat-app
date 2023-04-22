import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Auth from "./Pages/Authentication";
import ChatRoom from "./Pages/ChatRoom";

function App() {
  const user = useSelector((state) => state.authReducer.authData);
  return (
    <div className="App">
      <Routes>
         <Route
          path="/"
          element={user ? <ChatRoom/> : <Auth/>}
        />

        </Routes>
    </div>
  );
}

export default App;
