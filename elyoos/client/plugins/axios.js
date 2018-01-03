import axios from 'axios'

let options = {};
options.baseURL = `http://localhost:8080`;
options.withCredentials = true;

let ax = {
    options,
    create: () => {
        return axios.create(ax.options);
    }
};

export default ax;