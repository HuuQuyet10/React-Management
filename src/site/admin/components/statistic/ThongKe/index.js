import React, { useState } from "react";
import { AdminPage } from "@admin/components/admin";
import "./style.scss";
import StatusChart from "./status";
import ResourceChart from "./resource";
import ImportHospital from "./importHospital";
import StatusName from "./statusName";

function index(props) {
  const [state, _setState] = useState({
    typeChart: 1,
  });
  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };
  const onChangeType = (e) => {
    setState({
      typeChart: e,
    });
  };
  return (
    <AdminPage>
      {state.typeChart === 1 ? (
        <StatusChart onChange={(e) => onChangeType(e)} />
      ) : state.typeChart === 2 ? (
        <ImportHospital onChange={(e) => onChangeType(e)} />
      ) : state.typeChart === 3 ? (
        <StatusName onChange={(e) => onChangeType(e)} />
      ) : (
        <ResourceChart onChange={(e) => onChangeType(e)} />
      )}
    </AdminPage>
  );
}

export default index;
