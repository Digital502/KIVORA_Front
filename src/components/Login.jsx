import React, { useState, useRef, useEffect } from "react";
import { useLogin } from "../shared/hooks/useLogin";
import { validateEmail, validatePassword } from "../shared/validators";
import { motion, useMotionValue } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn } from 'lucide-react';

const BackgroundAnimation = () => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
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

export const Login = () => {
  const { loginUser, isLoading } = useLogin();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const [formState, setFormState] = useState({
    email: { value: "", isValid: false, showError: false, errorMessage: "" },
    password: { value: "", isValid: false, showError: false, errorMessage: "" },
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  const handleInputValueChange = (value, field) => {
    setFormState(prevState => ({
      ...prevState,
      [field]: { ...prevState[field], value },
    }));
  };

  const handleInputValidationOnBlur = (value, field) => {
    let validationResult = { isValid: false, message: "" };
    if (field === "email") validationResult = validateEmail(value);
    if (field === "password") validationResult = validatePassword(value);
    setFormState(prevState => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        isValid: validationResult.isValid,
        showError: !validationResult.isValid,
        errorMessage: validationResult.message,
      },
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    
    try {
      const response = await loginUser(formState.email.value, formState.password.value);
      
      if (response) {
        toast.success("¡Inicio de sesión exitoso!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Error en el inicio de sesión");
    }
  };

  const isSubmitDisabled = isLoading || !formState.email.isValid || !formState.password.isValid;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-200 px-4 py-12 flex flex-col items-center justify-center relative overflow-hidden">

      <BackgroundAnimation />

      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-[#036873]/30 bg-[#0D0D0D]/90 backdrop-blur-sm shadow-lg"
          whileHover={{ 
            boxShadow: "0 0 25px rgba(3, 104, 115, 0.2)",
            borderColor: "#0B758C"
          }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: "0 0 15px rgba(3, 104, 115, 0.15)"
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
          
          <div className="p-8">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-[#0D0D0D] border border-[#036873]/30 flex items-center justify-center shadow-lg">
                    <img src="../../public/logoKivora.png" alt="" />
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
                  textShadow: "0 0 8px rgba(3, 104, 115, 0.3)"
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
                  textShadow: "0 0 4px rgba(3, 104, 115, 0.2)"
                }}
              >
                Donde el futuro se aprende hoy
              </motion.p>
            </motion.div>

            {/* Formulario */}
            <motion.form 
              onSubmit={handleLogin} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {/* Campo de email */}
              <motion.div
                className="relative"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <input
                  name="email"
                  type="email"
                  value={formState.email.value}
                  onChange={(e) => handleInputValueChange(e.target.value, "email")}
                  onBlur={(e) => handleInputValidationOnBlur(e.target.value, "email")}
                  placeholder="Correo institucional (@kinal.edu.gt)"
                  className={`w-full bg-[#0D0D0D] text-gray-200 placeholder-[#639FA6]/50 border ${
                    formState.email.showError ? 'border-red-500' : 'border-[#036873]/50'
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B758C]/50 transition-colors`}
                  required
                  style={{
                    boxShadow: formState.email.showError ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none'
                  }}
                />
                {formState.email.showError && (
                  <motion.p 
                    className="text-red-500 text-xs mt-1 font-medium"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {formState.email.errorMessage}
                  </motion.p>
                )}
              </motion.div>

              {/* Campo de contraseña */}
              <motion.div
                className="relative"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formState.password.value}
                    onChange={(e) => handleInputValueChange(e.target.value, "password")}
                    onBlur={(e) => handleInputValidationOnBlur(e.target.value, "password")}
                    placeholder="Contraseña"
                    className={`w-full bg-[#0D0D0D] text-gray-200 placeholder-[#639FA6]/50 border ${
                      formState.password.showError ? 'border-red-500' : 'border-[#036873]/50'
                    } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B758C]/50 pr-10 transition-colors`}
                    required
                    style={{
                      boxShadow: formState.password.showError ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none'
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
                {formState.password.showError && (
                  <motion.p 
                    className="text-red-500 text-xs mt-1 font-medium"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {formState.password.errorMessage}
                  </motion.p>
                )}
              </motion.div>

              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className={`w-full py-3 px-6 rounded-lg font-semibold tracking-wide relative overflow-hidden transition-all flex items-center justify-center gap-2 ${
                    isSubmitDisabled
                      ? "bg-gray-700 cursor-not-allowed text-gray-400"
                      : "bg-gradient-to-r from-[#036873] to-[#0B758C] text-white hover:from-[#0B758C] hover:to-[#036873]"
                  }`}
                  whileHover={isSubmitDisabled ? {} : { 
                    scale: 1.01,
                    boxShadow: "0 0 15px rgba(3, 104, 115, 0.3)"
                  }}
                  whileTap={isSubmitDisabled ? {} : { scale: 0.98 }}
                  animate={{
                    backgroundPosition: isLoading ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%'
                  }}
                  transition={{
                    duration: isLoading ? 2 : 0.3,
                    repeat: isLoading ? Infinity : 0,
                    ease: "linear"
                  }}
                  style={{
                    boxShadow: isSubmitDisabled ? 'none' : '0 0 10px rgba(3, 104, 115, 0.2)'
                  }}
                >
                  {isLoading ? (
                    <motion.span
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center gap-2"
                    >
                      <span className="relative z-10">Iniciando sesión...</span>
                    </motion.span>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span className="relative z-10">Iniciar sesión</span>
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
              className="text-center mt-6 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p className="text-sm text-[#639FA6]">
                ¿Olvidaste tu contraseña?{" "}
                <Link
                  to="/forgot-password"
                  className="text-[#0B758C] font-medium hover:underline transition-colors"
                >
                  Recupérala aquí
                </Link>
              </p>
              <p className="text-sm text-[#639FA6]">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/register"
                  className="text-[#0B758C] font-medium hover:underline transition-colors"
                >
                  Regístrate ahora
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};