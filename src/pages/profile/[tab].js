
import InitComponent from "src/modules/social/components"
const UserProfileTab = ({ tab}) => {
  return <InitComponent tab={tab} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'profile' } },
      { params: { tab: 'followers' } },
      { params: { tab: 'following' } },
      { params: { tab: 'packages' } }

      

    ],
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {

  return {
    props: {
      tab: params?.tab
    }
  }
}

export default UserProfileTab