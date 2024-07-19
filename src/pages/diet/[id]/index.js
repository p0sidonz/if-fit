import { useRouter } from "next/router";

import DietMealsPage from "../../../modules/diet/DietMeals";

const DietMeals = () => {
  const router = useRouter();

  const { id } = router.query;

  return <DietMealsPage param={id} />;
};
export default DietMeals;
