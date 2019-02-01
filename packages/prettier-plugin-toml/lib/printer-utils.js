function trimComment(commentText) {
  return commentText.replace(/[ \t]+$/, "");
}

function canUnquote(quotedText) {
  // TODO: TBD
}

function collectComments(commentsNL) {
  const comments = [];
  commentsNL.forEach(commentNLNode => {
    const commentsTok = commentNLNode.children.Comment;
    if (commentsTok !== undefined) {
      Array.prototype.push.apply(comments, commentsTok);
    }
  });

  return comments;
}

module.exports = {
  trimComment,
  canUnquote,
  collectComments
};
