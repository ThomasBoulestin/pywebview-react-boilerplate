import React from "react";
import ReactDOM from "react-dom";

// import "./index.css";
import FileExplorer from "./components/FileExplorer/FileExplorer";

import "./index.css";
import { createRoot } from "react-dom/client";
import { GeneralState } from "./components/GeneralContext/GeneralContext";

import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardBody } from "react-bootstrap";
import InputZone from "./components/InputZone/InputZone";
import { ToastState } from "./components/ToastContext/ToastContext";

const App = function () {
  return (
    <ToastState>
      <GeneralState>
        <div className="d-flex m-2">
          <FileExplorer />
          <InputZone />
        </div>
      </GeneralState>
    </ToastState>
  );
};

const view = App("pywebview");

const element = document.getElementById("app");
ReactDOM.render(view, element);

// const container = document.getElementById("app");
// const root = createRoot(container); // createRoot(container!) if you use TypeScript
// root.render(view, container);
