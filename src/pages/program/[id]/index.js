import { useRouter } from "next/router";

import ProgramDetails from "../../../modules/program/ProgramDetails";
import TraineeProgramView from "../../../modules/program/TraineeProgramView";

const ProgramDetail = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const router = useRouter();

  const { id } = router.query;

  // return <ProgramDetails param={id} />;

  return (
    <>
    {userData.role === "user" ? <TraineeProgramView  param={id}  /> : <ProgramDetails param={id} />}
    </>
  )

};
export default ProgramDetail;
