# Invader Chrome extension

## Important note

This Chrome extension is not working anymore since January 2020.
A "No invader around you" message is sent back everytime a POST request is made to the remote server/

While trying to understand what breaking change was introduced I found out that:

-  The remote server is now only accepting images that are from a specific dimensions, color profile, and format (jpg)
-  The remote server is now only accepting GPS coordinates in a specific format.

These two reasons make it impossible to fix the extension :-(

Anyway, I had a lot of fun making this.
Thank you for the people who encouraged me and big shoutout to Space invader anyway.

## (Legacy) Instructions

First, to be able use this Chrome extension, you need to retrieve your game user id (uid).
As explained in this [blog article](http://adrienrahier.com/blog/how-i-chased-space-invaders-17000kms-far-from-home/) this can be done using a Proxy (like [MITM proxy](https://mitmproxy.org)) once you have setup an invader account.

Then, simply do the following:

1. Download the repository content, unzip it, and rename the `tofill.credentials.js` file into `credentials.js`.
2. Fill `credentials.js` with your user id credential.
3. Go to this URL chrome://extensions, activate the developer mode and load this unpacked extension.

## Other

Launch the emulator without having to launch Android Studio:
\$ ~/Library/Android/sdk/tools/emulator -avd Nexus_S_API_23`

## Credits:

The extension's code is inspired from [docshot](https://github.com/mapbox/docshot)
