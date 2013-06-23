checkBattery
============

Firefox OS basic application

To use this application, simply copy the repository somewhere on your web server. Then, you can access it by opening *index.html*. You can also install the application on your Firefox OS device by opening *install.html*. The installed application is a packaged application: the application is installed on the device; it does not need an internet connection. 

When you modify the source code you need to update the zip file (*checkBattery.zip*): simply zip all the files of the current folder.


Todo
====

It would be great to use the top-right *+* button to install the application. Once you press it, the script of *install.html* is executed. Then the button disappears once the application is installed.


Credits
=======

* For the idea and the manifest file: [a post by  Rob Lauer](http://www.adobe.com/devnet/html5/articles/writing-your-first-firefox-os-app.html)
* For the idea of using only one manifest file: [ffos-lantern](https://github.com/ssj4maiko/ffos-lantern)
* For the design (title/buttons): [Firefox OS Boilerplate App](https://github.com/robnyman/Firefox-OS-Boilerplate-App)
