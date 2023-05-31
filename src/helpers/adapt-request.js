export default function adaptRequest (req={}) {
    return Object.freeze ({
        path: req.path,
        method: req.method,
        pathParams: req.params,
        queryParams: req.query,
        headers: req.headers,
        body: req.body
    })
}