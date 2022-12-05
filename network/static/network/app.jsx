
const { useEffect, useState } = React;
const Home = () => {
   const [posts, setPosts] = useState([])
   useEffect(() => {
      fetch('/posts/')
         .then((response) => response.json())
         .then((data) => setPosts(data));
   }, []);
   return (
      <div style={{ margin: "1em" }} className="allPostsContainer">
         {posts.map((post) => {
            const { content, timestamp, creator, likes } = post;
            return (
               <h6>{content}</h6>
            )
         })}
      </div>
   );
}

ReactDOM.render(<Home />, document.querySelector("#home"));