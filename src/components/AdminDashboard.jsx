import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

const AdminDashboard = () => {
  const { projects, setProjects, services, setServices, experience, setExperience } = usePortfolio();
  const [activeTab, setActiveTab] = useState("projects");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");
    if (!auth) {
      window.location.href = "/admin";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    window.location.href = "/";
  };

  const handleProjectChange = (id, field, value) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleServiceChange = (id, field, value) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleExperienceChange = (id, field, value) => {
    setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleAddProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: "New Project",
      description: "Description here...",
      image: "/images/placeholder.png",
      link: "#"
    };
    setProjects([...projects, newProject]);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("Are you sure?")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleAddService = () => {
    const newService = {
      id: (services.length + 1).toString(),
      title: "New Service",
      description: "Service description..."
    };
    setServices([...services, newService]);
  };

  const handleDeleteService = (id) => {
    if (window.confirm("Delete this service?")) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleAddExperience = () => {
    const newExp = {
      id: Date.now(),
      role: "New Role",
      company: "Company Name",
      duration: "Dates",
      description: "Work details...",
      tech: [],
      glow: "from-blue-500 to-purple-500"
    };
    setExperience([...experience, newExp]);
  };

  const handleDeleteExperience = (id) => {
    if (window.confirm("Delete this experience?")) {
      setExperience(experience.filter(e => e.id !== id));
    }
  };

  const renderProjectsAdmin = () => (
    <div className="space-y-8">
      {projects.map(p => (
        <div key={p.id} className="p-6 bg-white/10 rounded-2xl border border-white/20 relative group">
          <button 
            onClick={() => handleDeleteProject(p.id)}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all p-2 bg-black/20 rounded-lg"
            title="Remove Project"
          >
            <Trash2 size={18} />
          </button>
          <input className="w-full bg-transparent text-2xl font-bold text-pink-400 mb-2 outline-none border-b border-pink-500/50 focus:border-pink-500" value={p.title} onChange={(e) => handleProjectChange(p.id, "title", e.target.value)} />
          <textarea className="w-full bg-transparent text-gray-300 mt-2 outline-none border-b border-white/20 focus:border-white h-24" value={p.description} onChange={(e) => handleProjectChange(p.id, "description", e.target.value)} />
          <input className="w-full bg-transparent text-gray-400 mt-2 outline-none border-b border-white/20 focus:border-white" value={p.link} onChange={(e) => handleProjectChange(p.id, "link", e.target.value)} />
        </div>
      ))}
      <button 
        onClick={handleAddProject}
        className="w-full py-4 border-2 border-dashed border-white/20 rounded-2xl text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-all font-bold flex items-center justify-center gap-2"
      >
        <Plus size={20} /> ADD NEW PROJECT
      </button>
    </div>
  );

  const renderServicesAdmin = () => (
    <div className="space-y-8">
      {services.map(s => (
        <div key={s.id} className="p-6 bg-white/10 rounded-2xl border border-white/20 relative group">
          <button 
            onClick={() => handleDeleteService(s.id)}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all p-2 bg-black/20 rounded-lg"
            title="Remove Service"
          >
            <Trash2 size={18} />
          </button>
          <input className="w-full bg-transparent text-2xl font-bold text-purple-400 mb-2 outline-none border-b border-purple-500/50 focus:border-purple-500" value={s.title} onChange={(e) => handleServiceChange(s.id, "title", e.target.value)} />
          <textarea className="w-full bg-transparent text-gray-300 mt-2 outline-none border-b border-white/20 focus:border-white h-24" value={s.description} onChange={(e) => handleServiceChange(s.id, "description", e.target.value)} />
        </div>
      ))}
      <button 
        onClick={handleAddService}
        className="w-full py-4 border-2 border-dashed border-white/20 rounded-2xl text-gray-400 hover:border-purple-500 hover:text-purple-500 transition-all font-bold flex items-center justify-center gap-2"
      >
        <Plus size={20} /> ADD NEW SERVICE
      </button>
    </div>
  );

  const renderExperienceAdmin = () => (
    <div className="space-y-8">
      {experience.map(e => (
        <div key={e.id} className="p-6 bg-white/10 rounded-2xl border border-white/20 relative group">
          <button 
            onClick={() => handleDeleteExperience(e.id)}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all p-2 bg-black/20 rounded-lg"
            title="Remove Experience"
          >
            <Trash2 size={18} />
          </button>
          <input className="w-full bg-transparent text-2xl font-bold text-orange-400 mb-2 outline-none border-b border-orange-500/50 focus:border-orange-500" value={e.role} onChange={(evt) => handleExperienceChange(e.id, "role", evt.target.value)} />
          <div className="flex gap-4">
            <input className="w-1/2 bg-transparent text-white font-bold outline-none border-b border-white/20 focus:border-white" value={e.company} onChange={(evt) => handleExperienceChange(e.id, "company", evt.target.value)} />
            <input className="w-1/2 bg-transparent text-gray-400 outline-none border-b border-white/20 focus:border-white" value={e.duration} onChange={(evt) => handleExperienceChange(e.id, "duration", evt.target.value)} />
          </div>
          <textarea className="w-full bg-transparent text-gray-300 mt-4 outline-none border-b border-white/20 focus:border-white h-24" value={e.description} onChange={(evt) => handleExperienceChange(e.id, "description", evt.target.value)} />
        </div>
      ))}
      <button 
        onClick={handleAddExperience}
        className="w-full py-4 border-2 border-dashed border-white/20 rounded-2xl text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-all font-bold flex items-center justify-center gap-2"
      >
        <Plus size={20} /> ADD NEW EXPERIENCE
      </button>
    </div>
  );

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus("Saving to MongoDB...");
    const password = localStorage.getItem("admin-password"); // We'll save this on login

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: password,
          content: { projects, services, experience }
        })
      });

      const data = await res.json();
      if (data.success) {
        setSaveStatus("Changes saved live! 🚀");
        setTimeout(() => setSaveStatus(""), 3000);
      } else {
        setSaveStatus("Error: " + (data.details || data.error));
      }
    } catch (err) {
      setSaveStatus("Network error ❌ Check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-pink-600/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500">
              Admin Dashboard
            </h1>
            {saveStatus && <p className="text-pink-400 font-mono text-sm mt-2">{saveStatus}</p>}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              SAVE LIVE
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-white/10 hover:bg-red-500/80 rounded-full font-bold transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {["projects", "services", "experience"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-bold capitalize transition-all ${activeTab === tab ? "bg-white text-black" : "bg-white/10 hover:bg-white/20"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "projects" && renderProjectsAdmin()}
          {activeTab === "services" && renderServicesAdmin()}
          {activeTab === "experience" && renderExperienceAdmin()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
