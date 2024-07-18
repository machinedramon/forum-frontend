"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Image,
  Button,
  Chip,
  Accordion,
  AccordionItem,
  Spinner,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Show } from "react-iconly";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/MainLayout";
import { ScrollShadow } from "@nextui-org/react";
import {
  FaFolderPlus,
  FaBook,
  FaEllipsisV,
  FaTimes,
  FaExpand,
  FaSearchPlus,
  FaSearchMinus,
} from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const BookDetails = ({ params }) => {
  const { id } = params;
  const [book, setBook] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [selectedEdition, setSelectedEdition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pdfViewerRef = useRef(null);
  const [isBibModalOpen, setIsBibModalOpen] = useState(false);
  const [bibText, setBibText] = useState("");

  const [firstPart, secondPart] = id.split("-");

  const handleBibReference = () => {
    const currentUrl = window.location.href; // ou uma URL específica do livro se disponível
    const currentDate = new Date()
      .toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short", // Formato curto para o mês (ex: jun)
        day: "2-digit",
      })
      .replace(/(\w+)\./, "$1."); // Coloca o ponto corretamente após a abreviação do mês

    const currentYear = new Date().getFullYear(); // Pega o ano atual
    const authorFormatted = formatAuthorName(
      book.filters.find((filter) => filter.id.startsWith("author_"))?.title ||
        "N/A"
    );
    const titleFormatted = toTitleCase(book.text_2);
    const edition = selectedEdition.number;
    const citation = `${authorFormatted}. ${titleFormatted}. ${edition}ª ED.. Belo Horizonte: Fórum, ${currentYear}. Disponível em: ${currentUrl}. Acesso em: ${currentDate}.`;
    setBibText(citation);
    setIsBibModalOpen(true);
  };

  const formatAuthorName = (fullName) => {
    const parts = fullName.split(" ");
    const lastName = parts.pop(); // Remove e retorna o último elemento
    return `${lastName.toUpperCase()}, ${parts.join(" ")}`;
  };

  const toTitleCase = (text) => {
    return text.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bibText).then(
      () => {
        toast.success("Texto copiado com sucesso!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored", // ou qualquer outro estilo que combine com sua página
        });
      },
      (err) => {
        toast.error("Falha ao copiar texto!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        console.error("Failed to copy text: ", err);
      }
    );
  };

  const fetchBookDetails = async (bookId) => {
    try {
      const response = await axios.get(`http://localhost:9900/books/${bookId}`);
      setBook(response.data);
      const initialEdition = response.data.editions[0]; // Seleciona a primeira edição
      setSelectedEdition(initialEdition);
      const url = getCoverImageUrl(firstPart, initialEdition.num_id);
      setCoverImageUrl(url);
    } catch (error) {
      console.error("Error fetching book details:", error);
      router.push("/"); // Redireciona para a página inicial se houver um erro
    }
  };

  const getCoverImageUrl = (bookId, editionId) => {
    return `https://bid1006-production-public.s3.sa-east-1.amazonaws.com/books/cover/${bookId}/editions/${editionId}.jpg`;
  };

  useEffect(() => {
    fetchBookDetails(id);
  }, [id]);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const renderLoading = () => (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <Spinner label="Carregando livro..." color="warning" />
    </div>
  );

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      pdfViewerRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const zoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.2, 3.0));
  const zoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 0.2, 0.5));

  const handleEditionChange = (editionId) => {
    const selected = book.editions.find((edition) => edition.id === editionId);
    setSelectedEdition(selected);
    const url = getCoverImageUrl(firstPart, selected.num_id);
    setCoverImageUrl(url);
  };

  const toggleDescription = () => {
    setIsModalOpen(true);
  };

  const renderBookDescription = () => (
    <div className="flex flex-col gap-y-2 my-2">
      <h3 className="text-2xl font-bold">Descrição</h3>
      <p className="line-clamp-3 transition-all">{book.text_3}</p>
      <Button
        size="sm"
        variant="ghost"
        onClick={toggleDescription}
        className="w-fit self-end"
      >
        Mostrar mais
      </Button>
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );

  if (!book) {
    return renderLoading();
  }

  const {
    text_2: title,
    text_5: subtitle,
    filters = [],
    publish_date,
    bgImage,
    book_serie,
    meta,
    editions,
  } = book;
  const author =
    filters.find((filter) => filter.id.startsWith("author_"))?.title || "N/A";
  const series = book_serie?.title || "N/A";
  const details = [
    { label: "Autor(es)", value: author },
    { label: "CDD", value: book.cdd || "N/A" },
    { label: "CDU", value: book.cdu || "N/A" },
    { label: "Nº de páginas", value: selectedEdition?.pages || "N/A" },
    { label: "ISBN", value: selectedEdition?.isbn || "N/A" },
    { label: "Ano", value: new Date(publish_date).getFullYear() },
    { label: "Série", value: series },
    { label: "Edição", value: selectedEdition?.number || "N/A" },
  ];

  const renderChapters = (chapterType) => {
    return selectedEdition.chapters
      .filter((chapter) => chapter.chapter_type === chapterType)
      .map((chapter) => (
        <div
          key={chapter.id}
          className="flex justify-between items-center my-2 p-2 hover:bg-[#002447] rounded-md transition-all ease-in-out duration-300"
        >
          <button
            onClick={() => setSelectedPdfUrl(chapter.pdf)}
            className="text-[#fff] items-center max-w-[80%] flex gap-x-2 w-full"
          >
            <Show className="w-[4%]" />
            <span className="w-[96%] underline underline-offset-4 decoration-[#DA002B] text-left">
              {chapter.title}
            </span>
          </button>
          <Button isIconOnly variant="light" auto className="text-white">
            <FaEllipsisV color="#fff" />
          </Button>
        </div>
      ));
  };

  const renderBookDetails = () => (
    <>
      <motion.img
        loading="eager"
        src={bgImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.4 }}
        animate={{ x: [-40, 40], scale: 1.2 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 20,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
      <div className="relative z-10 h-full flex flex-col w-full">
        <div className="container mx-auto p-4 bg-black bg-opacity-75 text-white h-full flex">
          <div className="w-1/3 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={coverImageUrl}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Image
                  src={coverImageUrl}
                  alt={title}
                  className="max-w-full h-[500px] w-auto rounded-md object-cover"
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="w-2/3 flex flex-col h-full">
            <div className="h-1/4 flex flex-col justify-end">
              <Chip color="primary" radius="sm" className="mb-4">
                Livro
              </Chip>
              <h1 className="text-4xl font-bold mb-2">{title}</h1>
              <h2 className="text-2xl mb-4">{subtitle}</h2>
              <div className="flex gap-4 mb-4">
                <Button color="primary" startContent={<FaFolderPlus />}>
                  Adicionar à pasta
                </Button>
                <Button
                  color="primary"
                  startContent={<FaBook />}
                  onClick={handleBibReference}
                >
                  Referência bibliográfica
                </Button>
                <Select
                  defaultSelectedKeys={[selectedEdition?.id]}
                  onChange={(e) => handleEditionChange(e.target.value)}
                  aria-label="Selecione a edição"
                  className="text-white max-w-[130px]"
                  isDisabled={editions.length === 1}
                >
                  {editions.map((edition) => (
                    <SelectItem
                      key={edition.id}
                      value={edition.id}
                      className="text-black"
                    >
                      {`${edition.number}ª Edição`}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            <div className="h-3/4 overflow-y-scroll">
              <Tabs aria-label="Book Details">
                <Tab key="capitulos" title="Capítulos" className="h-fit">
                  <Card className="h-fit flex flex-col">
                    <CardBody className="overflow-hidden">
                      {renderBookDescription()}
                      {editions && (
                        <div>
                          <Accordion
                            variant="shadow"
                            defaultExpandedKeys={["pre-textual"]}
                          >
                            <AccordionItem
                              key="pre-textual"
                              aria-label="Pre-textual"
                              title="Pre-textual"
                            >
                              {renderChapters("pre-textual")}
                            </AccordionItem>
                            <AccordionItem
                              key="capitulo"
                              aria-label="Capítulos"
                              title="Capítulos"
                            >
                              {renderChapters("capitulo")}
                            </AccordionItem>
                            <AccordionItem
                              key="pos-textual"
                              aria-label="Pos-textual"
                              title={"Pos-textual"}
                            >
                              {renderChapters("pos-textual")}
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </Tab>
                <Tab key="info" title="Informações" className="h-fit">
                  <Card className="h-fit flex flex-col">
                    <CardBody className="overflow-hidden">
                      <ScrollShadow className="h-full">
                        <h3 className="text-2xl font-bold mb-4">Detalhes</h3>
                        {details.map((detail, index) => (
                          <p key={index} className="mb-2">
                            <span className="font-bold">{detail.label}:</span>{" "}
                            {detail.value}
                          </p>
                        ))}
                      </ScrollShadow>
                    </CardBody>
                  </Card>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <MainLayout title={title}>
      <div className="relative w-full h-screen overflow-hidden">
        {selectedPdfUrl ? (
          <div
            ref={pdfViewerRef}
            className="absolute inset-0 bg-black bg-opacity-75 z-20 flex flex-col"
          >
            <div className="flex justify-between items-center p-4 bg-black bg-opacity-75">
              <div className="flex gap-4">
                <Button
                  color="error"
                  onClick={() => setSelectedPdfUrl("")}
                  startContent={<FaTimes />}
                >
                  Fechar
                </Button>
                <Button
                  color="primary"
                  onClick={toggleFullScreen}
                  startContent={<FaExpand />}
                >
                  {isFullScreen ? "Sair da tela cheia" : "Tela cheia"}
                </Button>
                <Button
                  color="primary"
                  onClick={zoomIn}
                  startContent={<FaSearchPlus />}
                >
                  Zoom In
                </Button>
                <Button
                  color="primary"
                  onClick={zoomOut}
                  startContent={<FaSearchMinus />}
                >
                  Zoom Out
                </Button>
              </div>
            </div>
            <div className="flex-grow flex justify-center items-center">
              {loading && renderLoading()}
              <Document
                file={selectedPdfUrl}
                onLoadSuccess={handleDocumentLoadSuccess}
                onLoadStart={() => setLoading(true)}
                loading={renderLoading()}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    scale={zoom}
                    className="mb-4"
                    renderAnnotationLayer={false}
                  />
                ))}
              </Document>
            </div>
          </div>
        ) : (
          renderBookDetails()
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="z-50"
        scrollBehavior="inside"
      >
        <ModalContent className="bg-black max-h-[400px] transition-all shadow-xl">
          <ModalHeader>
            <h2>Descrição</h2>
          </ModalHeader>
          <ModalBody>
            <p>{book.text_3}</p>
          </ModalBody>
          <ModalFooter>
            <Button auto onClick={() => setIsModalOpen(false)}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isBibModalOpen}
        onClose={() => setIsBibModalOpen(false)}
        className="z-50"
        scrollBehavior="inside"
      >
        <ModalContent className="bg-black max-h-[400px] transition-all shadow-xl">
          <ModalHeader>
            <h2>Referência Bibliográfica</h2>
          </ModalHeader>
          <ModalBody>
            <p>{bibText}</p>
          </ModalBody>
          <ModalFooter>
            <Button auto onClick={() => setIsBibModalOpen(false)}>
              Fechar
            </Button>
            <Button auto color="primary" onClick={copyToClipboard}>
              Copiar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ToastContainer position="top-center" />
    </MainLayout>
  );
};

export default BookDetails;
