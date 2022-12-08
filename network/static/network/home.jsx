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

   return (
      <div >
         {toggleProfile && <Profile profile={singleProfile} 
                                    closeProfile={setToggleProfile} 
                                    posts={posts} 
                                    setPosts={setPosts} 
                                    currentUser={currentUser}/>}
         {!toggleProfile && (
            
            <div>
               
               {posts.map((post) => {
                  return <Tweet key={post.id} {...post} 
                                 profiles={profiles} 
                                 setSingleProfile={setSingleProfile} 
                                 setToggleProfile={setToggleProfile}
                                 currentUser={currentUser}/>
               })}
            </div>
         )}

      </div>
   );
}

ReactDOM.render(<Home />, document.querySelector("#home"));