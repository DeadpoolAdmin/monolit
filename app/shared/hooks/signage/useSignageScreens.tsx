import { useLazyGetActiveSignageScreenQuery } from "@/services/Signage/Signage";
import { setIsSignageCalled, setScreens } from "@/slices/Signage/SignageSlice";
import { useGenerateUrl } from "@hotel-smarters/generatefileurl";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useSignageScreens = () => {
  const [
    getSignageScreens,
    {
      isLoading: getSignageLoading,
      isError: getSignageError,
      isSuccess: getSignageSuccess,
      data: getSignageData,
    },
  ] = useLazyGetActiveSignageScreenQuery();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { getUrl } = useGenerateUrl(process.env.REACT_APP_API_HOST as string);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearPollingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const onGetSignageScreens = useCallback(async () => {
    try {
      const res = await getSignageScreens(undefined).unwrap();

      if (res) {
        // Stop polling once we get data
        clearPollingInterval();
        
        dispatch(setScreens(res));
        dispatch(setIsSignageCalled(true));

        const screenMap = {
          _id: res._id,
          title: res.title,
          media: res.media,
          appPath: res.appPath,
          orgId: res.orgId,
          mediaType: res.mediaType,
          meidaUrl: res.mediaUrl,
        };

        switch (screenMap.mediaType) {
          case "image":
            navigate("/signage/signage-image", {
              state: { src: getUrl(screenMap.media) },
            });
            break;
          case "video":
            navigate("/signage/signage-video", {
              state: { src: getUrl(screenMap.media) },
            });
            break;
          case "file":
            window.location.replace(getUrl(screenMap.media));
            break;
          case "html":
            if (screenMap.meidaUrl) {
              navigate("/signage/signage-url", { state: { src: screenMap.meidaUrl } });
            } else if (screenMap.media) {
              navigate("/signage/signage-url", {
                state: { src: getUrl(screenMap.media) },
              });
            } else if (screenMap.appPath) {
              navigate(`/menu${screenMap.appPath}`);
            }
            break;
          default:
            break;
        }

        return res;
      }
      else {
        // No screen available - keep polling until we get data
        dispatch(setIsSignageCalled(true));
        
        if (!intervalRef.current) {
          navigate("/signage/no-screen");
          intervalRef.current = setInterval(async () => {
            try {
              const pollRes = await getSignageScreens(undefined).unwrap();
              if (pollRes) {
                // Found data, call the main function to handle navigation
                clearPollingInterval();
                onGetSignageScreens();
              }
            } catch (error) {
              console.log('Polling error:', error);
            }
          }, 3000);
        }
      }
    } catch (e) {
      console.log(e);
      dispatch(setIsSignageCalled(true));
    }
  }, [getSignageScreens, dispatch, navigate, getUrl, clearPollingInterval]);



  return {
    onGetSignageScreens,
    getSignageLoading,
    getSignageError,
    getSignageSuccess,
    getSignageData,
    clearPollingInterval,
  };
};
