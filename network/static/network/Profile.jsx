
const Profile = ({ profile, closeProfile, posts, currentUser, profiles, setToggleProfile, setSingleProfile, csrftoken}) => {
   const { id, user, followers, following } = profile;
   const [profilePosts, setProfilePosts] = useState(posts)
   useEffect(() => {
      setProfilePosts(posts.filter(post => post.creator === profile.user))
      console.log(followers)
   }, [])
   return (
      <div key={id} className="d-flex flex-column">
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
                  {user === currentUser ? "" : <button class="btn btn-primary btn-sm follow">Follow</button>}
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
               return <Tweet key={post.id} {...post} 
                     post={post} 
                     profiles={profiles} 
                     setSingleProfile={setSingleProfile} 
                     setToggleProfile={setToggleProfile}
                     currentUser={currentUser}
                     csrftoken={csrftoken}/>
            })}
         </div>
      </div>
   );
}

