import Navbar from "./NavBar";

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <div className="min-h-screen bg-[#F7F3E9] text-[#1B4332]">
      <div className="">
        {children}
      </div>
    </div>
  );
}