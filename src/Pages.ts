import type { NavigateFunction } from "react-router-dom";

// ページ変数の定義
// ページを追加するときはURLとして使いたいパスを追加する
export const PAGES = {
  TOP_PAGE:       "/",
  MAIN_MAP:       "/MainMap",
  VEND_LOGIN:     "/VendorLogin",
  ORG_LOGIN:      "/OrganizerLogin",
  VEND_UPLOAD:    "/VendorUpload",
  LOGIN_PAGE:     "/LoginPage",
  ORG_MANAGE:     "/OrganizerManage"
} as const;
export type RoutePath = (typeof PAGES)[keyof typeof PAGES];



// ページ遷移関数
// 基本変更しない
let globalNavigate: NavigateFunction;
export function setGlobalNavigate(nav:NavigateFunction){
  globalNavigate = nav;
}
export function page_navigate(dst_page:string, mapid?: string){
  if (mapid !== undefined) {
    globalNavigate(dst_page, {state: mapid});
  } else {
    globalNavigate(dst_page);
  }
}