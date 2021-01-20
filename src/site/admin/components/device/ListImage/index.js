import React, { useState, useRef, useEffect } from "react";
import { Upload, Modal, Button } from "antd";
import fileProvider from "@data-access/file-provider";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function index(props) {
  const files = useRef([]);
  const [state, _setState] = useState({
    previewVisible: false,
    previewImage: "",
    fileList: files.current,
  });
  const setState = (_state) => {
    _setState((state) => ({
      ...state,
      ...(_state || {}),
    }));
  };
  useEffect(() => {
    files.current = (props.files || []).map((item) => {
      return {
        status: "done",
        uid: item,
        name: item,
        url: item,
      };
    });
    setState({
      fileList: files.current,
      hasChange: false
    });
  }, [props.files]);
  const handleCancel = () => setState({ previewVisible: false });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  const handleChange = ({ fileList }) => {};

  const { previewVisible, previewImage, fileList } = state;
  const uploadButton = (
    <div>
      <div className="ant-upload-text">Tải ảnh lên</div>
    </div>
  );
  const onSave = () => {
    let url = files.current
      .filter((item) => item.status == "done")
      .map((item) => item.url);
    if (props.onSave) props.onSave(url);
  };
  return (
    <div className="clearfix">
      <Upload
        listType="picture-card"
        fileList={fileList.map((item) => {
          let item2 = JSON.parse(JSON.stringify(item));
          if (item2.url) item2.url = item2.url.absoluteFileUrl();
          return item2;
        })}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={(file) => {
          files.current = files.current.filter((item) => item.uid != file.uid);
          setState({
            fileList: files.current,
            hasChange: true,
          });
        }}
        customRequest={({ onSuccess, onError, file }) => {
          file.status = "uploading";
          files.current.push(file);
          setState({
            fileList: files.current,
          });
          fileProvider
            .uploadImage(file)
            .then((s) => {
              var x = files.current.find((item) => item.uid == file.uid);
              if (x) {
                if (s && s.code == 0 && s.data.length) {
                  let url = s.data[0];
                  x.status = "done";
                  x.url = url;
                } else {
                  x.status = "error";
                }
                setState({
                  fileList: files.current,
                  hasChange: true,
                });
              }
            })
            .catch((e) => {
              var x = files.current.find((item) => item.uid == file.uid);
              if (x) {
                x.status = "error";
                setState({
                  fileList: files.current,
                });
              }
            });
        }}
        accept=".png,.gif,.jpg"
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {state.hasChange && <Button onClick={onSave}>Lưu thay đổi</Button>}
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
}
