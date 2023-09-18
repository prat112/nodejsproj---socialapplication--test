// Async function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
  
    const postLink = document.getElementById('postLink').value;
    const postDescription = document.getElementById('postDescription').value;
  
    if (!postLink || !postDescription) {
      alert('Please fill in both post link and description.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3000/create', {
        postLink,
        postDescription
      });
  
      if (response.status === 201) {
        alert('Post created successfully!');
        fetchPosts();
      } else {
        alert('Error creating post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred while creating the post.');
    }
  }
  
  // Async function to fetch and display posts
  async function fetchPosts() {
    try {
      const response = await axios.get('http://localhost:3000/posts');
      const data = response.data;
      const postsDiv = document.getElementById('posts');
      postsDiv.innerHTML = '';
  
      for (const post of data) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post-container');
        postDiv.innerHTML = `
          <img src="${post.image}" alt="Post Image">
          <p>User: ${post.postDescription}</p>
          <!-- Add Comment button and comment textarea -->
          <button id="commentButton-${post.id}" onclick="toggleCommentForm(${post.id})">Comment</button>
          <div id="commentArea-${post.id}" style="display: none;">
            <label for="commentInput-${post.id}"></label><br>
            <textarea id="commentInput-${post.id}" name="commentInput" rows="3"></textarea><br><br>
            <button onclick="handleCommentSubmit(${post.id}, event)">Send</button>
          </div>
  
          <div id="comments-${post.id}" style="display:none">
            <h4>Comments:</h4>
            <div id="commentsList-${post.id}" style="display:none">
              <!-- Comments will be dynamically loaded here -->
            </div>
          </div>
  
          <hr>
        `;
  
        postsDiv.appendChild(postDiv);
  
        // Fetch and display comments for each post
        fetchComments(post.id);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('An error occurred while fetching posts.');
    }
  }
  
  // Fetch posts and comments on page load
  window.addEventListener('load', () => {
    fetchPosts();
  });
  
  // Attach event listener to the form
  const form = document.getElementById('postForm');
  form.addEventListener('submit', handleFormSubmit);
  
  // Async function to handle comment submission
  async function handleCommentSubmit(postId, event) {
    event.preventDefault();
  
    const commentInput = document.getElementById(`commentInput-${postId}`);
    const comment = commentInput.value;
  
    if (!comment) {
      alert('Please enter a comment.');
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:3000/comments/${postId}`, { comment });
  
      if (response.status === 200) {
        alert('Comment added successfully!');
        fetchComments(postId); // Fetch and display updated comments for the post
        commentInput.value = ''; // Clear the comment input
      } else {
        alert('Error adding comment.');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('An error occurred while adding the comment.');
    }
  }
  
  // Async function to fetch and display comments for a post
  async function fetchComments(postId) {
    try {
      const response = await axios.get(`http://localhost:3000/comments/${postId}`);
      const comments = response.data.comments;
  
      const commentsListDiv = document.getElementById(`commentsList-${postId}`);
      commentsListDiv.innerHTML = '';
  
      if (comments && comments.length > 0) {
        comments.forEach(comment => {
          const commentParagraph = document.createElement('p');
          const anonymousSpan = document.createElement('span');
          anonymousSpan.textContent = 'Anonymous: ';
          anonymousSpan.classList.add('anonymous-text');
          commentParagraph.appendChild(anonymousSpan);
          commentParagraph.innerHTML += comment;
          commentsListDiv.appendChild(commentParagraph);
        });
      } else {
        const noCommentsMessage = document.createElement('p');
        noCommentsMessage.textContent = 'No comments yet.';
        commentsListDiv.appendChild(noCommentsMessage);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      alert('An error occurred while fetching comments.');
    }
  }
  
  // Function to toggle the display of the comment textarea
  function toggleCommentForm(postId) {
    const commentArea = document.getElementById(`commentArea-${postId}`);
    const comments = document.getElementById(`comments-${postId}`);
    const commentsList = document.getElementById(`commentsList-${postId}`);
    commentArea.style.display = commentArea.style.display === 'none' ? 'block' : 'none';
    commentsList.style.display = 'block';
    
    // Fetch and display comments only when the comment area is displayed
    if (commentArea.style.display === 'block') {
      comments.style.display = 'block';
      fetchComments(postId);
    } else {
      comments.style.display = 'none';
      commentsList.style.display = 'none';
    }
  
    // Change the button text based on visibility
    const commentButton = document.getElementById(`commentButton-${postId}`);
    commentButton.textContent = commentArea.style.display === 'none' ? 'Comment' : 'Comment';
  }
  