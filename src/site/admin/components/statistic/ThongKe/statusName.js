import React, { useState, useEffect, useRef } from "react";
import statisticalProvider from "@data-access/statistical-provider";
import { Select, Form } from "antd";
import { Panel } from "@admin/components/admin";
import statusProvider from "@data-access/status-provider";
import communeProvider from "@data-access/commune-provider";
import districtProvider from "@data-access/district-provider";
import hospitalProvider from "@data-access/hospital-provider";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import snackbar from "@utils/snackbar-utils";
import images from "@src/resources/images";
import actionCity from "@actions/city";
import { connect } from "react-redux";
import "./style.scss";
am4core.useTheme(am4themes_animated);
const { Option } = Select;

function index(props) {
  const chartRef = useRef(null);
  const [state, _setState] = useState({
    typeChart: 3,
    trangThaiId: "",
    tinhThanhPhoId: "",
    quanHuyenId: "",
    xaPhuongId: "",
    coSoYTeId: "",
    data: {},
    listStatus: [],
    bieuDo: 1,
  });
  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };
  const loadData = (action, item) => {
    let trangThaiId = action === "trangThaiId" ? item : state.trangThaiId;
    let tinhThanhPhoId =
      action === "tinhThanhPhoId" ? item : state.tinhThanhPhoId;
    let quanHuyenId = action === "quanHuyenId" ? item : state.quanHuyenId;
    let xaPhuongId = action === "xaPhuongId" ? item : state.xaPhuongId;
    let coSoYTeId = action === "coSoYTeId" ? item : state.coSoYTeId;
    statisticalProvider
      .statusName(
        trangThaiId,
        tinhThanhPhoId,
        quanHuyenId,
        xaPhuongId,
        coSoYTeId
      )
      .then((s) => {
        if (s && s.code === 0 && s.data && s.data.length) {
          let obj = {};
          let arr = [];
          s.data.forEach((item) => {
            if (!obj[item.maThietBi]) {
              obj[item.maThietBi] = {
                code: item.maThietBi,
                nameDevice: item.tenThietBi,
                status: {},
              };
            }
            if (item.maTrangThai) {
              if (!obj[item.maThietBi].status[item.maTrangThai]) {
                obj[item.maThietBi].status[item.maTrangThai] = {
                  code: item.maTrangThai,
                  name: item.trangThai,
                  number: 0,
                };
              }
              obj[item.maThietBi].status[item.maTrangThai].number +=
                item.soLuong;
            }
          });
          for (let key in obj) {
            arr.push(obj[key]);
          }
          showChart(arr);
        } else if (s && s.data && s.data.length === 0) {
          showChart([]);
          snackbar.show(
            "Thông báo, Không có dữ liệu tương ứng với tiêu chí vừa chọn!",
            "danger"
          );
        } else {
          snackbar.show("Lấy dữ liệu thất bại!", "danger");
        }
      });
  };
  useEffect(() => {
    getStatus();
    getHospital();
    loadData();
    props.getCity();
    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, []);

  const setColor = (chart) => {
    chart.colors.list = [
      "#2F348F",
      "#395FAC",
      "#7987C3",
      "#EC1F26",
      "#141447",
      "#00368C",
      "#425799",
      "#B20016",
      "#212174",
      "#0047B9",
      "#5571C6",
      "#DF001C",
      "#251C65",
      "#243CAC",
      "#6168C3",
      "#FF3E39",
      "#222665",
      "#2F66AC",
      "#5F78C3",
      "#EC3D54",
    ].map((item) => am4core.color(item));
  };

  const showChart = (data) => {
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    setColor(chart);
    // Add data
    let _series = {};
    chart.data =
      data && data.length
        ? data.map((item) => {
            let item2 = {};
            item2.nameDevice = item.nameDevice;
            for (let key in item.status) {
              item2[item.status[key].name] = item.status[key].number;
              _series[item.status[key].name] = "";
            }
            return item2;
          })
        : [];

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "nameDevice";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text =
      "Thống kê tên thiết bị theo trạng thái và khả năng điều chuyển";

    // Create series
    function createSeries(field, name, stacked) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = field;
      series.dataFields.categoryY = "nameDevice";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
      series.stacked = stacked;
      series.columns.template.width = am4core.percent(95);

      let valueLabel = series.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.text = "{valueX}";
      valueLabel.label.horizontalCenter = "left";
      valueLabel.label.dx = 10;
      valueLabel.label.hideOversized = false;
      valueLabel.label.truncate = false;
    }
    for (let key in _series) {
      createSeries(key, key, false);
    }
    // createSeries("europe", "Europe", false);
    // createSeries("namerica", "North America", false);
    // createSeries("asia", "Asia", true);
    // createSeries("lamerica", "Latin America", true);
    // createSeries("meast", "Middle East", false);
    // createSeries("africa", "Africa", true);

    // Add legend
    chart.legend = new am4charts.Legend();
  };
  const getStatus = () => {
    let params = {
      page: 1,
      size: 9999,
    };
    statusProvider
      .search(params)
      .then((s) => {
        setState({
          listStatus: s.data,
        });
      })
      .catch((e) => {});
  };
  const getHospital = () => {
    let params = {
      page: 1,
      size: 99999,
      loaiDonVi: 10,
    };
    hospitalProvider
      .search(params)
      .then((s) => {
        if (s && s.code === 0) {
          setState({
            listHospital: s.data,
          });
        }
      })
      .catch((e) => {});
  };
  const getDistrict = (e) => {
    districtProvider
      .search(0, 9999, e)
      .then((s) => {
        setState({
          listDistrict: s.data,
        });
      })
      .catch((e) => {});
  };
  const getCommune = (e) => {
    communeProvider
      .search(0, 9999, e)
      .then((s) => {
        setState({
          listCommune: s.data,
        });
      })
      .catch((e) => {});
  };
  return (
    <Panel
      id={"effortmonth"}
      sortable={true}
      allowClose={false}
      title="Biểu đồ thống kê"
      icon={images.icon.ic_dashboad}
    >
      <div className="chart-status row">
        <div className="detail-left col-md-4">
          <div className="row">
            <div className="col-md-6">
              <Form.Item className="chart-selcect" label="Nội dung biểu đồ">
                <Select
                  placeholder="Nội dung biểu đồ"
                  onChange={(e, i) => {
                    props.onChange(e);
                  }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  value={state.typeChart}
                >
                  <Option value={1}>Thống kê theo trạng thái thiết bị</Option>
                  <Option value={2}>
                    Thống kê tỷ lệ BV đã nhập, chưa nhập dữ liệu
                  </Option>
                  <Option value={3}>
                    Thống kê tên thiết bị theo trạng thái và khả năng điều
                    chuyển
                  </Option>
                  <Option value={4}>
                    Thống kê tên thiết bị theo nguồn vốn
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item className="chart-selcect" label="Trạng thái">
                <Select
                  value={state.trangThaiId}
                  placeholder="Chọn trạng thái"
                  onChange={(e, i) => {
                    setState({
                      trangThaiId: e,
                    });
                    loadData("trangThaiId", e);
                  }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">Tất cả</Option>
                  {state.listStatus && state.listStatus.length
                    ? state.listStatus.map((item, index) => {
                        return (
                          item && (
                            <Option key={index} value={item.id}>
                              {item.ten}
                            </Option>
                          )
                        );
                      })
                    : null}
                </Select>
              </Form.Item>
              <Form.Item className="chart-selcect" label="Cơ sở y tế">
                <Select
                  value={state.coSoYTeId}
                  placeholder="Chọn cơ sở y tế"
                  onChange={(e, i) => {
                    setState({
                      coSoYTeId: e,
                    });
                    loadData("coSoYTeId", e);
                  }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">Tất cả</Option>
                  {state.listHospital && state.listHospital.length
                    ? state.listHospital.map((item, index) => {
                        return (
                          item && (
                            <Option key={index} value={item.id}>
                              {item.ten}
                            </Option>
                          )
                        );
                      })
                    : null}
                </Select>
              </Form.Item>
              <Form.Item className="chart-selcect" label="Loại biểu đồ">
                <Select
                  value={state.bieuDo}
                  placeholder="Chọn loại biểu đồ"
                  onChange={(e, i) => {
                    setState({
                      bieuDo: e,
                    });
                    loadData("bieuDo", e);
                  }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value={1}>Hình Cột</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item className="chart-selcect" label="Tỉnh/Thành phố">
                <Select
                  value={state.tinhThanhPhoId}
                  placeholder="Chọn tỉnh/Thành phố"
                  onChange={(e, i) => {
                    setState({
                      tinhThanhPhoId: e,
                    });
                    getDistrict(e);
                    loadData("tinhThanhPhoId", e);
                  }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {props.listCitys &&
                    props.listCitys.length &&
                    props.listCitys.map((option, index) => {
                      return (
                        <Option key={index} value={option.id}>
                          {option.ten}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
              <Form.Item className="chart-selcect" label="Quận/huyện">
                <Select
                  value={state.quanHuyenId}
                  placeholder="Chọn quận/huyện"
                  onChange={(e, i) => {
                    setState({
                      quanHuyenId: e,
                    });
                    loadData("quanHuyenId", e);
                    getCommune(e);
                  }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">Chọn quận/huyện</Option>
                  {state.listDistrict && state.listDistrict.length
                    ? state.listDistrict.map((item, index) => {
                        return (
                          item && (
                            <Option key={index} value={item.id}>
                              {item.ten}
                            </Option>
                          )
                        );
                      })
                    : null}
                </Select>
              </Form.Item>
              <Form.Item className="chart-selcect" label="Xã/phường">
                <Select
                  value={state.xaPhuongId}
                  placeholder="Chọn xã/phường"
                  onChange={(e, i) => {
                    setState({
                      xaPhuongId: e,
                    });
                    loadData("xaPhuongId", e);
                  }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">Chọn xã/phường</Option>
                  {state.listCommune && state.listCommune.length
                    ? state.listCommune.map((item, index) => {
                        return (
                          item && (
                            <Option key={index} value={item.id}>
                              {item.ten}
                            </Option>
                          )
                        );
                      })
                    : null}
                </Select>
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="col-md-8 detail-right">
          <h3 className="title">
            <small></small>
          </h3>
          <div
            id="chartdiv"
            style={{ width: "100%", height: "calc(100vh - 300px)" }}
          ></div>
          {/* 
          <canvas ref={chartRef} /> */}
        </div>
      </div>
    </Panel>
  );
}

export default connect(
  (state) => {
    return {
      listCitys: state.city.listCitys,
    };
  },
  {
    getCity: actionCity.getCity,
  }
)(index);
