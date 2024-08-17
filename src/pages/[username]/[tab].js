'use client'
import { useRouter } from "next/router";
import InitComponent from "src/modules/social/components";

const UserProfileTab = () => {
    const router = useRouter();

    const { username} = router.query;

  return <InitComponent username={username}/>;
};
export default UserProfileTab;