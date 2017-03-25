module.exports = require('yargs')
    .usage('Usage: $0 <blog> --credentials tumblrKeys.json [--limit [num]]')
    .command('blog', 'Blog name to clean up')
    .demandCommand(1)
    .option('limit', {
        default: Number.POSITIVE_INFINITY,
        describe: 'limit posts count'
    })
    .option('credentials', {
        describe: 'tumblr JSON credentilas file path',
        demandOption: true
    })
    .example('$0 my-blog --credentials tumblrKeys.json', 'clean for all video posts in blog')
    .example('$0 my-blog --limit 33', 'clean for last 33 video posts')
    .help('h')
    .alias('h', 'help')
    .argv;
