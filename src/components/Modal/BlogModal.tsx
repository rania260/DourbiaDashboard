import { useState } from "react";
import Image from "next/image";
import { Blog } from "../../app/(dashboard)/list/blog/page";

interface BlogModalProps {
  type: "create" | "edit" | "delete";
  id?: string;
  data?: Blog;
  onSuccess: () => void;
}

const BlogModal = ({ type, id, data, onSuccess }: BlogModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: data?.title || "",
    text: data?.text || "",
    image: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("text", formData.text);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (type === "create") {
        response = await fetch("http://localhost:3000/blog", {
          method: "POST",
          body: formDataToSend,
        });
      } else if (type === "edit" && id) {
        formDataToSend.append("id", id);
        response = await fetch(`http://localhost:3000/blog/${id}`, {
          method: "PATCH",
          body: formDataToSend,
        });
      } else if (type === "delete" && id) {
        response = await fetch(`http://localhost:3000/blog/${id}`, {
          method: "DELETE",
        });
      }

      if (response && response.ok) {
        onSuccess();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-md ${
          type === "create"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : type === "edit"
            ? "bg-yellow-500 text-white hover:bg-yellow-600"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {type === "create" && "Nouvel article"}
        {type === "edit" && <Image src="/edit.png" alt="Éditer" width={16} height={16} />}
        {type === "delete" && <Image src="/delete.png" alt="Supprimer" width={16} height={16} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">
                  {type === "create" && "Créer un nouvel article"}
                  {type === "edit" && "Modifier l'article"}
                  {type === "delete" && "Supprimer l'article"}
                </h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>

              {type !== "delete" ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                      <textarea
                        name="text"
                        value={formData.text}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {type === "create" ? "Image" : "Nouvelle image (optionnel)"}
                      </label>
                      <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required={type === "create"}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "En cours..." : type === "create" ? "Créer" : "Modifier"}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="mb-6">Êtes-vous sûr de vouloir supprimer cet article ?</p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "En cours..." : "Supprimer"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogModal;