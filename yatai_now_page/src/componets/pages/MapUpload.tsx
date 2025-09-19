import { useState } from "react";

// 超シンプル版（見た目だけ・機能なし）
// - 依存は React のみ（CSSは最小）
// - SVGプレビューは <img> で表示（FileReaderでdataURL化）
// - 後でAPIをつなぐ時は、送信用のFormDataを作るだけでOK
// 配置例: apps/web/src/pages/admin/MapsUpload.tsx

export default function MapsUpload() {
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("選択されていません");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setPreviewSrc(null);
    setError(null);

    if (!f) {
      setFileName("選択されていません");
      return;
    }

    // 拡張子/タイプの簡易チェック（UI上のガード）
    const isSvg = f.type === "image/svg+xml" || f.name.toLowerCase().endsWith(".svg");
    if (!isSvg) {
      setError("SVGファイルを選択してください");
      setFileName(f.name);
      return;
    }

    setFileName(f.name);

    const reader = new FileReader();
    reader.onload = () => setPreviewSrc(reader.result as string);
    reader.readAsDataURL(f); // imgタグで表示できる形に
  }

  function onReset() {
    setTitle("");
    setFileName("選択されていません");
    setPreviewSrc(null);
    setError(null);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.h1}>マップアップロード（運営）</h1>

        <div style={styles.card}>
          {/* タイトル */}
          <label style={styles.label}>タイトル</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 2025 雙峰祭 メイン会場"
            style={styles.input}
          />

          {/* ファイル */}
          <label style={styles.label}>SVGファイル</label>
          <input type="file" accept=".svg,image/svg+xml" onChange={onFileChange} />
          <div style={styles.hint}>選択中: {fileName}</div>

          {/* プレビュー */}
          <label style={styles.label}>プレビュー</label>
          <div style={styles.previewBox}>
            {previewSrc ? (
              <img src={previewSrc} alt="SVG preview" style={{ maxWidth: "100%", height: "auto" }} />
            ) : (
              <div style={styles.placeholder}>ここにSVGのプレビューが表示されます</div>
            )}
          </div>

          {error && <div style={styles.error}>{error}</div>}

          {/* ボタン（まだ機能なし） */}
          <div style={styles.actions}>
            <button style={styles.primaryBtn} disabled title="機能は後で実装します">アップロード（準備中）</button>
            <button style={styles.secondaryBtn} onClick={onReset}>リセット</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { background: "#f7fafc", minHeight: "100vh", padding: "24px" },
  container: { maxWidth: 720, margin: "0 auto" },
  h1: { fontSize: 20, fontWeight: 700, marginBottom: 16 },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, display: "grid", gap: 12 },
  label: { fontSize: 14, fontWeight: 600 },
  input: { border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px" },
  hint: { fontSize: 12, color: "#64748b" },
  previewBox: { border: "1px solid #e5e7eb", borderRadius: 8, padding: 8, minHeight: 160, background: "#f8fafc" },
  placeholder: { color: "#64748b", fontSize: 13, display: "grid", placeItems: "center", height: 140 },
  error: { color: "#dc2626", fontSize: 13 },
  actions: { display: "flex", gap: 8, marginTop: 4 },
  primaryBtn: { background: "black", color: "white", padding: "8px 12px", borderRadius: 8, border: 0, opacity: 0.6, cursor: "not-allowed" },
  secondaryBtn: { background: "white", color: "#111827", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb" },
};
