import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';
import { useState, useEffect } from 'react';

import Layout from './components/layout.tsx';
import LoadingScreen from './components/loading-screen.tsx';

import Profile from './routes/profile.tsx';
import Home from './routes/home.tsx';
import Login from './routes/login.tsx';
import CreateAccount from './routes/create-account.tsx';
import Reset from './routes/reset.tsx';

import { auth } from './firebase.ts';
import ProtectedRoute from './components/protected-route.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/create-account",
    element: <CreateAccount />
  },
  {
    path: "/reset",
    element: <Reset />
  }
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: #253237;
    color: #e0fcfb;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const init = async() => {
    // time out
    // setTimeout(() => setLoading(false), 2000);

    // add firebase
    await auth.authStateReady();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      { isLoading ? <LoadingScreen /> : <RouterProvider router={router} /> }
    </Wrapper>
  )
}

export default App
