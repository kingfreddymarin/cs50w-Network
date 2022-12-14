const { useEffect, useState } = React;

const Tweet = ({ id, content, timestamp, creator, likes, profiles, setSingleProfile, setToggleProfile, currentUser, post, csrftoken }) => {

    const [likeArray, setLikeArray] = useState(likes);
    const [likesLength, setLikesLength] = useState(likeArray.length)
    const [fill, setFill] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [newContent, setNewContent] = useState(content)

    const profileHandler = (creator) => {
        for (const profile of profiles) {
            if (profile.user === creator) {
                setSingleProfile(profile);
                setToggleProfile(true);
            }
        }
        document.querySelector("#tweetbox").style.display = "none";
    }

    let likeHandler = () => {
        if (currentUser) {
            if (likeArray.indexOf(currentUser) === -1) {
                const newArray = likeArray
                newArray.unshift(currentUser)
                setLikeArray(newArray)
                setLikesLength(newArray.length)
                setFill(true)
                axios.post('/like/', {
                    ...post,
                    likes: likeArray,
                    currentUser: currentUser
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
                let newArray = likeArray.filter(user => user !== currentUser)
                setLikeArray(newArray)
                setLikesLength(newArray.length)
                setFill(false)
                axios.post('/dislike/', {
                    ...post,
                    likes: likeArray,
                    currentUser: currentUser
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
        } else {
            console.log("sign in first")
        }
    }

    useEffect(() => {
        if (likeArray.indexOf(currentUser) === -1) {
            setFill(false)
        } else {
            setFill(true)
        }
    }, [likeArray])

    const handleEdit = (creator) => {
        setIsEditing(true)
    }

    const handleSave = (id) => {
        setIsEditing(false)
        axios.post('/edit/', {
            id: id,
            newContent: newContent
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

    return (
        <div>
            {isEditing && (
                <div class="tweet-wrap">
                    <div class="tweet-header">
                        <div class="tweet-header-info">
                            <div className="creator" onClick={() => profileHandler(creator)}>
                                {creator} <span>@{creator}</span><span>. {timestamp}
                                </span>
                            </div>
                            <textarea onChange={(e) => setNewContent(e.target.value)}>{content}</textarea>
                        </div>
                    </div>
                    <div class="tweet-info-counts">
                        <div class="likes">
                            <svg onClick={likeHandler} id="likeBtn" class={fill ? "like feather feather-heart sc-dnqmqq jxshSx" : "unlike feather feather-heart sc-dnqmqq jxshSx"} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            <div id="likes-count" class="likes-count">
                                {likesLength}
                            </div>
                            {currentUser === creator ? <div onClick={() => { handleSave(id, content) }} className="btn-sm btn-primary onHover">save</div> : ""}
                        </div>
                    </div>
                </div>
            )}
            {!isEditing && (
                <div class="tweet-wrap">
                    <div class="tweet-header">
                        <div class="tweet-header-info">
                            <div className="creator" onClick={() => profileHandler(creator)}>
                                {creator} <span>@{creator}</span><span>. {timestamp}
                                </span>
                            </div>
                            <p>{newContent}</p>
                        </div>
                    </div>
                    <div class="tweet-info-counts">
                        <div class="likes">
                            <svg onClick={likeHandler} id="likeBtn" class={fill ? "like feather feather-heart sc-dnqmqq jxshSx" : "unlike feather feather-heart sc-dnqmqq jxshSx"} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            <div id="likes-count" class="likes-count">
                                {likesLength}
                            </div>
                            {currentUser === creator ? <div onClick={() => handleEdit()} className="btn-sm btn-primary onHover">edit</div> : ""}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}