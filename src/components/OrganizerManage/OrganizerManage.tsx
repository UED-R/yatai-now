import styles from './OrganizerManage.module.css';
import { PAGES, page_navigate } from '../../Pages';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
import { listupUsers } from "../../database/dbaccess";

export default function OrganizerManagement() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [other_users, setOther_Users] = useState<any[]>([]);


  function sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

  // useEffect：画面のレンダリング完了後に自動実行
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      // 認証情報が更新されたときに実行
      setUser(currentuser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result = await listupUsers();
        setOther_Users(result);
      } catch (e) {
        console.error("ユーザ一覧取得失敗", e);
      }
    };
    loadUsers();
  }, []);


  async function handleLogout() {
    setIsUpdating(true);
    await sleep(500);
    const auth = getAuth();
    signOut(auth)
    .then(() => {
      page_navigate(PAGES.MAIN_MAP, "1");
    })
    .catch((error) => {
      setIsUpdating(false);
      console.error("ログアウト失敗", error);
    });
  }
  if (isUpdating) {//アップデート中の画面
      return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h1>updating...</h1>
      </div>
      );
    }else{ //メインマップ画面
      return (
        <div className={`screen-general ${styles["login-screen"]}`}>
          <header className="common-header">
            <div className={styles["header-button-group"]}>
              <button className="common-btn-back" onClick={() => page_navigate(PAGES.MAIN_MAP, "1")}>&lt; 地図に戻る</button>
            </div>
            <div className={styles["header-button-group"]}>
              <p className='common-header-text'> ログインユーザ: {user?.email ? user.email.split("@")[0] : "ユーザerr"}</p>
              <button className="common-btn-back" onClick={handleLogout}>ログアウト</button>
            </div>
          </header>

          <div className={styles["login-container"]}>
            <h2>主催者用管理ページ</h2>
            <table className={styles["user-table"]}>
              <thead>
                <tr>
                  <th>UID</th>
                  <th>メールアドレス</th>
                </tr>
              </thead>
              <tbody>
                {other_users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.email ?? "―"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }