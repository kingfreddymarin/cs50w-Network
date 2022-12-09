const Profile = ({ profile, closeProfile, posts, currentUser, profiles, setToggleProfile, setSingleProfile, csrftoken }) => {
   const { id, user, followers, following } = profile;
   const [profilePosts, setProfilePosts] = useState(posts)
   const [followersArr, setFollowersArr] = useState(followers)
   const [followersLength, setFollowersLength] = useState(followersArr.length)
   const [followingArr, setFollowingArr] = useState(false)

   const handleFollow = () => {
      if (currentUser) {
         if (followersArr.indexOf(currentUser) === -1) {
            const newArray = followersArr
            newArray.unshift(currentUser)
            setFollowersArr(newArray)
            setFollowersLength(newArray.length)
            setFollowingArr(true)
            axios.post('/follow/', {
               currentUser: currentUser,
               targetUser: user
            }, {
               headers: {
                  'X-CSRFToken': csrftoken
               }
            })
               .then(function (response) {
                  console.log(response);
               })
               .catch(function (error) {
                  console.log(error);
               });
         } else {
            let newArray = followersArr.filter(user => user !== currentUser)
            setFollowersArr(newArray)
            setFollowersLength(newArray.length)
            setFollowingArr(false)
            axios.post('/unfollow/', {
               currentUser: currentUser,
               targetUser: user
            }, {
               headers: {
                  'X-CSRFToken': csrftoken
               }
            })
               .then(function (response) {
                  console.log(response);
               })
               .catch(function (error) {
                  console.log(error);
               });
         }
      }
   }

   useEffect(() => {
      setProfilePosts(posts.filter(post => post.creator === profile.user))
      if (followersArr.indexOf(currentUser) === -1) {
         setFollowingArr(false)
      } else {
         setFollowingArr(true)
      }
   }, [followersArr])

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
                  {user === currentUser ? "" : <button onClick={handleFollow} class="btn btn-primary btn-sm follow">{followingArr ? "unfollow" : "follow"}</button>}
                  <div class="d-flex justify-content-between align-items-center mt-4 px-4">
                     <div class="stats">
                        <h6 class="mb-0">Followers</h6>
                        <span>{followersLength}</span>
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
                  csrftoken={csrftoken} />
            })}
         </div>
      </div>
   );
}

