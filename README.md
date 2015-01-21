MDWE2014-MD-Etherpad
====================

Praktikum MDWE2014/15 - Multi-Device-Extension für EtherPad lite

This Repository will host documentation and development stuff (e.g. experiments and tests).

The final result should end up in a separate repository to remove unnecessary overhead.

## Installation
Follow these steps to install the ep_heatmap plugin

1. Get our [etherpad-lite](https://github.com/hb0/etherpad-lite) fork (only for developement)
```
git clone https://github.com/hb0/etherpad-lite
```

2. create a *plugins-available* folder into your etherpad-lite directory
```
mkdir /path/to/etherpad-lite/plugins-available
```

3. Symlink the ep_heatmap plugin to this folder
```
ln -s /path/to/MDWE2014-MD-Etherpad/src /path/to/etherpad-lite/plugins-available/ep_heatmap
```

4. Change to etherpad-lite directory
```
cd /path/to/etherpad-lite
```

5. install the plugin
```
npm install plugins-available/ep_heatmap
```

6. run etherpad-lite
```
sh bin/run.sh
```

### TODO
Make installation process easier, with symlink directly in the node_modules directory of etherpad-lite
(check the eejs-dependency in the src/hooks.js file)

## Development
### Nodemon
Development ist a lot easier, when you use nodemon while developing. 
Just install it via ```npm install -g nodemon```.
After that create a ```nodemon.json``` file in your etherpad-lite directory. The
content of ```nodemon.js```should be:
```
{
  "restartable": "rs",
  "ignore": [
    ".git"
  ],
  "verbose": true,
  "execMap": {
    "js": "node --harmony"
  },
  "watch": [
    "test/fixtures/",
      "test/samples/",
      "node_modules/ep_heatmap/"
  ],
  "env": {
    "NODE_ENV": "development"
  },
  "ext": "js json"
}
```

After that start etherpad via:
```
nodemon node_modules/ep_etherpad-lite/node/server.js
```
