/* eslint-disable max-len */

/**
 * @param {Object[]} arr
 * @param {String} arr.id
 * @param {String} arr.name
 * @param {String[]} filesToDL
 * @return {Object[]} res
 */
exports.getRequiredFiles = (arr, filesToDL) => arr.filter((file) => {
  let result = false;
  filesToDL.forEach((fl) => {
    if (-1 !== file.name.search(fl)) {
      result = true;
    }
  });
  return result;
});

// console.log(getRequiredFiles(arrs, filesToDL));

