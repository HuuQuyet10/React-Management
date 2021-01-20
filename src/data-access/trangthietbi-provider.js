import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
    getApi() {
        let url = `${constants.api.trang_thiet_bi.getallItem}/`;
        return client.requestApi("get", url, {});
    },
    getApiValue(id) {
        let url = `${constants.api.trang_thiet_bi.getallItem}/${id}`;
        return client.requestApi("get", url, {});
    },
    delete(id) {
        let url = constants.api.trang_thiet_bi.deleteItem + "/" + id;
        return client.requestApi("delete", url, {});
    },
    createOrEdit(
        id,
        params
    ) {
        if (!id) {
            let url = constants.api.trang_thiet_bi.addItem;
            return client.requestApi("post", url, params);
        } else {
            let url = constants.api.trang_thiet_bi.editItem + "/" + id;
            return client.requestApi("put", url, params);
        }
    },

};
