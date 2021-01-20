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
    typeChart: 1,
    trangThaiId: "",
    tinhThanhPhoId: "",
    quanHuyenId: "",
    xaPhuongId: "",
    coSoYTeId: "",
    tieuChi: 1,
    data: {},
    listStatus: [],
    bieuDo: 2,
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
    let tieuChi = action === "tieuChi" ? item : state.tieuChi;
    let bieuDo = action === "bieuDo" ? item : state.bieuDo;
    if (tieuChi === 1) trangThaiId = "";
    if (tieuChi !== 1) bieuDo = 1;
    statisticalProvider
      .status(
        trangThaiId,
        tinhThanhPhoId,
        quanHuyenId,
        xaPhuongId,
        coSoYTeId,
        tieuChi
      )
      .then((s) => {
        if (s && s.code === 0 && s.data && s.data.length) {
          let total = 0;
          let obj = {};
          let arr = [];
          if (tieuChi === 2) {
            s.data.forEach((item) => {
              total += item.soLuong;
              let statusAll = {};
              if (action !== "trangThaiId" && !state.trangThaiId) {
                if (state.listStatus && state.listStatus) {
                  state.listStatus.map((item) => {
                    return (statusAll[item.id] = {
                      id: item.id,
                      name: item.ten,
                      number: 0,
                    });
                  });
                }
              }
              if (!obj[item.maLoaiThietBi]) {
                obj[item.maLoaiThietBi] = {
                  codeType: item.maLoaiThietBi,
                  nameType: item.tenLoaiThietBi,
                  code: item.maThietBi,
                  name: item.tenThietBi,
                  status: statusAll,
                };
              }
              if (item.trangThaiId) {
                if (!obj[item.maLoaiThietBi].status[item.trangThaiId]) {
                  obj[item.maLoaiThietBi].status[item.trangThaiId] = {
                    id: item.trangThaiId,
                    name: item.trangThai,
                    number: 0,
                  };
                }
                obj[item.maLoaiThietBi].status[item.trangThaiId].number +=
                  item.soLuong;
              }
            });
          } else if (tieuChi !== 3)
            s.data.forEach((item) => {
              total += item.soLuong;
              if (!obj[item.trangThaiId]) {
                obj[item.trangThaiId] = {
                  id: item.trangThaiId,
                  name: item.trangThai,
                  type: {},
                  dictrict: {},
                  value: 0,
                };
              }
              obj[item.trangThaiId].value += item.soLuong;
              if (item.maLoaiThietBi) {
                if (!obj[item.trangThaiId].type[item.maLoaiThietBi]) {
                  obj[item.trangThaiId].type[item.maLoaiThietBi] = {
                    id: item.maLoaiThietBi,
                    name: item.tenLoaiThietBi,
                    value: 0,
                  };
                }
                obj[item.trangThaiId].type[item.maLoaiThietBi].value +=
                  item.soLuong;
              }
              if (item.maTinhThanhPho) {
                if (!obj[item.trangThaiId].dictrict[item.maTinhThanhPho]) {
                  obj[item.trangThaiId].dictrict[item.maTinhThanhPho] = {
                    id: item.maTinhThanhPho,
                    name: item.tenTinhThanhPho,
                    value: 0,
                  };
                }
                obj[item.trangThaiId].dictrict[item.maTinhThanhPho].value +=
                  item.soLuong;
              }
            });
          else
            s.data.forEach((item) => {
              total += item.soLuong;
              if (!obj[item.maTinhThanhPho]) {
                obj[item.maTinhThanhPho] = {
                  id: item.maTinhThanhPho,
                  name: item.tenTinhThanhPho,
                  type: {},
                  status: {},
                  value: 0,
                };
              }
              obj[item.maTinhThanhPho].value += item.soLuong;
              if (item.maLoaiThietBi) {
                if (!obj[item.maTinhThanhPho].type[item.maLoaiThietBi]) {
                  obj[item.maTinhThanhPho].type[item.maLoaiThietBi] = {
                    id: item.maLoaiThietBi,
                    name: item.tenLoaiThietBi,
                    value: 0,
                  };
                }
                obj[item.maTinhThanhPho].type[item.maLoaiThietBi].value +=
                  item.soLuong;
              }
              if (item.trangThaiId) {
                if (!obj[item.maTinhThanhPho].status[item.trangThaiId]) {
                  obj[item.maTinhThanhPho].status[item.trangThaiId] = {
                    id: item.trangThaiId,
                    name: item.trangThai,
                    value: 0,
                  };
                }
                obj[item.maTinhThanhPho].status[item.trangThaiId].value +=
                  item.soLuong;
              }
            });
          for (let key in obj) {
            arr.push(obj[key]);
          }
          showChart(arr, tieuChi, bieuDo);
        } else if (s && s.data && s.data.length === 0) {
          showChart([], tieuChi, bieuDo);
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

  const showChart = (data, tieuChi, bieuDo) => {
    if (tieuChi === 1) {
      if (bieuDo === 2) {
        var chart = am4core.create("chartdiv", am4charts.PieChart3D);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.legend = new am4charts.Legend();

        chart.data = data;

        chart.innerRadius = am4core.percent(45);
        var series = chart.series.push(new am4charts.PieSeries3D());
        series.dataFields.value = "value";
        series.dataFields.category = "name";

        series.hiddenState.properties.opacity = 1;
        series.hiddenState.properties.endAngle = -90;
        series.hiddenState.properties.startAngle = -90;
        setColor(series);
        chartRef.current = chart;
      } else {
        var chart = am4core.create("chartdiv", am4charts.XYChart3D);
        chart.data = data;

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.rotation = 330;
        categoryAxis.tooltip.disabled = true;
        categoryAxis.renderer.minHeight = 110;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;

        // Create series
        var series = chart.series.push(new am4charts.ConeSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "name";
        series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
        series.columns.template.strokeWidth = 0;
        series.tooltip.pointerOrientation = "vertical";

        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.fillOpacity = 0.9;
        series.columns.template.width = 90;

        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 0;
        columnTemplate.strokeOpacity = 1;
        columnTemplate.stroke = am4core.color("#2F348F");
        // on hover, make corner radiuses bigger
        // var hoverState = series.columns.template.column.states.create("hover");
        // hoverState.properties.cornerRadiusTopLeft = 0;
        // hoverState.properties.cornerRadiusTopRight = 0;
        // hoverState.properties.fillOpacity = 1;

        am4core.color("#2F348F");
        columnTemplate.adapter.add("fill", function (fill, target) {
          return am4core.color("#2F348F");
        });

        // Cursor
        chart.cursor = new am4charts.XYCursor();

        chartRef.current = chart;
      }
    } else {
      if (tieuChi === 2) {
        let chart = am4core.create("chartdiv", am4charts.XYChart);
        setColor(chart);
        let _series = {};
        let check =
          data && data.length
            ? data.map((item) => {
                let item2 = {};
                item2.nameType = item.nameType;
                for (let key in item.status) {
                  item2[item.status[key].name] = item.status[key].number;
                  _series[item.status[key].name] = "";
                }
                return item2;
              })
            : [];
        chart.data = check;
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "nameType";
        categoryAxis.renderer.labels.template.rotation = 300;
        categoryAxis.renderer.labels.template.hideOversized = false;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        let label = categoryAxis.renderer.labels.template;
        label.truncate = true;
        label.maxWidth = 120;
        label.tooltipText = "{nameType}";
        // Create value axis
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Thống kê theo trạng thái thiết bị";
        valueAxis.renderer.minLabelPosition = 0.1;

        // Create series
        function createSeries(field, name) {
          let series1 = chart.series.push(new am4charts.LineSeries());
          series1.dataFields.valueY = field;
          series1.dataFields.categoryX = "nameType";
          series1.name = name;
          series1.strokeWidth = 3;
          series1.bullets.push(new am4charts.CircleBullet());
          series1.tooltipText = "{categoryX} {name}: {valueY} ";
          series1.legendSettings.valueText = "{valueY}";
          series1.visible = false;
        }
        for (let key in _series) {
          createSeries(key, key);
        }
        // Add chart cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "zoomY";

        // Add legend
        chart.legend = new am4charts.Legend();
      }
      if (tieuChi === 3) {
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        setColor(chart);

        let _series = {};
        chart.data = data.map((item) => {
          let item2 = {};
          item2.name = item.name + "(" + item.value + ")";
          for (let key in item.status) {
            item2[item.status[key].name] = item.status[key].value;
            _series[item.status[key].name] = "";
          }
          return item2;
        });
        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "name";
        // categoryAxis.title.text = "Trạng thái: [bold]{valueY}[/]";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.cellStartLocation = 0.1;
        categoryAxis.renderer.cellEndLocation = 0.9;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.title.text = "Số lượng";

        // Create series
        function createSeries(field, name, stacked) {
          var series = chart.series.push(new am4charts.ColumnSeries());
          series.dataFields.valueY = field;
          series.dataFields.categoryX = "name";
          series.name = name;
          series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
          series.stacked = stacked;
          series.columns.template.width = am4core.percent(50);
        }
        for (let key in _series) {
          createSeries(key, key, true);
        }

        // Add legend
        chart.legend = new am4charts.Legend();
        chartRef.current = chart;
      }
    }
  };

  const getStatus = () => {
    let params = {
      page: 1,
      size: 9999,
    };
    statusProvider
      .search(params)
      .then((s) => {
        if (s && s.code === 0) {
          setState({
            listStatus: s.data,
          });
        }
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
              <Form.Item className="chart-selcect" label="Tiêu chí">
                <Select
                  value={state.tieuChi}
                  placeholder="Chọn tiêu chí"
                  onChange={(e, i) => {
                    setState({
                      tieuChi: e,
                      trangThaiId: e === 1 ? "" : state.trangThaiId,
                      bieuDo: e === 2 ? 3 : e !== 1 ? 1 : state.bieuDo,
                    });
                    loadData("tieuChi", e);
                  }}
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value={1}>Thiết bị</Option>
                  <Option value={2}>Loại thiết bị</Option>
                  <Option value={3}>Tỉnh / thành phố</Option>
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
                  {state.tieuChi !== 1 &&
                  state.listStatus &&
                  state.listStatus.length
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
              {state.tieuChi !== 3 ? (
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
              ) : null}
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
                  {state.tieuChi !== 2 && <Option value={1}>Hình Cột</Option>}
                  {state.tieuChi === 1 && <Option value={2}>Hình Tròn</Option>}
                  {state.tieuChi === 2 && (
                    <Option value={3}>Đường gấp khúc</Option>
                  )}
                </Select>
              </Form.Item>
            </div>
            {state.tieuChi !== 3 ? (
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
            ) : null}
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
