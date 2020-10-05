# Invader Chrome extension

This project relies on a man-in-the-middle breach that I found on the [FlashInvader app](https://play.google.com/store/apps/details?id=com.ltu.flashInvader&utm_source=www.apk4fun.com).

Rather than using this to my advantage I coded a Chrome extension that exploits this vulnerability to make the game playable directly in your Chromes / Google Street View.

## Important note

Since Jan 2020 the breach has been fixed.
A "No invader around you" message is sent back everytime a POST request is made to the remote server.

While auditing the patch I found that:

-  The remote server is now only accepting images that are from a specific dimensions, color profile, and format (jpg)
-  The remote server is now only accepting GPS coordinates in a specific format.

Anyway, I had a lot of fun making this. Thank you for the people who encouraged me and big shoutout to Space invader anyway.

## (Legacy) Instructions

First, to be able use this Chrome extension, you need to retrieve your game user id (uid).
As explained in this [blog article](https://medium.com/@adrienrahier/how-i-chased-space-invaders-17000kms-far-from-home-754efc434ac8) this can be done using a Proxy (like [MITM proxy](https://mitmproxy.org)) once you have setup an invader account.

Then, simply do the following:

1. Download the repository content, unzip it, and rename the `tofill.credentials.js` file into `credentials.js`.
2. Fill `credentials.js` with your user id credential.
3. Go to this URL chrome://extensions, activate the developer mode and load this unpacked extension.

## Other

### Android Emulator

To launch the emulator without having to launch Android Studio:
\$ ~/Library/Android/sdk/tools/emulator -avd Nexus_S_API_23

### Mapstr and Paris Invasion

I made a Node.js script to scrap the data from the Flickr Paris Group.
Launch command:
\$ node invader.js
It output a clean JSON or CSV of the locations.
To load it in Mapstr, save the csv in the iPhone's file and then click open with ... Mapstr.
Enjoy!

## Credits:

The extension's code is inspired from [docshot](https://github.com/mapbox/docshot)
