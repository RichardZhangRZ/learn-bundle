import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./bootstrap.min (4).css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Postpage from "./Pages/Postpage";
import { Register, SignIn } from "./Pages/AuthPages";
import UserContext from "./util/UserContext";
import { useEffect, useState } from "react";
import PostViewPage from "./Pages/PostViewPage";
import UserProfilePage from "./Pages/UserProfilePage";

function App() {
  /**
   * user:
   *  null = no user signed in
   *  undefined = currently getting user from server
   */
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let userFromLocalStorage = localStorage.getItem("user");
    if (userFromLocalStorage) {
      setUser(JSON.parse(userFromLocalStorage));
      //return;
    }
    async function getUserFromServer() {
      const userFromApi = await fetch("/currentUser", {
        credentials: "include",
      });
      const userJson = await userFromApi.json();
      if (userJson.username) {
        setUser(userJson);
        localStorage.setItem("user", JSON.stringify(userJson));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    }
    getUserFromServer();
  }, []);
  return (
    <UserContext.Provider value={[user, setUser]}>
      <Router>
        <Routes>
          <Route exact path="/" element={<Homepage />} />

          <Route exact path="/post/add" element={<Postpage />} />

          <Route exact path="/register" element={<Register />} />

          <Route exact path="/signin" element={<SignIn />} />

          <Route exact path="/posts/:postid/view" element={<PostViewPage />} />

          <Route
            exact
            path="/users/name/:username/view"
            element={<UserProfilePage />}
          />

          <Route
            exact
            path="/users/id/:userid/view"
            element={<UserProfilePage />}
          />

          <Route
            exact
            path="/users/me/view"
            element={<UserProfilePage user={user} />}
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
