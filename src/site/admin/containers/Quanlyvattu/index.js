import React, { useState, useEffect } from "react";
import { AdminPage, Panel } from "@admin/components/admin";
import Table from "@admin/components/common/Table";
import SelectSize from "@admin/components/common/SelectSize";
import Pagination from "@admin/components/common/Pagination";
import { Select, Button, DatePicker, Form, Input, Tooltip, Modal } from "antd";
import snackbar from "@utils/snackbar-utils";
import trangvattuProvider from "@data-access/trangvattu-provider";
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
        let ma_vat_tu = action === "ma_vat_tu" ? item : state.ma_vat_tu;
        let ten_vat_tu = action === "ten_vat_tu" ? item : state.ten_vat_tu;
        let loai_vat_tu = action === "loai_vat_tu" ? item : state.loai_vat_tu;
        let so_may = action === "so_may" ? item : state.so_may;
        let chung_loai = action === "chung_loai" ? item : state.chung_loai;
        let hang_san_xuat = action === "hang_san_xuat" ? item : state.hang_san_xuat;
        let nam_san_xuat = action === "nam_san_xuat" ? item && new Date(item).format("YYYY-MM-dd") : state.nam_san_xuat ? new Date(state.nam_san_xuat).format("YYYY-MM-dd") : "";
        let nam_nhap_kho = action === "nam_nhap_kho" ? item && new Date(item).format("YYYY-MM-dd") : state.nam_nhap_kho ? new Date(state.nam_nhap_kho).format("YYYY-MM-dd") : "";
        trangvattuProvider
            .getApi(
                page,
                size,
                ma_vat_tu,
                ten_vat_tu,
                loai_vat_tu,
                so_may,
                chung_loai,
                hang_san_xuat,
                nam_san_xuat,
                nam_nhap_kho
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
                                    col2: item.ma_vat_tu,
                                    col3: item.ten_vat_tu,
                                    col4: item.loai_vat_tu,
                                    col5: item.so_may,
                                    col6: item.chung_loai,
                                    col7: item.hang_san_xuat,
                                    col8: new Date(item.nam_san_xuat).format("dd-MM-YYYY"),
                                    col9: new Date(item.nam_nhap_kho).format("dd-MM-YYYY"),
                                    col10: item,
                                };
                            })
                            : [],
                })
            })
    };

    const viewdeltailItem = (item) => {
        props.history.push("/admin/quan-ly-vat-tu/view-infor/" + item.id);
    };

    const onDeleteItem = (item) => {
        return new Promise((resolve, reject) => {
            confirm({
                title: "Xác nhận",
                content: `Bạn có muốn xóa ${item.ten_vat_tu}?`,
                okText: "Xóa",
                okType: "danger",
                cancelText: "Hủy",
                onOk() {
                    trangvattuProvider
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
            props.history.push("/admin/quan-ly-vat-tu/edit/" + item.id);
            
        } else {
            props.history.push("/admin/quan-ly-vat-tu/create");
        }
    };
    return (
        <AdminPage
            icon="subheader-icon fal fa-window"
            header="Quản lý vật tư"
            subheader="Danh sách các loại vật tư"
        >
            <Panel
                id="panel-list-site"
                title="DANH SÁCH VẬT TƯ"
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
                                    <div className="title-box">Mã vật tư</div>
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
                                    <div className="title-box">Tên vật tư</div>
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
                                    <div className="title-box">Loại vật tư</div>
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
                                    <div className="title-box">Số máy</div>
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
                            dataIndex: "col5",
                            key: "col5",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Chủng loại</div>
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
                            dataIndex: "col6",
                            key: "col6",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Hãng sản xuất</div>
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
                            dataIndex: "col7",
                            key: "col7",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Năm sản xuất</div>
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
                            dataIndex: "col8",
                            key: "col8",
                            align: "center",
                        },
                        {
                            title: (
                                <div className="custome-header">
                                    <div className="title-box">Năm nhập kho</div>
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
                            dataIndex: "col9",
                            key: "col9",
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
                            dataIndex: "col10",
                            key: "col10",
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
