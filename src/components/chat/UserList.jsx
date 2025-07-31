import { useState } from "react";

 export default function  UserList ({
  users,
  onSelect,
  searchOptions = [],
  currentUser,
}) {

  const contactos = Array.isArray(users) ? users : users?.contacts || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const filteredSearchOptions = searchOptions.filter((option) => {
    const user = option.user || option;
    
    // Excluir al usuario actual
    if (currentUser && user._id === currentUser) {
      return false;
    }
    
    // Buscar en name, username y email
    const searchContent = `${user.name || ''} ${user.username || ''} ${user.email || ''}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });

  const handleUserSelect = (user) => {
    onSelect(user);
    setSearchTerm("");
    setSelectedUser(user);
    setMessages([]);
  };

  const renderAvatar = (user) => {
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
    <div className="w-full md:w-1/4 bg-[#0D0D0D] border-r border-[#388697] h-screen flex flex-col">
      {/* Search Input */}
      <div className="pt-4 px-4 relative">
        <div className="relative">
          <input
            className="border-2 border-[#388697] bg-[#0D0D0D] w-full h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none text-[#E0E0E0] placeholder-[#388697]"
            type="search"
            name="search"
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-2.5">
            <svg
              className="text-[#5CE1E6] h-5 w-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 56.966 56.966"
            >
              <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="px-4 mt-4">
          <h3 className="text-sm text-[#5CE1E6] mb-2 font-medium">Resultados de búsqueda</h3>
          <ul className="space-y-2">
            {filteredSearchOptions.map((option) => {
              const user = option.user || option;
              return (
                <li
                  key={user._id}
                  className="flex items-center cursor-pointer hover:bg-[#036873]/30 p-2 rounded-md transition-colors"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="w-10 h-10 rounded-full bg-[#036873] mr-3 overflow-hidden">
                    {renderAvatar(user)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#E0E0E0]">
                      {user.name || user.email}
                    </p>
                    <p className="text-[#388697] text-xs">@{user.username}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Lista de Contactos */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <h3 className="text-sm text-[#5CE1E6] mb-3 font-medium">Tus contactos</h3>
        {contactos.length === 0 ? (
          <div className="text-[#388697] italic text-center py-4">No hay contactos aún</div>
        ) : (
          contactos.map((contact) => {
            const user = contact.user || contact;
            return (
              <div
                key={user._id}
                className={`flex items-center mb-3 cursor-pointer p-3 rounded-lg transition-colors ${
                  selectedUser?._id === user._id 
                    ? 'bg-[#036873]' 
                    : 'hover:bg-[#036873]/30'
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="w-12 h-12 bg-[#036873] rounded-full mr-3 overflow-hidden flex-shrink-0">
                  {renderAvatar(user)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[#E0E0E0] font-semibold truncate">
                    {user.name}
                  </h2>
                  <p className="text-[#388697] text-sm truncate">@{user.username}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};