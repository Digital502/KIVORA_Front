import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { generateCodigo, updatePassword } from '../../services';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const usePassword = (onFinish) => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    success: false,
    verificationCode: null,
    email: null,
    countdown: 0
  });

  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
      verificationCode: null,
      email: null,
      countdown: 0
    });
  }, []);

  const startCountdown = useCallback(() => {
    setState(prev => ({ ...prev, countdown: 60 }));
    const timer = setInterval(() => {
      setState(prev => {
        if (prev.countdown <= 1) {
          clearInterval(timer);
          return { ...prev, countdown: 0 };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sendRecoveryCode = useCallback(async (email) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));

    try {
      const response = await generateCodigo({ email });

      if (response.error) {
        throw new Error(response.error);
      }

      setState(prev => ({
        ...prev,
        loading: false,
        success: true,
        verificationCode: response.codigo,
        email
      }));

      startCountdown();

      toast.success(
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 mt-0.5 text-green-500" />
          <div>
            <p className="font-medium">Código enviado</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Revisa tu correo electrónico</p>
          </div>
        </div>,
        {
          className: 'border border-green-200 bg-green-50 dark:bg-gray-800 dark:border-green-800/50',
          position: 'top-right'
        }
      );

      return response.codigo;
    } catch (err) {
      const errorMsg = err.message || "Error al enviar el código de recuperación";
      setState(prev => ({ ...prev, loading: false, error: errorMsg }));

      toast.error(
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
          <div>
            <p className="font-medium">Error al enviar código</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{errorMsg}</p>
          </div>
        </div>,
        {
          className: 'border border-red-200 bg-red-50 dark:bg-gray-800 dark:border-red-800/50',
          position: 'top-right'
        }
      );

      throw err;
    } finally {
      if (onFinish) onFinish();
    }
  }, [onFinish, startCountdown]);

  const changePassword = useCallback(async ({ email, newPassword, verificationCode }) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: false }));

    try {
      if (verificationCode && state.verificationCode) {
        if (verificationCode.toString() !== state.verificationCode.toString()) {
          throw new Error("El código de verificación no coincide");
        }
      }

      const response = await updatePassword({
        email: email || state.email,
        nuevaContraseña: newPassword
      });

      if (!response?.success) {
        throw new Error(response?.message || 'Error al actualizar la contraseña');
      }

      setState(prev => ({
        ...prev,
        loading: false,
        success: true,
        verificationCode: null,
        countdown: 0
      }));

      toast.success(
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 mt-0.5 text-green-500" />
          <div>
            <p className="font-medium">Contraseña actualizada</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Ahora puedes iniciar sesión</p>
          </div>
        </div>,
        {
          className: 'border border-green-200 bg-green-50 dark:bg-gray-800 dark:border-green-800/50',
          position: 'top-right'
        }
      );

      return {
        entityType: response.tipo,
        userData: response.datos,
        email: email || state.email
      };
    } catch (err) {
      const errorMsg = err.message || "Error al actualizar la contraseña";
      setState(prev => ({ ...prev, loading: false, error: errorMsg }));

      toast.error(
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
          <div>
            <p className="font-medium">Error al cambiar contraseña</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{errorMsg}</p>
          </div>
        </div>,
        {
          className: 'border border-red-200 bg-red-50 dark:bg-gray-800 dark:border-red-800/50',
          position: 'top-right'
        }
      );

      throw err;
    } finally {
      if (onFinish) onFinish();
    }
  }, [onFinish, state.email, state.verificationCode]);

  return {
    sendRecoveryCode,
    changePassword,
    resetState,
    verificationCode: state.verificationCode,
    loading: state.loading,
    error: state.error,
    success: state.success,
    email: state.email,
    countdown: state.countdown
  };
};
