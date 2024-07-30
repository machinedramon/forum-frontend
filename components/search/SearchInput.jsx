/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import {
  Input,
  Button,
  Tooltip,
  Switch,
  Badge,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { Search, Filter2, InfoCircle, Voice } from "react-iconly";
import { RiRobot2Fill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";

const SearchInput = ({ onSearch, isSmartSearch, setIsSmartSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = handleVoiceResult;
      recognitionRef.current.onend = handleVoiceEnd;
      recognitionRef.current.onerror = handleVoiceError;
    } else {
      alert("Seu navegador não suporta reconhecimento de voz.");
    }
  }, []);

  const handleVoiceResult = (event) => {
    clearTimeout(silenceTimeoutRef.current);
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join("");
    setInputValue(transcript);

    if (event.results[0].isFinal) {
      silenceTimeoutRef.current = setTimeout(() => {
        recognitionRef.current.stop();
        onSearch(transcript); // Pesquisa automática após o silêncio
      }, 2000);
    }
  };

  const handleVoiceEnd = () => {
    setListening(false);
    //onSearch(inputValue);
  };

  const handleVoiceError = (event) => {
    console.error("Speech recognition error:", event.error);
    setListening(false);
    recognitionRef.current.stop();
  };

  const handleMicClick = () => {
    if (listening) {
      recognitionRef.current.stop();
    } else {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      onSearch(inputValue);
    }
  };

  const handleSearchClick = () => {
    onSearch(inputValue);
  };

  return (
    <div className="search-container mb-4 flex flex-col items-center gap-4 h-[16%]">
      <div className="w-full flex flex-row justify-between gap-4">
        <AnimatePresence mode="wait">
          {isSmartSearch ? (
            <motion.div
              key="smartSearch"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="flex-grow"
            >
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyUp={handleKeyUp}
                placeholder="Pesquisar com IA..."
                fullWidth
                variant="faded"
                color="default"
                className="neon-effect"
              />
            </motion.div>
          ) : (
            <motion.div
              key="standardSearch"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="flex-grow"
            >
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyUp={handleKeyUp}
                placeholder="Pesquisar..."
                fullWidth
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2">
          <Button isIconOnly variant="solid" onClick={handleMicClick}>
            {!listening && <Voice className="text-white" />}
            {listening && <span className="text-[red] animate-pulse">⬤</span>}
          </Button>
          <Button onClick={handleSearchClick} className="w-28">
            <Search className="mr-1" />
            Buscar
          </Button>
        </div>
      </div>
      <div className="w-full flex justify-between gap-4 items-center h-12">
        <Tooltip
          className="bg-[#0A0707] mt-2 shadow-lg"
          showArrow={false}
          placement="bottom-start"
          content={
            <span className="bg-[#0A0707] max-w-64 p-2 flex flex-col">
              <span className="text-xs mb-4 bg-[#ffffff21] w-fit px-1">
                • Novo recurso disponível
              </span>
              <div className="w-64">
                <span className="text-[#fff] bg-[#DA002B] flex w-fit items-center mb-2 p-2 rounded-lg">
                  <RiRobot2Fill className="mr-1" />
                  Pesquisa Inteligente
                </span>
                A busca inteligente transforma suas consultas em buscas
                precisas, explorando títulos, descrições e conteúdos completos.
                Aproveite o poder da IA para expandir, melhorar ou refinar seus
                resultados.
              </div>
            </span>
          }
        >
          <Switch
            checked={isSmartSearch}
            onChange={(e) => setIsSmartSearch(e.target.checked)}
            size="md"
            color="default"
            className="flex"
          >
            <Badge
              content="novo"
              color="primary"
              shape="rectangle"
              size="sm"
              className="top-[-4px]"
            >
              Pesquisa Inteligente
            </Badge>
          </Switch>
        </Tooltip>
        {!isSmartSearch && isDesktop && (
          <Tooltip
            className="bg-[#0A0707] mt-2 shadow-lg"
            showArrow={false}
            placement="bottom-start"
            content={
              <span className="bg-[#0A0707] max-w-64 p-2 flex flex-col">
                <span className="text-xs mb-4 bg-[#ffffff21] w-fit flex gap-x-1 px-1">
                  <InfoCircle size={16} /> Info
                </span>
                <div className="w-64">
                  <span className="text-[#fff] bg-[#DA002B] flex w-fit items-center mb-2">
                    Amplitude:
                  </span>
                  <span>
                    A amplitude &quot;Somente no título&quot; contempla títulos
                    de livros, capítulos, revistas, doutrinas, jurisprudências e
                    vídeos.
                  </span>
                </div>
              </span>
            }
          >
            <div className="gap-x-2 flex">
              <RadioGroup orientation="horizontal" defaultValue={"all-content"}>
                <Radio color="primary" value="all-content">
                  Em todo conteúdo
                </Radio>
                <Radio color="primary" value="only-title">
                  Somente no título
                </Radio>
              </RadioGroup>
              <InfoCircle />
            </div>
          </Tooltip>
        )}
        {!isSmartSearch && (
          <Button onClick={handleSearchClick} className="w-28">
            <Filter2 className="mr-1" />
            Filtrar
          </Button>
        )}
      </div>
      {!isSmartSearch && isMobile && (
        <div className="w-full flex flex-col gap-4">
          <Tooltip
            className="bg-[#0A0707] mt-2 shadow-lg"
            showArrow={false}
            placement="bottom-start"
            content={
              <span className="bg-[#0A0707] max-w-64 p-2 flex flex-col">
                <span className="text-xs mb-4 bg-[#ffffff21] w-fit flex gap-x-1 px-1">
                  <InfoCircle size={16} /> Info
                </span>
                <div className="w-64">
                  <span className="text-[#fff] bg-[#DA002B] flex w-fit items-center mb-2">
                    Amplitude:
                  </span>
                  <span>
                    A amplitude &quot;Somente no título&quot; contempla títulos
                    de livros, capítulos, revistas, doutrinas, jurisprudências e
                    vídeos.
                  </span>
                </div>
              </span>
            }
          >
            <div className="gap-x-2 flex">
              <RadioGroup orientation="horizontal" defaultValue={"all-content"}>
                <Radio color="primary" value="all-content">
                  Em todo conteúdo
                </Radio>
                <Radio color="primary" value="only-title">
                  Somente no título
                </Radio>
              </RadioGroup>
              <InfoCircle />
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
