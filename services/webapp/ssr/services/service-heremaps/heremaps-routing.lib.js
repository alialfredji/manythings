
// API REFERENCE FOR QUERY
// https://developer.here.com/documentation/routing/topics/resources.html

const config = {}

export const query = async (method, values = {}) => {
    const formatted = Object.keys(values)
        .map(key => `${key}=${values[key]}`)
        .join('&')

    const url = `${config.url}/${method}.json?${config.auth}&${formatted}`
    const res = await fetch(url)
    if (res.status !== 200) throw res
    const data = await res.json()
    
    return {
        ...res,
        data,
    }
}

export const init = ({ appId, appCode }, ctx) => {
    config.auth = `app_id=${appId}&app_code=${appCode}`
    config.url = 'https://route.api.here.com/routing/7.2'
}

export const start = () => {}