import type { NavigateFunction } from "react-router-dom";

// ページ変数の定義
// ページを追加するときはURLで使いたいファイルパスを追加する
export const PAGES = {
  LEAF_MAP:       "/yatai-now/LeafMap",
  MAIN:           "/yatai-now/Main",
  MainMap:          "/yatai-now/MainMap",
  TopPage:   "/yatai-now/",
  VEND_LOGIN:     "/yatai-now/VendorLogin",
  ORG_LOGIN:      "/yatai-now/OrganizerLogin",
  VEND_UPLOAD:    "/yatai-now/VendorUpload",
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