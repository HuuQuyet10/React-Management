import client from "../utils/client-utils";
import constants from "../resources/strings";

export default {
    getApi() {
        let url = `${constants.api.cho_thue.getAllitem}/`;
        return client.requestApi("get", url, {});
    },
    getApiValue(id) {
        let url = `${constants.api.cho_thue.getAllitem}/${id}`;
        return client.requestApi("get", url, {});
    },
    delete(id) {
        let url = constants.api.cho_thue.deleteItem + "/" + id;
        return client.requestApi("delete", url, {});
    },
    createOrEdit(
        id,
        params
    ) {
        if (!id) {
            let url = constants.api.cho_thue.addItem;
            return client.requestApi("post", url, params);
        } else {
            let url = constants.api.cho_thue.editItem + "/" + id;
            return client.requestApi("put", url, params);
        }
    },

};
