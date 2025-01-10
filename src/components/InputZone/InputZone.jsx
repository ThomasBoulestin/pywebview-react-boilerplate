import { useContext, useEffect, useMemo, useState } from "react";

import { GeneralContext } from "../GeneralContext/GeneralContext";
import { Button, Card, CardBody, Form, Stack } from "react-bootstrap";
import { ToastContext } from "../ToastContext/ToastContext";

export default function InputZone() {
  const { addToast } = useContext(ToastContext);
  const { current_path, current_name, dispatch } = useContext(GeneralContext);

  //   useEffect(() => {

  //   }, [currentFolderId]);

  const [input_path, setInputPath] = useState("Z:/");

  return (
    <div className="ms-2">
      <Card style={{ width: "500px" }}>
        <CardBody>
          <Stack>
            <div>current path from context = {current_path}</div>

            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Path to load"
                value={input_path}
                onChange={(e) => {
                  setInputPath(e.target.value);
                }}
              />

              <Button
                className="ms-2"
                style={{ width: "10rem" }}
                onClick={() => {
                  dispatch({
                    type: "set_root_path",
                    value: input_path,
                  });
                }}
              >
                Load Path
              </Button>
            </div>

            <Card
              className="mt-2"
              style={{
                opacity: current_name.toLowerCase() !== "calcul" ? 0.5 : 1,
                pointerEvents:
                  current_name.toLowerCase() !== "calcul" ? "none" : "initial",
              }}
            >
              <Card.Body>
                <div>
                  {current_name.toLowerCase() === "calcul" && (
                    <div>You are in calcul folder</div>
                  )}
                </div>

                <div>
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Prevent AXI" checked />
                    <Form.Check type="checkbox" label="Prevent ASC" checked />
                    <Form.Check
                      type="checkbox"
                      label="Prevent selected folders"
                      checked
                    />
                    ----------------------------------------
                    <Form.Check
                      type="checkbox"
                      label="Preserve folders"
                      checked
                    />
                    <Form.Check
                      type="checkbox"
                      label="Try to generate d3hsp_backup_infos.axi"
                      checked
                    />
                  </Form.Group>

                  <div>Files to keep</div>

                  <Form.Control
                    type="text"
                    placeholder="Path to load"
                    value="*.dyn, *.axi, *.k, *.key, *keyword, *.png, *.jpg, *.jpeg"
                  />
                </div>

                <Button className="mt-2">Delete current ...</Button>
              </Card.Body>
            </Card>
          </Stack>
        </CardBody>
      </Card>
    </div>
  );
}
