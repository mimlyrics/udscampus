import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import axios from "../api/axios";
import { USERS_URL } from "../routes/serverRoutes";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = useSelector(selectCurrentToken);

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  };

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get(USERS_URL, headers);
      setUsers(data);
      setFiltered(data);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de récupérer les utilisateurs");
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchId.trim().toLowerCase();
    if (!term) return setFiltered(users);

    const results = users.filter((user) =>
      [user.username, user.email, user.phone, user.code]
        .some((field) => field?.toLowerCase().includes(term))
    );

    setFiltered(results);
    setCurrentPage(1); // Reset to first page when searching
  };

  const deleteUser = async (code) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`${USERS_URL}/${code}`, headers);
      setUsers((prev) => prev.filter((u) => u.code !== code));
      setFiltered((prev) => prev.filter((u) => u.code !== code));
    } catch (err) {
      setError("Échec de la suppression de l'utilisateur");
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-300 font-sans text-white">
      <div className="container mx-auto px-4 py-20">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl text-purple-900 sm:text-3xl font-bold font-heading">Tableau de bord des utilisateurs</h1>
          <Link
            to="/admin/user/add"
            className="inline-block rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
          >
            Ajouter un utilisateur
          </Link>
        </header>

        <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Rechercher par code / téléphone / email / nom"
            value={searchId}
            onChange={(e) => {
              setSearchId(e.target.value);
              const term = e.target.value.toLowerCase();
              if (!term) return setFiltered(users);

              const results = users.filter((user) =>
                [user.username, user.email, user.phone, user.code]
                  .some((field) => field?.toLowerCase().includes(term))
              );
              setFiltered(results);
              setCurrentPage(1);
            }}
            className="w-full sm:w-96 rounded-md border border-blue-300 bg-blue-50 px-3 py-2 text-sm text-blue-900 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
          >
            Rechercher
          </button>
          {searchId && (
            <button
              type="button"
              onClick={() => {
                setSearchId("");
                setFiltered(users);
                setCurrentPage(1);
              }}
              className="rounded-md bg-blue-300 px-4 py-2 text-sm font-medium text-blue-900 shadow hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
            >
              Effacer
            </button>
          )}
        </form>

        {error && (
          <p className="mb-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 shadow">{error}</p>
        )}

        {searchId && (
          <p className="mb-4 rounded-md bg-blue-100 px-4 py-2 text-sm text-blue-900 shadow">
            Affichage des résultats filtrés
          </p>
        )}

        {/* Mobile card view */}
        <div className="space-y-4 md:hidden">
          {currentItems.length > 0 ? (
            currentItems.map((user) => (
              <article
                key={user.id}
                className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm text-blue-900"
              >
                <p className="font-medium">
                  <span className="text-blue-600">Nom d'utilisateur:</span> {user.username}
                </p>
                <p className="truncate"><span className="text-blue-600">Email:</span> {user.email}</p>
                <p><span className="text-blue-600">Téléphone:</span> {user.phone}</p>
                <p><span className="text-blue-600">Code:</span> {user.code}</p>

                <div className="mt-3 flex gap-3">
                  <Link
                    to={`/admin/user/edit?userId=${user.code}`}
                    className="flex-1 rounded-md bg-blue-500 px-3 py-2 text-center text-sm font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => deleteUser(user.code)}
                    className="flex-1 rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="text-center py-4 text-blue-100">Aucun utilisateur trouvé</p>
          )}
        </div>

        {/* Desktop table view */}
        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-lg border border-blue-200 bg-blue-50 shadow-sm">
            <table className="min-w-full divide-y divide-blue-200">
              <thead className="bg-blue-100 text-left text-sm font-medium uppercase tracking-wider text-blue-900">
                <tr>
                  <th className="px-6 py-3">Nom d'utilisateur</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Téléphone</th>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-200 text-sm text-blue-900">
                {currentItems.length > 0 ? (
                  currentItems.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-100">
                      <td className="whitespace-nowrap px-6 py-3">{user.username}</td>
                      <td className="whitespace-nowrap px-6 py-3">{user.email}</td>
                      <td className="whitespace-nowrap px-6 py-3">{user.phone}</td>
                      <td className="whitespace-nowrap px-6 py-3">{user.code}</td>
                      <td className="whitespace-nowrap px-6 py-3 text-center">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/admin/user/edit?code=${user.code}`}
                            className="rounded-md bg-blue-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => deleteUser(user.code)}
                            className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-blue-600">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-blue-600 text-white disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                «
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-blue-600 text-white disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                ‹
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-blue-600 text-white disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                ›
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-blue-600 text-white disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                »
              </button>
            </div>
            <p className="mt-2 text-sm text-blue-100">
              Page {currentPage} sur {totalPages} | {filtered.length} utilisateurs
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUser;