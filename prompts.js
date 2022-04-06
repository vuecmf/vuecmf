module.exports = [
    {
        type: 'input',
        name: 'api_dev',
        message: '请输入开发环境后端API地址.',
        validate: input => !!input,
        default: 'http://www.vuecmf.com'
    },
    {
        type: 'input',
        name: 'api_test',
        message: '请输入测试环境后端API地址.',
        validate: input => !!input,
        default: 'http://www.vuecmf.com'
    },
    {
        type: 'input',
        name: 'api_prod',
        message: '请输入生产环境后端API地址.',
        validate: input => !!input,
        default: 'http://www.vuecmf.com'
    }

]