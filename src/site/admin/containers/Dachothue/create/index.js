import React, { useState, useEffect, useRef } from "react";
import { Form, DatePicker, Button, Col, Row, Input, Select, Upload, Modal } from "antd";
import snackbar from "@utils/snackbar-utils";
import { AdminPage, Panel } from "@admin/components/admin";
import chothueProvider from "@data-access/chothue-provider";
import images from "../../../../../resources/images";
import moment from "moment"
const { TextArea } = Input;
const { Option } = Select;
function index(props) {
    let id = props.match.params.id;
    const [state, _setState] = useState({
        ma_nguoi_thue: "",
        ten_nguoi_thue: "",
        tuoi_nguoi_thue: "",
        diachi_nguoi_thue: "",
        phone_nguoi_thue: "",
        so_luong_thue: "",
        loai: "",
        ngay_thue: "",
        ngay_tra: "",
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
        chothueProvider
            .getApiValue(id)
            .then((s) => {
                if (s) {
                    setState({
                        ma_nguoi_thue: s.ma_nguoi_thue,
                        ten_nguoi_thue: s.ten_nguoi_thue,
                        tuoi_nguoi_thue: s.tuoi_nguoi_thue,
                        diachi_nguoi_thue: s.diachi_nguoi_thue,
                        phone_nguoi_thue: s.phone_nguoi_thue,
                        so_luong_thue: s.so_luong_thue,
                        loai: s.loai,
                        ngay_thue: s.ngay_thue ? moment(s.ngay_thue) : "",
                        ngay_tra: s.ngay_tra ? moment(s.ngay_tra) : "",
                    });
                }
            })
            .catch((e) => { });
    };
    const onClose = () => () => {
        props.history.push("/admin/da-cho-thue");
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
            ma_nguoi_thue,
            ten_nguoi_thue,
            tuoi_nguoi_thue,
            diachi_nguoi_thue,
            phone_nguoi_thue,
            so_luong_thue,
            loai,
            ngay_thue,
            ngay_tra,
        } = state;
        let params = {
            ma_nguoi_thue,
            ten_nguoi_thue,
            tuoi_nguoi_thue,
            diachi_nguoi_thue,
            phone_nguoi_thue,
            so_luong_thue,
            loai,
            ngay_thue,
            ngay_tra,
        };
        chothueProvider
            .createOrEdit(id, params)
            .then((s) => {
                if (s) {
                    if (id) {
                        snackbar.show("Cập nhật người thuê thành công", "success");
                    } else {
                        snackbar.show("Thêm mới người thuê thành công", "success");
                    }
                    props.history.push("/admin/da-cho-thue");
                } else {
                    if (id) {
                        snackbar.show("Cập nhật người thuê thất bại", "danger");
                    } else {
                        snackbar.show("Thêm mới người thuê thất bại", "danger");
                    }
                }
            })
            .catch((e) => { });
    }
    const checkTennguoithue = (ten_nguoi_thue, value, callback) => {
        if (!value || !state.ten_nguoi_thue) {
            callback([new Error("Vui lòng Nhập tên người thuê")]);
        } else {
            if (value.length > 255) {
                callback([new Error("Vui lòng nhập tên người thuê không quá tối đa 255 kí tự!")]);
            } else {
                callback();
            }
        }
    };
    const checkManguoithue = (ma_nguoi_thue, value, callback) => {
        if (!value || !state.ma_nguoi_thue) {
            callback([new Error("Vui lòng Nhập mã người thuê")]);
        } else {
            if (value.length > 255) {
                callback([new Error("Vui lòng nhập mã người thuê không quá tối đa 255 kí tự!")]);
            } else {
                callback();
            }
        }
    };
    // const checkSoluong = (hang_san_xuat, value, callback) => {
    //     if (!value || !state.hang_san_xuat) {
    //         callback([new Error("Vui lòng Nhập số lượng")]);
    //     } else {
    //         if (value.length > 255) {
    //             callback([new Error("Vui lòng nhập số lượng không quá tối đa 255 kí tự!")]);
    //         } else {
    //             callback();
    //         }
    //     }
    // };
    const { previewVisible, previewImage, fileList } = state;
    const handleCancel = () => setState({ previewVisible: false });
    return (
        <AdminPage className="mgr-manufacturer">
            <Panel
                title={id ? "CẬP NHẬT NGƯỜI THUÊ" : "THÊM MỚI NGƯỜI THUÊ"}
                id={"mgr-manufacturer"}
                allowClose={false}
                allowCollapse={false}
                icon={images.icon.ic_hospital}
            >
                <Form layout="vertical" hideRequiredMark onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-2">
                            <Form.Item label="Mã người thuê:">
                            </Form.Item>
                            <Form.Item label="Tuổi người thuê:">
                            </Form.Item>
                            <Form.Item label="Số điện thoại người thuê:">
                            </Form.Item>
                            <Form.Item label="Loại:">
                            </Form.Item>
                            <Form.Item label="Ngày trả:">
                            </Form.Item>
                        </div>
                        <div className="col-4">
                            <Form.Item>
                                {/* {getFieldDecorator("ma_nguoi_thue", {
                                    rules: [{ validator: checkManguoithue }],
                                    initialValue: state.ma_nguoi_thue,
                                })( */}
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        ma_nguoi_thue: e.target.value
                                    })}
                                    value={state.ma_nguoi_thue}
                                    placeholder="Nhập mã người thuê"
                                />
                                {/* )} */}
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        tuoi_nguoi_thue: e.target.value
                                    })}
                                    value={state.tuoi_nguoi_thue}
                                    placeholder="Nhập tuổi người thuê"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        phone_nguoi_thue: e.target.value
                                    })}
                                    value={state.phone_nguoi_thue}
                                    placeholder="Nhập số điện thoại người thuê"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        loai: e.target.value
                                    })}
                                    value={state.loai}
                                    placeholder="Nhập loại thiết bị"
                                />
                            </Form.Item>
                            <Form.Item>
                                <DatePicker
                                    value={state.ngay_tra}
                                    onChange={(e) => {
                                        setState({
                                            ngay_tra: e._d,
                                        });
                                    }}
                                    style={{ width: "100%" }}
                                    format={"dd/MM/YYYY"}
                                    placeholder="Nhập ngày trả"
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                />
                            </Form.Item>
                        </div>
                        <div className="col-2">
                            <Form.Item label="Tên người thuê:">
                            </Form.Item>
                            <Form.Item label="Địa chỉ người thuê">
                            </Form.Item>
                            <Form.Item label="Số lượng thuê:">
                            </Form.Item>
                            <Form.Item label="Ngày thuê:">
                            </Form.Item>
                        </div>
                        <div className="col-4">
                            <Form.Item>
                                {/* {getFieldDecorator("ten_nguoi_thue", {
                                    rules: [{ validator: checkTennguoithue }],
                                    initialValue: state.ten_nguoi_thue,
                                })( */}
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        ten_nguoi_thue: e.target.value
                                    })}
                                    value={state.ten_nguoi_thue}
                                    placeholder="Nhập tên người thuê"
                                />
                                {/* )}  */}
                            </Form.Item>
                            <Form.Item>
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        diachi_nguoi_thue: e.target.value
                                    })}
                                    value={state.diachi_nguoi_thue}
                                    placeholder="Nhập địa chỉ người thuê"
                                />
                            </Form.Item>
                            <Form.Item>
                                {/* {getFieldDecorator("hang_san_xuat", {
                                    rules: [{ validator: checkHangsanxuat }],
                                    initialValue: state.hang_san_xuat,
                                })( */}
                                <Input
                                    autoComplete="off"
                                    onChange={e => setState({
                                        so_luong_thue: e.target.value
                                    })}
                                    value={state.so_luong_thue}
                                    placeholder="Nhập số lượng thuê"
                                />
                                {/* )}  */}
                            </Form.Item>
                            <Form.Item>
                                <DatePicker
                                    value={state.ngay_thue}
                                    onChange={(e) => {
                                        setState({
                                            ngay_thue: e._d,
                                        });
                                    }}
                                    style={{ width: "100%" }}
                                    format={"dd/MM/YYYY"}
                                    placeholder="Nhập ngày thuê"
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
