# Todo - AngularJS edition

A todo project built with AngularJS


## Install

Clone the project where you want it then run `npm install` and all the project
modules will be installed along with production code for Bower components.


## Configuration

`config.gulp.js` handles most of the configurations while more detailed options
are handled within the `gulpfile.js` directly (option reference locations are
provided for ease).

**Note** that if you change the build directory, you will want to update the
`.bowerrc` file so reflect the change.


## Gulp Commands

- default action runs the `build` command

The main commands you'll most often use:

- `build`: compiles all the files in a onetime run
- `serve`: runs a `build`, watches the files for changes and runs browser-sync
- `watch`: watches for file changes and runs the respective command

Other commands:

- `app`: compiles the app directory within source
- `html`: compiles the HTML files within app source for Angular Template Cache
- `lib`: compiles the library files
- `sass`: compiles the Sass files


## Resources

- [Browser Sync](https://www.browsersync.io/)
- [Buble](https://buble.surge.sh/)
- [Gulp](http://gulpjs.com/)
- [rollup.js](http://rollupjs.org/)


## Libraries Included

- [Angular Drag to Reorder](https://github.com/brandly/angular-drag-to-reorder)
- [Font Awesome](http://fontawesome.io/)
- [lodash](https://lodash.com/)
- [Restangular](https://github.com/mgonto/restangular)
- [UI-Router](http://angular-ui.github.io/ui-router/)


## License

Copyright © Neil Sweeney <neil@wolfiezero.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
