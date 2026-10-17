import { useKeydown } from "@hotel-smarters/use-key-down-control";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ROOT_CONTROL } from "@/shared/types/rootcontrol/ROOT_CONTROL";
import { setRootControl } from "@/slices/RootControlSlice";

export const useQuickMessageControls = () => {
    const dispatch = useDispatch();

    const rootControl = useSelector((state: any) => state.rootControl.rootControl);

    const navigate = useNavigate();

    const controls = {
        id: 'quick-message-controls',
        isActive: rootControl === ROOT_CONTROL.CHAT_QUICK,
        back: () => {
            navigate(-1);
        },
        down: () => {
            dispatch(setRootControl(ROOT_CONTROL.TYPE_MESSAGE))
        }
    };

    useKeydown(controls);
}