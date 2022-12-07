const { useEffect, useState } = React;

const Home = () => {
   const [posts, setPosts] = useState([])
   const [profiles, setProfiles] = useState([])
   const [singleProfile, setSingleProfile] = useState(null)
   const [toggleProfile, setToggleProfile] = useState(false)
   const [currentUser, setCurrentUser] = useState(null)

   useEffect(() => {
      fetch('/current/')
      .then((response) => response.json())
      .then((data) => setCurrentUser(data.username));
      fetch('/posts/')
      .then((response) => response.json())
      .then((data) => setPosts(data));
      fetch('/profiles/')
      .then((response) => response.json())
      .then((data) => setProfiles(data))
   }, []);

   const profileHandler = (creator, e) => {
      for (const profile of profiles) {
         if (profile.user === creator) {
            setSingleProfile(profile);
            setToggleProfile(true);
         }
      }
      document.querySelector("#tweetbox").style.display = "none";
   }

   return (
      <div >
         {toggleProfile && <Profile profile={singleProfile} closeProfile={setToggleProfile} posts={posts} setPosts={setPosts} currentUser={currentUser}/>}
         {!toggleProfile && (
            
            <div>
               
               {posts.map((post) => {
                  const { content, timestamp, creator, likes } = post;
                  return (
                     <div class="tweet-wrap">
                        <div class="tweet-header">
                           <div class="tweet-header-info">
                              <div className="creator" onClick={() => profileHandler(creator)}>
                                 {creator} <span>@{creator}</span><span>. {timestamp}
                                 </span>
                              </div>
                              <p>{content}</p>
                           </div>
                        </div>
                        <div class="tweet-info-counts">
                           <div class="likes">
                              <svg class="feather feather-heart sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                              <div class="likes-count">
                                 {likes.length}
                              </div>
                           </div>
                        </div>
                     </div>
                  )
               })}
            </div>
         )}

      </div>
   );
}

ReactDOM.render(<Home />, document.querySelector("#home"));