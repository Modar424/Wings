import CustomCursor from './CustomCursor';

const Layout = ({ children }) => {
  return (
    <>
      {/* المؤشر المخصص - يظهر في جميع الصفحات */}
      <CustomCursor />
      
      {/* المحتوى الرئيسي */}
      <main>
        {children}
      </main>
    </>
  );
};

export default Layout;