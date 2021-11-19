export default function Layout({ children }) {
  const nav_height = '100px';
  const drawer_width = '400px';

  return (
    <div style={{ position: 'relative' }}>
      <nav
        style={{
          position: 'fixed',
          width: drawer_width,
          height: '100%',
          paddingTop: nav_height,
          background: 'green',
        }}
      ></nav>

      <nav
        style={{
          position: 'fixed',
          height: nav_height,
          width: '100%',
          background: 'blue',
        }}
      ></nav>

      <div
        style={{
          position: 'fixed',
          top: nav_height,
          left: drawer_width,
          height: `calc(100vh - ${nav_height})`,
          width: `calc(100% - ${drawer_width})`,
          overflowY: 'scroll',
          // paddingLeft: drawer_width,
          border: 'solid hotpink 5px',
        }}
      >
        {children}
      </div>
    </div>
  );
}
