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

const Sidebar = ({ isHovered }) => {
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

  return (
    <motion.div
      className="fixed left-0 top-0 h-full bg-black text-white flex flex-col justify-between py-4"
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
