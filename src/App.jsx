import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { setUser } from "./redux/authSlice";
import { fetchPastes } from "./redux/pasteSlice";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Pastes from "./components/Pastes";
import ViewPaste from "./components/ViewPaste";
import UserPastes from "./components/UserPastes";

const Layout = ({ children }) => (
  <div>
    <Navbar />
    {children}
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/pastes",
    element: (
      <Layout>
        <Pastes />
      </Layout>
    ),
  },
  {
    path: "/pastes/:id",
    element: (
      <Layout>
        <ViewPaste />
      </Layout>
    ),
  },
  {
    // User's personal paste collection — protected, anonymous to everyone else
    path: "/my-pastes",
    element: (
      <Layout>
        <UserPastes />
      </Layout>
    ),
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 🔥 Sync Firebase user with Redux
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        dispatch(setUser({ uid: fbUser.uid, email: fbUser.email }));
      } else {
        dispatch(setUser(null));
      }
    });

    // existing fetch
    dispatch(fetchPastes());

    return () => unsub();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
