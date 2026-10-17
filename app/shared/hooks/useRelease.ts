import { useLazyGetOrganizationByTokenQuery } from "@/services/Settings/SettingsApi"
import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"

let interval = null as unknown as NodeJS.Timeout

export const useRelease = () => {
    const [getOrganizationByToken, { data: organizationData, isLoading: organizationLoading, error: organizationError }] = useLazyGetOrganizationByTokenQuery()


    const releaseFromStorage = localStorage.getItem('release') as string | null
    const parsedReleaseFromStorage = releaseFromStorage ? JSON.parse(releaseFromStorage) : null

    const deviceInfo = useSelector((state : any) => state.deviceInfo.deviceInfo)


    const getOrganizationByTokenData = async () => {
        try {
            const res = await getOrganizationByToken(undefined).unwrap()


            if(res) {
                if(window.Android) {

                    const release = {
                        version : res.releaseId.version,
                        name : res.releaseId.name,
                        apk: process.env.REACT_APP_API_HOST + res.releaseId.filePath
                    }

                    // Install APK if no previous release exists OR if versions don't match
                    if (!parsedReleaseFromStorage || parsedReleaseFromStorage.version !== release.version) {
                        if (!parsedReleaseFromStorage) {
                            console.log('First time installing APK')
                        } else {
                            console.log('Version changed, updating APK')
                        }
                        window.Android && (window as any).Android?.installApk(release.apk, release.name)
                    }

                    // Always update localStorage with the latest release info
                    localStorage.setItem('release', JSON.stringify(release))

                }
            }

            return res
        }
        catch (e) {
            console.error("Error fetching organization by token:", e)
        }
    }


    useEffect(() => {
        if(!deviceInfo)  return
        interval = setInterval(() => {
            console.log('getOrganizationByTokenData')
            getOrganizationByTokenData()
        }, 3600000) // 1hour

        getOrganizationByTokenData();

        return () => {
            clearInterval(interval)
        }
        }, [deviceInfo])

    return { getOrganizationByTokenData, organizationData, organizationLoading, organizationError }
}