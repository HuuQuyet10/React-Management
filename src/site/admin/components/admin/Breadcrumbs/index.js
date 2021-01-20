import React from "react";
import { Link } from "react-router-dom";
// import { useRouter } from 'next/router'
import "./style.scss";
function index(props) {
  // const router = useRouter();
  const getBreadcrumbs = () => {
    let url = (window.location.pathname || "").toLowerCase();
    let obj = [];
    switch (url) {
      case "/admin":
      case "/admin/quan-ly-trang-thiet-bi":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Trang chủ"
          },
          {
            url: "/admin/quan-ly-trang-thiet-bi",
            name: "Quản lý trang thiết bị"
          }
        ];
        break;
      case "/admin/quan-ly-vat-tu":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Trang chủ"
          },
          {
            url: "/admin/quan-ly-vat-tu",
            name: "Quản lý vật tư"
          }
        ];
        break;
       case "/admin/da-cho-thue":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Trang chủ"
          },
          {
            url: "/admin/da-cho-thue",
            name: "Đã cho thuê"
          }
        ];
        break;
      case "/admin/quan-ly-trang-thiet-bi/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Trang chủ",
          },
          {
            url: "/admin/quan-ly-trang-thiet-bi",
            name: "Quản lý trang thiết bị",
          },
          {
            url: "/admin/quan-ly-trang-thiet-bi/create",
            name: "Tạo mới thiết bị",
          },
        ];
        break;
      case "/admin/quan-ly-vat-tu/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Trang chủ",
          },
          {
            url: "/admin/quan-ly-vat-tu",
            name: "Quản lý trang vật tư",
          },
          {
            url: "/admin/quan-ly-vat-tu/create",
            name: "Tạo mới vật tư",
          },
        ];
        break;
      case "/admin/da-cho-thue/create":
        obj = [
          {
            icon: "fal fa-home mr-1",
            url: "/admin",
            name: "Trang chủ",
          },
          {
            url: "/admin/da-cho-thue",
            name: "Cho thuê",
          },
          {
            url: "/admin/da-cho-thue/create",
            name: "Tạo mới người thuê",
          },
        ];
        break;
      default:
        if (url.indexOf("/admin/quan-ly-trang-thiet-bi/edit") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/admin",
              name: "Home",
            },
            {
              url: "/admin/quan-ly-trang-thiet-bi",
              name: "Quản lý trang thiết bị",
            },
            {
              name: "Chỉnh sửa thiết bị",
            },
          ];
        } else if (url.indexOf("/admin/quan-ly-vat-tu/edit") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/admin",
              name: "Home",
            },
            {
              url: "/admin/quan-ly-vat-tu",
              name: "Quản lý trang vật tư",
            },
            {
              name: "Chỉnh sửa vật tư",
            },
          ];
        } else if (url.indexOf("/admin/da-cho-thue/edit") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/admin",
              name: "Home",
            },
            {
              url: "/admin/da-cho-thue",
              name: "Quản lý trang cho thuê",
            },
            {
              name: "Chỉnh sửa người thuê",
            },
          ];
        } else if (url.indexOf("/admin/quan-ly-trang-thiet-bi/view-infor") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/admin",
              name: "Home",
            },
            {
              url: "/admin/quan-ly-trang-thiet-bi",
              name: "Quản lý trang thiết bị",
            },
            {
              name: "Xem chi tiết",
            },
          ];
        } else if (url.indexOf("/admin/quan-ly-vat-tu/view-infor") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/admin",
              name: "Home",
            },
            {
              url: "/admin/quan-ly-vat-tu",
              name: "Quản lý trang vật tư",
            },
            {
              name: "Xem chi tiết",
            },
          ];
        } else if (url.indexOf("/admin/da-cho-thue/view-infor") === 0) {
          obj = [
            {
              icon: "fal fa-home mr-1",
              url: "/admin",
              name: "Home",
            },
            {
              url: "/admin/da-cho-thue",
              name: "Quản lý trang cho thuê",
            },
            {
              name: "Xem chi tiết",
            },
          ];
        }
        break;
    }
    return obj;
  };

  // console.log(window.location.pathname);
  const breadCrumb = getBreadcrumbs();
  return (
    <ol className="breadcrumb bg-info-400">
      {breadCrumb.map((item, index) => {
        if (index < breadCrumb.length - 1)
          return (
            <li className="breadcrumb-item" key={index}>
              <Link to={item.url || "#"} className="text-white">
                {item.icon && <i className="fal fa-home mr-1"></i>}
                {item.name}
              </Link>
            </li>
          );
        return (
          <li className="breadcrumb-item active text-white" key={index}>
            {item.name}
          </li>
        );
      })}
    </ol>
  );
}
export default index;
