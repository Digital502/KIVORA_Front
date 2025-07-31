import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMyUser } from '../../services/api';

export const useProjectView = (proyecto) => {
  const { id: projectId } = useParams();
  const [isScrumMaster, setIsScrumMaster] = useState(false);
  const [isProductOwner, setIsProductOwner] = useState(false);
  const [myUser, setMyUser] = useState(null); 

  useEffect(() => {
    const fetchAndCompare = async () => {
      try {
        const response = await getMyUser();

        if (!response.error) {
          const user = response.services[0];
          setMyUser(user); 
          
          if (proyecto?.scrumMaster?._id) {
            setIsScrumMaster(user._id === proyecto.scrumMaster._id);
          }
          if (proyecto?.productOwner?._id) {
            setIsProductOwner(user._id === proyecto.productOwner._id);
          }
        }
      } catch (err) {
        console.error("Error verificando roles del usuario:", err);
      }
    };

    if (proyecto) fetchAndCompare();
  }, [proyecto]);

  return { isScrumMaster, isProductOwner, projectId, myUser }; 
};
