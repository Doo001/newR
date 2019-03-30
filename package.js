
const replaceSubject = require('./utils/replaceSubject')
const webpack = require('webpack')
const webPackOptions = require('./webpack.config')
const options = {
    watch: true,
    profile: true
}
function compilerCallback(err, stats) {
    if(err) {
        lastHash = null;
        console.error(err.stack || err);
        if(err.details) console.error(err.details);
        process.exit(1); // eslint-disable-line
    } else {
        console.log('打包成功')
    }

   /* if(!options.watch || err) {
        // Do not keep cache anymore
        compiler.purgeInputFileSystem();
    }
    if(err) {
        lastHash = null;
        console.error(err.stack || err);
        if(err.details) console.error(err.details);
        process.exit(1); // eslint-disable-line
    }
    if(outputOptions.json) {
        process.stdout.write(JSON.stringify(stats.toJson(outputOptions), null, 2) + "\n");
    } else if(stats.hash !== lastHash) {
        lastHash = stats.hash;
        process.stdout.write(stats.toString(outputOptions) + "\n");
    }
    if(!options.watch && stats.hasErrors()) {
        process.on("exit", function() {
            process.exit(2); // eslint-disable-line
        });
    }*/
}
async function package() {
    try {
        await replaceSubject();
    } catch (e) {
        console.log(e);
        return ;
    }


    const compiler = webpack(Object.assign({}, webPackOptions, options));

    compiler.run(compilerCallback)
}
package()