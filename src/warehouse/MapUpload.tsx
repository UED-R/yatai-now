import { useState } from 'react';
import type { ChangeEvent } from 'react';

// 親から受け取るPropsの型
type MapUploadScreenProps = {
  onBack: () => void;
};

function MapUploadScreen({ onBack }: MapUploadScreenProps) {
  const [fileName, setFileName] = useState("選択されていません");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setPreviewSrc(null);
    setError(null);

    if (!f) {
      setFileName("選択されていません");
      return;
    }

    const isSvg = f.type === "image/svg+xml" || f.name.toLowerCase().endsWith(".svg");
    if (!isSvg) {
      setError("SVGファイルを選択してください");
      setFileName(f.name);
      return;
    }
    setFileName(f.name);

    const reader = new FileReader();
    reader.onload = () => setPreviewSrc(reader.result as string);
    reader.readAsDataURL(f);
  }

  function onReset() {
    setFileName("選択されていません");
    setPreviewSrc(null);
    setError(null);
  }

  return (
    <div className="screen upload-screen">
      <header className="event-header">
        <button className="btn-back" onClick={onBack}>
          &lt; 戻る
        </button>
      </header>

      <div className="upload-container">
        <div className="upload-card">


          <label className="upload-label">SVGファイル</label>
          <input type="file" accept=".svg,image/svg+xml" onChange={onFileChange} />
          <div className="upload-hint">選択中: {fileName}</div>

          <label className="upload-label">プレビュー</label>
          <div className="upload-preview-box">
            {previewSrc ? (
              <img src={previewSrc} alt="SVG preview" style={{ maxWidth: "100%", height: "auto" }} />
            ) : (
              <div className="upload-placeholder">ここにSVGのプレビューが表示されます</div>
            )}
          </div>

          {error && <div className="upload-error">{error}</div>}

          <div className="upload-actions">
            <button className="btn-primary-disabled" disabled>アップロード</button>
            <button className="btn-secondary" onClick={onReset}>リセット</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapUploadScreen;
