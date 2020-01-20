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

## Important note:

This extension needs some fixing. It seems like the remote server is not processing the POST request anymore (displays a "No invader around you" message everytime).
WIP, in the folder MitmProxyFiles.
What I think is the problem:

-  there are 3 kinds of things which are sent to the remote server: the headers, the fields and the image. I checked the last two params are fine so it mist be the header.
