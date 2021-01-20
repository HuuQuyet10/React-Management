import React, { useEffect, useState } from 'react';
import { AdminPage, Panel } from "@admin/components/admin";
import trangthietbiProvider from "@data-access/trangthietbi-provider";
import images from "../../../../../resources/images";
import { Button, Row, Col, Form } from "antd";
import "./style.scss";
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
            return { ...state, ...data, };
        });
    };
    const onClose = () => () => {
        props.history.push("/admin/quan-ly-trang-thiet-bi");
    };
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
                    console.log("shsh", s.ma_thiet_bi)
                    setState({
                        ma_thiet_bi: s.ma_thiet_bi,
                        ten_thiet_bi: s.ten_thiet_bi,
                        loai_thiet_bi: s.loai_thiet_bi,
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
                title="CHI TIẾT TRANG THIẾT BỊ"
                icon={images.icon.ic_hospital}
            >
                <Row span={24}>
                    <Col span={3}>
                        <Form.Item label="Mã thiết bị">
                        </Form.Item>
                        <Form.Item label="Loại thiết bị">
                        </Form.Item>
                        <Form.Item label="Chủng loại">
                        </Form.Item>
                        <Form.Item label="Năm nhập kho">
                        </Form.Item>
                    </Col>
                    <Col span={9}>
                        <Form.Item>
                            <span>{state.ma_thiet_bi}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.loai_thiet_bi}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.chung_loai}</span>
                        </Form.Item>
                        <Form.Item>
                            <span>{state.nam_nhap_kho}</span>
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item label="Tên thiết bị">
                        </Form.Item>
                        <Form.Item label="Số máy">
                        </Form.Item>
                        <Form.Item label="Năm sản xuất">
                        </Form.Item>
                    </Col>
                    <Col span={9}>
                        <Form.Item>
                            <span>{state.ten_thiet_bi}</span>
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