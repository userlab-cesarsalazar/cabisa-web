module.exports.formatNumber = number => {
    if (number === 0) return number
    let num1 = number?.split('.')[0]
    let num2 = number?.split('.')[1]?.slice(0, 2) || "00"
    num1 = num1
        .toString()
        .split('')
        .reverse()
        .join('')
        .replace(/(?=\d*\.?)(\d{3})/g, '$1,')
    num1 = num1
        .split('')
        .reverse()
        .join('')
        .replace(/^[.]/, '')
    let num = `${num1}.${num2}`
    return num
}

module.exports.validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}
