import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../../contexts/ContextProvider";
import { adminLinks } from "../../routes/adminRoutes";
import ActiveLink from "../../components/activeLink";
import Link from "next/link";
import { useRouter } from "next/router";

export const Sidebar = () => {
  const router = useRouter();
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    router.push("/login-register");
  };

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto sidebar-dashboard md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              href="/"
              onClick={handleCloseSidebar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight text-slate-900"
            >
              <div className="p-2 bg-gray-500 rounded-lg">
                <img src="/Logo.png" alt="FutureFocals" />
              </div>
              <span>FutureFocals</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() =>
                  setActiveMenu((prevActiveMenu) => !prevActiveMenu)
                }
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            {adminLinks.map((link, index) => (
              <div key={index}>
                <p className="text-gray-400 m-3 mt-4 uppercase">{link.title}</p>
                {link.links.map((link, index) => (
                  <ActiveLink
                    onClick={handleCloseSidebar}
                    href={`/dashboards/${link.name.toLowerCase()}`}
                    styles="flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 hover:bg-orange-300 m-2"
                  >
                    {link.icon}
                    <span className="capitalize">{link.name}</span>
                  </ActiveLink>
                ))}
              </div>
            ))}
            <button className="m-3 mt-4 text-center bg-orange-400 w-[85%] py-3 rounded-lg" onClick={handleLogout}>Logout</button>
          </div>
        </>
      )}
    </div>
  );
};