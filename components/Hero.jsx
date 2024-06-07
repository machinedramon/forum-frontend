import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Image } from "@nextui-org/react";
import { FaBook, FaInfoCircle } from "react-icons/fa";
import { LayoutContext } from "@/context/LayoutContext";

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Hero = ({
  title,
  summary,
  bgImage,
  pdfLink,
  publication_year,
  subjects,
}) => {
  const { isHeroExpanded } = useContext(LayoutContext);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.img
        loading="eager"
        src={bgImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.4 }}
        animate={{ x: [-40, 40], scale: 1.2 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 20 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
      <div className="relative h-full z-10 py-8 text-white flex flex-col justify-end items-start space-y-4">
        <AnimatePresence>
          {isHeroExpanded && (
            <motion.div
              className="absolute top-0 left-0 py-4"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={animationVariants}
              transition={{ duration: 0.5 }}
            >
              <Image alt="Logo" src="/logo.webp" className="h-[60px]" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-col space-y-4 relative">
          <AnimatePresence>
            <motion.h1
              className="text-5xl font-extrabold"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={animationVariants}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {title}
            </motion.h1>
            <motion.div
              className="flex gap-x-4"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={animationVariants}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-md font-bold text-[#46D369]">
                {publication_year}
              </p>
              <p className="text-md font-light">
                <b className="font-bold mr-1">Assuntos:</b>
                {subjects.join(", ")}
              </p>
            </motion.div>
            <motion.p
              className="text-xl font-medium max-w-[40vw]"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={animationVariants}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {summary}
            </motion.p>
            <motion.div
              className="flex space-x-4 mt-4"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={animationVariants}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button
                as="a"
                href={pdfLink}
                variant="shadow"
                color="primary"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md"
                startContent={<FaBook />}
              >
                Ler
              </Button>
              <Button
                className="text-white rounded-md"
                variant="solid"
                color="default"
              >
                Mais Informações
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Hero;
