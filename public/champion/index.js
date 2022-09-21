import _ from 'lodash';
// function importAll(r) {
//     let images = {};
//     r.keys().map(item => { images[item.replace('./', '')] = r(item); });
//     return images;
// }

// const images = importAll(require.context('./images', false, /\.png/));

// function importAll(r) {
//     return r.keys().map(r);
//   }
  
//   const images = importAll(require.context('', false, /\.(png|jpe?g|svg)$/));
// export {images}

const importAll = require =>
  require.keys().reduce((acc, next) => {
    acc[next.replace("./", "")] = require(next);
    return acc;
  }, {});

const images = importAll(
  require.context("./", false, /\.(png|jpe?g|svg)$/)
);
export {images}
