import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
//
import Layout from "../components/Layout";
import Home from "../pages/Home"
import Category from "../pages/Category"
//
import "./index.css"


const routesArray = [
  {
    path:"/",
    element: <Layout/>,
    children: [
      {index: true, element: <Home/>},
      {path: ":category", element: <Category/>}
    ]
  }
]

const router = createBrowserRouter(routesArray)

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(
    <RouterProvider router={router} />
  )