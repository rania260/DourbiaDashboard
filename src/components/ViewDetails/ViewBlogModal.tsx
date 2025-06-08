import Image from "next/image";
import { Blog } from "./BlogsList";

interface ViewBlogModalProps {
  blog: Blog;
  onClose: () => void;
}

const ViewBlogModal = ({ blog, onClose }: ViewBlogModalProps) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{blog.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <div className="mb-6">
            <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
              <Image
                src={`http://localhost:3000/${blog.imagePath}`}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span>Temps de lecture: {blog.readingTime} min</span>
              <span>Publié le: {formatDate(blog.publishDate)}</span>
            </div>

            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{blog.text}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlogModal;