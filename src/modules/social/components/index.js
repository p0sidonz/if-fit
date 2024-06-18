import UserProfile from './UserProfile'
const UserProfileTab = ({ tab}) => {
  return <UserProfile tab={tab}  />
}

const InitComponent = ({ tab = "profile" }) => {

  return <UserProfileTab tab={tab} />
}

export default InitComponent