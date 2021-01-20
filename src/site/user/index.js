import React from 'react'
import Loadable from 'react-loadable';
import { Route, Link, Switch } from "react-router-dom";
import { Redirect } from 'react-router';
// import Header from '@user/components/Header';
// import Footer from '@user/components/Footer';
import RouterWithPaths from '@components/RouterWithPaths';
function Loading() {
    return <div></div>;
}
export default function index(props) {
    const routers = [
        // tại đây tạo giống như trên phần admin
    ]
    return (
        <div>
            {/* <Header /> */}
            <Switch>
                {
                    routers.map((route, key) => {
                        if (route.component)
                            return <RouterWithPaths exact key={key}
                                path={route.path}
                                render={props => {
                                    return <route.component {...props} />
                                }} />
                        return null;
                    })
                }
            </Switch>
            {/* <Footer /> */}
        </div>
    )
}
