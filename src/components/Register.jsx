import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { 
    validateEmail,
    validateEmailMessage,
    validateName,
    validateNameMessage,
    validatePassword,
    validatePasswordMessage,
    validateNumber,
    validateNumberMessage,
    validateUsername,
    validateUsernameMessage
} from "../shared/validators"; 
import { useRegister } from "../shared/hooks/useRegister";
import toast from "react-hot-toast";
import { UserPlus } from 'lucide-react';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;
    
    if (pass.length >= 5) strength += 20;
    if (pass.length >= 8) strength += 20;
    if (/[A-Z]/.test(pass)) strength += 20;
    if (/\d/.test(pass)) strength += 20;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 20;
    
    return Math.min(100, strength);
  };

  const strength = calculateStrength(password);
  const color = strength < 40 ? "#ff4d4d" : 
                strength < 70 ? "#ffa64d" : 
                strength < 90 ? "#0B758C" : "#036873";

  return (
    <div className="mt-2">
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 0.5 }}
          className="h-full"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}`
          }}
        />
      </div>
      <p className="text-xs mt-1 text-right font-medium" style={{ 
        color,
        textShadow: `0 0 2px ${color}`
      }}>
        {strength < 40 ? "Débil" : 
         strength < 70 ? "Moderada" : 
         strength < 90 ? "Fuerte" : "Muy fuerte"}
      </p>
    </div>
  );
};

// Componente separado para las animaciones de fondo
const BackgroundAnimation = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generar las partículas solo una vez al montar el componente
    const initialParticles = [...Array(15)].map(() => ({
      width: Math.random() * 300 + 100,
      height: Math.random() * 300 + 100,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      x: [0, Math.random() * 100 - 50],
      y: [0, Math.random() * 100 - 50],
      rotate: [0, 360],
      duration: Math.random() * 30 + 20
    }));
    setParticles(initialParticles);

    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#036873]/20"
            style={{
              width: particle.width,
              height: particle.height,
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              x: particle.x,
              y: particle.y,
              rotate: particle.rotate,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      <motion.div
        className="fixed pointer-events-none rounded-full mix-blend-multiply"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(3, 104, 115, 0.1) 0%, transparent 70%)',
          x: cursorX,
          y: cursorY,
          zIndex: 0
        }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  );
};

export const Register = ({ switchAuthHandler }) => {
  const { registerUser, isLoading } = useRegister();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    phone: ""
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    surname: false,
    username: false,
    email: false,
    password: false,
    phone: false
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'email') {
      setFormErrors(prev => ({ ...prev, email: !validateEmail(value) }));
    } else if (name === 'name' || name === 'surname') {
      setFormErrors(prev => ({ ...prev, [name]: !validateName(value) }));
    } else if(name === 'username'){
      setFormErrors(prev => ({ ...prev, username: !validateUsername(value) }));
    } else if (name === 'password') {
      setFormErrors(prev => ({ ...prev, password: !validatePassword(value) }));
    } else if (name === 'phone') {
      setFormErrors(prev => ({ ...prev, phone: !validateNumber(value) }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast.error("La imagen debe ser menor a 2MB");
    }
  };

  const handleRemoveImage = () => {
    setProfilePicture(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const errors = {
      name: !validateName(formData.name),
      surname: !validateName(formData.surname),
      username: !validateUsername(formData.username),
      email: !validateEmail(formData.email),
      password: !validatePassword(formData.password),
      phone: !validateNumber(formData.phone)
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      const response = await registerUser(formDataToSend);
      
      if (response) {
        toast.success("¡Registro exitoso!");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message || "Error en el registro");
    }
  };

  const isFormValid = () => {
    return (
      validateName(formData.name) &&
      validateName(formData.surname) &&
      validateUsername(formData.username) &&
      validateEmail(formData.email) &&
      validatePassword(formData.password) &&
      validateNumber(formData.phone)
    );
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-200 px-4 py-8 flex flex-col items-center justify-center relative overflow-hidden">
      <BackgroundAnimation />

      
      <motion.div
        className="fixed pointer-events-none rounded-full mix-blend-multiply"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(3, 104, 115, 0.1) 0%, transparent 70%)',
          x: cursorX,
          y: cursorY,
          zIndex: 0
        }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        ref={formRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl mx-auto" 
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-[#036873]/30 bg-[#0D0D0D]/90 backdrop-blur-sm shadow-lg"
          whileHover={{ 
            boxShadow: "0 0 25px rgba(11, 117, 140, 0.2)",
            borderColor: "#0B758C"
          }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: "0 0 15px rgba(11, 117, 140, 0.15)"
          }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#036873] via-[#0B758C] to-[#639FA6]"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              height: "2px",
              boxShadow: "0 0 6px rgba(99, 159, 166, 0.5)"
            }}
          />
          
          <div className="p-6"> 
            <motion.div 
              className="text-center mb-6" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#0D0D0D] border border-[#036873]/30 flex items-center justify-center shadow-lg"> 
                    <img src="../../public/logoKivora.png" alt="" className="w-10 h-10" /> 
                </div>
              </div>
              <motion.h1 
                className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#036873] to-[#0B758C]" 
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  textShadow: "0 0 8px rgba(11, 117, 140, 0.3)"
                }}
              >
                Kivora
              </motion.h1>
              <motion.p 
                className="text-lg text-[#639FA6]" 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  textShadow: "0 0 4px rgba(11, 117, 140, 0.2)"
                }}
              >
                Donde el futuro se aprende hoy
              </motion.p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                {['name', 'surname', 'username', 'email'].map((field) => (
                  <motion.div 
                    key={field}
                    className="relative"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <input
                      name={field}
                      type={field === 'email' ? 'email' : 'text'}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={
                        field === 'name' ? 'Nombre' : 
                        field === 'surname' ? 'Apellido' : 
                        field === 'username' ? 'Nombre de usuario' : 
                        'Correo (@kinal.edu.gt)'
                      }
                      className="w-full bg-[#0D0D0D] text-gray-200 placeholder-[#639FA6]/50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B758C]/50 transition-colors"
                      required
                      style={{
                        borderColor: formErrors[field] ? '#ef4444' : '#0B758C/50',
                        boxShadow: formErrors[field] ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none'
                      }}
                    />
                    {formErrors[field] && (
                      <motion.p 
                        className="text-red-500 text-xs mt-1 font-medium"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {
                          field === 'email' 
                            ? validateEmailMessage 
                            : field === 'username' 
                              ? validateUsernameMessage 
                              : validateNameMessage
                        }
                      </motion.p>
                    )}
                  </motion.div>
                ))}

                <motion.div
                  className="relative"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Teléfono"
                    className="w-full bg-[#0D0D0D] text-gray-200 placeholder-[#639FA6]/50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B758C]/50 transition-colors"
                    required
                    style={{
                      borderColor: formErrors.phone ? '#ef4444' : '#0B758C/50',
                      boxShadow: formErrors.phone ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none'
                    }}
                  />
                  {formErrors.phone && (
                    <motion.p 
                      className="text-red-500 text-xs mt-1 font-medium"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {validateNumberMessage}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  className="relative"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Contraseña"
                      className="w-full bg-[#0D0D0D] text-gray-200 placeholder-[#639FA6]/50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B758C]/50 pr-12 transition-colors"
                      required
                      style={{
                        borderColor: formErrors.password ? '#ef4444' : '#0B758C/50',
                        boxShadow: formErrors.password ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#639FA6] hover:text-[#0B758C] transition-colors"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <PasswordStrengthIndicator password={formData.password} />
                  )}
                  {formErrors.password && (
                    <motion.p 
                      className="text-red-500 text-xs mt-1 font-medium"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {validatePasswordMessage}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  className="md:col-span-2 pt-2" 
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-sm font-medium text-[#639FA6] mb-2"> 
                    Foto de perfil
                  </label>
                  
                  <AnimatePresence>
                    {previewImage ? (
                      <motion.div
                        className="relative mb-3 flex justify-center" 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <motion.img 
                          src={previewImage} 
                          alt="Vista previa" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-[#0B758C] shadow-md" 
                          whileHover={{ scale: 1.03 }}
                          style={{
                            boxShadow: '0 0 10px rgba(11, 117, 140, 0.3)'
                          }}
                        />
                        <motion.button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-0 right-1/4 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          style={{
                            boxShadow: '0 0 5px rgba(239, 68, 68, 0.5)'
                          }}
                        >
                          ×
                        </motion.button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                  
                  <motion.div
                    className="relative"
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-[#0B758C] opacity-0 absolute z-10 cursor-pointer h-10" 
                    />
                    <div className="w-full bg-[#0D0D0D] text-[#639FA6] border-2 border-[#0B758C]/50 rounded-lg px-4 py-3 flex items-center justify-center text-sm hover:bg-[#0B758C]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">Seleccionar imagen</span> 
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              <div className="pt-4"> 
                <motion.button
                  type="submit"
                  disabled={!isFormValid() || isLoading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold tracking-wide relative overflow-hidden transition-all flex items-center justify-center gap-2 text-base ${
                    !isFormValid() || isLoading
                      ? "bg-gray-700 cursor-not-allowed text-gray-400"
                      : "bg-gradient-to-r from-[#036873] to-[#0B758C] text-white"
                  }`}
                  whileHover={!isFormValid() || isLoading ? {} : { 
                    scale: 1.01,
                    boxShadow: "0 0 15px rgba(11, 117, 140, 0.3)"
                  }}
                  whileTap={!isFormValid() || isLoading ? {} : { scale: 0.98 }}
                  animate={{
                    backgroundPosition: isLoading ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%'
                  }}
                  transition={{
                    duration: isLoading ? 2 : 0.3,
                    repeat: isLoading ? Infinity : 0,
                    ease: "linear"
                  }}
                  style={{
                    boxShadow: !isFormValid() || isLoading ? 'none' : '0 0 12px rgba(11, 117, 140, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <motion.span
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center gap-2"
                    >
                      <span className="relative z-10">Registrando...</span>
                    </motion.span>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" /> 
                      <span className="relative z-10">Registrarse</span>
                      <motion.span
                        className="absolute inset-0 bg-white/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.1, 0] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity
                        }}
                      />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>

            <motion.div 
              className="text-center mt-6" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm text-[#639FA6]"> 
                ¿Ya tienes una cuenta?{" "}
                <button
                  onClick={switchAuthHandler}
                  className="text-[#0B758C] font-medium hover:underline transition-colors"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};