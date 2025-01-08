import { useEffect } from 'react'
import PackageManager from './PackageManager'
import { useGetPackages } from '../../hooks/usePackages'

const Packages = ({ username, isSameUser }) => {
    console.log("Packages   ", username)
    const { data, isLoading, refetch, isRefetching } = useGetPackages(username)


    useEffect(()=>{
        refetch()
    }, [username])

    if (isLoading || isRefetching) return <p>Loading...</p>



    return <PackageManager packages={data} isSameUser={isSameUser} />

}
export default Packages