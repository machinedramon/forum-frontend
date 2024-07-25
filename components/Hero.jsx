"use client";
import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  useDisclosure,
  ScrollShadow,
} from "@nextui-org/react";
import { FaBook } from "react-icons/fa";
import { LayoutContext } from "@/context/LayoutContext";
import { useRouter } from "next/navigation";
import { BookContext } from "@/context/BookContext";
import { useMediaQuery } from "react-responsive";

const animationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const truncateText = (text, limit) => {
  if (text.length > limit) {
    return text.substring(0, limit) + "...";
  }
  return text;
};

const getDynamicFontSize = (textLength) => {
  if (textLength > 40) return "text-2xl md:text-3xl";
  if (textLength > 30) return "text-3xl md:text-4xl";
  return "text-4xl md:text-5xl";
};

const Hero = ({
  title,
  summary,
  bgImage,
  pdfLink,
  publication_year,
  subjects,
  id,
}) => {
  const { isHeroExpanded } = useContext(LayoutContext);
  const { isOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const { setSelectedBook } = useContext(BookContext);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  if (!title) return null;

  const remainingSubjects = subjects.length;

  const handleMoreInfoClick = () => {
    router.push(`/book/${id}`);
  };

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
      <div className="absolute h-[100%] inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
      <div
        className={`relative h-full z-10 py-8 text-white flex flex-col justify-end items-start space-y-4 ${
          isMobile ? "p-4" : "p-8"
        }`}
      >
        <AnimatePresence>
          {!isMobile && isHeroExpanded && (
            <motion.div
              key={`${title}-logo`}
              className="absolute top-0 left-0 py-4"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={animationVariants}
              transition={{ duration: 0.5 }}
            >
              <Image
                alt="Logo"
                src="/logo.webp"
                className="h-[40px] md:h-[60px]"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-col space-y-4 relative">
          <AnimatePresence>
            <motion.h1
              key={`${title}-heading`}
              className={`font-extrabold ${getDynamicFontSize(title.length)} ${
                isMobile ? "text-lg md:text-xl" : ""
              }`}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={animationVariants}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {title}
            </motion.h1>
            <motion.div
              key={`${title}-details`}
              className="flex gap-x-4 items-center"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={animationVariants}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-md font-bold text-[#46D369]">
                {publication_year}
              </p>
              <div className="flex items-center">
                <span className="text-md font-light flex items-center">
                  <b className="font-bold mr-1">Assuntos:</b>
                  {isMobile ? (
                    remainingSubjects > 0 && (
                      <Button
                        isIconOnly
                        type="button"
                        variant="flat"
                        size="md"
                        className="ml-2 cursor-pointer"
                        aria-label="Mostrar mais assuntos"
                        onPress={() => onOpenChange(true)}
                      >
                        +{remainingSubjects}
                      </Button>
                    )
                  ) : (
                    <>
                      {subjects.slice(0, 3).join(", ")}
                      {remainingSubjects > 3 && (
                        <Button
                          isIconOnly
                          type="button"
                          variant="flat"
                          size="md"
                          className="ml-2 cursor-pointer"
                          aria-label="Mostrar mais assuntos"
                          onPress={() => onOpenChange(true)}
                        >
                          +{remainingSubjects - 3}
                        </Button>
                      )}
                    </>
                  )}
                  <Modal
                    isOpen={isOpen}
                    placement="auto"
                    onOpenChange={onOpenChange}
                    className="bg-black max-w-fit text-white"
                    closeButton={false}
                    classNames={{ closeButton: "hidden" }}
                  >
                    <ModalContent className="bg-black max-h-[400px] transition-all shadow-xl text-white">
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1">
                            Todos os Assuntos
                          </ModalHeader>
                          <ScrollShadow className="max-w-fit max-h-[400px] px-4 text-black rounded-md shadow-lg overflow-y-auto">
                            <ModalBody>
                              <div className="flex flex-col gap-2 overflow-hidden break-words">
                                {subjects.map((subject, index) => (
                                  <Chip
                                    key={`${subject}-${index}`}
                                    color="primary"
                                    radius="sm"
                                    className="break-words"
                                    style={{
                                      backgroundColor: "#000",
                                      maxWidth: "100%",
                                    }}
                                  >
                                    • {subject}
                                  </Chip>
                                ))}
                              </div>
                            </ModalBody>
                          </ScrollShadow>
                          <ModalFooter>
                            <Button
                              color="primary"
                              variant="solid"
                              size="sm"
                              onPress={onClose}
                              className="text-[#fff]"
                            >
                              Fechar
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </span>
              </div>
            </motion.div>
            <motion.p
              key={`${title}-summary`}
              className={`text-lg md:text-xl font-medium max-w-[90vw] md:max-w-[40vw] ${
                isMobile ? "text-sm" : "text-xl"
              }`}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={animationVariants}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {truncateText(summary, isMobile ? 65 : 160)}
            </motion.p>
            <motion.div
              key={`${title}-buttons`}
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
                Iniciar
              </Button>
              <Button
                className="text-white rounded-md"
                variant="solid"
                color="default"
                onClick={handleMoreInfoClick}
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
