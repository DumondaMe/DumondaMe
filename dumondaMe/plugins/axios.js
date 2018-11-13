export default ({$axios}) => {
    $axios.setHeader('If-Modified-Since', '0')
}
