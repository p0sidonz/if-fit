import { useRouter } from "next/router";

import TraineeDietPreview from "src/modules/diet/TraineeDietPreview";

const DietMeals = () => {
    const router = useRouter();

    const { id, relationId } = router.query;

    return <TraineeDietPreview param={id} relationId={relationId} />
};
export default DietMeals;
