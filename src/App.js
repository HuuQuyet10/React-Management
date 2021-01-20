import React, { Component } from "react";
import { persistStore, persistReducer } from "redux-persist";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import createEncryptor from "redux-persist-transform-encrypt";
import reducers from "@redux-store/reducers";
import storage from "redux-persist/lib/storage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import "@styles/bootstrap-override.scss";
import "@styles/app.scss";
import stringUtils from "mainam-react-native-string-utils";
import Main from "./Main";
import { Provider } from 'react-redux';


const encryptor = createEncryptor({
  secretKey: "private-encrypt-key",
  onError: function (error) {
    // Handle the error.
  },
});

const persistConfig = {
  key: "root-product",
  storage,
  transforms: [encryptor],
};

const store = createStore(
  persistReducer(persistConfig, reducers),
  {},
  compose(applyMiddleware(thunk))
);
const persistor = persistStore(store);

const Kernel = () => (
  <div>
    <ToastContainer autoClose={3000} />
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <div className="app">
          <div className="main-content">
            <Main />
          </div>
        </div>
      </PersistGate>
    </Provider>
  </div>
);
export default Kernel;
