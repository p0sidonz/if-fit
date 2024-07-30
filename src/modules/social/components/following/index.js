// ** Next Import
import Link from "next/link";
import { useState , useEffect} from "react";
// ** MUI Components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
// ** Custom Components Imports
import UserProfileFollowsCard from "../UserProfileFollowsCard";
import { useGetFollowing } from "../../hooks/useSocialData";
import { Alert } from "@mui/material";
import { useRouter } from 'next/router';

const Following = ({ tab }) => {
  const router = useRouter();
  const { username } = router.query;

  const [page, setPage] = useState(0);
  const take = 3;
  const skip = page * take;

  const { data, isLoading, isFetched, isFetching, refetch } = useGetFollowing(take, skip,username);
  const [localPosts, setLocalPosts] = useState([]);
  const [localTotal, setLocalTotal] = useState(0);

  useEffect(() => {
    if (isFetched) {
      setLocalPosts(data?.following || []);
      setLocalTotal(data?.total || 0);
    }
  }, [isFetched, data]);

  useEffect(() => {
    setPage(0); // Reset page on tab change
  }, [username]);

  useEffect(() => {
    refetch();
  }, [page, tab, refetch]);


  const totalPosts = localTotal || 0;
  const hasMore = skip + take < totalPosts;

  if (isLoading) {
    return <>Loading...</>;
  }

  const handleNextPage = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    setPage(page > 0 ? page - 1 : 0);
  };

  return (
<Grid container spacing={2}>
  {localPosts.length > 0 ? (
    localPosts.map((item, index) => (
      <Grid item key={index} xs={12} sm={12} md={12} lg={12}>
        <UserProfileFollowsCard item={item} />
      </Grid>
    ))
  ) : (
    <Grid item xs={12}>
      <Alert severity="info" sx={{ width: '100%' }}>No following found</Alert>
    </Grid>
  )}
  
  <Grid item xs={12}>
    <Grid
      container
      justifyContent="flex-end"
      alignItems="center"
      spacing={2}
      sx={{ marginTop: 2 }}
    >
      {isFetching && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}
      <Grid item>
        <Button onClick={handlePreviousPage} disabled={page === 0}>
          Previous
        </Button>
      </Grid>
      <Grid item>
        <Button onClick={handleNextPage} disabled={!hasMore}>
          Next
        </Button>
      </Grid>
    </Grid>
  </Grid>
</Grid>
  );
};


export default Following;
