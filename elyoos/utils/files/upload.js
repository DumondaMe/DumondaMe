export async function uploadFileToUrl(axios, file, uploadUrl) {
    const fd = new FormData();
    fd.append('file', file);
    await axios.$post(uploadUrl, fd);
}
