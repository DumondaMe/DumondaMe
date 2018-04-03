export async function uploadFileToUrl(axios, file, uploadUrl, params) {
    const fd = new FormData();
    fd.append('file', file);
    if (params) {
        fd.append('model', JSON.stringify(params));
    }
    return await axios.$post(uploadUrl, fd);
}
