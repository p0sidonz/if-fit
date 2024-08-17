import InitComponent from "src/modules/social/components";

const UserProfileTab = ({username }) => {
  return <InitComponent username={username}/>;
};

export const getStaticPaths = async () => {
  return {
    paths: [], // No pre-rendered paths at build time
    fallback: 'blocking', // Enable on-demand generation of pages
  };
};

export const getStaticProps = async ({ params }) => {
  const { username } = params;

  // Here you can add logic to fetch any additional data needed for the page based on username and tab

  return {
    props: {
      username, // Pass username as a prop if needed
    },
  };
};

export default UserProfileTab;