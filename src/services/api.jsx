import axios from 'axios';

const apiClient = axios.create({
    baseURL: "https://kivora-back.onrender.com/kivora/v1/",
    timeout: 3000,
    httpsAgent: false
});

apiClient.interceptors.request.use(
    (config) => {
        const userDetails = localStorage.getItem("user");

        if (userDetails) {
            try {
                const parsedUser = JSON.parse(userDetails);
                if (parsedUser?.token) {
                    config.headers.Authorization = `Bearer ${parsedUser.token}`;
                    console.log("Token agregado al header:", parsedUser.token); 
                }
            } catch (err) {
                console.warn("Error al leer el token:", err);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getClusterNotifications = async (clusterId) => {
  try {
    const response = await apiClient.get(`/notifications/getClusterNotifications/${clusterId}`);
    return response.data; 
  } catch (e) {
    console.error("Error al obtener notificaciones del cluster:", e);
    return { error: true, e };
  }
};


export const calificarEntrega = async ({ taskId, isAccepted, newComment }) => {
  try {
    const response = await apiClient.post('/task/calificar', {
      taskId,
      isAccepted,
      newComment
    });
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const addTask = async (formData) => {
  try {
    const response = await apiClient.post('/task/addTask', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};


export const reassignTask = async (taskId, newUserId) => {
    try {
        const response = await apiClient.put('/task/reassignTask', { taskId, newUserId });
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const markTaskUrgent = async (taskId) => {
    try {
        const response = await apiClient.post('/task/markTaskUrgent', { taskId });
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const setTaskTags = async (taskId, tags) => {
    try {
        const response = await apiClient.post('/task/setTaskTags', { taskId, tags });
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const addTaskAttachments = async (taskId, formData) => {
  try {
    const response = await apiClient.put(`/task/addTaskAttachments/${taskId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    return response.data;
  } catch (e) {
    if (e.response) {
    } else {
    }
    return { error: true, e };
  }
};

export const deleteTaskAttachments = async (taskId, filenames) => {
    try {
        const url = `/task/deleteTaskAttachments/${taskId}`;

        const response = await apiClient.delete(url, {
            data: { filenames }  
        });

        return response.data;
    } catch (e) {
        if (e.response) {
        } else {
        }
        return { error: true, e };
    }
};

export const updateTask = async (taskData) => {
    try {
        const response = await apiClient.put('/task/updateTask', taskData);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};
export const deleteTask = async (taskId) => {
    try {
        const response = await apiClient.delete('/task/deleteTask', {
            data: { id: taskId }
        });
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const register = async (data) => {
    try {
        return await apiClient.post('/auth/register', data)
    } catch (e) {
        return {
            error: true,
            e
        }
    }
}

export const login = async (data) => {
    return await apiClient.post('/auth/login', data);
};

export const getMyUser = async () => {
  try {
    const response = await apiClient.get('/user/getMyUser');
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const updateUser = async (updatedData) => {
  try {
    const response = await apiClient.put('/user/updateUser', updatedData);
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const deleteUser = async () => {
  try {
    const response = await apiClient.delete('/user/deleteUser');
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const changePassword = async (passwords) => {
  try {
    const response = await apiClient.patch('/user/changePassword', passwords);
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const updateProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await apiClient.put("/user/profilePictureUpdate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const crearGrupo = async (formData) => {
    try {
        const response = await apiClient.post('/cluster/crear', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;       
    } catch (e) {
        return {
            error: true,
            message: e.message
        };
    }
};


export const listarGrupos = async (usuario) => {
    try {
      const response = await apiClient.get(`/cluster/listar/${usuario}`);
      return response.data;
    } catch (e) {
      return {
        error: true,
        e
      };
    }
}

    export const agregarIntegrante = async (data) => {
      try {
          const response = await apiClient.post('/cluster/agregar', data);
          return response.data;       
      } catch (e) {
          return {
              error: true,
              message: e.message
          };
      }
  };

export const eliminarIntegrante = async ({grupoId, integrante}) => {
  try {
    const response = await apiClient.delete('/cluster/eliminar', {
      data: { grupoId, integrante }
    });
    return response.data;
  } catch (e) {
    return {
      error: true,
      e
    };
  }
};

export const editarDescripcion = async (grupoId, descripcion) => {
  try {
    console.log("BODY ENVIADO:", { grupoId, descripcion });
    const response = await apiClient.put('/cluster/editar', { grupoId, descripcion });
    return response.data;
  } catch (e) {
    return {
      error: true,
      e
    };
  }
};

export const getUser = async () => {
    try {
      const response = await apiClient.get(`/user/getUser/`);
      return response.data;
    } catch (e) {
      return {
        error: true,
        e
      };
    }
}

export const addProject = async (data) => {
      try {
          const response = await apiClient.post('/project/addProject', data);
          return response.data;       
      } catch (e) {
          return {
              error: true,
              message: e.message
          };
      }
  };

export const buscarGrupoId = async (grupoId) => {
    try {
      const response = await apiClient.get(`/cluster/buscar/${grupoId}`);
      return response.data;
    } catch (e) {
      return {
        error: true,
        e
      };
    }
}

export const listarProyectosGrupo = async (idGroup) => {
  try {
    const response = await apiClient.get(`/project/getProjects/${idGroup}`);
    return response.data; 
  } catch (e) {
    console.error("Error al listar proyectos:", e);
    return { error: true, e };
  }
};

export const obtenerEstadisticasProyecto = async (projectId) => {
  try {
    const response = await apiClient.get(`/project/projectstats/${projectId}`);
    return response.data;
  } catch (e) {
    return {
      error: true,
      message: e.message,
    };
  }
};

export const listarProyectosUsuario = async () => {
  try {
    const response = await apiClient.get("/project/listUserProjects");
    return response.data; 
  } catch (e) {
    return { error: true, e };
  }
};

export const addItemBacklog = async (data) => {
  try {
    const response = await apiClient.post('/backlog/createBacklog', data);
    return response.data;
  }catch(e){
    return{
      error: true,
      message: e.message
    }
  }
}

export const createSprint = async (data) => {
  try {
      const response = await apiClient.post('/sprint/createSprint', data);
      return response.data;       
  } catch (e) {
      return {
          error: true,
          message: e.message
      };
  }
};

export const getSprints = async (projectId) => {
  try {
    const response = await apiClient.get(`/sprint/getSprints/${projectId}`);
    return response.data;
  } catch (e) {
    console.error("Error al listar sprints:", e);
    return { error: true, e };
  }
};

export const updateSprint = async (sprintId, updateData) => {
  try {
    const response = await apiClient.put(`/sprint/updateSprint/${sprintId}`, updateData);
    return response.data;
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
};

export const getBacklogItems = async (projectId) => {
  try {
    const response = await apiClient.get(`/backlog/getBacklogs/${projectId}`);
    return response.data;
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
};

export const updateBacklogItem = async (projectId, backlogId, data) => {
  try {
    const response = await apiClient.put(`/backlog/updateBacklog/${projectId}/${backlogId}`, data);
    return response.data;
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
};

export const deleteBacklogItem = async (projectId, backlogId) => {
  try {
    const response = await apiClient.delete(`/backlog/deleteBacklog/${projectId}/${backlogId}`);
    return response.data;
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
};

export const deleteSprint = async (sprintId) => {
  try {
    const response = await apiClient.delete(`/sprint/deleteSprint/${sprintId}`);
    return response.data;
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
};

export const removeBacklogFromSprint = async (sprintId, backlogId) => {
  try {
    const response = await apiClient.delete(`/sprint/removeBacklogFromSprint/${sprintId}`, { data: { backlogId } });
    return response.data;
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
};

export const addBacklogToSprint = async (sprintId, backlogId) => {
  try {
    const response = await apiClient.post(`/sprint/addBacklogToSprint/${sprintId}`, { backlogId });
    return response.data;
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
};

export const getMyNotifications = async () => {
  try {
    const response = await apiClient.get('/notifications/getMyNotifications');
    return response.data;
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
};

export const getNotificationById = async (notificationId) => {
  try {
    const response = await apiClient.get(`/notifications/getNotificationById/${notificationId}`);
    return response.data;
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
};

export const updateNotificationState = async (notificationId, newState) => {
  try {
    const response = await apiClient.patch(`/notifications/updateNotificationState/${notificationId}`, {
      state: newState
    });
    return response.data;
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
};

export const exportPDFBacklog = async (projectId) => {
  try {
    const response = await apiClient.get(`/backlog/exportBacklogToPDF/${projectId}`,{
      responseType: 'blob', 
    });
    return response.data
  }catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
}

export const addEvent = async (data) => {
  try{
    const response = await apiClient.post(`/event/create`, data)
    return response.data
  }catch (e) {
    return {
      error: true,
      message: e.message
    }
  }
}

export const listEvent = async () =>{
  try{
    const response = await apiClient.get(`event/list`)
    return response.data
  }catch(e){
    return{
      error: true,
      message: e.message
    }
  }
}

export const markAttendance = async (data) => {
  try{
    const response = await apiClient.post('/event/attendance', data);
    return response.data;
  }catch (e) {
    return {
      error: true,
      message: e.message
    }
  }
}

export const updateEvent = async (id, data) => {
  try{
    const response = await apiClient.put(`/event/update/${id}`, data);
    return response.data;
  }catch (e) {
    return {
      error: true,
      message: e.message
    }
  }
}

export const deleteEvent = async (id) => {
  try {
    const response = await apiClient.delete(`/event/delete/${id}`);
    return response.data;
  } catch (e) {
    return {
      error: true,
      message: e.message
    };
  }
}

export const generateCodigo = async (email) => {
    try {
        const response = await apiClient.post('/auth/recuperacion', email);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const updatePassword = async (data) => {
    try {
        const response = await apiClient.put('/user/updatePassword', data);
        return response.data;
    } catch (e) {
        return { error: true, e };
    }
};

export const getUserTasks = async () => {
    try {
        const response = await apiClient.get('/task/listTasksUser');
        return response.data;
    } catch (e) {
        console.error("Error al obtener tareas del usuario:", e);
        return { error: true, e };
    }
};

export const updateTaskState = async (taskId, state) => {
    try {
        const response = await apiClient.put(`/task/updateStateTask/${taskId}`, { state });
        return response.data;
    } catch (e) {
        console.error("Error al actualizar estado de la tarea:", e);
        return { error: true, e };
    }
};

export const checkAuth = async () => {
  try {
    const response = await apiClient.get(`/user/check`);
    return response.data;
  } catch (e) {
    console.error("Error al chequiar al usuario:", e);
    return { error: true, e };
  }
};

export const messageUser = async () => {
  try {
    const response = await apiClient.get(`/message/users`);
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};

export const getMessagesWithUser = async (userId) => {
  try {
    const response = await apiClient.get(`/message/${userId}`);
    return response.data;
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const sendMessageToUser = async (receiverId, formData) => {
  try {
    const response = await apiClient.post(
      `message/send/${receiverId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};


export const getUsersForSidebar = async () => {
  try {
    const response = await apiClient.get(`message/users`);
    return response.data;
  } catch (e) {
    return {
      error: true,
      e,
    };
  }
};

export const getMyContacts = async () => {
  try {
    const response = await apiClient.get("/user/getMyContacts");
    return response.data;
  } catch (e) {
    return { error: true, e };
  }
};