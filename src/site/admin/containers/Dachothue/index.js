import React, { useState, useEffect } from "react";
import { AdminPage, Panel } from "@admin/components/admin";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { Select, Button, DatePicker, Form, Input, Tooltip, Modal } from "antd";
import snackbar from "@utils/snackbar-utils";
import chothueProvider from "@data-access/chothue-provider";
import images from "../../../../resources/images";

import "./style.scss";
const { confirm } = Modal;
const Option = Select.Option;
function index(props) {
    const [state, _setState] = useState({
        size: 10,
        page: 1,
        id: "",
    });
    const setState = (data = { props }) => {
        _setState((state) => {
            return { ...state, ...data, };
        });
    };
    const onSizeChange = (size) => {
        onSearch("size", size);
        setState({
            size: size,
        });
    };
    const onPageChange = (page) => {
        onSearch("page", page);
        setState({
            page: page,
        });
    };
    useEffect(() => {
        onSearch();
    }, []);
    const onSearch = (action, item) => {
        let page = action === "page" ? item : action === "size" ? 1 : state.page;
        let size = action === "size" ? item : state.size;
        let id = action === "id" ? item : state.id
        let ma_nguoi_thue = action === "ma_nguoi_thue" ? item : state.ma_nguoi_thue;
        let ten_nguoi_thue = action === "ten_nguoi_thue" ? item : state.ten_nguoi_thue;
        let tuoi_nguoi_thue = action === "tuoi_nguoi_thue" ? item : state.tuoi_nguoi_thue;
        let diachi_nguoi_thue = action === "diachi_nguoi_thue" ? item : state.diachi_nguoi_thue;
        let phone_nguoi_thue = action === "phone_nguoi_thue" ? item : state.phone_nguoi_thue;
        let so_luong_thue = action === "so_luong_thue" ? item : state.so_luong_thue;
        let loai = action === "loai" ? item : state.loai;
        let ngay_thue = action === "ngay_thue" ? item && new Date(item).format("YYYY-MM-dd") : state.ngay_thue ? new Date(state.ngay_thue).format("YYYY-MM-dd") : "";
        let ngay_tra = action === "ngay_tra" ? item && new Date(item).format("YYYY-MM-dd") : state.ngay_tra ? new Date(state.ngay_tra).format("YYYY-MM-dd") : "";
        chothueProvider
            .getApi(
                page,
                size,
                ma_nguoi_thue,
                ten_nguoi_thue,
                tuoi_nguoi_thue,
                diachi_nguoi_thue,
                phone_nguoi_thue,
                so_luong_thue,
                loai,
                ngay_thue,
                ngay_tra
            )
            .then((s) => {
                setState({
                    total: s,
                    data:
                        s && s.length
                            ? s.map((item, index) => {
                                return {
                                    key: index,
                                    col1: (page - 1) * size + index + 1,
                                    col2: item.ma_nguoi_thue,
                                    col3: item.ten_nguoi_thue,
                                    col4: item.tuoi_nguoi_thue,
                                    col5: item.diachi_nguoi_thue,
                                    col6: item.phone_nguoi_thue,
                                    col7: item.so_luong_thue,
                                    col8: item.loai,
                                    col9: new Date(item.ngay_thue).format("dd-MM-YYYY"),
                                    col10: new Date(item.ngay_tra).format("dd-MM-YYYY"),
                                    col11: item,
                                };
                            })
                            : [],
                })
            })
    };

    const viewdeltailItem = (item) => {
        props.history.push("/admin/da-cho-thue/view-infor/" + item.id);
    };

    const onDeleteItem = (item) => {
        return new Promise((resolve, reject) => {
            confirm({
                title: "Xác nhận",
                content: `Bạn có muốn xóa ${item.ten_nguoi_thue}?`,
                okText: "Xóa",
                okType: "danger",
                cancelText: "Hủy",
                onOk() {
                    chothueProvider
                        .delete(item.id)
                        .then((s) => {
                            if (s) {
                                snackbar.show("Xóa đào tạo thành công", "success");
                                onSearch();
                            } else {
                                snackbar.show("Xóa đào tạo không thành công", "danger");
                            }
                        })
                        .catch((e) => { });
                },
                onCancel() {
                    reject();
                },
            });
        });
    };
    const editItem = (item) => {
        if (item) {
            props.history.push("/admin/da-cho-thue/edit/" + item.id);
            
        } else {
            props.history.push("/admin/da-cho-thue/create");
        }
    };
    return (
        <AdminPage
            icon="subheader-icon fal fa-window"
            header="Quản lý người thuê"
            subheader="Danh sách người đã thuê hàng"
        >
            <Panel
                id="panel-list-site"
                title="DANH SÁCH NGƯỜI THUÊ"
                icon={images.icon.ic_hospital}
                toolbar={
                    <div className="toolbar">
                        <Button className="button" onClick={() => editItem()}>
                            Thêm mới
                        </Button>
                    </div>
                }
            >
                <Table
                    scroll={{ x: 800, y: 500 }}
                    style={{ marginLeft: -10, marginRight: -10 }}
                    className="custom"
                    columns={[
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">STT</div>
                                    <div className="addition-box"></div>
                                </div>
                            ),
                            width: 100,
                            dataIndex: "col1",
                            key: "col1",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Mã người thuê</div>
                                    <div className="addition-box">
                                        <div className="search-box">
                                            <img src={images.icon.ic_search} />
                                            <input
                                                onChange={(e) => {
                                                }}
                                                placeholder="Tìm mã thiết bị"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ),
                            width: 250,
                            dataIndex: "col2",
                            key: "col2",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Tên người thuê</div>
                                    <div className="addition-box">
                                        <div className="search-box">
                                            <img src={images.icon.ic_search} />
                                            <input
                                                onChange={(e) => {
                                                }}
                                                placeholder="Tìm tên thiết bị"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ),
                            width: 200,
                            dataIndex: "col3",
                            key: "col3",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Tuổi người thuê</div>
                                    <div className="addition-box">
                                        <div className="search-box">
                                            <img src={images.icon.ic_search} />
                                            <input
                                                onChange={(e) => {
                                                }}
                                                placeholder="Tìm loại thiết bị"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ),
                            width: 200,
                            dataIndex: "col4",
                            key: "col4",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Địa chỉ người thuê</div>
                                    <div className="addition-box">
                                        <div className="search-box">
                                            <img src={images.icon.ic_search} />
                                            <input
                                                onChange={(e) => {
                                                }}
                                                placeholder="Tìm loại thiết bị"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ),
                            width: 200,
                            dataIndex: "col5",
                            key: "col5",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Số điện thoại</div>
                                    <div className="addition-box">
                                        <div className="search-box">
                                            <img src={images.icon.ic_search} />
                                            <input
                                                onChange={(e) => {
                                                }}
                                                placeholder="Tìm số máy"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ),
                            width: 200,
                            dataIndex: "col6",
                            key: "col6",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Số lượng thuê</div>
                                    <div className="addition-box">
                                        <div className="search-box">
                                            <img src={images.icon.ic_search} />
                                            <input
                                                onChange={(e) => {
                                                }}
                                                placeholder="Tìm số máy"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ),
                            width: 200,
                            dataIndex: "col7",
                            key: "col7",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Loại</div>
                                    <div className="addition-box">
                                        <div className="search-box">
                                            <img src={images.icon.ic_search} />
                                            <input
                                                onChange={(e) => {
                                                }}
                                                placeholder="Tìm chủng loại"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ),
                            width: 200,
                            dataIndex: "col8",
                            key: "col8",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Ngày thuê</div>
                                    <div className="addition-box">
                                        <DatePicker
                                            onChange={(e) => {
                                            }}
                                            style={{ width: "100%" }}
                                            disabled={props.id ? true : false}
                                            format={"dd/MM/YYYY"}
                                            placeholder="Nhập sản xuất"
                                            getPopupContainer={(trigger) => trigger.parentNode}
                                        />
                                    </div>
                                </div>
                            ),
                            width: 200,
                            dataIndex: "col9",
                            key: "col9",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Năm trả</div>
                                    <div className="addition-box">
                                        <DatePicker
                                            onChange={(e) => {
                                            }}
                                            style={{ width: "100%" }}
                                            disabled={props.id ? true : false}
                                            format={"dd/MM/YYYY"}
                                            placeholder="Nhập nhập kho"
                                            getPopupContainer={(trigger) => trigger.parentNode}
                                        />
                                    </div>
                                </div>
                            ),
                            width: 200,
                            dataIndex: "col10",
                            key: "col10",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Tiện ích</div>
                                    <div className="addition-box"></div>
                                </div>
                            ),
                            width: 100,
                            dataIndex: "col11",
                            key: "col11",
                            align: "center",
                            fixed: "right",
                            render: (item) => {
                                return (
                                    <div className="col-action">
                                        <Tooltip placement="topLeft" title={"Xem chi tiết"}>
                                            <div>
                                                <button
                                                    onClick={() => viewdeltailItem(item)}
                                                    className="btn btn-info btn-icon waves-effect waves-themed btn-edit"
                                                >
                                                    <i className="fal fa-eye"></i>
                                                </button>
                                            </div>
                                        </Tooltip>
                                        <Tooltip placement="topLeft" title={"Sửa"}>
                                            <div>
                                                <button
                                                    onClick={() => editItem(item)}
                                                    className="btn btn-info btn-icon waves-effect waves-themed btn-edit"
                                                >
                                                    <i className="fal fa-edit"></i>
                                                </button>
                                            </div>
                                        </Tooltip>
                                        <Tooltip placement="topLeft" title={"Xóa"}>
                                            <div>
                                                <button
                                                    onClick={() => onDeleteItem(item)}
                                                    className="btn btn-info btn-icon waves-effect waves-themed btn-delete"
                                                >
                                                    <i className="fal fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </Tooltip>
                                    </div>
                                );
                            },
                        },
                    ]}
                    dataSource={state.data}
                ></Table>
                <div className="footer">
                    <SelectSize value={state.size} selectItem={onSizeChange} />
                    <Pagination
                        onPageChange={onPageChange}
                        page={state.page}
                        size={state.size}
                        total={state.total}
                        style={{ flex: 1, justifyContent: "flex-end" }}
                    />
                </div>
            </Panel>
        </AdminPage>
    );
}
export default Form.create()(index);
