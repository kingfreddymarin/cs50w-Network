const { useEffect, useState } = React;

const Home = () => {
   const [posts, setPosts] = useState([])
   const [profiles, setProfiles] = useState([])
   const [singleProfile, setSingleProfile] = useState(null)
   const [toggleProfile, setToggleProfile] = useState(false)
   const [loggedIn, setLoggedIn] = useState("")
   const [tweet, setTweet]= useState("")
   const [csrftoken, setCsrftoken] = useState(null)

   function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie !== '') {
         var cookies = document.cookie.split(';');
         for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
               break;
         }
         }
      }
      return cookieValue;
   }

   // let csrftoken = getCookie('csrftoken');
   const CSRFToken = () => {
      return (
         <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
      );
   };

   const postTweet = () => {
      
      const twt = {
         content: tweet,
         creator: loggedIn
      }
      axios.post('http://127.0.0.1:8000/tweet/', 
      twt, 
      {withCredentials: true},
      {
         headers: 
         {"X-CSRFToken": csrftoken}
      })
       .then(function (response) {
         console.log(response);
       })
       .catch(function (error) {
         console.log(error);
       });
      // fetch('/tweet/', {
      //    method: 'POST',
      //    headers: {
      //       "Accept": "application/json",
      //       "Content-Type": "application/json",
      //       "X-CSRFToken": csrftoken
      //    },
      //    Body: JSON.stringify(twt)
      // })
      // .then((response) => response.json())
      // .then((result)=>{
      //    console.log(result)
      // })
   }

   useEffect(() => {
      setCsrftoken(getCookie('csrftoken'))
      fetch('/current/')
         .then((response) => response.json())
         .then((data) => setLoggedIn(data.username));
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
         {toggleProfile && <Profile profile={singleProfile} closeProfile={setToggleProfile} posts={posts} setPosts={setPosts} />}
         {loggedIn && (
            <form id="tweet-form" onSubmit={()=>postTweet()}>
               <CSRFToken/>
               <div id="tweetbox" class="wrapper">
                  <div class="input-box">
                     <h6> Tweet your mind out </h6>
                     <div class="tweet-area">
                        <span class="placeholder"></span>
                        <textarea id="content"
                           value={tweet}
                           required
                           onChange={(e) => {setTweet(e.target.value)}}
                           name="content"
                           cols="30" 
                           rows="10"
                        ></textarea>
                     </div>
                  </div>
                  <div class="bottom">
                     <div class="content">
                        <input  onClick={()=>postTweet()} className="btn btn-primary" value="Tweet" type="button"/>
                     </div>
                  </div>
               </div>
            </form>
         )}
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