import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Selector from "../components/Selector.jsx";
import MonacoEditor from "../components/MonacoEditor.jsx";
import Output from "../components/Output.jsx";
import EditorSidebar from "../components/EditorSidebar.jsx";
import { API_URL } from "../config/api.js";
import "../styles/Editor.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Editor({ user, theme, toggleTheme }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [htmlcode, sethtmlcode] = useState("<h1>Hello World!</h1>");
  const [csscode, setcsscode] = useState("h1{color:#00ff00}");
  const [jscode, setjscode] = useState('console.log("Hello from JS")');
  const [tab, settab] = useState("html");
  const [consoledata, setconsoledata] = useState([]);
  const [show, setconsole] = useState(false);
  const [showonlypreview, setshowpreview] = useState(false);
  const [projectTitle, setProjectTitle] = useState("Untitled Project");
  const [projectDescription, setProjectDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProject();
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data.type === "console") {
        setconsoledata((prev) => {
          const message = e.data.args.join(" ");
          return [...prev, message];
        });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (!id || loading) return;

    const timer = setTimeout(() => {
      handleSave(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [htmlcode, csscode, jscode]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`${API_URL}/api/code/${id}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const project = data.project;

        setProjectTitle(project.title);
        setProjectDescription(project.description || "");
        sethtmlcode(project.htmlCode || "<h1>Hello World!</h1>");
        setcsscode(project.cssCode || "h1{color:#00ff00}");
        setjscode(project.jsCode || 'console.log("Hello from JS")');
      } else if (response.status === 401) {
        navigate("/login");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (silent = false) => {
    if (!id) return;

    if (!silent) setSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/code/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          htmlCode: htmlcode,
          cssCode: csscode,
          jsCode: jscode,
        }),
      });

      if (!response.ok && response.status === 401) {
        navigate("/login");
      }
    } catch (error) {
    } finally {
      if (!silent) setSaving(false);
    }
  };

  const handleUpdateMetadata = async (title, description) => {
    if (!id) return;

    try {
      const response = await fetch(`${API_URL}/api/code/${id}/metadata`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setProjectTitle(title);
        setProjectDescription(description);
      }
    } catch (error) {}
  };

  const usercode = `<html>
    <head><style>${csscode}</style></head>
    <body>${htmlcode}
      <script>
        const _log=console.log
        console.log=(...a)=>{_log(...a);parent.postMessage({type:'console',args:a},'*')}
        try{${jscode}}catch(e){console.log('Error:',e.message)}
      </script>
    </body>
    </html>`;

  const value = tab === "html" ? htmlcode : tab === "css" ? csscode : jscode;

  const handleEditorChange = (newValue) => {
    if (tab === "html") sethtmlcode(newValue || "");
    else if (tab === "css") setcsscode(newValue || "");
    else setjscode(newValue || "");
  };

  const downloadZip = () => {
    const zip = new JSZip();
    zip.file("index.html", htmlcode);
    zip.file("style.css", csscode);
    zip.file("script.js", jscode);
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${projectTitle || "project"}.zip`);
    });
  };

  if (loading) {
    return (
      <div className="editor-loading">
        <div className="spinner"></div>
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <EditorSidebar
        theme={theme}
        toggleTheme={toggleTheme}
        showonlypreview={showonlypreview}
        setshowpreview={setshowpreview}
        downloadZip={downloadZip}
        onSave={() => handleSave(false)}
        saving={saving}
        projectTitle={projectTitle}
        projectDescription={projectDescription}
        onUpdateMetadata={handleUpdateMetadata}
        user={user}
      />
      <div className="main-content">
        {showonlypreview ? (
          <Output
            usercode={usercode}
            show={show}
            setconsole={setconsole}
            consoledata={consoledata}
            setconsoledata={setconsoledata}
          />
        ) : (
          <div className="main-magic">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel>
                <div className="user-magic">
                  <Selector tab={tab} settab={settab} />
                  <MonacoEditor
                    tab={tab}
                    value={value}
                    onChange={handleEditorChange}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <Output
                  usercode={usercode}
                  show={show}
                  setconsole={setconsole}
                  consoledata={consoledata}
                  setconsoledata={setconsoledata}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        )}
      </div>
    </div>
  );
}
