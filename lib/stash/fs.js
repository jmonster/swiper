var fs   = require('fs');
var Slug = require ('slug');
var Path = require('path');
var argv = require('../../params');

var isFirstRun = true;

module.exports = function(stash,url,blob,cb) {
  var namespace = stash.namespace;
  var base      = argv['catalog-path'];
  var path      = Path.join(base,namespace);
  var slugged   = Slug(url).substring(0,249);

  if (isFirstRun) {
    isFirstRun = false;
    try         { var p = fs.mkdirSync(path); }
    catch (err) { console.log('err:',err);/* fuck it Dude, let's go bowling */ }
  }

  fs.writeFile(Path.join(path,slugged), blob, function(err) {
    if (err) { console.error(err); }
    cb && cb();
  });
}
