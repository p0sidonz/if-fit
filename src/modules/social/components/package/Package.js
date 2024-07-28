import PackageManager from './PackageManager'
import { useGetPackages } from '../../hooks/usePackages'
const Packages = () => {
    const { data, isLoading } = useGetPackages()
    if(isLoading) return <p>Loading...</p>
    return (
        <PackageManager packages={data} />
    )

}
export default Packages