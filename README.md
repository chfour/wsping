# wsping

> what if... you could use [cnping](https://github.com/cntools/cnping)... but on your phone... and it was sh\*tty and used websockets

Yeah.

## usage

All you need is a websockets echo server (sends back anything you send).

Enter its address into the field on the page and click the \[connect\] button. That's basically all.

Such a server is provided in `server/`.
To use it, install the dependencies (there's only one lol) by running `npm i` in the server directory.
Then you can start it using `node index.js`. Use `node index.js -h` for more info.
