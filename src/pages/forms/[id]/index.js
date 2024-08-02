import { useRouter } from "next/router";

import FormGenerator from "../../../modules/forms/componemts/FormGenerator";

const FormDetail = () => {
  const router = useRouter();

  const { id } = router.query;

  return <FormGenerator param={id} />;
};
export default FormDetail;
