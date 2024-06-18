export const FollowerAndFollowingNormalizer = (data, type) => {
  const follows = data.map((entry) => {

    const user =  entry.following || entry.follower;
    console.log("entryentry", entry)
    if (user) {
      return {
        id: entry.id,
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        avatar: user.avatar || "",
        gender: user.gender || "",
        country: user.country || "",
        role: user.role || "",
        userId: user.id || "",
        created_at: entry.created_at,
        isFollowing: entry.isFollowing || false,
        isFollowingId: entry.isFollowingId || null,
        followersCount : entry.followersCount || 0,
        followingCount : entry.followingCount || 0,
      };
    }
  });

  console.log("Normalized Data:", follows);
  return { users: follows };
};
