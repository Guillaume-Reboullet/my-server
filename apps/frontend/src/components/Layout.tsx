import Sidebar from './Sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="p-6 w-full min-h-screen bg-gray-100 ml-80 overscroll-none
">
        {children}
      </main>
    </div>
  );
}

export default Layout;