export function dataURItoBlob(dataURI) {
    let binary = window.atob(dataURI.split(',')[1]), array = [], i;
    for (i = 0; i < binary.length; i = i + 1) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}
