import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Button } from "@nextui-org/react";
import { FaPlus } from "react-icons/fa";
import {
  Home,
  Search,
  Activity,
  Document,
  Paper,
  Video,
  InfoCircle,
} from "react-iconly";

const buttonVariants = {
  hidden: { opacity: 0, x: -2 },
  visible: { opacity: 1, x: 0 },
};

const Sidebar = ({ isHovered, isMobile, toggleSidebar }) => {
  const router = useRouter();
  const menuItems = [
    { label: "Início", icon: <Home />, ariaLabel: "Home", path: "/home" },
    { label: "Buscar", icon: <Search />, ariaLabel: "Search", path: "/search" },
    {
      label: "Em alta",
      icon: <Activity />,
      ariaLabel: "Trending",
      path: "/trending",
    },
    { label: "Livros", icon: <Document />, ariaLabel: "Books", path: "/books" },
    {
      label: "Revistas",
      icon: <Paper />,
      ariaLabel: "Magazines",
      path: "/magazines",
    },
    { label: "Vídeos", icon: <Video />, ariaLabel: "Series", path: "/videos" },
    {
      label: "Informativos",
      icon: <InfoCircle />,
      ariaLabel: "Informative",
      path: "/informative",
    },
    {
      label: "Minha lista",
      icon: <FaPlus />,
      ariaLabel: "My List",
      path: "/mylist",
    },
  ];

  if (isMobile) {
    return (
      <motion.div
        className="fixed top-0 right-0 h-full bg-black text-white z-50 flex flex-col items-center px-10 pb-4 justify-between"
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3 }}
        style={{ width: "fit-content" }}
      >
        <button
          onClick={toggleSidebar}
          aria-label="Close Menu"
          className="text-white self-end mb-4 text-2xl"
        >
          &times;
        </button>
        <div className="flex flex-col items-center mb-4">
          <Avatar
            src="https://i.pravatar.cc/150"
            size="md"
            isBordered
            color="primary"
            className="mb-2"
          />
          <p className="text-sm font-semibold">Diego F.</p>
        </div>
        <div className="h-full flex flex-col">
          <div className="my-auto">
            {menuItems.map(({ icon, ariaLabel, path, label }) => (
              <Button
                key={ariaLabel}
                color="default"
                variant="light"
                aria-label={ariaLabel}
                onClick={() => {
                  router.push(path);
                  toggleSidebar();
                }}
                className="mb-4 w-full flex justify-start items-center"
              >
                {icon}
                <span className="ml-2">{label}</span>
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <Button
            auto
            color="default"
            variant="light"
            className="text-xs mb-2 w-full"
            size="sm"
            onClick={() => {
              router.push("/help");
              toggleSidebar();
            }}
          >
            Ajuda
          </Button>
          <Button
            auto
            color="default"
            variant="light"
            className="text-xs w-full"
            size="sm"
            onClick={() => {
              router.push("/logout");
              toggleSidebar();
            }}
          >
            Sair
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed z-50 left-0 top-0 h-full bg-black text-white flex flex-col justify-between py-4"
      initial={{ width: "10vw" }}
      animate={{ width: isHovered ? "14vw" : "10vw" }}
      transition={{ type: "spring", stiffness: 160, damping: 30 }}
    >
      <div className="flex flex-col items-center w-full">
        <motion.div
          className="flex items-center w-full justify-center gap-x-2"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ delay: isHovered ? 0.2 : 0, duration: 0.5 }}
          style={{ pointerEvents: isHovered ? "auto" : "none" }}
        >
          <Avatar
            src="https://i.pravatar.cc/150"
            size="md"
            isBordered
            color="primary"
          />
          <div className="flex flex-col items-start justify-center pt-1">
            <p className="text-sm font-semibold pl-3">Diego F.</p>
            <Button
              size="sm"
              auto
              color="secondary"
              variant="light"
              className="text-xs text-white"
            >
              Editar Perfil
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto">
        <div
          className={`flex flex-col ${
            isHovered ? "items-start" : "items-center"
          } space-y-4 w-fit`}
        >
          {menuItems.map(({ label, icon, ariaLabel, path }, index) => (
            <Button
              key={label}
              isIconOnly={!isHovered}
              color="default"
              variant={isHovered ? "light" : "flat"}
              aria-label={ariaLabel}
              size="md"
              className="transition-all"
              onClick={() => router.push(path)}
            >
              <AnimatePresence>
                <motion.span
                  key={`${label}-icon`}
                  initial="hidden"
                  className={`${!isHovered ? "visible" : "hidden"}`}
                >
                  {icon}
                </motion.span>
                <motion.span
                  key={`${label}-label`}
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.3 }}
                  className={`${isHovered ? "visible" : "hidden"}`}
                >
                  {label}
                </motion.span>
              </AnimatePresence>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        <motion.div
          initial={false}
          className="flex flex-col justify-start space-y-4"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ delay: isHovered ? 0.2 : 0, duration: 0.5 }}
          style={{ pointerEvents: isHovered ? "auto" : "none" }}
        >
          <Button
            auto
            color="default"
            variant="light"
            className="text-xs"
            size="sm"
            onClick={() => router.push("/help")}
          >
            Ajuda
          </Button>
          <Button
            auto
            color="default"
            variant="light"
            className="text-xs"
            size="sm"
            onClick={() => router.push("/logout")}
          >
            Sair
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
