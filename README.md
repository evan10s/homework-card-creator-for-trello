# Homework Card Creator for Trello
[![Codacy Badge](https://api.codacy.com/project/badge/49cfc72ab2204f79922fa9040bcb8549)](https://www.codacy.com/app/evan-strat/homework-card-creator-for-trello)

An HTML file on your phone that lets you quickly create Trello cards with automatically generated attributes, like due dates or labels, to help you save time.

Note: you don't need the script.js file for Homework Card Creator for Trello to work properly.  It's just here so that the Javascript can be analyzed by [Codacy](http://codacy.com).

About v0.2.0
--------------
v0.2.0 is contains big changes to Homework Card Creator for Trello.  The release notes will have all the details, but here's the gist of what's planned:
- ES2015 is now used for Javascript development.  However, to maintain compatibility with browsers, the actual Javascript that gets used is converted back to ES5.1 using Babel.
- For development purposes, Javscript has been split out of the main file.  The new files are index.html for the page HTML, moment.js for working with dates, script.js for communication with the Trello API, and index-end-of-file.html to close up index.html.  These files get concatenated into hw-card-creator-compiled.html which is then placed in the /build directory.
- Multiple Trello lists will now be able to reside in one file, rather than having one file for each list.
- Issue #8 will be fixed.
- Form fields will emptied when a card is created successfully.
- client.js from the Trello API may be used.
- The font may be changed to Roboto.

Current Limitations
===================
 - See [#4](https://github.com/evan10s/homework-card-creator-for-trello/issues/4)

Setup Instructions
==================

Android devices
---------------
1. For quick access, you'll want to save index.html file to your device.  Though slightly counterintuitive, you can't just download the index.html file to your device, open it in Google Chrome, and then save it to your homescreen.  As soon as you close the Chrome app (swipe it away in the Recent Apps display), if you try to open index.html using your shortcut, you'll get a message saying Chrome has stopped responding.
2. Luckily, there's a workaround.  If you download the [Open in Browser](https://play.google.com/store/apps/details?id=ru.gelin.android.browser.open) app on the Play Store, you can make a shortcut through that app and you'll be able to open the index.html file.
3. After you have downloaded Open in Browser, open the app and pick the browser you want to open index.html with.  (Note: there's no Save button.  You can just close the app to save your preference.)
4. Now, get the index.html file onto your device.  Here's the easiest way:
 4.1. Download the ZIP file of the latest Homework Card Creator for Trello releae.  Unzip it on your computer.
 4.2. Change the settings in index.html (they start on line 3312, after moment.js).  You'll need to specify values for any variables with all CAPS names.  (This will be simpler in the future.)
 4.3. Transfer the file to your device.  You can email it, add it a cloud storage service, etc.
 4.4. Save the file to your device.  The option might be called "Download" or "Export."
5. Open the File Manager app on your device.  Go to the Download (or Downloads) folder (or wherever you saved it) and select the index.htm file you downloaded to your device.  Find the Share option and tap on it.
6. Tap on Desktop Shortcut, and enter a name you like.
7. Go to your home screen and find the shortcut that was created.
8. Tap on the shortcut.  You'll get a prompt asking if you want to Open with Browser.  Tap Always or the equivalent "Do this by default" option if you're on an earlier version of Android.
9. That's it!  If you've properly configured Homework Card Creator for Trello, it should work.

iOS devices
-----------
*Coming soon*

FAQ
===
**The file gets stuck on a *Generating form...* message.**
This probably means that there's an error in the Javascript.

Homework Card Creator for Trello was not created by Trello (and is not sponsored by Trello) but does work with Trello using the Trello API.

Open Source Attributions
========================
Homework Card Creator for Trello uses the following open-source software:

 - moment.js
    See the license at `/LICENSE` in the [moment.js Github repository](https://github.com/moment/moment).
    Or see the moment.js license as of the version of moment.js included in this project:
        
>Copyright (c) 2011-2015 Tim Wood, Iskren Chernev, Moment.js contributors

>Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

>The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
    
