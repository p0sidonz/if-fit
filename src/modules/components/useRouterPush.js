// ** Next Import
import { useRouter } from 'next/router'

const useNavigateTo = () => {
    const router = useRouter()

    const navigateTo = (url) => {
        if(!url) return
        router.push(url)
    }
    return navigateTo

}

export default useNavigateTo
