import React, { useState, useEffect, useRef } from "react";
import statisticalProvider from "@data-access/statistical-provider";
import { Select, Form } from "antd";
import { Panel } from "@admin/components/admin";
import communeProvider from "@data-access/commune-provider";
import districtProvider from "@data-access/district-provider";
import hospitalProvider from "@data-access/hospital-provider";
import nameDeviceProvider from "@data-access/commercial-name-provider";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import actionCity from "@actions/city";
import { connect } from "react-redux";
import snackbar from "@utils/snackbar-utils";
import images from "@src/resources/images";
import "./style.scss";
am4core.useTheme(am4themes_animated);
const { Option } = Select;

function index(props) {
  const chartRef = useRef(null);
  const [state, _setState] = useState({
    typeChart: 4,
    tinhThanhPhoId: "",
    quanHuyenId: "",
    xaPhuongId: "",
    coSoYTeId: "",
    thietBiId: "",
    data: {},
    bieuDo: 1,
    listNames: [],
  });
  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };
  const loadData = (action, item) => {
    let tinhThanhPhoId =
      action === "tinhThanhPhoId" ? item : state.tinhThanhPhoId;
    let quanHuyenId = action === "quanHuyenId" ? item : state.quanHuyenId;
    let xaPhuongId = action === "xaPhuongId" ? item : state.xaPhuongId;
    let coSoYTeId = action === "coSoYTeId" ? item : state.coSoYTeId;
    let tenThietBi = action === "tenThietBi" ? item : state.tenThietBi;
    statisticalProvider
      .resource(tinhThanhPhoId, quanHuyenId, xaPhuongId, coSoYTeId, tenThietBi)
      .then((s) => {
        if (s && s.code === 0 && s.data && s.data.length) {
          let obj = {};
          let arr = [];
          s.data.forEach((item) => {
            if (!obj[item.maNguonVon]) {
              obj[item.maNguonVon] = {
                code: item.maNguonVon,
                nameNV: item.nguonVon,
                thietbi: {},
              };
            }
            if (item.maThietBi) {
              if (!obj[item.maNguonVon].thietbi[item.maThietBi]) {
                obj[item.maNguonVon].thietbi[item.maThietBi] = {
                  id: item.maThietBi,
                  name: item.tenThietBi,
                  number: 0,
                };
              }
              obj[item.maNguonVon].thietbi[item.maThietBi].number +=
                item.soLuong;
            }
          });
          for (let key in obj) {
            arr.push(obj[key]);
          }
          if (tenThietBi) {
            showChart(arr, true);
          } else {
            showChart(arr);
          }
        } else if (s && s.code === 0 && s.data && s.data.length === 0) {
          showChart([]);
          snackbar.show(
            "Thông báo, Không có dữ liệu tương ứng với tiêu chí vừa chọn!",
            "danger"
          );
        }
      });
  };
  useEffect(() => {
    loadData();
    getHospital();
    getName();
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

  const showChart = (data, type) => {
    if (type) {
      let chart = am4core.create("chartdiv", am4charts.PieChart3D);
      chart.hiddenState.properties.opacity = 0;
      chart.legend = new am4charts.Legend();
      chart.data =
        data && data.length
          ? data.map((item) => {
              let item2 = {};
              item2.nameNV = item.nameNV;
              for (let key in item.thietbi) {
                item2["value"] = item.thietbi[key].number;
              }
              return item2;
            })
          : [];
      let series = chart.series.push(new am4charts.PieSeries3D());
      series.dataFields.value = "value";
      series.dataFields.category = "nameNV";
      series.hiddenState.properties.opacity = 1;
      series.hiddenState.properties.endAngle = -90;
      series.hiddenState.properties.startAngle = -90;
      setColor(series);
    } else {
      let chart = am4core.create("chartdiv", am4charts.XYChart);
      setColor(chart);
      let _series = {};
      chart.data =
        data && data.length
          ? data.map((item) => {
              let item2 = {};
              item2.nameNV = item.nameNV;
              for (let key in item.thietbi) {
                item2[item.thietbi[key].name] = item.thietbi[key].number;
                _series[item.thietbi[key].name] = "";
              }
              return item2;
            })
          : [];
      let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "nameNV";
      categoryAxis.numberFormatter.numberFormat = "#";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;

      let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());

      // Create series
      function createSeries(field, name) {
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = "nameNV";
        series.name = name;
        series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
        series.columns.template.height = am4core.percent(90);
        series.sequencedInterpolation = true;

        let valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = "{valueX}";
        valueLabel.label.horizontalCenter = "left";
        valueLabel.label.dx = 10;
        valueLabel.label.hideOversized = false;
        valueLabel.label.truncate = false;

        let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
        // categoryLabel.label.text = "{name}";
        categoryLabel.label.horizontalCenter = "right";
        categoryLabel.label.dx = -10;
        categoryLabel.label.fill = am4core.color("#fff");
        categoryLabel.label.hideOversized = false;
        categoryLabel.label.truncate = false;
      }
      for (let key in _series) {
        createSeries(key, key);
      }

      // createSeries("income", "Income");
      // createSeries("expenses", "Expenses");
    }
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
  const getName = () => {
    let params = {
      page: 1,
      size: 999999,
    };
    nameDeviceProvider
      .search(params)
      .then((s) => {
        if (s && s.code === 0) {
          setState({
            listNames: s.data,
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
              <Form.Item className="chart-selcect" label="Tên thiết bị">
                <Select
                  value={state.thietBiId}
                  placeholder="Chọn tên thiết bị"
                  onChange={(e, i) => {
                    setState({
                      thietBiId: e,
                      tenThietBi: e ? i.props.children : "",
                    });
                    loadData("tenThietBi", e ? i.props.children : "");
                  }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="">Tất cả</Option>
                  {state.listNames && state.listNames.length
                    ? state.listNames.map((item, index) => {
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
