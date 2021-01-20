import React, { useState, useEffect, useRef } from "react";
import { Form, DatePicker, Button, Col, Row, Input, Select, Upload, Modal } from "antd";
import snackbar from "@utils/snackbar-utils";
import { AdminPage, Panel } from "@admin/components/admin";
import trangvattuProvider from "@data-access/trangvattu-provider";
import images from "../../../../../resources/images";
import moment from "moment"
const { TextArea } = Input;
const { Option } = Select;
function index(props) {
    let id = props.match.params.id;
    const [state, _setState] = useState({
        ma_vat_tu: "",
        ten_vat_tu: "",
        loai_vat_tu: "",
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
        trangvattuProvider
            .getApiValue(id)
            .then((s) => {
                if (s) {
                    setState({
                        ma_vat_tu: s.ma_vat_tu,
                        ten_vat_tu: s.ten_vat_tu,
                        loai_vat_tu: s.loai_vat_tu,
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
        props.history.push("/admin/quan-ly-vat-tu");
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
            ma_vat_tu,
            ten_vat_tu,
            loai_vat_tu,
            so_may,
            chung_loai,
            hang_san_xuat,
            nam_san_xuat,
            nam_nhap_kho,
        } = state;
        let params = {
            ma_vat_tu,
            ten_vat_tu,
            loai_vat_tu,
            so_may,
            chung_loai,
            hang_san_xuat,
            nam_san_xuat,
            nam_nhap_kho,
        };
        trangvattuProvider
            .createOrEdit(id, params)
            .then((s) => {
                if (s) {
                    if (id) {
                        snackbar.show("Cập nhật vật tư thành công", "success");
                    } else {
                        snackbar.show("Thêm mới vật tư thành công", "success");
                    }
                    props.history.push("/admin/quan-ly-vat-tu");
                } else {
                    if (id) {
                        snackbar.show("Cập nhật vật tư thất bại", "danger");
                    } else {
                        snackbar.show("Thêm mới vật tư thất bại", "danger");
                    }
                }
            })
            .catch((e) => { });
    }
    const checkTenvattu = (ten_vat_tu, value, callback) => {
        if (!value || !state.ten_vat_tu) {
            callback([new Error("Vui lòng Nhập tên vật tư")]);
        } else {
            if (value.length > 255) {
                callback([new Error("Vui lòng nhập tên vật tư không quá tối đa 255 kí tự!")]);
            } else {
                callback();
            }
        }
    };
    const checkMavattu = (ma_vat_tu, value, callback) => {
        if (!value || !state.ma_vat_tu) {
            callback([new Error("Vui lòng Nhập mã vật tư")]);
        } else {
            if (value.length > 255) {
                callback([new Error("Vui lòng nhập mã vật tư không quá tối đa 255 kí tự!")]);
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
                title={id ? "CẬP NHẬT VẬT TƯ" : "THÊM MỚI VẬT TƯ"}
                id={"mgr-manufacturer"}
                allowClose={false}
                allowCollapse={false}
                icon={images.icon.ic_hospital}
            >
                <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-2">
                            <Form.Item label="Mã vật tư:">
                            </Form.Item>
                            <Form.Item label="Loại vật tư:">
                            </Form.Item>
                            <Form.Item label="Chủng loại:">
                            </Form.Item>
                            <Form.Item label="Năm sản xuất:">
                            </Form.Item>
                        </div>
                        <div className="col-4">
                            <Form.Item>
                                {getFieldDecorator("ma_vat_tu", {
                                    rules: [{ validator: checkMavattu }],
                                    initialValue: state.ma_vat_tu,
                                })(
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        ma_vat_tu: e.target.value
                                    })}
                                    value={state.ma_vat_tu}
                                    placeholder="Nhập mã vật tư"
                                />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        loai_vat_tu: e.target.value
                                    })}
                                    value={state.loai_vat_tu}
                                    placeholder="Nhập loại vật tư"
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
                            <Form.Item label="Tên vật tư:">
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
                                {getFieldDecorator("ten_vat_tu", {
                                    rules: [{ validator: checkTenvattu }],
                                    initialValue: state.ten_vat_tu,
                                })(
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        ten_vat_tu: e.target.value
                                    })}
                                    value={state.ten_vat_tu}
                                    placeholder="Nhập tên vật tư"
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
