import axios from 'axios'

let options = {};
options.withCredentials = true;

let ax = {
    options,
    create: () => {
        return axios.create(ax.options);
    }
};

export default ax;