import { useState, useEffect, useRef } from "react";
import Picker from "emoji-picker-react";
import { FiSend, FiPaperclip, FiSmile, FiX } from "react-icons/fi";

 export default function MessageInput ({ onSend, disabled = false }) {
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);
  const textareaRef = useRef(null);
  const pickerRef = useRef(null);
  const dropzoneRef = useRef(null);
  const inputContainerRef = useRef(null);
  const [files, setFiles] = useState([]);

  const MAX_FILES = 10;
  const [dropzoneWidth, setDropzoneWidth] = useState(0);

  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!text.trim() && files.length === 0) || disabled) return;

    const formData = new FormData();
    if (text.trim()) formData.append("text", text);
    files.forEach((file) => formData.append("files", file));

    await onSend(formData);
    setText("");
    setFiles([]);
    setShowPicker(false);
    setShowDropzone(false);
  };

  const handleFilesAdded = (newFiles) => {
    const selectedFiles = Array.from(newFiles);
    setFiles((prev) => {
      const combined = [...prev, ...selectedFiles];
      if (combined.length > MAX_FILES) {
        return combined.slice(0, MAX_FILES);
      }
      return combined;
    });
  };

  const handleFileInputChange = (e) => {
    handleFilesAdded(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [text]);

  useEffect(() => {
    function updateWidth() {
      if (inputContainerRef.current) {
        setDropzoneWidth(inputContainerRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSend();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current && !pickerRef.current.contains(e.target) &&
        dropzoneRef.current && !dropzoneRef.current.contains(e.target)
      ) {
        setShowPicker(false);
        setShowDropzone(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isImage = (file) => file.type.startsWith("image/");

  return (
    <form
      onSubmit={handleSend}
      className="w-full p-4 bg-[#0D0D0D] relative"
    >
      {/* Contenedor principal del input */}
      <div
        ref={inputContainerRef}
        className="relative flex items-end bg-[#0D0D0D] rounded-xl border border-[#388697] focus-within:ring-2 focus-within:ring-[#5CE1E6] focus-within:border-transparent transition-all"
      >
        {/* Botón de emojis */}
        <button
          type="button"
          onClick={() => setShowPicker((prev) => !prev)}
          className="p-3 text-[#5CE1E6] hover:text-[#A3F7F5] transition-colors"
          title="Insertar emoji"
        >
          <FiSmile className="w-5 h-5" />
        </button>

        <textarea
          ref={textareaRef}
          className="flex-1 py-3 px-1 bg-transparent border-none focus:ring-0 focus:outline-none resize-none overflow-hidden text-[#E0E0E0] placeholder-[#388697] text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          rows={1}
          disabled={disabled}
        />

        {/* Botón adjuntar archivos */}
        <button
          type="button"
          onClick={() => setShowDropzone(true)}
          className="p-3 text-[#5CE1E6] hover:text-[#A3F7F5] transition-colors"
          title="Adjuntar archivos"
        >
          <FiPaperclip className="w-5 h-5" />
        </button>

        {/* Botón enviar */}
        <button
          type="submit"
          disabled={disabled || (!text.trim() && files.length === 0)}
          className={`m-1 p-2 rounded-lg ${
            disabled || (!text.trim() && files.length === 0)
              ? "text-[#388697] cursor-not-allowed"
              : "bg-[#036873] text-white hover:bg-[#5CE1E6]"
          } transition-colors`}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>

      {/* Dropzone para archivos */}
      {showDropzone && (
        <div
          ref={dropzoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="absolute z-50 p-4 bg-[#1A1A1A] border border-[#388697] rounded-lg shadow-lg"
          style={{
            width: dropzoneWidth,
            bottom: "5.5rem",
            left: inputContainerRef.current ? inputContainerRef.current.offsetLeft : 0,
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-[#5CE1E6]">Adjuntar archivos</h3>
            <button
              type="button"
              onClick={() => setShowDropzone(false)}
              className="text-[#388697] hover:text-[#5CE1E6]"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#388697] rounded-lg cursor-pointer hover:border-[#5CE1E6] transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
              <FiPaperclip className="w-8 h-8 mb-3 text-[#388697]" />
              <p className="mb-1 text-sm text-[#5CE1E6]">
                <span className="font-semibold">Click para subir</span> o arrastra y suelta
              </p>
              <p className="text-xs text-[#388697]">
                PNG, JPG, GIF, PDF, DOCX (máx. 10 archivos)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
              max={MAX_FILES}
              accept=".png,.jpg,.jpeg,.gif,.pdf,.docx,.xlsx,.pptx"
            />
          </label>

          {/* Vista previa de archivos */}
          {files.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative group border border-[#388697] rounded-lg bg-[#0D0D0D] p-1 hover:bg-[#036873]/30 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute -top-2 -right-2 bg-[#1A1A1A] rounded-full p-1 shadow-sm text-[#5CE1E6] hover:text-[#A3F7F5] opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Eliminar archivo"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                    {isImage(file) ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="w-full h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-16">
                        <div className="w-10 h-10 bg-[#036873]/30 rounded-full flex items-center justify-center text-[#5CE1E6] mb-1">
                          <FiPaperclip className="w-4 h-4" />
                        </div>
                        <p className="text-xs text-[#E0E0E0] text-center truncate w-full px-1">
                          {file.name.length > 12
                            ? `${file.name.substring(0, 10)}...${file.name.split('.').pop()}`
                            : file.name}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-right mt-2 text-xs text-[#388697]">
                {files.length} de {MAX_FILES} archivos seleccionados
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selector de emojis */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-20 left-4 z-50 shadow-lg rounded-lg overflow-hidden"
        >
          <Picker
            onEmojiClick={handleEmojiClick}
            theme="dark"
            width="100%"
            height={350}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </form>
  );
};