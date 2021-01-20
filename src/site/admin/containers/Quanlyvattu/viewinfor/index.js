import React, { useEffect, useState } from 'react';
import { AdminPage, Panel } from "@admin/components/admin";
import trangvattuProvider from "@data-access/trangvattu-provider";
import images from "../../../../../resources/images";
import { Button, Row, Col, Form } from "antd";
import "./style.scss";
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
                        <Form.Item label="Mã vật tư">
                        </Form.Item>
                        <Form.Item label="Loại vật tư">
                        </Form.Item>
                        <Form.Item label="Chủng loại">
                        </Form.Item>
                        <Form.Item label="Năm nhập kho">
                        </Form.Item>
                    </Col>
                    <Col span={9}>
                        <Form.Item>
                            <span>{state.ma_vat_tu}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.loai_vat_tu}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.chung_loai}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.nam_nhap_kho}</span>
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item label="Tên vật tư">
                        </Form.Item>
                        <Form.Item label="Số máy">
                        </Form.Item>
                        <Form.Item label="Năm sản xuất">
                        </Form.Item>
                    </Col>
                    <Col span={9}>
                        <Form.Item>
                            <span>{state.ten_vat_tu}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.so_may}</span>
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