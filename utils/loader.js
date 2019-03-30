const babel = require('babel-loader');
module.exports = require("babel-loader").custom(babel => {
    const reg = /([^\$\{\}]*)(\$\{([A-Z]+)\})/g;
    return {

        result(result) {
            console.log(result)
            return {
                ...result,
                code: result.code.replace(reg, function (match, p1, p2, p3 ) {
                return p1 + process.env[p3]
            }),
            };
        },
    };
});