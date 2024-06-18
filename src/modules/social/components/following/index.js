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

const Following = ({ tab }) => {
  const [page, setPage] = useState(0);
  const take = 3;
  const skip = page * take;

  const { data, isLoading, isFetched, isFetching, refetch } = useGetFollowing(take, skip);
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
  }, [tab]);

  useEffect(() => {
    refetch();
  }, [page, tab, refetch]);

  console.log("datadata", data);

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
    <Grid container spacing={6}>
      {localPosts.map((item, index) => (
        <Grid key={index} item xs={12} sm={6} md={4}>
          <UserProfileFollowsCard item={item} />
        </Grid>
      ))}
      <Grid
        container
        justifyContent="center"
        spacing={2}
        style={{ marginTop: 20 }}
      >
        {isFetching && <CircularProgress />}
        <Button onClick={handlePreviousPage} disabled={page === 0}>
          Previous
        </Button>
        <Button onClick={handleNextPage} disabled={!hasMore}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
};


export default Following;
