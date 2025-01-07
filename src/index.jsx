import React from "react";
import ReactDOM from "react-dom";

// import "./index.css";
import FileExplorer from "./components/FileExplorer/FileExplorer";

import "./index.css";
import { createRoot } from "react-dom/client";

const App = function () {
  return (
    <>
      <FileExplorer />
      {/* <div>heyy</div> */}
    </>
  );
};

const view = App("pywebview");

const element = document.getElementById("app");
ReactDOM.render(view, element);

// const container = document.getElementById("app");
// const root = createRoot(container); // createRoot(container!) if you use TypeScript
// root.render(view, container);
