import * as React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root, { rootLoader } from "@/routes/root.jsx";
import Names, { namesAction } from "@/routes/names.jsx";
import Settings, { settingsAction } from "@/routes/settings.jsx";
import Questions, { questionsAction } from "@/routes/questions.jsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";

import "./tailwind.css";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        path: "names",
        element: <Names />,
        action: namesAction,
      },
      {
        path: "settings",
        element: <Settings />,
        action: settingsAction,
      },
      {
        path: "questions",
        element: <Questions />,
        action: questionsAction,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="alexishs-random-qs-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
