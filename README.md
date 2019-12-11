# Invader Chrome extension

## Instructions

First, to be able use this Chrome extension, you need to retrieve your game user id (uid).
As explained in this [blog article](http://adrienrahier.com/blog/how-i-chased-space-invaders-17000kms-far-from-home/) this can be done using a Proxy (like [MITM proxy](https://mitmproxy.org)) once you have setup an invader account.

Then, simply do the following:

1. Download the repository content, unzip it, and rename the `tofill.credentials.js` file into `credentials.js`.
2. Fill `credentials.js` with your user id credential.
3. Go to this URL chrome://extensions, activate the developer mode and load this unpacked extension.

## Credits:

The extension's code is inspired from [docshot](https://github.com/mapbox/docshot)
