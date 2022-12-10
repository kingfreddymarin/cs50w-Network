const { useEffect, useState } = React;
// const {ReactPaginate} = window.ReactPaginate["default"]

const Home = () => {
   const [posts, setPosts] = useState([])
   const [profiles, setProfiles] = useState([])
   const [singleProfile, setSingleProfile] = useState(null)
   const [toggleProfile, setToggleProfile] = useState(false)
   const [currentUser, setCurrentUser] = useState(null)
   const [itemOffset, setItemOffset] = useState(0);
   const itemsPerPage = 9

   const endOffset = itemOffset + itemsPerPage;
   const currentItems = posts.slice(itemOffset, endOffset);
   const pageCount = Math.ceil(posts.length / itemsPerPage);

   const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % posts.length;
      setItemOffset(newOffset);
   };

   const getCookie = (name) => {
      var cookieValue = null;
      if (document.cookie && document.cookie !== '') {
         var cookies = document.cookie.split(';');
         for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
               break;
            }
         }
      }
      return cookieValue;
   }
   var csrftoken = getCookie('csrftoken');

   useEffect(() => {
      fetch('/current/')
         .then((response) => response.json())
         .then((data) => { setCurrentUser(data.user) });
      fetch('/posts/')
         .then((response) => response.json())
         .then((data) => setPosts(data));
      fetch('/profiles/')
         .then((response) => response.json())
         .then((data) => setProfiles(data))
      console.log('====================================');
      console.log(window);
      console.log('====================================');
   }, []);

   return (
      <div>
         {toggleProfile && <Profile profile={singleProfile}
            closeProfile={setToggleProfile}
            posts={posts}
            setPosts={setPosts}
            currentUser={currentUser}
            profiles={profiles}
            setSingleProfile={setSingleProfile}
            setToggleProfile={setToggleProfile}
            csrftoken={csrftoken} />}
         {!toggleProfile && (
            <div>
               <div className="tweet-container">
                  {currentItems.map((post) => {
                     return <Tweet key={post.id} {...post}
                        post={post}
                        profiles={profiles}
                        setSingleProfile={setSingleProfile}
                        setToggleProfile={setToggleProfile}
                        currentUser={currentUser}
                        csrftoken={csrftoken} />
                  })}
               </div>
               {/* <ReactPaginate
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={pageCount}
                  previousLabel="< previous"
                  renderOnZeroPageCount={null}
               /> */}
            </div>
         )}
      </div>
   );
}

ReactDOM.render(<Home />, document.querySelector("#home"));