import TsukubaMap from '../image/map_test.svg?react';

function SvgTest() {
  return (
    <div style={{ width: '100vw', height: '100vh', border: '5px solid red' }}>
      <h1>SVGテストページ</h1>
      <p>↓ここにSVGが表示されれば成功です↓</p>
      <div style={{ width: '80%', height: '80%', margin: 'auto' }}>
        <TsukubaMap />
      </div>
    </div>
  );
}

export default SvgTest;