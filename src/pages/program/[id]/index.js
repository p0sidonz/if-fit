import { useRouter } from "next/router";

import ProgramDetails from "../../../modules/program/ProgramDetails";

const ProgramDetail = () => {
  const router = useRouter();

  const { id } = router.query;

  return <ProgramDetails param={id} />;
};
export default ProgramDetail;
