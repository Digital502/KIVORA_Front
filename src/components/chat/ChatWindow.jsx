import { useEffect, useRef, useState } from "react";

export default function ChatWindow({ messages, userId, user, onBack }) {
  const containerRef = useRef(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentGalleryImages, setCurrentGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (containerRef.current && messages.length > 0) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const openImageGallery = (images, startIndex = 0) => {
    setCurrentGalleryImages(images);
    setCurrentImageIndex(startIndex);
    setGalleryOpen(true);
  };

  const closeGallery = () => setGalleryOpen(false);
  const goToPrevImage = () =>
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : currentGalleryImages.length - 1
    );
  const goToNextImage = () =>
    setCurrentImageIndex((prev) =>
      prev < currentGalleryImages.length - 1 ? prev + 1 : 0
    );

  const downloadFile = (url, filename) => {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
      });
  };

  const isValidHttpUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  const formatMessageDate = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const messageDate = new Date(dateString);
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return `Ayer ${messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (diffDays < 7) {
      return `${messageDate.toLocaleDateString([], {
        weekday: "short",
      })} ${messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return `${messageDate.toLocaleDateString([], {
        day: "numeric",
        month: "short",
      })} ${messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  const getDateLabel = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const msgDate = new Date(dateString);
    const nowDateStr = now.toDateString();
    const msgDateStr = msgDate.toDateString();

    if (nowDateStr === msgDateStr) return "Hoy";
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (yesterday.toDateString() === msgDateStr) return "Ayer";
    const diffDays = Math.floor((now - msgDate) / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return msgDate.toLocaleDateString([], {
        weekday: "long",
      });
    }

    return msgDate.toLocaleDateString([], {
      day: "numeric",
      month: "short",
    });
  };

  const MessageStatus = ({ status, isOwnMessage }) => {
    const iconColor = isOwnMessage ? "#0D0D0D" : "#0D0D0D";

    return (
      <span className="ml-1">
        {status === "sent" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill={iconColor}>
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        )}
        {status === "delivered" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill={iconColor}>
            <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
          </svg>
        )}
        {status === "seen" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#5CE1E6">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
        )}
      </span>
    );
  };

  const renderAvatar = (user) => {
    if (!user) return null;
    
    const initial = (user.name || user.email || "?")[0].toUpperCase();

    return user.avatar ? (
      <img
        src={user.avatar}
        alt="avatar"
        className="w-full h-full object-cover rounded-full"
      />
    ) : (
      <div className="flex items-center justify-center w-full h-full text-white font-bold bg-[#036873] rounded-full">
        {initial}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(110vh-330px)] overflow-hidden bg-[#0D0D0D]">
      {/* Header del chat */}
      <div className="bg-[#0D0D0D] p-4 flex items-center border-b border-[#388697]">
        <button 
          onClick={onBack}
          className="mr-2 text-[#5CE1E6] hover:text-[#A3F7F5] transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-[#036873] mr-3 overflow-hidden flex items-center justify-center">
          {renderAvatar(user)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg truncate text-[#5CE1E6]">
            {user?.name || "Usuario desconocido"}
          </h2>
          <p className="text-xs text-[#388697] truncate">
            @{user?.username || user?.email?.split('@')[0] || "usuario"}
          </p>
        </div>
      </div>

      {/* Contenedor del chat */}
      <div
        ref={containerRef}
        className="flex-1 p-4 overflow-y-auto bg-[#0D0D0D]"
      >
        {galleryOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
            {/* Header de la galería */}
            <div className="flex justify-between items-center p-4 bg-black bg-opacity-50 text-white">
              {/* Flecha de retroceso - solo en móvil */}
              <div className="md:hidden">
                <button
                  onClick={closeGallery}
                  className="text-white hover:text-[#5CE1E6] transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 19l-7-7 7-7" 
                    />
                  </svg>
                </button>
              </div>
              
              {/* Contador de imágenes */}
              <span className="text-sm">
                {currentImageIndex + 1} / {currentGalleryImages.length}
              </span>
              
              {/* Botones de acción */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const url = currentGalleryImages[currentImageIndex];
                    const name = url.split("/").pop().split("?")[0];
                    if (isValidHttpUrl(url)) {
                      downloadFile(url, name);
                    } else {
                      alert("URL de imagen no válida para descarga");
                    }
                  }}
                  className="text-white hover:text-[#5CE1E6]"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
                
                {/* Botón de cerrar - solo en desktop */}
                <button
                  onClick={closeGallery}
                  className="hidden md:block text-white hover:text-[#5CE1E6] text-2xl"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Contenido de la galería */}
            <div className="flex-1 flex items-center justify-center relative">
              <button
                onClick={goToPrevImage}
                className="absolute left-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-[#036873] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <img
                src={currentGalleryImages[currentImageIndex]}
                className="max-w-full max-h-[80vh] object-contain"
                alt={`Imagen ${currentImageIndex + 1} de ${currentGalleryImages.length}`}
              />
              
              <button
                onClick={goToNextImage}
                className="absolute right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-[#036873] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Miniaturas de la galería */}
            <div className="p-2 bg-black bg-opacity-50 overflow-x-auto">
              <div className="flex justify-center gap-2">
                {currentGalleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`w-16 h-16 rounded cursor-pointer overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx
                        ? "border-[#5CE1E6] scale-105"
                        : "border-transparent hover:border-[#388697]"
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img 
                      src={img} 
                      className="w-full h-full object-cover" 
                      alt={`Miniatura ${idx + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lista de mensajes */}
        <ul className="space-y-3">
          {messages.map((msg, i) => {
            const isImage = (file) => /\.(jpg|jpeg|png|webp)$/i.test(file);
            const isDocument = (file) => /\.(pdf|docx|xlsx)$/i.test(file);

            const images = (msg.files || []).filter(isImage);
            const documents = (msg.files || []).filter(isDocument);
            const hasText = msg.text?.trim().length > 0;
            const isOwnMessage = msg.senderId === userId;
            let messageStatus = "sent";
            if (isOwnMessage) {
              if (msg.seen) messageStatus = "seen";
              else if (msg.delivered) messageStatus = "delivered";
            }

            const currentDateLabel = getDateLabel(msg.createdAt);
            const prevDateLabel =
              i > 0 ? getDateLabel(messages[i - 1].createdAt) : null;
            const showDateSeparator =
              i === 0 || currentDateLabel !== prevDateLabel;

            return (
              <div key={i}>
                {showDateSeparator && (
                  <div className="text-center text-xs text-[#5CE1E6] mb-4 mt-6">
                    <span className="bg-[#1A1A1A] px-4 py-2 rounded-full border border-[#388697]">
                      {currentDateLabel}
                    </span>
                  </div>
                )}

                <li className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                  <div 
                    className={`relative ${
                      isOwnMessage
                        ? "bg-[#036873] text-white"
                        : "bg-[#1A1A1A] text-[#E0E0E0]"
                    } p-4 rounded-2xl shadow-lg ${
                      isOwnMessage ? "rounded-br-none ml-12" : "rounded-bl-none mr-12"
                    }`}
                    style={{ maxWidth: "min(500px, 90vw)" }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      {!isOwnMessage && (
                        <div className="w-8 h-8 rounded-full bg-[#036873] overflow-hidden flex-shrink-0">
                          {renderAvatar(user)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className={`flex items-baseline gap-2 ${
                          isOwnMessage ? "justify-end" : "justify-start"
                        }`}>
                          {!isOwnMessage && (
                            <>
                              <span className="text-sm font-bold text-[#5CE1E6]">
                                {user?.name || "Usuario"}
                              </span>
                              <span className="text-xs text-[#388697]">
                                @{user?.username || user?.email?.split('@')[0] || "usuario"}
                              </span>
                            </>
                          )}
                          {isOwnMessage && (
                            <span className="text-sm font-bold text-[#A3F7F5]">
                              Tú
                            </span>
                          )}
                        </div>
                        
                        {hasText && (
                          <div className={`mt-2 text-[15px] leading-relaxed whitespace-pre-wrap ${
                            isOwnMessage ? "text-white" : "text-[#E0E0E0]"
                          }`}>
                            {msg.text.split('\n').map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {images.length > 0 && (
                      <div
                        className={`mt-3 ${
                          images.length === 1
                            ? "w-full flex justify-start"
                            : "grid grid-cols-2 gap-3"
                        }`}
                      >
                        {images.slice(0, 4).map((img, idx) => {
                          const name = img.split("/").pop().split("?")[0];

                          return (
                            <div
                              key={idx}
                              className={`relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] ${
                                images.length === 1
                                  ? "w-full max-w-2xl"
                                  : "aspect-square"
                              }`}
                            >
                              <div
                                className="w-full h-full cursor-pointer"
                                onClick={() => openImageGallery(images, idx)}
                              >
                                <img
                                  src={img}
                                  className={`w-full h-full object-cover rounded-md ${
                                    images.length === 1 ? "max-h-[500px]" : ""
                                  }`}
                                  alt="Mensaje con imagen"
                                />
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isValidHttpUrl(img)) {
                                    downloadFile(img, name);
                                  } else {
                                    alert(
                                      "URL de imagen no válida para descarga"
                                    );
                                  }
                                }}
                                className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded hover:bg-[#036873] transition-colors"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                              </button>

                              {idx === 3 && images.length > 4 && (
                                <div
                                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                                  onClick={() => openImageGallery(images, idx)}
                                >
                                  <span className="text-white font-bold text-xl">
                                    +{images.length - 4}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {documents.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {documents.map((doc, idx) => {
                          const name = doc.split("/").pop().split("?")[0];
                          return (
                            <div
                              key={idx}
                              className={`flex items-center justify-between ${
                                isOwnMessage
                                  ? "bg-[#036873] bg-opacity-30"
                                  : "bg-[#1A1A1A]"
                              } rounded-xl p-3 w-full border ${
                                isOwnMessage ? "border-[#5CE1E6]" : "border-[#388697]"
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                                <svg
                                  fill="none"
                                  className="w-5 h-5 flex-shrink-0"
                                  viewBox="0 0 20 21"
                                >
                                  <path
                                    fill={isOwnMessage ? "#A3F7F5" : "#5CE1E6"}
                                    d="M5.024.5c-.688 0-1.25.563-1.25 1.25v17.5c0 .688.562 1.25 1.25 1.25h12.5c.687 0 1.25-.563 1.25-1.25V5.5l-5-5h-8.75z"
                                  />
                                </svg>
                                <p className={`text-sm font-medium ${
                                  isOwnMessage ? "text-white" : "text-[#E0E0E0]"
                                } truncate`}>
                                  {name}
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  if (isValidHttpUrl(doc)) {
                                    downloadFile(doc, name);
                                  } else {
                                    alert(
                                      "URL de documento no válida para descarga"
                                    );
                                  }
                                }}
                                className={`p-2 ${
                                  isOwnMessage
                                    ? "text-white bg-[#036873] hover:bg-[#036873] bg-opacity-50"
                                    : "text-[#E0E0E0] bg-[#388697] hover:bg-[#036873]"
                                } rounded-lg transition-colors flex-shrink-0 ml-2`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div
                      className={`text-xs mt-3 pb- flex justify-end items-center ${
                        isOwnMessage ? "text-[#A3F7F5]" : "text-[#388697]"
                      }`}
                    >
                      <span>{formatMessageDate(msg.createdAt)}</span>
                      {isOwnMessage && (
                        <MessageStatus
                          status={messageStatus}
                          isOwnMessage={isOwnMessage}
                        />
                      )}
                    </div>
                  </div>
                </li>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};