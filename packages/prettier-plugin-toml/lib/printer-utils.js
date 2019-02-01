function trimComment(commentText) {
  return commentText.replace(/[ \t]+$/, "");
}

function canUnquote(quotedText) {
  // TODO: TBD
}

module.exports = {
  trimComment,
  canUnquote
};
