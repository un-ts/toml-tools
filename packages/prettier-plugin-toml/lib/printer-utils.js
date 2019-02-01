function trimComment(commentText) {
  return commentText.replace(/[ \t]+$/, "");
}

module.exports = {
  trimComment
};
