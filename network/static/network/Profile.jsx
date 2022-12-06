
const Profile = ({ profile, closeProfile, posts }) => {
   const { id, user, followers, following } = profile;
   const [profilePosts, setProfilePosts] = useState(posts)
   useEffect(() => {
      setProfilePosts(posts.filter(post => post.creator === profile.user))
   })
   return (
      <div className="d-flex flex-column">
         <div className="ml-2" onClick={() => {
            closeProfile(false)
            document.querySelector("#tweetbox").style.display = "block";
         }}><i class="fa-solid fa-xmark"></i></div>
         <div class="container d-flex justify-content-center align-items-center">
            <div class="card">

               <div class="user text-center">
               </div>
               <div class="mt-5 text-center">
                  <h4 class="mb-1">{user}</h4>
                  <button class="btn btn-primary btn-sm follow">Follow</button>
                  <div class="d-flex justify-content-between align-items-center mt-4 px-4">
                     <div class="stats">
                        <h6 class="mb-0">Followers</h6>
                        <span>{followers.length}</span>
                     </div>
                     <div class="stats">
                        <h6 class="mb-0">Following</h6>
                        <span>{following.length}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div>
            {profilePosts.map((post) => {
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
      </div>
   );
}

