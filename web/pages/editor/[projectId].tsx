// web/pages/editor/[projectId].tsx (Modifikasi Utama)

// ... (Imports)
import { loginWithGitHub, handleGitHubCallback } from '../../lib/auth'; // Import handler
// ... (Imports lainnya)

// Data struktur untuk mode GitHub
interface RepoData {
    owner: string;
    repo: string;
    filePath: string;
    branch: string;
}

const EditorPage: React.FC = () => {
    // ... (State codes, logs, results)
    const [user, setUser] = useState<any>(null); // State untuk data user yang login
    const [mode, setMode] = useState<'paste' | 'repo'>('paste'); // Mode: Paste atau Repo
    const [repoData, setRepoData] = useState<RepoData>({ owner: '', repo: '', filePath: '', branch: 'main' });
    
    // ... (useEffect untuk menangani callback GitHub)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (code && !user) {
            handleGitHubCallback(code).then(loggedInUser => {
                if (loggedInUser) {
                    setUser(loggedInUser);
                    // Hapus code dari URL setelah login
                    window.history.replaceState({}, document.title, window.location.pathname); 
                }
            });
        }
    }, [user]);
    
    // ... (handleSolve function - MODIFIKASI DIPERLUKAN UNTUK MODE REPO)

    const handleSolve = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            if (mode === 'repo' && user?.githubAccessToken) {
                // Panggil ENDPOINT BARU untuk FIX REPO
                // FIXMATE HARUS MEMBUAT PULL REQUEST VIA API GATEWAY
                const repoPayload = {
                    ...repoData,
                    githubAccessToken: user.githubAccessToken,
                };
                // Endpoint baru yang perlu dibuat di Backend API Gateway: /fix/repo
                const response = await api.post('/fix/repo', repoPayload); 
                setResult(response.data); // Ini akan mengembalikan status PR
            } else {
                // Mode PASTE CODE (Logika yang sudah ada)
                const pastePayload = { /* ... raw_code, error_log, etc. ... */ };
                const response = await api.post('/fix', pastePayload); 
                setResult(response.data);
            }

        } catch (error) {
            // ... (error handling)
        } finally {
            setIsLoading(false);
        }
    };
    
    // ... (JSX return)
    
    return (
        <div className="min-h-screen bg-vscode-bg text-white font-sans p-4"> 
            {/* ... (Header dan Title) ... */}

            {/* Area Login GitHub */}
            <div className="flex justify-end mb-4">
                {user ? (
                    <span className="text-sm text-neon-blue flex items-center">
                        <img src={user.avatar} alt="Avatar" className="w-6 h-6 rounded-full mr-2" />
                        Logged in as **{user.username}**
                    </span>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={loginWithGitHub}
                        className="px-4 py-2 bg-vscode-accent text-white rounded-md font-bold text-sm"
                    >
                        Login with GitHub (For Apply Fix)
                    </motion.button>
                )}
            </div>

            {/* Toggle Mode */}
            <div className="flex mb-4 border border-vscode-border rounded-md w-full max-w-lg mx-auto">
                <button
                    onClick={() => setMode('paste')}
                    className={`flex-1 p-2 text-center transition-all ${mode === 'paste' ? 'bg-neon-blue text-white' : 'bg-vscode-panel text-gray-400'}`}
                >
                    1. Fix Code **(Paste Mode)**
                </button>
                <button
                    onClick={() => setMode('repo')}
                    disabled={!user} // Hanya aktif jika user login
                    className={`flex-1 p-2 text-center transition-all ${mode === 'repo' ? 'bg-neon-blue text-white' : 'bg-vscode-panel text-gray-400'} ${!user && 'opacity-50 cursor-not-allowed'}`}
                >
                    2. Apply Fix to **GitHub Repo**
                </button>
            </div>
            
            {/* Konten Bergantung Mode */}
            {mode === 'repo' ? (
                // Tampilan input untuk Repo
                <div className="bg-vscode-panel p-4 rounded-md h-[80vh] overflow-y-auto">
                    <h2 className="text-xl text-neon-blue mb-4">Apply Fix ke Repositori GitHub</h2>
                    {/* ... (Form input owner, repo, filePath) ... */}
                    <p className="text-red-400 mt-4">
                        *Fitur ini memerlukan Backend API Gateway Anda untuk menggunakan GitHub Access Token untuk membuat Pull Request. (Backend Anda harus menggunakan octokit atau sejenisnya).*
                    </p>
                </div>
            ) : (
                // Tampilan Editor 3 Panel (Sudah Anda buat)
                <div className="grid grid-cols-3 gap-3 h-[80vh]">
                   {/* ... (Editor Layout JSX Anda yang sudah ada) ... */}
                </div>
            )}
        </div>
    );
};
