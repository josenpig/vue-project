import service from './axios.js'

export const getPersonInfo = data => {
    return service({
        url: '/person_pay/getpersoninfo',
        method: 'post',
        data
    })
};

export const getinfo = data => {
    return service({
        url: '/getinfo',
        method: 'post',
        data
    })
};
