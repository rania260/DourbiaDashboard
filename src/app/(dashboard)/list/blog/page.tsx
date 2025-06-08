"use client";

import { useEffect, useState } from "react";
import FormModal from "@/components/Modal/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import ViewBlogModal from "@/components/ViewDetails/ViewBlogModal";

type Blog = {
  id: number;
  title: string;
  author: string;
  category: string;
  thumbnail: string;
  publishedAt: string;
  isPublished: boolean;
};

const columns = [
  { header: "Titre", accessor: "title" },
  { header: "Auteur", accessor: "author", className: "hidden md:table-cell" },
  { header: "Catégorie", accessor: "category", className: "hidden lg:table-cell" },
  { header: "Date de publication", accessor: "publishedAt", className: "hidden md:table-cell" },
  { header: "Statut", accessor: "status" },
  { header: "Actions", accessor: "action" },
];

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchBlogs = async () => {
    try {
      const response = await fetch("http://localhost:8000/blogs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBlogs([...data].sort((a, b) => b.id - a.id));
      }
    } catch (err) {
      console.error("Erreur récupération blogs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const currentBlogs = blogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const renderRow = (blog: Blog) => {
    const status = blog.isPublished ? "Publié" : "Brouillon";

    return (
      <tr key={blog.id} className="border-b even:bg-slate-50 text-sm hover:bg-[#EBF2F6]">
        <td className="flex items-center gap-4 p-4">
          <Image
            src={blog.thumbnail}
            alt=""
            width={50}
            height={50}
            className="w-12 h-12 rounded object-cover"
          />
          <span className="font-semibold">{blog.title}</span>
        </td>
        <td className="hidden md:table-cell">{blog.author}</td>
        <td className="hidden lg:table-cell">{blog.category}</td>
        <td className="hidden md:table-cell">{new Date(blog.publishedAt).toLocaleDateString()}</td>
        <td>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              blog.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        </td>
        <td>
          <div className="flex gap-2">
            <button onClick={() => setSelectedBlog(blog)}>
              <Image src="/view.png" alt="Voir" width={16} height={16} />
            </button>
            <FormModal
              table="blogs"
              type="edit"
              id={blog.id}
              data={blog}
              onSuccess={fetchBlogs}
            />
            <FormModal
              table="blogs"
              type="delete"
              id={blog.id}
              onSuccess={fetchBlogs}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold hidden md:block">Tous les articles</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <TableSearch />
          <FormModal table="blogs" type="create" onSuccess={fetchBlogs} />
        </div>
      </div>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <Table columns={columns} renderRow={renderRow} data={currentBlogs} />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(blogs.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />
      {selectedBlog && (
        <ViewBlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
      )}
    </div>
  );
};

export default BlogList;
