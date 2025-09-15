import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NavigatorBridge() {
  const navigate = useNavigate();
  useEffect(() => {
    (window as any).appNavigate = (path: string, state?: any) =>
      navigate(path, { state });
    return () => {
      delete (window as any).appNavigate;
    };
  }, [navigate]);
  return null;
}
