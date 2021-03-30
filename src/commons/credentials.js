
const develop = {
    clientsUrl: 'https://z8whyqlcgl.execute-api.us-east-1.amazonaws.com/dev/clients',
}

const enviroment = env => {
    switch (env) {
        case 'develop':
            return develop;
        default:
            return null;
    }
}

module.exports = {
    stage: enviroment('develop'),
}
