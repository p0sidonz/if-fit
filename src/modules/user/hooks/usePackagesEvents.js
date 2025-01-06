import { useCurrentUserPackages } from "./usePackages";

const usePackagesEvents = () => {
    const {data: currentUserPackages = {}} = useCurrentUserPackages() || {}
    const userData = JSON.parse(localStorage.getItem('userData'))
    const isTrialAvailable = currentUserPackages?.history?.some?.(pkg => 
        pkg?.title === "Trial" && pkg?.status !== "COMPLETED"
    ) ?? false

    const isTrialCompleted = currentUserPackages?.history?.some?.(payment => 
        payment?.packageInfo?.title === "Trial" && payment?.status === "COMPLETED"
    ) ?? false

    const isPackageExpired = Boolean(!currentUserPackages?.activePackages?.id) ?? true

    return {isTrialAvailable, isTrialCompleted, isPackageExpired}
}

export default usePackagesEvents
