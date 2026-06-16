import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePortfolio } from "../context/PortfolioContext";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

const AdminDashboard = () => {
  const { 
    projects, setProjects, 
    services, setServices, 
    experience, setExperience,
    maintenanceMode, setMaintenanceMode,
    visitorCount,
    socialLinks, setSocialLinks,
    has2FA,
    notifications, setNotifications,
    trackEvent
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState("projects");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [setup2FAData, setSetup2FAData] = useState(null);

  // Recruiter Analytics & Image Upload States
  const [activityLogs, setActivityLogs] = useState([]);
  const [uploadingProjectId, setUploadingProjectId] = useState(null);
  const [uploadError, setUploadError] = useState("");

  // INACTIVITY TIMER (5 Minutes)
  useEffect(() => {
    let timeout;
    
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleLogout();
        alert("Logged out due to inactivity 🔒");
      }, 5 * 60 * 1000); // 5 Minutes
    };

    const auth = localStorage.getItem("admin-auth");
    if (!auth) {
      window.location.href = "/admin";
    } else {
      resetTimer();
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("click", resetTimer);
    }

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, []);

  // Fetch Messages or Activity Log when tab is active
  useEffect(() => {
    if (activeTab === "messages") {
      fetchMessages();
    }
    if (activeTab === "activity") {
      fetchActivityLogs();
    }
  }, [activeTab]);

  const fetchMessages = async () => {
    const password = localStorage.getItem("admin-password");
    try {
      const res = await fetch('/api/messages', {
        headers: { password }
      });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages");
    }
  };

  const fetchActivityLogs = async () => {
    const password = localStorage.getItem("admin-password");
    try {
      const res = await fetch('/api/analytics', {
        headers: { password }
      });
      const data = await res.json();
      if (Array.isArray(data)) setActivityLogs(data);
    } catch (err) {
      console.error("Failed to fetch activity logs", err);
    }
  };

  // HTML Canvas Image Compression Helper (aims for <200KB WebP/JPEG)
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const max_size = 1200; // max width/height in px
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG at 75% quality
          const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageUpload = async (projectId, file) => {
    if (!file) return;
    setUploadingProjectId(projectId);
    setUploadError("");
    
    try {
      const base64Image = await compressImage(file);
      const password = localStorage.getItem("admin-password");
      
      const res = await fetch("/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          password
        },
        body: JSON.stringify({
          image: base64Image,
          fileName: file.name
        })
      });
      
      const data = await res.json();
      if (data.success) {
        handleProjectChange(projectId, "image", data.url);
      } else {
        setUploadError(data.error || "Upload failed");
      }
    } catch (err) {
      setUploadError("Error compressing/uploading image");
      console.error(err);
    } finally {
      setUploadingProjectId(null);
    }
  };

  const handleTestWebhook = async () => {
    setSaveStatus("Sending simulation event...");
    try {
      await trackEvent('portfolio_visit', { ref: 'DashboardTestWebhook' });
      setSaveStatus("Simulation event sent! Check Discord/Telegram. 🚀");
      setTimeout(() => setSaveStatus(""), 4000);
    } catch (err) {
      setSaveStatus("Failed to send simulation event.");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    const password = localStorage.getItem("admin-password");
    try {
      await fetch(`/api/messages?id=${id}`, {
        method: 'DELETE',
        headers: { password }
      });
      setMessages(messages.filter(m => m._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    localStorage.removeItem("admin-password");
    window.location.href = "/admin";
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

  const handleSocialChange = (field, value) => {
    setSocialLinks({ ...socialLinks, [field]: value });
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
          <input className="w-full bg-transparent text-2xl font-bold text-pink-400 mb-2 outline-none border-b border-pink-500/50 focus:border-pink-500" placeholder="Project Title" value={p.title} onChange={(e) => handleProjectChange(p.id, "title", e.target.value)} />
          <textarea className="w-full bg-transparent text-gray-300 mt-2 outline-none border-b border-white/20 focus:border-white h-20" placeholder="Description" value={p.description} onChange={(e) => handleProjectChange(p.id, "description", e.target.value)} />
          
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Project Image</label>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex-shrink-0 flex items-center justify-center">
                  {p.image ? (
                    <img src={p.image} alt="preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = '/images/placeholder.png'; }} />
                  ) : (
                    <span className="text-xs text-gray-500">No img</span>
                  )}
                </div>
                
                <input 
                  className="flex-1 bg-transparent text-gray-400 outline-none border-b border-white/20 focus:border-white text-sm" 
                  value={p.image} 
                  onChange={(e) => handleProjectChange(p.id, "image", e.target.value)} 
                  placeholder="/images/placeholder.png or Uploaded URL"
                />
                
                <label className="cursor-pointer px-4 py-1.5 bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-400 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap">
                  {uploadingProjectId === p.id ? (
                    <>
                      <Loader2 className="animate-spin" size={12} /> Uploading...
                    </>
                  ) : (
                    <>
                      <Plus size={12} /> Upload File
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    disabled={uploadingProjectId !== null}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(p.id, e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
              {uploadError && uploadingProjectId === p.id && (
                <p className="text-red-400 text-[10px] mt-1">{uploadError}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Project Link</label>
              <input className="w-full bg-transparent text-gray-400 outline-none border-b border-white/20 focus:border-white text-sm" value={p.link} onChange={(e) => handleProjectChange(p.id, "link", e.target.value)} />
            </div>
          </div>
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
          <input className="w-full bg-transparent text-2xl font-bold text-orange-400 mb-2 outline-none border-b border-orange-500/50 focus:border-orange-500" placeholder="Role Name" value={e.role} onChange={(evt) => handleExperienceChange(e.id, "role", evt.target.value)} />
          <div className="flex gap-4">
            <input className="w-1/2 bg-transparent text-white font-bold outline-none border-b border-white/20 focus:border-white" placeholder="Company" value={e.company} onChange={(evt) => handleExperienceChange(e.id, "company", evt.target.value)} />
            <input className="w-1/2 bg-transparent text-gray-400 outline-none border-b border-white/20 focus:border-white" placeholder="Duration" value={e.duration} onChange={(evt) => handleExperienceChange(e.id, "duration", evt.target.value)} />
          </div>
          <textarea className="w-full bg-transparent text-gray-300 mt-4 outline-none border-b border-white/20 focus:border-white h-20" placeholder="Job Description" value={e.description} onChange={(evt) => handleExperienceChange(e.id, "description", evt.target.value)} />
          
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Tech Stack (comma separated)</label>
              <input 
                className="w-full bg-transparent text-blue-400 outline-none border-b border-white/20 focus:border-white text-sm" 
                value={e.tech.join(", ")} 
                onChange={(evt) => handleExperienceChange(e.id, "tech", evt.target.value.split(",").map(t => t.trim()))} 
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold">Glow Gradient (Tailwind Class)</label>
              <input 
                className="w-full bg-transparent text-gray-400 outline-none border-b border-white/20 focus:border-white text-sm" 
                value={e.glow} 
                onChange={(evt) => handleExperienceChange(e.id, "glow", evt.target.value)} 
              />
            </div>
          </div>
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

  const renderMessagesAdmin = () => (
    <div className="space-y-6">
      {messages.length === 0 && <p className="text-gray-500 italic">No messages yet...</p>}
      {messages.map(m => (
        <div key={m._id} className="p-6 bg-white/10 rounded-2xl border border-white/20 relative group">
          <button 
            onClick={() => deleteMessage(m._id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-400 p-2 bg-black/20 rounded-lg"
          >
            <Trash2 size={18} />
          </button>
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-pink-400">{m.name}</h3>
              <p className="text-sm text-purple-400">{m.email}</p>
            </div>
            <p className="text-[10px] text-gray-500 uppercase mt-2 md:mt-0">
              {new Date(m.createdAt).toLocaleString()}
            </p>
          </div>
          <p className="text-gray-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
            {m.message}
          </p>
        </div>
      ))}
    </div>
  );

  const renderActivityAdmin = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-pink-400">📊 Recent Recruiter & Visitor Activity</h2>
        <button 
          onClick={fetchActivityLogs}
          className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold transition-all"
        >
          Refresh
        </button>
      </div>
      
      {activityLogs.length === 0 && <p className="text-gray-500 italic">No activity logged yet...</p>}
      
      {activityLogs.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
          <table className="w-full border-collapse text-left text-sm text-gray-300">
            <thead className="bg-white/10 text-white font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Time</th>
                <th className="p-4">Event</th>
                <th className="p-4">Company/ISP</th>
                <th className="p-4">Location</th>
                <th className="p-4">Ref/Source</th>
                <th className="p-4">Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activityLogs.map((log) => {
                let eventLabel = log.event;
                let eventBadge = "bg-white/10 text-white";
                if (log.event === 'portfolio_visit') {
                  eventLabel = '🚀 Visit';
                  eventBadge = "bg-pink-500/20 text-pink-400 border border-pink-500/30";
                } else if (log.event === 'resume_view') {
                  eventLabel = '📄 Resume Open';
                  eventBadge = "bg-purple-500/20 text-purple-400 border border-purple-500/30";
                } else if (log.event === 'resume_view_duration') {
                  eventLabel = `⏱️ Resume Read (${log.metadata?.duration}s)`;
                  eventBadge = "bg-blue-500/20 text-blue-400 border border-blue-500/30";
                } else if (log.event === 'resume_download') {
                  eventLabel = '💾 Resume Download';
                  eventBadge = "bg-orange-500/20 text-orange-400 border border-orange-500/30";
                }

                const flag = log.location?.flag || "🌐";
                const city = log.location?.city || "Unknown";
                const country = log.location?.country || "Unknown";
                
                const os = log.device?.os || "Unknown";
                const browser = log.device?.browser || "Unknown";
                const deviceIcon = os.toLowerCase().includes('iphone') || os.toLowerCase().includes('android') ? "📱" : "💻";

                return (
                  <tr key={log._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-xs whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${eventBadge}`}>
                        {eventLabel}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {log.company}
                    </td>
                    <td className="p-4">
                      <span className="mr-1">{flag}</span> {city}, {country}
                    </td>
                    <td className="p-4 font-mono text-xs text-pink-400">
                      {log.metadata?.ref || log.metadata?.source || <span className="text-gray-600">direct</span>}
                    </td>
                    <td className="p-4 text-xs whitespace-nowrap">
                      <span className="mr-1">{deviceIcon}</span> {os} / {browser}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderSettingsAdmin = () => (
    <div className="space-y-12">
      {/* Analytics */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-orange-400 flex items-center gap-2">
          📈 Visitor Analytics
        </h2>
        <div className="p-8 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-3xl border border-white/20">
          <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">Total Page Views</p>
          <p className="text-6xl font-black text-white mt-2 font-mono">{visitorCount}</p>
        </div>
      </section>

      {/* Maintenance Mode */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-pink-400 flex items-center gap-2">
          🚧 Maintenance Mode
        </h2>
        <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
          <button 
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`w-14 h-8 rounded-full relative transition-all duration-300 ${maintenanceMode ? "bg-pink-500" : "bg-gray-700"}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${maintenanceMode ? "left-7" : "left-1"}`}></div>
          </button>
          <span className="font-bold text-lg">
            {maintenanceMode ? "Active (Visitors see Maintenance Screen)" : "Inactive (Public access)"}
          </span>
        </div>
      </section>

      {/* Social Links */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-purple-400">🔗 Social Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/10">
          {Object.keys(socialLinks).map(key => (
            <div key={key}>
              <label className="text-[10px] text-gray-500 uppercase font-bold capitalize">{key}</label>
              <input 
                className="w-full bg-transparent text-white outline-none border-b border-white/20 focus:border-purple-500 py-2"
                value={socialLinks[key]}
                onChange={(e) => handleSocialChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-red-400">🔒 Security</h2>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-6">
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold">Change Admin Password</label>
            <input 
              type="password"
              placeholder="Enter new password (leave blank to keep current)"
              className="w-full bg-transparent text-white outline-none border-b border-white/20 focus:border-red-500 py-2 mt-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="pt-6 border-t border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              Two-Factor Authentication (2FA)
              {has2FA && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">Active</span>}
            </h3>

            {!has2FA ? (
              <div className="space-y-4">
                {!setup2FAData ? (
                  <button 
                    onClick={async () => {
                      try {
                        const pass = localStorage.getItem("admin-password");
                        const res = await fetch('/api/2fa', { headers: { password: pass } });
                        if (!res.ok) {
                          const errData = await res.json();
                          throw new Error(errData.error || "Failed to start setup");
                        }
                        const data = await res.json();
                        setSetup2FAData(data);
                      } catch (err) {
                        alert("Error: " + err.message + "\n\nMake sure you are running with 'vercel dev' or testing on the live site!");
                        console.error(err);
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl text-sm font-bold transition-all"
                  >
                    Setup Google Authenticator
                  </button>
                ) : (
                  <div className="bg-white p-6 rounded-2xl flex flex-col items-center gap-4 max-w-xs mx-auto">
                    <img src={setup2FAData.qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                    <p className="text-black text-xs font-mono break-all text-center">{setup2FAData.secret}</p>
                    <div className="w-full">
                      <input 
                        type="text" 
                        placeholder="Enter 6-digit code" 
                        maxLength="6"
                        className="w-full p-2 border-2 border-purple-500 rounded-lg text-black text-center font-bold"
                        onChange={async (e) => {
                          if (e.target.value.length === 6) {
                            const res = await fetch('/api/2fa', {
                              method: 'POST',
                              headers: { 
                                'Content-Type': 'application/json',
                                password: localStorage.getItem("admin-password")
                              },
                              body: JSON.stringify({ secret: setup2FAData.secret, code: e.target.value })
                            });
                            if (res.ok) {
                              localStorage.setItem("admin-2fa", e.target.value);
                              window.location.reload();
                            } else {
                              alert("Invalid code. Try again.");
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={async () => {
                  if (window.confirm("Disable 2FA? This makes your account less secure.")) {
                    await fetch('/api/2fa', { 
                      method: 'DELETE',
                      headers: { password: localStorage.getItem("admin-password") }
                    });
                    localStorage.removeItem("admin-2fa");
                    window.location.reload();
                  }
                }}
                className="bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
              >
                Disable 2FA
              </button>
            )}
          </div>
          
          <p className="text-[10px] text-gray-500 italic">
            *Once updated, your .env password will only work as a fallback if the DB is reset.
          </p>
        </div>
      </section>

      {/* Recruiter Alerts Settings */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-pink-400 flex items-center gap-2">
          🔔 Recruiter Activity Alerts
        </h2>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Discord Integration</h3>
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold">Discord Webhook URL</label>
                <input 
                  type="text" 
                  placeholder="https://discord.com/api/webhooks/..." 
                  className="w-full bg-transparent text-white outline-none border-b border-white/20 focus:border-pink-500 py-2 mt-1"
                  value={notifications.discordWebhookUrl || ""}
                  onChange={(e) => setNotifications({ ...notifications, discordWebhookUrl: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Telegram Integration</h3>
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold">Bot Token</label>
                <input 
                  type="password" 
                  placeholder="123456789:ABCdefGhI..." 
                  className="w-full bg-transparent text-white outline-none border-b border-white/20 focus:border-pink-500 py-2 mt-1"
                  value={notifications.telegramBotToken || ""}
                  onChange={(e) => setNotifications({ ...notifications, telegramBotToken: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold">Chat ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. -10012345678 or 98765432" 
                  className="w-full bg-transparent text-white outline-none border-b border-white/20 focus:border-pink-500 py-2 mt-1"
                  value={notifications.telegramChatId || ""}
                  onChange={(e) => setNotifications({ ...notifications, telegramChatId: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-[10px] text-gray-500 italic max-w-md">
              *Webhook tokens are stored securely in MongoDB and are never exposed on your public portfolio page.
            </p>
            <button 
              onClick={handleTestWebhook}
              className="px-5 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded-xl font-bold text-xs transition-all shrink-0"
            >
              Test Notification Webhook 🚀
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus("Saving to MongoDB...");
    const password = localStorage.getItem("admin-password");
    let twoFactorCode = null;

    // If 2FA is enabled, always require a fresh code for any update
    if (has2FA) {
      twoFactorCode = prompt("Enter fresh 6-digit 2FA code to authorize changes:");
      if (!twoFactorCode) {
        setIsSaving(false);
        setSaveStatus("Save cancelled: 2FA code required.");
        return;
      }
    }

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: password,
          twoFactorCode: twoFactorCode,
          content: { 
            projects, 
            services, 
            experience,
            maintenanceMode,
            socialLinks,
            notifications,
            ...(newPassword && { adminPassword: newPassword })
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setSaveStatus("Changes saved live! 🚀");
        if (newPassword) {
          localStorage.setItem("admin-password", newPassword);
          setNewPassword("");
        }
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
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
          {["projects", "services", "experience", "messages", "activity", "settings"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-bold capitalize transition-all text-sm md:text-base ${activeTab === tab ? "bg-white text-black" : "bg-white/10 hover:bg-white/20"}`}
            >
              {tab === "messages" && messages.length > 0 ? `Inbox (${messages.length})` : tab === "activity" ? `Activity Log 📊` : tab}
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
          {activeTab === "messages" && renderMessagesAdmin()}
          {activeTab === "activity" && renderActivityAdmin()}
          {activeTab === "settings" && renderSettingsAdmin()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
