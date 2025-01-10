import { createContext, useEffect, useState } from "react";
import { ToastContainer, Toast } from "react-bootstrap";

export const ToastContext = createContext();

export const ToastState = ({ children }) => {
  const initialState = {
    server_address: "",
  };

  //Set up the reducer
  const [toastList, setToastList] = useState([]);

  const addToast = (type, title, text, duration) => {
    toastList.push({
      id: crypto.randomUUID(),
      type: type,
      title: title,
      text: text,
      duration: duration === undefined ? 3000 : duration,
    });

    setToastList([...toastList]);
  };

  return (
    //Add the functions that have been defined above into the Context provider, and pass on to the children
    <ToastContext.Provider
      value={{
        addToast: addToast,
        ...toastList,
      }}
    >
      <ToastContainer
        position="bottom-center"
        className="p-3"
        style={{ zIndex: 1 }}
      >
        {toastList.map((e, i) => (
          <Toast
            key={e.id}
            delay={e.duration}
            bg={e.type}
            autohide
            onClose={() => setToastList(toastList.filter((e, ii) => ii !== i))}
          >
            <Toast.Header style={{ color: "white" }} closeButton={true}>
              <strong className="me-auto">{e.title}</strong>
            </Toast.Header>
            <Toast.Body
              style={{ color: e.type === "warning" ? "black" : "white" }}
            >
              {e.text}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      {children}
    </ToastContext.Provider>
  );
};
