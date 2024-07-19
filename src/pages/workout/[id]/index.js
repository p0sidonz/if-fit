import { useRouter } from "next/router";

import WorkoutDetails from "../../../modules/workout/WorkoutDetails";

const WorkoutDetail = () => {
  const router = useRouter();

  const { id } = router.query;

  return <WorkoutDetails param={id} />;
};
export default WorkoutDetail;
