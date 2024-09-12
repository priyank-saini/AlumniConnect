function Post({
  profile,
  username,
  location,
  attachment,
  likes,
  comments,
  desc,
}) {
  return (
    <div className="w-full h-full flex flex-col gap-5 bg-white rounded-[25px] px-[30px] py-[20px]">
      {/* PROFILE */}
      <div className="flex gap-5 items-center">
        <div className="w-[60px] h-[60px] rounded-full">
          <img
            src={profile}
            className="w-full h-full object-cover rounded-full"
            alt={`${username}'s profile`}
          />
        </div>

        {/* NAME AND LOCATION */}
        <div className="flex flex-col">
          <p className="text-[20px] font-[700]">{username}</p>
          <p className="text-[16px] text-[#737373] font-[500]">{location}</p>
        </div>
      </div>

      {/* PICTURE */}
      <div>
        <img
          src={attachment}
          className="w-full h-full object-cover rounded-[10px]"
          alt="Post content"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <p className="font-[500] text-[16px] text-[#494949]">{desc}</p>
      </div>

      {/* LIKE AND COMMENTS */}
      <div className="flex gap-5">
        <div className="flex gap-2 items-center">
          <img
            src="assets/like.png"
            className="w-[32px] h-[32px]"
            alt="Like icon"
          />
          <p className="font-[500] text-[16px]">
            {Object.keys(likes).length} Likes
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <img
            src="assets/comment.png"
            className="w-[32px] h-[32px]"
            alt="Comment icon"
          />
          <p className="font-[500] text-[16px]">{comments.length} Comments</p>
        </div>
      </div>
    </div>
  );
}

export default Post;
