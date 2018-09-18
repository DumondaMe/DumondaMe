export async function postWithFile(axios, file, uploadUrl, params) {
    return await uploadWithFile(axios, file, uploadUrl, params, '$post');
}

export async function putWithFile(axios, file, uploadUrl, params) {
    return await uploadWithFile(axios, file, uploadUrl, params, '$put');
}

async function uploadWithFile(axios, file, uploadUrl, params, restCommand) {
    const fd = new FormData();
    fd.append('file', file);
    if (params) {
        fd.append('model', JSON.stringify(params));
    }
    return await axios[restCommand](uploadUrl, fd);
}
