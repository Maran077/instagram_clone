function reducer(state, action) {
  switch (action.type) {
    case 'change_user_detail': {
      return {
        ...state,
        name: action.nextName,
        profilePic: action.nextProfilePic,
        des: action.nextDes

      };
    }
    case 'change_user_follower_detail': {
      return {
        ...state,
        followers:action.nextFollowers

      };
    }
    case 'change_user_following_detail': {
      return {
        ...state,
        following:action.nextFollowing

      };
    }

  }
}

export default reducer
