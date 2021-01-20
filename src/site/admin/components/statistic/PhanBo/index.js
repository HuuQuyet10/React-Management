import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Select, Form } from "antd";
import { Panel } from "@admin/components/admin";
import deviceProvider from "@data-access/device-provider";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import actionDeviceStatus from "@actions/device/status";
import actionDeviceName from "@actions/device/name";
import actionLatLng from "@actions/latlng";
import "./style.scss";
import images from "@src/resources/images";
import { Popover } from "antd";

import GoogleMapReact from "google-map-react";

const AnyReactComponent = (props) => {
  return <div>{props.children}</div>;
};
am4core.useTheme(am4themes_animated);
const { Option } = Select;

function index(props) {
  const [state, _setState] = useState({
    devices: [],
    data: [],
    mucdo: 1,
    trangThaiId: "",
    zoomLevel: 6,
  });
  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };
  const getMucDo = (item) => {
    switch (state.mucdo) {
      case 1:
        return {
          key: item.tinhThanhPhoId || "",
          address: item.tinhThanhPho,
        };
      case 2:
        if (item.tinhThanhPhoId && item.quanHuyenId)
          return {
            key: item.tinhThanhPhoId + "_" + item.quanHuyenId,
            address: item.quanHuyen + " - " + item.tinhThanhPho,
          };
        return {
          key: null,
        };
      case 3:
        if (item.tinhThanhPhoId && item.quanHuyenId && item.xaPhuong)
          return {
            key:
              item.tinhThanhPhoId +
              "_" +
              item.quanHuyenId +
              "_" +
              item.xaPhuongId,
            address:
              item.xaPhuong +
              " - " +
              item.quanHuyen +
              " - " +
              item.tinhThanhPho,
          };
        return {
          key: null,
        };
      case 4:
        if (item.donViId) {
          return {
            key: item.donViId,
            address: item.donVi,
          };
        }
        return {
          key: null,
        };
    }
  };
  const getSize = (total) => {
    let t = 50;
    switch (state.mucdo) {
      case 1:
        t = 50;
        break;
      case 2:
        t = 20;
        break;
      case 3:
        t = 10;
        break;
      case 4:
        t = 3;
    }
    let x = parseInt(total / t);
    return x * 8 + 25;
  };
  const groupData = (devices) => {
    let _group1 = {};
    devices.map((item) => {
      let mucdo = getMucDo(item);
      if (mucdo.key) {
        if (!_group1[mucdo.key])
          _group1[mucdo.key] = {
            key: mucdo.key,
            address: mucdo.address,
            devices: [],
          };
        _group1[mucdo.key].devices.push(item);
      }
    });
    let group1 = [];
    for (let key in _group1) {
      group1.push(_group1[key]);
    }
    props.loadLocation(group1.map((item) => item.address));
    setState({
      data: group1,
    });
  };
  useEffect(() => {
    props.getAllStatus();
    props.getAllName();
    deviceProvider.getAllDevice().then((s) => {
      if (s && s.code === 0) {
        setState({
          devices: s.data,
        });
      }
    });
  }, []);
  useEffect(() => {
    let { deviceName, devices } = state;

    let _devices = devices;
    if (deviceName)
      _devices = devices.filter((item) => item.tenThietBi === deviceName);
    if (state.trangThaiId)
      _devices = _devices.filter(
        (item) => item.trangThaiId === state.trangThaiId
      );
    groupData(_devices);
  }, [state.deviceName, state.trangThaiId, state.mucdo, state.devices]);

  const renderMarker = (item, latlng) => {
    const content = (
      <div>
        <p>Tổng số thiết bị: {item.devices.length}</p>
      </div>
    );
    let title = "";
    if (!state.deviceName) {
      title = "Thông tin thiết bị tại " + item.address;
    } else {
      title = `${state.deviceName} tại ${item.address}`;
    }
    let size = getSize(item.devices.length);
    return (
      <div style={{ marginTop: 0 - size, marginLeft: -(size / 2) }}>
        <Popover
          style={{ width: size, height: size }}
          content={content}
          title={title}
        >
          <div style={{ width: size, height: size }}>
            <img
              style={{ width: size, height: size }}
              src={require("@images/placeholder2.png")}
              alt=""
            />
          </div>
        </Popover>
      </div>
    );
  };

  return (
    <Panel
      id={"effortmonth"}
      sortable={true}
      allowClose={false}
      title="BẢN ĐỒ PHÂN BỔ"
      icon={images.icon.ic_map}
    >
      <div className="chart-status row">
        <div className="detail-left  col-md-3  col-sm-4">
          <Form.Item className="chart-selcect" label="Tên thiết bị">
            <Select
              value={state.deviceName}
              placeholder="Chọn thiết bị"
              onChange={(e, i) => {
                setState({
                  deviceName: e,
                });
              }}
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="">Tất cả</Option>
              {props.list_name.map((item, index) => {
                return (
                  <Option key={index} value={item.ten}>
                    {item.ten}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item className="chart-selcect" label="Trạng thái thiết bị">
            <Select
              value={state.trangThaiId}
              placeholder="Chọn trạng thái"
              onChange={(e, i) => {
                setState({
                  trangThaiId: e,
                });
              }}
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="">Tất cả</Option>
              {props.list_status.map((item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.ten}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item className="chart-selcect" label="Mức độ thể hiện dữ liệu">
            <Select
              value={state.mucdo}
              placeholder="Chọn mức độ"
              onChange={(e, i) => {
                let zoom = "";
                if (e === 2) {
                  zoom = 10;
                } else if (e === 3) {
                  zoom = 12;
                } else if (e === 4) {
                  zoom = 14;
                } else {
                  zoom = 6;
                }
                setState({
                  mucdo: e,
                  zoomLevel: zoom,
                });
              }}
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value={1}>Tỉnh/TP</Option>
              <Option value={2}>Quận/Huyện</Option>
              <Option value={3}>Xã/Phường</Option>
              <Option value={4}>Bệnh viện</Option>
            </Select>
          </Form.Item>
        </div>
        <div className=" col-sm-8 col-md-9 detail-right">
          <div style={{ height: 800 }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyDtctErW2KvdNQaMZ5t6xl7SUGOXhzsKw8",
              }}
              defaultCenter={{
                // lat: 15.8828276,
                // lng: 105.1381369
                lat: 16.463713,
                lng: 107.590866,
              }}
              // defaultZoom={6}
              zoom={state.zoomLevel}
              onBoundsChange={(data, zoom) => {
                let mucdoCheck = "";
                if (zoom >= 14) {
                  mucdoCheck = 4;
                } else if (12 <= zoom && zoom < 14) {
                  mucdoCheck = 3;
                } else if (10 <= zoom && zoom < 12) {
                  mucdoCheck = 2;
                } else {
                  mucdoCheck = 1;
                }
                setState({
                  mucdo: mucdoCheck,
                });
              }}
            >
              {state.data.map((item, index) => {
                if (props.latlngs[item.address]) {
                  let latlng = props.latlngs[item.address];

                  return (
                    <AnyReactComponent
                      key={index}
                      lat={latlng.lat}
                      lng={latlng.lng}
                      text="My Marker"
                    >
                      {renderMarker(item, latlng)}
                    </AnyReactComponent>
                  );
                }
              })}
              <AnyReactComponent lat={16.363628} lng={112.459828}>
                <div style={{ display: "flex", width: 180 }}>
                  <img
                    style={{ width: 25, height: "auto", paddingRight: 5 }}
                    src={require("@images/logoVn.png")}
                    alt=""
                  />
                  <span style={{ color: "#000" }}>Quần đảo Hoàng Sa</span>
                </div>
              </AnyReactComponent>
              <AnyReactComponent lat={10.497012} lng={115.856484}>
                <div style={{ display: "flex", width: 180 }}>
                  <img
                    style={{ width: 25, height: "auto", paddingRight: 5 }}
                    src={require("@images/logoVn.png")}
                    alt=""
                  />
                  <span style={{ color: "#000" }}>Quần đảo Trường Sa</span>
                </div>
              </AnyReactComponent>
            </GoogleMapReact>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default connect(
  (state) => {
    return {
      list_status: state.device_status.list_status || [],
      list_name: state.device_name.list_name || [],
      latlngs: state.latlng.latlngs || {},
    };
  },
  {
    getAllStatus: actionDeviceStatus.getAllStatus,
    getAllName: actionDeviceName.getAllName,
    loadLocation: actionLatLng.loadLocation,
  }
)(index);
