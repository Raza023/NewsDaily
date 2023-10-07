import React, { useState, useEffect,useRef  } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// import '../../pages/user/commentBox/CommentBox.css';
import "./CommentPopup.css";
import { Link } from "react-router-dom";
import { useToast } from "react-toastify";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CommentPopup = () => {
  const [authors, setAuthors] = useState([]);
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]); // Store comments data
  const { newsId } = useParams();
  const [jwtCookie, setJwtCookie] = useState("");

  useEffect(() => {
    // Function to fetch comments for the specified newsId
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/v1/comments/${newsId}/all`);
        const { username, comments: fetchedComments } = response.data;

        // Combine commentId and username to form authors
        setAuthors(username);

        // Set the comments data
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments(); // Call fetchComments when the component mounts or when newsId changes
  }, [newsId]);
  function getCookie(name) {
    // const cookies = document.cookie.split(";");
    const cookies=window.getCookie;
    console.log(window)
    console.log("Cookies here is : "+window+"and name is:" +name)
    // for (const cookie of cookies) {
    //   const [cookieName] = cookie.split('=');
    //   if (cookieName === name) {
    //     return true; // Cookie with the specified name exists
    //   }
    // }
  
    return false; // Cookie with the specified name does not exist
  }
  
  useEffect(() => {
    // Get the "JWT-Token" cookie and display it on the console
    const jwtToken = getCookie("JWT-Token");
    console.log("JWT-Token:", jwtToken);
    setJwtCookie(jwtCookie);
  }, []); // Empty dependency array to run this effect only once when the component is mounted

  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  
  const textInputRef = useRef(null);

  // ...

  const handleTextClick = () => {
    const jwtToken = getCookie("JWT-Token");
    console.log("JWT-Token:", jwtToken);
    setJwtCookie(jwtCookie);
    if (!jwtCookie) {
      toast.error("You need to login to comment", {
        position: "top-right",
      });
      const commentTextBox = document.getElementById("commentTextBox");
      if (commentTextBox) {
        commentTextBox.disabled = true;
      }
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = text.trim();

    if (!content) {
      return;
    }

    try {
      const commentResponse = await axios.post(
        "/api/v1/comments",
        { content },
        {
          params: { newsId },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newComment = commentResponse.data;
      // Update authors with the new comment
      setAuthors([...authors, `${newComment.username}`]);
      setText("");
      toast.success("Comment posted successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error posting comment:", error);

      // Show an error toast
      toast.error("Failed to post comment. Please try again later.", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="comment-box">
      <Link to="/showNews">
        <button className="close_btn">X</button>
      </Link>
      <h1 className="h1">Comments</h1>
      <div className="comment-list">
        {comments.map((comment, i) => (
          <div className="comment-node" author={authors[i]} key={comment.id}>
            <div className="print-author">{authors[i]}</div>
            {comment.content}
          </div>
        ))}
      </div>
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Comment"
          id="commentTextBox"
          value={text}
          onChange={handleTextChange}
          onClick={handleTextClick}
          
        />
        <input
          type="submit"
          value="Post"
          disabled={!text.trim() || !jwtCookie} // Disable if text is empty or jwtCookie is empty
        />{" "}
      </form>
      <ToastContainer />
    </div>
  );
};

export default CommentPopup;
