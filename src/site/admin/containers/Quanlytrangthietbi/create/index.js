import React, { useState, useEffect, useRef } from "react";
import { Form, DatePicker, Button, Col, Row, Input, Select, Upload, Modal } from "antd";
import snackbar from "@utils/snackbar-utils";
import { AdminPage, Panel } from "@admin/components/admin";
import trangthietbiProvider from "@data-access/trangthietbi-provider";
import images from "../../../../../resources/images";
import moment from "moment"
const { TextArea } = Input;
const { Option } = Select;
function index(props) {
    let id = props.match.params.id;
    const [state, _setState] = useState({
        ma_thiet_bi: "",
        ten_thiet_bi: "",
        loai_thiet_bi: "",
        so_may: "",
        chung_loai: "",
        hang_san_xuat: "",
        nam_san_xuat: "",
        nam_nhap_kho: "",
    });
    const setState = (data = { props }) => {
        _setState((state) => {
            return { ...state, ...data };
        });
    };
    const { getFieldDecorator } = props.form;
    useEffect(() => {
        if (id) {
            getDetail(id);
        }
    }, []);

    const getDetail = (id) => {
        trangthietbiProvider
            .getApiValue(id)
            .then((s) => {
                if (s) {
                    setState({
                        ma_thiet_bi: s.ma_thiet_bi,
                        ten_thiet_bi: s.ten_thiet_bi,
                        loai_thiet_bi: s.loai_thiet_bi,
                        so_may: s.so_may,
                        chung_loai: s.chung_loai,
                        hang_san_xuat: s.hang_san_xuat,
                        nam_san_xuat: s.nam_san_xuat ? moment(s.nam_san_xuat) : "",
                        nam_nhap_kho: s.nam_nhap_kho ? moment(s.nam_nhap_kho) : "",
                    });
                }
            })
            .catch((e) => { });
    };
    const onClose = () => () => {
        props.history.push("/admin/quan-ly-trang-thiet-bi");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
            if (!err) {
                create();
            }
        });
    };
    const create = () => {
        let {
            ma_thiet_bi,
            ten_thiet_bi,
            loai_thiet_bi,
            so_may,
            chung_loai,
            hang_san_xuat,
            nam_san_xuat,
            nam_nhap_kho,
        } = state;
        let params = {
            ma_thiet_bi,
            ten_thiet_bi,
            loai_thiet_bi,
            so_may,
            chung_loai,
            hang_san_xuat,
            nam_san_xuat,
            nam_nhap_kho,
        };
        trangthietbiProvider
            .createOrEdit(id, params)
            .then((s) => {
                if (s) {
                    if (id) {
                        snackbar.show("Cập nhật thiết bị thành công", "success");
                    } else {
                        snackbar.show("Thêm mới thiết bị thành công", "success");
                    }
                    props.history.push("/admin/quan-ly-trang-thiet-bi");
                } else {
                    if (id) {
                        snackbar.show("Cập nhật thiết bị thất bại", "danger");
                    } else {
                        snackbar.show("Thêm mới thiết bị thất bại", "danger");
                    }
                }
            })
            .catch((e) => { });
    }
    const checkTenthietbi = (ten_thiet_bi, value, callback) => {
        if (!value || !state.ten_thiet_bi) {
            callback([new Error("Vui lòng Nhập tên thiết bị")]);
        } else {
            if (value.length > 255) {
                callback([new Error("Vui lòng nhập tên thiết bị không quá tối đa 255 kí tự!")]);
            } else {
                callback();
            }
        }
    };
    const checkMathietbi = (ma_thiet_bi, value, callback) => {
        if (!value || !state.ma_thiet_bi) {
            callback([new Error("Vui lòng Nhập mã thiết bị")]);
        } else {
            if (value.length > 255) {
                callback([new Error("Vui lòng nhập mã thiết bị không quá tối đa 255 kí tự!")]);
            } else {
                callback();
            }
        }
    };
    const checkHangsanxuat = (hang_san_xuat, value, callback) => {
        if (!value || !state.hang_san_xuat) {
            callback([new Error("Vui lòng Nhập hãng sản xuất")]);
        } else {
            if (value.length > 255) {
                callback([new Error("Vui lòng nhập hãng sản xuất không quá tối đa 255 kí tự!")]);
            } else {
                callback();
            }
        }
    };
    const { previewVisible, previewImage, fileList } = state;
    const handleCancel = () => setState({ previewVisible: false });
    return (
        <AdminPage className="mgr-manufacturer">
            <Panel
                title={id ? "CẬP NHẬT THIẾT BỊ" : "THÊM MỚI THIẾT BỊ"}
                id={"mgr-manufacturer"}
                allowClose={false}
                allowCollapse={false}
                icon={images.icon.ic_hospital}
            >
                <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-2">
                            <Form.Item label="Mã thiết bị:">
                            </Form.Item>
                            <Form.Item label="Loại thiết bị:">
                            </Form.Item>
                            <Form.Item label="Chủng loại:">
                            </Form.Item>
                            <Form.Item label="Năm sản xuất:">
                            </Form.Item>
                        </div>
                        <div className="col-4">
                            <Form.Item>
                                {getFieldDecorator("ma_thiet_bi", {
                                    rules: [{ validator: checkMathietbi }],
                                    initialValue: state.ma_thiet_bi,
                                })(
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        ma_thiet_bi: e.target.value
                                    })}
                                    value={state.ma_thiet_bi}
                                    placeholder="Nhập mã thiết bị"
                                />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        loai_thiet_bi: e.target.value
                                    })}
                                    value={state.loai_thiet_bi}
                                    placeholder="Nhập loại thiết bị"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        chung_loai: e.target.value
                                    })}
                                    value={state.chung_loai}
                                    placeholder="Nhập chủng loại"
                                />
                            </Form.Item>
                            <Form.Item>
                                <DatePicker
                                    value={state.nam_san_xuat}
                                    onChange={(e) => {
                                        setState({
                                            nam_san_xuat: e._d,
                                        });
                                    }}
                                    style={{ width: "100%" }}
                                    format={"dd/MM/YYYY"}
                                    placeholder="Nhập năm sản xuất"
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                />
                            </Form.Item>
                        </div>
                        <div className="col-2">
                            <Form.Item label="Tên thiết bị:">
                            </Form.Item>
                            <Form.Item label="Số máy:">
                            </Form.Item>
                            <Form.Item label="Hãng sản xuất:">
                            </Form.Item>
                            <Form.Item label="Năm nhập kho:">
                            </Form.Item>
                        </div>
                        <div className="col-4">
                            <Form.Item>
                                {getFieldDecorator("ten_thiet_bi", {
                                    rules: [{ validator: checkTenthietbi }],
                                    initialValue: state.ten_thiet_bi,
                                })(
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        ten_thiet_bi: e.target.value
                                    })}
                                    value={state.ten_thiet_bi}
                                    placeholder="Nhập tên thiết bị"
                                />
                                )} 
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        so_may: e.target.value
                                    })}
                                    value={state.so_may}
                                    placeholder="Nhập số máy"
                                />
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator("hang_san_xuat", {
                                    rules: [{ validator: checkHangsanxuat }],
                                    initialValue: state.hang_san_xuat,
                                })(
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        hang_san_xuat: e.target.value
                                    })}
                                    value={state.hang_san_xuat}
                                    placeholder="Nhập hãng sản xuất"
                                />
                                )} 
                            </Form.Item>
                            <Form.Item>
                                <DatePicker
                                    value={state.nam_nhap_kho}
                                    onChange={(e) => {
                                        setState({
                                            nam_nhap_kho: e._d,
                                        });
                                    }}
                                    style={{ width: "100%" }}
                                    format={"dd/MM/YYYY"}
                                    placeholder="Nhập năm nhập kho"
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div
                        style={{
                            width: "100%",
                            borderTop: "1px solid #e9e9e9",
                            padding: "16px 16px 0px",
                            background: "#fff",
                            textAlign: "right"
                        }}
                    >
                        <Button onClick={onClose(false)} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                            {id ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>
                    </div>
                </Form>
            </Panel>
            <Modal visible={previewVisible} footer={null} onCancel={handleCancel} >
                <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
        </AdminPage>
    );
}

export default (Form.create()(index));
