import React, { useEffect, useState } from 'react';
import { AdminPage, Panel } from "@admin/components/admin";
import chothueProvider from "@data-access/chothue-provider";
import images from "../../../../../resources/images";
import { Button, Row, Col, Form } from "antd";
import "./style.scss";
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
        nam_san_xuat: "",
        nam_nhap_kho: "",
    });
    const setState = (data = { props }) => {
        _setState((state) => {
            return { ...state, ...data, };
        });
    };
    const onClose = () => () => {
        props.history.push("/admin/quan-ly-vat-tu");
    };
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
                        nam_san_xuat: new Date(s.nam_san_xuat).format("dd-MM-YYYY"),
                        nam_nhap_kho: new Date(s.nam_nhap_kho).format("dd-MM-YYYY"),
                    });

                }
            })
            .catch((e) => { });
    };
    return (
        <AdminPage>
            <Panel
                id="panel-list-site"
                title="CHI TIẾT TRANG VẬT TƯ"
                icon={images.icon.ic_hospital}
            >
                <Row span={24}>
                    <Col span={3}>
                        <Form.Item label="Mã người thuê">
                        </Form.Item>
                        <Form.Item label="Tuổi người thuê">
                        </Form.Item>
                        <Form.Item label="Số điện thoại">
                        </Form.Item>
                        <Form.Item label="Loại">
                        </Form.Item>
                        <Form.Item label="Năm nhập kho">
                        </Form.Item>
                    </Col>
                    <Col span={9}>
                        <Form.Item>
                            <span>{state.ma_nguoi_thue}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.tuoi_nguoi_thue}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.phone_nguoi_thue}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.loai}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.nam_nhap_kho}</span>
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item label="Tên người thuê">
                        </Form.Item>
                        <Form.Item label="Địa chỉ khách">
                        </Form.Item>
                        <Form.Item label="Số lượng">
                        </Form.Item>
                        <Form.Item label="Loại">
                        </Form.Item>
                        <Form.Item label="Năm sản xuất">
                        </Form.Item>
                    </Col>
                    <Col span={9}>
                        <Form.Item>
                            <span>{state.ten_nguoi_thue}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.diachi_nguoi_thue}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.so_luong_thue}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.loai}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.nam_san_xuat}</span>
                        </Form.Item>
                    </Col>
                </Row>
                <div
                    style={{
                        width: "100%",
                        borderTop: "1px solid #e9e9e9",
                        padding: "16px 16px 0px",
                        background: "#fff",
                        textAlign: "right"
                    }}
                >
                    <Button type="primary" onClick={onClose(false)} style={{ marginRight: 8 }}>
                        Quay lai
                        </Button>

                </div>
            </Panel>
        </AdminPage>
    );
}

export default index;