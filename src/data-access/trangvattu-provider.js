import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
    getApi() {
        let url = `${constants.api.trang_vat_tu.getAlllItem}/`;
        return client.requestApi("get", url, {});
    },
    getApiValue(id) {
        let url = `${constants.api.trang_vat_tu.getAlllItem}/${id}`;
        return client.requestApi("get", url, {});
    },
    delete(id) {
        let url = constants.api.trang_vat_tu.deleteItem + "/" + id;
        return client.requestApi("delete", url, {});
    },

    createOrEdit(
        id,
        params
    ) {
        if (!id) {
            let url = constants.api.trang_vat_tu.addItem;
            return client.requestApi("post", url, params);
        } else {
            let url = constants.api.trang_vat_tu.editItem + "/" + id;
            return client.requestApi("put", url, params);
        }
    },

};
