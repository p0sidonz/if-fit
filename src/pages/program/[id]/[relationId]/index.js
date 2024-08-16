import { useRouter } from "next/router";

import TraineeProgramView from "../../../../modules/program/TraineeProgramView";

const ProgramDetail = () => {

  const router = useRouter();

  const { id, relationId } = router.query;

  return <TraineeProgramView  param={id}  relationId={relationId} />

};
export default ProgramDetail;
