#! /usr/bin/env node

const cli = require('./lib/cli'),
    Rx = require('rx'),
    tumblrJs = require('tumblr.js'),
    fetch = require('node-fetch');
    tumblr = require('tumblr.js').createClient({
        credentials: require(require('path').resolve(cli.credentials)),
        returnPromises: true
    }),
    BLOG = cli._[0],
    LIMIT = cli.limit,
    PER_PAGE = 20,
    REQUEST_DELAY = 1000;

Rx.Observable.fromPromise(tumblr.blogPosts(BLOG, {
    type: 'video',
    limit: 1
}))
    .do(data => console.log('total', data.total_posts))
    .flatMap(data => {
        const postsCount = Math.min(data.total_posts, LIMIT),
            pagesCount = Math.ceil(postsCount / PER_PAGE);

        const paramsArr = Array.apply(null, {length: pagesCount})
            .map((_, i) => {
                return {
                    type: 'video',
                    offset: i * PER_PAGE,
                    limit: i < pagesCount - 1 ? PER_PAGE : postsCount - i * PER_PAGE
                }
            });

        return Rx.Observable.from(paramsArr)
            .concatMap(params => {
                return Rx.Observable.of(params).delay(REQUEST_DELAY);
            })
            .flatMap(params => {
                return Rx.Observable.fromPromise(tumblr.blogPosts(BLOG, params));
            });
    })
    .do(data => console.log('posts', data.posts.length))
    .reduce((posts, data) => {
        return posts.concat(data.posts.map(post => ({
            id: post.id,
            url: post.video_url
        })));
    }, [])
    .flatMap(posts => {
        return Rx.Observable.fromArray(posts).map(post => {
            return Rx.Observable.of(post).delay(REQUEST_DELAY);
        }).concatAll();
    })
    .flatMap(post => {
        return Rx.Observable.fromPromise(
            fetch(post.url, {method: 'HEAD'}).then(resp => {
                return {
                    id: post.id,
                    status: resp.status,
                    url: post.url
                };
            })
        );
    })
    .filter(post => {
        if (post.status !== 403) {
            console.log('status: ' + post.status);
        } else {
            return true;
        }
    })
    .flatMap(post => {
        return Rx.Observable.fromPromise(
            tumblr.deletePost(BLOG, post.id)
        );
    })

    .subscribe(
        data => {console.log('cleaned', data)},
        data => {console.log('fail', data)},
        data => {console.log('all done')}
    );
