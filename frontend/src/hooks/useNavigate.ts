import { useNavigate as useReactRouterNavigate } from "react-router-dom";

export function useNavigate() {
  const navigate = useReactRouterNavigate();

  return (path: string) => {
    navigate(path);
  };
}