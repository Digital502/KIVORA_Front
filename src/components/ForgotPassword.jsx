import React, { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCheckCircle, FaEnvelope, FaKey, FaArrowLeft, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { usePassword } from '../shared/hooks/usePassword';
import toast from 'react-hot-toast';
import { validatePassword, validatePasswordMessage, validateEmail, validateEmailMessage } from '../shared/validators';

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

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { 
    sendRecoveryCode, 
    changePassword, 
    verificationCode, 
    loading, 
    error,
    success,
    resetState
  } = usePassword(() => {
    
  });
  
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [showError, setShowError] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Efecto para el contador de reenvío
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setShowError(true);
      return;
    }
    
    try {
      await sendRecoveryCode(email);
      setStep(2);
      setShowError(false);
      setCountdown(60); // 60 segundos para reenvío
    } catch (err) {
      setShowError(true);
      console.error("Error al enviar el código:", err);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    try {
      await sendRecoveryCode(email);
      setCountdown(60);
    } catch (err) {
      toast.error(err.message || 'Error al reenviar el código');
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (!verificationCode || code !== verificationCode.toString()) {
      setShowError(true);
      return;
    }
    
    setStep(3);
    setShowError(false);
  };

  const handlePasswordChange = (value) => {
    setNewPassword(value);
    const validation = validatePassword(value);
    setPasswordValid(validation.isValid);
    
    if (!validation.isValid) {
      setPasswordError(validation.message || validatePasswordMessage);
    } else if (confirmPassword && value !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    const isValid = value === newPassword;
    setConfirmPasswordValid(isValid);
    
    if (!isValid) {
      setPasswordError('Las contraseñas no coinciden');
    } else {
      const validation = validatePassword(newPassword);
      if (!validation.isValid) {
        setPasswordError(validation.message || validatePasswordMessage);
      } else {
        setPasswordError('');
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid || !confirmPasswordValid) {
      setPasswordError(passwordValidation.message || 'Las contraseñas no coinciden');
      return;
    }
    
    try {
      await changePassword({ email, newPassword, verificationCode: code });
      setStep(4);
    } catch (err) {
      setPasswordError(err.message || 'Error al actualizar la contraseña');
    }
  };

  const handleBackToLogin = () => {
    resetState();
    navigate('/login');
  };

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
                <motion.div 
                  className="w-16 h-16 rounded-full bg-[#0D0D0D] border border-[#036873]/30 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {step === 1 && <FaEnvelope className="text-2xl text-[#0B758C]" />}
                  {step === 2 && <FaShieldAlt className="text-2xl text-[#0B758C]" />}
                  {step === 3 && <FaKey className="text-2xl text-[#0B758C]" />}
                  {step === 4 && <FaCheckCircle className="text-2xl text-[#0B758C]" />}
                </motion.div>
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
                {step === 1 && 'Recuperar Contraseña'}
                {step === 2 && 'Verificación Requerida'}
                {step === 3 && 'Nueva Contraseña'}
                {step === 4 && '¡Contraseña Actualizada!'}
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
                {step === 1 && 'Ingresa tu correo institucional para recibir un código de verificación'}
                {step === 2 && `Hemos enviado un código de 6 dígitos a ${email}`}
                {step === 3 && 'Crea una nueva contraseña segura para tu cuenta'}
                {step === 4 && 'Tu contraseña ha sido actualizada exitosamente'}
              </motion.p>
            </motion.div>

            {/* Form content */}
            <div className="space-y-6">
              {step === 1 && (
                <motion.form 
                  onSubmit={handleEmailSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div
                    className="relative"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setIsValidEmail(validateEmail(e.target.value).isValid);
                        setShowError(false);
                      }}
                      placeholder="Correo institucional (@kinal.edu.gt)"
                      className={`w-full bg-[#0D0D0D] text-gray-200 placeholder-[#639FA6]/50 border ${
                        showError ? 'border-red-500' : 'border-[#036873]/50'
                      } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B758C]/50 transition-colors`}
                      required
                      style={{
                        boxShadow: showError ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none'
                      }}
                    />
                    <FaEnvelope className="absolute right-3 top-3.5 text-[#0B758C]" />
                    {showError && (
                      <motion.p 
                        className="text-red-500 text-xs mt-1 font-medium"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {error?.message || validateEmailMessage}
                      </motion.p>
                    )}
                  </motion.div>

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={!isValidEmail || loading}
                      className={`w-full py-3 px-6 rounded-lg font-semibold tracking-wide relative overflow-hidden transition-all flex items-center justify-center gap-2 ${
                        !isValidEmail || loading
                          ? "bg-gray-700 cursor-not-allowed text-gray-400"
                          : "bg-gradient-to-r from-[#036873] to-[#0B758C] text-white hover:from-[#0B758C] hover:to-[#036873]"
                      }`}
                      whileHover={!isValidEmail || loading ? {} : { 
                        scale: 1.01,
                        boxShadow: "0 0 15px rgba(3, 104, 115, 0.3)"
                      }}
                      whileTap={!isValidEmail || loading ? {} : { scale: 0.98 }}
                      animate={{
                        backgroundPosition: loading ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%'
                      }}
                      transition={{
                        duration: loading ? 2 : 0.3,
                        repeat: loading ? Infinity : 0,
                        ease: "linear"
                      }}
                      style={{
                        boxShadow: !isValidEmail || loading ? 'none' : '0 0 10px rgba(3, 104, 115, 0.2)'
                      }}
                    >
                      {loading ? (
                        <motion.span
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          Enviando...
                        </motion.span>
                      ) : (
                        <>
                          <span className="relative z-10">Enviar Código</span>
                          <motion.span
                            className="absolute inset-0  bg-white/10"
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

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="flex items-center justify-center gap-2 text-sm text-[#0B758C] hover:underline transition-colors"
                    >
                      <FaArrowLeft className="w-3 h-3" />
                      Volver al inicio de sesión
                    </button>
                  </div>
                </motion.form>
              )}

              {step === 2 && (
                <motion.form 
                  onSubmit={handleCodeSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div
                    className="relative"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setCode(value);
                          setShowError(false);
                        }}
                        placeholder="Código de verificación"
                        className={`w-full bg-[#0D0D0D] text-gray-200 placeholder-[#639FA6]/50 border ${
                          showError ? 'border-red-500' : 'border-[#036873]/50'
                        } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B758C]/50 text-center tracking-widest font-mono text-xl transition-colors`}
                        required
                        style={{
                          boxShadow: showError ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none'
                        }}
                      />
                      <FaShieldAlt className="absolute right-3 top-3.5 text-[#0B758C]" />
                    </div>
                    {showError && (
                      <motion.p 
                        className="text-red-500 text-xs mt-1 font-medium"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        Código incorrecto. Por favor intenta nuevamente.
                      </motion.p>
                    )}
                  </motion.div>

                  <div className="flex justify-between items-center pt-2">
                    <motion.button
                      type="submit"
                      disabled={code.length !== 6 || loading}
                      className={`w-full py-3 px-6 rounded-lg font-semibold tracking-wide relative overflow-hidden transition-all flex items-center justify-center gap-2 ${
                        code.length !== 6 || loading
                          ? "bg-gray-700 cursor-not-allowed text-gray-400"
                          : "bg-gradient-to-r from-[#036873] to-[#0B758C] text-white hover:from-[#0B758C] hover:to-[#036873]"
                      }`}
                      whileHover={code.length !== 6 || loading ? {} : { 
                        scale: 1.01,
                        boxShadow: "0 0 15px rgba(3, 104, 115, 0.3)"
                      }}
                      whileTap={code.length !== 6 || loading ? {} : { scale: 0.98 }}
                      animate={{
                        backgroundPosition: loading ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%'
                      }}
                      transition={{
                        duration: loading ? 2 : 0.3,
                        repeat: loading ? Infinity : 0,
                        ease: "linear"
                      }}
                      style={{
                        boxShadow: code.length !== 6 || loading ? 'none' : '0 0 10px rgba(3, 104, 115, 0.2)'
                      }}
                    >
                      {loading ? (
                        <motion.span
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          Validando...
                        </motion.span>
                      ) : (
                        <>
                          <span className="relative z-10">Continuar</span>
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

                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={countdown > 0}
                      className={`text-sm ${countdown > 0 ? 'text-gray-500' : 'text-[#0B758C] hover:underline'}`}
                    >
                      {countdown > 0 ? `Reenviar en ${countdown}s` : 'Reenviar código'}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center justify-center gap-2 text-sm text-[#0B758C] hover:underline transition-colors"
                    >
                      <FaArrowLeft className="w-3 h-3" />
                      Cambiar correo electrónico
                    </button>
                  </div>
                </motion.form>
              )}

              {step === 3 && (
                <motion.form 
                  onSubmit={handlePasswordSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div
                    className="relative"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        onBlur={(e) => handlePasswordChange(e.target.value)}
                        placeholder="Nueva contraseña"
                        className={`w-full bg-[#0D0D0D] text-gray-200 placeholder-[#639FA6]/50 border ${
                          passwordError && newPassword ? 'border-red-500' : 'border-[#036873]/50'
                        } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B758C]/50 pr-10 transition-colors`}
                        required
                        style={{
                          boxShadow: passwordError && newPassword ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none'
                        }}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3.5 text-[#0B758C] hover:text-[#058492] transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {passwordError && newPassword && (
                      <motion.p 
                        className="text-red-500 text-xs mt-1 font-medium"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {passwordError}
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
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        onBlur={(e) => handleConfirmPasswordChange(e.target.value)}
                        placeholder="Confirmar nueva contraseña"
                        className={`w-full bg-[#0D0D0D] text-gray-200 placeholder-[#639FA6]/50 border ${
                          passwordError && confirmPassword ? 'border-red-500' : 'border-[#036873]/50'
                        } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B758C]/50 pr-10 transition-colors`}
                        required
                        style={{
                          boxShadow: passwordError && confirmPassword ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none'
                        }}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3.5 text-[#0B758C] hover:text-[#058492] transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </motion.div>

                  <div className="text-xs text-[#639FA6] pl-2">
                    <p className="mb-1">La contraseña debe contener:</p>
                    <ul className="space-y-1">
                      <li className={newPassword.length >= 8 ? 'text-[#0B758C]' : ''}>• Mínimo 8 caracteres</li>
                      <li className={/[a-z]/.test(newPassword) ? 'text-[#0B758C]' : ''}>• Al menos una minúscula</li>
                      <li className={/[A-Z]/.test(newPassword) ? 'text-[#0B758C]' : ''}>• Al menos una mayúscula</li>
                      <li className={/[0-9]/.test(newPassword) ? 'text-[#0B758C]' : ''}>• Al menos un número</li>
                      <li className={/[@$!%*?&]/.test(newPassword) ? 'text-[#0B758C]' : ''}>• Al menos un símbolo (@$!%*?&)</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={loading || !passwordValid || !confirmPasswordValid}
                      className={`w-full py-3 px-6 rounded-lg font-semibold tracking-wide relative overflow-hidden transition-all flex items-center justify-center gap-2 ${
                        loading || !passwordValid || !confirmPasswordValid
                          ? "bg-gray-700 cursor-not-allowed text-gray-400"
                          : "bg-gradient-to-r from-[#036873] to-[#0B758C] text-white hover:from-[#0B758C] hover:to-[#036873]"
                      }`}
                      whileHover={loading || !passwordValid || !confirmPasswordValid ? {} : { 
                        scale: 1.01,
                        boxShadow: "0 0 15px rgba(3, 104, 115, 0.3)"
                      }}
                      whileTap={loading || !passwordValid || !confirmPasswordValid ? {} : { scale: 0.98 }}
                      animate={{
                        backgroundPosition: loading ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%'
                      }}
                      transition={{
                        duration: loading ? 2 : 0.3,
                        repeat: loading ? Infinity : 0,
                        ease: "linear"
                      }}
                      style={{
                        boxShadow: loading || !passwordValid || !confirmPasswordValid ? 'none' : '0 0 10px rgba(3, 104, 115, 0.2)'
                      }}
                    >
                      {loading ? (
                        <motion.span
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          Actualizando...
                        </motion.span>
                      ) : (
                        <>
                          <FaKey className="w-4 h-4" />
                          <span className="relative z-10">Actualizar Contraseña</span>
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

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center justify-center gap-2 text-sm text-[#0B758C] hover:underline transition-colors"
                    >
                      <FaArrowLeft className="w-3 h-3" />
                      Volver a verificar código
                    </button>
                  </div>
                </motion.form>
              )}

              {step === 4 && (
                <motion.div 
                  className="space-y-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div 
                    className="bg-[#0D0D0D] rounded-xl p-6 border border-[#036873]/30 mb-6"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.div
                      className="w-20 h-20 bg-[#0B758C]/10 rounded-full flex items-center justify-center mx-auto mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    >
                      <FaCheckCircle className="text-4xl text-[#0B758C]" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">¡Contraseña Actualizada!</h3>
                    <p className="text-[#639FA6] mb-4">
                      Tu contraseña ha sido cambiada exitosamente.
                    </p>
                    <div className="bg-[#0D0D0D] rounded-lg p-3 border border-[#036873]/20">
                      <p className="text-sm font-medium text-[#0B758C] truncate">
                        {email}
                      </p>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={handleBackToLogin}
                    className="w-full py-3 px-6 rounded-lg font-semibold tracking-wide relative overflow-hidden transition-all bg-gradient-to-r from-[#036873] to-[#0B758C] text-white hover:from-[#0B758C] hover:to-[#036873]"
                    whileHover={{ 
                      scale: 1.01,
                      boxShadow: "0 0 15px rgba(3, 104, 115, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Iniciar sesión
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};