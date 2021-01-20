import React, { useState, useRef, useEffect } from "react";
import { Upload, Button } from "antd";
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
    window.open(file.url);
  };

  const handleChange = ({ fileList }) => {};

  const { previewVisible, previewImage, fileList } = state;
  const uploadButton = (
    <div>
      <Button className="ant-upload-text">
        <i className="fal fa-cloud-upload"></i> Tải lên
      </Button>
    </div>
  );
  const onSaveFile = () => {
    let url = files.current
      .filter((item) => item.status == "done")
      .map((item) => item.url);
    if (props.onSaveFile) props.onSaveFile(url);
  };
  return (
    <div className="clearfix">
      <Upload
        fileList={fileList.map((item) => {
          let item2 = {
            uid: item.uid,
            name: item.name,
            url: item.url,
            status: item.status,
          };
          if (item2.url) {
            let exts = item2.url.split(".");
            let ext = exts[exts.length - 1].toLowerCase();
            switch (ext) {
              case "doc":
              case "docx":
              case "xlsx":
              case "xls":
              case "ppt":
              case "pptx":
                item2.url =
                  "https://docs.google.com/viewer?url=" +
                  item2.url.absoluteFileUrl() +
                  "&embedded=true";
                break;
              default:
                item2.url = item2.url.absoluteFileUrl();
            }
          }

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
            hasChange: true,
          });
          fileProvider
            .uploadFile(file)
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
        accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.rar,.7z,.zip,.pdf,.txt"
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      {state.hasChange && (
        <Button style={{ marginTop: 20 }} onClick={onSaveFile}>
          Lưu thay đổi
        </Button>
      )}
    </div>
  );
}
