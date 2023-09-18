const Social = require('../model/social');

function extractInfoFromLink(postLink) {
  const parsedUrl = new URL(postLink);
  const user = parsedUrl.searchParams.get('user');
  const imageUrl = parsedUrl.searchParams.get('imageurl');

  return { user, imageUrl };
}

exports.createPost = async (req, res) => {
  const { postLink, postDescription } = req.body;

  // Logic to parse postLink and extract image and user information
  const { imageUrl, user } = extractInfoFromLink(postLink);

  try {
    const post = await Social.create({
      postLink,
      postDescription,
      image: imageUrl,
      user,
      comments: []  // Update the field name to 'comments'
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Social.findAll();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addComment = async (req, res) => {
  const postId = req.params.postId;
  const { comment } = req.body;

  try {
    const post = await Social.findByPk(postId);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    let commentsArray = post.comments || [];

    // Handle both cases: JSON string or array of strings
    if (typeof commentsArray === 'string') {
      commentsArray = JSON.parse(commentsArray);
    }

    // Ensure commentsArray is an array
    if (!Array.isArray(commentsArray)) {
      commentsArray = [];
    }

    // Add the comment to the post
    commentsArray.push(comment);
    post.comments = commentsArray;

    await post.save();

    res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getComments = async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Social.findByPk(postId);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const comments = JSON.parse(post.comments);

    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

