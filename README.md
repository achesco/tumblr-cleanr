# tumblr-cleanr-cli
Broken media posts cleaning tool. Cleans up (removes) video-posts with media pointing to 403 error returning URLs.

## Credentials

In order to use tumblr api for getting and removing posts, credentials file shold be provided. File content JSON should look like this:

```json
{
  "consumer_key": " consumer key value ",
  "consumer_secret": " consumer secret value ",
  "token": " token value ",
  "token_secret": "token secret value"
}
```

## Usage

Installing the tool:
```bash
npm install -g tumblr-cleanr-cli
```

Cleaning up through all posts in blog:
```bash
tumblr-cleanr myBlogName --credentials path/to/keys.json
```

Cleaning up through last 30 video-posts in blog:
```bash
tumblr-cleanr myBlogName --credentials path/to/keys.json --limit 30
```


### Get access with Tumblr
* [Tumblr auto auth tool](https://github.com/achesco/tumblr-auto-auth)
* [Docs](https://www.tumblr.com/docs/en/api/v2#what_you_need)
