import React, { useState, useEffect, useRef } from "react";
import "./style.scss";
import { connect } from "react-redux";
import ItemMenu from "../ItemMenu";
import $ from "jquery";
function index(props) {
  const menus = useRef(null);
  const [state, _setState] = useState({
    menus: [
      {
        href: "/admin/quan-ly-trang-thiet-bi",
        i18n: "nav.dashboard",
        name: "Quản lý trang thiết bị",
        icon: "fal fa-layer-group",
        filter: "dashboard quản lý trang thiết bị"
      },
      {
        href: "/admin/quan-ly-vat-tu",
        i18n: "nav.dashboard",
        name: "Quản lý vật tư",
        icon: "fal fa-tasks-alt",
        filter: "dashboard quản lý vật tư"
      },
      {
        href: "/admin/da-cho-thue",
        i18n: "nav.dashboard",
        name: "Đã cho thuê",
        icon: "fal fa-handshake",
        filter: "dashboard đã cho thuê"
      },
      {
        href: "#",
        icon: "fal fa-folder-tree",
        i18n: "nav.mgr-category",
        name: "Quản lý danh mục",
        filter: "Quản lý danh mục category ",
        role: 2,
        menus: [
          {
            href: "/admin/job",
            name: "Danh mục công việc",
            filter: "Quản lý danh mục công việc job management",
            i18n: "nav.job-management"
          },
          {
            href: "/admin/project",
            name: "Danh mục dự án",
            filter: "Quản lý danh mục dự án project management",
            i18n: "nav.project-management"
          },
          {
            href: "/admin/product",
            name: "Danh mục sản phẩm",
            filter: "Quản lý danh mục sản phẩm product management",
            i18n: "nav.product-management"
          }
        ]
      }
    ],
    show: false
  });
  const setState = _state => {
    _setState(state => ({
      ...state,
      ...(_state || {})
    }));
  };
  useEffect(() => {
    try {
      window.initApp.listFilter(
        $("#js-nav-menu"),
        $("#nav_filter_input"),
        $("#js-primary-nav")
      );
    } catch (error) { }
  });
  useEffect(() => {
    if (menus.current) {
      setState({ menus: menus.current });
    }
  }, []);
  const toggle = item => {
    item.open = !item.open;
    menus.current = [...state.menus];
    setState({ menus: menus.current });
  };
  return (
    <aside className="page-sidebar">
      <div className="page-logo">
        <a
          href="#"
          className={`page-logo-link 
          press-scale-down 
          d-flex align-items-center position-relative`}
        // data-toggle="modal"
        // data-target="#modal-shortcut"
        >
          <img
            src="/img/logo.png"
            alt="Quản Lý Kho Hàng"
            aria-roledescription="logo"
          />
          <span className="page-logo-text mr-1">Quản Lý Kho Hàng</span>
          {/* <span className="position-absolute text-white opacity-50 small pos-top pos-right mr-2 mt-n2"></span>
          <i className="fal fa-angle-down d-inline-block ml-1 fs-lg color-primary-300"></i> */}
        </a>
      </div>
      <nav
        id="js-primary-nav"
        className="primary-nav js-list-filter"
        role="navigation"
      >
        <div className="nav-filter">
          <div className="position-relative">
            <input
              type="text"
              id="nav_filter_input"
              placeholder="Tìm kiếm tính năng"
              className="form-control"
              tabIndex="0"
            />
            <a
              href="#"
              onClick={() => {
                return false;
              }}
              className="btn-primary btn-search-close js-waves-off"
              data-action="toggle"
              data-class="list-filter-active"
              data-target=".page-sidebar"
            >
              <i className="fal fa-chevron-up"></i>
            </a>
          </div>
        </div>
        <div className="info-card">
          <img
            src="/img/demo/avatars/avata03.jpg"
            className="profile-image rounded-circle"
            alt="Hữu Quyết"
          />
          <div className="info-card-text">
            <a href="#" className="d-flex align-items-center text-white">
              <span className="text-truncate text-truncate-sm d-inline-block">
                Hữu Quyết
              </span>
            </a>
            <span className="d-inline-block text-truncate text-truncate-sm">
              quyethuu.pham198@gmail.com
            </span>
          </div>
          <img
            src="/img/card-backgrounds/cover-2-lg.png"
            className="cover"
            alt="cover"
          />
          <a
            href="#"
            onClick={() => {
              return false;
            }}
            className="pull-trigger-btn"
            data-action="toggle"
            data-class="list-filter-active"
            data-target=".page-sidebar"
            data-focus="nav_filter_input"
          >
            <i className="fal fa-angle-down"></i>
          </a>
        </div>
        <ul id="js-nav-menu" className="nav-menu">
          {state.menus.map((item, index) => {
            if (props.role >= item.role || !item.role)
              return <ItemMenu key={index} item={item} toggle={toggle} />;
          })}
        </ul>
        <div className="filter-message js-filter-message bg-success-600"></div>
      </nav>
      <div className="nav-footer shadow-top">
        <a
          href="#"
          onClick={() => {
            return false;
          }}
          data-action="toggle"
          data-class="nav-function-minify"
          className="hidden-md-down"
        >
          <i className="ni ni-chevron-right"></i>
          <i className="ni ni-chevron-right"></i>
        </a>
        <ul className="list-table m-auto nav-footer-buttons">
          <li>
            <a
              href="#"
              data-toggle="tooltip"
              data-placement="top"
              title="Đến trang web của tôi ?"
              data-original-title="Chat logs"
            >
              <i className="fal fa-comments"></i>
            </a>
          </li>
          <li>
            <a
              href="mailto:quyethuu.pham198@gmail.com"
              data-toggle="tooltip"
              data-placement="top"
              title="Support Email !!"
              data-original-title="Support Email !!"
            >
              <i className="fal fa-life-ring"></i>
            </a>
          </li>
          <li>
            <a
              href="tel:0962630174"
              data-toggle="tooltip"
              data-placement="top"
              title="Support phone ?"
              data-original-title="Make a call"
            >
              <i className="fal fa-phone"></i>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps)(index);
