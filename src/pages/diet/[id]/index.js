import { useRouter } from "next/router";

import DietMealsPage from "../../../modules/diet/DietMeals";
import TraineeDietPreview from "src/modules/diet/TraineeDietPreview";

const DietMeals = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const router = useRouter();

  const { id } = router.query;

  return (
    <>
    {userData.role === "user" ? <TraineeDietPreview  param={id}  /> : <DietMealsPage param={id} />}
    </>
  )
};
export default DietMeals;
